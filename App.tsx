import * as React from 'react';
import {Text, TextInput, View, Image } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './components/homescreen';
import CalendarScreen from './components/calendarscreen';
import Stats from './components/statscreen'; 








/* 
  Create Tabs to switch between Screens
*/
const MaterialTab = createMaterialTopTabNavigator();

function MaterialTabs () {
  return (
    <MaterialTab.Navigator initialRouteName='Home' tabBarPosition='bottom' screenOptions={{
      
      tabBarStyle:{bottom: 25},
       
      
      
    }}>
      <MaterialTab.Screen name='Calendar' component={CalendarScreen} options={{
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