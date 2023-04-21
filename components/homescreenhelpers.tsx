import { useState, useCallback } from 'react';
import {View,Text, TextInput, Button, SafeAreaView} from 'react-native';
import * as Helpers from '../backend_server/lib/helpers';
import{getTodaysActiveTasks, getTodaysFinishedTasks, updateTask, rateTask, getUnratedCompletedTasks} from '../lib/server/tasks';
import { useNavigation, useRoute} from '@react-navigation/native';
import serverHandler from '../lib/server/serverHandler';
import StylingConstants from './StylingConstants';
import DropDownPicker from 'react-native-dropdown-picker'

function EditTask (task:any){
    const timeString = 'April 07, 2001, ' + task.route.params.task.item.startTime + ':00'
    const time = new Date(timeString)
    console.log(time)

   const navigation = useNavigation()
   const [sum, setSum] = useState(task.route.params.task.item.summary)
   const [start, setStart] = useState(task.route.params.task.item.startTime)
   const [end, setEnd] = useState(task.route.params.task.item.endTime)
   const [loc, setLoc] = useState(task.route.params.task.item.location)
   const id = task.route.params.task.item.taskId
   const user = serverHandler.current.userState.user
    
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
                    backgroundColor:StylingConstants.highlightColor,
                    justifyContent:'center',
                }} >

                <Text style={{
                    fontSize:StylingConstants.hugeFontSize,
                    alignSelf:'center',
                    color:'white',
                    fontFamily:StylingConstants.defaultFontBold
                    
                }}
                    >Edit Task</Text>

                </View>
                <View style={{
                    flex:1,
                }}>
                    <Text style={{
                        alignSelf:'center',
                        paddingTop:'3%',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize: StylingConstants.normalFontSize
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
                        alignSelf:'center',
                        paddingTop:'3%',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize: StylingConstants.normalFontSize
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
                        alignSelf:'center',
                        paddingTop:'3%',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize: StylingConstants.normalFontSize
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
                        alignSelf:'center',
                        paddingTop:'3%',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize: StylingConstants.normalFontSize
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
                    <Button title='Submit' onPress ={async()=> {updateT(sum, start, end, loc, id); navigation.navigate('HomeScreen')}} />
                </View>
            


            </View>
        </View>
    );
}



