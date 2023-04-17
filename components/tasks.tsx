import * as React from 'react';
import {Text, TextInput, SafeAreaView,View, Button} from 'react-native';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { addTask } from '../lib/server/tasks';
import { format } from 'path/posix';

import serverHandler from '../lib/server/serverHandler';





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

    const formatTime = (unformattedTime: String) => {
        
        const [hrStr, minStr] = unformattedTime.split(':');

        const formattedTime = `${hrStr}:${minStr}`
        return formattedTime
    }

    return(
        
        <View style={{
            flex:1,
        }}>
            <TextInput 
            style={{height: 40}}
            onChangeText={newTitle => setTaskTitle(newTitle)}
            placeholder='Enter Task Name'
            placeholderTextColor={"black"}
            defaultValue={taskTitle}
            />

            <View style={{alignItems: 'flex-start',}}>
                <Button title='Date' onPress={()=>(setShowDate(!showDate))}></Button>
                
                {showDate && ( 
                <RNDateTimePicker value={date} mode="date" onChange={(event:DateTimePickerEvent, day:Date)=>{
                    setDate(day)
                    setShowDate(!showDate)
                }} style={{}}/>)}
               
                
                <Button title='Start Time' onPress={() => (setShowStartTime(!showStartTime))
                }></Button>
                {showStartTime && ( 
                <RNDateTimePicker  value={startTime} onChange={(event:DateTimePickerEvent, day:Date) => {
                    setStarttime(day)
                    setShowStartTime(!showStartTime)
                }} mode="time" display="inline" textColor='black'/>)}
                
              
                
                <Button title='End Time' onPress={() => (setShowEndTime(!showEndTime))}></Button>
                {showEndTime && ( 
                <RNDateTimePicker  value={endTime}  onChange={(event:DateTimePickerEvent, day:Date) => {
                    setEndTime(day)
                    setShowEndTime(!showEndTime)
                }} mode="time" display="inline"/>)}

            <TextInput 
                style={{height: 40}}
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