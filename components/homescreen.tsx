import * as React from 'react';
import {Text, TextInput, View, Image, SafeAreaView, ScrollView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TabBarIndicator } from 'react-native-tab-view';

const CurrentDayTasksStyle ={
      borderWidth:3, 
      width:'90%', 
      flexGrow:0, 
      height:'70%', 
      alignSelf:'center', 
      top:10,
}

const user = 'Kyler'

const CurrentTasksTabs = createMaterialTopTabNavigator();

function InProgress(){
  return(
    <ScrollView style= {CurrentDayTasksStyle}>
      
      
      <Text>InProgress</Text>
    </ScrollView>
  );
}

function Completed(){
  return(
    <ScrollView style={CurrentDayTasksStyle}>
      <Text>Completed</Text>
    </ScrollView>
  );
}

function TopTabs () {
  return(
    <CurrentTasksTabs.Navigator style={{
        top:'15%',
      }} 
      screenOptions={{
      
      tabBarStyle:{
        width:'75%', 
        alignSelf:'center',
        borderRadius:100,
        shadowOpacity:.50,
      },
    
     }}>
      <CurrentTasksTabs.Screen name='Inprogress' component={InProgress} options={{
        tabBarIndicatorStyle:{
          height:'60%',
          borderRadius:100,
          bottom:'20%',
          left:'2.5%', 
          backgroundColor:'maroon', 
          opacity:.5, 
          
        }
      }} />
      <CurrentTasksTabs.Screen name='Completed' component={Completed} options={{
        tabBarIndicatorStyle:{
          height:'60%',
          borderRadius:100,
          bottom:'20%',
          backgroundColor:'maroon', 
          opacity:.5, 
          marginRight:'55%'
        }
      }} />
    </CurrentTasksTabs.Navigator>
  );
}



function DailyMood(){
  return(
    <SafeAreaView style={{
      borderWidth:0,
      width:'90%',
      height:'20%',
      alignSelf:'center',
      top:'7%'
    }}>
        <Text style={{fontSize: 20, textDecorationLine:'underline'}}>Welcome {user}</Text>
    </SafeAreaView>
  );
}


function Home() {
    return (
      <NavigationContainer independent={true} > 
        <DailyMood />
        <TopTabs /> 
      </NavigationContainer>

    );
  }

  export default Home; 