import * as React from 'react';
import { Text, TextInput, View, Image, StatusBar } from 'react-native';
import { DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeScreenNav } from './components/homescreen';
import { CalendarNav } from './components/calendarscreen'
import Stats from './components/statscreen';
import serverHandler from './lib/server/serverHandler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CreateAccount } from './components/createaccount';
import { initLocalUser, loginUserSession } from "./lib/server/users";

import { isRemote } from './lib/server/users';
import { SignInScreen } from './components/SignInScreen';
import StylingConstants from './components/StylingConstants';
import StatsScreen from './components/newStatsScreen';
import PrivacyPolicyScreen from './components/PrivacyPolicyScreen';

/* 
  Create Tabs to switch between Screens
*/
const MaterialTab = createMaterialTopTabNavigator();
const StackNavigator = createStackNavigator();

/**
 * server setup
 */

const SERVER_IP = "https://mentalhealth.ra3.us";
const SERVER_PORT = 80;
const ServerHandler = new serverHandler(SERVER_IP, SERVER_PORT);



var userName = '';

function MainStack() {

  const [isSignedIn, setIsSignedIn] = React.useState(false)


  function verifySignIn(uName: string) {



    userName = uName

    setIsSignedIn(true)
  }

  if (!isSignedIn) {

    isRemote(async (remoteResult: boolean) => {
      if (remoteResult) {
        loginUserSession((result: boolean, username: string) => {
          if (!result) {
            return;
          }
          verifySignIn(username);
        });
      }
      else {
        await initLocalUser();
        verifySignIn(serverHandler.current.userState.username);
      }
    })

  }



  return (
    <StackNavigator.Navigator  >
      {!isSignedIn ? (
        <>
          <StackNavigator.Screen
            name="SignIn" children={() => <SignInScreen signIn={verifySignIn} />} options={{ headerShown: false }} />
          <StackNavigator.Screen name='Create Account' children={() => <CreateAccount signIn={verifySignIn} />} options={{
            presentation: 'modal', headerTintColor: "white", headerTitleStyle: { color: "white" }, headerStyle: { backgroundColor: StylingConstants.highlightColor, }, headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
          }} />
          <StackNavigator.Screen name='Privacy Policy' children={() => <PrivacyPolicyScreen />} options={{
            presentation: 'modal', headerTintColor: "white", headerTitleStyle: { color: "white" }, headerStyle: { backgroundColor: StylingConstants.highlightColor, }, headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
          }} />
        </>

      ) : (
        // User is signed in
        <StackNavigator.Screen name="MainApp" component={MaterialTabs} options={{
          headerShown: false
        }} />
      )}



    </StackNavigator.Navigator>
  );
}


function MaterialTabs() {
  return (
    <MaterialTab.Navigator initialRouteName='Home' tabBarPosition='bottom' style={{}} screenOptions={{

      tabBarStyle: { bottom: 25 },
      tabBarIndicatorStyle: {
        backgroundColor: StylingConstants.lighterHighlightColor
      }
    }}>
      {
        <MaterialTab.Screen name='Calendar' component={CalendarNav} options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="calendar-month" color='black' size={24} />
          ),

        }} />
      }

      <MaterialTab.Screen name='Home' component={HomeScreenNav} options={{
        tabBarIcon: ({ color, focused }) => (
          <MaterialCommunityIcons name="home" color='black' size={24} />
        ),
      }} />


      <MaterialTab.Screen name='Stats' children={() => <StatsScreen />} options={{
        tabBarIcon: ({ color, focused }) => (
          <MaterialCommunityIcons name="chart-bar" color='black' size={24} />
        ),
      }} />

    </MaterialTab.Navigator>
  );
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    background: 'white'
  },
};


//Main Application Function
const App = () => {


  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme} >
        <StatusBar backgroundColor={StylingConstants.highlightColor} barStyle="light-content" />
        <MainStack />
      </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;