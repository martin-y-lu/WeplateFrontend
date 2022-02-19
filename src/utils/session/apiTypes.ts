import { FOOD_CATEGORY } from '../../dashboard/typeUtil';

export type APIMealByTimePayload = Array<APIMealByTimeEvent>
export type APIKey = number
export type APITimestamp = string

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
export enum APIFoodCategory {carbohydrate = "carbohydrate",protein = "protein",vegetable="vegetable"}
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
    weight: number,
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
export interface APIItem{
    ingredients: Array<APIKey>,
    name: string,
    nutrition: APINutrition,
    id: APIKey,
    school: APISchool,
    station : string,
}
export interface APIIngredient{
    name: String,
    id: APIKey,
}
export interface APINutrition{
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

export interface APISchool{
    name: string,
    id: APIKey,
}