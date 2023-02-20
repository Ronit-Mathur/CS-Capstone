import * as React from 'react';
import { Text, TextInput, View, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './components/homescreen';
import CalendarNav from './components/calendarscreen'
import Stats from './components/statscreen';
import TaskCreation from './components/tasks';
import serverHandler from './lib/server/serverHandler';
import {
  SafeAreaProvider, useSafeAreaInsets
} from 'react-native-safe-area-context';


import {createUser} from "./lib/server/users";


/* 
  Create Tabs to switch between Screens
*/
const MaterialTab = createMaterialTopTabNavigator();

/**
 * server setup
 */

const SERVER_IP = "https://mentalhealth.ra3.us";
const SERVER_PORT = 443;
const ServerHandler = new serverHandler(SERVER_IP, SERVER_PORT);


function MaterialTabs() {
  return (
    <MaterialTab.Navigator initialRouteName='Home' tabBarPosition='bottom' screenOptions={{
      
      tabBarStyle: { bottom: 25 },
      tabBarIndicatorStyle:{
        backgroundColor:'maroon'
      },
    }}>
      <MaterialTab.Screen name='Calendar' component={CalendarNav}  options={{
        tabBarIcon: ({ color, focused }) => (
          <MaterialCommunityIcons name="calendar-month" color='black' size={24} />
        ),
        
      }} />

      <MaterialTab.Screen name='Home' component={Home} options={{
        tabBarIcon: ({ color, focused }) => (
          <MaterialCommunityIcons name="home" color='black' size={24} />
        ),
      
      }} />
      <MaterialTab.Screen name='Stats' component={Stats} options={{
        tabBarIcon: ({ color, focused }) => (
          <MaterialCommunityIcons name="chart-bar" color='black' size={24} />
        ),
      }} />
    </MaterialTab.Navigator>
  );
}



//Main Application Function
const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer >
        <MaterialTabs />
      </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;