import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil"
import { NutritionFacts } from "./NutritionFacts";
import { NutritionFactsContainerHiddenHeight } from "./NutritionFactsContainer";
import PortionView, { usePortionViewAnimationState } from './PortionView'
import {mealStateFromTimeInfo, TimeInfo, dashboardState, dateToString } from "./state"
import { MealState, convertAPIItemToDish, Portion } from './typeUtil';
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

    const auth = useRecoilValue(authAtom)
    const [mealState, setMealState] : [MealState,(MealState) => void]= useRecoilState(mealStateFromTimeInfo(timeInfo))
    
    const [modalOpen,setModalOpen] = useState<Portion>(null)
    const userActions = useUserActions()
    const [viewingPortions,setViewingPortions] = useState(false);
    const [noMeal,setNoMeal] = useState<{message: string}>(null);

    //Fetch meals 
    useEffect( ()=>{
        setNoMeal(null);
        async function fetchMeal(){
            const data = await userActions.mealsByTime(timeInfo)
            if(data.length == 0 ){
                setNoMeal({message:"No meals at this time!"})
            }else{
                const mealEvent = await userActions.mealById(data[0].id as number);
                // console.log({mealEvent})
                // debug purposes
                const dishes = mealEvent.items.map(convertAPIItemToDish)
                // console.log(dishes)
                const newState : MealState = {
                    recommendationA: dishes,
                    recommendationB: dishes,
                    recommendationC: dishes,
                    dishA: dishes[0],
                    dishB: dishes[0],
                    dishC: dishes[0],
                }
                setMealState(newState)
                
                //start onboarding
                start()
            }
        }
        if(mealState.dishA == null){
            try{
                fetchMeal()
            }catch(e){
                console.error(e)
            }
        }
    },[auth,currentState,timeInfo])
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
            console.log("Top Category:",mealState.dishA.category,)
            if(mealState?.dishA?.recommendation?.fillFraction){
                animateTopLeftSize(mealState.dishA.recommendation.fillFraction,{duration:400})
            }
        }else{
            animateTopLeftSize(0,{duration:100})
        }
        if(mealState?.dishB){
            setBottomCategory(mealState.dishB.category)
            if(mealState?.dishB?.recommendation?.fillFraction){
                animateBottomLeftSize(mealState.dishB.recommendation.fillFraction,{duration:400})
            }
        }else{
            animateBottomLeftSize(0,{duration: 100})
        }
        if(mealState?.dishC){
            setRightCategory(mealState.dishC.category)
            if(mealState?.dishC?.recommendation?.fillFraction){
                console.log(mealState?.dishC?.recommendation?.fillFraction)
                animateRightSize(mealState.dishC.recommendation.fillFraction,{duration:400})
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
            if(centralizeValue.current>0.5){                
                portionAnimationState.setRotation(portionViewRotation)
            }
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
                <ChangeMenuItem modalOpen = {modalOpen} setModalOpen = {setModalOpen} mealState = {mealState} setMealState = {setMealState} />
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