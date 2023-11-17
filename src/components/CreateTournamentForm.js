// CreateTournamentForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ref, push, set } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateTournamentForm = () => {
  const navigation = useNavigation();
  const [tournamentName, setTournamentName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreateTournament = async () => {
    // Obtenha uma referência para o nó 'torneios' no banco de dados
    const db = getDatabase();
    const tournamentsRef = ref(db, 'torneios');

    // Crie um novo torneio com os dados fornecidos
    const newTournamentRef = push(tournamentsRef);
    set(newTournamentRef, {
      nome: tournamentName,
      dataInicio: startDate,
      dataFim: endDate,
    });

    // Limpe os campos após a criação do torneio
    setTournamentName('');
    setStartDate('');
    setEndDate('');

    navigation.navigate('Panel');
    
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#E67330", padding: 30}}>
      <View>
        <Text>Nome do Torneio:</Text>
        <TextInput
          value={tournamentName}
          onChangeText={(text) => setTournamentName(text)}
          placeholder="Digite o nome do torneio"
        />

        <Text>Data de Início:</Text>
        <TextInput
          value={startDate}
          onChangeText={(text) => setStartDate(text)}
          placeholder="Digite a data de início"
        />

        <Text>Data de Fim:</Text>
        <TextInput
          value={endDate}
          onChangeText={(text) => setEndDate(text)}
          placeholder="Digite a data de fim"
        />

        <TouchableOpacity onPress={handleCreateTournament}>
          <View style={{backgroundColor: "#FFF", padding: 15, borderRadius: 17, alignItems: "center", marginVertical: 20}}>
            <Text style={{fontWeight: 600}}>Criar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateTournamentForm;
