import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {CalendarList} from 'react-native-calendars'
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import {AgendaNav} from './customAgenda';

import serverHandler from '../lib/server/serverHandler';
import StylingConstants from './StylingConstants';
import { tasksWithDate } from '../lib/server/tasks';

const StackNavigator = createNativeStackNavigator();



function CalendarNav() {
  
 
  return (
    <StackNavigator.Navigator >

      <StackNavigator.Screen name='CalendarScreen' component={CalendarScreen} options={{ title: 'Calendar' }} />

      <StackNavigator.Screen name='CalAgenda' component={AgendaNav} options={{ presentation: 'modal', title: 'Daily Agenda' }} />

    </StackNavigator.Navigator>
  );
}

async function getMarkedDays (){
   const datesFromServer = await tasksWithDate()
  
   try{
     datesFromServer.forEach(function(date:any){
        console.log(date.date)
     })
   }catch{
     console.log("failed to get dates")
   }

}
getMarkedDays()

function CreateCalendar() {

  var markedDay:any  = {}

  const formatDate = () => {
    const date = formatDates(new Date().toLocaleDateString().substring(0,10)).split('/')
  
    const reformat = [date[2],date[0], date[1]]
    const combine = reformat.join('-')
    return combine

  }

  

  function formatDates(dateString:string) {
    let [month, day, year] = dateString.split('/');
    month = month.length === 1 ? '0' + month : month;
    day = day.length === 1 ? '0' + day : day;
    return `${month}/${day}/${year}`;
  }
  markedDay[formatDate()] = {selected:true, selectedColor: StylingConstants.highlightColor}
  console.log(markedDay)
  const navigation = useNavigation();
  return (
    <CalendarList

    style={{
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,

    }} 

      markedDates={markedDay}
   
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
  async function getDates() {
    const dates = await tasksWithDate()
    console.log(dates)
  }
  
  return (

    <View style={{ flex: 0, position: 'relative' }}>
      <CreateCalendar />
    </View>
  );
}

export { CalendarNav};