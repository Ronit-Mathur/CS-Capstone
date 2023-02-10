import * as React from 'react';
import { Text, TextInput, View, Image, SafeAreaView,Button } from 'react-native';
import ImportCalendar from './external_integration/importCalendar';


function Stats() {
  
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is the Stats Page!</Text>
      <ImportCalendar></ImportCalendar>
    
    </SafeAreaView>

  );


}

export default Stats;