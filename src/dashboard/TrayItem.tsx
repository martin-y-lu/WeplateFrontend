import { View,Text, StyleSheet,TouchableOpacity, Dimensions,Animated, Modal, FlatList } from "react-native"
import { colorOfCategory, iconOfCategory, NutritionFacts } from "./NutritionFacts"
import { Dish, Portion, getNameOfStation } from './typeUtil';
import { Swipeable } from "react-native-gesture-handler"
import { SvgXml } from "react-native-svg"
import { useRef } from "react"
import { useUserActions } from "../utils/session/useUserActions"
import { BASE_PORTION_FILL_FRACTION } from "../dining-menu/DiningMenu";

const thumbs_down_xml = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="21.5312" y="1.4375" width="5.5625" height="12.125" rx="1" fill="white"/>
<path d="M10.4377 0.937742C14.6563 0.937742 17.9273 1.83358 20.5627 2.28149V13.0318H19.9688C18.6588 13.0318 17.38 15.4911 16.9711 16.2773L16.9688 16.2818C16.5625 17.0631 15.8125 18.9693 15.5625 19.3756C15.3125 19.7818 14.6563 20.0943 14.125 20.5318C13.5938 20.9693 13.0313 21.6568 12.4688 23.1256C11.9063 24.5943 12.1562 26.4381 12 26.6881C11.8438 26.9381 11.6563 27.1568 11.3438 27.1568C11.0313 27.1568 10.4377 27.1256 9.59379 26.6881C8.74986 26.2506 8.15629 24.5631 8.15629 23.5006C8.15629 22.4381 8.25004 20.5943 9.40629 19.3756C10.3313 18.4006 10.2709 17.2193 10.125 16.7506C8.65629 16.6985 5.61861 16.7506 4.21875 16.7506C2.46892 16.7506 1.68754 15.5318 1.46896 15.2818C1.25039 15.0318 0.875088 14.5631 0.875088 13.9381C0.875088 13.3131 1.78129 12.7822 1.84379 12.3135C1.90629 11.8447 0.906338 10.7193 0.875088 10.2818C0.843838 9.8443 2.09369 8.93846 2.12494 8.53221C2.15619 8.12596 1.34396 7.06305 1.46896 6.4693C1.59396 5.87555 2.9375 4.90721 3.09375 4.59471C3.25 4.28221 2.50021 3.68727 3.96896 2.12573C5.43819 0.563675 8.21896 0.937742 10.4377 0.937742Z" fill="white"/>
</svg>
`
const thumbs_up_xml = `<svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="6.24951" y="26.6523" width="5.5625" height="12.125" rx="1" transform="rotate(-180 6.24951 26.6523)" fill="white"/>
<path d="M17.343 27.1521C13.1245 27.1521 9.85346 26.2563 7.21805 25.8083L7.21805 15.058L7.81197 15.058C9.12199 15.058 10.4008 12.5988 10.8096 11.8126L10.812 11.808C11.2182 11.0268 11.9682 9.12054 12.2182 8.71429C12.4682 8.30804 13.1245 7.99554 13.6557 7.55804C14.187 7.12054 14.7495 6.43304 15.312 4.96429C15.8745 3.49554 15.6245 1.65179 15.7808 1.40179C15.937 1.15179 16.1245 0.933038 16.437 0.933038C16.7495 0.933038 17.3431 0.964288 18.187 1.40179C19.0309 1.83929 19.6245 3.52679 19.6245 4.58929C19.6245 5.65179 19.5307 7.49554 18.3745 8.71429C17.4495 9.68929 17.5099 10.8705 17.6557 11.3393C19.1245 11.3914 22.1622 11.3393 23.562 11.3393C25.3118 11.3393 26.0932 12.558 26.3118 12.808C26.5304 13.058 26.9057 13.5268 26.9057 14.1518C26.9057 14.7768 25.9995 15.3076 25.937 15.7764C25.8745 16.2451 26.8744 17.3705 26.9057 17.808C26.9369 18.2455 25.6871 19.1514 25.6558 19.5576C25.6246 19.9639 26.4368 21.0268 26.3118 21.6205C26.1868 22.2143 24.8433 23.1826 24.687 23.4951C24.5308 23.8076 25.2805 24.4026 23.8118 25.9641C22.3426 27.5262 19.5618 27.1521 17.343 27.1521Z" fill="white"/>
</svg>
`
const TrayItem = ( props : {isTop ?: boolean, number: number,portion: Portion, dish: Dish, modalOpen, disabled:boolean, ref?}) => {
    const userActions = useUserActions()
    const {isTop, number, dish, disabled} = props
    let body = <></>
    
    const swipeableRef = useRef(null)
    if(dish!= null){
        const dishName = dish.name
        const station = dish.station
        const stationName = getNameOfStation(station)
        const fillFraction = dish?.portion?.fillFraction ?? BASE_PORTION_FILL_FRACTION 
        const calories = dish.nutritionSummary.calories *( dish?.portion?.nutrientFraction ?? BASE_PORTION_FILL_FRACTION)
        const color = colorOfCategory(dish.category)
        async function castVote(positive:boolean){
            swipeableRef.current.close()
            const resp = await userActions.postAnalyticsMealItemVote(dish.id,positive)
            console.log(resp)
            //todo: somehow give more feedback that your vote did something
        }
        const RightActions = ()=>{
            return <View style = {{
                flexDirection:"row",
            }}>
                <TouchableOpacity style = {{
                    aspectRatio: 1,
                    backgroundColor: "#FF5F00",
                    padding: 13,
                }} onPress = {()=>{castVote(false)}}
                >
                    <SvgXml width = "100%" height = "100%" xml= {thumbs_down_xml}/>
                </TouchableOpacity>
                <TouchableOpacity style = {{
                    aspectRatio: 1,
                    backgroundColor: "#FDB812",
                    padding: 13,
                }} onPress = {()=>{castVote(true)}}>
                    <SvgXml width = "100%" height = "100%" xml= {thumbs_up_xml}/>
                </TouchableOpacity>
            </View>
        }

        body = <Swipeable ref = {swipeableRef} renderRightActions={RightActions} 
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
                backgroundColor:"white",
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
            <TouchableOpacity disabled = {disabled} style = {{
                marginLeft: 10,
                flexDirection: 'column',
                flexShrink: 1,
                paddingRight: 20,
            }} onPress = {()=>{
                props.modalOpen(props.portion)
            }}>
                <Text style = {{
                    fontSize: dishName.length > 30? 15: 20,
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
                            {stationName.length<=2 ? "Station " : ""}{stationName}
                        </Text>
                    </View>
                    <Text style = {{
                        color : "#A4A4A4",
                        marginLeft: 5, 
                    }}>
                        {Math.ceil(calories)} calories
                    </Text>
                    {/* <Text style = {{
                        color : "#A4A4A4",
                        marginLeft: 5, 
                    }}>
                        {fillFraction} fill
                    </Text> */}
                </View>
            </TouchableOpacity>
        </Swipeable> 
    }


    
    // const {isTop, number ,color , dishName, station, calories} = props
    return  <View style = {{
                        // flex: 1,
                        height:  60,
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