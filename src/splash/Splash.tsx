import React, { useEffect, useRef, useState, } from "react"
import { Image, StyleSheet, Text, View, Animated, Easing, Linking, Dimensions } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SvgXml } from "react-native-svg"
import { APIVersionResponse, APIHandleUpdateStrategies } from '../utils/session/apiTypes';
import { useUserActions } from "../utils/session/useUserActions";
import { usePersistentAtom } from '../utils/state/userState';
import { useDesignScheme } from '../design/designScheme';
const logo_svg =   `<svg width="65" height="46" viewBox="0 0 65 46" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M32.4725 3.90527H61.3254V42.3758H32.4725M32.4725 3.90527H3.61963V23.1405M32.4725 3.90527V23.1405M32.4725 42.3758H3.61963V23.1405M32.4725 42.3758V23.1405M32.4725 23.1405H3.61963" stroke="white" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`
const we_svg = `<svg width="76" height="31" viewBox="0 0 76 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.45508 3.76367L13.0727 26.846L22.6903 3.76367L32.308 26.846L41.9256 3.76367" stroke="white" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M49.6196 15.3048C49.6196 21.6788 54.7868 26.846 61.1608 26.846H68.8549M49.6196 15.3048C49.6196 8.93082 54.7868 3.76367 61.1608 3.76367C67.5348 3.76367 72.7019 8.93082 72.7019 15.3048H49.6196Z" stroke="white" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`
const plate_svg =  `<svg width="146" height="77" viewBox="0 0 146 77" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M119.502 38.3048C119.502 44.6788 124.669 49.846 131.043 49.846H138.737M119.502 38.3048C119.502 31.9308 124.669 26.7637 131.043 26.7637C137.417 26.7637 142.584 31.9308 142.584 38.3048H119.502Z" stroke="white" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.25597 38.3046C7.25597 33.6791 11.0057 29.9293 15.6313 29.9293C20.2569 29.9293 24.0066 33.6791 24.0066 38.3046C24.0066 42.9302 20.2569 46.68 15.6313 46.68C11.0057 46.68 7.25597 42.9302 7.25597 38.3046ZM7.25597 50.3955C9.63272 52.0449 12.5191 53.0116 15.6313 53.0116C23.7537 53.0116 30.3383 46.4271 30.3383 38.3046C30.3383 30.1822 23.7537 23.5977 15.6313 23.5977C12.5005 23.5977 9.59826 24.5759 7.21346 26.2434C6.96539 24.7424 5.66146 23.5977 4.09015 23.5977C2.34171 23.5977 0.924316 25.015 0.924316 26.7635V38.3046V72.9281C0.924316 74.6765 2.34171 76.0939 4.09015 76.0939C5.83858 76.0939 7.25597 74.6765 7.25597 72.9281V50.3955Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M70.2138 50.3659C70.4618 51.867 71.7658 53.0117 73.3371 53.0117C75.0855 53.0117 76.5029 51.5943 76.5029 49.8459L76.5029 38.3047L76.5029 26.7636C76.5029 25.0151 75.0855 23.5978 73.3371 23.5978C71.7658 23.5978 70.4619 24.7425 70.2138 26.2435C67.829 24.576 64.9267 23.5978 61.7959 23.5978C53.6735 23.5977 47.089 30.1823 47.089 38.3047C47.089 46.4272 53.6735 53.0117 61.7959 53.0117C64.9267 53.0117 67.829 52.0335 70.2138 50.3659ZM70.1713 38.3047C70.1713 33.6792 66.4215 29.9294 61.7959 29.9294C57.1704 29.9294 53.4206 33.6792 53.4206 38.3047C53.4206 42.9303 57.1704 46.6801 61.7959 46.6801C66.4215 46.6801 70.1713 42.9303 70.1713 38.3047Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M84.8782 12.0566C86.6267 12.0566 88.0441 13.474 88.0441 15.2225V23.5978H96.4194C98.1678 23.5978 99.5852 25.0152 99.5852 26.7636C99.5852 28.5121 98.1678 29.9295 96.4194 29.9295L88.0441 29.9295V38.3048C88.0441 42.9303 91.7938 46.6801 96.4194 46.6801C101.045 46.6801 104.795 42.9303 104.795 38.3048C104.795 36.5563 106.212 35.139 107.961 35.139C109.709 35.139 111.126 36.5563 111.126 38.3048C111.126 46.4272 104.542 53.0118 96.4194 53.0118C88.2969 53.0118 81.7124 46.4272 81.7124 38.3048V26.7636V15.2225C81.7124 13.474 83.1298 12.0566 84.8782 12.0566Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M38.7137 0.515625C40.4621 0.515625 41.8795 1.93301 41.8795 3.68145V49.8461C41.8795 51.5945 40.4621 53.0119 38.7137 53.0119C36.9652 53.0119 35.5479 51.5945 35.5479 49.8461V3.68145C35.5479 1.93301 36.9652 0.515625 38.7137 0.515625Z" fill="white"/>
</svg>
`

const appStoreLink = "itms-apps://apps.apple.com/ca/app/weplate/id1610953263"

