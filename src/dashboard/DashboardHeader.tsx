import { View,Text, TouchableOpacity, StyleSheet, StyleProp, Touchable } from "react-native"
import { SvgXml } from "react-native-svg"
import {FOOD_CATEGORY, MEAL, STATION,MealState,Dish,NutritionInfo,NutritionSummaryInfo, MEALS} from './typeUtil'
import { dashboardStateAtom, dateToString, stringToDate, TimeInfo} from "./state"
import { useRecoilState, useRecoilValue } from "recoil"
import { ARROW_ICON_SVG } from "./NutritionFactsContainer"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { SHADOW_STYLE } from "./Dashboard"
import BaseHeader from '../utils/BaseHeader';
import { Rname } from "../settings/state"
import { useDesignScheme } from '../design/designScheme';
const HAMBURGER_MENU_SVG = '<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.95835 9.42706H31.0417C31.617 9.42706 32.0834 8.96072 32.0834 8.3854V5.78123C32.0834 5.2059 31.617 4.73956 31.0417 4.73956H3.95835C3.38303 4.73956 2.91669 5.2059 2.91669 5.78123V8.3854C2.91669 8.96072 3.38303 9.42706 3.95835 9.42706ZM3.95835 19.8437H31.0417C31.617 19.8437 32.0834 19.3774 32.0834 18.8021V16.1979C32.0834 15.6226 31.617 15.1562 31.0417 15.1562H3.95835C3.38303 15.1562 2.91669 15.6226 2.91669 16.1979V18.8021C2.91669 19.3774 3.38303 19.8437 3.95835 19.8437ZM3.95835 30.2604H31.0417C31.617 30.2604 32.0834 29.7941 32.0834 29.2187V26.6146C32.0834 26.0392 31.617 25.5729 31.0417 25.5729H3.95835C3.38303 25.5729 2.91669 26.0392 2.91669 26.6146V29.2187C2.91669 29.7941 3.38303 30.2604 3.95835 30.2604Z" fill="#A4A4A4"/></svg>'
const STREAK_FIRE_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.35925 8.28689L8.35703 8.2887L8.35492 8.29075L8.35925 8.28689ZM18.1857 8.10275C18.1171 8.03656 18.0409 7.97864 17.9587 7.93018C17.8424 7.86173 17.7133 7.81787 17.5793 7.8013C17.4454 7.78473 17.3095 7.79581 17.18 7.83385C17.0506 7.87189 16.9303 7.93608 16.8266 8.02246C16.7229 8.10884 16.638 8.21557 16.5772 8.33605C16.2372 9.00604 15.7682 9.6023 15.1971 10.0906C15.2845 9.5986 15.3285 9.09989 15.3287 8.60019C15.3306 7.08004 14.9295 5.58654 14.1665 4.27177C13.4034 2.957 12.3056 1.86791 10.9848 1.1154C10.8393 1.03292 10.6752 0.988753 10.5079 0.987051C10.3407 0.985348 10.1758 1.02616 10.0286 1.10567C9.88145 1.18517 9.75691 1.30075 9.66667 1.44157C9.57642 1.58239 9.52343 1.74383 9.51267 1.91074C9.45743 2.84676 9.21273 3.76182 8.7934 4.60047C8.37407 5.43913 7.78885 6.18393 7.07318 6.78974L6.84567 6.97483C6.0973 7.47838 5.43488 8.09913 4.88384 8.81326C4.02728 9.89235 3.43392 11.1562 3.15081 12.5045C2.8677 13.8528 2.90262 15.2486 3.25282 16.581C3.60302 17.9135 4.25885 19.1461 5.16832 20.181C6.07778 21.2159 7.21586 22.0246 8.49229 22.5432C8.64216 22.6044 8.8048 22.6278 8.96586 22.6113C9.12692 22.5949 9.28146 22.539 9.41583 22.4487C9.5502 22.3584 9.66028 22.2364 9.73636 22.0935C9.81245 21.9506 9.85219 21.7911 9.85209 21.6292C9.85138 21.5245 9.83481 21.4205 9.80293 21.3207C9.58207 20.4906 9.51847 19.6264 9.61542 18.7728C10.5495 20.5346 12.0489 21.9312 13.8726 22.7379C14.0952 22.8375 14.3469 22.8509 14.5788 22.7755C16.0196 22.3104 17.3176 21.4847 18.3495 20.3767C19.3813 19.2687 20.1127 17.9153 20.4741 16.445C20.8355 14.9747 20.815 13.4365 20.4145 11.9764C20.014 10.5163 19.2468 9.18283 18.1857 8.10275ZM14.331 20.7693C13.4705 20.3332 12.7114 19.7209 12.1031 18.9721C11.4948 18.2234 11.0509 17.355 10.8002 16.4234C10.7237 16.1097 10.6644 15.7921 10.6228 15.4719C10.5946 15.268 10.5034 15.078 10.3619 14.9285C10.2205 14.779 10.0358 14.6774 9.83376 14.638C9.77152 14.6257 9.70822 14.6196 9.64478 14.6197C9.47128 14.6196 9.30083 14.6653 9.15061 14.7521C9.0004 14.839 8.87574 14.9639 8.7892 15.1143C7.9701 16.527 7.55818 18.139 7.59908 19.7715C6.87868 19.2114 6.27661 18.5139 5.82776 17.7194C5.37892 16.9249 5.09223 16.0492 4.98431 15.1431C4.87639 14.2369 4.94939 13.3184 5.19907 12.4407C5.44876 11.563 5.87016 10.7436 6.43886 10.0299C6.87067 9.46902 7.39158 8.9828 7.98083 8.5906C8.00635 8.57413 8.03082 8.5561 8.0541 8.53661C8.0541 8.53661 8.34699 8.29428 8.357 8.28873C9.76343 7.09914 10.7637 5.50045 11.2186 3.71543C12.2942 4.70975 13.0114 6.03138 13.2588 7.47511C13.5063 8.91884 13.2701 10.4039 12.587 11.6996C12.4968 11.8725 12.4598 12.0683 12.4806 12.2622C12.5015 12.4561 12.5794 12.6395 12.7043 12.7893C12.8293 12.939 12.9958 13.0484 13.1829 13.1036C13.37 13.1588 13.5692 13.1573 13.7554 13.0995C15.2676 12.6254 16.5982 11.6995 17.5682 10.4464C18.1512 11.3075 18.5324 12.2891 18.6833 13.318C18.8342 14.3469 18.7509 15.3965 18.4398 16.3888C18.1286 17.381 17.5975 18.2903 16.8861 19.0487C16.1747 19.8072 15.3013 20.3953 14.331 20.7693L14.331 20.7693Z" fill="white"/></svg>'
const MONTH_ABBREV = ["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."]
const MONTH_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
const STREAK_ELEMENT_WIDTH = 100
const HEADER_HEIGHT = 64;

