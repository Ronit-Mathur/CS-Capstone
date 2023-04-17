import * as React from 'react'
import { Text, View, SafeAreaView, RefreshControl,FlatList} from 'react-native'
import{checkForUnRatedTasks} from './homescreenhelpers'
import { StackActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import StylingConstants from './StylingConstants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import helpers from '../backend_server/lib/helpers';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RankTask } from './homescreenhelpers';

const navStack = createNativeStackNavigator()


function UnratedTaskNav (){

    return (
        <navStack.Navigator>
            <navStack.Screen name='UnRated' children={() => <UnratedTasks refresh={0} />} options={{headerShown:false}} />
            <navStack.Screen name='UnRated Rate' component={RankTask} options={{headerShown:false}}/>





        </navStack.Navigator>
    )
}







function UnratedTasks ({refresh}){
    const [list, setList] = React.useState([])
  
    
    
    const nav = useNavigation()

    async function getUnratedTasks() {
        var listCopy: never[] = []
        var list = await checkForUnRatedTasks()
        var convert = Object.values(list)

        convert.forEach(function(task){
            
            listCopy.push(task)
        })

        
        
        return listCopy 
        
    }
    
    useFocusEffect(React.useCallback(() => {
        const check = async () => {
          setList(await getUnratedTasks())
        }
        check()
        
      }, [refresh]))
    
    
     
    return (
        <SafeAreaView>
              <FlatList
        data={list}
        renderItem={({ item }) => TaskWidget({ item }, nav)}
        style={{
          flexGrow: 1,
          marginBottom: '10%',
          marginTop: '5%',
          shadowOpacity: 1,
          backgroundColor:'white'
        }}
        contentContainerStyle={{

        }}
       
      />

        </SafeAreaView>
    );
}

function TaskWidget({ item }: any, Nav: any) {
    var bool = false
    if (item.summary.length > 24) {
      bool = true
    } else {
      bool = false
    }
  

  
  
    return (<View style={{ marginLeft: "2%", marginRight: "2%", marginBottom: 5, borderLeftWidth: 3, borderColor: StylingConstants.highlightColor, flexDirection: "row", justifyContent: "space-between", alignItems: "center",  }}>
      <View style={{ marginLeft: "2%" }}>
        <Text style={{ color: 'black', fontWeight: "bold", fontSize: StylingConstants.subFontSize }}>{helpers.toTitleCase(item.summary.substring(0, 25))} {bool ? '...' : ''}</Text>
        <Text style={{ color: 'black', fontSize: StylingConstants.tinyFontSize }}>Start Time: {item.startTime}</Text>
        <Text style={{ color: 'black', fontSize: StylingConstants.tinyFontSize }}>End Time: {item.endTime}</Text>
        <Text style={{ color: 'black', fontSize: StylingConstants.tinyFontSize }}>Location: {item.location}</Text>
      </View>
      <MaterialCommunityIcons name='chevron-right' color="white" size={40} style={{
        backgroundColor: StylingConstants.highlightColor,
        borderRadius: 8,
      }}
  
        onPress={() => Nav.navigate('UnRated Rate', { task: { item } })}
      />
    </View>)
  }

export default UnratedTaskNav