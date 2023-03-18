import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, TextInput, View, Image, SafeAreaView, StyleSheet } from 'react-native';
import {Calendar, CalendarList} from 'react-native-calendars'
import TaskCreation from './tasks';
import {createNativeStackNavigator } from '@react-navigation/native-stack';
import ActionButton from 'react-native-action-button';
import {CustomAgenda} from './customAgenda';

const StackNavigator = createNativeStackNavigator();

const user = 'testuser1'

function CalendarNav (){
  return(
    <StackNavigator.Navigator >
      <StackNavigator.Screen name='CalendarScreen' component={CalendarScreen} options={{title:'Calendar'}}/>
      <StackNavigator.Screen name='Task' component={TaskCreation} options={{presentation:'modal'}}/>
      <StackNavigator.Screen name='CalAgenda' component={CustomAgenda} options={{presentation:'modal', title: 'Daily Agenda'}}/>
    </StackNavigator.Navigator>
  );
}



function CreateCalendar () {
  
  const navigation = useNavigation();
  return(
    <CalendarList style={{borderTopRightRadius:20,
      borderTopLeftRadius:20, 
      overflow:'hidden', 
      borderBottomLeftRadius:20, 
      borderBottomRightRadius:20, 
       
     }} 
     onDayPress={ (day) =>{navigation.navigate('CalAgenda', day)}}
     />
    // <Calendar  style={{
    //   borderTopRightRadius:20,
    //   borderTopLeftRadius:20, 
    //   overflow:'hidden', 
    //   borderBottomLeftRadius:20, 
    //   borderBottomRightRadius:20, 
       
    //  }} 
    //  theme={{
    //    'stylesheet.day.basic':{
    //      base:{
    //        width:32,
    //        height:100
    //      }
    //    }
    //  }}
    //  onDayPress={ day =>{navigation.navigate('CalAgenda')}}
     
    // />
  );
}

function CalendarScreen() {
  const navigation = useNavigation();
    return (
      
        <View style ={{flex:0, position:'relative'}}>
          <CreateCalendar />
        </View>
    );
  }

  export default CalendarNav;