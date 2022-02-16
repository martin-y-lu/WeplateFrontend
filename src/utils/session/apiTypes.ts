type APIMealByTimePayload = Array<APIMealByTimeEvent>
type APIKey = number | string |null
type APITimestamp = string

interface APIMealByTimeEvent {
    group: APIMeals,
    items: Array<APIKey>,
    name: string,
    timestamp: APITimestamp,
    id: APIKey,
}
interface APIMealEvent {
    group: APIMeals,
    items: Array<APIItem>,
    name: string,
    timestamp: APITimestamp,
    id: APIKey,
}
enum APIMeals {"breakfast","lunch","dinner"}
interface APIItem{
    ingredients: Array<APIKey>,
    name: string,
    nutrition: APINutrition,
    id: APIKey,
    school: APISchool,
    station : string,
}
interface APIIngredient{
    name: String,
    id: APIKey,
}
interface APINutrition{
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

interface APISchool{
    name: string,
    id: APIKey,
}