import * as React from 'react';
import {Text, TextInput, View, Image } from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'; 
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './components/homescreen';
import CalendarNav from './components/calendarscreen'
import Stats from './components/statscreen';
import TaskCreation from './components/tasks'; 
import serverHandler from './lib/server/serverHandler';






/* 
  Create Tabs to switch between Screens
*/
const MaterialTab = createMaterialTopTabNavigator();

/**
 * server setup
 */

 const SERVER_IP = "http://192.168.1.178";
 const SERVER_PORT = 6021;
 const ServerHandler = new serverHandler(SERVER_IP, SERVER_PORT);


function MaterialTabs () {
  return (
    <MaterialTab.Navigator initialRouteName='Home' tabBarPosition='bottom' screenOptions={{
      
      tabBarStyle:{bottom: 25},
    }}>
      <MaterialTab.Screen name='Calendar' component={CalendarNav} options={{
          tabBarIcon: ({ color, focused}) => (
            <MaterialCommunityIcons name="calendar-month" color='black' size={24}  />
          ),
          
        }}/>
      
      <MaterialTab.Screen name='Home' component={Home} options={{
          tabBarIcon: ({ color, focused}) => (
            <MaterialCommunityIcons name="home" color='black' size={24}  />
          ),
        }}/>
      <MaterialTab.Screen name='Stats' component={Stats} options={{
          tabBarIcon: ({ color, focused}) => (
            <MaterialCommunityIcons name="chart-bar" color='black' size={24}  />
          ),
        }}/>
    </MaterialTab.Navigator>
  );
}



//Main Application Function
const App = () => {
  return (
    <NavigationContainer >
      <MaterialTabs />
    </NavigationContainer>
    
  );
};

export default App;