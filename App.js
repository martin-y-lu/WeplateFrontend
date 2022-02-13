import * as React from "react"
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer'

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

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator();

// Help for nested navigations: 
// https://reactnavigation.org/docs/nesting-navigators/#navigator-specific-methods-are-available-in-the-navigators-nested-inside
const SHOW_NAV_HEADER = true
const SidebarNavigable = ()=>{
    return  <Drawer.Navigator
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