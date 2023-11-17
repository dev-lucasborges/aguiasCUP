import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue, getDatabase, remove } from "firebase/database";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButton from "../components/GoBackButton";

const Jogadores = ({ route }) => {
  const { teamId, tournamentId } = route.params || {};
  const [jogadores, setJogadores] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const jogadoresRef = ref(
      db,
      `torneios/${tournamentId}/times/${teamId}/jogadores`
    );

    const unsubscribe = onValue(jogadoresRef, (snapshot) => {
      if (snapshot.exists()) {
        const jogadoresData = snapshot.val();
        const jogadoresList = Object.keys(jogadoresData).map((key) => ({
          id: key,
          ...jogadoresData[key],
        }));

        setJogadores(jogadoresList);
      }
    });

    return () => unsubscribe();
  }, [teamId, tournamentId]);

  const handleAddPlayer = () => {
    navigation.navigate("CriarJogador", { teamId, tournamentId });
  };

  const handleDeletePlayer = async (playerId) => {
    // Confirmar antes de excluir
    Alert.alert(
      "Excluir Jogador",
      "Você tem certeza que deseja excluir este jogador?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            const db = getDatabase();
            await remove(
              ref(
                db,
                `torneios/${tournamentId}/times/${teamId}/jogadores/${playerId}`
              )
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E67330" }}>
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
            Jogadores
          </Text>
        </View>
        <FlatList
          data={jogadores}
          style={{ marginBottom: 300 }}
          keyExtractor={(item) => item.id}
          initialNumToRender={9}
          renderItem={({ item }) => (
            <TouchableOpacity onLongPress={() => handleDeletePlayer(item.id)}>
              <View
                style={{
                  backgroundColor: "#FFF",
                  marginVertical: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  marginHorizontal: 30,
                  borderRadius: 22,
                }}
              >
                {item.foto && (
                  <Image
                    source={{ uri: item.foto }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 140,
                      marginHorizontal: 10,
                    }}
                  />
                )}
                <View>
                  <Text style={{ color: "royalblue", fontSize: 16 }}>
                    {item.numeroCamisa}.{" "}
                    <Text style={{ color: "#000", fontWeight: 500 }}>
                      {item.nome}
                    </Text>
                  </Text>
                  <Text style={{ color: "#494953", fontWeight: 600 }}>
                    {item.peso}kg - {item.altura}cm
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={handleAddPlayer}>
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
                  Adicionar Jogador
                </Text>
              </View>
            </TouchableOpacity>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Jogadores;
