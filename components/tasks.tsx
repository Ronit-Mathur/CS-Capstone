import * as React from 'react';
import {Text, TextInput, SafeAreaView,View} from 'react-native';






function TaskCreation (){
    
    const [taskTitle, setTaskTitle] = React.useState("");
    const [startTime, setStarttime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    
    return(
        
        
        <View >
            <View style={{
                paddingLeft:10,
                paddingRight:10,
                paddingTop:10,
                paddingBottom:10
            }}>
                <Text>Task Name:</Text>
                <TextInput 
                style={{
                    borderColor:'black', 
                    borderWidth:1
                }}
                onChangeText={newTitle => setTaskTitle(newTitle)}
                placeholder='Enter Task Name'
                defaultValue={taskTitle}
                />   
                <Text>Start Time:</Text>
                <TextInput 
                   style={{
                    borderColor:'black', 
                    borderWidth:1, 
                    
                }}
                onChangeText={newStartTime => setStarttime(newStartTime)}
                placeholder='Enter Task Name'
                defaultValue={startTime}
                />
                   <Text>End Time:</Text>
                <TextInput 
                   style={{
                    borderColor:'black', 
                    borderWidth:1
                    
                }}
                onChangeText={newEndTime => setEndTime(newEndTime)}
                placeholder='Enter Task Name'
                defaultValue={endTime}
                />
                
                
            </View>
        </View>

    );
}

export default TaskCreation;