const more_info_icon = `<svg width="35" height="36" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="17.625" cy="17.9375" r="16.125" stroke="#CCCCCC" stroke-width="2.5"/>
<path d="M16.4558 19.78C16.4558 19.4067 16.4758 19.1 16.5158 18.86C16.5691 18.62 16.6491 18.4067 16.7558 18.22C16.8624 18.02 17.0024 17.8267 17.1758 17.64C17.3491 17.4533 17.5691 17.2267 17.8358 16.96C18.0358 16.7467 18.2358 16.54 18.4358 16.34C18.6491 16.1267 18.8358 15.9067 18.9958 15.68C19.1691 15.4533 19.3091 15.2133 19.4158 14.96C19.5224 14.7067 19.5758 14.42 19.5758 14.1C19.5758 13.46 19.3891 12.94 19.0158 12.54C18.6424 12.1267 18.1224 11.92 17.4558 11.92C16.7758 11.92 16.2224 12.12 15.7958 12.52C15.3824 12.92 15.1224 13.4467 15.0158 14.1L13.2158 13.9C13.3091 13.3533 13.4758 12.8667 13.7158 12.44C13.9691 12.0133 14.2824 11.66 14.6558 11.38C15.0291 11.0867 15.4558 10.8667 15.9358 10.72C16.4158 10.56 16.9291 10.48 17.4758 10.48C18.0224 10.48 18.5291 10.56 18.9958 10.72C19.4758 10.8667 19.8891 11.0933 20.2358 11.4C20.5958 11.6933 20.8758 12.0667 21.0758 12.52C21.2758 12.96 21.3758 13.4667 21.3758 14.04C21.3758 14.48 21.3091 14.88 21.1758 15.24C21.0558 15.5867 20.8891 15.9133 20.6758 16.22C20.4758 16.5133 20.2358 16.8 19.9558 17.08C19.6758 17.3467 19.3891 17.62 19.0958 17.9C18.8824 18.1 18.7091 18.2733 18.5758 18.42C18.4558 18.5667 18.3624 18.72 18.2958 18.88C18.2291 19.04 18.1824 19.22 18.1558 19.42C18.1424 19.6067 18.1358 19.84 18.1358 20.12V21.04H16.4558V19.78ZM17.2958 22.72C17.6291 22.72 17.9091 22.84 18.1358 23.08C18.3758 23.3067 18.4958 23.5867 18.4958 23.92C18.4958 24.2533 18.3691 24.54 18.1158 24.78C17.8758 25.0067 17.6024 25.12 17.2958 25.12C16.9891 25.12 16.7091 25.0067 16.4558 24.78C16.2158 24.54 16.0958 24.2533 16.0958 23.92C16.0958 23.5867 16.2091 23.3067 16.4358 23.08C16.6758 22.84 16.9624 22.72 17.2958 22.72Z" fill="#CCCCCC"/>
</svg>
`
const CALENDAR_ICON_SVG =  `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.9062 1.21875V5.09375M5.625 1.21875V5.09375M1.03125 7.4375C1.03125 10.459 1.03125 15.9878 1.03125 17C1.03125 18.3125 2.4375 19.7812 3.96875 19.7812C5.5 19.7812 15.5938 19.7812 16.7812 19.7812C17.9688 19.7812 19.5312 18 19.5312 17C19.5312 16.2278 19.5312 10.5169 19.5312 7.4375M1.03125 7.4375C1.03125 6.54114 1.03125 5.86543 1.03125 5.59375C1.03125 4.40625 2.53125 2.8125 3.96875 2.8125C7.6875 2.8125 15.4562 2.8125 16.7812 2.8125C18.4375 2.8125 19.5312 4.46875 19.5312 5.59375C19.5312 5.84998 19.5312 6.52929 19.5312 7.4375M1.03125 7.4375H19.5312M4.79688 11.3125H6.45312M9.46875 11.3125H11.0781M14.0312 11.3125H15.5625M4.79688 15.9375H6.45312M9.46875 15.9375H11.0781M14.0312 15.9375H15.5625" stroke-width="1.7" stroke-linecap="round"/>
</svg>
`
const BubbleButton = (props) => {
    const ds = useDesignScheme()
    return <View style = {{opacity: props?.highlighted ? 1.0:  props.theme == "dark" ? 0.5: 0.3,}}>
        <TouchableOpacity disabled = {props?.disabled} style = {{
            backgroundColor: props.theme == "dark" ? ds.colors.grayscale5 : ds.colors.grayscale4,
            height: 30,
            borderRadius: 15,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems:"center",
            marginRight: 5,
        }} onPress = {props.onPress}> 
            <Text style = {{
                fontSize: 14,
                fontFamily: ds.fontFamilies.medium,
                color: ds.colors.grayscale2,
            }}>
                {props.text}
            </Text>
        </TouchableOpacity>
    </View>
}

