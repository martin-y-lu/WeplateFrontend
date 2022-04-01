import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/native";
import { Text, useWindowDimensions, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SvgXml } from 'react-native-svg';
import { useUserActions } from "./session/useUserActions";

const dashboard_icon_svg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect y="8" width="4" height="8" rx="1" />
<rect x="6" width="4" height="16" rx="1" />
<rect x="12" y="4" width="4" height="12" rx="1" />
</svg>
`

const dining_menu_icon_svg =  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="16" height="16" rx="1" />
<rect x="2" y="3" width="12" height="2" rx="0.5" fill = "white"/>
<rect x="2" y="7" width="10" height="2" rx="0.5" fill = "white"/>
<rect x="2" y="11" width="8" height="2" rx="0.5" fill = "white"/>
</svg>
`

const feedback_icon_svg =  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 11.8432V15.5004C0 15.7766 0.223858 16.0004 0.5 16.0004H4.15722C4.42243 16.0004 4.67679 15.8951 4.86432 15.7075L13.0072 7.56467C13.3977 7.17414 13.3977 6.54098 13.0072 6.15045L9.84996 2.99324C9.45944 2.60271 8.82627 2.60272 8.43575 2.99324L0.292893 11.1361C0.105357 11.3236 0 11.578 0 11.8432Z" />
<path d="M13.5782 5.57861L10.421 2.42139C10.0304 2.03087 10.0305 1.3977 10.421 1.00718L10.721 0.707107C11.1116 0.316583 11.7447 0.316582 12.1353 0.707106L15.2925 3.86432C15.683 4.25485 15.683 4.88801 15.2925 5.27854L14.9924 5.57861C14.6019 5.96913 13.9687 5.96913 13.5782 5.57861Z" />
</svg>
`
const settings_icon_svg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.2316 9.86546L13.9004 9.09671C14.0348 8.37171 14.0348 7.62796 13.9004 6.90296L15.2316 6.13421C15.3848 6.04671 15.4535 5.86546 15.4035 5.69671C15.0566 4.58421 14.466 3.57796 13.6941 2.74046C13.5754 2.61233 13.3816 2.58108 13.2316 2.66858L11.9004 3.43733C11.341 2.95608 10.6973 2.58421 10.0004 2.34046V0.806084C10.0004 0.631084 9.87851 0.477959 9.70664 0.440459C8.55976 0.184209 7.38476 0.196709 6.29414 0.440459C6.12226 0.477959 6.00039 0.631084 6.00039 0.806084V2.34358C5.30664 2.59046 4.66289 2.96233 4.10039 3.44046L2.77226 2.67171C2.61914 2.58421 2.42851 2.61233 2.30976 2.74358C1.53789 3.57796 0.947262 4.58421 0.600387 5.69984C0.547262 5.86859 0.619137 6.04984 0.772262 6.13734L2.10351 6.90609C1.96914 7.63109 1.96914 8.37484 2.10351 9.09984L0.772262 9.86859C0.619137 9.95609 0.550387 10.1373 0.600387 10.3061C0.947262 11.4186 1.53789 12.4248 2.30976 13.2623C2.42851 13.3905 2.62226 13.4217 2.77226 13.3342L4.10351 12.5655C4.66289 13.0467 5.30664 13.4186 6.00351 13.6623V15.1998C6.00351 15.3748 6.12539 15.528 6.29726 15.5655C7.44414 15.8217 8.61914 15.8092 9.70976 15.5655C9.88164 15.528 10.0035 15.3748 10.0035 15.1998V13.6623C10.6973 13.4155 11.341 13.0436 11.9035 12.5655L13.2348 13.3342C13.3879 13.4217 13.5785 13.3936 13.6973 13.2623C14.4691 12.428 15.0598 11.4217 15.4066 10.3061C15.4535 10.1342 15.3848 9.95296 15.2316 9.86546ZM8.00039 10.4998C6.62226 10.4998 5.50039 9.37796 5.50039 7.99984C5.50039 6.62171 6.62226 5.49984 8.00039 5.49984C9.37851 5.49984 10.5004 6.62171 10.5004 7.99984C10.5004 9.37796 9.37851 10.4998 8.00039 10.4998Z" />
</svg>
`
const about_us_icon_svg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8" cy="8" r="8"/>
</svg>
`

const weplate_full_logo_svg = `<svg width="182" height="86" viewBox="0 0 182 86" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 46L11.5 64L19 46L26.5 64L34 46" stroke="#FF3939" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40 55C40 59.9706 44.0294 64 49 64H55M40 55C40 50.0294 44.0294 46 49 46C53.9706 46 58 50.0294 58 55H40Z" stroke="#FF3939" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M160 55C160 59.9706 164.029 64 169 64H175M160 55C160 50.0294 164.029 46 169 46C173.971 46 178 50.0294 178 55H160Z" stroke="#434343" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M73.1656 54.9998C73.1656 51.7777 75.7777 49.1656 78.9998 49.1656C82.2219 49.1656 84.834 51.7777 84.834 54.9998C84.834 58.2219 82.2219 60.834 78.9998 60.834C75.7777 60.834 73.1656 58.2219 73.1656 54.9998ZM73.1656 65.6781C74.8977 66.6264 76.8858 67.1656 78.9998 67.1656C85.7188 67.1656 91.1656 61.7188 91.1656 54.9998C91.1656 48.2808 85.7188 42.834 78.9998 42.834C76.7369 42.834 74.6183 43.4518 72.8034 44.528C72.2736 43.5208 71.2169 42.834 69.9998 42.834C68.2514 42.834 66.834 44.2514 66.834 45.9998V54.9998V81.9998C66.834 83.7482 68.2514 85.1656 69.9998 85.1656C71.7483 85.1656 73.1656 83.7482 73.1656 81.9998V65.6781Z" fill="#434343"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M120.834 55.0002C120.834 58.2223 118.222 60.8344 115 60.8344C111.778 60.8344 109.166 58.2223 109.166 55.0002C109.166 51.7781 111.778 49.166 115 49.166C118.222 49.166 120.834 51.7781 120.834 55.0002ZM121.197 44.5284C119.382 43.4522 117.263 42.8344 115 42.8344C108.281 42.8344 102.834 48.2812 102.834 55.0002C102.834 61.7192 108.281 67.166 115 67.166C117.263 67.166 119.382 66.5482 121.197 65.472C121.726 66.4792 122.783 67.166 124 67.166C125.749 67.166 127.166 65.7486 127.166 64.0002L127.166 55.0002L127.166 46.0002C127.166 44.2517 125.749 42.8344 124 42.8344C122.783 42.8344 121.726 43.5212 121.197 44.5284Z" fill="#434343"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M133 33.834C134.748 33.834 136.166 35.2514 136.166 36.9998V42.834H142C143.748 42.834 145.166 44.2514 145.166 45.9998C145.166 47.7483 143.748 49.1656 142 49.1656H136.166V54.9998C136.166 58.2219 138.778 60.834 142 60.834C145.222 60.834 147.834 58.2219 147.834 54.9998C147.834 53.2514 149.251 51.834 151 51.834C152.748 51.834 154.166 53.2514 154.166 54.9998C154.166 61.7188 148.719 67.1656 142 67.1656C135.281 67.1656 129.834 61.7188 129.834 54.9998V45.9998V36.9998C129.834 35.2514 131.251 33.834 133 33.834Z" fill="#434343"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M96.9998 24.834C98.7483 24.834 100.166 26.2514 100.166 27.9998V63.9998C100.166 65.7482 98.7483 67.1656 96.9998 67.1656C95.2514 67.1656 93.834 65.7482 93.834 63.9998V27.9998C93.834 26.2514 95.2514 24.834 96.9998 24.834Z" fill="#434343"/>
<path d="M62.5 4H85V34H62.5M62.5 4H40V19M62.5 4V19M62.5 34H40V19M62.5 34V19M62.5 19H40" stroke="#FF3939" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`

function DrawerButton(props){
    const {width,navigation,name,screen,icon,screenName} = props

    const dark = screenName === screen
    return <TouchableOpacity style = {{
        backgroundColor: dark ? "#DADADA" : "white",
        width,
        flexDirection:"row",
        height: 50,
        alignItems:"center",
        paddingLeft:30,
    }}
    onPress = {()=>{
        navigation.navigate("SidebarNavigable",{screen})
    }}
    >
        <SvgXml fill = {dark ? "white" : "#A4A4A4"} xml = {icon}/>
        <Text style = {{
            fontSize: 22,
            marginLeft:10,
            color: dark? "white" : "#C2C2C2"
        }}>
            {name}
        </Text>

    </TouchableOpacity>
}
function DrawerButtonBehaviour(props){
    const {width,name,icon,onPress} = props

    const dark = false
    return <TouchableOpacity style = {{
        backgroundColor: dark ? "#DADADA" : "white",
        width,
        flexDirection:"row",
        height: 50,
        alignItems:"center",
        paddingLeft:30,
    }}
    onPress = {onPress}
    >
        {icon &&
        <SvgXml fill = {dark ? "white" : "#A4A4A4"} xml = {icon}/>}
        <Text style = {{
            fontSize: 22,
            marginLeft:10,
            color: dark? "white" : "#C2C2C2"
        }}>
            {name}
        </Text>

    </TouchableOpacity>
}
export const CustomDrawerContent = (props) => {
    const {navigation} = props
    const width = useWindowDimensions().width * 0.67;
    const route = useRoute()
    const screenName = (route?.params as any)?.screen;
    const userActions = useUserActions()
    // console.log("NAVSTATE",route)
    return <DrawerContentScrollView {...props} style = {{
        width,
        overflow:"hidden",
        flexDirection: "row"
    }}>
        <View style = {{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width,
            overflow:"hidden",
            paddingTop: 30,
            
            height: "100%"
        }}> 
            <DrawerButton icon = {dashboard_icon_svg} width = {width} navigation = {navigation} name = "Dashboard" screen = "Dashboard" screenName = {screenName}/>
            <DrawerButton icon = {dining_menu_icon_svg} width = {width} navigation = {navigation} name = "Dining Menu" screen = "Dining Menu" screenName = {screenName}/>
            <DrawerButton icon = {feedback_icon_svg} width = {width} navigation = {navigation} name = "Feedback" screen = "Feedback" screenName = {screenName}/>
            <DrawerButton icon = {settings_icon_svg} width = {width} navigation = {navigation} name = "Settings" screen = "Settings" screenName = {screenName}/>
            <DrawerButton icon = {about_us_icon_svg} width = {width} navigation = {navigation} name = "About Us" screen = "About Us" screenName = {screenName}/>
            <DrawerButtonBehaviour icon = {null} width = {width} name = "Log Out" onPress = {()=>{
                console.log("LOGG OUT")
                async function logOut(){
                    console.log("Logging out")
                    await userActions.logout()
                    navigation.navigate("Login")
                }
                logOut()
            }}/>

            <View style = {{
                marginTop: 'auto',
                alignSelf: "center",
                marginBottom: 20,
            }}>
            {/* // onPress = {()=>{
            //     navigation.navigate("SidebarNavigable",{screen:"--DEBUG--"})
            // }}> */}
                <SvgXml xml = {weplate_full_logo_svg}/>
            </View>
        </View>
    </DrawerContentScrollView>
    
}