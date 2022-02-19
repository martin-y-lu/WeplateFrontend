import { memo, useMemo } from 'react';
import {atom, useRecoilState, } from 'recoil'
import { useUserActions } from '../utils/session/useUserActions';
import { FOOD_CATEGORY, MEALS, STATION,MealState,Dish,NutritionInfo,NutritionSummaryInfo, convertAPIItemToDish } from './typeUtil';
export function dateToString(date){
    var UTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return UTC.toISOString().slice(0, 10)
}
export function stringToDate(string: String){
    const [year,month,day] = string.split('-')
    return new Date(Date.UTC(parseInt(year),parseInt(month)-1,parseInt(day)+1))
}

export const dashboardState = atom({
    key: "dashboardState",
    
    default: {
        currentDate: stringToDate("2030-02-14"),
        currentMeal: MEALS.Lunch,
        streakLength: 12
    }
})
export interface TimeInfo{
    date: string,
    meal: MEALS,
}

function randomSelect(...items){
    return items[Math.floor(Math.random()*items.length)];
}
function randomNumber(max){
    return Math.floor(Math.random()*max)
}

function randomDish(){
    const name = randomSelect("Chopped","Stir fried","Spanish","Deep fried","Seared","Swedish","Japanese","French","Fried","Stewed","Braised","Sliced","Flambéed","Deviled","Baked","Fresh","Boiled","Million dollar") +" "+
                randomSelect("Chicken","Spagetti","Spinach","Salad","Curry","Rice","Cauliflower","Ravioli","Tuna","Salmon","Eggs","Meatballs","Burger","Cheese","Pizza","Ramen","Potatoes")
    const station : STATION= randomSelect(STATION.A,STATION.B,STATION.C,STATION.D)
    const category : FOOD_CATEGORY= randomSelect(FOOD_CATEGORY.Carbohydrates,FOOD_CATEGORY.Protein,FOOD_CATEGORY.Vegetable) 
    const nutrition:NutritionInfo = {
        sugar: randomNumber(100),
        cholesterol :randomNumber(50),
        dietaryFiber :randomNumber(50),
        sodium :randomNumber(50),
        potassium :randomNumber(50),
        calcium :randomNumber(50),
        iron :randomNumber(50),
        vitaminD :randomNumber(50),
        vitaminC :randomNumber(50),
        vitaminA :randomNumber(50),
    }
    const summary: NutritionSummaryInfo = {
        calories :randomNumber(400),
        protein : randomNumber(100),
        carbohydrates : randomNumber(100),
        totalFat : randomNumber(100),
        saturatedFat : randomNumber(100),
        transFat :randomNumber(100),
    }
    return {
        id: 10,
        name,
        station,
        category,
        nutrition,
        nutritionSummary: summary,
        ingredients: [],
        recommendation: {
            fillFraction: Math.random()   
        }
    } as Dish
}
const memoMealState = {}
export const mealStateWithDateMeal =  (date: Date,meal: MEALS) => {
    const key = `mealState:${dateToString(date)}:${meal}`
    if(key in memoMealState) return memoMealState[key]
    const NUM_PER_REC = 5
    function makeRecommendationList(){
        let list = []
        for(let i =0 ; i< NUM_PER_REC;i++){
            list.push(randomDish() as Dish)
        }
        return list as Array<Dish>
    }
    //todo: fetch defaults and stuff

    const recA = makeRecommendationList()
    const recB = makeRecommendationList()
    const recC = makeRecommendationList()
    const state : MealState = {
        mealID: null,
        recommendationA: null,
        dishA: null,
        recommendationB: null,
        dishB: null,
        recommendationC: recC,
        dishC: null,
        // recommendationA: recA,
        // dishA: randomSelect(...recA),
        // recommendationB: recB,
        // dishB: randomSelect(...recB),
        // recommendationC: recC,
        // dishC: randomSelect(...recC),
    }
    const mealState =  atom({
        key,
        default: state
    })
    memoMealState[key] = mealState
    return mealState
}
export const mealStateFromTimeInfo = (timeInfo:TimeInfo) => mealStateWithDateMeal( stringToDate(timeInfo.date), timeInfo.meal)