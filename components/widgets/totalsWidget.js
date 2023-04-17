import { View, Text } from "react-native"
import { Component } from "react"
import StylingConstants from "../StylingConstants"
import { totalCompletedTasks, totalRatedTasks } from "../../lib/server/tasks";
import { totalRates } from "../../lib/server/daily";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class TotalsWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCompleted: 0,
            totalRated: 0,
            daysRated: 0
        }
    }

    componentDidMount() {
        (async () => {
            var totalTasks = await totalCompletedTasks();
            var totalRated = await totalRatedTasks();
            var daysRated = await totalRates();
            this.setState({ totalCompleted: totalTasks, totalRated: totalRated, daysRated: daysRated });
        })();
    }

    render() {
        return (
            <View style={{
                shadowColor: "gray",
                borderRadius: 15,
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
                <MaterialCommunityIcons name="account" color={StylingConstants.lighterHighlightColor} size={25} style={{ position: "absolute", top: "10%", right: "2%" }}> </MaterialCommunityIcons>
                <Text style={{ fontSize: StylingConstants.subFontSize, color: StylingConstants.highlightColor, fontFamily: StylingConstants.defaultFontBold }}>Totals</Text>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ marginTop: "2%", marginRight: "4%" }}>
                        <Text style={{ color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize }}>Task Completed</Text>
                        <Text style={{ color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.subFontSize }}>{this.state.totalCompleted}</Text>
                    </View>
                    <View style={{ marginTop: " 2%", marginRight: "4%" }}>
                        <Text style={{ color:"black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize }}>Tasks Rated</Text>
                        <Text style={{ color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.subFontSize }}>{this.state.totalRated}</Text>
                    </View>
                    <View style={{ marginTop: " 2%", marginRight: "4%" }}>
                        <Text style={{color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize }}>Days Rated</Text>
                        <Text style={{ color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.subFontSize }}>{this.state.daysRated}</Text>
                    </View>
                </View>
            </View>
        )
    }
}