import { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil"
import { NutritionFacts } from "./NutritionFacts";
import { NutritionFactsContainerHiddenHeight } from "./NutritionFactsContainer";
import PortionView, { usePortionViewAnimationState } from './PortionView'
import { mealStateFromTimeInfo, TimeInfo, dashboardState, dateToString, stringToDate } from './state';
import { MealState, convertAPIItemToDish, Portion, getPortionInfoFromAPIPortionInfo, Dish, FOOD_CATEGORY, FoodCategoryFromAPIFoodCategory, getMealsIndex, getDishByPortion } from './typeUtil';
import { copilot,walkthroughable,CopilotStep } from "react-native-copilot"
import TrayItem from "./TrayItem"

import {
Vector3,
Quaternion,
} from 'three'


import { useUserActions } from "../utils/session/useUserActions"
import { authAtom } from "../utils/session/useFetchWrapper"
import ChangeMenuItem from "./ChangeMenuItem"
import Tooltip from "./tooltip/components/Tooltip";
import { APIMealSuggest, APIMealSuggestEntry } from '../utils/session/apiTypes';

export const SHADOW_STYLE = {
    backgroundColor:"white",
    shadowColor:"black",
    shadowRadius:5,
    shadowOpacity:0.25,
    shadowOffset:{width:0,height:0},
}

const WalkableView = walkthroughable(View)
const Dashboard = (props)=>{
    const {start} = props // Copilot: Start onboarding

    const {route,navigation} = props
    const currentState = useRecoilValue(dashboardState);
    const {currentDate,currentMeal} = currentState
    const timeInfo : TimeInfo = route?.params?.timeInfo ?? { date: dateToString(currentDate), meal: currentMeal}
    
    let isPresent = false
    let isPast = false
    let isFuture = false
    
    if(currentDate > stringToDate(timeInfo.date)){
        isPast = true;
    }else if(currentDate < stringToDate(timeInfo.date)){
        isFuture = true;
    }else if(dateToString(currentDate) === timeInfo.date){
        const difference = getMealsIndex(currentMeal) - getMealsIndex(timeInfo.meal)
        if(difference>0){
            isPast = true;
        }else if(difference< 0 ){
            isFuture = true;
        }else if(difference == 0){
            isPresent = true;
        }
    }

    // if(isPresent){
    //     console.log("IS PRESENT")
    // }
    // if(isPast){
    //     console.log("IS PAST")
    // }
    // if(isFuture){
    //     console.log("IS Future")
    // }

    const auth = useRecoilValue(authAtom)
    const [mealState, setMealState] : [MealState,(MealState) => void]= useRecoilState(mealStateFromTimeInfo(timeInfo))
    
    const [modalOpen,setModalOpen] = useState<Portion>(null)
    const userActions = useUserActions()
    const [viewingPortions,setViewingPortions] = useState(false);
    const [noMeal,setNoMeal] = useState<{message: string}>(null);


    const onLoad = ()=>{
        // start()
    }
    //Fetch meals 
    const setMealDishes = useCallback(
        async (newDishA:Dish,newDishB:Dish,newDishC:Dish)=>{
            if(mealState.dishA.id == newDishA.id && mealState.dishB.id === newDishB.id && mealState.dishC.id === newDishC.id){
                return;
            }else{
                const portions = await userActions.portionSuggestionByItemID(newDishA.id,newDishB.id,newDishC.id);
                // console.log({portions})
                const dishAPortion = getPortionInfoFromAPIPortionInfo(portions.small1,Portion.A);
                const dishA= {...newDishA ,portion: dishAPortion}
                const dishBPortion = getPortionInfoFromAPIPortionInfo(portions.small2,Portion.B);
                const dishB= {...newDishB ,portion: dishBPortion}
                const dishCPortion = getPortionInfoFromAPIPortionInfo(portions.large,Portion.C);
                const dishC = {...newDishC,portion: dishCPortion}
                
                const newMealState :MealState = {
                    ... mealState,
                    dishA,
                    dishB,
                    dishC,
                }
                setMealState(newMealState)

                try{
                    const postResp = await userActions.postAnalyticsMealChoices(newMealState)
                    console.log({postResp})
                }catch(e){
                    console.log(e)
                }
            }   
        },
        [mealState],
    )
     
    async function fetchMeal(){
        const data = await userActions.mealsByTime(timeInfo)
        if(data.length == 0 ){
            console.log("Nomeal")
            setNoMeal({message:"No meals at this time!"})
        }else{
            const mealID = data[0].id as number;

            //TODONE make fetches concurrent
            // const mealEvent = await userActions.mealById(mealID);
            // const suggestion = await userActions.suggestionByMealId(mealID);
            // const prevChoices = await userActions.getAnalyticsMealChoices(mealID);

            const [mealEvent,suggestion,prevChoices] = await Promise.all([userActions.mealById(mealID),userActions.suggestionByMealId(mealID),userActions.getAnalyticsMealChoices(mealID)])
            console.log({suggestion})
            // console.log({mealEvent,suggestion})
            // console.log({mealEvent})
            // debug purposes
            const dishes = mealEvent.items.map(convertAPIItemToDish)
            function getDishByIdFromList(list:Dish[],id:number){
                const dish = list.filter(dish=> dish.id === id)
                if(dish.length === 1){
                    return dish[0]
                }else{
                    return null;
                }
            }
            function getDishById(id:number) {
                return getDishByIdFromList(dishes,id)
            }
            function idsOfList(list:Dish[]){
                return list.map(dish=> dish.id)
            }
            function makeRecommendationList(items:Array<number>,category:FOOD_CATEGORY){
                // console.log({category})
                const list = items.map(getDishById).filter(dish=> dish !== null)
                let ids = []
                let norepList = [] as Array<Dish>
                list.forEach((_dish:Dish)=>{
                    const dish = JSON.parse(JSON.stringify(_dish))
                    if(!ids.includes(dish.id)){
                        dish.category = category
                        norepList.push(dish)
                        ids.push(dish.id)
                    }
                })
                // console.log({norepList})
                return norepList
            }
            function makeRecommendation(entry: APIMealSuggestEntry){
                // console.log({entryCategory: entry.category})
                return makeRecommendationList(entry.items as Array<number>,FoodCategoryFromAPIFoodCategory(entry.category))
            }
            const recommendationA = makeRecommendation(suggestion.small1)
            const recommendationB = makeRecommendation(suggestion.small2)
            const recommendationC = makeRecommendation(suggestion.large)

            if (recommendationA.length == 0 || recommendationB.length == 0 || recommendationC.length == 0 ) throw new Error("Issue with suggestions!")

            // get lateset
            let dishA = null;
            let dishB = null;
            let dishC = null;

            if(prevChoices.length == 0){
                // if no choice has been made yet, default to first
                dishA = recommendationA[0]
                dishB = recommendationB[0]
                dishC = recommendationC[0]
            }else{
                const recentEntry = prevChoices[0]
                console.log({recentEntry, idsA: idsOfList(recommendationA),idsB: idsOfList(recommendationB), idsC: idsOfList(recommendationC)})
                dishA = getDishByIdFromList(recommendationA,recentEntry.small1)
                // recBIds = 
                dishB = getDishByIdFromList(recommendationB,recentEntry.small2)
                dishC = getDishByIdFromList(recommendationC,recentEntry.large)
            }
            console.log("DISHA :",dishA)
            console.log("DISHB :",dishB)
            console.log("DISHC :",dishC)

            if(dishA === null || dishB === null || dishC == null){
                console.log("issue with prevEntries, failing gracefully")
                dishA = recommendationA[0]
                dishB = recommendationB[0]
                dishC = recommendationC[0] 
            }

           

            if(dishA?.portion === null || dishB?.portion === null || dishC?.portion === null){
                const portions = await userActions.portionSuggestionByItemID(dishA.id,dishB.id,dishC.id);
                dishA.portion = getPortionInfoFromAPIPortionInfo(portions.small1,Portion.A);
                dishB.portion = getPortionInfoFromAPIPortionInfo(portions.small2,Portion.B);
                dishC.portion = getPortionInfoFromAPIPortionInfo(portions.large,Portion.C);
            }
            
            // console.log(dishes)
            const newState : MealState = {
                mealID: mealEvent.id,
                recommendationA,
                recommendationB,
                recommendationC,
                dishA,
                dishB,
                dishC,
            }
            // console.log({newState})
            setMealState(newState)
            
            //start onboarding
            onLoad()
        }
    }
    useEffect( ()=>{
        setNoMeal(null);
        if(mealState.dishA == null){
            try{
                fetchMeal()
            }catch(e){
                console.error(e)
            }
        }
    },[auth,currentState])
    const portionAnimationState = usePortionViewAnimationState();
    const {
        DEFAULT_TRANSFORM,
        initialRotation,
        rotation,
        rightTrackedAnimation,
        topTrackedAnimation,
        bottomTrackedAnimation,
        centralizeTrackedAnimation,
        resetRotation,
        doesInactivityTimer,
        topCategory,
        setTopCategory,
        setBottomCategory,
        setRightCategory,
    } = portionAnimationState;

    const [animateRightSize,rightSizeValue,rightSizeTarg] = rightTrackedAnimation as any
    const [animateTopLeftSize,topLeftSizeValue,topLeftSizeTarg] = topTrackedAnimation as any
    const [animateBottomLeftSize,bottomLeftSizeValue,bottomLeftSizeTarg] = bottomTrackedAnimation as any
    const [animateCentralize,centralizeValue,centralizeTarg] = centralizeTrackedAnimation as any

    //Update portionview state
    useEffect(()=>{
        if(mealState?.dishA){
            setTopCategory(mealState.dishA.category)
            // console.log("Top Category:",mealState.dishA)
            if(mealState?.dishA?.portion?.fillFraction){
                animateTopLeftSize(mealState.dishA.portion.fillFraction,{duration:400})
            }
        }else{
            animateTopLeftSize(0,{duration:100})
        }
        if(mealState?.dishB){
            // console.log("Bottom Category:",mealState.dishB.category,)
            setBottomCategory(mealState.dishB.category)
            if(mealState?.dishB?.portion?.fillFraction){
                animateBottomLeftSize(mealState.dishB.portion.fillFraction,{duration:400})
            }
        }else{
            animateBottomLeftSize(0,{duration: 100})
        }
        if(mealState?.dishC){
            // console.log("Right Category:",mealState.dishC.category,)
            setRightCategory(mealState.dishC.category)
            if(mealState?.dishC?.portion?.fillFraction){
                animateRightSize(mealState.dishC.portion.fillFraction,{duration:400})
            }
        }else{
            animateRightSize(0,{duration:100})
        }
    },[mealState])

    function onPortionViewPress(){
        console.log(viewingPortions)
        if(viewingPortions){
            animateCentralize(1,{duration:900})
            portionAnimationState.doesInactivityTimer.current = true
            setViewingPortions(false);
        }else{
            animateCentralize(0,{duration:900})
            const portionViewRotation = new Quaternion().setFromAxisAngle(new Vector3(1,0,0),Math.PI*0.25);
            // if(centralizeValue.current>0.5){                
                portionAnimationState.setRotation(portionViewRotation)
            // }
            portionAnimationState.doesInactivityTimer.current = false
            setViewingPortions(true);
        }
    }

    let content = <></>
    if(noMeal){
        content = <View style = {{
            height: 300,
            alignItems:"center",
            justifyContent:"center",
        }}>
            <Text>
                {noMeal.message}    
            </Text> 
         </View>
    }else{
        content = <> 
            <View style = {{height: 20}}/>
            <CopilotStep text = "The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start." 
                order = {2} name = "test:2">
                <WalkableView style = {{width:"100%"}}/>
            </CopilotStep>
                <TrayItem isTop number = {1} dish = {mealState.dishA} portion = {Portion.A} modalOpen = {setModalOpen}/>
                <TrayItem number = {2}  dish = {mealState.dishB} portion = {Portion.B} modalOpen = {setModalOpen} />
                <TrayItem number = {3}  dish = {mealState.dishC} portion = {Portion.C} modalOpen = {setModalOpen}/>
            <CopilotStep text = "Alex is cringe." 
                order = {0} name = "test:1">
                <WalkableView style = {{width:"100%"}}/>
            </CopilotStep>
        </> 
    }

    return <View style={{ flex: 1, alignItems: 'center' ,backgroundColor: 'white'}}>
        <Modal transparent visible = {!!modalOpen} animationType = "fade" >
            <View style = {{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                alignItems: 'stretch',
                // justifyContent: 'center'
            }}>
                <ChangeMenuItem modalOpen = {modalOpen} setModalOpen = {setModalOpen} mealState = {mealState} setMealState = {setMealState} setMealDishes = {setMealDishes}/>
            </View>
        </Modal> 
        {content}
        { !! noMeal && <View style = {{height: 800}}/> //  weird hack to put the portion view offscreen
        }
        <PortionView style = {{ marginTop:10}} animationState = {portionAnimationState}/>
        { !! noMeal || <>
            <TouchableOpacity style = {{
                height: 50,
                width: '85%',
                borderRadius: 10,
                backgroundColor:"white",
                ...SHADOW_STYLE,
                alignItems:"center",
                justifyContent: "center"
            }}
                onPress = { onPortionViewPress}
            >
                <Text style ={{
                    fontSize: 20,
                    color: "#CE014E",
                }}>
                    {viewingPortions ? "Hide Portions" : "View portions"}
                </Text>
            </TouchableOpacity>
            <View style = {{height: NutritionFactsContainerHiddenHeight + 20}}/>
        </>
        }   
        <NutritionFacts disabled = {!!noMeal} mealState = {mealState}/>
    </View>
}

const stepNumberComponent = (props)=> <></>
export default copilot({
    animated:true,
    overlay:"svg",
    tooltipComponent: Tooltip,
    stepNumberComponent

})(Dashboard)