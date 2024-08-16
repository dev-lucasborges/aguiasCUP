// CreateTournamentForm.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { ref, push, set } from "firebase/database";
import { getDatabase } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButton from "./GoBackButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ActivityIndicator } from "react-native";

const CreateTournamentForm = () => {
  const navigation = useNavigation();
  const [tournamentName, setTournamentName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleCreateTournament = async () => {
    setLoading(true);
    const db = getDatabase();
    const tournamentsRef = ref(db, "torneios");

    const newTournamentRef = push(tournamentsRef);
    set(newTournamentRef, {
      nome: tournamentName,
      dataInicio: startDate,
      dataFim: endDate,
    });

    setTournamentName("");
    setStartDate("");
    setEndDate("");

    navigation.navigate("Panel");
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E67330" }}>
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
          <Text style={{ fontSize: 35, color: "#FFF", fontWeight: 700 }}>
            Criar Torneio
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View>
            <View
              style={{
                backgroundColor: "#FFF",
                padding: 17,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#494953",
                marginVertical: 4,
                marginTop: 15,
              }}
            >
              <TextInput
                value={tournamentName}
                onChangeText={(text) => setTournamentName(text)}
                placeholder="Digite o nome do torneio"
              />
            </View>

            <View
              style={{
                backgroundColor: "#FFF",
                padding: 17,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#494953",
                marginVertical: 4,
                marginTop: 15,
              }}
            >
              <TextInput
                value={startDate}
                onChangeText={(text) => setStartDate(text)}
                placeholder="Digite a data de início"
              />
            </View>

            <View
              style={{
                backgroundColor: "#FFF",
                padding: 17,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#494953",
                marginVertical: 4,
                marginTop: 15,
              }}
            >
              <TextInput
                value={endDate}
                onChangeText={(text) => setEndDate(text)}
                placeholder="Digite a data de fim"
              />
            </View>

            <TouchableOpacity
              onPress={handleCreateTournament}
              disabled={loading}
            >
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
                  <Text style={{ fontWeight: 600 }}>Criar</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default CreateTournamentForm;
