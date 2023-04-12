import * as React from 'react';
import { useEffect } from 'react';
import { View, TextInput, Text, Pressable, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import serverHandler from '../lib/server/serverHandler';
import EditableListItem from './listItems/editableListItem';
import ListButton from './listItems/listButton';
import StylingConstants from './StylingConstants';
import { DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import { GetUserPhoto } from './external_integration/importUserPhoto';
import RoundImage from './RoundImage';
import RNRestart from 'react-native-restart';
import { deleteUser, logout } from '../lib/server/users'
import { AddToOnPhotoUpdated } from './external_integration/importUserPhoto';






function Settings() {

    console.log(serverHandler.current.userState);
    const [userName, setUserName] = React.useState(serverHandler.current.userState.username);
    const [userNameEdit, setUserNameEdit] = React.useState(false)
    const [email, setEmail] = React.useState(serverHandler.current.userState.email);
    const [emailEdit, setEmailEdit] = React.useState(false)
    const [base64Image, setBase64Image] = React.useState("");
    const navigation = useNavigation();


    AddToOnPhotoUpdated((base64: string) => {
        setBase64Image(base64);
    });


    const logoutAlert = () => {
        Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Logout',

                onPress: async () => {
                    await logout();
                    RNRestart.restart();
                }
            }
        ])
    }



    const deleteAlert = () => {
        Alert.alert('Confirm Delete Account', 'Are you sure you want to delete your Account (This cannot be undone)?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Canceled Delete'),
                style: 'cancel',
            },
            {
                text: 'Confirm',
                onPress: async () => {
                    await deleteUser();
                }

            }
        ])
    }

    var photo = (
        <MaterialCommunityIcons name='account-circle-outline' color='black' size={95} style={{

            position: 'absolute',
            padding: 0,
            zIndex: 3,
            elevation: 3,
            marginLeft: -5.5,
            marginTop: -6
        }}
            onPress={() => {
                navigation.navigate('ImportUserPhoto')
            }} />
    )

    if (base64Image === "") {
        GetUserPhoto((base64: any) => {
            if (!base64) {
                setBase64Image("null");
            }
            else {
                setBase64Image(base64);
            }
        })
    }
    if (base64Image != "null" && base64Image != "") {
        photo =
            <Pressable onPress={() => {
                navigation.navigate('ImportUserPhoto')
            }} style={{

                position: 'absolute',
                padding: 0,
                zIndex: 3,
                elevation: 3,
                marginLeft: 2.5,
                marginTop: 2.5
            }}>{RoundImage({ uri: "data:image/png;base64," + base64Image }, 80)}
            </Pressable>

    }

    var buttons = [];

    const remoteButtons = (<View>
       
        {ListButton("calendar-import", "Import Calendar", () => { navigation.navigate('ImportCalendar') })}
        {ListButton("logout", "Logout", logoutAlert)}
        {ListButton("security", "Privacy Policy", () => { navigation.navigate('Privacy Policy') })}
        {ListButton("delete", "Delete Account", deleteAlert)}
    </View>);

    const localButtons = (<View>
        {ListButton("logout", "Logout", logoutAlert)}
    </View>);

    if (serverHandler.current.userState.localInitCompleted) {
        buttons = localButtons;
    }
    else {
        buttons = remoteButtons;
    }




    return (
        <View style={{
            flex: 1,



        }}>

            <View style={{
                paddingLeft: "5%",
                paddingRight: "5%", flex: 0.2, flexDirection: "row", alignItems: "flex-start", alignSelf: "flex-start", paddingTop: "7%",
                borderBottomLeftRadius: 12, borderBottomRightRadius: 12, borderBottomWidth: 3, width: "100%", paddingBottom: "7%", marginBottom: "3%",
                backgroundColor: StylingConstants.highlightColor, borderColor: StylingConstants.highlightColor

            }}>

                <View style={{ position: "relative", width: 82 }}>
                    <View style={{
                        backgroundColor: "white", position: 'absolute', zIndex: 1, elevation: 1, width: 85, height: 85, borderRadius: 85 / 2
                    }}></View>
                    <View style={{
                        backgroundColor: 'white', position: 'absolute', zIndex: 2, elevation: 2, width: 75, height: 75, borderRadius: 75 / 2, marginLeft: 5, marginRight: 5, marginTop: 5
                    }}></View>
                    {photo}
                </View>


                <View style={{ flexDirection: "column", marginTop: "5%", marginLeft: "5%", }}>
                    <Text style={{ fontSize: StylingConstants.hugeFontSize, color: "white", alignSelf: "flex-start", fontFamily: StylingConstants.defaultFontBold }}>{userName}</Text>
                    <Text style={{ fontSize: StylingConstants.subFontSize, color: StylingConstants.lightFontColor, alignSelf: "flex-start", fontFamily: StylingConstants.defaultFont }}>{email}</Text>
                </View>

            </View>





            <ScrollView style={{ flex: 5, paddingBottom: 2 }}>
                {buttons}

            </ScrollView>









        </View >

    );
}

export { Settings }