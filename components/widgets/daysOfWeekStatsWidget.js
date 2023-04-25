import { View, Text } from "react-native"
import { Component } from "react"
import StylingConstants from "../StylingConstants"
import { totalCompletedTasks, totalRatedTasks } from "../../lib/server/tasks";
import { totalRates } from "../../lib/server/daily";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default class DaysOfWeekStatsWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
        (async () => {
            
        })();
    }

    render() {
        return (
            <View></View>
        )
    }
}