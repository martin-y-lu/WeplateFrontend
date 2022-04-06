import * as React from "react"
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createDrawerNavigator, DrawerContent} from '@react-navigation/drawer'
export const TEST = false;
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from 'react-query'

import {setCustomText} from 'react-native-global-props'
setCustomText({style:{
    fontFamily:"Avenir-Heavy",
}})
// App pages

import Dashboard from "./src/dashboard/Dashboard";
import DashboardHeader from "./src/dashboard/DashboardHeader";
import Login from "./src/login/Login";
import Survey from "./src/survey/Survey";
import Settings from "./src/settings/Settings"
import DiningMenu from "./src/dining-menu/DiningMenu";
import AboutUs from "./src/about-us/AboutUs";
import Feedback from "./src/feedback/Feedback";
import { RecoilRoot } from "recoil";
import BaseHeader from "./src/utils/BaseHeader";
import { CustomDrawerContent } from "./src/utils/DrawerContent";
import { Welcome1, Welcome10, Welcome11, Welcome2, Welcome3, Welcome4, Welcome5, Welcome6, Welcome7, Welcome8, Welcome9 } from "./src/welcome/Welcome";
import DiningMenuHeader from "./src/dining-menu/DiningMenuHeader";
import EditInfo from "./src/settings/EditInfo";
import Splash from "./src/splash/Splash";
import FeedbackThankYou from "./src/feedback/FeedbackThankYou";
import FeedbackForms from "./src/feedback/FeedbackForms";
import { VerifyAccount } from "./src/verify-account/VerifyAccount";
import { useDesignScheme } from "./src/design/designScheme";
import IndividualItem from "./src/individual-item/IndividualItem";
import { ChangePassword } from "./src/change-password/ChangePassword";

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator();

// Help for nested navigations: 
// https://reactnavigation.org/docs/nesting-navigators/#navigator-specific-methods-are-available-in-the-navigators-nested-inside
const SHOW_NAV_HEADER = true
const SidebarNavigable = ()=>{
    const ds = useDesignScheme()

    return  <Drawer.Navigator
        drawerContent={ (props)=> <CustomDrawerContent {...props}/>}
        screenOptions={{
            headerShown: SHOW_NAV_HEADER,
            drawerPosition: "right"
        }}
        initialRouteName = "Dashboard"
        >
        
        <Drawer.Screen
            name = "Dashboard"
            component = {Dashboard}
            options  = {{
                header: (props) =>  <DashboardHeader {...props}/>,
            }}
        />
        <Drawer.Screen
            name = "Dining Menu"
            component = {DiningMenu}
            options = {{
                // header: (props) =>  <DiningMenuHeader {...props}/>,
                header: (props) =>  <DashboardHeader {...props}/>,
                headerTitleStyle: {opacity: 1, color: ds.colors.grayscale2, theme : "light" , backgroundColor: ds.colors.grayscale5}
            }}
        />
        <Drawer.Screen
            name = "Feedback"
            component = {Feedback}
            options = {{
                header: (props) =>  <BaseHeader {...props}/>,
                headerTransparent: true,
                headerTitleStyle: {opacity: 0, color: "white"}
            }}
        />
        <Drawer.Screen
            name = "FeedbackThankYou"
            component = {FeedbackThankYou}
            options = {{
                header: (props) =>  <BaseHeader {...props}/>,
                headerTransparent: true,
                headerTitleStyle: {opacity: 0, color: "white"}
            }}
        />
        <Drawer.Screen
            name = "Settings"
            component = {Settings}
            options = {{
                headerTransparent: true,
                header: (props) =>  <BaseHeader {...props}/>,
                headerTitleStyle: {opacity: 0, color: ds.colors.grayscale2}
            }}
        />
        <Drawer.Screen
            name = "EditInfo"
            component = {EditInfo}
            options={{ headerShown: false}}
        />
        <Drawer.Screen
            name = "About Us"
            component = {AboutUs}
            options = {{
                header: (props) =>  <BaseHeader {...props}/>,
                headerTransparent: true,
                headerTitleStyle: {opacity: 0, color: ds.colors.grayscale2}
            }}
        />
    </Drawer.Navigator>
}
const BaseApp = ()=>{
    return <NavigationContainer>
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}
        initialRouteName = "Splash"
        >
            <Stack.Screen 
                name = "Splash"
                component = {Splash}
            />
            <Stack.Screen
                name = "Login"
                component={Login} //dont forget to change this when you finish working on settings
            />
            <Stack.Screen
                name = "Survey"
                component={Survey}
            />
            <Stack.Screen 
                name = "FeedbackForms"
                component = {FeedbackForms}
            />
            <Stack.Screen
                name = "Welcome1"
                component={Welcome1}
            />
            <Stack.Screen
                name = "Welcome2"
                component={Welcome2}
            />
            <Stack.Screen
                name = "Welcome3"
                component={Welcome3}
            />
            <Stack.Screen
                name = "Welcome4"
                component={Welcome4}
            />
            <Stack.Screen
                name = "Welcome5"
                component={Welcome5}
            />
            <Stack.Screen
                name = "Welcome6"
                component={Welcome6}
            />
            <Stack.Screen
                name = "Welcome7"
                component={Welcome7}
            />
            <Stack.Screen
                name = "Welcome8"
                component={Welcome8}
            />
            <Stack.Screen
                name = "Welcome9"
                component={Welcome9}
            />
            <Stack.Screen
                name = "Welcome10"
                component={Welcome10}
            />
            <Stack.Screen
                name = "Welcome11"
                component={Welcome11}
            />
            <Stack.Screen
                name = "VerifyAccount"
                component = {VerifyAccount}
            />
            <Stack.Screen
                name = "ChangePassword"
                component = {ChangePassword}    
            />
            <Stack.Screen
                name = "IndividualItem"
                component = {IndividualItem}
            />
            <Stack.Screen
                name = "SidebarNavigable"
                component={SidebarNavigable}
                options={{ headerShown: false,
                        gestureEnabled: false,
                     }}
            />

        </Stack.Navigator>
        
       
    </NavigationContainer>
}

//Setting up recoil based state management
//Setting up react query

const queryClient = new QueryClient()
const App = ()=>{
    return <RecoilRoot>
        <QueryClientProvider client={ queryClient}>
            <BaseApp/> 
        </QueryClientProvider>
    </RecoilRoot> 
}


export default App