function Splash({navigation}){
    const userActions = useUserActions()
    const {width,height} = Dimensions.get("window")

    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom() as any
    const [persistentStateChecked,setPersistentStateChecked] = useState(false);
    async function getPersistentState(){
        if(persistentState.loaded){
            return persistentState;
        }
        return await fetchPersistentState()
    }
    const [loading,setLoading] = useState(false)
    const logoYAnimRef = useRef(new Animated.Value(-50));
    const weYAnimRef = useRef(new Animated.Value(-50));
    const plateYAnimRef = useRef(new Animated.Value(-50));
    async function leaveSplashAnimation(){
        await new Promise((resolve,reject)=>{
            setTimeout(resolve,300)
        })
    }

    const [updateRequired,setUpdateRequired] = useState<APIHandleUpdateStrategies>("none");

    const useNativeDriver =  false
    useEffect(()=>{
        Animated.stagger(100,[ 
            Animated.timing(plateYAnimRef.current,{
                toValue: 0,
                duration: 300,
                easing: Easing.bounce, 
                useNativeDriver,
            }),
            Animated.timing(weYAnimRef.current,{
                toValue: 0,
                duration: 300,
                easing: Easing.bounce, 
                useNativeDriver,
            }),
            Animated.timing(logoYAnimRef.current,{
                toValue: 0,
                duration: 300,
                easing: Easing.bounce, 
                useNativeDriver,
            }),


        ]).start()
    },[])
    async function goToAppStore(){
        const linkSupported = await Linking.canOpenURL(appStoreLink);
        if(linkSupported){
            Linking.openURL(appStoreLink)
        }
    }
    async function checkUpdate(){
        const compatibility = await userActions.checkVersion();
        console.log({compatibility})
        if(!compatibility.compatible){
            setUpdateRequired(compatibility.handling_update)
            if(compatibility.handling_update == "force"){
                await goToAppStore()
            }
        }
        return compatibility
    }
    async function handleEnterApp(){
        const fetchedState = await getPersistentState()
        await leaveSplashAnimation()
        if(fetchedState.password !== null && fetchedState.email !== null){
            if(fetchedState?.verified){
                navigation.navigate("SidebarNavigable",{screen:"Dashboard"})
            }else{
                navigation.navigate("VerifyAccount")
            }

        }else{
            navigation.navigate("Login")
        }
    }

    useEffect(()=>{
       
        async function handleSplash(){
            const compat = await checkUpdate();
            if(compat.compatible){
                handleEnterApp()
            }
        }
        handleSplash()
    },[]) 
    const shift = {x: -5, y: -20}

    const ds = useDesignScheme()
    return <View style={{ flex: 1, backgroundColor: ds.colors.accent2, justifyContent: 'center' }}>
        <View style = {{
            width: "100%",
            alignItems:"center",
        }}>
        <View style={{alignItems: 'left', margin: 15,paddingLeft:20,}}>
            <View>
                <Animated.View style = {{
                    position: "absolute",
                    left: -73 +shift.x,
                    top: Animated.add(logoYAnimRef.current,-32 + shift.y),
                }}> 
                    <SvgXml xml= {logo_svg}/>
                </Animated.View>
                <Animated.View style = {{
                    position: "absolute",
                    left: -116 +shift.x,
                    top: Animated.add(weYAnimRef.current, 22 +shift.y),
                    
                }}>
                    <SvgXml xml= {we_svg}/>
                </Animated.View>
                <Animated.View style = {{
                    position: "absolute",
                    left: -33 +shift.x,
                    top: Animated.add(plateYAnimRef.current, 0 + shift.y),
                }}>
                    <SvgXml xml= {plate_svg}/>
                </Animated.View>
            </View>
        </View>
    </View>
    {
        (updateRequired == "maintenance") &&  <Animated.View style = {{
            position: "absolute",
            left: 0,
            top: height*0.7,
            alignItems:'center',
            width: "100%",
        }}>
            <Text style = {{
                color: "white",
                fontSize: 20,
            }}>
                Weplate is down for maintenance
            </Text>
        </Animated.View> 
    }
    { (updateRequired == "force" || updateRequired == "recommend") && 
        <Animated.View style = {{
            position: "absolute",
            left: 0,
            top: height*0.7,
            alignItems:'center',
            width: "100%",
        }}>
            <Text style = {{
                color: "white",
                fontSize: 20,
            }}>
                A new update is available:
            </Text>
            <View style = {{
                flexDirection: "row",
                paddingLeft: 50,
                paddingRight: 50
            }}>

                <TouchableOpacity style = {{
                        backgroundColor: "white",
                        padding: 10,
                        margin:5,
                        borderRadius: 20,
                    }}
                    onPress = {()=>{
                        async function handlePress(){
                            await goToAppStore()
                        }
                        handlePress()
                    }}
                >   
                    <Text  style = {{
                        fontSize:20,
                        color: ds.colors.accent2
                    }}>
                        Get update
                    </Text>
                </TouchableOpacity>
                { updateRequired == "recommend" &&
                    <TouchableOpacity style = {{
                        backgroundColor: "white",
                        padding: 10,
                        margin:5,
                        borderRadius: 20,
                    }}
                        onPress = {()=>{
                            async function handlePress(){
                                await handleEnterApp();
                            }
                            handlePress()
                        }}
                    >
                        <Text style = {{
                            fontSize:20,
                            color: ds.colors.accent2
                        }}>
                            Continue to app
                        </Text>
                    </TouchableOpacity>
                }
            </View>
        </Animated.View>
    }
 </View> 
 }

export default Splash