const DashboardHeader = (props) =>{
    const {route,navigation,options} = props
    const name = useRecoilValue(Rname)

    let {theme} : {theme: "light" | "dark" | null} = options?.headerTitleStyle ??  {theme: "dark"}
    theme ??= "dark"

    const insets = useSafeAreaInsets() 
    const {streakLength} = useRecoilValue(dashboardStateAtom)
    const [state,setDashboardState] = useRecoilState(dashboardStateAtom)
    const {currentDate,currentMeal, viewingDate,viewingMeal} =state
    const timeInfo : TimeInfo = {date: dateToString(viewingDate)??dateToString(currentDate) ,meal:viewingMeal ??currentMeal }
    console.log({timeInfo,state})
    // const timeInfo : TimeInfo = route?.params?.timeInfo ?? { date: dateToString(currentDate), meal: currentMeal}
    const date = stringToDate(timeInfo.date)
    const meal = timeInfo.meal

    function getPrevTimeInfo(){
        const prevDay = new Date(date)
        let prevMeal = null
        switch(meal){
            case MEAL.Breakfast:
                prevDay.setDate(date.getDate()-1)
                prevMeal = MEAL.Dinner
                break;
            case MEAL.Lunch:
                prevMeal = MEAL.Breakfast
                break;
            case MEAL.Dinner:
                prevMeal = MEAL.Lunch
                break;
        }
        return {date: dateToString(prevDay), meal: prevMeal } as TimeInfo
    }
    function getNextTimeInfo(){
        const nextDay = new Date(date)
        let nextMeal = null
        switch(meal){
            case MEAL.Breakfast:
                nextMeal = MEAL.Lunch
                break;
            case MEAL.Lunch:
                nextMeal = MEAL.Dinner
                break;
            case MEAL.Dinner:
                nextMeal = MEAL.Breakfast
                nextDay.setDate(date.getDate()+1)
                break;
        }
        return {date: dateToString(nextDay), meal: nextMeal } as TimeInfo
    }

    const ds = useDesignScheme()
    return  <BaseHeader {...props}>
        <View style = {{
            marginTop: 6,
            marginLeft: 34,
            flex: 1,
        }}>
            <Text style = {{
                fontSize: 20,
                fontFamily: ds.fontFamilies.medium,
                color: theme == "dark"? ds.colors.grayscale5: ds.colors.grayscale1,
            }}>
                Hi {name}!
            </Text>
            <View style = {{
                flexDirection:"row",
                alignItems: "center",
            }}>
                <Text style = {{
                    fontSize: 32,
                    fontFamily: ds.fontFamilies.black,
                    color: theme == "dark" ? ds.colors.grayscale5 : ds.colors.grayscale1,

                }}>
                    {date ? `${DAY_NAMES[date.getDay()]}, ${MONTH_FULL[date.getMonth()]} ${date.getDate()}` : "loading" }
                </Text>
                <TouchableOpacity style = {{
                    // backgroundColor: "orange",
                    paddingHorizontal: 14,
                    paddingVertical: 5,
                }}>
                    <SvgXml xml = {CALENDAR_ICON_SVG} stroke = { theme == "dark" ? ds.colors.grayscale5 : ds.colors.grayscale1}/>
                </TouchableOpacity>
            </View>
            <View style = {{
                flexDirection:"row",
                alignItems: "center",
            }}>
                {   
                    MEALS.map((_meal)=>{
                        return <BubbleButton theme = {theme} key = {_meal} text = {_meal} highlighted = {_meal == meal} onPress = {
                            ()=>{
                                if(_meal != meal){
                                    const newState = {
                                        ...state,
                                        viewingMeal: _meal,
                                    }
                                    console.log({newState})
                                    setDashboardState(newState)
                                }
                            }
                        }/>
                    })
                }
            </View>
        </View>
         {/* <View style= {{
                flex:1,
                flexDirection: "row",
                alignItems:"center",
                justifyContent:"center",
                // backgroundColor:"orange",
            }}>
                <TouchableOpacity style= {{
                    paddingBottom: 10,
                    paddingLeft:10,
                    paddingRight: 10,
                    paddingTop: 20, 
                    transform: [{rotate:-Math.PI/2}]
                }} onPress = {()=>{
                    navigation.navigate("SidebarNavigable",{screen : "Dashboard", params:{
                        timeInfo: getPrevTimeInfo()
                    }})
                }}>
                    <SvgXml xml = {ARROW_ICON_SVG}/>
                </TouchableOpacity>
                <TouchableOpacity style= {{
                    flexDirection:'column',
                    alignItems:"center",
                    justifyContent:"center"
                }}
                onPress = {()=>{
                    navigation.navigate("SidebarNavigable",{screen: "Dashboard"})
                }}
                >
                    <Text style = {{fontSize: 25,color:"#606060"}}>
                        {date ? <>{MONTH_ABBREV[date.getMonth()]} {date.getDate()}</> : "loading" }
                    </Text>
                    <Text style = {{fontSize: 15,color:"#606060"}}>
                        {meal}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style= {{
                    paddingBottom: 10,
                    paddingLeft:10,
                    paddingRight: 10,
                    paddingTop: 20,
                    transform: [{rotate:Math.PI/2}]
                }}
                onPress = {()=>{
                    navigation.navigate("SidebarNavigable",{screen : "Dashboard", params:{
                        timeInfo: getNextTimeInfo()
                    }})
                }}>
                    <SvgXml xml = {ARROW_ICON_SVG}/>
                </TouchableOpacity>
            </View> */}
    </BaseHeader>
    // <SafeAreaView style = {{ backgroundColor:"white",...SHADOW_STYLE, height: HEADER_HEIGHT+insets.top}}>
    //     <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',height: HEADER_HEIGHT}}>
         
    //         <View style = {{
    //             position: "absolute",
    //             width: "100%",
    //             height: 60,
    //             // backgroundColor: "orange",
    //             flexDirection:"row",
    //             zIndex:1,

    //         }} pointerEvents = "box-none">
    //             <TouchableOpacity
    //                 style={{
    //                     width: STREAK_ELEMENT_WIDTH,
    //                     height: 60,
    //                     // justifyContent: "flex-start",
    //                     paddingLeft:12,
    //                     paddingTop: 14,
                        
    //                 }}
    //                 onPress={() => navigation.toggleDrawer()}
    //                 >
    //                 <SvgXml xml = {HAMBURGER_MENU_SVG}/>
    //             </TouchableOpacity>
    //             {/* <TouchableOpacity style = {{
    //                 marginLeft: "auto",
    //                 width: 60,
    //                 height: 60,
    //                 // backgroundColor:"orange",
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //             }}
    //                 onPress = {()=>{
    //                     navigation.navigate("SidebarNavigable",{screen: "Dashboard", params: {timeInfo, doOnboarding:true}})
    //                 }}
    //             >
    //                 <SvgXml xml = {more_info_icon}/>
    //             </TouchableOpacity> */}
    //         </View>

    //         <View style= {{
    //             flex:1,
    //             flexDirection: "row",
    //             alignItems:"center",
    //             justifyContent:"center",
    //             // backgroundColor:"orange",
    //         }}>
    //             <TouchableOpacity style= {{
    //                 paddingBottom: 10,
    //                 paddingLeft:10,
    //                 paddingRight: 10,
    //                 paddingTop: 20, 
    //                 transform: [{rotate:-Math.PI/2}]
    //             }} onPress = {()=>{
    //                 navigation.navigate("SidebarNavigable",{screen : "Dashboard", params:{
    //                     timeInfo: getPrevTimeInfo()
    //                 }})
    //             }}>
    //                 <SvgXml xml = {ARROW_ICON_SVG}/>
    //             </TouchableOpacity>
    //             <TouchableOpacity style= {{
    //                 flexDirection:'column',
    //                 alignItems:"center",
    //                 justifyContent:"center"
    //             }}
    //             onPress = {()=>{
    //                 navigation.navigate("SidebarNavigable",{screen: "Dashboard"})
    //             }}
    //             >
    //                 <Text style = {{fontSize: 25,color:"#606060"}}>
    //                     {date ? <>{MONTH_ABBREV[date.getMonth()]} {date.getDate()}</> : "loading" }
    //                 </Text>
    //                 <Text style = {{fontSize: 15,color:"#606060"}}>
    //                     {meal}
    //                 </Text>
    //             </TouchableOpacity>
    //             <TouchableOpacity style= {{
    //                 paddingBottom: 10,
    //                 paddingLeft:10,
    //                 paddingRight: 10,
    //                 paddingTop: 20,
    //                 transform: [{rotate:Math.PI/2}]
    //             }}
    //             onPress = {()=>{
    //                 navigation.navigate("SidebarNavigable",{screen : "Dashboard", params:{
    //                     timeInfo: getNextTimeInfo()
    //                 }})
    //             }}>
    //                 <SvgXml xml = {ARROW_ICON_SVG}/>
    //             </TouchableOpacity>
    //         </View>
    //         {/* <TouchableOpacity style = {{
    //                 width: STREAK_ELEMENT_WIDTH,
    //                 flexDirection:"row",
    //                 justifyContent: 'flex-end'
    //             }}>
    //             <View style = {{
    //                 marginLeft: "auto",
    //                 marginRight:15,
    //                 backgroundColor:"#FF3939",
    //                 height: 35,
    //                 maxWidth:66,
    //                 flex:1,
    //                 flexDirection:"row",
    //                 justifyContent:"flex-start",
    //                 alignItems:"center",
    //                 borderRadius: 5,

    //                 paddingLeft:5,
    //             }}>
    //                 <SvgXml xml = {STREAK_FIRE_SVG}/>
    //                 <Text style = {{marginLeft: 4,color:"white",fontSize:18}}>
    //                     {streakLength}
    //                 </Text>
    //             </View>
    //         </TouchableOpacity> */}
          
    //     </View>

        
           
    // </SafeAreaView>
}

export default DashboardHeader