import { View, Text, Button, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StylingConstants from "./StylingConstants";
import { useNavigation } from '@react-navigation/native'

export default function ChooseStorageOption(onSelect: any) {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flexDirection: "column", alignItems: "center", height: "100%", marginTop: 20 }}>
            <Text style={{ fontFamily: StylingConstants.defaultFontBold, color: "black", fontSize: StylingConstants.largeFontSize }}>Where would you like to store your data?</Text>
            <Pressable onPress={() =>{onSelect("cloud")}} style={{
                shadowColor: "gray",
                borderRadius: 1,
                shadowOffset: { width: 5, height: 5 },
                shadowRadius: 5,

                shadowOpacity: .22,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
                backgroundColor: "white",
                elevation: 8,
                zIndex: 2,
                alignSelf: "center", marginBottom: 20, marginTop: 20,
                flexDirection: "column",
                alignItems: "center"
            }}>
                <MaterialCommunityIcons name="cloud" color={StylingConstants.highlightColor} size={120}></MaterialCommunityIcons>
                <Text style={{ fontFamily: StylingConstants.defaultFontBold, color: "black", fontSize: StylingConstants.normalFontSize, textAlign: "center", marginBottom: 5 }}>Our Servers</Text>
                <Text style={{ fontFamily: StylingConstants.defaultFont, color: "black", fontSize: StylingConstants.subFontSize, textAlign: "center", marginBottom: 10 }}>Your data is stored and backed up in our protected servers. The only person it's shared with is you.</Text>
                <Button color={StylingConstants.highlightColor} title="View our Full Privacy Policy" onPress={() => navigation.navigate('Privacy Policy')}></Button>

            </Pressable>
            <Pressable onPress={() =>{onSelect("local")}} style={{
                shadowColor: "gray",
                borderRadius: 1,
                shadowOffset: { width: 5, height: 5 },
                shadowRadius: 5,

                shadowOpacity: .22,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
                backgroundColor: "white",
                elevation: 8,
                zIndex: 2,
                alignSelf: "center", marginBottom: 20, marginTop: 20,
                flexDirection: "column",
                alignItems: "center"
            }}>
                <MaterialCommunityIcons name="cellphone" color={StylingConstants.highlightColor} size={120}
                ></MaterialCommunityIcons>
                <Text style={{ fontFamily: StylingConstants.defaultFontBold, color: "black", fontSize: StylingConstants.normalFontSize, textAlign: "center", marginBottom: 5 }}>This Device</Text>
                <Text style={{ fontFamily: StylingConstants.defaultFont, color: "black", fontSize: StylingConstants.subFontSize, textAlign: "center" }}>Everything stays on your device and we never send data to our servers. Does limit server dependent features.</Text>

            </Pressable>
        </SafeAreaView>
    )
}