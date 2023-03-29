import * as React from 'react';
import {Text, TextInput, SafeAreaView,View, Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { addTask } from '../lib/server/tasks';





function TaskCreation (){
    
    const [taskTitle, setTaskTitle] = React.useState("");
    const [startTime, setStarttime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [showStartTime, setShowStartTime] = React.useState(false);
    const [showEndTime, setShowEndTime] = React.useState(false);
    const [date, setDate] = React.useState(new Date());

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };
    const addTaskServer = () => {
        addTask("testuser1","",date,"",startTime,endTime)
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

                <RNDateTimePicker value={date} mode="date" onChange={onChange} style={{}}/>
                
                <Button title='Start Time' onPress={() => (setShowStartTime(!showStartTime))}></Button>
                {showStartTime && ( 
                <RNDateTimePicker onChange={onChange} value={date} mode="time" display="spinner" textColor='black'/>)}
                
              
                
                <Button title='End Time' onPress={() => (setShowEndTime(!showEndTime))}></Button>
                {showEndTime && ( 
                <RNDateTimePicker onChange={onChange} value={date} mode="time" display="spinner"/>)}
                
                <Button title="Add Task" onPress={addTaskServer} />

            </View>

        </View>
        
    );
}

export {TaskCreation};