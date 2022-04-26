import {useEffect, useState} from 'react';
import { View,Text,Button, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform} from "react-native"
import { SvgXml } from 'react-native-svg';
import { useRecoilValue, useRecoilState } from 'recoil';
import { setTextRange } from 'typescript';
import { feedbackStyles } from './Feedback';
import { feedbackAtom, FeedbackTypes } from './state';

const check_icon = `<svg width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.0394 27.4523C13.9713 28.3667 15.515 28.1576 16.1701 27.0284L30.727 1.93517C31.3257 0.903254 32.6888 0.621538 33.6474 1.33161L36.5448 3.47766C37.3708 4.08948 37.5985 5.22782 37.0714 6.11032L17.5227 38.8416C16.8632 39.9458 15.348 40.1495 14.4204 39.2587L1.31151 26.67C0.567866 25.9559 0.488948 24.7935 1.12924 23.9854L3.41228 21.1041C4.15018 20.1728 5.53248 20.0864 6.38058 20.9186L13.0394 27.4523Z" fill="white"/>
</svg>
`

const FeedbackThankYou = (params)=>{
  
    return <View style = {{flex:1, backgroundColor:"#FF7070"}}>
    <Image source={require('../../assets/faded-backdrop.png')} style={feedbackStyles.backdrop} />
    <Image source={require('../../assets/faded-backdrop2.png')} style={[feedbackStyles.backdrop, {top: 350}]} />
  
    <KeyboardAvoidingView style = {{flex: 1,flexDirection: "column-reverse"}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
> 
    <View style={{ flex: 1, justifyContent: 'center' ,padding:40}}>
        <View style = {{
            flexDirection: "row",
            marginBottom: 16,
        }}>
            <Text style = {{
                fontSize: 36,
                color : "white",
                marginRight: 25
            }}>
                Thank You
            </Text>
            <SvgXml xml = {check_icon}/>
        </View>
        <Text style = {{
            fontSize: 16,
            color:"white"
        }}>
            Trim Dining Hall will make improvements to your dining experience based on your feedback.
        </Text>

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

export default FeedbackThankYou