import { View,Text } from "react-native"
import PortionView from './PortionView'

const Dashboard = (props)=>{
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Dashboard </Text>
        <PortionView/>
    </View>
}

export default Dashboard