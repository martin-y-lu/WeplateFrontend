import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, KeyboardAvoidingView, Keyboard, TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useRecoilState } from "recoil";
import { usersAtom, useUserActions } from "../../utils/session/useUserActions";
import { usePersistentAtom } from "../../utils/state/userState";
import { BaseWelcome, WelcomeButton } from "../welcome/Welcome";
import { MIN_PASSWORD_LENGTH } from '../login/Login';
import { SvgXml } from "react-native-svg";
import { back_icon_svg } from "../individual-item/IndividualItem";
import { useDesignScheme } from "../../design/designScheme";
// import { back_icon_svg } from '../../individual-item/IndividualItem';
export const ChangePassword = ({navigation,route})=>{
    const userActions = useUserActions()
    const {email} = route.params
    const [user,_setUser] = useRecoilState(usersAtom)
    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom()

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorText,setErrorText] = useState("");

    const [emailSent,setEmailSent] = useState(false)

    useEffect(()=>{
        if(navigation.isFocused()){
            const register = (async ()=>{
                console.log({user})
                // userActions.
            })
            register();
        }       
    },[navigation.isFocused()]);
    const [failMessage, setFailMessage] = useState("");
    const ds = useDesignScheme()

    return <BaseWelcome body = { 
        <TouchableOpacity style = {{
            position: 'absolute',
            top: 30,
            left: 20,
            width: "40%",
            height: "20%",
        }} onPress = {()=>{
                navigation.navigate("Login")
            }
        }>
            <SvgXml xml = {back_icon_svg} stroke = {ds.colors.grayscale5}/>
        </TouchableOpacity> 
    }>

    <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
                
    {
                emailSent ? 
                <>
                    <Text style = {{
                        marginTop: 15,
                        marginLeft: 40,
                        color: '#A6A6A6',
                        fontSize: 16, 
                    }}>
                        An email has been sent to {persistentState.email} to confirm the password change.
                    </Text>
                    <WelcomeButton onPress = {async ()=>{
                            navigation.navigate("Login")
                    }}> Continue </WelcomeButton>

                </>
                 :<>
                 
            <Text style={[styles.title,{fontSize: 40}]}>Create New Password</Text>
            <Text style={styles.text}> New password for {email}</Text>
        <KeyboardAvoidingView  behavior = 'position'>
            
            <TextInput
                secureTextEntry
                style={{
                    marginVertical: 10,
                    minWidth: "100%",
                    borderRadius: 10,
                    paddingLeft: 10,
                    backgroundColor: "white",
                    borderColor: '#EDEDED',
                    borderWidth: 1,
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    height: 40,
                    fontSize: 18,
                    marginLeft:10,
                    marginRight: 10,
                }}
                onChangeText={setNewPassword}
                value={newPassword}
            />
            <Text style={styles.text}> Confirm Password</Text>
            <TextInput
                secureTextEntry
                style={{
                    marginVertical: 10,
                    minWidth: "100%",
                    paddingLeft: 10,
                    borderRadius: 10,
                    backgroundColor: "white",
                    borderColor: '#EDEDED',
                    borderWidth: 1,
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    height: 40,
                    fontSize: 18,
                    marginLeft:10,
                    marginRight: 10,
                }}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
            />
            { errorText.length> 0 &&
            <Text style= {{
                    marginTop: 15,
                    marginLeft: 40,
                    color: ds.colors.accent1,
                    fontSize: 16,
                }}>
                {errorText}
            </Text>
            }
            <WelcomeButton onPress = {async ()=>{
                if(newPassword.length == 0){
                    setErrorText("Enter a new password");
                    return
                }
                if(newPassword.length < MIN_PASSWORD_LENGTH){
                    setErrorText("Password is too short");
                    return
                }
                if(newPassword != confirmPassword){
                    setErrorText("Passwords do not match")
                    setConfirmPassword("");
                    return
                }
                setErrorText("");
                try{
                    await userActions.resetPassword(persistentState.email,newPassword)
                }catch(e){
                    navigation.navigate("Login")
                }
                await setPersistentState({
                    ...persistentState,
                    alternativePasswords: [newPassword,...persistentState?.alternativePasswords ?? []]
                })
                setEmailSent(true);
            }}> Submit </WelcomeButton>
        </KeyboardAvoidingView>
        </>}

        
        </TouchableWithoutFeedback>
       
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

    },
    textInput:{
        borderColor: '#EDEDED',
        borderWidth: 1,
        borderLeftWidth:0,
        borderRightWidth:0,
        height: 40,
        color: '#A6A6A6',
        fontSize: 18,
        marginLeft:10,
        marginRight: 10,
    },
    backArrow: {
        shadowOpacity: 0,
        marginLeft: 10
    },
    headerView:{
        backgroundColor:'white',
        width: '100%',
        height: '8%',
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 3,
        },
        shadowOpacity: .1,
        shadowRadius: 2,
        elevation: 2,
        justifyContent: 'center',
        alignItems:'flex-start',
        marginBottom: 10,
    },
    header:{
        color: '#A6A6A6',
        fontSize: 20,
        marginTop:10,
        marginLeft: 10,
        marginRight: 20
    },
    subheader:{
        color: '#DDDDDD',
        fontSize: 15,
        marginTop:10,
        marginLeft: 10,
        marginRight: 20,
    },
    innerContainer:{
        backgroundColor: 'white'
    },
    container: {
      paddingTop: 50,
    },
    tinyLogo: {
      width: 50,
      height: 50,
    },
    logo: {
      width: 66,
      height: 58,
      marginLeft: 20,
    },
    miniHeader: {
        fontSize:15,
        marginLeft: 10,
        marginTop: 20,
        color: "#DDDDDD" 
    },
    seperator:{
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#EDEDED', 
        borderRightWidth: 0,
        borderLeftWidth: 0,
        flexDirection:'row',
        padding: 10,
        justifyContent: 'space-between',
        marginLeft: 5,
        marginRight:5
    },
    feildName: {
        fontSize:18,
        marginLeft: 10,
        //marginTop: 20,
        color: "#A6A6A6" 
    },
    feildName2:{
        flex:1,
        fontSize:18,
        marginLeft: 10,
        //marginTop: 20,
        color: "#A6A6A6" 
    },
    feildDescription:{
        flex:2,
        fontSize: 15,
        color: '#C8C8C8'
    },
    feildAndArrowContainter: {
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    feild: {
        fontSize:18,
        //marginLeft: 20,
        //marginTop: 20,
        color: "#C8C8C8" 
    },
    triangle: {
        alignSelf:'center',
        marginRight: 10,
    },
    checkboxSeperator: {
        flexDirection:'row',
        marginVertical: 10

    },
    checkbox: {
        width: 23,
        height: 23,
        borderWidth: 2,
        borderColor: "#A6A6A6",
        marginLeft: 20

    },
    innerCheckmark: {
        alignSelf:'center',
    },

    checkmark: {
        flex:1,
        alignSelf:'center',
        marginRight: 10,
    }

})
