import { View,Text, StyleSheet,TouchableOpacity, Dimensions,Animated } from "react-native"
import NutritionFactsContainer from "./NutritionFactsContainer"
import PortionView from './PortionView'


export const SHADOW_STYLE = {
    backgroundColor:"white",
    shadowColor:"black",
    shadowRadius:5,
    shadowOpacity:0.25,
    shadowOffset:{width:0,height:0},
}

const TrayItem = (props) => {
    const {isTop, number ,color , dishName, station, calories} = props
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
        <View style = {{
            marginLeft: 10,
            flexDirection: 'column',

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
        </View>
        

    </View>
}



const Dashboard = (props)=>{
    return <View style={{ flex: 1, alignItems: 'center' ,backgroundColor: 'white'}}>
        <View style = {{height: 20}}/>
        <TrayItem isTop number = {1} color = "#FF605B" dishName = "Braised Cauliflower" station = "A" calories = {150}/>
        <TrayItem number = {2} color = "#FDB812" dishName = "Mashed Potatoes" station = "B" calories = {200} />
        <TrayItem number = {3} color =  "#CE014E" dishName = "Swedish Meatballs" station = "D" calories = {500}/>
        <PortionView style = {{ marginTop:10}}/>
        <TouchableOpacity style = {{
            height: 50,
            width: '85%',
            borderRadius: 10,
            backgroundColor:"white",
            ...SHADOW_STYLE,
            alignItems:"center",
            justifyContent: "center"

        }}>
            <Text style ={{
                fontSize: 20,
                color: "#CE014E",
            }}>
                View portions
            </Text>
        </TouchableOpacity>
        <NutritionFactsContainer> 
            <Text>
                sus
            </Text>
        </NutritionFactsContainer>
    </View>
}
const styles = StyleSheet.create({

    button :{
        position: "absolute",
        top: 0,
        left: 0,
        paddingLeft:12,
        paddingTop: 14
    }

})
export default Dashboard