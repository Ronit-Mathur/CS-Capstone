import * as React from 'react';
import { Text, View, SafeAreaView, RefreshControl, Alert, Button, Pressable } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Daily from '../lib/server/daily';
import { getDaysTasks, addTask } from '../lib/server/tasks';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import * as Helpers from '../backend_server/lib/helpers';
import * as HSH from './homescreenhelpers';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Settings } from './settingScreen';
import { add } from 'react-native-reanimated';
import { TaskCreation } from './tasks'
import CalImportPage from './CalImportPage';
import helpers from '../backend_server/lib/helpers';
import StylingConstants from './StylingConstants';
import serverHandler from '../lib/server/serverHandler';
import { useState } from 'react';
import { getDay } from "../lib/server/daily";
import FiveDayMoodHistoryWidget from './widgets/fiveDayMoodHistoryWidget.js';
import ImportUserPhotoScreen, { AddToOnPhotoUpdated } from './external_integration/importUserPhoto';
import { GetUserPhoto } from './external_integration/importUserPhoto';
import RoundImage from './RoundImage';
import ImportCalendarScreen from './external_integration/importCalendarScreen';





const StackNavigator = createNativeStackNavigator();

function HomeScreenNav() {
  
  return (
    <StackNavigator.Navigator initialRouteName='Home'>
      <StackNavigator.Screen name='HomeScreen' component={Home} options={{ title: 'Home', headerShown: false, }} />

      <StackNavigator.Group  >
        <StackNavigator.Screen name='EditTask' component={HSH.EditTask} options={{ presentation: 'modal', headerStyle: { backgroundColor: 'transparent', }, title: '', contentStyle: { backgroundColor: 'transparent' } }} />
        <StackNavigator.Screen name='RankTask' component={HSH.RankTask} options={{ presentation: 'modal', headerStyle: { backgroundColor: 'transparent', }, title: '', contentStyle: { backgroundColor: 'transparent' } }} />
        <StackNavigator.Screen name='Settings' component={Settings} options={{
          presentation: 'containedModal', headerTintColor:"white", headerTitleStyle:{color:"white"} ,headerStyle: {backgroundColor: StylingConstants.highlightColor, }, headerShadowVisible: false, // applied here
          headerBackTitleVisible: false, 
        }} />
        <StackNavigator.Screen name='calImport' component={CalImportPage} options={{ presentation: 'containedModal' }} />
        <StackNavigator.Screen name='AddTask' component={TaskCreation} options={{ presentation: 'modal' }} />
        <StackNavigator.Screen name="ImportUserPhoto" component={ImportUserPhotoScreen} options={{  headerTintColor:"white", headerTitleStyle:{color:"white"}, presentation: 'containedModal', headerStyle: { backgroundColor: 'transparent', }, title: "Edit Photo", contentStyle: { backgroundColor: 'transparent' } }}></StackNavigator.Screen>
        <StackNavigator.Screen name="ImportCalendar" component={ImportCalendarScreen} options={{ headerTintColor:"white", headerTitleStyle:{color:"white"},
          presentation: 'containedModal', headerStyle: { backgroundColor: 'transparent', }, title: "Import Calendar", headerShadowVisible: false, // applied here
          headerBackTitleVisible: false
        }}></StackNavigator.Screen>

      </StackNavigator.Group>
    </StackNavigator.Navigator>
  );
}

function Header() {
  const date = Helpers.getTodaysDate()
  const navigation = useNavigation()

  const [base64Image, setBase64Image] = useState("");

  AddToOnPhotoUpdated((base64: string) => {
    setBase64Image(base64);
  });

  var photo =
    <MaterialCommunityIcons name='account-circle-outline' color='black' size={70} style={{

      position: 'absolute',
      padding: 0,
      zIndex: 3,
      elevation: 3,
      marginLeft: -2.5,
      marginTop: -3.5
    }}


      onPress={() => navigation.navigate('Settings')}
    />

  if (base64Image == "") {
    GetUserPhoto((base64: any) => {
      if (base64 == null) {
        setBase64Image("null");
      }
      else {
        setBase64Image(base64);
      }
    })
  }

  if (base64Image != "null" && base64Image != "") {
    photo =
      <Pressable onPress={() => navigation.navigate('Settings')} style={{

        position: 'absolute',
        padding: 0,
        zIndex: 3,
        elevation: 3,
        marginLeft: 2.5,
        marginTop: 2.5
      }}>{RoundImage({ uri: "data:image/png;base64," + base64Image }, 60)}
      </Pressable>

  }

 
  return (
    <View style={{

      flexDirection: "column",
      overflow: "hidden",
      height: "50%",
      paddingTop: "8%",
      paddingBottom: "8%",
      paddingLeft: "4%",
      backgroundColor: StylingConstants.highlightColor,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      elevation: 1,
      zIndex: 2,
      shadowOpacity: 1,
      shadowColor: "gray"
    }}>
      <Text style={{
        flex: 1,
        fontSize: StylingConstants.massiveFontSize,
        color: "white",
        fontFamily: StylingConstants.defaultFontBold

      }}>Welcome {helpers.capitalizeFirstLetter(serverHandler.current.userState.username)}</Text>


      <Text style={{
        flex: 1,
        fontSize: StylingConstants.normalFontSize,
        color: StylingConstants.lightFontColor,
        fontFamily: StylingConstants.defaultFont
      }} >{date}</Text>


      <View style={{ position: 'absolute', right: "5%", top: "40%", width: 70, height: 70 }}>
        <View style={{
          backgroundColor: "white", position: 'absolute', zIndex: 1, elevation: 1, width: 65, height: 65, borderRadius: 65 / 2
        }}></View>
        <View style={{
          backgroundColor: 'white', position: 'absolute', zIndex: 2, elevation: 2, width: 50, height: 50, borderRadius: 50 / 2, marginLeft: 5, marginRight: 5, marginTop: 5
        }}></View>
        {photo}
      </View>
    </View>


  );

}

