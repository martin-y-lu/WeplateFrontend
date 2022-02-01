import { View,Text,Button } from "react-native"
const Survey = ({navigation})=>{
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Survey </Text>
        <Button
            title = "Go to dashboard"
            onPress = {()=>{
                navigation.navigate("SidebarNavigable",{screen : "Dashboard"})
            }}
        />
    </View>
}

export default Survey