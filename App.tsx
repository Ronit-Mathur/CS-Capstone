import * as React from 'react';
import {Text, TextInput, View, Image } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'; 

/*
    Home Screen 
*/
function Home() {
  return (
      <View style ={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>This is the Home Page!</Text>
      </View>
  );
}


/* 
  Calendar Screen 
*/
function Calendar() {
  return (
      <View style ={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>This is the Calendar Page!</Text>
      </View>
  );
}


/*
    Stats Screen 
*/
function Stats() {
  return (
      <View style ={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>This is the Stats Page!</Text>
      </View>
  );
}




/* 
  Create Tabs to switch between Screens
*/
const MaterialTab = createMaterialTopTabNavigator();

function MaterialTabs () {
  return (
    <MaterialTab.Navigator initialRouteName='Home' tabBarPosition='bottom'>
      <MaterialTab.Screen name='Calendar' component={Calendar} />
      <MaterialTab.Screen name='Home' component={Home} />
      <MaterialTab.Screen name='Stats' component={Stats} />
    </MaterialTab.Navigator>
  );
}



//Main Application Function
const App = () => {
  return (
    <NavigationContainer>
      <MaterialTabs />
    </NavigationContainer>
  );
};

export default App;