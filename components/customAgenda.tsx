import * as React from 'react';
import {View, Text, RefreshControl} from 'react-native';

import { Agenda, DateData, } from 'react-native-calendars';
import { FlatList } from 'react-native-gesture-handler';
import {getDaysTasks} from '../lib/server/tasks';






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


let user = 'testuser1'


function CustomAgenda (day:any) {
  
 let date = day.route.params.dateString
 let month = day.route.params.month
 let numDay = day.route.params.day
 let year = day.route.params.year
 
  
  return (
    <View style ={{
      flex: 1,
      
    }}>
      <View style={{
        flex: 1,
        borderBottomWidth:1,
        borderColor:'blue',
        width:'50%',
        alignSelf:'center',
      }}>
        <Text style ={{
          alignSelf:'center',
        }}>{year}</Text>
        <Text style={{
          alignSelf:'center',
          fontSize:27,
        }}>{months[month]}</Text>
        <Text style={{
          alignSelf:'center',
          fontSize:27,
        }}>{numDay}</Text>
      </View>
      
      
      <View style={{
        flex: 8,
        
        
      }}>
        <Completed date={date}/>
      </View>

    </View>
  ); 
}



function Completed({date}:any){
  const[refreshing, setRefreshing] = React.useState(false)
  const[list, setList] = React.useState([])


  

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
      renderItem={({item}) => testRender({item})} 
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



function testRender ({item}:any){
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
      width:'80%',
      alignSelf:'center',
     }} >
   
       <Text style={{color:'white',}}>Title: {item.summary.substring(0,18)} {bool ? '...' : ''}</Text>
       <Text style={{color:'white'}}>Start Time: {item.startTime}</Text>
       <Text style={{color:'white'}}>End Time: {item.endTime}</Text>
       <Text style={{color:'white'}}>Location: {item.location}</Text>
      
      
      
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
    const tasks = await getDaysTasks(user, dateFormatted);
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


export {CustomAgenda}
