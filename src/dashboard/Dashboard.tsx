import { useEffect, useRef, useState } from "react"
import { View,Text, StyleSheet,TouchableOpacity, Dimensions,Animated, Modal, FlatList } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useRecoilState, useRecoilValue } from "recoil"
import { colorOfCategory, iconOfCategory, NutritionFacts } from "./NutritionFacts"
import NutritionFactsContainer, { ARROW_ICON_SVG } from "./NutritionFactsContainer"
import PortionView, { usePortionViewAnimationState } from './PortionView'
import {mealStateFromTimeInfo, TimeInfo, dashboardState, dateToString } from "./state"
import {FOOD_CATEGORY, MEALS, STATION,MealState,Dish,NutritionInfo,NutritionSummaryInfo, convertAPIItemToDish} from './typeUtil'
import {
    Vector3,
    Quaternion,
  } from 'three'
export const SHADOW_STYLE = {
    backgroundColor:"white",
    shadowColor:"black",
    shadowRadius:5,
    shadowOpacity:0.25,
    shadowOffset:{width:0,height:0},
}

const TrayItem = ( props : {isTop ?: boolean, number: number,portion: Portion, dish: Dish, modalOpen}) => {
    const {isTop, number, dish} = props
    let body = <></>
    if(dish!= null){
        const dishName = dish.name
        const station = dish.station
        const calories = dish.nutritionSummary.calories
        const color = colorOfCategory(dish.category)

        body = <>
        <View style = {{
            marginLeft: 25,
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
        <TouchableOpacity style = {{
            marginLeft: 10,
            flexDirection: 'column',
        }} onPress = {()=>{
            props.modalOpen(props.portion)
        }}>
            <Text style = {{
                fontSize: 20,
                color: color,
            }}>
                {dishName}
            </Text>
            <View style = {{
                flexDirection: 'row'
            }}>
                <View style = {{
                    borderRightWidth: 2,
                    borderColor: color,
                }}>
                    <Text style = {{
                        color : "#A4A4A4",
                        marginRight: 5,
                    }}>
                        Station {station}
                    </Text>
                </View>
                <Text style = {{
                    color : "#A4A4A4",
                    marginLeft: 5, 
                }}>
                    {calories} calories
                </Text>
            </View>
        </TouchableOpacity>
        </> 
    }
    // const {isTop, number ,color , dishName, station, calories} = props
    return <View style = {{
        flex: 1,
        maxHeight:  60,
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignSelf: "flex-start",
        // backgroundColor: "orange", 
        // marginTop: 20,
        borderTopWidth: isTop ? 1: 0 ,
        borderBottomWidth:1,
        borderColor: "#EDEDED",

    }}>
        {body}
    </View>
    
}

enum Portion{
    A = "A",
    B = "B",
    C = "C"
}
function getDishByPortion(mealState:MealState,portion:Portion){
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
function setDishByPortion(mealState:MealState,portion:Portion, toSet : Dish){
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

function getRecommendationsByPortion(mealState:MealState,portion:Portion){
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

import { SvgXml } from "react-native-svg"
import { useUserActions } from "../utils/session/useUserActions"
import { authAtom } from "../utils/session/useFetchWrapper"
const ChangeMenuItem = (props : {modalOpen: Portion,setModalOpen?: (Portion) => void, mealState: MealState, setMealState: (MealState) => void }) =>{
    const {modalOpen, setModalOpen, mealState, setMealState} = props
    const dishes = getRecommendationsByPortion(mealState,modalOpen)
    const currentDish = getDishByPortion(mealState,modalOpen)
    function renderDish({item , index}:{item:Dish, index : number}){
        const color = item == currentDish ? colorOfCategory(item.category): null
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
        }} onPress = {()=>{
            setMealState(setDishByPortion(mealState,modalOpen,item))
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
                            Station {item.station}
                        </Text>
                    </View>
                    <Text style = {{
                        color: color ? "white" : "#C0C0C0" 
                    }}>
                        {item.nutritionSummary.calories} Calories
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
const Dashboard = (props)=>{
    const {route,navigation} = props
    const currentState = useRecoilValue(dashboardState);
    const {currentDate,currentMeal} = currentState
    const timeInfo : TimeInfo = route?.params?.timeInfo ?? { date: dateToString(currentDate), meal: currentMeal}

    const auth = useRecoilValue(authAtom)
    const [mealState, setMealState] : [MealState,(MealState) => void]= useRecoilState(mealStateFromTimeInfo(timeInfo))
    
    const [modalOpen,setModalOpen] = useState<Portion>(null)
    const userActions = useUserActions()
    const [viewingPortions,setViewingPortions] = useState(false);

    useEffect( ()=>{
        console.log("Maybe trying fetch.")
        async function fetchMeal(){
            const data = await userActions.mealsByTime(timeInfo)
            if(data.length == 0 ) throw new Error("No meals on this day")
            const mealEvent = await userActions.mealById(data[0].id as number);
            console.log({mealEvent})
            // debug purposes
            const dishes = mealEvent.items.map(convertAPIItemToDish)
            console.log(dishes)
            const newState : MealState = {
                recommendationA: dishes,
                recommendationB: dishes,
                recommendationC: dishes,
                dishA: dishes[0],
                dishB: dishes[0],
                dishC: dishes[0],
            }
            
            setMealState(newState)
        }
        if(mealState.dishA == null){
            fetchMeal()
        }
    },[auth,currentState,timeInfo])
    const portionAnimationState = usePortionViewAnimationState();
    const {
        DEFAULT_TRANSFORM,
        initialRotation,
        rotation,
        rightTrackedAnimation,
        topTrackedAnimation,
        bottomTrackedAnimation,
        centralizeTrackedAnimation,
        resetRotation,
        doesInactivityTimer,
        topCategory,
        setTopCategory,
        setBottomCategory,
        setRightCategory,
    } = portionAnimationState;

    
    const [animateRightSize,rightSizeValue,rightSizeTarg] = rightTrackedAnimation as any
    const [animateTopLeftSize,topLeftSizeValue,topLeftSizeTarg] = topTrackedAnimation as any
    const [animateBottomLeftSize,bottomLeftSizeValue,bottomLeftSizeTarg] = bottomTrackedAnimation as any
    
    const [animateCentralize,centralizeValue,centralizeTarg] = centralizeTrackedAnimation as any

    useEffect(()=>{
        if(mealState?.dishA){
            setTopCategory(mealState.dishA.category)
            if(mealState?.dishA?.recommendation?.fillFraction){
                animateTopLeftSize(mealState.dishA.recommendation.fillFraction,{duration:400})
            }
        }
        if(mealState?.dishB){
            setBottomCategory(mealState.dishB.category)
            if(mealState?.dishB?.recommendation?.fillFraction){
                animateBottomLeftSize(mealState.dishB.recommendation.fillFraction,{duration:400})
            }
        }
        if(mealState?.dishC){
            setRightCategory(mealState.dishC.category)
            if(mealState?.dishC?.recommendation?.fillFraction){
                console.log(mealState?.dishC?.recommendation?.fillFraction)
                animateRightSize(mealState.dishC.recommendation.fillFraction,{duration:400})
            }
        }

    },[mealState])

    function onPortionViewPress(){
        console.log(viewingPortions)
        if(viewingPortions){
            animateCentralize(1,{duration:900})
            portionAnimationState.doesInactivityTimer.current = true
            setViewingPortions(false);
        }else{

           
            animateCentralize(0,{duration:900})
            const portionViewRotation = new Quaternion().setFromAxisAngle(new Vector3(1,0,0),Math.PI*0.25);
            if(centralizeValue.current>0.5){                
                portionAnimationState.setRotation(portionViewRotation)
            }
            portionAnimationState.doesInactivityTimer.current = false
            setViewingPortions(true);
        }
    }

    return <View style={{ flex: 1, alignItems: 'center' ,backgroundColor: 'white'}}>
        <Modal transparent visible = {!!modalOpen} animationType = "fade" 
        >
            <View style = {{
                flex:1,
                backgroundColor: "rgba(0,0,0,0.3)",
                alignItems: 'stretch',
                // justifyContent: 'center'
            }}>
                <ChangeMenuItem modalOpen = {modalOpen} setModalOpen = {setModalOpen} mealState = {mealState} setMealState = {setMealState} />
            </View>
        </Modal>

        <View style = {{height: 20}}/>
        <TrayItem isTop number = {1} dish = {mealState.dishA} portion = {Portion.A} modalOpen = {setModalOpen}/>
        <TrayItem number = {2}  dish = {mealState.dishB} portion = {Portion.B} modalOpen = {setModalOpen} />
        <TrayItem number = {3}  dish = {mealState.dishC} portion = {Portion.C} modalOpen = {setModalOpen}/>
        <PortionView style = {{ marginTop:10}} animationState = {portionAnimationState}/>
        <TouchableOpacity style = {{
            height: 50,
            width: '85%',
            borderRadius: 10,
            backgroundColor:"white",
            ...SHADOW_STYLE,
            alignItems:"center",
            justifyContent: "center"
        }}
            onPress = { onPortionViewPress}
        >
            <Text style ={{
                fontSize: 20,
                color: "#CE014E",
            }}>
                {viewingPortions ? "Hide Portions" : "View portions"}
            </Text>
        </TouchableOpacity>
        <NutritionFacts mealState = {mealState}/>
    </View>
}
export default Dashboard