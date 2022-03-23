import { useMemo, useState } from "react"
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ImageBackground, Touchable, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useRecoilValue, useRecoilState } from 'recoil';
import { setTextRange } from 'typescript';
import { authAtom } from '../utils/session/useFetchWrapper';
import { useUserActions } from '../utils/session/useUserActions';
import { MealState, getNameOfStation } from '../dashboard/typeUtil';
import { getTimeInfoOfNow, TimeInfo } from '../dashboard/state';
import { useLogin } from "../utils/session/session";
import { LoadingIcon } from "../utils/Loading";
import { useMealFeatures } from '../dashboard/Dashboard';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDesignScheme } from '../design/designScheme';
import { colorOfCategory } from '../dashboard/NutritionFacts';
import { formatNumber } from '../utils/math';
export const IMAGE_ASPECT_RATIO = 1.4;

export const back_icon_svg = `<svg width="18" height="27" viewBox="0 0 18 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 2L4.10542 11.1192C2.53914 12.32 2.53914 14.68 4.10542 15.8808L16 25" stroke-width="4"/>
</svg>
`
const NutritionInfoEntry = ({name, value, unit})=>{
    const ds = useDesignScheme()
    return   <View style = {{flexDirection: "row",alignItems:"center",marginVertical: 3}}>
                    <Text style = {{ color: ds.colors.grayscale1,fontFamily: ds.fontFamilies.medium}}>
                        {name}
                    </Text>
                    <View style = {{
                        backgroundColor: ds.colors.grayscale4,
                        minWidth: 60,
                        borderRadius: 5,
                        marginLeft: "auto",
                        padding: 5,
                    }}>

                        <Text style = {{ color: "#515151",marginLeft: "auto"}}>
                            {isFinite(value) && `${formatNumber(value)}${unit}` }
                        </Text>
                    </View>
                </View>
}
function IndividualItem(props){
    const {width,height} = Dimensions.get("window")
    const inset = useSafeAreaInsets()
    const {navigation,route} = props
    const {timeInfo, itemId} : {timeInfo: TimeInfo, itemId: number}= route.params
    const {mealState,loading,noMeal,setMealDishes, isPast, isPresent, isFuture} = useMealFeatures({timeInfo,onLoad: ()=>{},doFetchMeal: false})
    const item = useMemo(()=>{
        return mealState?.menu?.dishes?.filter((dish)=> dish.id == itemId)?.[0]
    },[mealState])
    const graphic = item?.graphic
    const foodName = item?.name
    const fontSize =   foodName?.length> 20? 20: 28
    const type = item?.category
    const station = item?.station
    const stationName = getNameOfStation(station)
    const calorieCount = item?.nutritionSummary?.calories
    const ds = useDesignScheme()
    const dish = item;
    return <View style = {{backgroundColor: ds.colors.grayscale5}}>
        <View style = {{
            width: "100%",
            aspectRatio: IMAGE_ASPECT_RATIO,
        }}>
            <ImageBackground style = {{
                width: "100%",
                aspectRatio: IMAGE_ASPECT_RATIO,
                opacity: graphic? 1 : 0.5
                }} source = {graphic ? {uri:graphic}: require("../bg.png")} />
        </View>
        <View style = {{
            position: 'absolute',
            top: 250,
            width: "100%",
            height: height-250,
            backgroundColor: ds.colors.grayscale5,
            borderRadius:20,

            padding: 30,
        }}>
             <Text style={{fontSize,fontFamily: ds.fontFamilies.black, color: colorOfCategory(type),marginRight:60}}>{foodName}</Text>
            {station ? <Text style={{color: ds.colors.grayscale3_4, fontSize: 18}}>{ stationName.length <= 2 ?"Station " : null}{stationName}<Text/><Text style={{color: ds.colors.grayscale3_4, fontWeight: '600'}}> | </Text>{formatNumber(calorieCount)} Calories</Text> 
            : <Text style={{color: ds.colors.grayscale3_4, fontSize: 18}}>{formatNumber(calorieCount)} Calories</Text> }

            <Text style = {{fontSize: 18,color: ds.colors.grayscale3_4,marginTop:20,marginBottom:5}}>
                Nutrition Facts
            </Text>
            <View style = {{flexDirection:"row", paddingRight: 20, paddingLeft: 0, }}>
                    <View style = {{flexDirection: "column", flex: 1, paddingRight: 20,}}>
                        <NutritionInfoEntry name = "Total Fats" value = {dish.nutritionSummary.totalFat} unit = "g"/>
                        <NutritionInfoEntry name = "Saturated Fat" value = {dish.nutritionSummary.saturatedFat} unit = "g"/>
                        <NutritionInfoEntry name = "Sugar" value = {dish.nutrition.sugar} unit = "g"/>
                        <NutritionInfoEntry name = "Fiber" value = {dish.nutrition.dietaryFiber} unit = "g"/>
                        <NutritionInfoEntry name = "Potassium" value = {dish.nutrition.potassium} unit = "mg"/>
                        <NutritionInfoEntry name = "Iron" value = {dish.nutrition.iron} unit = "mg"/>
                    </View>
                    <View style = {{flexDirection: "column", flex: 1}}>
                        <NutritionInfoEntry name = "Proteins" value = {dish.nutritionSummary.protein} unit = "g"/>
                        <NutritionInfoEntry name = "Carbohydrates" value = {dish.nutritionSummary.carbohydrates} unit = "g"/>
                        <NutritionInfoEntry name = "Cholesterol" value = {dish.nutrition.cholesterol} unit = "mg"/>
                        <NutritionInfoEntry name = "Sodium" value = {dish.nutrition.sodium} unit = "mg"/>
                        <NutritionInfoEntry name = "Calcium" value = {dish.nutrition.calcium} unit = "mg"/>
                        <NutritionInfoEntry name = "Vitamin D" value = {dish.nutrition.vitaminD} unit = "IU"/>
                    </View>
                </View>
        </View>
        <TouchableOpacity style = {{
            position: 'absolute',
            top: inset.top+10,
            left: 20,
            width: "40%",
            height: "20%",
        }} onPress = {()=>{
            navigation.navigate("SidebarNavigable",{screen: "DiningMenu"})
        }}>
            <SvgXml xml = {back_icon_svg} stroke = {graphic? ds.colors.grayscale5: ds.colors.grayscale2}/>
        </TouchableOpacity>
    </View>
}

export default IndividualItem