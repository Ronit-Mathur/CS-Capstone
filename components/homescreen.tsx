import * as React from 'react';
import {Text, View,SafeAreaView, RefreshControl, Alert} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {DefaultTheme, NavigationContainer, useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Daily from '../lib/server/daily';
import { getDaysTasks, addTask} from '../lib/server/tasks';
import { FlatList } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import * as Helpers from '../backend_server/lib/helpers';
import * as HSH from './homescreenhelpers';
import {createNativeStackNavigator } from '@react-navigation/native-stack';
import {Settings} from './settingScreen';
import { add } from 'react-native-reanimated';
import CalImportPage from './CalImportPage';

var user = ''



const StackNavigator = createNativeStackNavigator();

function HomeScreenNav ({Name}:any){
  user = Name
  return(
    <StackNavigator.Navigator initialRouteName='Home'>
      <StackNavigator.Screen name='HomeScreen' component={Home} options={{title:'Home'} }/>
      <StackNavigator.Group  >
        <StackNavigator.Screen name='EditTask' component={HSH.EditTask} options={{presentation:'modal', headerStyle:{backgroundColor:'transparent',}, title:'', contentStyle:{backgroundColor:'transparent'}}}  />
        <StackNavigator.Screen name='RankTask' component={HSH.RankTask} options={{presentation:'modal', headerStyle:{backgroundColor:'transparent',}, title:'', contentStyle:{backgroundColor:'transparent'}}}  />
        <StackNavigator.Screen name ='Settings' component={Settings} options={{presentation:'containedModal',}}  />
        <StackNavigator.Screen name ='calImport' component={CalImportPage} options={{presentation:'containedModal',}}  />

      </StackNavigator.Group>
      
    </StackNavigator.Navigator>
  );
}



function DailyMood(){

  const date = Helpers.getTodaysDate()
  const navigation = useNavigation()
  const message = 'Your mood for ' + date + ' has been recorded!'
  const moodRated = () =>{
    Alert.alert('Daily Mood Recorded', message,[
        {
            text: 'Dismiss',
            onPress: () => console.log('Dismissed'),
            
        }, 
       
    ])
}

  return(
    <View style={{
      flex:1,
      height:'30%', 
      alignSelf:'center',
      width:'90%',
      borderWidth:0,
      }}>
      <Text style={{
        flex:1,
        fontSize:30,
        textDecorationLine:'underline',
        marginTop:'2%',
      }} >Welcome {user}</Text>

      <MaterialCommunityIcons name ='account-circle-outline' color='black' size={55} style={{
          flex:1,
          position:'absolute',
          right:0
        }} 
        
        onPress={()=> navigation.navigate('Settings')}
          />

      <Text style={{
        flex:1,
        alignSelf:'center',
        fontSize:17,
        marginTop:'10%'
      }}>How are you Feeling Today?</Text>
      
      <View style={{
        flex:2,
        flexDirection:'row',
        paddingLeft:'2%',
        paddingRight:'2%',
        borderWidth:0,

      }}>
        <MaterialCommunityIcons name ='emoticon-frown-outline' color='red' size={55} style={{
          flex:1,
        }} 
        onPress={async()=> {await Daily.rateDay(user,1); moodRated()}}
        />
         <MaterialCommunityIcons name ='emoticon-sad-outline' color='#fa7916' size={55} style={{
          flex:1,
        }} 
        onPress={async()=> {await Daily.rateDay(user,2); moodRated()}}
        />
         <MaterialCommunityIcons name ='emoticon-neutral-outline' color='#ded52c' size={55} style={{
          flex:1,
        }} 
        onPress={async()=> {await Daily.rateDay(user,3); moodRated()}}
        />
        <MaterialCommunityIcons name ='emoticon-happy-outline' color='#096622' size={55} style={{
          flex:1,
        }} 
        onPress={async()=> {await Daily.rateDay(user,4); moodRated()}}
        />
        <MaterialCommunityIcons name ='emoticon-outline' color='#07f246' size={55} style={{
          flex:1,
        }} 
        onPress={async()=> {await Daily.rateDay(user,5); moodRated()}}
        />
      </View>
        <Text style={{
          flex:1,
          alignSelf:'center',
          fontSize:20,
        }}>Your Day: {date}</Text>

    </View>
  );
}

const CurrentTasksTabs = createMaterialTopTabNavigator()


/*Create the tabs to switch between current and completed tasks*/
function TopTabs () {
  return(
    /*General tab styles*/
    <CurrentTasksTabs.Navigator style={{
        flex:1, 
        borderWidth:0,
       
      }} 
      screenOptions={{
      
      tabBarStyle:{
        flex:.1, 
        width:'85%',
        alignSelf:'center',
        borderWidth:1,
        backgroundColor:'white',
        borderRadius:100,
        shadowOpacity:1
        
        
      },

      tabBarContentContainerStyle:{
        flex:1,
       backgroundColor:'transparent',
        borderRadius:100,
        
        
      
      },

      tabBarIndicatorContainerStyle:{
        flex:1,

       backgroundColor:'transparent',
        borderRadius:100,

      }, 

      tabBarIndicatorStyle:{
        flex:1,
        height:'70%',
        borderRadius:100,
        backgroundColor:'maroon',
        opacity:.50,
        bottom:'8%',
        marginLeft:'2.5%',
        marginRight:'55.5%',
      }
    
     }
     
     }>
     
      <CurrentTasksTabs.Screen name='Inprogress' component={InProgress}   options={{
        title:'Scheduled',        
      }} />
      <CurrentTasksTabs.Screen name='Completed' component={Completed}  />
    </CurrentTasksTabs.Navigator>
  );
}


const demoProgress = [
  {summary:'Demo Scheduled Task', startTime:'15:00', endTime:'17:00', location:'Thompson 399'}
]

function InProgress(){
  const[refreshing, setRefreshing] = React.useState(false)
  const[list, setList] = React.useState([])

  const nav = useNavigation()



  const onRefresh = React.useCallback(async() =>{
    setRefreshing(true);
    setList (await HSH.getCurrentTasks(user))
    //setList(list)
    setRefreshing(false);
  }, [refreshing])

  
  return(
    <View style={{
      flex:1,
    }}>
      <FlatList 
      data={list}
      renderItem={({item}) => testRender({item},nav)} 
      style={{
        flex:1,
        marginBottom:'10%',
        marginTop:'3%',
        shadowOpacity:.5,
      }} 

      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      />
    </View>
  );
}

const demoCompleted = [
  {summary:'Demo Completed Task', starTime:'11:00', endTime:'12:00', location:'Thompson 399'}
]


function Completed(){
  const[refreshing, setRefreshing] = React.useState(false)
  const[list, setList] = React.useState([])


  const nav = useNavigation()

  const onRefresh = React.useCallback(async() =>{
    setRefreshing(true)
    setList(await HSH.getCompletedTasks(user))
    //setList(list)
    setRefreshing(false)
  }, [refreshing])

  
  return(
    <View style={{
      flexGrow:1,
    }}>
      <FlatList  
      data={list}
      renderItem={({item}) => testRender({item},nav)} 
      style={{flexGrow:1,
        marginBottom:'10%',
        marginTop:'3%',
        shadowOpacity:.5,
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

const getUser = () =>{
  return user
}


function testRender ({item}:any,Nav:any){
var bool = false
if(item.summary.length > 17){
  bool = true
}else{
  bool = false
}



return(
<View style={{
    flex:1,
    backgroundColor:'red',
    marginTop:'2%',
    alignItems:'center', 
    borderRadius:30,
    width:'95%',
    alignSelf:'center',
   }} >
     { <MaterialCommunityIcons name ='pencil' color='black' size={45} style={{
        alignSelf:'baseline',
        top:'20%',
        borderWidth:1,
        left:'5%',
        borderRadius:10,
        flex:1, 
        position:'absolute',
        
        }} 
       
        onPress={()=> Nav.navigate('EditTask',{task:{item}})}
         />}
     <Text style={{color:'white',}}>Title: {item.summary.substring(0,18)} {bool ? '...' : ''}</Text>
     <Text style={{color:'white'}}>Start Time: {item.startTime}</Text>
     <Text style={{color:'white'}}>End Time: {item.endTime}</Text>
     <Text style={{color:'white'}}>Location: {item.location}</Text>
    
     { <MaterialCommunityIcons name ='star' color='black' size={45} style={{
        alignSelf:'baseline',
        top:'20%',
        borderWidth:1,
        right:'5%',
        borderRadius:10,
        flex:1,
        position:'absolute',
        }} 
        onPress={()=>Nav.navigate('RankTask',{task:{item}})}
         />}
    
  </View>
);

}

function Home() {
 
  const navigation = useNavigation();
    return (
      <View style={{
        flex:1,
        marginTop:'2%',
        }}> 
        <View style={{
          flex:1,
          shadowOpacity:.5,
        }}>
          <DailyMood />
        </View>
        <View style={{
          flex:2,
          width:'90%',
          alignSelf:'center',
          
        }}>
          <TopTabs />
        </View>
        
        
      </View>

    );
  }


  async function addNewTask (){
    const currentDate = Helpers.getTodaysDate()
    const addNew = await addTask('testuser1', 'Test User Test', currentDate, 'Lumen Field', '18:00', '24:00')
    
}




  export {HomeScreenNav, getUser}; 