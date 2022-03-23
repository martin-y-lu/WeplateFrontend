import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { useRecoilState } from "recoil";
import { usersAtom, useUserActions } from "../utils/session/useUserActions";
import { usePersistentAtom } from "../utils/state/userState";
import { BaseWelcome, WelcomeButton } from "../welcome/Welcome";
export const ChangePassword = ({navigation})=>{
    const userActions = useUserActions()
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
    return <BaseWelcome>
        <Text style={[styles.title,{fontSize: 40}]}>Create New Password</Text>
        <TextInput
                secureTextEntry
                style={{
                    marginVertical: 10,
                    minWidth: "50%",
                    borderRadius: 10,
                    padding: 20,
                    backgroundColor: "white",
                    borderColor: '#EDEDED',
                    borderWidth: 1,
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    height: 40,
                    color: 'black',
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
                style={styles.textInput}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
            />
            { errorText.length> 0 &&
            <Text style= {{
                    marginTop: 15,
                    marginLeft: 40,
                    color: '#A6A6A6',
                    fontSize: 16,
                }}>
                {errorText}
            </Text>
            }
        <WelcomeButton onPress = {async ()=>{
            
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
