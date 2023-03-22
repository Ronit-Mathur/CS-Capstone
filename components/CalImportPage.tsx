import * as React from 'react';
import {View, TextInput, Text, Pressable, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImportCalendar from './external_integration/importCalendar';

function CalImportPage() {
    return(
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
            <ImportCalendar></ImportCalendar>
        </SafeAreaView>
    );
}
export default CalImportPage;