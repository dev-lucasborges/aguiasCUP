// Login.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles";
import GoBackButton from "../components/GoBackButton";
import { StatusBar } from "expo-status-bar";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      navigation.navigate("Panel");
    } catch (error) {
      alert("Erro ao entrar. Verifique suas informações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={{ backgroundColor: "#000" }}>
        <GoBackButton
          onPress={() => navigation.goBack()}
          bgColor="bgColorWhite"
        />
        <View>
          <Text
            style={{
              color: "#FFF",
              fontWeight: 700,
              fontSize: 40,
              marginLeft: 30,
              marginTop: 30,
            }}
          >
            Olá, Manager!
          </Text>
          <Text
            style={{
              color: "#727380",
              fontWeight: 500,
              fontSize: 25,
              marginLeft: 30,
            }}
          >
            Insira suas informações para continuar.
          </Text>
        </View>
      </SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "#000" }}
      >
        <SafeAreaView
          style={{
            backgroundColor: "#000",
            color: "#FFF",
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ width: "90%" }}>
            <TextInput
              style={{
                padding: 15,
                borderRadius: 20,
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#494953",
                color: "#FFF",
                marginBottom: 15,
              }}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#AAA"
              autoCapitalize="none"
            />

            <TextInput
              style={{
                padding: 15,
                borderRadius: 20,
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "#494953",
                color: "#FFF",
              }}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              placeholder="Digite sua senha"
              placeholderTextColor="#AAA"
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              <View
                style={{
                  backgroundColor: "#FFF",
                  padding: 15,
                  borderRadius: 17,
                  alignItems: "center",
                  marginVertical: 20,
                }}
              >
                <Text style={{ fontWeight: 600 }}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text style={{ fontWeight: 600 }}>Entrar</Text>
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Login;
