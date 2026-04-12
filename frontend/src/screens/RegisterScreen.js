import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import API from '../services/api';

const GENDER_OPTIONS = [
  { label: 'Male',   value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Skip',   value: '' },
];

export default function RegisterScreen({ navigation }) {
  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    location: '',
    gender: '',
  });

  const handleRegister = async () => {
    try {
      // Strip empty optional fields before sending
      const payload = { ...data };
      if (!payload.location) delete payload.location;
      if (!payload.gender)   delete payload.gender;

      await API.post('users/register/', payload);
      alert('Registered successfully');
      navigation.replace('Login');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 🚀</Text>

      <TextInput placeholder="First Name"          style={styles.input} onChangeText={(v) => setData({ ...data, first_name: v })} />
      <TextInput placeholder="Last Name"           style={styles.input} onChangeText={(v) => setData({ ...data, last_name: v })} />
      <TextInput placeholder="Email"               style={styles.input} keyboardType="email-address" autoCapitalize="none" onChangeText={(v) => setData({ ...data, email: v })} />
      <TextInput placeholder="Password"            style={styles.input} secureTextEntry onChangeText={(v) => setData({ ...data, password: v })} />
      <TextInput placeholder="Location (optional)" style={styles.input} onChangeText={(v) => setData({ ...data, location: v })} />

      {/* Gender selector */}
      <Text style={styles.labellll}>Gender (optional)</Text>
      <View style={styles.genderRow}>
        {GENDER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.genderBtn, data.gender === opt.value && styles.genderBtnActive]}
            onPress={() => setData({ ...data, gender: opt.value })}
          >
            <Text style={[styles.genderText, data.gender === opt.value && styles.genderTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#151313ff' },
  title:           { fontSize: 26, fontWeight: 'bold', marginBottom: 30 , color: '#ffffffff'     },
  input:           { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  label:           { fontSize: 14, color: '#555', marginBottom: 8 },
  labellll:         { fontSize: 14, color: '#ffffffff', marginBottom: 8},
  genderRow:       { flexDirection: 'row', gap: 10, marginBottom: 20 },
  genderBtn:       { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', borderWidth: 1.5, borderColor: '#ddd' },
  genderBtnActive: { backgroundColor: '#5c56dcff', borderColor: '#2196F3' },
  genderText:      { color: '#555', fontWeight: '600' },
  genderTextActive:{ color: '#fff' },
  button:          { backgroundColor: '#5c56dcff', padding: 15, borderRadius: 10 },
  buttonText:      { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  link:            { marginTop: 20, textAlign: 'center', color: 'blue' },
});