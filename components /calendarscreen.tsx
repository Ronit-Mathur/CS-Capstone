import { useLinkProps } from '@react-navigation/native';
import * as React from 'react';
import {Text, TextInput, View, Image, SafeAreaView, StyleSheet } from 'react-native';
import {Calendar} from 'react-native-calendars'










function CreateCalendar () {
   
  /* const [{key,theme}, setTheme] = React.useState({key:'dark', theme:{
    'stylesheet.day.basic':{
      base:{
        width: 32,
        height: 50
      }
    }
  }}) */
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
     
     
    />
  );
}







function CalendarScreen() {
    return (
        <SafeAreaView style ={{flex:1, justifyContent:'center'}}>
          <CreateCalendar />
        </SafeAreaView>
    );
  }

  export default CalendarScreen;