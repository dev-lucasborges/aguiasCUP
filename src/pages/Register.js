import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuário criado com sucesso:', user.uid);
      // Aqui você pode navegar para a próxima tela ou realizar outras ações após o sucesso
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Erro ao criar usuário:', errorCode, errorMessage);
      Alert.alert('Erro', 'Falha ao criar usuário. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Cadastro</Text>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 200 }}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20, width: 200 }}
      />
      <TouchableOpacity
        onPress={handleSignup}
        style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: 'white' }}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
