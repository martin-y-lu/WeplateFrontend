import React, { useEffect, useState, useCallback } from 'react';
import { View,Text,Button } from "react-native"
import { useValue } from "react-native-reanimated";
import { useRecoilState, useRecoilValue } from "recoil"
import { usersAtom, useUserActions } from "./useUserActions"
import {  usePersistentAtom } from '../state/userState';
import { authAtom } from './useFetchWrapper';
import { useFocusEffect } from "@react-navigation/native";

export function useLogin(navigation){
    const userActions = useUserActions()
    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom() as any
    const [loading,setLoading] = useState(false);
    const auth = useRecoilValue(authAtom)
    useEffect(()=>{

        const login  = (async ()=>{
            // console.log("Attempt login", persistentState,loading)
            if(persistentState.loaded && !loading){
                console.log({persistentState})
                if(persistentState.email === null || persistentState.password == null){
                    console.error("Navigating to email because persistent state info is null:",persistentState)
                    navigation.navigate("Login")
                }else{
                    try{
                        await userActions.login(persistentState.email,persistentState.password) 
                        // console.log("Succesfully logged in")
                    }catch(e){
                        // console.log()
                        await setPersistentState({
                            ...persistentState,
                            email: null,
                            password: null,
                            loaded: false,
                            register: false
                        })
                        navigation.navigate("Login")
                    }
                }
            }else{
                // console.log("persistentState not loaded");
                if(!loading){
                    setLoading(true);
                    // console.log("Fetching persistent state")
                    await fetchPersistentState()
                    // console.log("Fetched Persistent state")
                    setLoading(false)
                }
            }
            // userActions.login("2021090@appleby.on.ca","goodpassword123") 
        })
        if(!auth && navigation.isFocused()){
            login()
        }
    },[persistentState,navigation.isFocused()]);
}