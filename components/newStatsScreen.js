import { View, Text, Button } from "react-native"
import { Component } from "react"
import StylingConstants from "./StylingConstants";
import { ScrollView } from "react-native-gesture-handler";
import FiveDayMoodHistoryWidget from "./widgets/fiveDayMoodHistoryWidget";
import TotalsWidget from "./widgets/totalsWidget";
import { calcDayMood, getTaskRatingsMonth, rateManualTask } from './statsHelpers';
import serverHandler from '../lib/server/serverHandler';
import MonthlyStatsWidget from './widgets/monthlyStatsWidget'
import TaskWidget, { HappiestWhenDayStartsWithWidget, LeastEnjoyableTaskWidget } from "./widgets/taskWidget";

export default class StatsScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <View style={{flex: 1, flexDirection: "column" }}>
            <Text style={{
                color: "white",
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12, backgroundColor: StylingConstants.highlightColor, padding: "4%", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.hugeFontSize
            }}>Your Statistics</Text>

            <ScrollView style={{padding: "2%", height: "100%" }}>

                <FiveDayMoodHistoryWidget></FiveDayMoodHistoryWidget>
                <LeastEnjoyableTaskWidget></LeastEnjoyableTaskWidget>
                <HappiestWhenDayStartsWithWidget></HappiestWhenDayStartsWithWidget>
                <View style={{marginTop:"4%"}}>
                    <TotalsWidget></TotalsWidget>
                  
                    <MonthlyStatsWidget/>
                    <Button title='calcDayMood' onPress={() => calcDayMood(serverHandler.current.userState.username, '04/11/2023')}></Button>
                    <Button title='monthRatedTasks' onPress={() => getTaskRatingsMonth('04/2023')}></Button>
                </View>
            </ScrollView>

        </View>
        )
    }
}