import {View,Text} from 'react-native';
import * as Helpers from '../backend_server/lib/helpers';
import{getTodaysActiveTasks, getTodaysFinishedTasks, getDaysTasks} from '../lib/server/tasks';



function EditTask (){
    return(
        <View>
            <Text>Edit Task</Text>
        </View>
    );
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

    return completedTaskList;
}

export {getCurrentTasks,getCompletedTasks, EditTask};