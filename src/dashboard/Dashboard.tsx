import { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil"
import { NutritionFactsContainerHiddenHeight } from "./NutritionFactsContainer";
import PortionView, { usePortionViewAnimationState } from './PortionView'
import { mealStateFromTimeInfo, TimeInfo, dashboardState, dateToString, stringToDate, getTimeInfoOfNow } from './state';
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
import { APIMealByTimePayload, APIMealSuggest, APIMealSuggestEntry } from '../utils/session/apiTypes';
import { NutritionFacts } from "./NutritionFacts";
import { SvgXml } from "react-native-svg";
import { usePersistentAtom } from "../utils/state/userState";
import { LoadingIcon } from '../utils/Loading';
import { useLogin } from '../utils/session/session';

const drag_icon_svg = `<svg width="59" height="55" viewBox="0 0 59 55" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30.5507 37.8757C30.5507 37.0086 30.5507 36.0361 30.5507 34.9885M36.8279 23.0265C36.8279 18.1153 36.8279 12.1876 36.8279 10.9268C36.8279 9.07077 35.5841 7.62695 33.6502 7.62695C31.7163 7.62695 30.5507 8.66962 30.5507 10.9268C30.5507 13.184 30.5507 26.6231 30.5507 34.9885M36.8279 23.0265C36.8279 26.1137 36.8279 28.1895 36.8279 30.3595C36.8279 28.3735 36.8279 24.933 36.8279 23.0265ZM36.8279 23.0265C36.8279 21.1015 38.3848 19.8985 40.1329 19.8985C41.881 19.8985 43.423 20.9182 43.423 23.0265C43.423 23.3621 43.423 22.9233 43.423 24.9285M43.423 24.9285C43.423 26.9336 43.423 29.7045 43.423 31.3678C43.423 31.3678 43.423 26.9336 43.423 24.9285ZM43.423 24.9285C43.423 22.9233 44.7462 21.8578 46.7326 21.8578C48.7191 21.8578 49.7002 23.6223 49.7201 25.0889C49.7263 25.5511 49.723 27.537 49.7201 27.9992M49.7201 32.3303C49.7241 31.1636 49.7198 29.1658 49.7201 27.9992M49.7201 27.9992C49.7201 26.4867 51.2272 25.3868 53.0459 25.3868C54.8646 25.3868 56.1959 26.8992 56.1959 28.2283C56.1959 29.5574 56.1959 36.9134 56.1959 39.0216C56.1959 43.834 53.014 48.3711 49.1731 50.5711C45.3323 52.771 44.04 53.0001 40.6967 53.0001C37.3534 53.0001 33.182 50.6477 31.4364 49.1503C29.6907 47.6529 21.2938 37.8759 20.3403 36.7759C19.0491 35.2864 19.2228 33.4302 19.4285 32.9261C19.6343 32.4219 20.1389 31.4708 21.0212 30.8521C21.9034 30.2333 22.6139 30.1762 23.5981 30.3595C24.5824 30.5428 28.551 33.5677 30.5507 34.9885" stroke="#F0ECEC" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.4326 14.0389H24.3532M24.3532 14.0389L21.2595 10.9453M24.3532 14.0389L21.2595 17.1326" stroke="#F0ECEC" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.056 9.61719L13.056 2.69663M13.056 2.69663L9.9624 5.79026M13.056 2.69663L16.1497 5.79026" stroke="#F0ECEC" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.04541 14.0392L2.12486 14.0392M2.12486 14.0392L5.21848 17.1328M2.12486 14.0392L5.21848 10.9456" stroke="#F0ECEC" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.0558 18.1406L13.0558 25.0612M13.0558 25.0612L16.1494 21.9676M13.0558 25.0612L9.96216 21.9676" stroke="#F0ECEC" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`

export const SHADOW_STYLE = {
    backgroundColor:"white",
    shadowColor:"black",
    shadowRadius:5,
    shadowOpacity:0.25,
    shadowOffset:{width:0,height:0},
}

function BaseButton(props){
    return <TouchableOpacity style = {{
        height: 50,
        width: '85%',
        borderRadius: 10,
        backgroundColor:"white",
        ...SHADOW_STYLE,
        alignItems:"center",
        justifyContent: "center",
        ...props.style
    }}
        onPress = { props.onPress}
    >
    
        {props.children}
    </TouchableOpacity>
}

function useMealFeatures({userActions,timeInfo,persistentState,auth,isFuture,onLoad}){
    const [mealState, setMealState] : [MealState,(MealState) => void]= useRecoilState(mealStateFromTimeInfo(timeInfo))
    const [loading,setLoading] = useState(false)
    const [noMeal,setNoMeal] = useState<{message: string}>(null);

    
    //Fetch meals 
    const setMealDishes = useCallback(
        async (newDishA:Dish,newDishB:Dish,newDishC:Dish)=>{
            if(mealState.dishA.id == newDishA.id && mealState.dishB.id === newDishB.id && mealState.dishC.id === newDishC.id){
                return;
            }else{
                const portions = await userActions.portionSuggestionByItemID(newDishA.id,newDishB.id,newDishC.id);
                console.log("Portions: " + {portions})
                const dishAPortion = getPortionInfoFromAPIPortionInfo(newDishA,portions.small1,Portion.A);
                const dishA= {...newDishA ,portion: dishAPortion}
                const dishBPortion = getPortionInfoFromAPIPortionInfo(newDishB,portions.small2,Portion.B);
                const dishB= {...newDishB ,portion: dishBPortion}
                const dishCPortion = getPortionInfoFromAPIPortionInfo(newDishC,portions.large,Portion.C);
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
                    // console.log({postResp})
                }catch(e){
                    // console.log(e)
                }
            }   
        },
        [mealState],
    )
    

    async function fetchMeal(){
        console.log("try fetching.")
        if(persistentState.loaded == false){ 
            console.log("Persistent state not loaded")    
            return
        }
        if(timeInfo?.date == null || timeInfo?.meal == null) return
        if(auth === null) return
        // console.log("Fetching meal!")
        setLoading(true)
        const data :APIMealByTimePayload = await userActions.mealsByTime(timeInfo)
        if(data.length == 0 ){
            // console.log("Nomeal")
            let message = "No meals at this time!";
            if(isFuture){
                message = "Menu coming soon..."
            }
            setNoMeal({message})
        }else{
            const mealID = data[0].id as number;
            console.log("MealID:",mealID)
            //TODONE make fetches concurrent
            // const mealEvent = await userActions.mealById(mealID);
            // const suggestion = await userActions.suggestionByMealId(mealID);
            // const prevChoices = await userActions.getAnalyticsMealChoices(mealID);

            const [mealEvent,suggestion,prevChoices] = await Promise.all([userActions.mealById(mealID),userActions.suggestionByMealId(mealID),userActions.getAnalyticsMealChoices(mealID)])
            // console.log({suggestion})
            // console.log({mealEvent,suggestion})
            // console.log({mealEvent})
            // debug purposes
            const dishes = mealEvent.items.map(convertAPIItemToDish)
            if(dishes.length === 0){
                setNoMeal({message:"Mo meals at this time!"})
                return;
            }
            console.log("Dishes: ",dishes.length)
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
            console.log("Suggestion:",suggestion)            
            const recommendationA = makeRecommendation(suggestion.small1)
            const recommendationB = makeRecommendation(suggestion.small2)
            const recommendationC = makeRecommendation(suggestion.large)

            if (recommendationA.length == 0 || recommendationB.length == 0 || recommendationC.length == 0 ){
                setNoMeal({message: "WePlate couldn't find any suggestions 😐"})
                return
                // throw new Error("Issue with suggestions!")
            } 

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
                // console.log({recentEntry, idsA: idsOfList(recommendationA),idsB: idsOfList(recommendationB), idsC: idsOfList(recommendationC)})
                dishA = getDishByIdFromList(recommendationA,recentEntry.small1)
                // recBIds = 
                dishB = getDishByIdFromList(recommendationB,recentEntry.small2)
                dishC = getDishByIdFromList(recommendationC,recentEntry.large)
            }
            
            if(dishA === null || dishB === null || dishC == null){
                // console.log("issue with prevEntries, failing gracefully")
                dishA = recommendationA[0]
                dishB = recommendationB[0]
                dishC = recommendationC[0] 
            }
            
            
            console.log("DISHA :",dishA)
            console.log("DISHB :",dishB)
            console.log("DISHC :",dishC)
            console.log(dishA?.portion,dishB?.portion,dishC?.portion)
            if(dishA?.portion === undefined || dishB?.portion === undefined || dishC?.portion === undefined){
                // console.log("FETCHING SIZES")
                // setMealDishes(dishA,dishB,dishC)
                const portions = await userActions.portionSuggestionByItemID(dishA.id,dishB.id,dishC.id);
                dishA.portion = getPortionInfoFromAPIPortionInfo(dishA, portions.small1,Portion.A);
                dishB.portion = getPortionInfoFromAPIPortionInfo(dishB,portions.small2,Portion.B);
                dishC.portion = getPortionInfoFromAPIPortionInfo(dishC,portions.large,Portion.C);
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
            setLoading(false)
            //start onboarding
            onLoad()
        }
    }

    useEffect(()=>{
        setLoading(false)
    },[timeInfo])
    useEffect( ()=>{
        setNoMeal(null);
        if(mealState.dishA == null && !loading){
            try{
                fetchMeal()
            }catch(e){
                console.error(e)
            }
        }else{
            onLoad()
        }
    },[auth,timeInfo,loading])

    return {mealState,loading,noMeal,setMealDishes}
}

