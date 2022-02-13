import { useEffect } from "react"
import { View,Text,Button } from "react-native"
import { useRecoilValue } from "recoil"
import { usersAtom, useUserActions } from "../utils/session/useUserActions"
const Debug = ({navigation})=>{
    const userActions = useUserActions()
    const user = useRecoilValue(usersAtom)
    useEffect(()=>{
        console.log("yup")
        userActions.login("2021090@appleby.on.ca","goodpassword123")
    },[])

    return <View style={{ flex: 1, alignItems: 'center', }}>
        <Text> ---DEBUG--- </Text>
        <Text> user: { JSON.stringify(user)} </Text>
    </View>
}

export default Debug