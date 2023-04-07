import * as React from 'react';
import { Text, TextInput, View, Image, SafeAreaView,Button } from 'react-native';
import ImportCalendar from './external_integration/importCalendar';
import {createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Settings } from './settingScreen';
import calImportPage from './CalImportPage';
import { ContributionGraph } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { screenHeight, screenWidth } from 'react-native-calendars/src/expandableCalendar/commons';
import { calcDayMood, getTaskRatingsMonth, rateManualTask } from './statsHelpers';
import serverHandler from '../lib/server/serverHandler';
const StackNavigator = createNativeStackNavigator();
var  user = ''

  
function Stats({Name}:any) {
  user = Name
  const navigation = useNavigation()
  const commitsData = [
    { date: "2023-03-02", count: 1 },
    { date: "2023-03-03", count: 2 },
    { date: "2023-03-04", count: 3 },
    { date: "2023-03-05", count: 4 },
    { date: "2023-03-06", count: 5 },
    { date: "2023-03-30", count: 2 },
    { date: "2023-03-31", count: 3 },
    { date: "2023-04-01", count: 2 },
    { date: "2023-04-02", count: 4 },
    { date: "2023-04-05", count: 2 },
    { date: "2023-04-23", count: 4 }
  ];
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 0) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
  const handleToolTip: any = {}
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is the Stats Page!</Text>
      {/* <MaterialCommunityIcons name ='calendar-import' color='black' size={55} style={{}} 
        onPress={()=> navigation.navigate('calImport')}
      /> */}
      <ContributionGraph 
      chartConfig={chartConfig}
      values={commitsData}
      tooltipDataAttrs={(value) => handleToolTip}
      width={screenWidth}
      height={225}
      endDate={new Date("2023-08-01")}/>
      
      <Text style={{padding: 10}}># of Rated Tasks:</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, height: 5, backgroundColor: 'black'}} />
          <View>
            <Text style={{width: 50, textAlign: 'center'}}>13</Text>
          </View>
        <View style={{flex: 1, height: 5, backgroundColor: 'black'}} />
      </View>

      <Text style={{padding: 10}}># of Days Rated</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, height: 5, backgroundColor: 'black'}} />
          <View>
            <Text style={{width: 50, textAlign: 'center'}}>5</Text>
          </View>
        <View style={{flex: 1, height: 5, backgroundColor: 'black'}} />
      </View>

      <Button title='calcDayMood' onPress={() => calcDayMood(serverHandler.current.userState.username, '04/06/2023')}></Button>
      <Button title='monthRatedTasks' onPress={() => getTaskRatingsMonth(serverHandler.current.userState.username, '04/2023')}></Button>
      <Button title='rateTask' onPress={() => rateManualTask(260)} ></Button>
      <ImportCalendar></ImportCalendar>
      
    
    </SafeAreaView>

  );


}

export default Stats;