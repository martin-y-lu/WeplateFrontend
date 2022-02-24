import { View, Text, TouchableOpacity, FlatList } from "react-native";
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
} from './typeUtil';
export const SHADOW_STYLE = {
    backgroundColor:"white",
    shadowColor:"black",
    shadowRadius:5,
    shadowOpacity:0.25,
    shadowOffset:{width:0,height:0},
}


import { SvgXml } from "react-native-svg"
import { BASE_PORTION_FILL_FRACTION } from "../dining-menu/DiningMenu";
import { formatNumber } from "../utils/math";

const ChangeMenuItem = (props : {modalOpen: Portion,setModalOpen?: (Portion) => void, mealState: MealState, setMealState: (MealState) => void ,setMealDishes : (newDishA: Dish, newDishB: Dish, newDishC: Dish) => Promise<void>}) =>{
    const {modalOpen, setModalOpen, mealState, setMealState,setMealDishes} = props
    const portion = modalOpen
    const dishes = getRecommendationsByPortion(mealState,portion)
    const currentDish = getDishByPortion(mealState,portion)
    function renderDish({item , index}:{item:Dish, index : number}){
        const color = item.id === currentDish.id ? colorOfCategory(item.category): null
        const icon = iconOfCategory(item.category)
        return <TouchableOpacity style = {{
            flex:1,
            flexGrow:1,
            alignSelf: "stretch",
            height: 70,
            borderRadius:15,
            flexDirection: "row",

            backgroundColor: color ?? "white",
            shadowColor:"black",
            shadowRadius:5,
            shadowOpacity:0.25,
            shadowOffset:{width:0,height:0},

            marginLeft:20,
            marginRight:20,
            marginTop: 5,
            marginBottom: 5,

            padding:10,
        }} onPress = {async ()=>{
            const tempMealState = setDishByPortion(mealState,modalOpen,item);
            // setMealState()
            await setMealDishes(tempMealState.dishA,tempMealState.dishB,tempMealState.dishC)
            
            setModalOpen(null)// close modal
        }}>
            <View style = {{
                flexDirection:"column",
                justifyContent: "center",
            }}>
                <View style = {{
                    marginBottom: 4,
                }}>
                    <Text style ={{
                        fontSize: 17,
                        fontWeight:"bold",
                        color: color? "white": "#555555"
                    }}>
                        {item.name}
                    </Text>
                </View>
                <View style = {{
                    flexDirection: "row"
                }}>
                    <View style = {{
                        borderRightWidth: 2,
                        paddingRight: 5,
                        marginRight: 5,
                        borderColor: color ? "white" : "#555555"
                    }}>
                        <Text style = {{
                            color: color ? "white" : "#C0C0C0"
                        }}>
                            Station {getNameOfStation(item.station)}
                        </Text>
                    </View>
                    <Text style = {{
                        color: color ? "white" : "#C0C0C0" 
                    }}>
                        {formatNumber(item.nutritionSummary.calories *BASE_PORTION_FILL_FRACTION * fullVolumeByPortion(portion)/item.portion_volume)} Calories
                    </Text>
                </View>
            </View>
            <View style = {{
                marginLeft: "auto",
                justifyContent:"center",
                alignContent:"center",
            }}>
                <SvgXml stroke = {color ? "white" : "#D3D3D3"} xml = {icon}/>
            </View>
        </TouchableOpacity>
    }

    return <View style = {{
        flex:1,
        flexGrow:1,
        marginTop:85,
        marginLeft: 20,
        marginRight: 20,
        marginBottom:50,
        backgroundColor: "white",
        borderRadius: 30,

        alignItems: 'center'
        
    }}>
        <TouchableOpacity style = {{
            marginTop: 20,
        }}>
            <Text style ={{
                color : "#8E8E8E", 
                // fontWeight :"bold",
                fontSize : 20,
            }}
            onPress = {()=>{
                setModalOpen(null)
            }}
            >
                Change Menu Item
            </Text>
        </TouchableOpacity>
        <FlatList style = {{
            width: "100%",
            paddingTop: 10

        }} data = {dishes} renderItem = {renderDish} />
    </View>
}
export default ChangeMenuItem