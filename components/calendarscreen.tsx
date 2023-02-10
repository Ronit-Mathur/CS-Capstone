import * as React from 'react';
import { NavigationContainer, useNavigation} from '@react-navigation/native';
import {Text, TextInput, View, Image, SafeAreaView, StyleSheet } from 'react-native';
import {Calendar} from 'react-native-calendars'
import TaskCreation from './tasks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const StackNavigator = createNativeStackNavigator();

function CalendarNav (){
  return(
    <StackNavigator.Navigator initialRouteName='CalendarScreen'>
      <StackNavigator.Screen name='CalendarScreen' component={CalendarScreen} />
      <StackNavigator.Group screenOptions={{presentation:'modal'}}>
        <StackNavigator.Screen name='Task' component={TaskCreation} />

      </StackNavigator.Group>
    </StackNavigator.Navigator>
  );
}






function CreateCalendar () {
  
  const navigation = useNavigation();
  return(
    
    <Calendar  style={{
      borderTopRightRadius:20,
      borderTopLeftRadius:20, 
      overflow:'hidden', 
      borderBottomLeftRadius:20, 
      borderBottomRightRadius:20,  
     }} 
     theme={{
       'stylesheet.day.basic':{
         base:{
           width:32,
           height:100
         }
       }
     }}
     onDayPress={ day =>{navigation.navigate('Task')}}
     
    />
  );
}







function CalendarScreen() {
    return (
      
        <View style ={{flex:1, justifyContent:'center'}}>
          <CreateCalendar />
        </View>
    );
  }

  export default CalendarNav;