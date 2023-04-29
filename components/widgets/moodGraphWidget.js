import { View, Text, Dimensions } from "react-native"
import { Component } from "react"
import StylingConstants from "../StylingConstants"
import { totalCompletedTasks, totalRatedTasks } from "../../lib/server/tasks";
import { totalRates } from "../../lib/server/daily";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMonthAvgRatings, getWeeklyAvgs }from '../statsHelpers';
import * as Helpers from '../../backend_server/lib/helpers';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

export default class MoodGraphWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataObject: null,
            month: Helpers.getTodaysMonth(),
            labels: ["01", "02", "03","04", "05", "06","07", "08", "09", "10"],
            moodData: [
                0,0,0,0,0,0,0,0,0,0
            ],
            daysOfWeekRatings: [3,3,3,3,3,3,3]
        }
    }

    componentDidMount() {
        (async () => { 
            try {
                //moodDateList = await getMonthAvgRatings(tmpMonth);
                var currMonth = Helpers.getTodaysMonth();
                //console.log(currMonth);
                var dataObject = await getMonthAvgRatings(currMonth);
                var daysOfWeekRatings = await getWeeklyAvgs(dataObject);
                //console.log(dataObject);
                var labels = dataObject.days;
                //console.log("Labels:");
                //console.log(labels);
                var moodData = dataObject.ratings;
                this.setState({labels: labels, moodData: moodData, dataObject: dataObject, daysOfWeekRatings: daysOfWeekRatings});
            } catch(err) {
                console.log(err);
            }

        })();
    }

    render() {
        var md = this.state.moodData;
        var lbls = this.state.labels;
        var moodDataChart = {
            labels: lbls,
            datasets: [
                {
                    data: md
                }
            ]
        }

        var dowData = this.state.daysOfWeekRatings;
        var dowLbls = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        var dowMoodDataChart = {
            labels: dowLbls,
            datasets: [
                {
                    data: dowData
                }
            ]
        }

        return (
            <View>
                
                <View
                    style = 
                    {{shadowColor: "gray",
                    borderRadius: 15,
                    shadowOffset: { width: 5, height: 5 },
                    shadowRadius: 5,
                    
                    shadowOpacity: .22,
                    padding: 6,
                    backgroundColor: "white",
                    elevation: 8,
                    zIndex: 2,
                    width: "98%",
                    alignSelf: "center", marginTop: 10,
                    marginBottom: 5,
                    position: "relative"}}
                >
                    <Text style={{paddingLeft: 5, textAlign: "center", paddingRight: 5, color: StylingConstants.highlightColor, fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.normalFontSize}}>
                        {Helpers.MMYYYYtoMonthName(this.state.month)}
                    </Text>
                    <LineChart
                        data={moodDataChart}
                        fromNumber={5}
                        fromZero={1}
                        segments={5}
                        width={Dimensions.get("window").width - 32} // from react-native
                        height={220}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                        backgroundColor: StylingConstants.highlightColor,
                        backgroundGradientFrom: StylingConstants.highlightColor,
                        backgroundGradientTo: StylingConstants.lighterHighlightColor,
                        decimalPlaces: 1, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: StylingConstants.highlightColor
                        }
                        }}
                        bezier
                        style={{
                        marginVertical: 8,
                        borderRadius: 16
                        }}
                    />
                </View>

                <View
                    style = 
                    {{shadowColor: "gray",
                    borderRadius: 15,
                    shadowOffset: { width: 5, height: 5 },
                    shadowRadius: 5,
    
                    shadowOpacity: .22,
                    padding: 6,
                    paddingBottom: 23,
                    backgroundColor: "white",
                    elevation: 8,
                    zIndex: 2,
                    width: "98%",
                    alignSelf: "center", marginTop: 10,
                    marginBottom: 5,
                    position: "relative"}}
                >
                    <LineChart
                        data={dowMoodDataChart}
                        fromNumber={5}
                        fromZero={1}
                        segments={5}
                        width={Dimensions.get("window").width - 32} // from react-native
                        height={220}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                        backgroundColor: StylingConstants.highlightColor,
                        backgroundGradientFrom: StylingConstants.highlightColor,
                        backgroundGradientTo: StylingConstants.lighterHighlightColor,
                        decimalPlaces: 1, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: StylingConstants.highlightColor
                        }
                        }}
                        bezier
                        style={{
                        marginVertical: 8,
                        borderRadius: 16
                        }}
                    />
                </View>
            </View>
        )
    }
}