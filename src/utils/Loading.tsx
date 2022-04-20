import { View, Text, TouchableOpacity, FlatList, Animated } from "react-native";
export const SHADOW_STYLE = {
    backgroundColor:"white",
    shadowColor:"black",
    shadowRadius:5,
    shadowOpacity:0.25,
    shadowOffset:{width:0,height:0},
}


import { SvgXml } from "react-native-svg"
import {useEffect} from 'react';
import {useRef} from 'react';

export const loading_icon_svg = `<svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36.4624 18.5315C36.4624 28.3519 28.5014 36.313 18.6809 36.313C8.86046 36.313 0.899414 28.3519 0.899414 18.5315C0.899414 8.71105 8.86046 0.75 18.6809 0.75C28.5014 0.75 36.4624 8.71105 36.4624 18.5315ZM6.23386 18.5315C6.23386 25.4058 11.8066 30.9785 18.6809 30.9785C25.5552 30.9785 31.128 25.4058 31.128 18.5315C31.128 11.6572 25.5552 6.08445 18.6809 6.08445C11.8066 6.08445 6.23386 11.6572 6.23386 18.5315Z" fill="#D6D3D3"/>
<path d="M20.0143 3.47616C20.1443 2.00884 21.4475 0.904875 22.879 1.25266C25.2891 1.83823 27.5601 2.92407 29.5397 4.45069C31.5193 5.97731 33.1466 7.89774 34.3255 10.0799C35.0256 11.3759 34.2891 12.917 32.903 13.4156V13.4156C31.5169 13.9142 30.0114 13.1725 29.2294 11.9241C28.4508 10.681 27.4547 9.57925 26.282 8.67493C25.1094 7.77062 23.7907 7.08725 22.3905 6.65008C20.9844 6.21105 19.8844 4.94348 20.0143 3.47616V3.47616Z" fill="white"/>
</svg>
`

export const LoadingIcon = (props)=>{
    const angle  =  useRef(new Animated.Value(0))
    const length = 1000*40;
    useEffect(()=>{
        Animated.timing(angle.current,{
            toValue: 0.02*length,
            duration: length,
            useNativeDriver: true,
        }).start()
    },[])
 
    return <Animated.View style = {{
        transform : [{rotate: angle.current}]
    }}> 
        <SvgXml xml = {loading_icon_svg}/>
    </Animated.View>
    
}