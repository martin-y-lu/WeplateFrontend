import {useState} from 'react';
import { View,Text,Button, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform} from "react-native"
import { SvgXml } from 'react-native-svg';
import { useRecoilValue, useRecoilState } from 'recoil';
import { setTextRange } from 'typescript';
import { authAtom } from '../utils/session/useFetchWrapper';
import { useUserActions } from '../utils/session/useUserActions';
import { feedbackAtom, FeedbackTypes } from './state';
// import { RadioButton } from 'react-native-paper';

// const bg = { uri: "https://reactjs.org/logo-og.png" };
// const bg2 = require('../faded-backdrop2.png');
// const onPress2 = (str) => alert(str);

const radio_button_icon = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1.5" y="1.5" width="14" height="14" rx="2.5" stroke="white" stroke-width="3"/>
</svg>
`
export const FeedbackRadioButton = ({name, checked, onPress}:{name: string, checked: boolean,onPress: ()=>void})=>{
    return <TouchableOpacity style = {{
        marginVertical: 5,
        flexDirection: "row",
        alignItems: "center"
    }} onPress = {onPress}>
        <SvgXml xml = {radio_button_icon} fill = {checked ? "white" : null} style = {{ marginRight: 10}}/>
        <Text style = {{
            color: "white",
            fontSize: 18,
        }}>
            {name}
        </Text>
    </TouchableOpacity>
}

const feedbackTypes = [FeedbackTypes.COOKING_FOOD_PREP,FeedbackTypes.DINING_HALL_MANAGEMENT,FeedbackTypes.REQUEST_APP_FEATURES,FeedbackTypes.OTHER]

const Feedback = ({navigation})=>{
    const [feedback,setFeedback] = useRecoilState(feedbackAtom)
    const [selFeedbackTypes, setSelFeedbackTypes] = useState({});
    const [text, setText] = useState("");
    const allowContinue = Object.values(selFeedbackTypes).reduce((prev,curr)=> prev || curr, false) as boolean

    return <BaseFeedback allowContinue = {allowContinue } showText = {false} onContinue = {(_text)=>{
        if(FeedbackTypes.OTHER in selFeedbackTypes){
            setFeedback({
                [FeedbackTypes.OTHER]:{
                    feedback: text
                }
            })
        }else{
            setFeedback({})
        }
        const feedbacksList = [FeedbackTypes.COOKING_FOOD_PREP,FeedbackTypes.DINING_HALL_MANAGEMENT,FeedbackTypes.REQUEST_APP_FEATURES].filter(el=> selFeedbackTypes?.[el])
        console.log(feedbacksList)
        navigation.navigate("FeedbackForms",{feedbacksList})

    }}>
        <Text style = {{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginBottom:10,
        }}>
            Type of feedback
        </Text>
        <Text style = {{
            color: "white",
            fontSize: 18,
            fontFamily: 'Avenir',
            marginBottom:10,
        }}>
            All feedback will be carefully reviewed and taken into account by cafeteria management.
        </Text>
        {   
            feedbackTypes.map(feedbackType => {
                return <FeedbackRadioButton key = {feedbackType} name = {feedbackType} checked = {selFeedbackTypes?.[feedbackType]} onPress = {()=>{
                    setSelFeedbackTypes({
                        ...selFeedbackTypes,
                        [feedbackType]: ! selFeedbackTypes?.[feedbackType]  
                    })
                }}/>
            })
        }
        {   selFeedbackTypes?.[FeedbackTypes.OTHER] && 
            <TextInput
                style={[feedbackStyles.input,{marginHorizontal:20}]}
                multiline
                numberOfLines={10}
                maxLength={250}
                onChangeText={setText}
                // value={number}
                keyboardType="default"
            />
        }
        
        </BaseFeedback>
}


export const BaseFeedback = (params: {showText:boolean,textTitle?:string,textDefault?:string, allowContinue : boolean, onContinue?: (string)=> void, children })=>{
    const {showText, textTitle, textDefault, onContinue, allowContinue, children} = params
    // const showText = true;
    // const textTitle = "How was the food?"
    // const textDefault = "I loved the peach cobbler!"
    // const onContinue = (text)=>{}
    // const allowContinue = false;

    const [text, setText] = useState("");

    // setText("")
    // setDone(false)
    // const [checked, setChecked] = React.useState('first');
    return <View style = {{flex:1, backgroundColor:"#FF7070"}}>
    <Image source={require('../faded-backdrop2.png')} style={feedbackStyles.backdrop} />
  
    <KeyboardAvoidingView style = {{flex: 1,flexDirection: "column-reverse"}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
> 
    <View style={{  justifyContent: 'center' }}>
            {/* <ImageBackground source={bg2} resizeMode="stretch" style={styles.image}> */}

        <View style={{alignItems: 'left', margin: 30}}>
            {children}
            { showText && 
                <View style={{alignItems: 'left', width: '100%'}}>
                    <Text style={feedbackStyles.questionText}>{textTitle}</Text>
                    <TextInput
                        style={feedbackStyles.input}
                        multiline
                        numberOfLines={10}
                        maxLength={250}
                        onChangeText={setText}
                        // value={number}
                        placeholder={textDefault}
                        keyboardType="default"
                    />
                </View>
            }
            
            { 
                <View style = {{
                    opacity: allowContinue? 1 : 0.3,
                    alignSelf: 'flex-end',
                }}>
                    <TouchableOpacity 
                        style={{
                            borderWidth:4,
                            borderColor: "white",
                            padding: 10,
                            borderRadius: 10,
                            
                            paddingHorizontal: 25
                        }}
                        onPress={() =>{
                            if(allowContinue){
                                onContinue(text)
                            }
                        } }
                    >
                        <Text style={{
                            color: "white",
                            fontWeight: '900',
                            fontSize: 16
                        }}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        </View>

        
    
        {/* <Image source={require('../faded-backdrop2.png')} style={styles.backdropBottom} /> */}
        {/* <Image></Image> */}

        
    {/* </ImageBackground> */}

    </View>
        </TouchableWithoutFeedback>

    </KeyboardAvoidingView>
    <View style = {{padding: 20}}>
        <Text style = {{color: "white",fontSize: 12}}>
            All feedback is completely anonymous. Responses can never be traced back to your name or email.
        </Text>
    </View>
    </View>
}

export default Feedback

export const feedbackStyles = StyleSheet.create({

    thankYou: {
        fontWeight: '900',
        fontSize: 35,
        color: 'white',
    },

    thank: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500'
    },

    input: {
        marginVertical: 10,
        width: '100%',
        height: 120,
        fontSize: 14,
        borderRadius: 5,
        backgroundColor: 'white',
        padding: 20,
        paddingTop: 20
    },


    continueContainer2: {
        opacity: .5,
        borderWidth: 4,
        borderColor: "white",
        // backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-end',
        paddingHorizontal: 25
    },

    title: {
        color: 'white',
        fontWeight: '800',
        fontSize: 20
    },

    questionText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500'
    },

    backdrop: {
        position: 'absolute',
        left:-500,
        top: -800,

    },

    backdropBottom: {
        position: 'absolute',
        top: 270,

    },

    button: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },

    button2: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },

    text2: {
        color: 'white',
        fontWeight: '400',
        marginLeft: 10,
    },

    hor: {
        flexDirection: 'row',
        // marginTop: 10
    },

    image: {
        flex: 1,
        justifyContent: "center",
      },

    selection: {
        marginTop: 5,
        padding: 5
    }
})