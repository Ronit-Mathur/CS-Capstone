import * as React from 'react';
import {Text, TextInput, View, Image, SafeAreaView, ScrollView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Daily from '../lib/server/daily';
/* The Styling for the Current Tasks Component */
const CurrentDayTasksStyle ={
      borderWidth:0,//delete after design completion 
      width:'80%', 
      flexGrow:0, 
      height:'77%', 
      alignSelf:'center', 
      top:10,
}

const user = 'testuser1' //place holder for once we have user functionality

const CurrentTasksTabs = createMaterialTopTabNavigator();


/*Tasks that have yet to be completed*/
function InProgress(){
  return(
    <ScrollView style= {CurrentDayTasksStyle}>
      <Text>InProgress</Text>
    </ScrollView>
  );
}

/*Tasks for the current day that have already been completed*/
function Completed(){
  return(
    <ScrollView style={CurrentDayTasksStyle}>
      <Text>Completed</Text>
    </ScrollView>
  );
}

/*Create the tabs to switch between current and completed tasks*/
function TopTabs () {
  return(
    
    /*General tab styles*/
    <CurrentTasksTabs.Navigator style={{
        top:'10%',
        position:'relative'
      }} 
      screenOptions={{
      
      tabBarStyle:{
        width:'75%', 
        alignSelf:'center',
        borderRadius:100,
        shadowOpacity:.50,
      },
    
     }}>
     
      <CurrentTasksTabs.Screen name='Inprogress' component={InProgress}  options={{
        title:'Scheduled',
        tabBarIndicatorStyle:{
          height:'60%',
          borderRadius:100,
          bottom:'20%',
          left:'2.5%', 
          backgroundColor:'maroon', 
          opacity:.5, 
          
        }
      }} />
      <CurrentTasksTabs.Screen name='Completed' component={Completed} options={{
        tabBarIndicatorStyle:{
          height:'60%',
          borderRadius:100,
          bottom:'20%',
          backgroundColor:'maroon', 
          opacity:.5, 
          position:'absolute',
          marginRight:'55%'
        }
      }} />
    </CurrentTasksTabs.Navigator>
  );
}



function DailyMood(){
  const [moodValue, setMoodValue] = React.useState(0)
  const date = new Date().toLocaleDateString()
  return(
    <SafeAreaView style={{
      borderWidth:0,//delete after design completion
      width:'90%',
      height:'27%',
      alignSelf:'center',
      top:'7%'
    }}>
        <Text style={{fontSize: 25, textDecorationLine:'underline'}}>Welcome {user}</Text>
        <Text style={{fontSize:17, alignSelf:'center', top:'10%'}}>How Are You Feeling Today?</Text>
        <MaterialCommunityIcons name ='emoticon-outline' color='#07f246' size={55} style={{
          top:'50%',
          right:'3%',
          position:'absolute',
          shadowOpacity:.7,
          shadowColor:'green',
          shadowRadius:1,
        }} 
        onPress = {async () => {setMoodValue(5); await Daily.rateDay(user,date,moodValue);}} />
        <MaterialCommunityIcons name ='emoticon-happy-outline' color='#096622' size={55} style={{
          top:'50%',
          right:'23%',
          position:'absolute',
          shadowOpacity:.5,
          shadowColor:'#096622',
          shadowRadius:1,
          
        }} 
        onPress={async()=> {setMoodValue(4); await Daily.rateDay(user,date, moodValue);}} />
        <MaterialCommunityIcons name ='emoticon-neutral-outline' color='#ded52c' size={55} style={{
          top:'50%',
          right:'42%',
          position:'absolute', 
          shadowOpacity:.5,
          shadowColor:'#ded52c', 
          shadowRadius:1,
        }} 
        onPress={async() => {setMoodValue(3); await Daily.rateDay(user, date, moodValue);}}
        />
        <MaterialCommunityIcons name ='emoticon-sad-outline' color='#fa7916' size={55} style={{
          top:'50%',
          left:'23%',
          position:'absolute',
          shadowOpacity:.5,
          shadowColor:'#fa7916',
          shadowRadius:1,
        }} 
        onPress={async ()=> {setMoodValue(2); await Daily.rateDay(user,date,moodValue);}}
        />
        <MaterialCommunityIcons name ='emoticon-frown-outline' color='red' size={55} style={{
          top:'50%',
          left:'3%',
          position:'absolute', 
          shadowOpacity:.5,
          shadowColor:'red',
          shadowRadius:1,
        }} 
        onPress={async()=> {setMoodValue(1); await Daily.rateDay(user,date,moodValue);}}
        />
        <Text style={{
          position:'absolute',
          alignSelf:'center',
          bottom:'15%',
        }}>Current Daily Mood: {moodValue} </Text>
        <Text style={{alignSelf:'center', position:'absolute', bottom:'0%', fontSize:25}}>Your Day</Text>
    </SafeAreaView>
  );
}


function Home() {
    return (
      <NavigationContainer independent={true} > 
        <DailyMood />
        <TopTabs /> 
      </NavigationContainer>

    );
  }

  export default Home; 