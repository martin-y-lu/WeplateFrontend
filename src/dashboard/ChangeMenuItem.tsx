import { View, Text, TouchableOpacity, FlatList, Animated, Image } from "react-native";
import { colorOfCategory, iconOfCategory } from "./NutritionFacts";
import {
    MealState,
    Dish,
    Portion,
    getRecommendationsByPortion,
    getDishByPortion,
    setDishByPortion,
    getNameOfStation,
    fullVolumeByPortion,
    FOOD_CATEGORY,
} from './typeUtil';
export const SHADOW_STYLE = {
    backgroundColor:"white",
    shadowColor:"black",
    shadowRadius:5,
    shadowOpacity:0.25,
    shadowOffset:{width:0,height:0},
}


import { SvgXml } from "react-native-svg"
import { BASE_PORTION_FILL_FRACTION, leaf_xml, bread_xml, meat_xml } from '../dining-menu/DiningMenu';
import { formatNumber } from "../utils/math";
import { useState } from "react";
import {useEffect} from 'react';
import { LoadingIcon } from "../utils/Loading";
import { useDesignScheme } from '../design/designScheme';
import { getFoodCategoryDescription, PlateType } from './typeUtil';
import { NutritionInfoEntry } from "../individual-item/IndividualItem";

const downArrowSvg = `
<svg width="23" height="9" viewBox="0 0 23 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L9.8359 6.8906C10.8436 7.5624 12.1564 7.5624 13.1641 6.8906L22 1" stroke="#A4A4A4" stroke-width="2"/>
</svg>
`
const upArrowSvg = `
<svg width="23" height="9" viewBox="0 0 23 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 8L13.1641 2.1094C12.1564 1.4376 10.8436 1.4376 9.8359 2.1094L1 8" stroke="#A4A4A4" stroke-width="2"/>
</svg>
`

