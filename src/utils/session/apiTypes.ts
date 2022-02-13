type APIMealPayload = Array<APIMealEvent>
type APIKey = number | string |null
type APITimestamp = string

interface APIMealEvent {
    group: APIMeals,
    items: Array<APIItem>,
    name: string,
    timestamp: APITimestamp,
    pk: APIKey,
}
enum APIMeals {"breakfast","lunch","dinner"}
interface APIItem{
    ingredients: Array<APIIngredient>,
    name: string,
    nutrition: APINutrition,
    pk: APIKey,
    school: APISchool,
    station : string,
}
interface APIIngredient{
    name: String,
    pk: APIKey,
}
interface APINutrition{
    calcium?: number,
    calories ?: number,
    carbohydrate ?: number,
    cholesterol ?: number,
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
    pk: APIKey,
}