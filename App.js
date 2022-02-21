import * as React from "react"
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createDrawerNavigator, DrawerContent} from '@react-navigation/drawer'

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
import Debug from "./src/debug/Debug";
import { CustomDrawerContent } from "./src/utils/DrawerContent";
import { Welcome1, Welcome10, Welcome2, Welcome3, Welcome4, Welcome5, Welcome6, Welcome7, Welcome8, Welcome9 } from "./src/welcome/Welcome";

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator();

// Help for nested navigations: 
// https://reactnavigation.org/docs/nesting-navigators/#navigator-specific-methods-are-available-in-the-navigators-nested-inside
const SHOW_NAV_HEADER = true
const SidebarNavigable = ()=>{
    return  <Drawer.Navigator
        drawerContent={ (props)=> <CustomDrawerContent {...props}/>}
        screenOptions={{
            headerShown: SHOW_NAV_HEADER
        }}
        initialRouteName = ""
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
                header: (props) =>  <BaseHeader {...props}/>,
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
            name = "Settings"
            component = {Settings}
            options = {{
                header: (props) =>  <BaseHeader {...props}/>,
            }}
        />
        <Drawer.Screen
            name = "About Us"
            component = {AboutUs}
            options = {{
                header: (props) =>  <BaseHeader {...props}/>,
                headerTransparent: true,
                headerTitleStyle: {opacity: 0}
            }}
        />
        <Drawer.Screen
            name = "--DEBUG--"
            component = {Debug}
        />
    </Drawer.Navigator>
}
const BaseApp = ()=>{
    return <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name = "Login"
                component={Login}
            />
            <Stack.Screen
                name = "Survey"
                component={Survey}
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
                name = "SidebarNavigable"
                component={SidebarNavigable}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
        
       
    </NavigationContainer>
}

//Setting up recoil based state management
const App = ()=>{
    return <RecoilRoot>
        <BaseApp/> 
    </RecoilRoot> 
}


export default App