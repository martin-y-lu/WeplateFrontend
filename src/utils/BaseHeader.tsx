import { useNetInfo } from "@react-native-community/netinfo"
import { useRef } from "react"
import { View,Text, TouchableOpacity, Dimensions,Animated} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgXml } from "react-native-svg"
import {useEffect} from 'react';
import { useDesignScheme } from "../design/designScheme"
import { hexToRgb } from "./math"
const HAMBURGER_MENU_SVG = '<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.95835 9.42706H31.0417C31.617 9.42706 32.0834 8.96072 32.0834 8.3854V5.78123C32.0834 5.2059 31.617 4.73956 31.0417 4.73956H3.95835C3.38303 4.73956 2.91669 5.2059 2.91669 5.78123V8.3854C2.91669 8.96072 3.38303 9.42706 3.95835 9.42706ZM3.95835 19.8437H31.0417C31.617 19.8437 32.0834 19.3774 32.0834 18.8021V16.1979C32.0834 15.6226 31.617 15.1562 31.0417 15.1562H3.95835C3.38303 15.1562 2.91669 15.6226 2.91669 16.1979V18.8021C2.91669 19.3774 3.38303 19.8437 3.95835 19.8437ZM3.95835 30.2604H31.0417C31.617 30.2604 32.0834 29.7941 32.0834 29.2187V26.6146C32.0834 26.0392 31.617 25.5729 31.0417 25.5729H3.95835C3.38303 25.5729 2.91669 26.0392 2.91669 26.6146V29.2187C2.91669 29.7941 3.38303 30.2604 3.95835 30.2604Z"/></svg>'
const LEFT_CORNER_SVG =  `<svg width="37" height="32" viewBox="0 0 37 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.875 0H36.25C30.375 0 27.0256 1.11622 22.3438 3.40625C14.9237 7.03563 11.4131 12.615 10.4688 14.4688C9.625 16.125 6.25 20.375 6.25 31.875H0.875V0Z"/>
</svg>

`
const RIGHT_CORNER_SVG =  `<svg width="37" height="32" viewBox="0 0 37 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36.25 0H0.875C6.75 0 10.0994 1.11622 14.7812 3.40625C22.2013 7.03563 25.7119 12.615 26.6562 14.4688C27.5 16.125 30.875 20.375 30.875 31.875H36.25V0Z"/>
</svg>
`
const BaseHeader = (props : {options?: any, overlayComponents?, children?,navigation?}) =>{
    const ds = useDesignScheme()
    const inset = useSafeAreaInsets()
    const netInfo = useNetInfo();
    const noConnectionAppearAnimRef = useRef(new Animated.Value(0))
    useEffect(()=>{
        if(netInfo?.isConnected ?? true){
            Animated.timing(noConnectionAppearAnimRef.current,{
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }else{
            Animated.timing(noConnectionAppearAnimRef.current,{
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }
    },[netInfo])
    const {options} = props
    let {opacity,color,backgroundColor } = options?.headerTitleStyle ??  {opacity: 1, color: ds.colors.grayscale5}
    const height = options?.height ?? 120

    const showInverseBorders = true
    const showDropShadow = false
    const dropshadowStyle = {   
                                shadowColor:"black",
                                shadowRadius:5,
                                shadowOpacity:0.5*opacity,
                                height: height+inset.top,
                            }

    // const backgroundColor = ds.colors.accent2;
    backgroundColor ??= ds.colors.accent2 
    const backgroundRGB = hexToRgb(backgroundColor);
    const opacityBGC = `rgba(${backgroundRGB.r},${backgroundRGB.g},${backgroundRGB.b},${Math.floor(opacity ?? 1 *255)})`
//     {
//         width: "100%",
//         backgroundColor: "#EAEAEA",
//         opacity: noConnectionAppearAnimRef.current.interpolate({
//             inputRange: [0,1],
//             outputRange: [0,0.8],
//             extrapolate: "clamp"
//         }),
//         alignItems: "center",
//         paddingTop: 10,
//         paddingBottom: 10,
//    }
    return <View style = {{width: "100%"}}>
          <Animated.View style = {{
            position: "absolute",
            opacity: noConnectionAppearAnimRef.current.interpolate({
                inputRange: [0,1],
                outputRange: [0,0.8],
                extrapolate: "clamp"
            }),
            // height: 30,
            width: "100%",
                backgroundColor: "#EAEAEA",
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 10,
            transform: [{translateY: noConnectionAppearAnimRef.current.interpolate( {
                inputRange: [0,1], 
                outputRange : [0,height+inset.top],
                extrapolate: "clamp"
            }), }],
        }}
            pointerEvents = "box-none"
        >
            <Text>
                Network connectivity limited or unavailable.
                {/* {JSON.stringify(netInfo)} */}
            </Text>
        </Animated.View>
            
        <SafeAreaView forceInset={{ bottom: 'never', vertical: 'never'}} 
            style = {{ backgroundColor:opacityBGC,
                ... ( showDropShadow ? dropshadowStyle : {}) 

            }}>
      
        <View style = {{flexDirection: 'row', justifyContent: 'center',height}}>
            <TouchableOpacity
                style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    justifyContent: "flex-start",
                    paddingHorizontal:12,
                    paddingRight: 28,
                    paddingTop: 14,
                    zIndex: 1,
                }}
                onPress={() => props.navigation.toggleDrawer()}
                >
                <SvgXml fill = {color}   xml = {HAMBURGER_MENU_SVG}/>
                {props.overlayComponents}
            </TouchableOpacity>
            {props.children}
            {
                showInverseBorders && <>
                    <View style = {{
                        position: "absolute",
                        top: height,
                        left: -6,
                        // backgroundColor: opacityBGC,
                    }}>
                        <SvgXml xml={LEFT_CORNER_SVG} fill = {opacityBGC}/>
                    </View>
                    <View style = {{
                        position: "absolute",
                        top: height,
                        right: -6,
                        // backgroundColor: opacityBGC,
                    }}>
                        <SvgXml xml={RIGHT_CORNER_SVG} fill = {opacityBGC}/>
                    </View>
                </>
            }
        </View>
   
    </SafeAreaView>
    </View>
}
export default BaseHeader