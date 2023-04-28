
import { View, Text, Button, SafeAreaView, FlatList } from "react-native"
import { Component, useState, useCallback } from "react"
import StylingConstants from "./StylingConstants";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import FiveDayMoodHistoryWidget from "./widgets/fiveDayMoodHistoryWidget";
import TotalsWidget from "./widgets/totalsWidget";
import { calcDayMood, getMonthAvgRatings, getWeeklyAvgs, rateManualTask } from './statsHelpers';
import serverHandler from '../lib/server/serverHandler';
import DaysOfWeekStatsWidget from './widgets/daysOfWeekStatsWidget';
import TaskWidget, { HappiestWhenDayStartsWithWidget, LeastEnjoyableTaskWidget } from "./widgets/taskWidget";
import MoodGraphWidget from "./widgets/moodGraphWidget";

export default function StatsScreen() {

    const [refreshing, setRefreshing] = useState(false);
    const [widgets, setWidgets] = useState([<TotalsWidget key={1}></TotalsWidget>,
    <FiveDayMoodHistoryWidget key={2}></FiveDayMoodHistoryWidget>,
    <LeastEnjoyableTaskWidget key={3}></LeastEnjoyableTaskWidget>,
    <HappiestWhenDayStartsWithWidget key={4}> </HappiestWhenDayStartsWithWidget>,
    <MoodGraphWidget key={5}></MoodGraphWidget>]);
    //const [keyOffset, setKeyOffset] = useState(0);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        
         //generate a random key every render, to refresh screen
    var keyOffset = Math.floor(Math.random() * 100000);
        setWidgets([<TotalsWidget key={keyOffset + 1}></TotalsWidget>,
        <FiveDayMoodHistoryWidget key={keyOffset + 2}></FiveDayMoodHistoryWidget>,
        <LeastEnjoyableTaskWidget key={keyOffset + 3}></LeastEnjoyableTaskWidget>,
        <HappiestWhenDayStartsWithWidget key={keyOffset + 4}> </HappiestWhenDayStartsWithWidget>,
        <MoodGraphWidget key={keyOffset + 5}></MoodGraphWidget>]);

        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
        
    }, []);


   


    

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
            <ScrollView style={{ padding: "2%", height: "100%" }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>
                }>



                {widgets}
                {/** 
                    <TotalsWidget></TotalsWidget>
                    <FiveDayMoodHistoryWidget></FiveDayMoodHistoryWidget>
                    <LeastEnjoyableTaskWidget></LeastEnjoyableTaskWidget>
                    <HappiestWhenDayStartsWithWidget></HappiestWhenDayStartsWithWidget>
                    <MoodGraphWidget/>
                    <View style={{ marginTop: "4%" }}>

                        <DaysOfWeekStatsWidget />
                        {/* <Button title='calcDayMood' onPress={() => calcDayMood(serverHandler.current.userState.username, '04/11/2023')}></Button>
                        <Button title='getMonthAvgRatings' onPress={() => getMonthAvgRatings('04/2023')}></Button>
                        <Button title='test' onPress={() => getWeeklyAvgs()}> </Button> 
                    </View>
                */}
            </ScrollView>


        </SafeAreaView>
    )

}
