import * as React from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {View} from 'react-native';
import {CalendarList, Calendar} from 'react-native-calendars'
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import {AgendaNav} from './customAgenda';

import serverHandler from '../lib/server/serverHandler';
import StylingConstants from './StylingConstants';
import { tasksWithDate } from '../lib/server/tasks';
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';

const StackNavigator = createNativeStackNavigator();



function CalendarNav() {
  
 
  return (
    <StackNavigator.Navigator >

      <StackNavigator.Screen name='CalendarScreen' component={CalendarScreen} options={{ title: 'Calendar' }} />

      <StackNavigator.Screen name='CalAgenda' component={AgendaNav} options={{ presentation: 'modal', title: 'Daily Agenda' }} />

    </StackNavigator.Navigator>
  );
}





function CreateCalendar() {
   
    const[loading, setLoading] = React.useState(true)
    const [markedDay, setMarkedDay] = React.useState({})
    
    async function getMarkedDays (){
    const datesFromServer = await tasksWithDate()
    var list:any  = {}
    
    try{
      datesFromServer.forEach(function(d:any){
         list[formatDate(d.date)] = {marked:true, dotColor: StylingConstants.lighterHighlightColor}
    
       
      })
    }catch{
      console.log("failed to get dates")
    }
    if(formatDate(formatDates(new Date().toLocaleDateString().substring(0,10))) in list ){
      list[formatDate(formatDates(new Date().toLocaleDateString().substring(0,10)))] = {marked:true, selected:true, selectedColor:StylingConstants.highlightColor}
    }else{
      list[formatDate(formatDates(new Date().toLocaleDateString().substring(0,10)))] = {selected:true, selectedColor: StylingConstants.highlightColor}
    }
    setMarkedDay(list)
 }
 useFocusEffect(React.useCallback(() => {
  const check = async () => {
  
    setLoading(true)
    getMarkedDays()
  }
  check()
  setLoading(false)
}, []))
 

  const formatDate = (date:any) => {
    date = date.split('/')
  
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
        displayLoadingIndicator={loading}
        onDayPress={(day) => { navigation.navigate('CalAgenda', day )}}
      />
  

  
   
  );
}



function CalendarScreen() {
  const navigation = useNavigation();
  
  
  return (

    <View style={{  }}>
      <CreateCalendar />
    </View>
  );
}

export { CalendarNav};