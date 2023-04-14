import { View, Text } from "react-native"
import { useState, useEffect } from 'react'
import { happiestWhenDayStartsWith, leastEnjoyableTask } from "../../lib/server/tasks";
import StylingConstants from "../StylingConstants";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function TaskWidget(title, summary, subText, subValue, icon, color) {
    return (
        <View style={{
            shadowColor: "gray",
            borderRadius: 1,
            shadowOffset: { width: 5, height: 5 },
            shadowRadius: 5,

            shadowOpacity: .22,
            padding: 8,
            backgroundColor: "white",
            elevation: 8,
            zIndex: 2,
            width: "98%",
            alignSelf: "center", marginTop: 10,
            marginBottom: 5,
            position: "relative"
        }}>
            <MaterialCommunityIcons name={icon} color={color} size={25} style={{ position: "absolute", top: "15%", right: "2%" }}> </MaterialCommunityIcons>
            <Text style={{marginBottom:4,  fontSize: StylingConstants.subFontSize, color:StylingConstants.highlightColor, fontFamily: StylingConstants.defaultFontBold }}>{title}</Text>
            <Text style={{ marginBottom:1, fontSize: StylingConstants.subFontSize, color: "black", fontFamily: StylingConstants.defaultFontBold }}>{summary}</Text>
            <View style={{ flexDirection: "row" }}>
                <Text style={{ marginRight: 4, fontSize: StylingConstants.tinyFontSize, color: "black", fontFamily: StylingConstants.defaultFontBold }}>{subValue}</Text>
                <Text style={{ fontSize: StylingConstants.tinyFontSize, color: "black", fontFamily: StylingConstants.defaultFontBold }}>{subText}</Text>

            </View>
        </View>
    )
}

export function LeastEnjoyableTaskWidget() {
    const [taskData, setTaskData] = useState({});

    var loadData = async () => {
        var task = await leastEnjoyableTask();
        

        setTaskData(task);

    }

    if (taskData != null && Object.keys(taskData).length == 0) {
        loadData();
    }

    var summary = "";
    var count = 0;
    var subText = "instances rated negatively";
    if (taskData != null && Object.keys(taskData).length > 0) {
        summary = taskData.summary;
        count = taskData.c;

        if (count == 1) {
            subText = "instance rated negatively";
        }
    }


    return TaskWidget("Your Least Enjoyable Task", summary, subText, count, "arrow-down", "red");
}

export function HappiestWhenDayStartsWithWidget(){
    const [taskData, setTaskData] = useState({});

    var loadData = async () => {
        var task = await happiestWhenDayStartsWith();


        setTaskData(task);

    }

    if (taskData != null && Object.keys(taskData).length == 0) {
        loadData();
    }

    var summary = "";
    var count = 0;
    var subText = "days started positively";
    if (taskData != null && Object.keys(taskData).length > 0) {
        summary = taskData.summary;
        count = taskData.c;

        if (count == 1) {
            subText = "day started positively";
        }
    }

      return TaskWidget("Your Day is Happiest When it Starts With", summary, subText, count, "arrow-up", "green");
}