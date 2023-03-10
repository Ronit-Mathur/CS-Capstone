import * as React from 'react';
import {Text, TextInput, SafeAreaView,View, Button} from 'react-native';
import { Agenda, DateData } from 'react-native-calendars';
import * as ServerHelpers from '../backend_server/lib/helpers';
import * as HSH from './homescreenhelpers';

function CustomAgenda (){
    const todaysDate = ServerHelpers.getTodaysDateAgendaFormat()
    const tasks = HSH.getCompletedTasks('testuser1')
    return(
    <Agenda
    items={{
        '2023-03-08': [],
        // '2023-02-25': [],
        // '2023-02-26': [],
        // '2023-02-27': []
      }}
      renderDay={(day, item) => {
        return <View />;
      }}
      selected={todaysDate}
      ></Agenda>
    );
}
export default CustomAgenda