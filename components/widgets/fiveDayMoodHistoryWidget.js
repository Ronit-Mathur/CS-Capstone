import { View, Text } from 'react-native'
import helpers from '../../backend_server/lib/helpers'
import { useState, useEffect } from 'react'
import { getDay } from '../../lib/server/daily';
import StylingConstants from '../StylingConstants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function FiveDayMoodHistoryWidget() {




    /**
     * get the users last five days of tracked moods
     * 
     */

    const now = Date.now();
    const days = Array.from({ length: 5 }, (_, x) => new Date(now - 1000 * 60 * 60 * 24 * x));
    var dayData = [];
    for (var i = 0; i < days.length; i++) {
        var dateFormated = helpers.dateToMMDDYYYY(days[i]);
        dayData.push(dateFormated);

    }

    dayData = dayData.reverse();

 //console.log("rendering");
    return (
        <View style={{
            width: "98%", alignSelf: "center", marginTop: "2%", shadowColor: "gray",
          
            borderRadius: 15,
            shadowOffset: { width: 5, height: 5 },
            shadowRadius: 5,

            shadowOpacity: .22,
            padding: 8,
            backgroundColor: "white",
            elevation: 8,
            zIndex: 2
        }}>
            <Text style={{ paddingLeft: 5, paddingRight: 5, color: StylingConstants.highlightColor, fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.normalFontSize }}>Your Last 5 Days</Text>
            <View style={{ paddingLeft: 5, paddingRight: 5, flexDirection: "row", alignItems: "center",   justifyContent:"space-between" }}>

                {DayHistoryWidget(dayData[0])}
                {DayHistoryWidget(dayData[1])}
                {DayHistoryWidget(dayData[2])}
                {DayHistoryWidget(dayData[3])}
                {DayHistoryWidget(dayData[4])}
            </View>
        </View>
    )


}

function DayHistoryWidget(dateResult) {

    const [serverData, SetServerData] = useState(false);

    useEffect(() => {
        (async () => {
            var result = await getDay(dateResult);
            SetServerData(result);
        })();
    }, []);

    if (serverData == false) {

        return (
            <View></View>
        )
    }
    else {
        var day = helpers.dateToDayOfWeek(helpers.MMDDYYYYtoDate(dateResult));

        var face = "emoticon-neutral-outline";
        var color = "black";
        //convert the rating to a face
        if (serverData == null || serverData.happiness == 3) {
            face = "emoticon-neutral-outline";
            color = "#f5e942";
        }
        else if (serverData.happiness == 1) {
            face = 'emoticon-frown-outline';
            color = "#f55a42";
        }
        else if (serverData.happiness == 2) {
            face = 'emoticon-sad-outline';
            color= "#f58a42";
        }
        else if (serverData.happiness == 4) {
            face = 'emoticon-happy-outline';
            color = "#cfff30";
        }
        else if (serverData.happiness == 5) {
            face = 'emoticon-outline';
            color = "#7ef763";
        }



        return (
            <View style={{
                flexDirection: "row",
                marginTop: 10,
                

  
                height: "90%",

            }}>
                <View style={{ backgroundColor: color, height: "80%", width: 3, alignSelf: "center", marginRight: 5 }}></View>

                <View style={{ flexDirection: "column" }}>
                    <Text style={{
                        alignSelf: "center", paddingLeft: 2, paddingRight: 2,
                        fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.normalFontSize, color: "black", marginBottom: 4
                    }}>{day.substring(0, 3)}</Text>
                    <MaterialCommunityIcons name={face} color="black" size={30} style={{
                        alignSelf: "center"
                    }}
                    />
                </View>



            </View>
        )
    }
}