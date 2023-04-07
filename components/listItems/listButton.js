import { View, Text, Pressable } from "react-native"
import { useState, Component } from "react"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StylingConstants from "../StylingConstants";

/** 
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

**/

export class ListButtonCore extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bgColor: "transparent"
        }
    }

    ExecuteOnPress() {
        this.setState({ bgColor: StylingConstants.lightBackgroundColor });
        this.props.onclick();
        var inter = setInterval(() => {
            this.setState({ bgColor: "transparent" });

            clearInterval(inter);
        }, 120);

    }


    render() {



        return (
            <Pressable style={{ padding: "3%", flexDirection: "row", width: "100%", borderBottomWidth: 1, borderColor: "gray", backgroundColor: this.state.bgColor }}
                onPress={()=>{this.ExecuteOnPress()}}>
                <MaterialCommunityIcons name={this.props.iconName} color={StylingConstants.highlightColor} size={40} style={{ alignSelf: "center" }}></MaterialCommunityIcons>
                <Text style={{
                    marginLeft: "3%", alignSelf: "center", color: "black", fontSize: StylingConstants.normalFontSize, fontFamily: StylingConstants.defaultFontBold

                }}>{this.props.text}</Text>
            </Pressable>
        )
    }
}

export default function ListButton(iconName, text, onclick) {
    return (<ListButtonCore text={text} onclick={onclick} iconName={iconName}></ListButtonCore>)
}
