import { getTasksByMonth } from "../../lib/server/tasks";
import React from "react"
import { Text, TextInput, View, Image, SafeAreaView, Button, StyleSheet, Pressable } from 'react-native';
import { importOutlookCalendar, getGoogleCalendars, importGoogleCalendar, getOutlookCalendars } from '../../lib/external_integration/calendarIntegration';
import serverHandler from "../../lib/server/serverHandler";
import { createUser } from "../../lib/server/users";


export default class ImportCalendar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listCalendars: false, //if true list calendars on page
            calendars: [], //list of calendars to display. {name, id}
            calendarProvider: "", //which service the objects in the the calendar state list belong to
            imported: false
        }
    }

    render() {

        var display = (<View>
            <Pressable style={styles.button} onPress={() => { this.listGoogleCalendars() }}>
                <Text style={styles.text}>Import From Google Calendar</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => { this.listOutlookCalendars() }}>
                <Text style={styles.text}>Import From Outlook Calendar</Text>
            </Pressable>

        </View>);

        if (this.state.listCalendars) {
            //change view to calendar list
            display = this.getCalendarDisplay();
        }

        if(this.state.imported){
            display = (<Text style={styles.text}>Calendar Imported</Text>);
        }


        return (
            <View>
                {display}
            </View>
        )
    }


    /**
     * lists a user's google calendars. will have them oauth first
     */
    async listGoogleCalendars() {
  
        await getGoogleCalendars((calendars) => {

            //update state infos
            this.setState({ calendars: calendars, listCalendars: true, calendarProvider: "google" });
        });
    }


    /**
     * 
     * @return a list of calendar name objects to display
     */
    getCalendarDisplay() {
        const calOut = [];

        var keyInt = 0;
        this.state.calendars.map((cal) => {
            calOut.push(<Pressable style={styles.button} key={"" + keyInt} onPress={() => { this.importCalendar(cal.id) }}><Text style={styles.text}>{cal.name}</Text></Pressable>)
            keyInt++;
        });
        return calOut;
    }


    /**
     * asks the server to import a calendar into the database
     * @param {*} id calendar id
     */
    async importCalendar(id) {
        //check which provide to import to

        var username = serverHandler.current.userState.username;

        if (this.state.calendarProvider == "google") {
            importGoogleCalendar(id, username);
            this.setState({imported: true});
        }
        else if(this.state.calendarProvider == "outlook"){
            importOutlookCalendar(id, username);
            this.setState({imported: true});
        }
    }

    async listOutlookCalendars() {
        await getOutlookCalendars((calendars) => {

            //update state infos
            this.setState({ calendars: calendars, listCalendars: true, calendarProvider: "outlook", });
        });
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "darkblue",
        padding: 15,
        marginBottom: 10
    },
    text: {
        textAlign: "center",
        color: "white"
    }
});