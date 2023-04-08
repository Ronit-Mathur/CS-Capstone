import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput, View, Image, SafeAreaView, StyleSheet } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars'
import {TaskCreation} from './tasks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActionButton from 'react-native-action-button';
import { CustomAgenda, AgendaNav } from './customAgenda';
import { getUser } from './homescreen';
import serverHandler from '../lib/server/serverHandler';

const StackNavigator = createNativeStackNavigator();

var user = ''

function CalendarNav({ Name }: any) {
  user = Name
 
  return (
    <StackNavigator.Navigator >

      <StackNavigator.Screen name='CalendarScreen' component={CalendarScreen} options={{ title: 'Calendar' }} />

      <StackNavigator.Screen name='CalAgenda' component={AgendaNav} options={{ presentation: 'modal', title: 'Daily Agenda' }} />

    </StackNavigator.Navigator>
  );
}

const sendUserName = () => {
  return user
}

function CreateCalendar() {



  const navigation = useNavigation();
  return (
    <CalendarList

    style={{
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      //overflow: 'hidden',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,

    }} 
   
      onDayPress={(day) => { navigation.navigate('CalAgenda', day )}}
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

    <View style={{ flex: 0, position: 'relative' }}>
      <CreateCalendar />
    </View>
  );
}

export { CalendarNav, sendUserName };