function RankTask (task:any){
    const route = useRoute()
    const routeTest = route.name
    const navigation = useNavigation()
    const id = task.route.params.task.item.taskId


    const[items, setItems] = useState([
        {label: '1 - Minimal', value: 1},
        {label: '2 - Some', value: 2},
        {label: '3 - Moderate', value: 3},
        {label: '4 - High', value: 4},
        {label: '5 - Very High', value: 5},
      ])
      const[enjoymentOpen, setEnjoymentOpen] = useState(false)
      const[enjoymentValue, setEnjoymentValue] = useState(null)
      const[physicalOpen, setPhysicalOpen] = useState(false)
      const[physicalValue, setPhysicalValue] = useState(null)
      const[engagementOpen, setEngagementOpen] = useState(false)
      const[engagementValue, setEngagementValue] = useState(null)
      const[mentalDifficultyOpen, setMentalDifficultyOpen] = useState(false)
      const[mentalDifficultyValue, setMentalDifficultyValue] = useState(null)

     
    

      const onEnjoymentOpen = useCallback(() => {
        setPhysicalOpen(false);
        setEngagementOpen(false);
        setMentalDifficultyOpen(false);
        setEnjoymentOpen(!enjoymentOpen);
      }, [enjoymentOpen]);
      
      const onPhysicalOpen = useCallback(() => {
        setPhysicalOpen(!physicalOpen);
        setEngagementOpen(false);
        setMentalDifficultyOpen(false);
        setEnjoymentOpen(false);
      }, [physicalOpen]);

    var random = Math.random()
    var navPath = 'HomeScreen'
  
    if (routeTest == 'RankTask'){
        navPath = 'HomeScreen'
    }else if (routeTest == 'RankAgen'){
        navPath = 'Agen'
    }else{
        navPath = 'UnRated'
    }
    
   
     return(
         <View style={{
             flex:1,
             borderWidth:0,
             backgroundColor:'transparent',
             
             
         }}>
             <SafeAreaView style={{
                 flex:1,
                 borderWidth:0,
                 height:'75%',
                 width:'80%',
                 alignSelf:'center',
                 position:'absolute',
                 top:'5%', 
                 backgroundColor:'white', 
                 borderRadius:30, 
                
                 
             }}>

                    <View style ={{
                        flex:2,
                        backgroundColor: StylingConstants.highlightColor,
                        justifyContent: 'center',
                        borderTopEndRadius:30,
                        borderTopStartRadius:30
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: StylingConstants.largeFontSize,
                            fontFamily: StylingConstants.defaultFont,
                            alignSelf:'center'
                        }}>Rate Task</Text>

                    </View>
               
                    <Text style={{
                        
                        alignSelf:'center',
                        padding:'5%',
                        fontFamily: StylingConstants.defaultFont,
                        fontSize: StylingConstants.subFontSize
                    }}
                    >Enjoyment</Text>
                       <DropDownPicker
                            open={enjoymentOpen}
                            value={enjoymentValue}
                            items={items}
                            setOpen={onEnjoymentOpen}
                            setValue={setEnjoymentValue}
                            setItems={setItems}
                            containerStyle = {{
                                width: '75%',
                                alignSelf:'center'
                            }}
                            zIndex={4000}
                            zIndexInverse={1000}
                        />
                    
               
               
                    <Text style={{
                
                        alignSelf:'center',
                        fontSize: StylingConstants.subFontSize,
                        padding:'5%',
                        fontFamily: StylingConstants.defaultFont,
                    }}
                    >Pysical Activity</Text>
                  <DropDownPicker
                            open={physicalOpen}
                            value={physicalValue}
                            items={items}
                            setOpen={onPhysicalOpen}
                            setValue={setPhysicalValue}
                            setItems={setItems}
                            containerStyle={{
                                width:'75%',
                                alignSelf:'center'

                            }}
                            zIndex ={3000}
                            zIndexInverse ={2000}
                        />
                    
                

                    <Text style={{
                       
                        alignSelf:'center',
                        fontFamily: StylingConstants.defaultFont,
                        padding:'5%',
                        fontSize: StylingConstants.subFontSize
                    }}
                    >Engagement</Text>
                      <DropDownPicker
                            open={engagementOpen}
                            value={engagementValue}
                            items={items}
                            setOpen={setEngagementOpen}
                            setValue={setEngagementValue}
                            setItems={setItems}
                            containerStyle={{
                                width:'75%',
                                alignSelf:'center'
                            }}
                            zIndex={2000}
                            zIndexInverse={2000}

                        />
                

                
                    <Text style={{
                      
                        alignSelf:'center',
                        fontFamily: StylingConstants.defaultFont,
                        fontSize:StylingConstants.subFontSize,
                        padding:'5%',
                    
                    }}
                    >Mental Difficulty</Text>
                      <DropDownPicker
                            open={mentalDifficultyOpen}
                            value={mentalDifficultyValue}
                            items={items}
                            setOpen={setMentalDifficultyOpen}
                            setValue={setMentalDifficultyValue}
                            setItems={setItems}
                            containerStyle ={{
                                width: '75%',
                                alignSelf:'center'
                            }}
                            zIndex={1000}
                            zIndexInverse ={4000}
                        />
                
                
                <View  style={{
                    flex:1,
                    flexDirection:'row',
                    alignSelf:'center',
                
                    
                }}>
                    <Button  title='Cancel'  onPress={()=> navigation.goBack()}/>
                    <Button title='Submit' onPress ={async()=> {rankT(id, enjoymentValue,physcialValue,engagementValue,mentalDifficultyValue); navigation.navigate(navPath, {random})}} />
                </View>
            
             
 
 
             </SafeAreaView>
         </View>
     );
 }


 async function rankT (id:any, enjoyment:any, physcialActivity:any, engagement:any, mentalDifficulty:any){
    const numEnjoy = Number(enjoyment)
    const numPhysical = Number(physcialActivity)
    const numEngage = Number(engagement)
    const numMental = Number(mentalDifficulty)
    

    const addRank = await rateTask(id,numEnjoy,numPhysical,numEngage,numMental)
 }

async function updateT (summary:string, startTime:string, endTime:string, location:string, taskId:any){

    const day = Helpers.getTodaysDate()
    const update = await updateTask(serverHandler.current.userState.username, taskId, summary, day, location, startTime, endTime) 

}


async function getCurrentTasks (){
    var currentTaskList: never[] = [];
    const currentTasks = await getTodaysActiveTasks(serverHandler.current.userState.username);
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

async function checkForUnRatedTasks (){
    const unRatedTasks = await getUnratedCompletedTasks()
    
    return unRatedTasks
}

export {getCurrentTasks,getCompletedTasks, EditTask, RankTask, checkForUnRatedTasks};