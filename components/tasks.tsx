import * as React from 'react';
import {Text, TextInput, SafeAreaView,View, Button, Platform, Pressable, StyleSheet} from 'react-native';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { addTask } from '../lib/server/tasks';
import { format } from 'path/posix';

import serverHandler from '../lib/server/serverHandler';
import StylingConstants from './StylingConstants';





function TaskCreation (){
    
    const [taskTitle, setTaskTitle] = React.useState("");
    const [startTime, setStarttime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());
    const [showDate, setShowDate] = React.useState(false);
    const [showStartTime, setShowStartTime] = React.useState(false);
    const [showEndTime, setShowEndTime] = React.useState(false);
    const [date, setDate] = React.useState(new Date());
    const [location, setLocation] = React.useState(""); 
    
    
    const addTaskServer = () => {
        
        const newTaskDate = formatDate()
        const newTaskStartTime = formatTime(startTime.toLocaleTimeString('EN-en', {hourCycle:'h23'}))
        const newTaskEndTime = formatTime(endTime.toLocaleTimeString('EN-en', {hourCycle:'h23'}))
        addTask(serverHandler.current.userState.username,taskTitle,newTaskDate,location,newTaskStartTime,newTaskEndTime)
    }

    const formatDate = () => {
        const currentDate = date.toLocaleDateString()
        const [monthStr, dayStr, yearStr] = currentDate.split("/"); // split the date string into parts

        const month = parseInt(monthStr, 10); // convert month string to number
        const day = parseInt(dayStr, 10); // convert day string to number

        const formattedMonth = month.toString().padStart(2, "0"); // add leading 0 to month if necessary
        const formattedDay = day.toString().padStart(2, "0"); // add leading 0 to day if necessary

        const formattedDateStr = `${formattedMonth}/${formattedDay}/${yearStr}`; // join the parts back together
        return  formattedDateStr    
        
    }

    const formatClientTime = (time:string) =>{
        const [hr, min] = time.split(':')
        
        if(hr >= '12'){
          var stringToNum = Number.parseInt(hr)
          if(stringToNum > 12){
              stringToNum -= 12
          }
            if(hr < '24'){
              
              return `${stringToNum}:${min} PM`
          }
          else{
              return `${stringToNum}:${min} AM`
          }
        }
        else{
          if(hr < '10'){
            return `${hr.substring(1)}:${min} AM`
          }else{

            
              return `${hr}:${min} AM`
          }
        }
        
     }

    const formatTime = (unformattedTime: String) => {
        
        const [hrStr, minStr] = unformattedTime.split(':');

        const formattedTime = `${hrStr}:${minStr}`
        return formattedTime
    }

    return(
        
        <View style={{
            flex:1,
           
        }}>

            <View style={{
                backgroundColor:StylingConstants.highlightColor, 
                height:'10%',
                marginTop:0,
                marginBottom:'10%',
                justifyContent:'center',
            }}>
                <Text style={{
                    alignSelf:'center',
                    fontFamily:StylingConstants.defaultFont, 
                    fontSize: StylingConstants.largeFontSize,
                    color:'white'
                }}>Create New Task</Text>

            </View>

           <Text style={{
               alignSelf:'center',
               fontFamily:StylingConstants.defaultFont,
               fontSize:StylingConstants.normalFontSize,
               color:'black',
               marginBottom:'5%'
           }}>Name</Text>
            <TextInput 
            style={{height: 40, alignSelf:'center', borderWidth:1, width:'60%', fontFamily: StylingConstants.defaultFont, paddingLeft:'15%', marginBottom:'8%'}}
            onChangeText={newTitle => setTaskTitle(newTitle)}
            placeholder='Enter Task Name'
            placeholderTextColor={"black"}
            defaultValue={taskTitle}
            
            />

            <View style={{}}>
                
            <Text style={{
                fontFamily:StylingConstants.defaultFont,
                fontSize:StylingConstants.normalFontSize,
                color:'black',
                alignSelf:'center'
            }}>Date</Text> 
           
            <Pressable  onPress={() => setShowDate(!showDate) }>
                    <Text style={{
                        fontFamily: StylingConstants.defaultFont,
                        fontSize: StylingConstants.hugeFontSize,
                        alignSelf:'center',
                        marginBottom:'5%',
                        marginTop:'5%',
                        color: StylingConstants.lighterHighlightColor
                        
                    }}>{date.toLocaleDateString()}</Text>
                </Pressable>
                {showDate ? ( 
                <RNDateTimePicker value={date} mode="date" onChange={(event:DateTimePickerEvent, day:Date)=>{
                    setDate(day)
                    setShowDate(!showDate)
                }}
                style={{
                    alignSelf:'center',
                    
                }}/>) : null }

               
                
                <Text style={{
                    fontFamily:StylingConstants.defaultFont,
                    fontSize:StylingConstants.normalFontSize,
                    color:'black',
                    alignSelf:'center',
                    marginBottom:'5%'
                }}> Start Time</Text>
                <Pressable onPress={() => (setShowStartTime(!showStartTime))} >
                    <Text style={{
                        alignSelf:'center',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize:StylingConstants.largeFontSize,
                        color:StylingConstants.lighterHighlightColor,
                    }}>{formatClientTime(startTime.toLocaleTimeString('EN-en', {hourCycle:'h24'}).substring(0,5))}</Text>

                </Pressable>
                {showStartTime ? ( 
                <RNDateTimePicker  value={startTime} onChange={(event:DateTimePickerEvent, day:Date) => {
                    setStarttime(day)
                    if(Platform.OS != 'ios'){
                        setShowStartTime(!showStartTime)  
                    }
                    
                }} mode='time' display='spinner' textColor='black'/>) : null}
                
              
                <Text style={{
                    alignSelf:'center',
                    fontFamily:StylingConstants.defaultFont,
                    fontSize:StylingConstants.normalFontSize,
                    color:'black',
                    marginTop:'5%',
                    marginBottom:'5%'
                }}>End Time</Text>
                <Pressable onPress={() => (setShowEndTime(!showEndTime))}>
                    <Text style={{
                        fontFamily:StylingConstants.defaultFont,
                        fontSize:StylingConstants.largeFontSize,
                        color:StylingConstants.lighterHighlightColor,
                        alignSelf:'center',
                        marginBottom:'5%'
                    }}>{formatClientTime(endTime.toLocaleTimeString('EN-en', {hourCycle:'h24'}).substring(0,5))}</Text>
                </Pressable>
                {showEndTime ? ( 
                <RNDateTimePicker  value={endTime}  onChange={(event:DateTimePickerEvent, day:Date) => {
                    setEndTime(day)
                    if(Platform.OS != 'ios'){
                        setShowEndTime(!showEndTime) 
                    }
                
                    
                }} mode="time" display='spinner'/>) : null}
            <Text style={{
                alignSelf:'center',
                fontFamily:StylingConstants.defaultFont,
                fontSize:StylingConstants.normalFontSize,
                color:'black',
                marginBottom:'5%',
            }}>Location</Text>
            <TextInput 
                style={{height: 40, alignSelf:'center', borderWidth:1, width:'60%',fontFamily:StylingConstants.defaultFont, paddingLeft:'20%', marginBottom:'5%'}}
                onChangeText={newLocation => setLocation(newLocation)}
                placeholder='Enter Location'
                placeholderTextColor={"black"}
                defaultValue={location}
            />  
                
                <Button title="Add Task" onPress={addTaskServer} />

            </View>
            

        </View>
        
    );
}

export {TaskCreation};