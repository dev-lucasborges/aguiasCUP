// Panel.js
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue, remove, getDatabase } from "firebase/database";
import GoBackButton from "../components/GoBackButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";

const Panel = () => {
  const navigation = useNavigation();
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const tournamentsRef = ref(db, "torneios");

    const unsubscribe = onValue(tournamentsRef, (snapshot) => {
      const tournamentsList = [];

      snapshot.forEach((childSnapshot) => {
        const tournamentData = childSnapshot.val();
        if (tournamentData && tournamentData.nome) {
          tournamentsList.push({
            id: childSnapshot.key,
            ...tournamentData,
          });
        }
      });

      setTournaments(tournamentsList);
    });

    // Desmontar o listener quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  const deleteTournament = (tournamentId) => {
    const db = getDatabase();
    remove(ref(db, `torneios/${tournamentId}`))
      .then(() => console.log("Torneio excluído com sucesso."))
      .catch((error) => console.error("Erro ao excluir torneio:", error));
  };

  const confirmDelete = (tournamentId) => {
    Alert.alert(
      "Excluir Torneio",
      "Tem certeza que deseja excluir este torneio?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => deleteTournament(tournamentId),
        },
      ]
    );
  };

  const handleCreateTournament = () => {
    navigation.navigate("CreateTournament");
  };

  const handleTournamentPress = (tournamentId) => {
    navigation.navigate("Times", { tournamentId });
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#E67330", flex: 1 }}>
      <View>
        <GoBackButton
          onPress={() => navigation.goBack()}
          bgColor="bgColorWhite"
        />
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 200,
          }}
        >
          <Text style={{ fontSize: 35, color: "#FFF", fontWeight: 700 }}>
            Águias CUP's
          </Text>
        </View>

        <View style={{ paddingHorizontal: 30 }}>
          <Text style={{ fontWeight: 600 }}>Torneios</Text>
          <TouchableOpacity onPress={handleCreateTournament}>
            <View
              style={{
                backgroundColor: "#FFF",
                paddingHorizontal: 30,
                paddingVertical: 23,
                borderRadius: 20,
                marginVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                borderWidth: 1,
              }}
            >
              <Text>Novo Torneio</Text>
              <FontAwesomeIcon icon={faPlus} />
            </View>
          </TouchableOpacity>
          <FlatList
            data={tournaments}
            style={{ marginBottom: 300 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleTournamentPress(item.id)}
                onLongPress={() => confirmDelete(item.id)}
              >
                <View
                  style={{
                    backgroundColor: "#FFF",
                    paddingHorizontal: 30,
                    paddingVertical: 23,
                    borderRadius: 20,
                    marginVertical: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
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
