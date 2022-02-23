import { APIFoodCategory, APIPortionInfo, APIItem, APITimestamp, APIStation } from '../utils/session/apiTypes';
export enum FOOD_CATEGORY{Carbohydrates = "Carbohydrates",Protein = "Protein", Vegetable = "Vegetable"}
export enum MEALS{Breakfast = "Breakfast", Lunch = "Lunch",Dinner = "Dinner"}

export enum STATION{A = "A", B = "B", C = "C", D = "D", E = "E", F = "F", G = "G", H = "H", I = "I"}

export function getNameOfStation( station: STATION){
    return {A: "Homestyle",
            B: "Fresh 52",
            C: "Rooted",
            D: "FYUL",
            E: "FLAME",
            F:   "500 Degrees",
            G:    "Cucina",
            H: "Carved and crafted",
            I:    "Soup",
            }[station]
}

export function getMealsIndex(meal:MEALS){
    switch(meal){
        case(MEALS.Breakfast): return 0 
        case(MEALS.Lunch): return 1 
        case(MEALS.Dinner): return 2 
    }
}
export interface NutritionInfo{
    sugar ?: number,
    cholesterol ?: number,
    dietaryFiber ?: number,
    sodium ?: number,
    potassium ?: number,
    calcium ?: number,
    iron ?: number,
    vitaminD ?: number,
    vitaminC ?: number,
    vitaminA ?: number,
}
export interface NutritionSummaryInfo{
    calories : number,
    protein : number,
    carbohydrates : number,
    totalFat : number,
    saturatedFat ?: number,
    transFat ?: number
}

export type Ingredients = Array<number>

export interface PortionInfo{
    volume ?: number,
    fillFraction ?: number,
    weight ?: number,
}

export interface Dish{
    id: number,
    name: string,
    station: STATION,
    category: FOOD_CATEGORY,
    nutrition: NutritionInfo,
    nutritionSummary: NutritionSummaryInfo
    ingredients: Ingredients,
    portion?: PortionInfo,
}
export interface MealState {
    mealID: number,
    recommendationA: Array<Dish>,
    dishA: Dish,
    recommendationB: Array<Dish>,
    dishB: Dish,
    recommendationC: Array<Dish>,
    dishC: Dish,
}
function getCategoryOfAPIItem(item:APIItem){
    return FOOD_CATEGORY.Carbohydrates
}

function toNum(num){
    if(isNaN(num)) return 0
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
        case APIStation.G:
            return STATION.G;
        case APIStation.H:
            return STATION.H;
        case APIStation.I:
            return STATION.I;
    }
}
export function convertAPIItemToDish(item:APIItem){
    return {
        id: item.id,
        name: item.name,
        station: convertAPIStationToStation(item.station),
        category: getCategoryOfAPIItem(item),
        nutrition: {
            sugar: item.nutrition.sugar,
            cholesterol: item.nutrition.cholesterol,
            dietaryFiber: item.nutrition.fiber,
            sodium: item.nutrition.sodium,
            potassium: item.nutrition.potassium,
            calcium: item.nutrition.calcium,
            iron: item.nutrition.calcium,
            vitaminD: item.nutrition.vitamin_d,
            vitaminC: item.nutrition.vitamin_c,
            vitaminA: item.nutrition.vitamin_a,
        },
        nutritionSummary:{
            calories: item.nutrition.calories,
            protein: item.nutrition.protein,
            carbohydrates: item.nutrition.carbohydrate,
            totalFat: toNum(item.nutrition.saturated_fat) + toNum(item.nutrition.trans_fat) + toNum(item.nutrition.unsaturated_fat),
            saturatedFat: item.nutrition.saturated_fat ??0,
            transFat: item.nutrition.trans_fat,
        },
        ingredients: item.ingredients,
        portion:{
            fillFraction:0.6,
        }
    } as Dish
}
export function parseAPITimestamp(date:APITimestamp){
    return new Date()
}

export function mealToAPIForm(meal:MEALS){
    return meal.toLowerCase();
}

export enum Portion{
    A = "A",
    B = "B",
    C = "C"
}

export function getDishByPortion(mealState:MealState,portion:Portion){
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
export function setDishByPortion(mealState:MealState,portion:Portion, toSet : Dish){
    switch(portion){
        case(Portion.A):
            return {
                ...mealState,
                dishA: toSet
            }    
            break;
        case(Portion.B):
            return {
                ...mealState,
                dishB: toSet
            }    
            break;
        case(Portion.C):
            return {
                ...mealState,
                dishC: toSet
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
export function fullVolumeByPortion(portion: Portion){
    switch(portion){
        case Portion.A:
            return 270
        case Portion.B:
            return 270
        case Portion.C:
            return 610
    }
}

export function getPortionInfoFromAPIPortionInfo(info:APIPortionInfo,portion: Portion){
    return {
        fillFraction: info.volume/fullVolumeByPortion(portion),
        volume: info.volume,
        weight: info.weight,
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