import { APIFoodCategory, APIPortionSuggestEntry, APIItem, APITimestamp, APIStation, APIKey } from '../utils/session/apiTypes';
import { TimeInfo } from './state';
export enum FOOD_CATEGORY{Carbohydrates = "Carbohydrates",Protein = "Protein", Vegetable = "Vegetable"}
export const foodCategories = [FOOD_CATEGORY.Carbohydrates,FOOD_CATEGORY.Protein,FOOD_CATEGORY.Vegetable]
export enum MEAL{Breakfast = "Breakfast", Lunch = "Lunch",Dinner = "Dinner"}
export const MEALS = [MEAL.Breakfast,MEAL.Lunch, MEAL.Dinner]

export enum STATION{A = "A", B = "B", C = "C", D = "D", E = "E",F = "F"}
// export enum STATION{A = "A", B = "B", C = "C", D = "D", E = "E", F = "F", G = "G", H = "H", I = "I"}

export function getFoodCategoryDescription(fc: FOOD_CATEGORY){
    switch(fc){
        case(FOOD_CATEGORY.Carbohydrates): return "Grains"
        case(FOOD_CATEGORY.Protein): return "Proteins"
        case(FOOD_CATEGORY.Vegetable): return "Veggies"
    }
}

export function getNameOfStation( station: STATION){
    return {A: "Homestyle",
            B: "Rooted",
            C: "FYUL",
            D: "FLAME",
            E: "Carved and crafted",
            F:   "500 Degrees",
            }[station] ?? null
}

export function getMealsIndex(meal:MEAL){
    switch(meal){
        case(MEAL.Breakfast): return 0 
        case(MEAL.Lunch): return 1 
        case(MEAL.Dinner): return 2 
    }
}
export interface NutritionInfo{
    sugar ?: number, //
    cholesterol ?: number, //
    dietaryFiber ?: number, //
    sodium ?: number, //
    potassium ?: number,
    calcium ?: number,
    iron ?: number,
    vitaminD ?: number,
    vitaminC ?: number,
    vitaminA ?: number,
}
export interface NutritionSummaryInfo{
    calories : number, //
    protein : number, //
    carbohydrates : number, //
    totalFat : number, // 
    saturatedFat ?: number, //
    transFat ?: number //
}

export type Ingredients = Array<APIKey>

export interface PortionInfo{
    volume ?: number,
    fillFraction ?: number,
    nutrientFraction ?: number,
    // weight ?: number,
}

export interface Dish{
    id: APIKey,

    graphic?: string,
    name: string,
    station: STATION,
    category: FOOD_CATEGORY,
    nutrition: NutritionInfo,
    nutritionSummary: NutritionSummaryInfo
    ingredients: Ingredients,
    portion_weight: number,
    portionAmount?: {volume: number, discrete: false} | {count: number, maxPieces: number, discrete: true},
    portion?: { [key in PlateType] ?: PortionInfo},
}
interface NutritionalInfo{
    calories: number,
    carbohydrate: number,
    protein: number,
    total_fat: number,
    saturated_fat: number,
    trans_fat: number,
    sugar: number,
    cholesterol: number,
    fiber: number,
    sodium: number,
    potassium: number,
    calcium: number,
    iron: number,
    vitamin_a: number,
    vitamin_c: number,
    vitamin_d: number,
}
export interface NutritionalRequirements{
    hi: NutritionInfo,
    lo:NutritionInfo,
}
export interface MealState {
    time: TimeInfo,
    mealID: APIKey,
    recommendationA?: Array<Dish>,
    dishA?: Dish[],
    recommendationB?: Array<Dish>,
    dishB?: Dish[],
    recommendationC?: Array<Dish>,
    dishC?: Dish[],
    menu?: {
        dishes : Dish[]
    },
    nutritionRequirements?:NutritionalRequirements
}

