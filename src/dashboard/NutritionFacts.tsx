import { Animated, ScrollView, Text, TouchableOpacity, View } from "react-native"
import NutritionFactsContainer from "./NutritionFactsContainer"
import { FOOD_CATEGORY, MEAL, STATION, MealState, Dish, NutritionInfo, NutritionSummaryInfo, foodCategories, getFoodCategoryDescription, getDishesFromMealState, getDishesFromMealStateByCategory } from './typeUtil';

export const easter_egg_xml = `<svg width="112" height="85" viewBox="0 0 112 85" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="29.0854" y="42.4222" width="10.5854" height="22.3167" transform="rotate(-17.2827 29.0854 42.4222)" fill="#0CCC09" stroke="black" stroke-width="3"/>
<rect x="75.8633" y="41.3535" width="9.29974" height="20.1671" transform="rotate(21.8913 75.8633 41.3535)" fill="#0CCC09" stroke="black" stroke-width="3"/>
<path d="M60.7011 63.3511L35.5354 47.3815L40.6243 39.6251L71.3552 59.7873L60.7011 63.3511Z" fill="#0CCC09" stroke="black" stroke-width="3"/>
<rect x="74.7634" y="35.8739" width="9.29974" height="35.4816" transform="rotate(89.178 74.7634 35.8739)" fill="#0CCC09" stroke="black" stroke-width="3"/>
<path d="M63.8217 60.9324L53.7325 31.465L62.544 28.3665L74.6979 60.9321L63.8217 60.9324Z" fill="#0CCC09" stroke="black" stroke-width="3"/>
<rect x="55.044" y="22.7653" width="9.29974" height="25.0759" transform="rotate(60.0595 55.044 22.7653)" fill="#0CCC09" stroke="black" stroke-width="3"/>
<rect x="83.722" y="39.6971" width="9.29974" height="25.0759" transform="rotate(127.013 83.722 39.6971)" fill="#0CCC09" stroke="black" stroke-width="3"/>
<path d="M62.0117 30.2629L51.0829 60.6824L40.9857 62.1569L53.1574 27.4624L62.0117 30.2629Z" fill="#0CCC09" stroke="black" stroke-width="3"/>
<path d="M79.0378 47.2279L51.1073 63.8397L41.8691 60.3093L74.0114 39.4738L79.0378 47.2279Z" fill="#0CCC09" stroke="black" stroke-width="3"/>
<circle cx="33.5938" cy="41.4062" r="8.03125" fill="#E40303" stroke="black" stroke-width="4"/>
<circle cx="57.2676" cy="26.2812" r="8.03125" fill="#E40303" stroke="black" stroke-width="4"/>
<circle cx="80.9688" cy="41.4062" r="8.03125" fill="#E40303" stroke="black" stroke-width="4"/>
<path d="M11.5859 63.8148C32.6164 63.5178 68.6393 63.1361 87.5905 63.3037C95.2226 63.3712 100.086 63.5277 100.086 63.8148" stroke="black" stroke-width="7" stroke-linecap="round"/>
<path d="M20.2109 81.6896L14.0859 59.5646C14.7526 58.2312 17.1859 55.6146 21.5859 55.8146C25.9859 56.0146 28.1693 58.3979 28.7109 59.5646L20.2109 81.6896Z" fill="#D60404" stroke="black" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M90.7734 81.6896L84.6484 59.5646C85.3151 58.2312 87.7484 55.6146 92.1484 55.8146C96.5484 56.0146 98.7318 58.3979 99.2734 59.5646L90.7734 81.6896Z" fill="#D60404" stroke="black" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M54.5396 52.6982H35.8935C35.0193 52.6982 34.5659 51.6556 35.1621 51.0163L43.2032 42.3924C43.5619 42.0077 44.1574 41.9667 44.5655 42.2986L55.1705 50.9224C55.9008 51.5163 55.4809 52.6982 54.5396 52.6982Z" fill="#CAEBF0"/>
<path d="M79.8316 52.6982H61.1854C60.3113 52.6982 59.8579 51.6556 60.4541 51.0163L68.4952 42.3924C68.8539 42.0077 69.4494 41.9667 69.8575 42.2986L80.4625 50.9224C81.1928 51.5163 80.7728 52.6982 79.8316 52.6982Z" fill="#CAEBF0"/>
<path d="M47.1775 52.567H41.6488C40.7747 52.567 40.3213 51.5244 40.9174 50.885L43.3017 48.328C43.6604 47.9433 44.2559 47.9022 44.664 48.2341L47.8084 50.7911C48.5387 51.385 48.1188 52.567 47.1775 52.567Z" fill="#9FDFEA"/>
<path d="M72.469 52.567H66.9403C66.0662 52.567 65.6128 51.5244 66.2089 50.885L68.5932 48.328C68.9519 47.9433 69.5474 47.9022 69.9555 48.2341L73.0999 50.7911C73.8302 51.385 73.4103 52.567 72.469 52.567Z" fill="#9FDFEA"/>
<path d="M56.9375 7.5L55.2997 3.56923C55.1177 3.13257 54.4873 3.16933 54.3574 3.62418L53.125 7.9375L56.9375 7.5Z" fill="#C4C4C4"/>
<path d="M100.442 27.8105L99.8337 23.4669C99.7728 23.0317 99.2204 22.8812 98.947 23.2253L95.75 27.25L99.8147 28.3621C100.161 28.4569 100.492 28.1663 100.442 27.8105Z" fill="#C4C4C4"/>
<path d="M9.5 39.75C9.5 39.297 4.57535 32.1752 1.4184 27.6796C1.13697 27.2788 1.54064 26.7454 2.0045 26.9024C5.33945 28.0314 9.92988 29.3287 9.5 28.125C9.13613 27.1062 8.22057 24.4367 7.476 22.2557C7.3032 21.7495 7.93861 21.3637 8.30894 21.7496L18.625 32.5M13.625 16.875L22.9068 27.7238C23.0932 27.9418 23.4244 27.9585 23.6319 27.7604L28.75 22.875M32.625 8.25L39.107 16.4899C39.4005 16.8629 40 16.6554 40 16.1807V6.78574C40 6.29023 40.6433 6.09654 40.9169 6.50969L45.3664 13.2294C45.6242 13.6187 46.2274 13.4737 46.2801 13.0098L47.375 3.375M51.5 13.625L53.125 7.9375M59.125 12.75L56.9375 7.5M56.9375 7.5L55.2997 3.56923C55.1177 3.13257 54.4873 3.16933 54.3574 3.62418L53.125 7.9375M56.9375 7.5L53.125 7.9375M66.375 5.125L63.7712 1.54474C63.5739 1.27349 63.1708 1.26956 62.9683 1.5369L60.5187 4.77028C60.3655 4.97251 60.3881 5.25743 60.5712 5.43305L65.8967 10.5412C66.1364 10.7711 66.0894 11.1666 65.8025 11.3339L63.7214 12.5479C63.519 12.666 63.2618 12.6277 63.1026 12.4558L60.25 9.375M80.7971 8.3125L77.7971 14M74.7971 19.6875L77.7971 14M77.7971 14L83.5471 16.8125M83.5471 16.8125L86.1721 11.4375M83.5471 16.8125L80.7971 22.9375M92.0471 15.3125L91.8279 15.6107M89.2971 29.8125L84.7785 25.9891C84.5778 25.8193 84.5429 25.5231 84.6986 25.3113L88.2346 20.5M88.2346 20.5L92.7971 24.9375M88.2346 20.5L91.8279 15.6107M91.8279 15.6107L95.6721 19.6875M91.8279 32.1875L95.75 27.25M95.75 27.25L98.947 23.2253C99.2204 22.8812 99.7728 23.0317 99.8337 23.4669L100.442 27.8105C100.492 28.1663 100.161 28.4569 99.8147 28.3621L95.75 27.25ZM95.75 27.25V34.4375M101.797 42.5625L98.4123 37.6604C98.2736 37.4595 98.3002 37.1879 98.4752 37.0178L102.672 32.9375M102.672 32.9375L106.745 28.9775C106.968 28.7609 107.332 28.7978 107.507 29.0546L111.172 34.4375M102.672 32.9375L105.797 38.4375" stroke="black" stroke-width="2" stroke-linejoin="round"/>
<path d="M44.8955 58.5664H56.0811M69.2864 58.5664H63.0721M63.0721 58.5664C63.8489 61.3415 64.9364 67.1241 63.0721 68.0534C60.7418 69.2151 56.3918 70.1831 56.0811 66.1173C55.8326 62.8646 55.9776 59.7281 56.0811 58.5664M63.0721 58.5664H56.0811" stroke="#CAEBF0" stroke-width="3"/>
</svg>
`

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
import React, { useRef, useState } from "react"
import { formatNumber } from '../utils/math';
import { SvgXml } from 'react-native-svg';
import { useDesignScheme } from '../design/designScheme';
import { SHADOW_STYLE } from '../utils/Loading';
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
        marginBottom: 10,
        
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

