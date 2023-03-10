import { useState, } from 'react';
import {View,Text, TextInput, Button} from 'react-native';
import * as Helpers from '../backend_server/lib/helpers';
import{getDaysTasks, getTodaysActiveTasks, getTodaysFinishedTasks, updateTask} from '../lib/server/tasks';
import {NavigationContainer, useNavigation} from '@react-navigation/native';

const user = 'testuser1'
function EditTask (task:any){
   const navigation = useNavigation()
   const [sum, setSum] = useState(task.route.params.task.item.summary)
   const [start, setStart] = useState(task.route.params.task.item.startTime)
   const [end, setEnd] = useState(task.route.params.task.item.endTime)
   const [loc, setLoc] = useState(task.route.params.task.item.location)
   const id = task.route.params.task.item.taskId

    
    return(
        <View style={{
            flex:1,
            borderWidth:0,
            backgroundColor:'transparent',
            
            
        }}>
            <View style={{
                flex:1,
                borderWidth:0,
                height:'60%',
                width:'80%',
                alignSelf:'center',
                position:'absolute',
                top:'10%', 
                backgroundColor:'white', 
                borderRadius:30, 
                
            }}>
                <View style={{
                    flex:1,
                }}>
                    <Text style={{
                        flex:1,
                        alignSelf:'center',
                        textDecorationLine:'underline',
                        paddingTop:'3%',
                    }}
                    >Title</Text>
                    <TextInput style={{
                        flex:1,
                        borderWidth:1,
                        width:'75%',
                        alignSelf:'center',
                        paddingLeft:'3%',
                    }} 
                    placeholder={sum}
                    placeholderTextColor='black'
                    onChangeText={text => setSum(text)}
                    />
                </View>

                <View style={{
                    flex:1,
                }}>
                    <Text style={{
                        flex:1,
                        alignSelf:'center',
                        textDecorationLine:'underline',
                        paddingTop:'3%',
                    }}
                    >Start Time</Text>
                    <TextInput style={{
                        flex:1,
                        borderWidth:1,
                        width:'75%',
                        alignSelf:'center',
                        paddingLeft:'3%',
                    }} 
                    placeholder={start}
                    placeholderTextColor='black'
                    onChangeText={text=>setStart(text)}
                    />
                </View>

                <View style={{
                    flex:1,
                }}>
                    <Text style={{
                        flex:1,
                        alignSelf:'center',
                        textDecorationLine:'underline',
                        paddingTop:'3%',
                    }}
                    >End Time</Text>
                    <TextInput style={{
                        flex:1,
                        borderWidth:1,
                        width:'75%',
                        alignSelf:'center',
                        paddingLeft:'3%',
                    }} 
                    placeholder={end}
                    placeholderTextColor='black'
                    onChangeText={text=>setEnd(text)}
                    />
                </View>
                
                <View style={{
                    flex:1,
                    marginBottom:'5%'
                }}>
                    <Text style={{
                        flex:1,
                        alignSelf:'center',
                        textDecorationLine:'underline',
                        paddingTop:'3%',
                    }}
                    >Location</Text>
                    <TextInput style={{
                        flex:1,
                        borderWidth:1,
                        width:'75%',
                        alignSelf:'center',
                        paddingLeft:'3%',
                    }} 
                    placeholder={loc}
                    placeholderTextColor='black'
                    onChangeText={text=>setLoc(text)}
                    />
                </View>
                <View style={{
                    flex:1,
                    flexDirection:'row',
                    alignSelf:'center',
                    
                }}>
                    <Button  title='Cancel'  onPress={()=> navigation.navigate('HomeScreen')}/>
                    <Button title='Submit' onPress ={async()=> {updateT(user, sum, start, end, loc, id); navigation.navigate('HomeScreen')}} />
                </View>
            


            </View>
        </View>
    );
}


async function updateT ( user, summary, startTime, endTime, location, taskId){

    const day = Helpers.getTodaysDate()
    const update = await updateTask(user, taskId, summary, day, location, startTime, endTime) 

}


async function getCurrentTasks (user:string){
    var currentTaskList: never[] = [];
    const currentTasks = await getTodaysActiveTasks(user);
    console.log(currentTasks);
    var convertCurrentTasks = Object.values(currentTasks); 

    try{
        convertCurrentTasks.forEach(function(task){
            currentTaskList.push(task);
        })   
    }catch{
        console.log('Returned an Empty List'); 
        
    }


    return currentTaskList;
}

async function getAllTasks (user:string, day:string) {
    var taskList: never[] = [];
    const allTasks = await getDaysTasks(user, day);
    console.log(allTasks);
    var convertAllTasks = Object.values(allTasks);

    try {
        convertAllTasks.forEach(function(task){
            taskList.push(task);
        })
    }catch{
        console.log('getAllTasks Returned an Empty List');
    }
}

async function getCompletedTasks (user:string){
    var completedTaskList: never[] = [];
    const completedTasks = await getTodaysFinishedTasks(user);
    var convertCompletedTasks = Object.values(completedTasks);
    console.log(completedTasks);
    try{
        convertCompletedTasks.forEach(function(task){
            completedTaskList.push(task);
        })
    }catch{
        console.log('Returned an Empty List');
        
    }

    return completedTaskList;
}

export {getCurrentTasks,getCompletedTasks, EditTask};