const ChangeMenuItem = (props : { plateType: PlateType, modalOpen: Portion,setModalOpen?: (Portion) => void, mealState: MealState,setMealDishes : (newDishA: Dish, newDishB: Dish, newDishC: Dish, plateType: PlateType) => Promise<void>}) =>{
    const {plateType,modalOpen, setModalOpen, mealState,setMealDishes} = props
    const [selectedDish,setSelectedDish] = useState(null);
    const portion = modalOpen
    const dishes = getRecommendationsByPortion(mealState,portion)
    const currentDish = getDishByPortion(mealState,portion)

    const ds = useDesignScheme()
    const [openDishes, setOpenDishes] = useState({});
    function renderDish({item , index}:{item:Dish, index : number}){
        // const color = selectedDish != null ?  null : 
        // ? colorOfCategory(item.category): null
        const itemMatches = item.id === currentDish.id 
        const loading = selectedDish == item.id ;
        const dish = item
        const dishName = dish.name
        const station = dish.station
        const stationName = getNameOfStation(station)
        const scaleFraction = ( dish?.portion?.[plateType]?.nutrientFraction ?? BASE_PORTION_FILL_FRACTION)
        const calories = dish.nutritionSummary.calories *scaleFraction
        const color = colorOfCategory(dish.category)
        const graphic = dish?.graphic
        const type = dish.category
        const icon = iconOfCategory(item.category)
        const cals = item.nutritionSummary.calories *BASE_PORTION_FILL_FRACTION * fullVolumeByPortion(portion,plateType)/item.portion[plateType].volume
        
        const open = openDishes?.[dish.id]
        function setOpen(_open){
            setOpenDishes({
                ...openDishes,
                [dish?.id]: _open
            })
        }
        return <View style = {{
            borderBottomWidth: 0.5,
            borderBottomColor: "#D1D1D1",
        }}>
            <TouchableOpacity style = {{
                flex:1,
                flexGrow:1,
                // alignSelf: "stretch",
                height: 70,
                paddingLeft:10,
                paddingVertical: 5,
                borderRadius:5,
                
                marginTop:2,
                marginBottom:2,

                width:"100%",
                flexDirection:"row",
                alignItems: "center",
                justifyContent: "flex-start",
                alignSelf: "flex-start",
                backgroundColor: itemMatches || loading ? "#FFEAEA" : "white",

            }} onPress = {async ()=>{
                if(selectedDish == null){
                    setSelectedDish(item.id)
                    const tempMealState = setDishByPortion(mealState,modalOpen,item);
                    // setMealState()
                    await setMealDishes(tempMealState.dishA,tempMealState.dishB,tempMealState.dishC, plateType)
                    
                    setModalOpen(null)// close modal
                }
            }}>
                <View style = {{
                    padding: 5,
                    // backgroundColor: "orange"
                }}>

                
                    <View style = {{height: "100%",
                                    justifyContent: "center",
                                    alignItems:"center", 
                                    backgroundColor: ds.colors.grayscale4, 
                                    aspectRatio: 1.2, 
                                    borderRadius: 5, 
                                    marginVertical: 15, 
                                    overflow:"hidden"}}>

                    { loading ? <LoadingIcon/> :  graphic ? 
                        <Image style = {{ flex:1,aspectRatio:1.2}} source = {{uri: graphic}}/>
                        :(
                            type == FOOD_CATEGORY.Vegetable ?

                            <SvgXml  stroke = "#C0C0C0" xml={leaf_xml} /> 
                            
                        : type == FOOD_CATEGORY.Carbohydrates ? 
                            
                            <SvgXml stroke = "#C0C0C0" xml={bread_xml}/>
                            
                        :
                            <SvgXml  stroke = "#C0C0C0" xml={meat_xml} />
                                )
                    }
                    </View>
                </View>

                <View  style = {{
                    marginLeft: 10,
                    flexDirection: 'column',
                    flexShrink: 1,
                    paddingRight: 20,
                }}>
                    <Text style = {{
                        fontSize: dishName.length > 35? 12: dishName.length>20? 16:  20,
                        color: color,
                    }}>
                        {dishName}
                    </Text>
                    <View style = {{
                        flexDirection: 'row'
                    }}>
                        {station != null &&
                            <View style = {{
                                borderRightWidth: 2,
                                borderColor: "#A4A4A4",
                            }}>
                                <Text style = {{
                                    color : "#A4A4A4",
                                    marginRight: 5,
                                }}>
                                    {stationName.length<=2 ? "Station " : ""}{stationName}
                                </Text>
                            </View>
                        }
                        <Text style = {{
                            color : "#A4A4A4",
                            marginLeft: 5, 
                            marginRight: 5,
                        }}>
                            {Math.ceil(calories)} calories
                        </Text>
                        {
                        dish.portionAmount.discrete && 
                        <View style = {{
                            borderLeftWidth: 2,
                            borderColor: "#A4A4A4", 
                            marginLeft:5,
                        }}>
                            <Text style = {{
                                color : ds.colors.grayscale1,
                                marginLeft: 5,
                                
                            }}>
                                {dish.portionAmount.count} { dish.portionAmount.count > 1 ? "pieces" : "piece"}
                            </Text> 
                        </View>
                    }
                        {/* <Text style = {{
                            color : "#A4A4A4",
                            marginLeft: 5, 
                        }}>
                            {fillFraction} fill
                        </Text> */}
                    </View>
                </View>
                <TouchableOpacity style ={{
                    height: "100%",
                    paddingRight: 10,
                    justifyContent:"center",
                    alignItems:"center",
                    marginLeft:"auto",
                }}
                onPress = {()=>{
                    setOpen(!open)
                }}>
                    <SvgXml xml = {open? upArrowSvg:  downArrowSvg}/>
                </TouchableOpacity>
            </TouchableOpacity>
            { open && <>
            
                <View style = {{flexDirection:"row", paddingRight: 0, paddingLeft: 0,paddingBottom: 10 }}>
                    <View style = {{flexDirection: "column", flex: 1, paddingRight: 20,}}>
                        <NutritionInfoEntry name = "Total Fats" value = {dish.nutritionSummary.totalFat*scaleFraction} unit = "g"/>
                        <NutritionInfoEntry name = "Saturated Fat" value = {dish.nutritionSummary.saturatedFat*scaleFraction} unit = "g"/>
                        <NutritionInfoEntry name = "Sugar" value = {dish.nutrition.sugar*scaleFraction} unit = "g"/>
                        <NutritionInfoEntry name = "Fiber" value = {dish.nutrition.dietaryFiber*scaleFraction} unit = "g"/>
                        <NutritionInfoEntry name = "Potassium" value = {dish.nutrition.potassium*scaleFraction} unit = "mg"/>
                        <NutritionInfoEntry name = "Iron" value = {dish.nutrition.iron*scaleFraction} unit = "mg"/>
                    </View>
                    <View style = {{flexDirection: "column", flex: 1}}>
                        <NutritionInfoEntry name = "Proteins" value = {dish.nutritionSummary.protein*scaleFraction} unit = "g"/>
                        <NutritionInfoEntry name = "Carbohydrates" value = {dish.nutritionSummary.carbohydrates*scaleFraction} unit = "g"/>
                        <NutritionInfoEntry name = "Cholesterol" value = {dish.nutrition.cholesterol*scaleFraction} unit = "mg"/>
                        <NutritionInfoEntry name = "Sodium" value = {dish.nutrition.sodium*scaleFraction} unit = "mg"/>
                        <NutritionInfoEntry name = "Calcium" value = {dish.nutrition.calcium*scaleFraction} unit = "mg"/>
                        <NutritionInfoEntry name = "Vitamin D" value = {dish.nutrition.vitaminD*scaleFraction} unit = "IU"/>
                    </View>
                </View>
        </>}
        </View>
    }

    return <View style = {{
        flex:1,
        flexGrow:1,
        marginTop:85,
        // marginLeft: 20,
        // marginRight: 20,
        // marginBottom:50,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

        paddingHorizontal: 35,
        paddingTop: 30,
    }}>
        <TouchableOpacity style = {{
            marginTop: 20,
            flexDirection: "row",
            alignSelf:"flex-start"
        }}
        onPress = {()=>{
            setModalOpen(null)
        }}>
            <Text style ={{
                color : ds.colors.grayscale1,
                // fontWeight :"bold",
                fontSize : 28,
            }}
            >
                Change{" "}
            </Text>
            <Text style ={{
                color : ds.colors.grayscale1,
                // fontWeight :"bold",
                fontStyle:"italic",
                fontSize : 28,
            }}
            >
                {getFoodCategoryDescription(dishes[0].category)}
            </Text>
        </TouchableOpacity>
        <FlatList style = {{
            width: "100%",
            paddingTop: 10

        }} data = {dishes} renderItem = {renderDish} />
    </View>
}
export default ChangeMenuItem