import * as React from 'react';
import {Text, TextInput, SafeAreaView,View, Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';




function TaskCreation (){
    
    const [taskTitle, setTaskTitle] = React.useState("");
    const [startTime, setStarttime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [showStartTime, setShowStartTime] = React.useState(false);
    const [showEndTime, setShowEndTime] = React.useState(false);
    return(
        
        <View style={{
            paddingLeft:10,
            paddingRight:10,
            paddingTop:10,
            paddingBottom:10
        }}>
            <TextInput 
            style={{height: 40}}
            onChangeText={newTitle => setTaskTitle(newTitle)}
            placeholder='Enter Task Name'
            placeholderTextColor={"black"}
            defaultValue={taskTitle}
            />

            <View style={{alignItems: 'flex-start',}}>

                <RNDateTimePicker value={new Date()} mode="date" style={{}}/>
                
                <Button title='Start Time' onPress={() => (setShowStartTime(!showStartTime))}></Button>
                {showStartTime ?  <RNDateTimePicker value={new Date()} mode="time" display="spinner"/>: null}

                <RNDateTimePicker value={new Date()} mode="date" style={{}}/>

                <Button title='End Time' onPress={() => (setShowEndTime(!showEndTime))}></Button>
                {showEndTime ?  <RNDateTimePicker value={new Date()} mode="time" display="spinner"/>: null}
                
            </View>

        </View>
        
    );
}

export default TaskCreation;