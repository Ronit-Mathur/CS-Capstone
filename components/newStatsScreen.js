<<<<<<< HEAD
import { View, Text, Button} from "react-native"
=======
import { View, Text, Button, SafeAreaView } from "react-native"
>>>>>>> 5f1b8d9b431f65983010e0fc5399bce54cb0ce74
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
<<<<<<< HEAD
            <View style={{ flex: 1, flexDirection: "column" }}>
               
                    <Text style={{
                        color: "white",
                        borderBottomEndRadius: 30,
                    
                    
                    borderBottomRightRadius: 30, backgroundColor: StylingConstants.highlightColor, padding: "10%", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.hugeFontSize, 
                    
                }}>Your Statistics</Text>

              
               
                

                <ScrollView style={{ padding: "2%", height: "100%"}}>
=======
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
>>>>>>> 5f1b8d9b431f65983010e0fc5399bce54cb0ce74

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
