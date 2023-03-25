import { useState, } from 'react';
import {View,Text, TextInput, Button} from 'react-native';
import * as Helpers from '../backend_server/lib/helpers';
import{getTodaysActiveTasks, getTodaysFinishedTasks, updateTask, completeTask} from '../lib/server/tasks';
import { useNavigation} from '@react-navigation/native';
import {getUser} from './homescreen'

function EditTask (task:any){
    console.log(task)
   const navigation = useNavigation()
   const [sum, setSum] = useState(task.route.params.task.item.summary)
   const [start, setStart] = useState(task.route.params.task.item.startTime)
   const [end, setEnd] = useState(task.route.params.task.item.endTime)
   const [loc, setLoc] = useState(task.route.params.task.item.location)
   const id = task.route.params.task.item.taskId
   const user = getUser()
    
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
                <View  style={{
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



function RankTask (task:any){
    const navigation = useNavigation()
    const id = task.route.params.task.item.taskId
    const [enjoyment, setEnjoyment] = useState('1')
    const [physcialActivity, setPhysicalActivity] = useState('1')
    const [engagement, setEngagement] = useState('1')
    const [mentalDifficulty, setMentalDifficulty] = useState('1')

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
                    >Enjoyment</Text>
                    <TextInput style={{
                        flex:1,
                        borderWidth:1,
                        width:'75%',
                        alignSelf:'center',
                        paddingLeft:'3%',
                        
                    }} 
                    placeholder={enjoyment}
                    placeholderTextColor='black'
                    onChangeText={text=>setEnjoyment(text)}
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
                    >Pysical Activity</Text>
                    <TextInput style={{
                        flex:1,
                        borderWidth:1,
                        width:'75%',
                        alignSelf:'center',
                        paddingLeft:'3%',
                        
                    }} 
                    placeholder={physcialActivity}
                    placeholderTextColor='black'
                    onChangeText={text=>setPhysicalActivity(text)}
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
                    >Engagement</Text>
                    <TextInput style={{
                        flex:1,
                        borderWidth:1,
                        width:'75%',
                        alignSelf:'center',
                        paddingLeft:'3%',
                        
                    }} 
                    placeholder={engagement}
                    placeholderTextColor='black'
                    onChangeText={text=>setEngagement(text)}
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
                    >Mental Difficulty</Text>
                    <TextInput style={{
                        flex:1,
                        borderWidth:1,
                        width:'75%',
                        alignSelf:'center',
                        paddingLeft:'3%',
                        
                    }} 
                    placeholder={mentalDifficulty}
                    placeholderTextColor='black'
                    onChangeText={text=>setMentalDifficulty(text)}
                    />
                </View>
                
                <View  style={{
                    flex:1,
                    flexDirection:'row',
                    alignSelf:'center',
                
                    
                }}>
                    <Button  title='Cancel'  onPress={()=> navigation.navigate('HomeScreen')}/>
                    <Button title='Submit' onPress ={async()=> {rankT(id, enjoyment,physcialActivity,engagement,mentalDifficulty); navigation.navigate('HomeScreen')}} />
                </View>
            
             
 
 
             </View>
         </View>
     );
 }


 async function rankT (id:any, enjoyment:any, physcialActivity:any, engagement:any, mentalDifficulty:any){
    const numEnjoy = Number(enjoyment)
    const numPhysical = Number(physcialActivity)
    const numEngage = Number(engagement)
    const numMental = Number(mentalDifficulty)


    const addRank = await completeTask(id,numEnjoy,numPhysical,numEngage,numMental)
 }

async function updateT ( user:string, summary:string, startTime:string, endTime:string, location:string, taskId:any){

    const day = Helpers.getTodaysDate()
    const update = await updateTask(user, taskId, summary, day, location, startTime, endTime) 

}


async function getCurrentTasks (user:string){
    var currentTaskList: never[] = [];
    const currentTasks = await getTodaysActiveTasks(user);
    var convertCurrentTasks = Object.values(currentTasks);
     


    try{
        convertCurrentTasks.forEach(function(task){
            currentTaskList.push(task);
        })   
    }catch{
        console.log('Returned an Empty List'); 
        
    }
    currentTaskList.sort((a,b)=> (a.startTime > b.startTime) ? 1 : ((a.startTime < b.startTime) ? -1 : 0 ))

    return currentTaskList;
}



async function getCompletedTasks (user:string){
    var completedTaskList: never[] = [];
    const completedTasks = await getTodaysFinishedTasks(user);
    var convertCompletedTasks = Object.values(completedTasks);
    
    try{
        convertCompletedTasks.forEach(function(task){
            completedTaskList.push(task);
        })
    }catch{
        console.log('Returned an Empty List');
        
    }

    completedTaskList.sort((a,b)=> (a.startTime > b.startTime) ? 1 : ((a.startTime < b.startTime) ? -1 : 0 ))
    return completedTaskList;
}

export {getCurrentTasks,getCompletedTasks, EditTask, RankTask};