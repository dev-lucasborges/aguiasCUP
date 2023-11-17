import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, push, set, getDatabase } from "firebase/database";
import { Picker } from "@react-native-picker/picker";
import styles from "../../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButton from "../components/GoBackButton";

const CreateTeam = ({ route }) => {
  const navigation = useNavigation();
  const { tournamentId } = route.params || {};
  const [teamName, setTeamName] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(false);
  const leagues = ["AABB", "ALFA"];

  const renderColorPicker = () => {
    if (selectedLeague === "AABB") {
      return (
        <View
          style={{
            backgroundColor: "#FFF",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#494953",
            marginVertical: 4,
            marginTop: 10,
          }}
        >
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
        </View>
      );
    } else if (selectedLeague === "ALFA") {
      return (
        <View
          style={{
            backgroundColor: "#FFF",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#494953",
            marginVertical: 4,
            marginTop: 10,
          }}
        >
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
        </View>
      );
    }
  };

  const handleCreateTeam = async () => {
    setLoading(true);
    const db = getDatabase();
    const teamsRef = ref(db, `torneios/${tournamentId}/times`);
    const newTeamRef = push(teamsRef);

    await set(newTeamRef, {
      nome: `${selectedLeague} - ${selectedColor}`,
      liga: selectedLeague,
      cor: selectedColor,
    });

    navigation.goBack();
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#E67330", flex: 1 }}>
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
          Criar Time
        </Text>
      </View>

      <View style={{ padding: 30 }}>
        <View
          style={{
            backgroundColor: "#FFF",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#494953",
            marginVertical: 4,
            marginTop: 15,
          }}
        >
          <Picker
            selectedValue={selectedLeague}
            onValueChange={(itemValue) => setSelectedLeague(itemValue)}
          >
            <Picker.Item label="Selecione a Liga" value="" />
            {leagues.map((league) => (
              <Picker.Item key={league} label={league} value={league} />
            ))}
          </Picker>
        </View>

        {renderColorPicker()}

        <TouchableOpacity onPress={handleCreateTeam} disabled={loading}>
          <View
            style={{
              backgroundColor: "#FFF",
              padding: 15,
              borderRadius: 17,
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={{ fontWeight: 600 }}>Criar Time</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateTeam;
