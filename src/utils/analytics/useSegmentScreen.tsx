import { useEffect } from "react";
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import * as Segment from "expo-analytics-segment"
export function useSegmentScreen(navigation:NavigationProp<ParamListBase>,screenName:string,properties?: Record<string,any>,options?: Record<string,any>){
    useEffect(()=>{
        const unsub = navigation.addListener('focus',()=>{
            if(properties || options){
                Segment.screenWithProperties(screenName, properties ?? {}, options ?? {})
            }else{
                Segment.screen(screenName)
            }
        })
        return unsub;
    },[navigation]);
}