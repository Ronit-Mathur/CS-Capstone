import { View, Text, Pressable } from "react-native"
import { useState, setState, Component } from "react"
import ListButton from "../listItems/listButton"
import StylingConstants from "../StylingConstants"
import { getGoogleCalendars } from "../../lib/external_integration/calendarIntegration";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default class ImportCalendarScreen extends Component {

    render() {

        this.state = {
            stage: 0,
            provider: "",
            calendars: []
        }
        async function listGoogleCalendars() {
            await getGoogleCalendars((calendarsReturn) => {
                //update state infos
                this.setState({
                    type: "google",
                    stage: 1,
                    calendars: calendarsReturn
                })



            });
        }


        var toRender = "";
        if (this.state.stage == 0) {
            toRender = (<View style={{width: "100%", height: "100%", alignItems: "center" }}>
                <Text style={{ marginBottom: "10%", fontFamily: StylingConstants.defaultFontBold, color: "black", fontSize: StylingConstants.largeFontSize }}>Select a Calendar</Text>
                <Pressable onPress={listGoogleCalendars} style={{ borderRadius: 10, padding:5, marginBottom: 20,  backgroundColor: StylingConstants.highlightColor }}><MaterialCommunityIcons name="google" color="white" size={80} style={{ marginBottom: "3%", alignSelf: "center" }}></MaterialCommunityIcons>
                    <Text style={{ marginBottom: "3%", fontFamily: StylingConstants.defaultFontBold, color: "white", fontSize: StylingConstants.normalFontSize }}>Google Calendar</Text>

                </Pressable>
                <View style={{  borderRadius: 10, padding:5, backgroundColor: StylingConstants.highlightColor }}>
                    <MaterialCommunityIcons name="microsoft-outlook" color="white" size={80} style={{ marginBottom: "3%", alignSelf: "center" }}></MaterialCommunityIcons>

                    <Text style={{ marginBottom: "3%", fontFamily: StylingConstants.defaultFontBold, color: "white", fontSize: StylingConstants.normalFontSize }}>Google Calendar</Text>
                </View>

            </View >
            )
        }
        else if (this.state.stage == 1 && this.state.type == "google") {
            var toRender = [];
            var calendars = this.state.calendars
            for (var i = 0; i < calendars.length; i++) {
                toRender.push(ListButton("calendar-import"), calendars[i].name, () => { });
            }

        }

        return (
            <ScrollView style={{ marginTop: "5%" }}>
                {toRender}
            </ScrollView>
        )
    }
}