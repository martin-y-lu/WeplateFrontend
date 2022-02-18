export enum FOOD_CATEGORY{Carbohydrates = "Carbohydrates",Protein = "Protein", Vegetable = "Vegetable"}
export enum MEALS{Breakfast = "Breakfast", Lunch = "Lunch",Dinner = "Dinner"}
export enum STATION{A = "A", B = "B", C = "C", D = "D"}

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

export type Ingredients = Array<String>

export interface RecommendationInfo{
    volume ?: number,
    fillFraction ?: number,
}

export interface Dish{
    id: number,
    name: String,
    station: STATION,
    category: FOOD_CATEGORY,
    nutrition: NutritionInfo,
    nutritionSummary: NutritionSummaryInfo
    ingredients: Ingredients,
    recommendation ?: RecommendationInfo,
}
export interface MealState {
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
export function convertAPIItemToDish(item:APIItem){
    return {
        id: item.id,
        name: item.name,
        station: item.station as STATION,
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
            totalFat: item.nutrition.saturated_fat + item.nutrition.trans_fat + item.nutrition.unsaturated_fat,
            saturatedFat: item.nutrition.saturated_fat,
            transFat: item.nutrition.trans_fat,
        },
        ingredients: item.ingredients,
        recommendation:{
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