const PercentIndicator = (props: {name: string, value: string|number, ringColor: string})=>{
    const {name,value,ringColor} = props
    const ds = useDesignScheme()
    return <View style = {{alignItems:"center",width: 100}}>
        <View style = {{
            height: 50,
            width: 50, 
            borderWidth:4,
            borderColor: ringColor,
            borderRadius: 50, 
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Text style = {{
                fontFamily: ds.fontFamilies.medium,
                color: ds.colors.grayscale1,
            }}>
                {value}%
            </Text>
        </View>
        <Text style = {{
            fontSize: 12,
            fontFamily: ds.fontFamilies.medium,
            color: ds.colors.grayscale3_4,
        }}>
            {name}
        </Text>
    </View>

}

const DishInfo = (props: {name: string, value: number, unit: string, cat: FOOD_CATEGORY})=>{
    const {name,value,unit,cat} = props
    const ds = useDesignScheme()
    return <View style = {{
        flexDirection: "row",
        width: "100%",
        height: 30,

        alignItems: "center",
    }}>
        <Text style = {{
            color: colorOfCategory(cat),
            fontFamily: ds.fontFamilies.heavy,
            fontSize: 14,
            // backgroundColor: "orange",
            maxWidth: "80%",
        }}
            numberOfLines = {1}
            ellipsizeMode = "tail"
        >
            {name}
        </Text>

        <Text style = {{
            marginLeft: "auto",
            color:ds.colors.grayscale1,
            fontFamily: ds.fontFamilies.medium
        }}>
            { formatNumber(value)} {unit}
        </Text>
    </View>
}
const upArrowSvg = `<svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.07844 4.42113L3.54364 1.39225M6.07847 4.36318L3.54364 1.39225M3.54364 1.39225L3.62492 8.39179" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`
const downArrowSvg = `<svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.68698 5.17259L4.21504 8.19599M1.68683 5.21943L4.21504 8.19599M4.21504 8.19599L4.14933 1.19628" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`

const ButtonRow = (props :{height?: number,bold?:boolean,color ?: string, name ?: string, selector : (arg0:Dish)=> number,  mealState:MealState, unit?:string, opacity?: number, requirement: number}) =>{
    let {height,color,bold, name, selector, mealState, unit, opacity,requirement} = props
    const oValue = useRef(new Animated.Value(0))
    const [open, setOpen] = useState(false);

    opacity = opacity ?? 1.0
    bold = bold ?? true
    const ds = useDesignScheme()
    const total = totalBy(selector,mealState)
    const dishesByCat = getDishesFromMealStateByCategory(mealState)

    const RANGE = 1.2
    const isOver = isFinite(requirement) && isFinite(total) && total > requirement* RANGE
    const isUnder = isFinite(requirement) && isFinite(total) && total < requirement/ RANGE
    const iconColor = isOver ? ds.colors.brand3 :  ( isUnder? ds.colors.accent1:  ds.colors.grayscale4 )


    return   <View style = {{ opacity, borderTopColor: "#D1D1D1", borderTopWidth: bold? 0.5: 0}}>


        <TouchableOpacity style = {{}} onPress = {()=>{
            setOpen( op => !op)
            Animated.timing(oValue.current, {toValue: (!open) ? 1: 0, duration: 200, useNativeDriver: false}).start()
        }}>
            <Animated.View style = {{
                    height: oValue.current.interpolate({inputRange: [0,1],outputRange: [ 50, 220]}),
                    margin: oValue.current.interpolate({inputRange: [0,1],outputRange: [ 0,10]}),
                    borderRadius: 5,
                    backgroundColor:"white",
                    shadowColor:"black",
                    shadowRadius:5,
                    shadowOpacity:oValue.current.interpolate({inputRange: [0,1],outputRange: [ 0, 0.2]}),
                    shadowOffset:{width:0,height:0},

                    
                }}>

            
                <Animated.View style = {{flexDirection: "row",alignItems:"center", width: "100%",  
                                    height: oValue.current.interpolate({
                                        inputRange: [0,1],
                                        outputRange: [50,35]
                                    }),
                                    borderTopRightRadius: 5,
                                    borderTopLeftRadius: 5,
                                    paddingLeft: 10,
                                    backgroundColor: oValue.current.interpolate({
                                        inputRange: [0,1],
                                        outputRange: ["white",ds.colors.accent2]
                                    })}}>
                    <Animated.Text style = {{ 
                        color: oValue.current.interpolate({
                                inputRange: [0,1],
                                outputRange: [ bold ? ds.colors.grayscale1 : ds.colors.grayscale2,"white"]
                            })
                            
                            ,fontFamily: ds.fontFamilies.heavy
                        
                        ,marginRight: 5, fontSize: 16}}>
                        {name}
                    </Animated.Text>
                    <Animated.View style = {{
                        backgroundColor: 
                        oValue.current.interpolate({
                            inputRange: [0,1],
                            outputRange: [iconColor,ds.colors.accent2]
                        }),
                        minWidth: 90,
                        borderRadius: 5,
                        marginLeft: "auto",
                        padding: 5,

                    
                        flexDirection: "row",
                        alignItems: "center",
                    }}>

                        <Animated.Text style = {{ color: oValue.current.interpolate({
                                inputRange: [0,1],
                                outputRange: [ isOver || isUnder ? "white" : "#515151","white"]
                            })
                            
                            ,marginLeft: "auto",fontSize: 16}}>
                            {isFinite(total) && `${formatNumber(total)}` }
                        </Animated.Text>
                        <View style = {{
                            flexDirection: "row",
                            width: 30,
                            justifyContent: "center",
                        }}>

                        <Animated.Text style = {{ color: 
                            oValue.current.interpolate({
                                inputRange: [0,1],
                                outputRange: [ isOver || isUnder ? "white" : ds.colors.grayscale3_4,"white"]
                            })
                            , fontSize: 12}}>
                            {unit}
                        </Animated.Text>
                        {
                            isOver && <SvgXml xml = {upArrowSvg}/>
                        }
                        {
                            isUnder && <SvgXml xml = {downArrowSvg}/>
                        }
                        </View>
                    </Animated.View>
                </Animated.View>

                {
                open && <View style ={{paddingHorizontal: 20,}}>
                    <View style = {{
                        alignSelf: "center",
                        width: "80%",
                        paddingTop: 10,
                        marginBottom: 10,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        
                    }}>
                        { foodCategories.map(cat=>{
                            const totalInCategory = totalBy((dish: Dish) =>( dish.category == cat)? selector(dish): 0, mealState)
                            const fract = Math.round(100*totalInCategory/total)
                            return <PercentIndicator key = {cat} name = { getFoodCategoryDescription(cat)} ringColor={colorOfCategory(cat)} value = {isFinite(fract) ? fract : 0}/>
                        })}
                        
                    </View>
                    <View style = {{ borderColor: "#D1D1D1", borderTopWidth: 0.5}}>
                    {
                         dishesByCat.Carbohydrates.map( dish =>{
                            
                            return <DishInfo key ={dish.id} name = {dish?.name} value = {selector(dish)} unit = {unit} cat = {dish?.category}/>
                        })
                    }
                    </View>
                    <View style = {{ borderColor: "#D1D1D1", borderTopWidth: 0.5}}>
                    {
                        dishesByCat.Protein.map( dish =>{
                            
                            return <DishInfo key ={dish.id} name = {dish?.name} value = {selector(dish)} unit = {unit} cat = {dish?.category}/>
                        })
                    }
                    </View>
                    <View style = {{ borderColor: "#D1D1D1", borderTopWidth: 0.5,borderBottomWidth: 0.5}}>
                    {
                        dishesByCat.Vegetable.map( dish =>{
                            
                            return <DishInfo key ={dish?.id} name = {dish?.name} value = {selector(dish)} unit = {unit} cat = {dish?.category}/>
                        })
                    }
                    </View>
                    
                </View>
            }
            </Animated.View>
           
        </TouchableOpacity>
    </View>
}

function totalBy(func: (Dish)=>number,mealState:MealState){
    let total = 0;
    getDishesFromMealState(mealState).filter(el => el != null).forEach((arg)=>{
        total += func(arg) ??0
    })
    return total
}
export const NutritionFacts = (props) =>{
    const {mealState} : {mealState: MealState} = props 
    const nutrientScale = (dish:Dish)=> (dish?.portion?.nutrientFraction ?? BASE_PORTION_FILL_FRACTION) 
    const nutReq = mealState?.nutritionRequirements
    return <NutritionFactsContainer disabled = {props?.disabled ?? false}> 
    <View style = {{
        flex: 1,
        width : "100%",
        // height: "100%",
        flexDirection: "column",
        alignItems:"flex-start",
        justifyContent: "flex-start",
    }}>
        <View style = {{
            flex: 1,
            width: "100%",
            // height: "100%", 
            paddingVertical: 30,
            paddingLeft: 33,
            alignSelf:"flex-start",
        }}> 
            <ScrollView style = {{
                flex:1,
                flexGrow:1,
                minHeight:300,
                paddingRight: 33
                // maxHeight:500,
            }}>
                <ButtonRow height = {30} name = "Calories" requirement = { nutReq?.calories} unit = "Kcal" mealState = {mealState} selector = {(dish:Dish)=> (dish.nutritionSummary.calories*nutrientScale(dish))}  />
                <ButtonRow height = {30} name = "Total Fat" requirement = { nutReq?.total_fat} unit = "g" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.totalFat*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "    Saturated Fat" requirement = {nutReq?.saturated_fat} bold = {false} unit = "g" color = "#A6A6A6" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.saturatedFat*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "    Trans Fat" requirement = {nutReq?.trans_fat} bold = {false} unit = "g" color = "#A6A6A6" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.transFat*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "Cholesterol" requirement = {nutReq?.cholesterol} unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.cholesterol*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "Sodium" requirement = {nutReq?.sodium} unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.sodium*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "Carbohydrates" requirement = {nutReq?.carbohydrate} unit = "g" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.carbohydrates*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "    Dietary Fiber" requirement = {nutReq?.fiber} bold = {false}unit = "g" color = "#A6A6A6" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.dietaryFiber*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "    Total Sugar" requirement = {nutReq?.sugar} bold = {false} unit = "g" color = "#A6A6A6" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.sugar*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "Protein" requirement = {nutReq?.protein} unit = "g" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.protein*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "Potassium" requirement = {nutReq?.potassium} unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.potassium*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "Calcium" requirement = {nutReq?.calcium} unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.calcium*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "Iron" requirement = {nutReq?.iron} unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.iron*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "Vitamin D" requirement = {nutReq?.vitamin_d} unit = "IU" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.vitaminD*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "Vitamin C" requirement = {nutReq?.vitamin_c} unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.vitaminC*nutrientScale(dish)}  />
                <ButtonRow height = {30} name = "Vitamin A" requirement = {nutReq?.vitamin_a} unit = "IU" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.vitaminA*nutrientScale(dish)}  />
            </ScrollView>
        </View>
    </View> 
    
</NutritionFactsContainer>
}

