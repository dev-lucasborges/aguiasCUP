import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, push, set, getDatabase } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';
import styles from "../../styles"
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateTeam = ({ route }) => {
    const navigation = useNavigation();
    const { tournamentId } = route.params || {};
  const [teamName, setTeamName] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const leagues = ['AABB', 'ALFA'];

  const renderColorPicker = () => {
    if (selectedLeague === 'AABB') {
      return (
        <Picker
          selectedValue={selectedColor}
          onValueChange={(itemValue) => setSelectedColor(itemValue)}
        >
          <Picker.Item label="Azul" value="azul" />
          <Picker.Item label="Vermelho" value="vermelho" />
          <Picker.Item label="Amarelo" value="amarelo" />
          <Picker.Item label="Laranja" value="laranja" />
          <Picker.Item label="Cinza" value="cinza" />
          <Picker.Item label="Verde" value="verde" />
        </Picker>
      );
    } else if (selectedLeague === 'ALFA') {
      return (
        <Picker
          selectedValue={selectedColor}
          onValueChange={(itemValue) => setSelectedColor(itemValue)}
        >
          <Picker.Item label="Branco" value="branco" />
          <Picker.Item label="Preto" value="preto" />
          <Picker.Item label="Lima" value="lima" />
          <Picker.Item label="Azul Claro" value="azul-claro" />
          <Picker.Item label="Rosa" value="rosa" />
          <Picker.Item label="Creme" value="creme" />
        </Picker>
      );
    }
  };

  const handleCreateTeam = async () => {
    const db = getDatabase();
    const teamsRef = ref(db, `torneios/${tournamentId}/times`);
    const newTeamRef = push(teamsRef);

    await set(newTeamRef, {
      nome: teamName,
      liga: selectedLeague,
      cor: selectedColor,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={{backgroundColor: "#E67330", flex: 1}}>

      <View>
        <Text>Criar Time</Text>
        <TextInput
          placeholder="Nome do Time"
          value={teamName}
          onChangeText={(text) => setTeamName(text)}
        />

        <Picker
          selectedValue={selectedLeague}
          onValueChange={(itemValue) => setSelectedLeague(itemValue)}
        >
          <Picker.Item label="Selecione a Liga" value="" />
          {leagues.map((league) => (
            <Picker.Item key={league} label={league} value={league} />
          ))}
        </Picker>

        {renderColorPicker()}

        <Button title="Criar Time" onPress={handleCreateTeam} />
      </View>
          
    </SafeAreaView>
  );
};

export default CreateTeam;
