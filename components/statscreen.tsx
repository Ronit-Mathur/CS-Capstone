import * as React from 'react';
import { Text, TextInput, View, Image, SafeAreaView,Button } from 'react-native';
import ImportCalendar from './external_integration/importCalendar';
import {createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Settings } from './settingScreen';
import calImportPage from './CalImportPage';

const StackNavigator = createNativeStackNavigator();
var  user = ''

  
function Stats({Name}:any) {
  user = Name
  const navigation = useNavigation()
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is the Stats Page!</Text>
      {/* <MaterialCommunityIcons name ='calendar-import' color='black' size={55} style={{}} 
        onPress={()=> navigation.navigate('calImport')}
          /> */}
      <ImportCalendar></ImportCalendar>
    
    
    </SafeAreaView>

  );


}

export default Stats;