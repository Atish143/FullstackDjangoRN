import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await API.post('users/login/', { email, password });

      // Save both tokens
      console.log('Login successful, tokens received:', response.data);
      await AsyncStorage.setItem('token', response.data.access);
      await AsyncStorage.setItem('refreshToken', response.data.refresh);

      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Login Failed', 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate('Register')} style={styles.link}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#181616ff' },
  title:      { fontSize: 26, fontWeight: 'bold', marginBottom: 30,  color: '#ffffffff' },
  input:      { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  button:     { backgroundColor: '#7072eeff', padding: 15, borderRadius: 10 },
  buttonText: { color: '#ffffffff', textAlign: 'center', fontWeight: 'bold' },
  link:       { marginTop: 20, textAlign: 'center', color: 'blue' },
});