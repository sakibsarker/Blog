import { NavigationContainer } from '@react-navigation/native'
import React, {useState, useEffect } from 'react'
import {ActivityIndicator,View} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import auth from '@react-native-firebase/auth'
import Home from './Screen/Main/Home'
import Blog from './Screen/Main/Blog'
import CreateBlog from './Screen/Main/CreateBlog'
import Login from './Screen/auth/Login'
import Register from './Screen/auth/Register'
const Stack= createStackNavigator()
const Tab=createMaterialTopTabNavigator()

export default function App(){
const[loggedIn, setLoggedIn]=useState(false)
const[loading, setLoading]=useState(false)

if(loading){
  return(
    <ActivityIndicator
    size={32}
    color='gray'
    />

  )
}

if(!loggedIn){
  return(
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Login'>
        <Tab.Screen name='Login' component={Login}/>
        <Tab.Screen name='Register' component={Register}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}

  return (
   <NavigationContainer>
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Home' component={Home}/>
      <Stack.Screen name='CreateBlog' component={CreateBlog}/>
      <Stack.Screen name='Blog' component={Blog}/>
    </Stack.Navigator>
   </NavigationContainer>
  )
}