function DailyMood() {

  const date = Helpers.getTodaysDate()
  const [dayAlreadyRated, SetDayAlreadyRated] = useState(false);

  const message = 'Your mood for ' + date + ' has been recorded!'
  const moodRated = () => {
    Alert.alert('Daily Mood Recorded', message, [
      {
        text: 'Dismiss',
        onPress: () => console.log('Dismissed'),

      },

    ]);

    SetDayAlreadyRated(true);
  }

  if (!dayAlreadyRated) {
    getDay(helpers.getTodaysDate()).then((rating) => {
      if (rating != null) {
        SetDayAlreadyRated(true);
      }
    });
  }

  var content = <FiveDayMoodHistoryWidget />
  if (!dayAlreadyRated) {
    content = <View><Text style={{
      fontSize: StylingConstants.normalFontSize,
      color:"black",
      fontFamily: StylingConstants.defaultFont,
      marginBottom: "2%",
    }}>How are you Feeling Today?</Text>

      <View style={{
        flexDirection: 'row',
        borderWidth: 0,


      }}>
        <MaterialCommunityIcons name='emoticon-frown-outline' color="#f55a42" size={60} style={{
          flex: 1,
        }}
          onPress={async () => { await Daily.rateDay(serverHandler.current.userState.username, 1); moodRated(); }}
        />
        <MaterialCommunityIcons name='emoticon-sad-outline' color="#f58a42" size={60} style={{
          flex: 1,
        }}
          onPress={async () => { await Daily.rateDay(serverHandler.current.userState.username, 2); moodRated() }}
        />
        <MaterialCommunityIcons name='emoticon-neutral-outline' color="#f5e942" size={60} style={{
          flex: 1,
        }}
          onPress={async () => { await Daily.rateDay(serverHandler.current.userState.username, 3); moodRated() }}
        />
        <MaterialCommunityIcons name='emoticon-happy-outline' color="#cfff30" size={60} style={{
          flex: 1,
        }}
          onPress={async () => { await Daily.rateDay(serverHandler.current.userState.username, 4); moodRated() }}
        />
        <MaterialCommunityIcons name='emoticon-outline' color="#7ef763" size={60} style={{
          flex: 1,
        }}
          onPress={async () => { await Daily.rateDay(serverHandler.current.userState.username, 5); moodRated() }}
        />
      </View>
    </View>;
  }

  return (
    <View style={{


      width: '100%',
      padding: "2%",
      borderWidth: 0,
      paddingLeft: "2%",
      paddingRight: "2%",
      marginLeft: "2%",
      marginRight: "2%",
      flexDirection: "column",
      paddingTop: "2%",

    }}>

      {content}







    </View>
  );

}

const CurrentTasksTabs = createMaterialTopTabNavigator()


/*Create the tabs to switch between current and completed tasks*/
function TopTabs() {
  return (


    /*General tab styles*/
    <CurrentTasksTabs.Navigator style={{
      borderWidth: 0,



    }}
      screenOptions={{

        tabBarStyle: {

          width: '85%',
          alignSelf: 'center',
       
          borderRadius: 8,
          shadowOpacity: 1,
          backgroundColor: StylingConstants.lighterHighlightColor



        },
        tabBarLabelStyle: {  fontWeight: "bold", color: "white", fontFamily: StylingConstants.defaultFont, alignSelf: "center", },

        tabBarContentContainerStyle: {
          flex: 1,
          backgroundColor: "transparent",
          borderRadius: 8,



        },

        tabBarIndicatorContainerStyle: {
          flex: 1,

          backgroundColor: 'transparent',
          borderRadius: 8,

        },

        tabBarIndicatorStyle: {
          flex: 1,
          height: '100%',
          borderRadius: 8,
          backgroundColor: StylingConstants.highlightColor,
          opacity: 1,

        },


      }

      }>

      <CurrentTasksTabs.Screen name='Inprogress' component={InProgress} options={{
        title: 'Scheduled',
      }} />
      <CurrentTasksTabs.Screen name='Completed' component={Completed} />
    </CurrentTasksTabs.Navigator>

  );
}



