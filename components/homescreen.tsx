import * as React from 'react';
import {Text, TextInput, View, Image, SafeAreaView, ScrollView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Daily from '../lib/server/daily';
import { getDaysTasks } from '../lib/server/tasks';
import { FlatList } from 'react-native-gesture-handler';
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


var testList: readonly any[] | null | undefined = []


async function getList (){
  const tasks = await getDaysTasks(user, '22/02/2023')
  

  var tasksConverted = Object.values(tasks)
  tasksConverted.forEach(function(task){
    testList.push(task)
  })
  
}




const CurrentTasksTabs = createMaterialTopTabNavigator();

const Item = ({title, startTime, endTime}) => (
  <View style={{borderWidth: 0, flexDirection:'column', backgroundColor:'gray', alignItems:'center', width:'83%', alignSelf:'center', borderRadius:15}} >
    <Text style={{fontSize: 15, paddingBottom:5, color:'white'}} >Title: {title}</Text>
    <Text style={{fontSize: 15, paddingBottom:5, color:'white'}}>Start Time: {startTime}</Text>
     <Text style={{fontSize: 15, paddingBottom:5, color:'white'}}>End Time: {endTime}</Text>
  </View>
);
/*Tasks that have yet to be completed*/
function InProgress(){
  return(
    <SafeAreaView >
      <FlatList  ItemSeparatorComponent={()=> <View style={{height:'5%',}}></View>} data={testList} renderItem={({item})=> <Item title= {item.summary} startTime={item.startTime} endTime={item.endTime} />} style={{borderWidth:0,top:'5%', shadowOpacity:.75, shadowRadius:4}} contentContainerStyle={{borderWidth:0, height:'77%', paddingTop:'2%'}}/>
    </SafeAreaView>
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

function VerifiyDateFormat (d:String){
  var parts = d.split("/");
  if(parts[0].length == 1){
    parts[0] = "0" + parts[0];
  }
  if (parts[1].length == 1){
    parts[1] = "0" + parts[1];
  }
  return parts.join("/"); 
}


function DailyMood(){

  const date = new Date().toLocaleDateString()
  const dateFormatted = VerifiyDateFormat(date)
  
  
  return(
    <SafeAreaView style={{
      borderWidth:0,//delete after design completion
      width:'90%',
      height:'27%',
      alignSelf:'center',
      top:'7%',
      shadowOpacity:1,
    }}>
        <Text style={{fontSize: 25, textDecorationLine:'underline'}}>Welcome {user}</Text>
        <Text style={{fontSize:17, alignSelf:'center', top:'10%'}}>How Are You Feeling Today?</Text>
        <MaterialCommunityIcons name ='emoticon-outline' color='#07f246' size={55} style={{
          top:'50%',
          right:'3%',
          position:'absolute',
         
        }} 
        onPress = {async () => {await Daily.rateDay(user,dateFormatted,5);}} />
        <MaterialCommunityIcons name ='emoticon-happy-outline' color='#096622' size={55} style={{
          top:'50%',
          right:'23%',
          position:'absolute',
          
          
        }} 
        onPress={async()=> {await Daily.rateDay(user,dateFormatted, 4);}} />
        <MaterialCommunityIcons  name ='emoticon-neutral-outline' color='#ded52c' size={55} style={{
          top:'50%',
          right:'42%',
          position:'absolute', 
         
        }} 
        onPress={async() => { await Daily.rateDay(user, dateFormatted, 3);}}
        />
        <MaterialCommunityIcons name ='emoticon-sad-outline' color='#fa7916' size={55} style={{
          top:'50%',
          left:'23%',
          position:'absolute',
      
        }} 
        onPress={async ()=> {await Daily.rateDay(user,dateFormatted,2);}}
        />
        <MaterialCommunityIcons name ='emoticon-frown-outline' color='red' size={55} style={{
          top:'50%',
          left:'3%',
          position:'absolute', 
       
        }} 
        onPress={async()=> {await Daily.rateDay(user,dateFormatted,1);}}
        />

        <Text style={{alignSelf:'center', position:'absolute', bottom:'0%', fontSize:25,}}>Your Day: {date}</Text>
    </SafeAreaView>
  );
}


function Home() {
  getList()
    return (
      <NavigationContainer independent={true} > 
        <DailyMood />
        <TopTabs /> 
      </NavigationContainer>

    );
  }

  export default Home; 