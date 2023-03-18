import * as React from 'react'
import {View, Text, TextInput, Button} from 'react-native'
import {loginUser} from '../lib/server/users'




const SignInScreen = ({signIn}:any, {testR}:any)=>{
    const[userName, setUserName] = React.useState('')
    const[password, setPassword] = React.useState('')
    
    {testR}


    return(

      //Outter Most View
        <View style={{
            flex:1,
            justifyContent:'center',
            alignContent:'center',
            alignItems:'center',
            backgroundColor:'#abf9ff', 
            
            
        }}>
          {/* Middle Container Box */}
            <View style={{
                flex:1,
                width:'80%',
                maxHeight:'50%',
                borderRadius:40,
                backgroundColor:'white',
                shadowOpacity:.5,
                shadowColor:'#386a6e',
                shadowRadius:10,
                shadowOffset: {width:-3, height:0}
                
            }}>
                <View style={{
                    flex:1,
                    maxHeight:'20%',
                    alignItems:'center',
                    
                }}>
                    <Text style={{
                        flex:1,
                        textDecorationLine:'underline',
                        paddingTop:'13%',
                        fontSize:25
                    }}>Sign In</Text>
                </View >

                <View style={{
                    flex: 3,
                    maxHeight:'40%',
                    margin:'5%',
                }}>
                    <View style={{
                        flex:1,
                        maxHeight:'40%'
                    }}>
                        <Text style={{
                            flex:1,
                        }}>UserName:</Text>
                        <TextInput style={{
                            borderWidth:1,
                            flex:1,
                            paddingLeft:'3%',
                        }} 
                        onChangeText={setUserName} />
                    </View>

                    <View style={{
                        flex:1,
                        maxHeight:'50%'

                    }}>
                          <Text style={{
                            flex:1,
                            paddingTop:'5%',
                            
                            paddingBottom:'1%',
                        }}>Password:</Text>
                        <TextInput style={{
                            borderWidth:1,
                            flex:1,
                            maxHeight:'51%',
                            paddingLeft:'3%',
                            
                        }} 
                     onChangeText={setPassword} 
                     secureTextEntry={true}/>
                    </View>

                </View>
                
                {/* Sign In Button */}

                <View style={{
                    flex: 1,
                    justifyContent:'center', 
                    alignContent:'space-between'
                }}>
                    <Button title='Sign In' onPress={async() =>{
                        const validLog = await loginUser(userName,password)
                        console.log(validLog)
                        if(validLog){
                            signIn()
                        }
                        else{
                            console.log('Invalid Login')
                        }
                    }} />
                    <Button title='Create Account' onPress={() => console.log('PRESSED')} />
                </View>

            </View>
            
        </View>
    );
}

export {SignInScreen}

