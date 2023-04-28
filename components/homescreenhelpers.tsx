import { useState, useCallback, Fragment} from 'react';
import {View,Text, TextInput, Button, SafeAreaView, Pressable, Platform} from 'react-native';
import * as Helpers from '../backend_server/lib/helpers';
import{getTodaysActiveTasks, getTodaysFinishedTasks, updateTask, rateTask, getUnratedCompletedTasks, addTaskToCategory, getTaskCategories} from '../lib/server/tasks';
import { useNavigation, useRoute} from '@react-navigation/native';
import serverHandler from '../lib/server/serverHandler';
import StylingConstants from './StylingConstants';
import DropDownPicker from 'react-native-dropdown-picker'
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

function EditTask (task:any){

    

   const navigation = useNavigation()
   const [sum, setSum] = useState(task.route.params.task.item.summary)
   const [showStartTime, setShowStartTime] = useState(false)
   const [start, setStart] = useState(task.route.params.task.item.startTime)
   const [startObject, setStartObject] = useState(new Date())
   const [showEndTime, setShowEndTime] = useState(false)
   const [end, setEnd] = useState(task.route.params.task.item.endTime)
   const [endObject, setEndObject] = useState(new Date())
   const [loc, setLoc] = useState(task.route.params.task.item.location)
   const id = task.route.params.task.item.taskId
   const user = serverHandler.current.userState.user
    
   const formatTime = (time:string) =>{
        const [hour, min] = time.split(':')
        const hourFormat = hour.padStart(2,'0')
        const newTime = `${hourFormat}:${min}`
        return (newTime)
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
          }
          return `${hr}:${min} AM`
      }
      
   }

 
    
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
                  backgroundColor:StylingConstants.highlightColor,
                  height:'15%',
                  justifyContent:'center',
                  borderTopEndRadius:30,
                  borderTopStartRadius:30
              }}>
                <Text style={{
                    fontSize:StylingConstants.hugeFontSize,
                    alignSelf:'center',
                    color:'white',
                    fontFamily:StylingConstants.defaultFontBold,
                
                    
                }}
                    >Edit Task</Text>

              </View>
               
               {(!showStartTime && !showEndTime) ? (
               <Fragment>
               <Text style={{
                        alignSelf:'center',
                        paddingTop:'8%',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize: StylingConstants.normalFontSize,
                        paddingBottom:'3%'
                        
                    }}
                    >Title</Text> 
                    
                    <TextInput style={{
                       
                        borderWidth:1,
                        width:'75%',
                        alignSelf:'center',
                        paddingLeft:'5%',
                        height: '8%'
                        
                    }} 
                    placeholder={sum}
                    placeholderTextColor='black'
                    onChangeText={text => setSum(text)}
                    />
                    </Fragment>) : null}
                  
                   
                   
                

                {!showEndTime ? (
                    <Fragment>
                        <Text style={{
                        alignSelf:'center',
                        paddingTop:'3%',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize: StylingConstants.normalFontSize
                    }}
                    >Start Time</Text>
                <Pressable onPress={() => (setShowStartTime(!showStartTime))} >
                    <Text style={{
                        alignSelf:'center',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize:StylingConstants.largeFontSize,
                        color:StylingConstants.lighterHighlightColor,
                    }}>{formatClientTime(start)}</Text>

                </Pressable>
                    </Fragment>
                ) : null}
                   

                {showStartTime ? ( 
                <RNDateTimePicker  value={startObject} onChange={(event:DateTimePickerEvent, day:Date) => {
                    setStartObject(day)
                    const time = formatTime(day.toLocaleTimeString('EN-en', {hourCycle:'h24'}).substring(0,5))
                    setStart(time)
                    if(Platform.OS != 'ios'){
                        setShowStartTime(!showStartTime)  
                    }
                    
                }} mode='time' display='spinner' textColor='black'/>) : null}
               
               
               
              
                {(!showStartTime || showEndTime) ? (
                    <Fragment>
                          <Text style={{
                        alignSelf:'center',
                        paddingTop:'3%',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize: StylingConstants.normalFontSize
                    }}
                    >End Time</Text>
                     <Pressable onPress={() => (setShowEndTime(!showEndTime))} >
                    <Text style={{
                        alignSelf:'center',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize:StylingConstants.largeFontSize,
                        color:StylingConstants.lighterHighlightColor,
                    }}>{formatClientTime(end)}</Text>

                    </Pressable>
                 
                   
                    </Fragment>
                ) : null}

                {showEndTime ? (
                       <RNDateTimePicker  value={endObject} onChange={(event:DateTimePickerEvent, day:Date) => {
                        setEndObject(day)
                        const time = formatTime(day.toLocaleTimeString('EN-en', {hourCycle:'h24'}).substring(0,5))
                        setEnd(time)
                        if(Platform.OS != 'ios'){
                            setShowStartTime(!showEndTime)  
                        }
                        
                    }} mode='time' display='spinner' textColor='black'/>
                ) : null}
             
            
               
                {(!showStartTime && !showEndTime) ? (
                    <Fragment>
                        <Text style={{
                            alignSelf:'center',
                            paddingTop:'3%',
                            fontFamily:StylingConstants.defaultFont,
                            fontSize: StylingConstants.normalFontSize,
                            paddingBottom:'3%'
                        }}
                        >Location</Text>
                        <TextInput style={{
                            
                            borderWidth:1,
                            width:'75%',
                            alignSelf:'center',
                            paddingLeft:'5%',
                            height:'8%',
                        }} 
                        placeholder={loc}
                        placeholderTextColor='black'
                        onChangeText={text=>setLoc(text)}
                        />
                
                    <View  style={{
                        flex:1,
                        flexDirection:'row',
                        alignSelf:'center',
                
                    
                    }}>
                        <Button  title='Cancel'  onPress={()=> navigation.navigate('HomeScreen')}/>
                        <Button title='Submit' onPress ={async()=> {updateT(sum, start, end, loc, id); navigation.navigate('HomeScreen')}} />
                    </View>
                    </Fragment>
                ) : null}
               
           
            


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
      const[categoryOpen,setCategoryOpen] = useState(false)
      const [categoryValue, setCategoryValue] = useState(null)
      const [categoryItems, setCategoryItems] = useState([
         
      ])

     
      async function testCat() {
          const cats = await getTaskCategories(id)
          
      }

      testCat()

      const onEnjoymentOpen = useCallback(() => {
        setPhysicalOpen(false);
        setEngagementOpen(false);
        setMentalDifficultyOpen(false);
        setCategoryOpen(false);
        setEnjoymentOpen(!enjoymentOpen);
      }, [enjoymentOpen]);
      
      const onPhysicalOpen = useCallback(() => {
        setPhysicalOpen(!physicalOpen);
        setEngagementOpen(false);
        setMentalDifficultyOpen(false);
        setEnjoymentOpen(false);
      }, [physicalOpen]);
      
      const onEngagementOpen = useCallback(() => {
        setPhysicalOpen(false);
        setEngagementOpen(!engagementOpen);
        setMentalDifficultyOpen(false);
        setEnjoymentOpen(false);
        setCategoryOpen(false);
      }, [engagementOpen]);
      
      const onMentalOpen = useCallback(() => {
        setPhysicalOpen(false);
        setEngagementOpen(false);
        setMentalDifficultyOpen(!mentalDifficultyOpen);
        setEnjoymentOpen(false);
        setCategoryOpen(false);
      }, [mentalDifficultyOpen]);
      
      const onCategoryOpen = useCallback(() => {
        setPhysicalOpen(false);
        setEngagementOpen(false);
        setMentalDifficultyOpen(false);
        setEnjoymentOpen(false);
        setCategoryOpen(!categoryOpen)
      }, [categoryOpen]);
    

    var catIndex = categoryOpen ? 4 : 0
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
                 height:'80%',
                 width:'80%',
                 alignSelf:'center',
                 position:'absolute',
                 top:'5%', 
                 backgroundColor:'white', 
                 borderRadius:30, 
                
                 
             }}>

                    <View style ={{
                        height:'15%',
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
                    
                <View style={{
                    flex:1,
                    marginBottom:'10%',
                    zIndex:4
                }}>
                    <Text style={{
                        
                        alignSelf:'center',
                        padding:'3%',
                        fontFamily: StylingConstants.defaultFont,
                        fontSize: StylingConstants.subFontSize,
                        
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
                          
                            
                        />
                    
                </View>
               

                <View style={{
                    flex:1,
                    marginBottom:'10%',
                    zIndex:3
                }}>
                    <Text style={{
                
                        alignSelf:'center',
                        fontSize: StylingConstants.subFontSize,
                        padding:'3%',
                        fontFamily: StylingConstants.defaultFont,
                        zIndex:3
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
                            zIndex ={3}
                           
                        />
                    
                </View>

                <View style ={{
                    flex:1,
                    marginBottom:'5%', 
                   zIndex:2
                }}>

                    <Text style={{
                       
                        alignSelf:'center',
                        fontFamily: StylingConstants.defaultFont,
                        padding:'3%',
                        fontSize: StylingConstants.subFontSize
                    }}
                    >Engagement</Text>
                      <DropDownPicker
                            open={engagementOpen}
                            value={engagementValue}
                            items={items}
                            setOpen={onEngagementOpen}
                            setValue={setEngagementValue}
                            setItems={setItems}
                            containerStyle={{
                                width:'75%',
                                alignSelf:'center'
                            }}
                         

                        />
                
                    </View>

                <View style={{
                    flex:1,
                    paddingBottom:'5%',
                    zIndex:1
                    
                }}>
                
                    <Text style={{
                      
                        alignSelf:'center',
                        fontFamily: StylingConstants.defaultFont,
                        fontSize:StylingConstants.subFontSize,
                        paddingBottom:'3%',
                        paddingTop:'10%'
                        
                    
                    }}
                    >Mental Difficulty</Text>
                      <DropDownPicker
                            open={mentalDifficultyOpen}
                            value={mentalDifficultyValue}
                            items={items}
                            setOpen={onMentalOpen}
                            setValue={setMentalDifficultyValue}
                            setItems={setItems}
                            containerStyle ={{
                                width: '75%',
                                alignSelf:'center',
                                
                            }}
                            
                        
                        />
                </View>

                <View style={{
                    flex:1,
                    paddingTop:'10%',
                    paddingBottom:'15%',
                    zIndex: catIndex
                    
                }}>
                    <Text style={{
                        alignSelf:'center',
                        fontFamily:StylingConstants.defaultFont,
                        fontSize:StylingConstants.subFontSize,
                        padding:'3%',
                    }}>Category</Text>
                    <DropDownPicker
                            open ={categoryOpen}
                            setOpen ={onCategoryOpen}
                            value ={categoryValue}
                            items = {categoryItems}
                            setValue ={setCategoryValue}
                            setItems ={setCategoryItems}
                            containerStyle={{
                                width:'75%',
                                alignSelf:'center'
                            }}
                            searchable={true}
                            addCustomItem={true}
                            searchPlaceholder='Search or Add Category'
        
                            />
                
                </View>
                
                <View  style={{
                    flex:1,
                    flexDirection:'row',
                    alignSelf:'center',
                
                    
                }}>
                    <Button  title='Cancel'  onPress={()=> navigation.goBack()}/>
                    <Button title='Submit' onPress ={async()=> {rankT(id, enjoymentValue,physicalValue,engagementValue,mentalDifficultyValue); await addTaskToCategory(id,categoryValue); navigation.navigate(navPath, {random})}} />
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