export function getDishesFromMealState(mealState: MealState): Dish[]{
    return [...mealState.dishA,...mealState.dishB,...mealState.dishC]
}

export function getDishesFromMealStateByCategory(mealState:MealState){
    let res = { [FOOD_CATEGORY.Carbohydrates]: [] as Dish[], [FOOD_CATEGORY.Protein]: [] as Dish[], [FOOD_CATEGORY.Vegetable]: []as Dish[]}
    for(const dish of getDishesFromMealState(mealState)){
        if(dish?.category){
            res[dish.category].push(dish)
        }
    }
    return res
}
function getCategoryOfAPIItem(item:APIItem){
    return FoodCategoryFromAPIFoodCategory(item.category)
}
function toNum(num){
    if(!isFinite(num)) return 0
    return num ?? 0 
}
export function convertAPIStationToStation(stat:APIStation){
    switch(stat){
        case APIStation.A:
            return STATION.A;
        case APIStation.B:
            return STATION.B;
        case APIStation.C:
            return STATION.C;
        case APIStation.D:
            return STATION.D;
        case APIStation.E:
            return STATION.E;
        case APIStation.F:
            return STATION.F;
        // case APIStation.G:
        //     return STATION.G;
        // case APIStation.H:
        //     return STATION.H;
        // case APIStation.I:
        //     return STATION.I;
    }
}

export function convertAPIItemToDish(item:APIItem): Dish{
    const discrete = item.portion_volume<0
    const maxPieces = item?.max_pieces ?? 15
    return {
        id: item.id,
        name: item.name,
        station: convertAPIStationToStation(item.station),
        category: getCategoryOfAPIItem(item),
        nutrition: {
            sugar: item.sugar,
            cholesterol: item.cholesterol,
            dietaryFiber: item.fiber,
            sodium: item.sodium,
            potassium: item.potassium,
            calcium: item.calcium,
            iron: item.calcium,
            vitaminD: item.vitamin_d,
            vitaminC: item.vitamin_c,
            vitaminA: item.vitamin_a,
        },
        nutritionSummary:{
            calories: item.calories,
            protein: item.protein,
            carbohydrates: item.carbohydrate,
            totalFat: toNum(item.saturated_fat) + toNum(item.trans_fat) + toNum(item.unsaturated_fat),
            saturatedFat: item.saturated_fat ??0,
            transFat: item.trans_fat,
        },
        ingredients: item.ingredients,
        portionAmount: (discrete ? {count: Math.min(Math.abs( Math.round(item.portion_volume)), maxPieces), maxPieces, discrete:true }: {volume: item.portion_volume, discrete: false}),
        portion_weight: item.portion_weight,
        // portion:{
        //     fillFraction:0.6,
        // }
    }
}
export function parseAPITimestamp(date:APITimestamp){
    return new Date()
}

export function mealToAPIForm(meal:MEAL){
    return meal.toLowerCase();
}

export enum Portion{
    A = "A",
    B = "B",
    C = "C"
}

export enum PlateType{
    WePlate = "WePlate0",
    Normal = "Normal0",
}
export const plateTypes = [PlateType.WePlate,PlateType.Normal]

export function getDishesByPortion(mealState:MealState,portion:Portion){
    switch(portion){
        case(Portion.A):
            return mealState.dishA;
            break;
        case(Portion.B):
            return mealState.dishB;
            break;
        case(Portion.C):
            return mealState.dishC;
            break;
    }
}

