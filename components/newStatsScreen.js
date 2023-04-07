import { View, Text } from "react-native"
import { Component } from "react"
import StylingConstants from "./StylingConstants";
import { ScrollView } from "react-native-gesture-handler";
import FiveDayMoodHistoryWidget from "./widgets/fiveDayMoodHistoryWidget";

export default class StatsScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <View style={{ flexDirection: "column" }}>
            <Text style={{
               
                color: "white",
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12, backgroundColor: StylingConstants.highlightColor, padding: "4%", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.hugeFontSize
            }}>Your Statistics</Text>

            <ScrollView style={{ padding: "2%" }}>

                <FiveDayMoodHistoryWidget></FiveDayMoodHistoryWidget>

            </ScrollView>

        </View>
    }
}

