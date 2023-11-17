import * as React from 'react';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { auth } from './firebaseConfig';
import CreateTournamentForm from './src/components/CreateTournamentForm';

// custom components
import Blob from './src/components/Blob';
import Button from "./src/components/Button"

// pages
import Login from "./src/pages/Login";
import Live from './src/pages/Live';
import Panel from "./src/pages/Panel";
import Times from "./src/pages/Times";
import CreateTeam from './src/components/CreateTeam';
import Jogadores from './src/pages/Jogadores';
import CriarJogador from './src/components/CriarJogador';
import OrganizarJogo from './src/pages/OrganizarJogo';
import Partida from './src/pages/Partida'

const Stack = createNativeStackNavigator();

function GetStarted({navigation}){
  return(
    <>
    <SafeAreaView style={{ backgroundColor: "#E67330", flex: 1 }}>
      <Blob />
      <View style={styles.container}>
        <Button
          text="Assistir ao vivo"
          bgColor="bgColorWhite"
          onPress={() => navigation.navigate('Live')} />
        <Button
          text="Entrar"
          bgColor="bgColorDark"
          onPress={() => navigation.navigate('Login')} />
      </View>
    </SafeAreaView>
    </>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GetStarted">
        <Stack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} />
        <Stack.Screen name="Live" component={Live} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Panel" component={Panel} options={{ headerShown: false }}/>
        <Stack.Screen name="CreateTournament" component={CreateTournamentForm} options={{ headerShown: false }}/>
        <Stack.Screen name="Times" component={Times} options={{ headerShown: false }}/>
        <Stack.Screen name="CreateTeam" component={CreateTeam} options={{ headerShown: false }}/>
        <Stack.Screen name="Jogadores" component={Jogadores} options={{ headerShown: false }}/>
        <Stack.Screen name="CriarJogador" component={CriarJogador} options={{ headerShown: false }}/>
        <Stack.Screen name="OrganizarJogo" component={OrganizarJogo} options={{ headerShown: false }}/>
        <Stack.Screen name="Partida" component={Partida} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
