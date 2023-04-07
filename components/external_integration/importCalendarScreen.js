import { View, Text, Pressable, Button } from "react-native"
import { useState, setState, Component } from "react"
import ListButton, { ListButtonCore } from "../listItems/listButton"
import StylingConstants from "../StylingConstants"
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import serverHandler from "../../lib/server/serverHandler";
import { importOutlookCalendar, getGoogleCalendars, importGoogleCalendar, getOutlookCalendars } from '../../lib/external_integration/calendarIntegration.js';

export default class ImportCalendarScreen extends Component {

    constructor() {
        super();

        this.state = {
            stage: 0,
            type: "",
            calendars: [],
            imported: false
        }

    }

    reset() {
        this.setState({
            stage: 0,
            type: "",
            calendars: [],
            imported: false
        });

    }

    async listGoogleCalendars() {
        await getGoogleCalendars((calendarsReturn) => {
            //update state infos
            this.setState({
                type: "google",
                stage: 1,
                calendars: calendarsReturn
            });



        });
    }

    async listOutlookCalendars() {
        await getOutlookCalendars((calendarsReturn) => {

            this.setState({
                type: "google",
                stage: 1,
                calendars: calendarsReturn
            });
        });
    }


    /**
 * asks the server to import a calendar into the database
 * @param {*} id calendar id
 */
    async importCalendar(id, name) {
        //check which provide to import to

        var username = serverHandler.current.userState.username;

        if (this.state.type == "google") {
            importGoogleCalendar(id, username);
            this.setState({ stage: 2, imported: true, type: name });
        }
        else if (this.state.type == "outlook") {
            importOutlookCalendar(id, username);
            this.setState({ stage: 2, imported: true, type: name });
        }
    }

    render() {



        var toRender = "";
        if (this.state.stage == 0) {
            toRender = (<View style={{ width: "100%", height: "100%", alignItems: "center" }}>
                <Text style={{ marginBottom: "10%", fontFamily: StylingConstants.defaultFontBold, color: "black", fontSize: StylingConstants.largeFontSize }}>Select a Calendar</Text>
                <Pressable onPress={() => { this.listGoogleCalendars() }} style={{ borderRadius: 10, padding: 5, marginBottom: 20, backgroundColor: StylingConstants.highlightColor }}><MaterialCommunityIcons name="google" color="white" size={80} style={{ marginBottom: "3%", alignSelf: "center" }}></MaterialCommunityIcons>
                    <Text style={{ marginBottom: "3%", fontFamily: StylingConstants.defaultFontBold, color: "white", fontSize: StylingConstants.normalFontSize }}>Google Calendar</Text>

                </Pressable>
                <Pressable onPress={()=>{this.listOutlookCalendars()}} style={{ borderRadius: 10, padding: 5, backgroundColor: StylingConstants.highlightColor }}>
                    <MaterialCommunityIcons name="microsoft-outlook" color="white" size={80} style={{ marginBottom: "3%", alignSelf: "center" }}></MaterialCommunityIcons>

                    <Text style={{ marginBottom: "3%", fontFamily: StylingConstants.defaultFontBold, color: "white", fontSize: StylingConstants.normalFontSize }}>Outlook Calendar</Text>
                </Pressable>

            </View >
            )
        }
        else if (this.state.stage == 1) {
            var toRender = [];
            var i = 0;
            this.state.calendars.map((cal) => {
                toRender.push(<ListButtonCore key={i} text={cal.name} iconName="calendar-import" onclick={() => { this.importCalendar(cal.id, cal.name) }}></ListButtonCore>)
                i += 1;
            });

        }
        else if (this.state.imported = true) {
            toRender = (<View style={{ alignItems: "center", width: "100%" }}><Text style={{ textAlign: "center", width: "80%", marginBottom: "5%", fontFamily: StylingConstants.defaultFont, color: StylingConstants.darkFontColor, fontSize: StylingConstants.largeFontSize }}>Calendar {this.state.type} is being imported. This may take our servers a few minutes.</Text>
                <Button style={{ width: "60%" }} color={StylingConstants.highlightColor} onPress={() => { this.reset(); }} title="Import Another Calendar"></Button></View>)
        }

        return (
            <ScrollView style={{ marginTop: "5%" }}>
                {toRender}
            </ScrollView>
        )
    }
}