import * as React from 'react';
import {Text, TextInput, SafeAreaView,View, Button} from 'react-native';
import { Agenda } from 'react-native-calendars';

function customAgenda (){
    <Agenda
    items={{
        '2023-02-24': [],
        '2023-02-25': [],
        '2023-02-26': [],
        '2023-02-27': []
      }}
      renderDay={(day, item) => {
        return <View />;
      }}
      selected={'2023-02-24'}
      ></Agenda>
}
export default customAgenda