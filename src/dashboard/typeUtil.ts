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
        name: item.name,
        station: item.station as STATION,
        category: getCategoryOfAPIItem(item),
        nutrition: {
            sugar: item.nutrition.sugar,
            cholesterol: item.nutrition.cholesterol,
            dietaryFiber: 0, // Why is this missing
            sodium: item.nutrition.sodium,
            potassium: item.nutrition.potassium,
            calcium: item.nutrition.calcium,
            iron: item.nutrition.calcium,
            vitaminD: item.nutrition.vitamin_d,
            vitaminC: item.nutrition.vitamin_c,
            vitaminA: item.nutrition.vitamin_a
        },
        nutritionSummary:{
            calories: item.nutrition.calories,
            protein: item.nutrition.protein,
            carbohydrates: item.nutrition.carbohydrate,
            totalFat: item.nutrition.saturated_fat + item.nutrition.trans_fat + item.nutrition.unsaturated_fat,
            saturatedFat: item.nutrition.saturated_fat,
            transFat: item.nutrition.trans_fat,
        },
        ingredients: item.ingredients.map(ingredient => ingredient.name)
    } as Dish
}
export function parseAPITimestamp(date:APITimestamp){
    return new Date()
}