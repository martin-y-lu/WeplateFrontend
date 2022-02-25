import { ScrollView, Text, View } from "react-native"
import NutritionFactsContainer from "./NutritionFactsContainer"
import {FOOD_CATEGORY, MEALS, STATION,MealState,Dish,NutritionInfo,NutritionSummaryInfo} from './typeUtil'

export function colorOfCategory(category: FOOD_CATEGORY){
    let color = ""
    switch(category){
        case(FOOD_CATEGORY.Carbohydrates):
            color = "#FDB812"
            break
        case(FOOD_CATEGORY.Protein):
            color = "#FF605B"
            break
        case(FOOD_CATEGORY.Vegetable):
            color = "#CE014E"
            break
    }
    return color 
}
import {leaf_xml,bread_xml,meat_xml, BASE_PORTION_FILL_FRACTION} from '../dining-menu/DiningMenu'
import React from "react"
import { formatNumber } from '../utils/math';
export function iconOfCategory(category: FOOD_CATEGORY){
    switch(category){
        case(FOOD_CATEGORY.Carbohydrates):
            return bread_xml
            break
        case(FOOD_CATEGORY.Protein):
            return meat_xml
            break
        case(FOOD_CATEGORY.Vegetable):
            return leaf_xml
            break
    }
}
const NutritionKey = (props) =>{
    const {number,dish} = props
    if(dish == null) return <></>
    const color = colorOfCategory(dish.category)
    return <View style = {{
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: "center",
        marginBottom: 10
    }}>
        <View style = {{
            marginLeft: 25,
            marginRight:10,
            width: 30,
            height: 30,
            borderStyle: 'solid',
            borderRadius: 15,
            backgroundColor: color,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Text style = {{color: "white"}}>
                {number}
            </Text>
        </View>
        <Text style = {{
            color: "#747474",
            fontSize: dish.name.length > 35 ? 10: 16,
        }}>
            {dish.name}
        </Text>
        
    </View>       
}   
const BaseRow = (props)=>{ 
    const width = 55
    const height = props.height ?? 30
    const borderLeftWidth = props.borderWidth ?? 1
    return <View style = {{
        width: "100%",
        // width: 50,
        height,
        flexDirection: "row",
        justifyContent: "flex-end",
    }}>
        <View style = {{
            flex: 1,
            flexShrink:1,
            flexGrow:1,
            height,
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"flex-start",
        }}> 
            {props?.els[0]}
        </View>
        <View style = {{
            height,
            width,
            borderColor: "#DADADA",
            borderLeftWidth,
            alignItems:"center",
            justifyContent:"center",
        }}> 
            {props?.els[1]}
        </View>
        <View style = {{
            height,
            width,
            borderColor: "#DADADA",
            borderLeftWidth,
            alignItems:"center",
            justifyContent:"center",
        }}> 
            {props?.els[2]}
        </View>
        <View style = {{
            height,
            width,
            borderColor: "#DADADA",
            borderLeftWidth,
            alignItems:"center",
            justifyContent:"center",
        }}> 
            {props?.els[3]}
        </View>
        <View style = {{
            height,
            width: 70,
            borderColor: "#DADADA",
            borderLeftWidth,
            alignItems:"center",
            justifyContent:"center",
        }}> 
            {props?.els[4]}
        </View>
    </View>
}
const BaseCircle = (props)=>{
    const diameter =  props.diameter ?? 30
    return <View style = {{
        width: diameter,
        height: diameter,
        borderStyle: 'solid',
        borderRadius: diameter/2 ,
        backgroundColor: props.color,
        justifyContent: "center",
        alignItems: "center",
    }}>
        <Text style = {{color: "white"}}>
            {props.number}
        </Text>
    </View>
}
const BaseText = (props) =>{
    const color = props.color ?? "#A6A6A6"
    const bold = props.bold ?? false
    return <View style ={{
        flexDirection:"row",
        alignItems: "center",
        justifyContent: "center"
    }}>
        <Text style = {{
            color,
            fontWeight: bold? "bold" : "normal"
        }}>
            {props.children}
        </Text>
        {props.unit && <Text style = {{
            color,
            fontSize: 10,
        }}>
            {props.unit}    
        </Text>}
    </View>
}

const DataRow = (props :{height?: number,bold?:boolean,color ?: string, name ?: string, selector : (Dish)=> number,  mealState:MealState, unit?:string}) =>{
    let {height,color,bold, name, selector, mealState, unit} = props
    bold = bold ?? true
    color = color ?? "#747474"
    const total = totalBy(selector,mealState)
    return <BaseRow height = {height} els = {[
        <Text style = {{ color , flexWrap:"wrap",fontWeight: bold ? "bold" : "normal"}} ellipsizeMode = "tail" numberOfLines={1}> {name} </Text>,
        <BaseText color= {color} unit = {unit}> {formatNumber(mealState.dishA ? selector(mealState.dishA)??0 :0)}</BaseText>,
        <BaseText color= {color} unit = {unit}> {formatNumber(mealState.dishB ? selector(mealState.dishB)??0 :0)}</BaseText>,
        <BaseText color = {color } unit = {unit}> {formatNumber(mealState.dishC ? selector(mealState.dishC)??0 :0)}</BaseText>,
        <BaseText bold color = {color} unit = {unit}> {formatNumber(total)}</BaseText>,
    ]}/>
}

function totalBy(func: (Dish)=>number,mealState:MealState){
    let total = 0;
    [mealState.dishA,mealState.dishB,mealState.dishC].filter(el => el != null).forEach((arg)=>{
        total += func(arg) ??0
    })
    return total
}
export const NutritionFacts = (props) =>{
    const {mealState} : {mealState: MealState} = props 
    const nutrientScale = (dish:Dish)=> (dish?.portion?.nutrientFraction ?? BASE_PORTION_FILL_FRACTION) 
    return <NutritionFactsContainer disabled = {props?.disabled ?? false}> 
    <View style = {{
        width : "100%",
        flexDirection: "column",
        alignItems:"flex-start",
        justifyContent: "flex-start"
    }}>
        <NutritionKey number = {1} dish ={mealState.dishA}/>
        <NutritionKey number = {2} dish ={mealState.dishB}/>
        <NutritionKey number = {3} dish ={mealState.dishC}/>
        <View style = {{
            width: "100%",
            paddingLeft: 20,
            paddingRight: 20,
            alignSelf:"flex-start",
        }}> 
            <BaseRow borderWidth = {0} els = {[
                null,
                mealState.dishA ? <BaseCircle number = {1} color = {colorOfCategory(mealState.dishA.category)}/> :null,
                mealState.dishB ? <BaseCircle number = {2} color = {colorOfCategory(mealState.dishB.category)}/> :null,
                mealState.dishC ?<BaseCircle number = {3} color = {colorOfCategory(mealState.dishC.category)}/> :null,
                <Text style = {{ color: "#747474", flexWrap:"wrap", fontWeight:"bold"}} ellipsizeMode = "tail" numberOfLines={1}> Total </Text>,
                ]}/>
            <ScrollView style = {{
                flex:1,
                flexGrow:1,
                minHeight:300,
                // maxHeight:500,
            }}>
                <DataRow height = {30} name = "Calories" mealState = {mealState} selector = {(dish:Dish)=> (dish.nutritionSummary.calories*nutrientScale(dish))}  />
                <DataRow height = {30} name = "Total Fat" unit = "g" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.totalFat*nutrientScale(dish)}  />
                <DataRow height = {30} name = "    Saturated Fat" bold = {false}unit = "g" color = "#A6A6A6" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.saturatedFat*nutrientScale(dish)}  />
                <DataRow height = {30} name = "    Trans Fat" bold = {false}unit = "g" color = "#A6A6A6" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.transFat*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Cholesterol" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.cholesterol*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Sodium" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.sodium*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Carbohydrates" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.carbohydrates*nutrientScale(dish)}  />
                <DataRow height = {30} name = "    Dietary Fiber" bold = {false}unit = "g" color = "#A6A6A6" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.dietaryFiber*nutrientScale(dish)}  />
                <DataRow height = {30} name = "    Total Sugar" bold = {false}unit = "g" color = "#A6A6A6" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.sugar*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Protein" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.protein*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Potassium" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.potassium*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Calcium" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.calcium*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Iron" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.iron*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Vitamin D" unit = "IU" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.vitaminD*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Vitamin C" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.vitaminC*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Vitamin A" unit = "IU" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.vitaminA*nutrientScale(dish)}  />
            </ScrollView>
        </View>
    </View>
    
</NutritionFactsContainer>
}
// export class NutritionFacts extends React.Component{
//     render(){
//         return <NutritionFactsFunctional {...this.props}/>
//     }
// }