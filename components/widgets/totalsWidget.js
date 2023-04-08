import { View, Text } from "react-native"
import { Component } from "react"
import StylingConstants from "../StylingConstants"
import { totalCompletedTasks } from "../../lib/server/tasks";

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
            this.setState({totalCompleted: totalTasks});
        })();
    }

    render() {
        return (
            <View style={{ borderRadius: 8, padding: "4%", backgroundColor: StylingConstants.highlightColor }}>
                <Text style={{ fontSize: StylingConstants.normalFontSize, color: "white", fontFamily: StylingConstants.defaultFontBold }}>Totals</Text>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ marginTop: "2%", marginRight: "4%" }}>
                        <Text style={{ color: "white", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.subFontSize }}>Task Completed</Text>
                        <Text style={{ color: "white", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.subFontSize }}>{this.state.totalCompleted}</Text>
                    </View>
                    <View style={{ marginTop: " 2%", marginRight: "4%" }}>
                        <Text style={{ color: "white", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.subFontSize }}>Tasks Rated</Text>
                        <Text style={{ color: "white", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.subFontSize }}>{this.state.totalRated}</Text>
                    </View>
                    <View style={{ marginTop: " 2%", marginRight: "4%" }}>
                        <Text style={{ color: "white", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.subFontSize }}>Days Rated</Text>
                        <Text style={{ color: "white", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.subFontSize }}>{this.state.daysRated}</Text>
                    </View>
                </View>
            </View>
        )
    }
}