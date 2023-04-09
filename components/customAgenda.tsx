import * as React from 'react';
import {View, Text, RefreshControl} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StylingConstants from './StylingConstants';
import { Agenda, DateData, } from 'react-native-calendars';
import { FlatList } from 'react-native-gesture-handler';
import {getDaysTasks} from '../lib/server/tasks';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as HSH from './homescreenhelpers';
import { TaskCreation } from './tasks'
import ActionButton from 'react-native-action-button';
import serverHandler from '../lib/server/serverHandler';

const stack = createNativeStackNavigator()

var currentDay = ''
function AgendaNav (day:any){
  
currentDay = day
  return(
    <stack.Navigator>
      <stack.Screen name='Agen' component={CustomAgenda} options={{headerShown:false}} />
      <stack.Screen name='EditAgen' component={HSH.EditTask} />
      <stack.Screen name='RankAgen' component={HSH.RankTask}  options={{title:'Rank Task'}}/>
      <stack.Screen name = 'AddAgen' component={TaskCreation} />


    </stack.Navigator>
  );
}

const months = {
  1: 'JAN',
  2: 'FEB',
  3: 'MAR',
  4: 'APR',
  5: 'MAY',
  6: 'JUN',
  7: 'JUL',
  8: 'AUG',
  9: 'SEP',
  10: 'OCT',
  11: 'NOV',
  12: 'DEC',
}



let globalDate = ''


function CustomAgenda () {
const nav = useNavigation()

 let date = currentDay.route.params.dateString
 globalDate = date
 let month = currentDay.route.params.month
 let numDay = currentDay.route.params.day
 let year = currentDay.route.params.year

  
  return (
    <View style ={{
      flex: 1,
      
    }}>
      <View style={{
        flex: 1,
        borderBottomWidth:1,
        borderColor:StylingConstants.highlightColor,
        width:'50%',
        alignSelf:'center',
        paddingBottom:'5%'
      }}>
        <Text style ={{
          alignSelf:'center',
          fontFamily: StylingConstants.defaultFont
        }}>{year}</Text>
        <Text style={{
          alignSelf:'center',
          fontSize:27,
          fontFamily: StylingConstants.defaultFontBold
        }}>{months[month]}</Text>
        <Text style={{
          alignSelf:'center',
          fontSize:27,
          fontFamily:StylingConstants.defaultFont, 
        }}>{numDay}</Text>
      </View>
      
      
      <View style={{
        flex: 8,
        
        
      }}>
        <Completed date={date}/>
        <ActionButton

        position='right'
        size={75}
        buttonColor={StylingConstants.highlightColor}
        onPress={() => nav.navigate('AddAgen')}
        style={{ marginRight: 0, marginBottom: '3%' }}
      />
      </View>

    </View>
  ); 
}



function Completed({date}:any){
  const[refreshing, setRefreshing] = React.useState(false)
  const[list, setList] = React.useState([])
  const nav = useNavigation()

  React.useEffect(() => {
    const check = async () => {
      setList(await getTasks(date))
    }
    check()
    
  }, [])
  

  const onRefresh = React.useCallback(async() =>{
    setRefreshing(true)
    setList(await getTasks(date))
    //setList(list)
    setRefreshing(false)
  }, [refreshing])

  
  return(
    <View style={{
      flexGrow:1,
    }}>
      <FlatList  
      data={list}
      renderItem={({item}) => testRender(item,nav)} 
      style={{flexGrow:1,
        marginBottom:'10%',
        marginTop:'3%',
        shadowOpacity:.5,
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



function testRender (item:any, nav:any){

  var bool = false
  if(item.summary.length > 17){
    bool = true
  }else{
    bool = false
  }

var navPath = 'EditAgen'
  if (globalDate > new Date().toISOString().substring(0,10)){
    navPath = 'EditAgen'
  }else{
    navPath = 'RankAgen'
  }
  
  
  return(
  <View style={{ marginLeft: "2%", marginRight: "2%", marginBottom: 5, borderLeftWidth: 3, borderColor: StylingConstants.highlightColor, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
    <View style={{
      marginLeft:'2%',
      }} >
   
        <Text style={{color:'black', fontWeight:'bold'}}>Title: {item.summary.substring(0,18)} {bool ? '...' : ''}</Text>
        <Text style={{color:'black'}}>Start Time: {item.startTime}</Text>
        <Text style={{color:'black'}}>End Time: {item.endTime}</Text>
        <Text style={{color:'black'}}>Location: {item.location}</Text>
      </View>


      <MaterialCommunityIcons name='chevron-right' color="white" size={40} style={{
      backgroundColor: StylingConstants.highlightColor,
      borderRadius: 8,
    }}

      onPress={() => nav.navigate(navPath, { task: {item}  })}
    />
    </View>
  );
  
  }

async function  getTasks(date:string) {
  const reArrange = date.split('-')
  var yearOrg = reArrange[0]
  reArrange[0] = reArrange[1]
  var dayOrg = reArrange[2]
  reArrange[2] = yearOrg
  reArrange[1] = dayOrg
  const dateFormatted = reArrange.join('/')


  var taskList: never[] = [];
    const tasks = await getDaysTasks(serverHandler.current.userState.username, dateFormatted);
    var convertTasks = Object.values(tasks);
     


    try{
        convertTasks.forEach(function(task){
            taskList.push(task);
        })   
    }catch{
        console.log('Returned an Empty List'); 
        
    }

    taskList.sort((a,b)=> (a.startTime > b.startTime) ? 1 : ((a.startTime < b.startTime) ? -1 : 0 ))

    return taskList;
}


/* function CustomAgenda (day:any){
  console.log(day)
  //get the slected day object and convert to values 
  const convertDate = Object.values(day)
  
  //created a list to hold the date and add the selected date 
  var selectedDatesTasks: any[]=[]
  convertDate.forEach(function(task){
  selectedDatesTasks.push(task.params)
  })


  
  var loadDate = selectedDatesTasks[1]
  console.log(typeof(loadDate))
  let testList = {}
  
  //var taskList = getSelectedDayTasks(loadDate,user)


  
    return(
    <Agenda
    items={{
        : [{name:'cycling', height:80, day: '2023-03-17'} ],
      
      }}
     
      selected={loadDate}
      ></Agenda>
    );
}

async function getSelectedDayTasks (rawDate:string, user:any) : Promise <any[]> {
  

  //format the date into the correct format for getting tasks from the database
  const reArrange = rawDate.split('-')
  var yearOrg = reArrange[0]
  reArrange[0] = reArrange[1]
  var dayOrg = reArrange[2]
  reArrange[2] = yearOrg
  reArrange[1] = dayOrg
  const dateFormatted = reArrange.join('-')

  //get the tasks list for the selected date and convert it into a list 
  var taskList: any[] = []
  var daysTasksRaw = await getDaysTasks(user, dateFormatted)
  var convertTasks = Object.values(daysTasksRaw)
  convertTasks.forEach(function(task){
  taskList.push(task)
  })

  return taskList
  

} */


export {CustomAgenda, AgendaNav}
