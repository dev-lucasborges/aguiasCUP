import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, push, set, getDatabase } from "firebase/database";
import {
  getStorage,
  ref as firebaseRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import GoBackButton from "./GoBackButton";
import ImageResizer from "react-native-image-resizer";

const CriarJogador = ({ route }) => {
  const navigation = useNavigation();
  const { tournamentId, teamId } = route.params;
  const [nomeJogador, setNomeJogador] = useState("");
  const [numeroCamisa, setNumeroCamisa] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [imageUri, setImageUri] = useState("https://via.placeholder.com/200");
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Desculpe, precisamos de permissões para acessar suas fotos!");
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Desculpe, precisamos de permissões de câmera para fazer isso funcionar!"
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7, // Reduzir a qualidade
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const resizedImage = await resizeImage(result.assets[0].uri);
      setImageUri(resizedImage.uri);
    } else {
      console.log("Seleção de imagem cancelada ou nenhuma imagem selecionada");
    }
  };

  const resizeImage = async (uri) => {
    try {
      const resized = await ImageResizer.createResizedImage(
        uri,
        800,
        600,
        "JPEG",
        80
      );
      return resized;
    } catch (error) {
      console.error("Erro ao redimensionar a imagem:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("imageUri atualizado: ", imageUri);
  }, [imageUri]);

  const uploadImageToFirebase = async (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = async () => {
        const blob = xhr.response;

        const storage = getStorage();
        const storageRef = firebaseRef(
          storage,
          `jogadores/${new Date().toISOString()}`
        );
        const snapshot = await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(snapshot.ref);
        resolve(downloadURL);
      };
      xhr.onerror = (e) => {
        console.error("Erro no XMLHttpRequest: ", e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const handleCreatePlayer = async () => {
    setLoading(true);
    if (!nomeJogador || !numeroCamisa) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const imageUrl = await uploadImageToFirebase(imageUri);
      if (!imageUrl) {
        console.error(
          "A URL da imagem é undefined, não pode ser salva no Firebase"
        );
        return;
      }

      const db = getDatabase();
      const newPlayerRef = ref(
        db,
        `torneios/${tournamentId}/times/${teamId}/jogadores`
      );
      const newJogadorId = push(newPlayerRef).key;

      await set(
        ref(
          db,
          `torneios/${tournamentId}/times/${teamId}/jogadores/${newJogadorId}`
        ),
        {
          nome: nomeJogador,
          numeroCamisa: numeroCamisa,
          foto: imageUrl,
          peso: peso,
          altura: altura,
        }
      );

      alert("Jogador criado com sucesso!");
      navigation.goBack();
    } catch (error) {
      alert("Erro ao criar jogador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E67330" }}>
      <View>
        <GoBackButton
          onPress={() => navigation.goBack()}
          bgColor="bgColorWhite"
        />

        <View style={{ padding: 30 }}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                borderWidth: 1,
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#FFF",
                  padding: 10,
                  margin: 5,
                  borderRadius: 10,
                }}
                onPress={takePhoto}
              >
                <Text> Tirar Foto</Text>
              </TouchableOpacity>
            </View>
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
              placeholder="Nome"
              value={nomeJogador}
              onChangeText={setNomeJogador}
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
            }}
          >
            <TextInput
              placeholder="Número da camisa"
              value={numeroCamisa}
              onChangeText={setNumeroCamisa}
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
            }}
          >
            <TextInput placeholder="Peso" value={peso} onChangeText={setPeso} />
          </View>
          <View
            style={{
              backgroundColor: "#FFF",
              padding: 17,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#494953",
              marginVertical: 4,
            }}
          >
            <TextInput
              placeholder="Altura"
              value={altura}
              onChangeText={setAltura}
            />
          </View>
          <TouchableOpacity onPress={handleCreatePlayer} disabled={loading}>
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
                  <Text style={{ fontWeight: 600 }}>Criar Time</Text>
                )}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CriarJogador;
