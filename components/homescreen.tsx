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
import {createNativeStackNavigator } from '@react-navigation/native-stack';

const user = 'testuser1' //place holder for once we have user functionality

const StackNavigator = createNativeStackNavigator();

function HomeScreenNav (){
  return(
    <StackNavigator.Navigator initialRouteName='Home'>
      <StackNavigator.Screen name='HomeScreen' component={Home} options={{title:'Home'}}/>
      <StackNavigator.Screen name='EditTask' component={HSH.EditTask} options={{presentation:'modal'}}/>
      
    </StackNavigator.Navigator>
  );
}



function DailyMood(){

  const date = Helpers.getTodaysDate()
 
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
        fontSize:25,
        textDecorationLine:'underline',
      }} >Welcome {user}</Text>

      <Text style={{
        flex:1,
        alignSelf:'center',
        fontSize:17,
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
        onPress={async()=> {await Daily.rateDay(user,date,1);}}
        />
         <MaterialCommunityIcons name ='emoticon-sad-outline' color='#fa7916' size={55} style={{
          flex:1,
        }} 
        onPress={async()=> {await Daily.rateDay(user,date,2);}}
        />
         <MaterialCommunityIcons name ='emoticon-neutral-outline' color='#ded52c' size={55} style={{
          flex:1,
        }} 
        onPress={async()=> {await Daily.rateDay(user,date,3);}}
        />
        <MaterialCommunityIcons name ='emoticon-happy-outline' color='#096622' size={55} style={{
          flex:1,
        }} 
        onPress={async()=> {await Daily.rateDay(user,date,4);}}
        />
        <MaterialCommunityIcons name ='emoticon-outline' color='#07f246' size={55} style={{
          flex:1,
        }} 
        onPress={async()=> {await Daily.rateDay(user,date,4);}}
        />
        
      </View>
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

function InProgress(){
  const[refreshing, setRefreshing] = React.useState(false)
  const[list, setList] = React.useState([])

  const nav = useNavigation()

  const onRefresh = React.useCallback(async() =>{
    setRefreshing(true);
    setList( await HSH.getCurrentTasks(user));
    //setList(list)
    setRefreshing(false);
  }, [refreshing])

  
  return(
    <View style={{
      flex:1,
    }}>
      <FlatList  ItemSeparatorComponent={()=> <View style={{flex:1}}></View>} 
      data={list}
      renderItem={({item})=> <Item title= {item.summary} startTime={item.startTime} endTime={item.endTime} location={item.location} Nav={nav} />} 
      style={{
        flexGrow:1,
        
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

function Completed(){
  const[refreshing, setRefreshing] = React.useState(false)
  const[list, setList] = React.useState([])

  const nav = useNavigation()

  const onRefresh = React.useCallback(async() =>{
    setRefreshing(true);
    setList( await HSH.getCompletedTasks(user));
    //setList(list)
    setRefreshing(false);
  }, [refreshing])

  
  return(
    <View style={{
      flex:1,
    }}>
      <FlatList  ItemSeparatorComponent={()=> <View style={{height:'5%',}}></View>} 
      data={list}
      renderItem={({item})=> <Item title= {item.summary} startTime={item.startTime} endTime={item.endTime} location={item.location} Nav={nav} />} 
      style={{flexGrow:1,
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

const Item = ({title, startTime, endTime, location, Nav}) => (
  <View style={{
    flex:1,
    backgroundColor:'red',
    marginTop:'5%',
    alignItems:'center', 
    borderRadius:30,
   }} >
     <Text style={{color:'white'}}>Title: {title}</Text>
     <Text style={{color:'white'}}>Start Time: {startTime}</Text>
     <Text style={{color:'white'}}>End Time: {endTime}</Text>
     <Text style={{color:'white'}}>Location: {location}</Text>
    
  </View>
)



function Home() {
 
  const navigation = useNavigation();
    return (
      <View style={{
        flex:1,
        paddingTop:'5%',
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

  export {HomeScreenNav}; 