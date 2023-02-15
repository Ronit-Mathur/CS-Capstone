import * as React from 'react';
import {Text, TextInput, View, Image, SafeAreaView, ScrollView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer, useNavigation} from '@react-navigation/native';



const CurrentTasksTabs = createMaterialTopTabNavigator();

function InProgress(){
  return(
    <ScrollView style= {{borderWidth:3, width:'100%', flexGrow:0, height:430}}>
      <Text>InProgress</Text>
    </ScrollView>
  );
}

function Completed(){
  return(
    <ScrollView>
      <Text>Completed</Text>
    </ScrollView>
  );
}

function TopTabs () {
  return(
    <CurrentTasksTabs.Navigator style={{top:'30%', }} screenOptions={{
      tabBarStyle:{
        width:'50%', 
        alignSelf:'center',
        borderRadius:100,
      }
    }}>
      <CurrentTasksTabs.Screen name='Inprogress' component={InProgress} />
      <CurrentTasksTabs.Screen name='Completed' component={Completed} />
    </CurrentTasksTabs.Navigator>
  );
}



function DailyMood(){
  return(
    <SafeAreaView>
        <Text>Input Daily Mood Here!</Text>
    </SafeAreaView>
  );
}

function CurrentDayTasks (){
  return(
    <View style={{
      flex:1, 
      position:'absolute', 
      top: "50%"
    }}>
      <TopTabs />
    </View>
  ); 
}



function Home() {
    return (
      <NavigationContainer independent={true} > 
        <TopTabs /> 
      </NavigationContainer>

    );
  }

  export default Home; 