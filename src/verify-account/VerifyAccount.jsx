import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useRecoilState } from "recoil";
import { usersAtom, useUserActions } from "../utils/session/useUserActions";
import { usePersistentAtom } from "../utils/state/userState";
import { BaseWelcome, WelcomeButton } from "../welcome/Welcome";
export const VerifyAccount = ({navigation})=>{
    const userActions = useUserActions()
    const [user,_setUser] = useRecoilState(usersAtom)
    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom()
    useEffect(()=>{
        if(navigation.isFocused()){
            const register = (async ()=>{
                console.log({user})
                try{
                    await userActions.login(persistentState.email,persistentState.password) 
                    console.log("sending verification email")
                    userActions.verifyEmail(persistentState.email);
                }catch(e){
                    console.log(e)
                    await userActions.logout()
                    navigation.navigate("Login")
                }
            })
            register();
        }       
    },[navigation.isFocused()]);
    const [failMessage, setFailMessage] = useState("");
    return <BaseWelcome>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.text}> We sent an email to {persistentState.email} to verify your email address and activate your account.
         </Text>
         <Text style = {[styles.text, { 
            marginTop: 30,
         }]}>
            Continue after you activated your account.
         </Text>
         <Text style = {[styles.text, { 
            marginTop: 30,
            color: "red"
         }]}>
            {failMessage}
         </Text>
        <WelcomeButton onPress = {async ()=>{
            console.log("Huh")
            const checkVerify = (async ()=>{
                const isVerified = await userActions.isVerified()
                console.log({isVerified})
                if(isVerified){
                    await setPersistentState({
                        ...persistentState,
                        verified: true,
                    })
                    navigation.navigate("SidebarNavigable",{screen:"Dashboard"})
                }else{
                    setFailMessage("Open the link sent in the email to verify your account.")
                }
            })
            checkVerify()
        }}> Continue </WelcomeButton>
    </BaseWelcome>
}
const styles = StyleSheet.create({

    title: {
        color: 'white',
        fontWeight: '800',
        fontSize: 50
    },
    sub_title: {
        color: 'white',
        fontWeight: '800',
        fontSize: 40
    },
    sub_title2: {
        color: 'white',
        fontWeight: '800',
        fontSize: 20
    },

    text: {
        color: 'white',
        fontSize: 18,
    },

    backdrop: {
        position: 'absolute',
        top: -750,

    },

    backdropBottom: {
        position: 'absolute',
        top: 270,

    }

})
