import { View,Text,Button } from "react-native"
const Login = ({navigation})=>{
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Login </Text>
        <Button
            title = "Go to Survey"
            onPress = {()=>{
                navigation.navigate("Survey")
            }}
        />
        <Button
            title = "Go to dashboard"
            onPress = {()=>{
                navigation.navigate("SidebarNavigable",{screen : "Dashboard"})
            }}
        />
    </View>
}

export default Login