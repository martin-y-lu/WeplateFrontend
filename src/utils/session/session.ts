import { useEffect, useState } from "react"
import { View,Text,Button } from "react-native"
import { useValue } from "react-native-reanimated";
import { useRecoilState, useRecoilValue } from "recoil"
import { usersAtom, useUserActions } from "./useUserActions"
import {  usePersistentAtom } from '../state/userState';
import { authAtom } from './useFetchWrapper';

export function useLogin(navigation){
    const userActions = useUserActions()
    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom() as any
    const [loading,setLoading] = useState(false);
    const auth = useRecoilValue(authAtom)
    useEffect(()=>{
        const login  = (async ()=>{
            if(persistentState.loaded && !loading){
                if(persistentState.email === null || persistentState.password == null){
                    console.log("Navigating to email because persistent state info is null:",persistentState)
                    navigation.navigate("Login")
                }else{
                    try{
                        await userActions.login(persistentState.email,persistentState.password) 
                    }catch(e){
                        // console.log()
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