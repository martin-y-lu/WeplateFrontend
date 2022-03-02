import { useNetInfo } from "@react-native-community/netinfo"
import { useRef } from "react"
import { View,Text, TouchableOpacity, Dimensions,Animated} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgXml } from "react-native-svg"
import {useEffect} from 'react';
const HAMBURGER_MENU_SVG = '<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.95835 9.42706H31.0417C31.617 9.42706 32.0834 8.96072 32.0834 8.3854V5.78123C32.0834 5.2059 31.617 4.73956 31.0417 4.73956H3.95835C3.38303 4.73956 2.91669 5.2059 2.91669 5.78123V8.3854C2.91669 8.96072 3.38303 9.42706 3.95835 9.42706ZM3.95835 19.8437H31.0417C31.617 19.8437 32.0834 19.3774 32.0834 18.8021V16.1979C32.0834 15.6226 31.617 15.1562 31.0417 15.1562H3.95835C3.38303 15.1562 2.91669 15.6226 2.91669 16.1979V18.8021C2.91669 19.3774 3.38303 19.8437 3.95835 19.8437ZM3.95835 30.2604H31.0417C31.617 30.2604 32.0834 29.7941 32.0834 29.2187V26.6146C32.0834 26.0392 31.617 25.5729 31.0417 25.5729H3.95835C3.38303 25.5729 2.91669 26.0392 2.91669 26.6146V29.2187C2.91669 29.7941 3.38303 30.2604 3.95835 30.2604Z"/></svg>'
const BaseHeader = (props : {options?: any, overlayComponents?, children?,navigation?}) =>{
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
    const {opacity,color } = options?.headerTitleStyle ??  {opacity: 1, color: "#A4A4A4"}
    const height = 64

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
        }}>
            <Text>
                Network connectivity limited or unavailable.
                {/* {JSON.stringify(netInfo)} */}
            </Text>
        </Animated.View>
            
        <SafeAreaView forceInset={{ bottom: 'never', vertical: 'never'}} 
            style = {{ backgroundColor:`rgba(255,255,255,${Math.floor(opacity ?? 1 *255)})`
            ,shadowColor:"black"
            ,shadowRadius:5
                        ,shadowOpacity:0.5*opacity
                        , height: height+inset.top}}>
      
        <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',height}}>
            <TouchableOpacity
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    justifyContent: "flex-start",
                    paddingLeft:12,
                    paddingTop: 14,
                    zIndex: 1,
                }}
                onPress={() => props.navigation.toggleDrawer()}
                underlayColor='#fff'
                >
                <SvgXml fill = {color || "#A4A4A4" }   xml = {HAMBURGER_MENU_SVG}/>
                {props.overlayComponents}
            </TouchableOpacity>
            {props.children}
        </View>
   
    </SafeAreaView>
    </View>
}
export default BaseHeader