{/* <View style = {{
        width : "100%",
        height: "100%",
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
                <DataRow height = {30} name = "Carbohydrates" unit = "g" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.carbohydrates*nutrientScale(dish)}  />
                <DataRow height = {30} name = "    Dietary Fiber" bold = {false}unit = "g" color = "#A6A6A6" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.dietaryFiber*nutrientScale(dish)}  />
                <DataRow height = {30} name = "    Total Sugar" bold = {false}unit = "g" color = "#A6A6A6" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.sugar*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Protein" unit = "g" mealState = {mealState} selector = {(dish:Dish)=> dish.nutritionSummary.protein*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Potassium" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.potassium*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Calcium" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.calcium*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Iron" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.iron*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Vitamin D" unit = "IU" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.vitaminD*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Vitamin C" unit = "mg" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.vitaminC*nutrientScale(dish)}  />
                <DataRow height = {30} name = "Vitamin A" unit = "IU" mealState = {mealState} selector = {(dish:Dish)=> dish.nutrition.vitaminA*nutrientScale(dish)}  />
            </ScrollView>
        </View>
        <View style = {{marginTop: "auto",marginBottom:20,marginRight:20,marginLeft: "auto"}}>

        <SvgXml  xml = {easter_egg_xml}/>
        </View>
    </View> */}