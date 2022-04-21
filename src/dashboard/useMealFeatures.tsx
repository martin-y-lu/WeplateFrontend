import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useRecoilState, useRecoilValue } from "recoil"
import { useUserActions } from '../utils/session/useUserActions';
import { TimeInfo, dashboardStateAtom, dateToString, stringToDate, getTimeInfoOfNow, useMealStateUtils, mealStateSelector } from './state';
import { MealState, convertAPIItemToDish, Portion, getPortionInfoFromAPIPortionInfo, Dish, FOOD_CATEGORY, FoodCategoryFromAPIFoodCategory, getMealsIndex, getDishesByPortion, getFoodCategoryDescription, PlateType, fullVolumeByPortion, volumesByPlateType } from './typeUtil';
import { authAtom } from "../utils/session/useFetchWrapper"
import ChangeMenuItem from "./ChangeMenuItem"
import Tooltip from "./tooltip/components/Tooltip";
import { APIMealByTimePayload, APIMealSuggest, APIMealSuggestEntry, APIPortionSuggest, APIKey, APIPortionSuggestEntry } from '../utils/session/apiTypes';
import { NutritionFacts } from "./NutritionFacts";
import { SvgXml } from "react-native-svg";
import { usePersistentAtom } from "../utils/state/userState";
import { LoadingIcon } from '../utils/Loading';
import { useLogin } from '../utils/session/session';
import { useDesignScheme } from '../design/designScheme';
import { TEST } from '../../App';


