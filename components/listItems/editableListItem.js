import {View, Text} from "react-native";

export default function EditableListItem(text){
    return(
        <View style={{
            borderBottomWidth: 2,
            borderTopWidth: 1,
            borderColor: "black"
        }}>
            <Text>{text}</Text>

        </View>
    )
}