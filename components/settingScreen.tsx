import * as React from 'react';
import { View, TextInput, Text, Pressable, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import serverHandler from '../lib/server/serverHandler';
import StylingConstants from './StylingConstants';








function Settings() {

    const [userName, setUserName] = React.useState(serverHandler.current.userState.username);
    const [userNameEdit, setUserNameEdit] = React.useState(false)
    const [email, setEmail] = React.useState('example@gmail.com')
    const [emailEdit, setEmailEdit] = React.useState(false)


    

    const deleteAlert = () => {
        Alert.alert('Confirm Delete Account', 'Are you sure you want to delete your Account (This cannot be undone)', [
            {
                text: 'Cancel',
                onPress: () => console.log('Canceled Delete'),
                style: 'cancel',
            },
            {
                text: 'Confirm',
                onPress: () => console.log('Account Deleted')
            }
        ])
    }


    return (
        <View style={{
            flex: 1,
            paddingLeft: "5%",
            paddingRight: "5%",


        }}>
            <View style={{ flex: 1.5, flexDirection: "row", alignItems: "flex-start", alignSelf: "flex-start", marginTop: "7%" }}>

                <View style={{ position: "relative", width: 82 }}>
                    <View style={{
                        backgroundColor: StylingConstants.highlightColor, position: 'absolute', zIndex: 1, elevation: 1, width: 85, height: 85, borderRadius: 85 / 2
                    }}></View>
                    <View style={{
                        backgroundColor: 'white', position: 'absolute', zIndex: 2, elevation: 2, width: 75, height: 75, borderRadius: 75 / 2, marginLeft: 5, marginRight: 5, marginTop: 5
                    }}></View>
                    <MaterialCommunityIcons name='account-circle-outline' color='black' size={95} style={{

                        position: 'absolute',
                        padding: 0,
                        zIndex: 3,
                        elevation: 3,
                        marginLeft: -5.5,
                        marginTop: -6
                    }}
                    />
                </View>


                <View style={{ flexDirection: "column", marginTop: "5%", marginLeft: "5%", }}>
                    <Text style={{ fontSize: StylingConstants.hugeFontSize, color: "black", alignSelf: "flex-start" }}>{userName}</Text>
                    <Text style={{ fontSize: StylingConstants.subFontSize, color: StylingConstants.darkFontColor, alignSelf: "flex-start" }}>{"thisismyemail@gmail.com"}</Text>
                </View>
            </View>






            <View style={{
                flex: 1,
            }}>
                <Text style={{
                    marginBottom: '2%',
                    textDecorationLine: 'underline',
                    fontSize: 20,
                    paddingBottom: '2%',

                }}>User Name</Text>

                <MaterialCommunityIcons name='pencil' color='black' size={45} style={{
                    fontSize: 40,
                    position: 'absolute',
                    top: '48%',
                    borderWidth: 1,
                    left: '3%',

                }}

                    onPress={() => setUserNameEdit(true)}
                />
                <MaterialCommunityIcons name='check-bold' color='black' size={45} style={{
                    fontSize: 40,
                    position: 'absolute',
                    top: '48%',
                    borderWidth: 1,
                    right: '3%',

                }}

                    onPress={() => setUserNameEdit(false)}
                />


                <TextInput placeholder={userName} editable={userNameEdit} placeholderTextColor='black' style={{
                    height: '60%',
                    borderWidth: 1,
                    width: '60%',
                    alignSelf: 'center',
                    marginRight: '1%',
                    paddingLeft: '4%',

                }} />

            </View>

            <View style={{
                flex: 2,
                marginTop: '8%',
            }}>
                <Text style={{
                    marginBottom: '2%',
                    textDecorationLine: 'underline',
                    fontSize: 20

                }}>
                    Email
                </Text>

                <MaterialCommunityIcons name='pencil' color='black' size={45} style={{
                    fontSize: 40,
                    position: 'absolute',
                    top: '20%',
                    borderWidth: 1,
                    left: '3%',

                }}

                    onPress={() => setEmailEdit(true)}
                />

                <MaterialCommunityIcons name='check-bold' color='black' size={45} style={{
                    fontSize: 40,
                    position: 'absolute',
                    top: '20%',
                    borderWidth: 1,
                    right: '3%',

                }}

                    onPress={() => setEmailEdit(false)}
                />

                <TextInput placeholder={email} editable={emailEdit} placeholderTextColor='black' style={{
                    height: '30%',
                    borderWidth: 1,
                    width: '60%',
                    alignSelf: 'center',
                    marginRight: '1%',
                    paddingLeft: '4%',
                }} />
            </View>

            <View style={{
                flex: 2,
                flexDirection: 'column'
            }}>
                <Pressable onPress={deleteAlert} style={{

                    borderWidth: 1,
                    width: '40%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    backgroundColor: 'red',
                    position: 'absolute',
                    height: '25%',

                }} >
                    <Text style={{

                        paddingTop: '8%',
                        color: 'white'

                    }}>Delete Account</Text>

                </Pressable>


            </View>


        </View >

    );
}

export { Settings }