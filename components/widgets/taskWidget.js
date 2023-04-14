import {View} from "react-native"
import { useState, useEffect } from 'react'
import { leastEnjoyableTask } from "../../lib/server/tasks";

export function TaskWidget(title, summary){
    return(
        <View></View>
    )
}

export function LeastEnjoyableTaskWidget(){
    const [taskData, setTaskData] = useState({});

    console.log(taskData);

    var loadData = async() =>{
        var task = await leastEnjoyableTask();
        setTaskData(task);
    }

    loadData();

    return TaskWidget("","");
}