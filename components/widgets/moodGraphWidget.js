import { View, Text } from "react-native"
import { Component } from "react"
import StylingConstants from "../StylingConstants"
import { totalCompletedTasks, totalRatedTasks } from "../../lib/server/tasks";
import { totalRates } from "../../lib/server/daily";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import getMonthAvgRatings from '../statsHelpers';

export default class MoodGraphWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
        (async () => {
            moodDateList = await getMonthAvgRatings(tmpMonth);
            this.setState({moodDateList: moodDateList});
        })();
    }

    render() {
        return (
            
        )
    }
}