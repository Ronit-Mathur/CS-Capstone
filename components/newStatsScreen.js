import { View, Text, Button, SafeAreaView } from "react-native"
import { Component } from "react"
import StylingConstants from "./StylingConstants";
import { ScrollView } from "react-native-gesture-handler";
import FiveDayMoodHistoryWidget from "./widgets/fiveDayMoodHistoryWidget";
import TotalsWidget from "./widgets/totalsWidget";
import { calcDayMood, getTaskRatingsMonth, rateManualTask } from './statsHelpers';
import serverHandler from '../lib/server/serverHandler';
import DaysOfWeekStatsWidget from './widgets/daysOfWeekStatsWidget'
import TaskWidget, { HappiestWhenDayStartsWithWidget, LeastEnjoyableTaskWidget } from "./widgets/taskWidget";


export default class StatsScreen extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
                <View style={{
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12, backgroundColor: StylingConstants.highlightColor, padding: "4%",
                }}>
                    <Text style={{
                        color: "white",
                        fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.hugeFontSize
                    }}>Your Statistics</Text>
                </View>
                <ScrollView style={{ padding: "2%", height: "100%" }}>

                    <TotalsWidget></TotalsWidget>
                    <FiveDayMoodHistoryWidget></FiveDayMoodHistoryWidget>
                    <LeastEnjoyableTaskWidget></LeastEnjoyableTaskWidget>
                    <HappiestWhenDayStartsWithWidget></HappiestWhenDayStartsWithWidget>
                    {/** 
                    <View style={{ marginTop: "4%" }}>

                        <DaysOfWeekStatsWidget />
                        <Button title='calcDayMood' onPress={() => calcDayMood(serverHandler.current.userState.username, '04/11/2023')}></Button>
                        <Button title='monthRatedTasks' onPress={() => getTaskRatingsMonth('04/2023')}></Button>
                    </View>
            **/}
                </ScrollView>


            </SafeAreaView>
        )
    }
}
