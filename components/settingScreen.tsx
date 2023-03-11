import * as React from 'react';
import {View, TextInput, Text, Pressable, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';








function Settings (){
    
    const[userName, setUserName] = React.useState('PlaceHolder')
    const[userNameEdit, setUserNameEdit] = React.useState(false)
    const[email,setEmail] = React.useState('example@gmail.com')
    const[emailEdit,setEmailEdit] = React.useState(false)

    const deleteAlert = () =>{
        Alert.alert('Confirm Delete Account', 'Are you sure you want to delete your Account (This cannot be undone)',[
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
            flex:1,
            margin:'5%',
        }}>

            <View style={{
                flex:2,
                alignItems:'center',
                marginTop:'2%',
            }}>
                <MaterialCommunityIcons name ='account-circle-outline' color='black' size={150} style={{
          flex:1,
        }} 
          />
            </View>

            <View style={{
                flex:1,
            }}>
                <Text style={{
                    marginBottom:'2%',
                    textDecorationLine:'underline',
                    fontSize:20, 
                    paddingBottom:'2%',
                    
                }}>User Name</Text>

               <MaterialCommunityIcons name ='pencil' color='black' size={45} style={{
                   fontSize:40,
                   position:'absolute',
                   top:'48%',
                   borderWidth:1,
                   left:'3%',
                   
                }} 
       
        onPress={()=> setUserNameEdit(true)}
         />
            <MaterialCommunityIcons name ='check-bold' color='black' size={45} style={{
                   fontSize:40,
                   position:'absolute',
                   top:'48%',
                   borderWidth:1,
                   right:'3%',
                   
                }} 
       
        onPress={()=> setUserNameEdit(false)}
         />


                <TextInput placeholder={userName} editable={userNameEdit} placeholderTextColor='black' style={{
                   height:'60%',
                    borderWidth:1,
                    width:'60%',
                    alignSelf:'center',
                    marginRight:'1%', 
                    paddingLeft:'4%',
                    
                }} />

            </View>

            <View style={{
                flex:2,
                marginTop:'8%',
            }}>
                <Text style={{
                    marginBottom:'2%',
                    textDecorationLine:'underline',
                    fontSize:20
                    
                }}>
                    Email
                </Text>

                <MaterialCommunityIcons name ='pencil' color='black' size={45} style={{
                   fontSize:40,
                   position:'absolute',
                   top:'20%',
                   borderWidth:1,
                   left:'3%',
                   
                }} 
       
        onPress={()=> setEmailEdit(true)}
         />

         <MaterialCommunityIcons name ='check-bold' color='black' size={45} style={{
                   fontSize:40,
                   position:'absolute',
                   top:'20%',
                   borderWidth:1,
                   right:'3%',
                   
                }} 
       
        onPress={()=> setEmailEdit(false)}
         />

                <TextInput placeholder={email} editable={emailEdit} placeholderTextColor='black' style={{
                   height:'30%',
                   borderWidth:1,
                   width:'60%',
                   alignSelf:'center',
                   marginRight:'1%', 
                   paddingLeft:'4%',
                }} />
            </View>
            
            <View style={{
                flex:2,
                flexDirection:'column'
            }}>
                <Pressable  onPress={deleteAlert} style={{
                    
                    borderWidth:1,
                    width:'40%',
                    alignSelf:'center',
                    alignItems:'center',
                    backgroundColor:'red',
                    position:'absolute',
                    height:'25%',
                    
                }} >
                    <Text style={{
                        
                        paddingTop:'8%',
                        color:'white'
                        
                    }}>Delete Account</Text>

                </Pressable>
               

            </View>


        </View>

    );
}

export {Settings}