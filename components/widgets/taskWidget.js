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
    const [tried, setTried] = useState(false);

    console.log(taskData);

    var loadData = async() =>{
        var task = await leastEnjoyableTask();
        this.setState({
            taskData: task,
            tried: true
        })

    }

    if(!tried){
        loadData();
    }

  

    return TaskWidget("","");
}