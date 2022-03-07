import { useState } from "react"
import { FeedbackTypes, feedbackAtom, diningHallFeedbacks } from './state';
import { BaseFeedback, FeedbackRadioButton } from './Feedback';
import { View,Text,Button, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform} from "react-native"
import { SvgXml } from 'react-native-svg';
import { useRecoilValue, useRecoilState } from 'recoil';
import { setTextRange } from 'typescript';
import { authAtom } from '../utils/session/useFetchWrapper';
import { useUserActions } from '../utils/session/useUserActions';
import { MealState } from "../dashboard/typeUtil";
import { getTimeInfoOfNow, mealStateFromTimeInfo } from '../dashboard/state';
import { useLogin } from "../utils/session/session";

const FeedbackForms = ({navigation,route}) => {
    const auth = useRecoilValue(authAtom)
    useLogin(navigation)
    const userActions = useUserActions()
    const feedbackValue = useRecoilValue(feedbackAtom)

    const [feedbacksList, setFeedbacksList] = useState<Array<FeedbackTypes>>(route?.params?.feedbacksList ?? [])
    if(feedbacksList.length == 0){
        
        async function postFeedback(){
            console.log("posting feedback")
            await userActions.postAnalyticsTextFeedback(JSON.stringify(feedbackValue))
            navigation.navigate("SidebarNavigable",{screen:"FeedbackThankYou"})
        }
        postFeedback()
        
    }  
    function continueToNext(){
        if(feedbacksList.length != 0){
            const [first, ...rest] = feedbacksList;
            setFeedbacksList(rest)
        }
    }

    let FeedbackComponent = (props :  {continueToNext: ()=> void})=><></>
    switch(feedbacksList[0]){
        case FeedbackTypes.COOKING_FOOD_PREP:
            FeedbackComponent= FeedbackCookingFoodPrep;
            break;
        case FeedbackTypes.DINING_HALL_MANAGEMENT:
            FeedbackComponent= FeedbackDiningHallManagement;
            break;
        case FeedbackTypes.REQUEST_APP_FEATURES: 
            FeedbackComponent= FeedbackAppFeatures
            break;
    }
    return <FeedbackComponent continueToNext = {continueToNext}></FeedbackComponent>
}

function FeedbackCookingFoodPrep(props: {continueToNext: ()=> void}){
    const [feedback,setFeedback] = useRecoilState(feedbackAtom)
    const mealState : MealState= useRecoilValue(mealStateFromTimeInfo(getTimeInfoOfNow()))
    // console.log(mealState)
    const dishNames = [mealState?.dishA?.name,mealState.dishB?.name,mealState.dishC?.name,"Other"].filter(el=> !! el);

    const [selDishNames, setSelDishNames] = useState({})

    const allowContinue = Object.values(selDishNames).reduce((prev,curr)=> prev || curr, false) as boolean
    return <BaseFeedback showText textTitle = "How was the food?" textDefault="I loved the peach cobbler!" allowContinue = {allowContinue} onContinue={(text)=>{
        setFeedback({
            ...feedback,
            [FeedbackTypes.COOKING_FOOD_PREP]:{
                dishNames: dishNames.filter(dishName => dishName in selDishNames),
                feedback:text
            }
        })
        props.continueToNext()
    }}>
       <Text style = {{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginBottom:10,
        }}>
            Select the items you wish to provide feedback on.
        </Text>
        {dishNames.map(dishName=> <FeedbackRadioButton key = {dishName} name = {dishName} checked = {selDishNames?.[dishName]} onPress = {()=>{
            setSelDishNames({
                ...selDishNames,
                [dishName]: ! selDishNames?.[dishName]
            })
        }}/>)}
    </BaseFeedback>
}
function FeedbackDiningHallManagement(props: {continueToNext: ()=> void}){
    const [feedback,setFeedback] = useRecoilState(feedbackAtom)
    const [selDHFeedbacks,setSelDHFeedbacks] = useState({})
    const allowContinue = Object.values(selDHFeedbacks).reduce((prev,curr)=> prev || curr, false) as boolean
    return <BaseFeedback showText textTitle = "What are your thoughts?" textDefault="" allowContinue = {allowContinue} onContinue={(text)=>{
        setFeedback({
            ...feedback,
            [FeedbackTypes.DINING_HALL_MANAGEMENT]:{
                diningHallFeedbacks: diningHallFeedbacks.filter(dhfb => dhfb in selDHFeedbacks),
                feedback: text
            }
        })
        props.continueToNext()
    }}>
        <Text style = {{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginBottom:10,
        }}>
            Select the aspects of the dining hall you wish to provide feedback upon.
        </Text>
        {
            diningHallFeedbacks.map(dhFeedback => <FeedbackRadioButton key = {dhFeedback} name = {dhFeedback} checked = {selDHFeedbacks?.[dhFeedback]} onPress = {()=>{
                setSelDHFeedbacks({
                    ...selDHFeedbacks,
                    [dhFeedback]: ! selDHFeedbacks?.[dhFeedback],
                })
            }}/>)
        }
    </BaseFeedback>
}

const upcomingFeatures = ["Analytics Tracking","Favorites & Foods to Avoid","Learning Modules","Cafeteria Updates (Events, New Foods)","Activity/Updates Logging","Other"]
function FeedbackAppFeatures(props: {continueToNext: ()=> void}){
    const [feedback,setFeedback] = useRecoilState(feedbackAtom)
    const [selFeatures,setSelFeatures] = useState({})
    const allowContinue = Object.values(selFeatures).reduce((prev,curr)=> prev || curr, false) as boolean
    return <BaseFeedback showText textTitle = "Any other suggestions?" textDefault="" allowContinue = {allowContinue} onContinue={(text)=>{
        setFeedback({
            ...feedback,
            [FeedbackTypes.REQUEST_APP_FEATURES]:{
                features: upcomingFeatures.filter((feature)=> feature in selFeatures),
                feedback: text,
            }
        })
        props.continueToNext()
    }}>
        <Text style = {{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginBottom:10,
        }}>
            Select the app features that you hope to see in upcoming versions.
        </Text>
        {
            upcomingFeatures.map(feature=><FeedbackRadioButton key = {feature} name = {feature} checked = {selFeatures?.[feature]} onPress = {()=>{
                setSelFeatures({
                    ...selFeatures,
                    [feature]: ! selFeatures?.[feature],
                })
            }}/>)
        }
    </BaseFeedback>
}

export default FeedbackForms