
import * as React from 'react'
import { View, Text, TextInput, Pressable, Button } from 'react-native'
import { createUser, initLocalUser } from '../lib/server/users'
import ChooseStorageOption from './ChooseStorageOption';


const CreateAccount = ({ signIn }: any) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [stage, setStage] = React.useState("storageOption");

  const handleSignUp = async () => {
    const didSignUp = await createUser(username, password, email)
    if (didSignUp) {
      signIn(username)
    } else {
      console.log('Unable to Create User')
    }

  }

  var component = <View></View>
  if (stage == "storageOption") {
    component = ChooseStorageOption(async (choice: string) => {
      if (choice == "cloud") {
        setStage("createAccount");
      }
      if (choice == "local") {
        await initLocalUser();
        signIn()
      }
    });
  }
  else if (stage == "createAccount") {
    component = (<View style={{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 20, marginTop: '50%'
    }}>
      <TextInput
        style={{
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
          width: '100%',
        }}
        placeholder="Username"
        value={username}
        autoCapitalize='none'
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={{
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
          width: '100%',
        }}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        autoCapitalize='none'
      />
      <TextInput
        style={{
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
          width: '100%',
        }}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
        autoCapitalize='none'
      />
      <Button
        title="Sign Up"
        onPress={handleSignUp}
      />
    </View>
    )
  }

  return (
    <View style={{}}>
      {component}

    </View>

  );
}

export { CreateAccount }