const WalkableView = walkthroughable(View)
const WalkableTrayItem = walkthroughable(TrayItem)
const WalkableNutritionFacts = walkthroughable(NutritionFacts)
const Dashboard = (props)=>{
    const {route,navigation,copilotEvents} = props
    const auth = useRecoilValue(authAtom)
    useLogin(navigation)

    const {start} = props // Copilot: Start onboarding

    const [currentState,setCurrentState] = useRecoilState(dashboardState);
    useEffect(()=>{
        if(currentState.currentDate == null || currentState.currentMeal == null){
            const timeInfoNow = getTimeInfoOfNow()
            // console.log({timeInfoNow})
            setCurrentState({
                ...currentState,
                currentDate: stringToDate(timeInfoNow.date),
                currentMeal: timeInfoNow.meal,
            })
        }
    },[currentState])
    const {currentDate,currentMeal} = currentState
    const timeInfo = useMemo(()=>{
        const {currentDate,currentMeal} = currentState
        return route?.params?.timeInfo ?? { date: dateToString(currentDate), meal: currentMeal}
    },[route?.params,currentState])

    
    const [persistentState,setPersistentState,fetchPersistentState,dangerouslySetPersistentState] = usePersistentAtom() as any

    const doOnboarding :boolean = route?.params?.doOnboarding ?? persistentState.doOnboarding ?? false

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
    const [modalOpen,setModalOpen] = useState<Portion>(null)
    const [viewingPortions,setViewingPortions] = useState(false);

    const userActions = useUserActions()
    
    const onLoad = ()=>{
        // console.log({doOnboarding})
        if(doOnboarding){
            start()
        }
    }

    const {mealState,loading,noMeal,setMealDishes} = useMealFeatures({userActions,timeInfo,persistentState,auth, isFuture,onLoad})
    // const [mealState, setMealState] : [MealState,(MealState) => void]= useRecoilState(mealStateFromTimeInfo(timeInfo))
    // const [loading,setLoading] = useState(false)
    // const [noMeal,setNoMeal] = useState<{message: string}>(null);

    
    // //Fetch meals 
    // const setMealDishes = useCallback(
    //     async (newDishA:Dish,newDishB:Dish,newDishC:Dish)=>{
    //         if(mealState.dishA.id == newDishA.id && mealState.dishB.id === newDishB.id && mealState.dishC.id === newDishC.id){
    //             return;
    //         }else{
    //             const portions = await userActions.portionSuggestionByItemID(newDishA.id,newDishB.id,newDishC.id);
    //             console.log({portions})
    //             const dishAPortion = getPortionInfoFromAPIPortionInfo(newDishA,portions.small1,Portion.A);
    //             const dishA= {...newDishA ,portion: dishAPortion}
    //             const dishBPortion = getPortionInfoFromAPIPortionInfo(newDishB,portions.small2,Portion.B);
    //             const dishB= {...newDishB ,portion: dishBPortion}
    //             const dishCPortion = getPortionInfoFromAPIPortionInfo(newDishC,portions.large,Portion.C);
    //             const dishC = {...newDishC,portion: dishCPortion}
                
    //             const newMealState :MealState = {
    //                 ... mealState,
    //                 dishA,
    //                 dishB,
    //                 dishC,
    //             }
    //             setMealState(newMealState)

    //             try{
    //                 const postResp = await userActions.postAnalyticsMealChoices(newMealState)
    //                 // console.log({postResp})
    //             }catch(e){
    //                 // console.log(e)
    //             }
    //         }   
    //     },
    //     [mealState],
    // )
    

    // async function fetchMeal(){
    //     console.log("try fetching.")
    //     if(persistentState.loaded == false) return
    //     if(timeInfo?.date == null || timeInfo?.meal == null) return
    //     if(auth === null) return
    //     // console.log("Fetching meal!")
    //     setLoading(true)
    //     const data :APIMealByTimePayload = await userActions.mealsByTime(timeInfo)
    //     if(data.length == 0 ){
    //         // console.log("Nomeal")
    //         let message = "No meals at this time!";
    //         if(isFuture){
    //             message = "Menu coming soon..."
    //         }
    //         setNoMeal({message})
    //     }else{
    //         const mealID = data[0].id as number;
    //         console.log("MealID:",mealID)
    //         //TODONE make fetches concurrent
    //         // const mealEvent = await userActions.mealById(mealID);
    //         // const suggestion = await userActions.suggestionByMealId(mealID);
    //         // const prevChoices = await userActions.getAnalyticsMealChoices(mealID);

    //         const [mealEvent,suggestion,prevChoices] = await Promise.all([userActions.mealById(mealID),userActions.suggestionByMealId(mealID),userActions.getAnalyticsMealChoices(mealID)])
    //         // console.log({suggestion})
    //         // console.log({mealEvent,suggestion})
    //         // console.log({mealEvent})
    //         // debug purposes
    //         const dishes = mealEvent.items.map(convertAPIItemToDish)
    //         if(dishes.length === 0){
    //             setNoMeal({message:"Mo meals at this time!"})
    //             return;
    //         }
    //         console.log("Dishes: ",dishes.length)
    //         function getDishByIdFromList(list:Dish[],id:number){
    //             const dish = list.filter(dish=> dish.id === id)
    //             if(dish.length === 1){
    //                 return dish[0]
    //             }else{
    //                 return null;
    //             }
    //         }
    //         function getDishById(id:number) {
    //             return getDishByIdFromList(dishes,id)
    //         }
    //         function idsOfList(list:Dish[]){
    //             return list.map(dish=> dish.id)
    //         }
    //         function makeRecommendationList(items:Array<number>,category:FOOD_CATEGORY){
    //             // console.log({category})
    //             const list = items.map(getDishById).filter(dish=> dish !== null)
    //             let ids = []
    //             let norepList = [] as Array<Dish>
    //             list.forEach((_dish:Dish)=>{
    //                 const dish = JSON.parse(JSON.stringify(_dish))
    //                 if(!ids.includes(dish.id)){
    //                     dish.category = category
    //                     norepList.push(dish)
    //                     ids.push(dish.id)
    //                 }
    //             })
    //             // console.log({norepList})
    //             return norepList
    //         }
    //         function makeRecommendation(entry: APIMealSuggestEntry){
    //             // console.log({entryCategory: entry.category})
    //             return makeRecommendationList(entry.items as Array<number>,FoodCategoryFromAPIFoodCategory(entry.category))
    //         }
    //         console.log("Suggestion:",suggestion)            
    //         const recommendationA = makeRecommendation(suggestion.small1)
    //         const recommendationB = makeRecommendation(suggestion.small2)
    //         const recommendationC = makeRecommendation(suggestion.large)

    //         if (recommendationA.length == 0 || recommendationB.length == 0 || recommendationC.length == 0 ){
    //             setNoMeal({message: "WePlate couldn't find any suggestions 😐"})
    //             return
    //             // throw new Error("Issue with suggestions!")
    //         } 

    //         // get lateset
    //         let dishA = null;
    //         let dishB = null;
    //         let dishC = null;

    //         if(prevChoices.length == 0){
    //             // if no choice has been made yet, default to first
    //             dishA = recommendationA[0]
    //             dishB = recommendationB[0]
    //             dishC = recommendationC[0]
    //         }else{
    //             const recentEntry = prevChoices[0]
    //             // console.log({recentEntry, idsA: idsOfList(recommendationA),idsB: idsOfList(recommendationB), idsC: idsOfList(recommendationC)})
    //             dishA = getDishByIdFromList(recommendationA,recentEntry.small1)
    //             // recBIds = 
    //             dishB = getDishByIdFromList(recommendationB,recentEntry.small2)
    //             dishC = getDishByIdFromList(recommendationC,recentEntry.large)
    //         }
            
    //         if(dishA === null || dishB === null || dishC == null){
    //             // console.log("issue with prevEntries, failing gracefully")
    //             dishA = recommendationA[0]
    //             dishB = recommendationB[0]
    //             dishC = recommendationC[0] 
    //         }
            
            
    //         console.log("DISHA :",dishA)
    //         console.log("DISHB :",dishB)
    //         console.log("DISHC :",dishC)
    //         console.log(dishA?.portion,dishB?.portion,dishC?.portion)
    //         if(dishA?.portion === undefined || dishB?.portion === undefined || dishC?.portion === undefined){
    //             // console.log("FETCHING SIZES")
    //             // setMealDishes(dishA,dishB,dishC)
    //             const portions = await userActions.portionSuggestionByItemID(dishA.id,dishB.id,dishC.id);
    //             dishA.portion = getPortionInfoFromAPIPortionInfo(dishA, portions.small1,Portion.A);
    //             dishB.portion = getPortionInfoFromAPIPortionInfo(dishB,portions.small2,Portion.B);
    //             dishC.portion = getPortionInfoFromAPIPortionInfo(dishC,portions.large,Portion.C);
    //         }
            
    //         // console.log(dishes)
    //         const newState : MealState = {
    //             mealID: mealEvent.id,
    //             recommendationA,
    //             recommendationB,
    //             recommendationC,
    //             dishA,
    //             dishB,
    //             dishC,
    //         }
    //         // console.log({newState})
    //         setMealState(newState)
    //         setLoading(false)
    //         //start onboarding
    //         onLoad()
    //     }
    // }

    // useEffect(()=>{
    //     setLoading(false)
    // },[timeInfo])
    // useEffect( ()=>{
    //     setNoMeal(null);
    //     if(mealState.dishA == null && !loading){
    //         try{
    //             fetchMeal()
    //         }catch(e){
    //             console.error(e)
    //         }
    //     }else{
    //         onLoad()
    //     }
    // },[auth,timeInfo,loading])

    // copilot events
    // const [currentStepName,setCurrentStepName] = useState(null);
    // copilotEvents.on("stepChange",(arg)=>{
    //     const name = arg?.name
    //     if(name){
    //         if(name != currentStepName) setCurrentStepName(name)
    //     }
    // })
    // const [stopped,setStopped] = useState(false);
    useEffect(()=>{
        const onStop = ()=>{
            console.log("Finished")
            setPersistentState({
                ...persistentState,
                doOnboarding: false,
            })
        }
        copilotEvents.on("stop",onStop)
        return ()=>{
            copilotEvents.off("stop",onStop)
        }
    },[])
   

    //portion view animate
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
        const BASE_FILL_FRACTION = 0.5;
        if(mealState?.dishA){
            setTopCategory(mealState.dishA.category)
            // console.log("Top Category:",mealState.dishA)
            const fillFraction = mealState?.dishA?.portion?.fillFraction?? BASE_FILL_FRACTION
            animateTopLeftSize(fillFraction,{duration:400})
        }else{
            animateTopLeftSize(0,{duration:100})
        }
        if(mealState?.dishB){
            // console.log("Bottom Category:",mealState.dishB.category,)
            setBottomCategory(mealState.dishB.category)
            const fillFraction = mealState?.dishB?.portion?.fillFraction?? BASE_FILL_FRACTION
            animateBottomLeftSize(fillFraction,{duration:400})
        }else{
            animateBottomLeftSize(0,{duration: 100})
        }
        if(mealState?.dishC){
            // console.log("Right Category:",mealState.dishC.category,)
            setRightCategory(mealState.dishC.category)
            const fillFraction = mealState?.dishC?.portion?.fillFraction?? BASE_FILL_FRACTION
            animateRightSize(fillFraction,{duration:400})
        }else{
            animateRightSize(0,{duration:100})
        }
    },[mealState])

    function onPortionViewPress(){
        // console.log(viewingPortions)
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
            <Text style = {{
                fontSize:20, color : "#606060"
            }}>
                {noMeal.message}    
            </Text> 
            <BaseButton style = {{
                    marginTop:20,
                    width: "100%",
                    paddingLeft:50,
                    paddingRight:50,
                }}
                onPress = {()=>{
                    navigation.navigate("SidebarNavigable",{screen: "Dashboard"})
                }}>
                <Text style ={{
                        fontSize: 20,
                        color: "#CE014E",
                    }}>
                        Return to present
                </Text> 
            </BaseButton>
         </View>
    }else if (loading){
        content = <>
            <View style = {{height: 20}}/>
            <LoadingIcon/>   
        </>
    }else{
        const disableButtons = isPast;

        content = <> 
            <View style = {{height: 20}}/>
            
            <CopilotStep text = "If our default suggestion isn’t to your liking, you can easily switch options here!" 
                order = {2} name = "test:2">
                <WalkableView>
                    <TrayItem disabled = {disableButtons} isTop number = {1} dish = {mealState.dishA} portion = {Portion.A} modalOpen = {setModalOpen}/>
                </WalkableView>
            </CopilotStep>
            <TrayItem disabled = {disableButtons} number = {2}  dish = {mealState.dishB} portion = {Portion.B} modalOpen = {setModalOpen} />
            <TrayItem disabled = {disableButtons} number = {3}  dish = {mealState.dishC} portion = {Portion.C} modalOpen = {setModalOpen}/>
            <CopilotStep text = {`At every meal, WePlate generates foods which are tailored for your needs and preferences.
                            Note: in addition to following our recommendations, use your best judgement when choosing foods.`} 
                order = {0} name = "test:1">
                <WalkableView style = {{width:"100%"}}/>
            </CopilotStep>
        </> 
    }

    return <View style={{ 
             alignItems: 'center' ,backgroundColor: 'white',
             height:"100%",
        }}>
        <Modal transparent visible = {!!modalOpen} animationType = "fade" >
            <View style = {{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                alignItems: 'stretch',
                // justifyContent: 'center'
            }}>
                <ChangeMenuItem modalOpen = {modalOpen} setModalOpen = {setModalOpen} mealState = {mealState} setMealDishes = {setMealDishes}/>
            </View>
        </Modal> 
        {content}
        { !! noMeal && <View style = {{height: 800}}/> //  weird hack to put the portion view offscreen
        }
        <View>
            <PortionView style = {{ marginTop:10}} animationState = {portionAnimationState}/>
        </View>
        { !! noMeal || 
        <CopilotStep text = {"When you’re satisfied with your intake, generate portions and visualize what you need to eat!"}
            order = {4} name = "test:4">
            <WalkableView style = {{
                width: "100%",
                alignItems: "center",
                justifyContent:"center",
            }}>
                <BaseButton onPress = {onPortionViewPress}>
                    <Text style ={{
                        fontSize: 20,
                        color: "#CE014E",
                    }}>
                            {viewingPortions ? "Hide Portions" : "View Portions"}
                    </Text> 
                </BaseButton>
                {/* <View style = {{height: 20}}/> */}
            </WalkableView>
        </CopilotStep>
        }
        <CopilotStep text = {"After you are satisfied with your food selections, you can view the nutritional information of your meal based on its optimal combination!"} 
            order = {3} name = "test:3">
                <WalkableView style = {{
                    width:"100%",
                    // backgroundColor: "orange",
                    height: NutritionFactsContainerHiddenHeight,
                    marginTop:"auto",
                    justifySelf: "flex-end"
                }}>
            </WalkableView>
        </CopilotStep>
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