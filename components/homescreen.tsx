import * as React from 'react';
import {Text, TextInput, View, Image, SafeAreaView } from 'react-native';




function DailyMood(){
  return(
    <View>
        <Text>Input Daily Mood Here!</Text>
    </View>
  );
}

function CurrentDayTasks (){
  return(
    <View style={{
      flex:1, 
      position:'absolute', 
      top: "50%"
    }}>
      <Text>Current Day Tasks</Text>
    </View>
  ); 
}



function Home() {
    return (
        <SafeAreaView style ={{flex:1, alignItems: 'center', top:50}}>
          <DailyMood />
          <CurrentDayTasks />
        </SafeAreaView>

    );
  }

  export default Home; 