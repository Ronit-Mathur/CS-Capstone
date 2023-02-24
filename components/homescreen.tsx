import * as React from 'react';
import {Text, View,SafeAreaView, RefreshControl} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {DefaultTheme, NavigationContainer, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Daily from '../lib/server/daily';
import { getDaysTasks, addTask} from '../lib/server/tasks';
import { FlatList } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import * as Helpers from '../backend_server/lib/helpers';
import * as HSH from './homescreenhelpers';






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


const sTasks = [
  {summary: 'Work', location: 'Lumen Field', startTime:'14:00', endTime:'16:00'},
  {summary: 'Capstone Meeting', location: 'CS Lounge', startTime:'16:00', endTime:'18:00'},
  {summary: 'Dinner', location: 'Home', startTime:'18:30', endTime:'20:00'},
  {summary: 'Bed', location: 'Home', startTime:'22:00', endTime:'8:00'},
]





const CurrentTasksTabs = createMaterialTopTabNavigator();


async function addNewTask (){
    const currentDate = Helpers.getTodaysDate()
    const addNew = await addTask(user, 'KylerTest', currentDate, 'Lumen Field', '14:00', '19:00')
}



addNewTask()

const Item = ({title, startTime, endTime, location}) => (
  <View style={{borderWidth: 0, flexDirection:'column', backgroundColor:'gray', alignItems:'center', width:'83%', alignSelf:'center', borderRadius:15}} >
     <MaterialCommunityIcons name ='star' color='black' size={50} style={{
        alignSelf:'baseline',
        top:'37%',
        borderWidth:1,
        left:'5%',
        borderRadius:10
         
        }} 
        onPress = {async () => {await Daily.rateDay(user,date,5);}} />
    <Text style={{fontSize: 15, paddingBottom:5, color:'white'}} >Title: {title}</Text>
    <Text style={{fontSize: 15, paddingBottom:5, color:'white'}}>Start Time: {startTime}</Text>
     <Text style={{fontSize: 15, paddingBottom:5, color:'white'}}>End Time: {endTime}</Text>
     <Text style={{fontSize: 15, paddingBottom:5, color:'white'}}>Location: {location}</Text>
  </View>
);
/*Tasks that have yet to be completed*/
function InProgress(){
  const[refreshing, setRefreshing] = React.useState(false)
  const[list, setList] = React.useState([])

  

  const onRefresh = React.useCallback(async() =>{
    setRefreshing(true);
    setList( await HSH.getCurrentTasks(user));
    //setList(list)
    setRefreshing(false);
  }, [refreshing])

  
  return(
    <SafeAreaView >
      <FlatList  ItemSeparatorComponent={()=> <View style={{height:'5%'}}></View>} 
      data={list} 
      renderItem={({item})=> <Item title= {item.summary} startTime={item.startTime} endTime={item.endTime} location={item.location} />} 
      style={{borderWidth:0,top:'5%', shadowOpacity:.75, shadowRadius:4, }} 
      contentContainerStyle={{borderWidth:0, height:'77%', paddingTop:'2%'}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      />
    </SafeAreaView>
  );
}

/*Tasks for the current day that have already been completed*/
function Completed(){

  const[refreshing, setRefreshing] = React.useState(false)
  const[list, setList] = React.useState([])

  

  const onRefresh = React.useCallback(async() =>{
    setRefreshing(true);
    setList( await HSH.getCompletedTasks(user));
    //setList(list)
    setRefreshing(false);
  }, [refreshing])

  
  return(
    <SafeAreaView >
      <FlatList  ItemSeparatorComponent={()=> <View style={{height:'5%',}}></View>} 
      data={list} 
      renderItem={({item})=> <Item title= {item.summary} startTime={item.startTime} endTime={item.endTime} location={item.location} />} style={{borderWidth:0,top:'5%', shadowOpacity:.75, shadowRadius:4}} 
      contentContainerStyle={{borderWidth:0, height:'77%', paddingTop:'2%'}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }/>
    </SafeAreaView>
  );
}

/*Create the tabs to switch between current and completed tasks*/
function TopTabs () {
  return(
    
    /*General tab styles*/
    <CurrentTasksTabs.Navigator style={{
        top:'10%',
        position:'relative',
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

  const date = Helpers.getTodaysDate()
 
  
  
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
        onPress = {async () => {await Daily.rateDay(user,date,5);}} />
        <MaterialCommunityIcons name ='emoticon-happy-outline' color='#096622' size={55} style={{
          top:'50%',
          right:'23%',
          position:'absolute',
          
          
        }} 
        onPress={async()=> {await Daily.rateDay(user,date, 4);}} />
        <MaterialCommunityIcons  name ='emoticon-neutral-outline' color='#ded52c' size={55} style={{
          top:'50%',
          right:'42%',
          position:'absolute', 
         
        }} 
        onPress={async() => { await Daily.rateDay(user, date, 3);}}
        />
        <MaterialCommunityIcons name ='emoticon-sad-outline' color='#fa7916' size={55} style={{
          top:'50%',
          left:'23%',
          position:'absolute',
      
        }} 
        onPress={async ()=> {await Daily.rateDay(user,date,2);}}
        />
        <MaterialCommunityIcons name ='emoticon-frown-outline' color='red' size={55} style={{
          top:'50%',
          left:'3%',
          position:'absolute', 
       
        }} 
        onPress={async()=> {await Daily.rateDay(user,date,1);}}
        />

        <Text style={{alignSelf:'center', position:'absolute', bottom:'0%', fontSize:25,}}>Your Day: {date}</Text>
    </SafeAreaView>
  );
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
    background:'white'
  },
};

function Home() {
 
  const navigation = useNavigation();
    return (
      <NavigationContainer independent={true} theme={MyTheme}> 
        <DailyMood/>
        <TopTabs /> 
        <ActionButton
            buttonColor="rgba(231,76,60,1)"
            onPress={() => { navigation.navigate('Task')}}
            offsetY = {50}
          />
      </NavigationContainer>

    );
  }

  export default Home; 