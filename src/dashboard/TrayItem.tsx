import { View,Text, StyleSheet,TouchableOpacity, Dimensions,Animated, Modal, FlatList } from "react-native"
import { colorOfCategory, iconOfCategory, NutritionFacts } from "./NutritionFacts"
import { Dish, Portion } from "./typeUtil"
import { Swipeable } from "react-native-gesture-handler"

const TrayItem = ( props : {isTop ?: boolean, number: number,portion: Portion, dish: Dish, modalOpen}) => {
    const {isTop, number, dish} = props
    let body = <></>
    if(dish!= null){
        const dishName = dish.name
        const station = dish.station
        const calories = dish.nutritionSummary.calories
        const color = colorOfCategory(dish.category)

        const RightActions = ()=>{
            return <View>
                <Text>
                    TESTS
                </Text>
            </View>
        }

        body = <Swipeable renderRightActions={RightActions} 
            containerStyle = {{
                width: "100%"
            }}
        
            childrenContainerStyle = {{
                width:"100%",
                flexDirection:"row",
                flex:1,
                alignItems: "center",
                justifyContent: "flex-start",
                alignSelf: "flex-start",
            }}>
                
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
        </Swipeable> 
    }


    
    // const {isTop, number ,color , dishName, station, calories} = props
    return  <View style = {{
                        flex: 1,
                        maxHeight:  60,
                        width: '100%',
                        flexDirection: "row",
                        // alignItems: "center",
                        // justifyContent: "flex-start",
                        // alignSelf: "flex-start",
                        // backgroundColor: "orange", 
                        // marginTop: 20,
                        borderTopWidth: isTop ? 1: 0 ,
                        borderBottomWidth:1,
                        borderColor: "#EDEDED",

                    }}>
                        {body}

                    <View style = {{
                        width: "auto"
                    }}/>
                </View>
    
   
    
}
export default TrayItem