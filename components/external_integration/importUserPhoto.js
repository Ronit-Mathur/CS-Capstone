import { View,Image } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ListButton from "../listItems/listButton";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import serverHandler from "../../lib/server/serverHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useState} from "react";
import RoundImage from "../RoundImage";


export default function ImportUserPhotoScreen() {

    const [base64Photo, SetBase64Photo] = useState(null);

    async function ImportPhoto(){
        const result = await launchImageLibrary({"mediaType": "photo", "includeBase64": true});
        if(result.didCancel){
            return;
        }

        var selected = result.assets[0];
        await AsyncStorage.setItem(serverHandler.current.userState.username + "$photo", selected.base64);  
        SetBase64Photo(selected.base64);

    }

    var photo =  (<MaterialCommunityIcons name='account-circle-outline' color='black' size={200} style={{
        marginTop:"2%"
    }}


        onPress={() => navigation.navigate('Settings')}
    />)

    if(base64Photo != null){
        photo = RoundImage({uri:"data:image/png;base64," + base64Photo}, 200);
    }


    return (
        <View style={{flexDirection:"column", alignItems:"center"}}>  
            {photo}
            <ScrollView>
                {ListButton("import", "Import Photo From Gallery", ImportPhoto)}
            </ScrollView>
        </View>
    )
}


/**
 * 
 * @param {*} callback a callback which takes a base64 string of the image or null if the user does not have an image
 */
export function GetUserPhoto(callback){
    AsyncStorage.getItem(serverHandler.current.userState.username + "$photo", (result) =>{
        callback(result);
    });
}