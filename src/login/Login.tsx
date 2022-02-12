import { View,Text,Button } from "react-native"
import { useRecoilValue } from "recoil"
import { dashboardState, dateToString, TimeInfo } from "../dashboard/state"
const Login = ({navigation})=>{
    const {currentDate,currentMeal} = useRecoilValue(dashboardState)
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
                navigation.navigate("SidebarNavigable",{screen : "Dashboard", params:{
                    timeInfo:{
                        date: dateToString(currentDate),
                        meal: currentMeal
                    } as TimeInfo
                }})
            }}
        />
    </View>
}

export default Login