export function useMealFeatures({timeInfo,onLoad, doFetchMeal}){
    const userActions = useUserActions()
    const auth = useRecoilValue(authAtom)
    const [persistentState,setPersistentState,fetchPersistentState,dangerouslySetPersistentState] = usePersistentAtom() as any
    let {plateType} = persistentState
    plateType = plateType ?? PlateType.WePlate
    const {getMealState} = useMealStateUtils()

    const [mealState, setMealState] : [MealState,(mealState: MealState) => void]= getMealState(timeInfo)
    const [loadingMealState,setLoadingMealState] = useState(false)
    const clearedLoadingPortions = {
        [PlateType.WePlate]: false,
        [PlateType.Normal]: false,
    }
    const [loadingPortions, setLoadingPortions] = useState(clearedLoadingPortions)
    const [noMeal,setNoMeal] = useState<{message: string}>(null);

    const [currentState,setCurrentState] = useRecoilState(dashboardStateAtom);
    const {currentDate,currentMeal} = currentState
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
    
    //Fetch meals
    const setMealDishes = useCallback(
        async (newDishA:Dish[],newDishB:Dish[],newDishC:Dish[], plateType: PlateType)=>{
            // if(mealState.dishA.id == newDishA.id && mealState.dishB.id === newDishB.id && mealState.dishC.id === newDishC.id){
            //     return;
            // }else{
                // const portions = await userActions.portionSuggestionByItemID(newDishA.id,newDishB.id,newDishC.id,volumesByPlateType(plateType));
                // console.log("Portions: " + {portions})
                // const dishAPortion = getPortionInfoFromAPIPortionInfo(newDishA,portions.small1,Portion.A,plateType);
                // const dishA= {...newDishA ,portion: { ...newDishA.portion , [plateType]: dishAPortion}}
                // const dishBPortion = getPortionInfoFromAPIPortionInfo(newDishB,portions.small2,Portion.B,plateType);
                // const dishB= {...newDishB ,portion: { ...newDishB.portion , [plateType]: dishBPortion}}
                // const dishCPortion = getPortionInfoFromAPIPortionInfo(newDishC,portions.large,Portion.C,plateType);
                // const dishC = {...newDishC,portion:{ ...newDishC.portion , [plateType]: dishCPortion} }
                
                // const newMealState :MealState = {
                //     ... mealState,
                //     dishA,
                //     dishB,
                //     dishC,
                // }
                // setMealState(newMealState)
                // const newMealState = await fetchPortionSizes(plateType,)
                const newMealState :MealState = {
                    ... mealState,
                    dishA:newDishA,
                    dishB:newDishB,
                    dishC:newDishC,
                }
                setMealState(newMealState)
                const _newMealState = await fetchPortionSizes(plateType,true,newMealState)

                try{
                    const postResp = await userActions.postAnalyticsMealChoices(_newMealState)
                    // console.log({postResp})
                }catch(e){
                    // console.log(e)
                }
            // }   
        },
        [mealState],
    )
    async function fetchMeal(){
        console.log("try fetching.")
        try{
            if(persistentState.loaded == false){ 
                console.log("Persistent state not loaded")    
                return
            }
            if(timeInfo?.date == null || timeInfo?.meal == null) return
            if(auth === null) return
            // console.log("Fetching meal!")
            setLoadingMealState(true)
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
                const mealEvent = await userActions.mealById(mealID);
                const dishes = mealEvent.items.map(convertAPIItemToDish)
                if(dishes.length === 0){
                    setNoMeal({message:"Mo meals at this time!"})
                    return;
                }
                let newState : MealState = {
                    time: timeInfo,
                    mealID: mealEvent.id,
                    menu: {
                        dishes
                    },
                }
                if(doFetchMeal){
                    const [suggestion,prevChoices,nutritional] = await Promise.all([userActions.suggestionByMealId(mealID,volumesByPlateType(plateType)),userActions.getAnalyticsMealChoices(mealID),userActions.getNutritionalRequirements()])
                    console.log({nutritional})
                    newState.nutritionRequirements = nutritional
                    // console.log({suggestion})
                    // console.log({mealEvent,suggestion})
                    // console.log({mealEvent})
                    // debug purposes
                    
                    console.log("Dishes: ",dishes.length)
                    function getDishByIdFromList(list:Dish[],id:APIKey){
                        const dish = list.filter(dish=> dish.id === id)
                        if(dish.length === 1){
                            return dish[0]
                        }else{
                            return null;
                        }
                    }
                    function getDishById(id:APIKey) {
                        return getDishByIdFromList(dishes,id)
                    }
                    function idsOfList(list:Dish[]){
                        return list.map(dish=> dish.id)
                    }
                    function makeRecommendationList(items:Array<APIKey>,category:FOOD_CATEGORY){
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
                        if(!entry) return []
                        // console.log({entryCategory: entry.category})
                        return makeRecommendationList(entry.items as Array<number>,FoodCategoryFromAPIFoodCategory(entry.category))
                    }
                    console.log("Suggestion:",suggestion)    
                    // if(suggestion == null){
                    //     if(mealEvent.id == mealState.mealID){
                    //         setNoMeal({message: "WePlate couldn't find any suggestions 😐"})
                    //     }
                    //     console.log("Set no meal!")
                    //     return 
                    // }        
                    const recommendationA = makeRecommendation(suggestion?.small1)
                    const recommendationB = makeRecommendation(suggestion?.small2)
                    const recommendationC = makeRecommendation(suggestion?.large)
                    console.log({recommendationA,recommendationB,recommendationC})
                    if (recommendationA.length == 0 || recommendationB.length == 0 || recommendationC.length == 0 ){
                        if(mealEvent.id == mealState.mealID){
                            setNoMeal({message: "WePlate couldn't find any suggestions 😐"})
                        }
                        console.log("Set no meal!")
                        return
                        // throw new Error("Issue with suggestions!")
                    } 

                    // get lateset
                    let dishA = null as Dish;
                    let dishB = null as Dish;
                    let dishC = null as Dish;

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
                    if(dishA?.portion === undefined){
                        dishA.portion = {}
                    } 
                    if(dishB?.portion === undefined){
                        dishB.portion = {}
                    }
                    if( dishC?.portion === undefined){
                        // console.log("FETCHING SIZES")
                        // setMealDishes(dishA,dishB,dishC)
                        dishC.portion = {}
                    }
                    
                    // console.log(dishes)
                
                    newState = {
                        ...newState,
                        recommendationA,
                        recommendationB,
                        recommendationC,
                        dishA:[dishA],
                        dishB:[dishB],
                        dishC:[dishC],
                    }
                }
                // console.log({newState})
                setMealState(newState)
                setLoadingMealState(false)
                //start onboarding
                onLoad()
            }
        }catch(e){
            if(TEST){
                setNoMeal({message: JSON.stringify(e)})
            }
        }
    }
    function allDishesPortioned(dishes: Dish[]): boolean {
        if( ! dishes) return false;
        for(const dish of dishes){
            if( ! dish?.portion?.[plateType]){
                return false
            }
        }
        return true
    }
    async function fetchPortionSizes(plateType: PlateType, override : boolean = false, _mealState: MealState = null):Promise<MealState>{
        const {dishA,dishB,dishC} = _mealState ?? mealState;


        const dAp = allDishesPortioned(dishA);
        const dBp = allDishesPortioned(dishB);
        const dCp = allDishesPortioned(dishC);
        // const dAp = dishA?.portion?.[plateType];
        // const dBp = dishA?.portion?.[plateType];
        // const dCp = dishA?.portion?.[plateType];

        if(dishA && dishB && dishC && ( !dAp || !dBp  || !dCp  || override) &&  loadingPortions[plateType] === false){
            setLoadingPortions({
                ...loadingPortions,
                [plateType]: true
            })
            console.log({dAp,dBp,dCp})
            const portions:APIPortionSuggest = await userActions.portionSuggestionByItemID(dishA.map(dish=> dish.id),dishB.map(dish=> dish.id),dishC.map(dish=> dish.id),volumesByPlateType(plateType));

            function getPortionsById(portions:APIPortionSuggest){
                let byId = {} as {[key in APIKey]:APIPortionSuggestEntry}
                for(const portion of portions){
                    if(portion?.id){
                        byId[portion.id] = portion
                    } 
                }
                return byId;
            }
            const portionById = getPortionsById(portions)
            let stateChanged = false
            function updatePortionInfo( dishes: Dish[]){
                return dishes.map(dish => {
                    if(! dish?.portion?.[plateType] || override){
                        if(portionById?.[dish.id]){
                            const newPortions = getPortionInfoFromAPIPortionInfo(dish, portionById[dish.id],Portion.A,plateType);
                            stateChanged = true;
                            return { ... dish, portion: {...dish.portion, [plateType]: newPortions}};
                        }
                    }
                    return dish
                })
            }
            console.log(portions,{plateType})
            let newState = {} as any
            if(!dAp || override){
                newState.dishA = updatePortionInfo( dishA)
            }
            if(!dBp || override){
                newState.dishB = updatePortionInfo(dishB)
                // const newPortions = getPortionInfoFromAPIPortionInfo(dishB,portions.small2,Portion.B,plateType);
                // stateChanged = true;
                // newState.dishB = { ... dishB, portion: {...dishB.portion, [plateType]: newPortions}};;
            }
            if(!dCp || override){
                newState.dishC = updatePortionInfo(dishC)
                // const newPortions = getPortionInfoFromAPIPortionInfo(dishC,portions.large,Portion.C,plateType);
                // stateChanged = true;
                // newState.dishC = { ... dishC, portion: {...dishC.portion, [plateType]: newPortions}};
            }
            if(stateChanged){
                console.log({newState})
                setLoadingPortions({
                    ...loadingPortions,
                    [plateType]: false
                })
                setMealState({
                    ...mealState,
                    ...newState,
                })
            }
            return {
                ...mealState,
                ...newState,
            }
        }
    }

    useEffect(()=>{
        setLoadingMealState(false)
    },[timeInfo])
    useEffect( ()=>{
        if(timeInfo){
            setNoMeal(null);
            const shouldFetch = (doFetchMeal && mealState.dishA == null) || mealState.menu == null
            if( shouldFetch && !loadingMealState){
                try{
                    fetchMeal()
                }catch(e){
                    console.error(e)
                }
            }else{
                onLoad()
            }
            fetchPortionSizes(plateType)
        }
    },[auth,timeInfo,loadingMealState,mealState,plateType])

    function setDishUserGraphic( dishId : APIKey, uri: string ){
        const updateDish = (dish: Dish) =>{
            if(dish.id === dishId){
                if(! (dish?.graphic?.source == "WePlate")){
                    return {
                        ...dish,
                        graphic: {uri, source: "user"}
                    } as Dish
                }
            }
            return dish
        }
        setMealState({
            ... mealState,
            dishA: mealState.dishA.map(updateDish),
            dishB: mealState.dishB.map(updateDish),
            dishC: mealState.dishC.map(updateDish),
            menu: {
                dishes: mealState.menu.dishes.map(updateDish)
            }
        })
    }

    return {mealState,loading: loadingMealState,noMeal,setMealDishes, fetchPortionSizes, setDishUserGraphic,isPast,isPresent,isFuture}
}