export function replaceDishByPortion(mealState:MealState,portion:Portion, id: APIKey, toSet : Dish) : MealState{
    function replaceDish(dishes: Dish[]){
        return dishes.map((dish)=>{
            if(dish?.id == id){
                return toSet
            }else{
                return dish
            }
        })
    }
    switch(portion){
        case(Portion.A):
            return {
                ...mealState,
                dishA: replaceDish(mealState.dishA)
            }    
            break;
        case(Portion.B):
            return {
                ...mealState,
                dishB: replaceDish(mealState.dishB)
            }    
            break;
        case(Portion.C):
            return {
                ...mealState,
                dishC: replaceDish(mealState.dishC)
            }    
            break;
    }
}
export function removeDishByPortion(mealState:MealState,portion:Portion, id: APIKey) : MealState{
    function removeDish(dishes: Dish[]){
        return dishes.filter((dish)=>dish?.id !== id)
    }
    switch(portion){
        case(Portion.A):
            return {
                ...mealState,
                dishA: removeDish(mealState.dishA)
            }    
            break;
        case(Portion.B):
            return {
                ...mealState,
                dishB: removeDish(mealState.dishB)
            }    
            break;
        case(Portion.C):
            return {
                ...mealState,
                dishC: removeDish(mealState.dishC)
            }    
            break;
    }
}
export function addDishByPortion(mealState:MealState,portion:Portion, toSet : Dish) : MealState{
    switch(portion){
        case(Portion.A):
            return {
                ...mealState,
                dishA: [...mealState.dishA, toSet]
            }    
            break;
        case(Portion.B):
            return {
                ...mealState,
                dishB: [...mealState.dishB, toSet]
            }    
            break;
        case(Portion.C):
            return {
                ...mealState,
                dishC:[...mealState.dishC, toSet]
            }    
            break;
    }
}
export function getRecommendationsByPortion(mealState:MealState,portion:Portion){
    switch(portion){
        case(Portion.A):
            return mealState.recommendationA;
            break;
        case(Portion.B):
            return mealState.recommendationB
            break;
        case(Portion.C):
            return mealState.recommendationC
            break;
    }
}
export function fullVolumeByPortion(portion: Portion, plateType: PlateType){
    switch(portion){
        case Portion.A:
            switch(plateType){
                case PlateType.Normal:
                    return 400;
                case PlateType.WePlate:
                    return 270
            }
        case Portion.B:
            switch(plateType){
                case PlateType.Normal:
                    return 400;
                case PlateType.WePlate:
                    return 270
            }
        case Portion.C:
            switch(plateType){
                case PlateType.Normal:
                    return 800;
                case PlateType.WePlate:
                    return 610
            }
    }
}
export function volumesByPlateType(plateType: PlateType){
    return {
        small: (fullVolumeByPortion(Portion.A, plateType) + fullVolumeByPortion(Portion.B, plateType))/2, // weird 
        large: fullVolumeByPortion(Portion.C, plateType),
    }
}
function pieceFillMapper(val:number):number{
    return Math.pow(val,0.4) ;
}

export function getPortionInfoFromAPIPortionInfo(dish:Dish,info:APIPortionSuggestEntry,portion: Portion,plateType: PlateType){
    let nutrientFraction = 1;
    let fillFraction = 1;
    if(dish.portionAmount.discrete){
        const numPieces =  Math.min( Math.abs(Math.round(info.volume)), dish.portionAmount.maxPieces)
        nutrientFraction = numPieces/dish.portionAmount.count
        fillFraction = pieceFillMapper(dish.portionAmount.count/dish.portionAmount.maxPieces)
    }else if(dish.portionAmount.discrete === false){
        nutrientFraction = info.volume/ dish.portionAmount.volume;
        fillFraction = info.volume/info.total_volume;
    }
    return {
        fillFraction,
        nutrientFraction,
        volume: Math.abs(info.volume),
        // weight: info.weight,
    } as PortionInfo
}

export function FoodCategoryFromAPIFoodCategory(cat:APIFoodCategory){
    switch(cat){
        case APIFoodCategory.carbohydrate: 
            return FOOD_CATEGORY.Carbohydrates
        case APIFoodCategory.protein:
            return FOOD_CATEGORY.Protein
        case APIFoodCategory.vegetable:
            return FOOD_CATEGORY.Vegetable
    }
    console.log("Nomatch?", APIFoodCategory.carbohydrate)
}