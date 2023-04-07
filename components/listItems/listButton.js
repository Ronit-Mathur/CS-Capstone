import { View, Text, Pressable } from "react-native"
import {useState} from "react"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StylingConstants from "../StylingConstants";

export default function ListButton(iconName, text, onclick) {

    const [bgColor, SetBgColor] = useState("transparent");

    function ExecuteOnPress() {
        SetBgColor(StylingConstants.lightBackgroundColor);
        onclick();
        var inter = setInterval(() =>{
            SetBgColor("transparent");
            clearInterval(inter);
        }, 120);
 
    }

    return (
        <Pressable style={{ padding: "3%", flexDirection: "row", width: "100%", borderBottomWidth: 1, borderColor: "gray", backgroundColor:bgColor }}
            onPress={ExecuteOnPress}>
            <MaterialCommunityIcons name={iconName} color={StylingConstants.highlightColor} size={40} style={{ alignSelf: "center" }}></MaterialCommunityIcons>
            <Text style={{
                marginLeft: "3%", alignSelf: "center", color: StylingConstants.darkFontColor, fontSize: StylingConstants.normalFontSize, fontFamily: StylingConstants.defaultFontBold

            }}>{text}</Text>
        </Pressable>
    )


}

