// Em Times.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ref,
  get,
  child,
  getDatabase,
  onValue,
  remove,
} from "firebase/database";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButton from "../components/GoBackButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";

const Times = ({ route }) => {
  const navigation = useNavigation();
  const { tournamentId } = route.params || {};
  const [teams, setTeams] = useState([]);
  const [tournamentName, setTournamentName] = useState("");

  const mapeamentoDeCores = {
    azul: "blue",
    vermelho: "red",
    amarelo: "yellow",
    laranja: "orange",
    cinza: "gray",
    verde: "green",
    branco: "white",
    preto: "black",
    lima: "lime",
    "azul-claro": "lightblue",
    rosa: "pink",
    creme: "beige",
  };

  useEffect(() => {
    console.log("Tournament ID:", tournamentId);
    if (!tournamentId) {
      console.error("Tournament ID is undefined.");
      return;
    }

    const fetchPlayers = async (teamId) => {
      const db = getDatabase();
      const playersRef = ref(
        db,
        `torneios/${tournamentId}/times/${teamId}/jogadores`
      );
      const playersSnapshot = await get(playersRef);

      const playersList = [];
      playersSnapshot.forEach((childSnapshot) => {
        playersList.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      return playersList;
    };

    const fetchTeams = () => {
      const db = getDatabase();
      const teamsRef = ref(db, `torneios/${tournamentId}/times`);

      const unsubscribe = onValue(teamsRef, (snapshot) => {
        if (snapshot.exists()) {
          const teamsList = [];
          snapshot.forEach((childSnapshot) => {
            teamsList.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            });
          });
          setTeams(teamsList);
        }
      });

      // Desmontar o listener quando o componente é desmontado
      return () => unsubscribe();
    };

    const fetchTournamentName = async () => {
      try {
        const db = getDatabase();
        const tournamentRef = ref(db, `torneios/${tournamentId}/nome`);
        const tournamentSnapshot = await get(tournamentRef);

        if (tournamentSnapshot.exists()) {
          setTournamentName(tournamentSnapshot.val());
        }
      } catch (error) {
        console.error("Erro ao buscar o nome do torneio:", error.message);
      }
    };

    if (tournamentId) {
      fetchTeams();
      fetchTournamentName();
    }
  }, [tournamentId]);

  const handleCreateTeam = () => {
    navigation.navigate("CreateTeam", { tournamentId });
  };

  const handleTeamPress = (teamId) => {
    navigation.navigate("Jogadores", { teamId, tournamentId });
  };

  const handleOrganizeMatch = () => {
    console.log("Organizar partida");
    navigation.navigate("OrganizarJogo", { tournamentId });
  };

  const deleteTeam = (teamId) => {
    Alert.alert(
      "Excluir Time",
      "Você tem certeza que deseja excluir este time?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            const db = getDatabase();
            const teamRef = ref(db, `torneios/${tournamentId}/times/${teamId}`);
            remove(teamRef)
              .then(() => {
                alert("Time excluído com sucesso");
              })
              .catch((error) => {
                console.error("Erro ao excluir time:", error);
              });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#E67330", flex: 1 }}>
      <View>
        <GoBackButton
          onPress={() => navigation.goBack()}
          bgColor="bgColorWhite"
        />

        <View style={{ padding: 30 }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 200,
            }}
          >
            <Text
              style={{
                fontSize: 35,
                color: "#FFF",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {tournamentName}
            </Text>
          </View>

          <Text style={{ fontWeight: 600 }}>Times</Text>

          <TouchableOpacity onPress={handleCreateTeam}>
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
              <Text>Novo Time</Text>
              <FontAwesomeIcon icon={faPlus} />
            </View>
          </TouchableOpacity>
          <FlatList
            data={teams}
            keyExtractor={(item) => item.id}
            style={{ marginBottom: 5000 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleTeamPress(item.id)}
                onLongPress={() => deleteTeam(item.id)}
              >
                <View
                  style={{
                    backgroundColor: "#FFF",
                    padding: 10,
                    borderRadius: 17,
                    marginVertical: 5,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: 30, // Tamanho do círculo
                      width: 30, // Tamanho do círculo
                      borderRadius: 30, // Metade da altura e largura para torná-lo um círculo
                      backgroundColor: mapeamentoDeCores[item.cor] || "#000",
                      marginEnd: 10,
                      borderWidth: 1,
                    }}
                  />
                  <Text
                    style={{
                      fontWeight: 600,
                      color: "#000",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.nome}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <View>
                <TouchableOpacity onPress={handleOrganizeMatch}>
                  <View
                    style={{
                      backgroundColor: "#060610",
                      padding: 15,
                      borderRadius: 17,
                      alignItems: "center",
                      marginVertical: 20,
                      marginHorizontal: 30,
                    }}
                  >
                    <Text style={{ fontWeight: 600, color: "#FFF" }}>
                      Organizar Jogo
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Times;