function InProgress() {
  const [refreshing, setRefreshing] = React.useState(false)
  const [list, setList] = React.useState([])

  const nav = useNavigation()

  React.useEffect(() => {
    const check = async () => {
      setList(await HSH.getCurrentTasks())
    }
    check()
    
  }, [])

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setList(await HSH.getCurrentTasks())
    setRefreshing(false);
  }, [refreshing])


  return (
    <View style={{
      flex: 1,
    }}>
      <FlatList
        data={list}
        renderItem={({ item }) => TaskWidget({ item }, nav, false)}
        style={{
          flex: 1,
          marginBottom: '10%',
          marginTop: '7%',
          shadowOpacity: .5,
          backgroundColor:'white'

        }}

        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}



function Completed() {
  const [refreshing, setRefreshing] = React.useState(false)
  const [list, setList] = React.useState([])

  React.useEffect(() => {
    const check = async () => {
      setList(await HSH.getCompletedTasks(serverHandler.current.userState.username))
    }
    check()
    
  }, [])
  const nav = useNavigation()

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    setList(await HSH.getCompletedTasks(serverHandler.current.userState.username))
    //setList(list)
    setRefreshing(false)
  }, [refreshing])


  return (
    <View style={{
      flexGrow: 1,
      
    }}>
      <FlatList
        data={list}
        renderItem={({ item }) => TaskWidget({ item }, nav, true)}
        style={{
          flexGrow: 1,
          marginBottom: '10%',
          marginTop: '5%',
          shadowOpacity: 1,
          backgroundColor:'white'
        }}
        contentContainerStyle={{

        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const todaysDate = Helpers.getTodaysDate()



function TaskWidget({ item }: any, Nav: any, isCompleted: boolean) {
  var bool = false
  if (item.summary.length > 24) {
    bool = true
  } else {
    bool = false
  }

  var navPath = 'EditTask';
  if (isCompleted) {
    navPath = 'RankTask';
  }

  return (<View style={{ marginLeft: "2%", marginRight: "2%", marginBottom: 5, borderLeftWidth: 3, borderColor: StylingConstants.highlightColor, flexDirection: "row", justifyContent: "space-between", alignItems: "center",  }}>
    <View style={{ marginLeft: "2%" }}>
      <Text style={{ color: 'black', fontWeight: "bold", fontSize: StylingConstants.subFontSize }}>{helpers.toTitleCase(item.summary.substring(0, 25))} {bool ? '...' : ''}</Text>
      <Text style={{ color: 'black', fontSize: StylingConstants.tinyFontSize }}>Start Time: {item.startTime}</Text>
      <Text style={{ color: 'black', fontSize: StylingConstants.tinyFontSize }}>End Time: {item.endTime}</Text>
      <Text style={{ color: 'black', fontSize: StylingConstants.tinyFontSize }}>Location: {item.location}</Text>
    </View>
    <MaterialCommunityIcons name='chevron-right' color="white" size={40} style={{
      backgroundColor: StylingConstants.highlightColor,
      borderRadius: 8,
    }}

      onPress={() => Nav.navigate(navPath, { task: { item } })}
    />
  </View>)
}


function Home() {
  const [unratedTaskList, setUnratedTaskList] = React.useState([]);
  const navigation = useNavigation();
  const message = 'You have unrated Tasks! Would you like to rate them now?'

  /** 
  React.useEffect(() => {
    const check = async () => {
      const list = await HSH.checkForUnRatedTasks()
      setUnratedTaskList(list)
      
    }
    check()
    
  }, [])
  **/

  const unRatedTasks = () => {
    Alert.alert('UnRated Tasks', message, [
      {
        text: 'Dismiss',
        onPress: () => console.log('Dismissed'),

      },

    ])
  }


  /** 
 if(Object.keys(unratedTaskList).length != 0){
   unRatedTasks()
 }
 **/


  //var result = await getCurrentTaskProgressAndMax();

  const getCurrentTaskProgressAndMax = async (callback: any) => {
    var completed = await HSH.getCompletedTasks(user);
    var left = await HSH.getCurrentTasks(user);
    callback(completed.length, completed.length + left.length);
  }
  

  return (
    <SafeAreaView style={{
      flex: 1,

    }}>
      <View style={{
        flex: 2,


      }}>
        <Header />
        <DailyMood />
      </View>
      <View style={{
        flex: 3,
        width: '90%',
        alignSelf: 'center',


      }}>
        <Text style={{
          alignSelf: "center",

          fontSize: StylingConstants.normalFontSize,
          color: "black",
          fontFamily: StylingConstants.defaultFontBold,
          marginBottom: "2%"


        }}>Your Tasks Today</Text>
        <TopTabs />

      </View>


      
      <ActionButton

        position='right'
        size={75}
        buttonColor={StylingConstants.highlightColor}
        onPress={() => navigation.navigate('AddTask')}
        style={{ marginRight: 0, marginBottom: '3%' }}
      />
    

    </SafeAreaView>

  );
}


async function addNewTask() {
  const currentDate = Helpers.getTodaysDate()
  const addNew = await addTask('kway66', 'Test', currentDate, 'Lumen Field', '18:00', '24:00')

  console.log(addNew);
}





export { HomeScreenNav}; 