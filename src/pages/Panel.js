// Panel.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ref, get, getDatabase } from 'firebase/database';
import GoBackButton from '../components/GoBackButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'

const Panel = () => {
  const navigation = useNavigation();
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const db = getDatabase();
        const tournamentsRef = ref(db, 'torneios');
        const tournamentsSnapshot = await get(tournamentsRef);
  
        if (tournamentsSnapshot.exists()) {
          const tournamentsList = [];
  
          tournamentsSnapshot.forEach((childSnapshot) => {
            const tournamentData = childSnapshot.val();
  
            if (tournamentData && tournamentData.nome) {
              tournamentsList.push({
                id: childSnapshot.key,
                ...tournamentData,
              });
            }
          });
  
          console.log(tournamentsList);
          setTournaments(tournamentsList);
        } else {
          console.log('Nenhum torneio encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar torneios:', error);
      }
      
    };


  
    fetchTournaments();
  }, []);

  const handleCreateTournament = () => {
    navigation.navigate('CreateTournament');
  };

  const handleTournamentPress = (tournamentId) => {
    navigation.navigate('Times', { tournamentId });
  };

  return (
      <SafeAreaView style={{backgroundColor:"#E67330", flex: 1}}>
        <View>
        <GoBackButton
            onPress={() => navigation.goBack()} 
            bgColor="bgColorWhite"
            />
        <View style={{alignItems:"center", justifyContent: "center", height: 200}}>

          <Text style={{fontSize: 35, color: "#FFF", fontWeight: 700}}>Águias CUP's</Text>
        </View>

        <View style={{paddingHorizontal: 30}}>
        <Text style={{fontWeight: 600}}>Torneios</Text>
          <TouchableOpacity onPress={handleCreateTournament}>
              <View style={{backgroundColor: "#FFF", paddingHorizontal: 30, paddingVertical: 23, borderRadius: 20, marginVertical: 10, flexDirection: "row", justifyContent: "space-between", borderWidth: 1}}>
                <Text>Novo Torneio</Text>
                <FontAwesomeIcon icon={faPlus} />
              </View>
              
            </TouchableOpacity>
            <FlatList
              data={tournaments}
              style={{marginBottom: 300}}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                  
                    <TouchableOpacity onPress={() => handleTournamentPress(item.id)}>
                        <View style={{backgroundColor: "#FFF", paddingHorizontal: 30, paddingVertical: 23, borderRadius: 20, marginVertical: 10, flexDirection: "row", justifyContent: "space-between"}}>
                          <Text>{item.nome}</Text>
                          <FontAwesomeIcon icon={faChevronRight} />
                        </View>
                    </TouchableOpacity>
                  
              )}
            />
        </View>
          
        </View>
      </SafeAreaView>
  );
};

export default Panel;
