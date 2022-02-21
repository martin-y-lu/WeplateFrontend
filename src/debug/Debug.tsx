import { useEffect, useState } from "react"
import { View,Text,Button } from "react-native"
import { useValue } from "react-native-reanimated";
import { useRecoilState, useRecoilValue } from "recoil"
import { usersAtom, useUserActions } from "../utils/session/useUserActions"
import {  usePersistentAtom } from '../utils/state/userState';
import { authAtom } from '../utils/session/useFetchWrapper';

const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')

export function useLogin(navigation){
    const userActions = useUserActions()
    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom() as any
    const [loading,setLoading] = useState(false);
    const auth = useRecoilValue(authAtom)
    useEffect(()=>{
        const login  = (async ()=>{
            if(persistentState.loaded && !loading){
                if(persistentState.email === null || persistentState.password == null){
                    navigation.navigate("Login")
                }else{
                    try{
                        await userActions.login(persistentState.email,persistentState.password) 
                    }catch(e){
                        console.log(e)
                        await setPersistentState({
                            ...persistentState,
                            email: null,
                            password: null,
                        })
                        navigation.navigate("Login")
                    }
                }
            }else{
                if(!loading){
                    setLoading(true);
                    await fetchPersistentState()
                    setLoading(false)
                }
            }
            // userActions.login("2021090@appleby.on.ca","goodpassword123") 
        })
        if(!auth){
            login()
        }
    },[persistentState])
}
const Debug = ({navigation})=>{
    const userActions = useUserActions()
    const user = useRecoilValue(usersAtom)
    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom() as any


    useEffect(()=>{
    //     RCTNetworking.clearCookies(() => {
    //         console.log("Cookies cleared.") 
    //         userActions.login("2021090@appleby.on.ca","goodpassword123")
    // })
        fetchPersistentState()
        if(! persistentState.loaded) return
        // console.log("yup:",persistentState)
        // const newState = {
        //     ...persistentState,
        //     number: persistentState.number + 1,
        // }
        // console.log("oldstate:",persistentState,"newstate:",newState)
        // setPersistentState(newState)
    },[persistentState])

    return <View style={{ flex: 1, alignItems: 'center', }}>
        <Text> ---DEBUG--- </Text>
        <Text> user: { JSON.stringify(user)} </Text>
        <Text> persist: { JSON.stringify(persistentState)} </Text>
    </View>
}

export default Debug