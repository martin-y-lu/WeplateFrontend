import { FOOD_CATEGORY } from '../../dashboard/typeUtil';

export type APIMealByTimePayload = Array<APIMealByTimeEvent>
export type APIKey = number
export type APITimestamp = string
export type APILink = string

export interface APIMealByTimeEvent {
    group: APIMeals,
    items: Array<APIKey>,
    name: string,
    timestamp: APITimestamp,
    id: APIKey,
}
export interface APIMealEvent {
    group: APIMeals,
    items: Array<APIItem>,
    name: string,
    timestamp: APITimestamp,
    id: APIKey,
}
export enum APIFoodCategory {carbohydrate = "grain",protein = "protein",vegetable="vegetable"}
export interface APIMealSuggestEntry {
    category: APIFoodCategory,
    items: Array<APIKey>,
}
export interface APIMealSuggest{
    large:APIMealSuggestEntry,
    small1:APIMealSuggestEntry,
    small2:APIMealSuggestEntry,
}

export interface APIPortionInfo{
    volume: number,
}
export interface APIPortionSuggest{
    large: APIPortionInfo,
    small1: APIPortionInfo,
    small2: APIPortionInfo,
}
export interface APIAnalyticsMealChoiceEntry{
    id: APIKey,
    timestamp: string,
    small1: APIKey,
    small2: APIKey,
    large: APIKey,
    small1_portion: number,
    small2_portion: number,
    large_portion: number,
}
export enum APIMeals {"breakfast","lunch","dinner"}

export enum APIStation {A = "HOMESTYLE", B = "ROOTED", C= "FYUL", D = "FLAME",E = "CARVED AND CRAFTED", F = "500 DEGREES"}
export interface APIItem{
    graphic?: APILink

    ingredients: Array<APIKey>,
    name: string,
    // nutrition: APINutrition,
    id: APIKey,
    school: APISchool,
    category: APIFoodCategory,
    station : APIStation,
    portion_weight : number,
    portion_volume : number,
   
    max_pieces ?: number,
    calcium?: number,
    calories ?: number,
    carbohydrate ?: number,
    cholesterol ?: number,
    fiber ?: number,
    iron ?: number,
    potassium ?: number,
    protein ?: number,
    saturated_fat ?: number,
    sodium ?: number,
    sugar ?: number,
    trans_fat ?: number,
    unsaturated_fat ?: number,
    vitamin_a ?: number,
    vitamin_c ?: number,
    vitamin_d ?: number,
}
export interface APIIngredient{
    name: string,
    id: APIKey,
}

export interface APISchool{
    name: string,
    id: APIKey,
}

interface APIUserItemPref{

}

export const healthGoals = ["improve_health" , "lose_weight" , "build_muscle" , "athletic_performance" , "improve_body_tone" ]
export type APIHealthGoal = "improve_health" | "lose_weight" | "build_muscle" | "athletic_performance" | "improve_body_tone"
export function getAPIHealthGoalName(goal:APIHealthGoal){
    return {
        "improve_health": "Improve Health" ,
        "lose_weight": "Lose Weight" ,
        "build_muscle": "Build Muscle" ,
        "athletic_performance": "Athletic Performance" ,
        "improve_body_tone": "Improve Body Tone", 
    } [goal]
}

export const activityLevels = [ "mild" , "moderate" , "heavy" , "extreme"]
export type APIActivityLevel = "mild" | "moderate" | "heavy" | "extreme"
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
export function getAPIActivityLevelName(level: APIActivityLevel){
    return capitalizeFirstLetter(level)
}
export function getAPIActivityLevelDescription(level : APIActivityLevel){
    return {
        "mild": "20-30 minutes exercise \n 1-2 days a week" ,
        "moderate": "30-60 minutes exercise \n 2-4 days a week" ,
        "heavy": "60+ minutes exercise \n 5-6 days a week" ,
        "extreme": "120+ minutes exercise \n 7 days a week",
    }[level]
}

export type APIBaseAllergen = "peanuts" | "tree_nuts" | "eggs" | "soy" | "wheat" | "fish" | "shellfish" | "corn" | "gelatin" 
export const baseAllergens = ["peanuts" , "tree_nuts" , "eggs" , "soy" , "wheat" , "fish" , "shellfish" , "corn" , "gelatin" ]
export function getAPIBaseAllergenName(allergen: string){
    return {"peanuts":"Peanuts" , "tree_nuts":"Tree Nuts" , "eggs": "Eggs" , "soy":"Soy" , "wheat":"Wheat" , "fish":"Fish" , "shellfish":"Shellfish" , "corn":"Corn" , "gelatin": "Gelatin" }[allergen] ?? capitalizeFirstLetter(allergen)
}
export type APIDietaryRestriction = "vegetarian" | "vegan" | "lactose_intolerant" | "kosher" | "halal" | "gluten_free"
export const dietaryRestrictions =  ["vegetarian" , "vegan" , "lactose_intolerant" , "kosher" , "halal" , "gluten_free"]
export function getAPIDietaryRestrictionName(restriction: APIDietaryRestriction){
    return {"vegetarian":"Vegetarian" , "vegan":"Vegan" , "lactose_intolerant":"Lactose Intolerant" , "kosher":"Kosher" , "halal":"Halal" , "gluten_free":"Gluten Free"}[restriction]
}
export type APIEveryMeal = "breakfast" | "morning_snack" | "lunch" | "afternoon_snack" | "dinner" | "evening_snack";
export const everyMeals =[ "breakfast" , "morning_snack" , "lunch" , "afternoon_snack" , "dinner" , "evening_snack"]
export function getAPIEveryMealName(meal: APIEveryMeal){
   return {"breakfast":"Breakfast" , "morning_snack":"Morning Snack" , "lunch":"Lunch" , "afternoon_snack":"Afternoon Snack" , "dinner":"Dinner" , "evening_snack":"Evening Snack"} [meal]
}

export interface APIUserSettings{
    id: APIKey,
    is_verified: boolean,
    ban: APIUserItemPref[],
    favor: APIUserItemPref[],
    dietary_restrictions: APIDietaryRestriction[]
    allergies: {id: APIKey, name: string}[]
    name: string,
    height: number,
    weight: number,
    birthdate: APITimestamp,
    meals : APIEveryMeal[],
    meal_length: number,
    sex: "male" | "female" | "other",
    health_goal: APIHealthGoal,
    activity_level: APIActivityLevel,
    grad_year: number,
    school : APIKey,
}
export interface APIRegisterSettings{
    ban: APIUserItemPref[],
    favor: APIUserItemPref[],
    dietary_restrictions: APIDietaryRestriction[]
    allergies: {id: APIKey, name: string}[]
    name: string,
    height: number,
    weight: number,
    birthdate: APITimestamp,
    meals : APIEveryMeal[],
    meal_length: number,
    sex: "male" | "female" | "other",
    health_goal: APIHealthGoal,
    activity_level: APIActivityLevel,
    grad_year: number,
    school : APIKey
    username :string,
    password : string, 
}

export type APIHandleUpdateStrategies = "none" | "force" | "recommend" | "maintenance"
export interface APIVersionResponse{
    backend_version: string,
    compatible: boolean,
    handling_update: APIHandleUpdateStrategies,
}