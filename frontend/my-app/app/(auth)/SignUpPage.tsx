import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from "../constants";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      return Alert.alert('Error', 'Please fill all fields.');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match.');
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.status === 200) {
        Alert.alert('Success', 'Signup successful!');
      } else {
        Alert.alert('Error', data.message || 'Signup failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#FFFFFF", "#B0BEC5"]} style={styles.container}>
      <View style={styles.topSection}>
        <Ionicons name="person-add-outline" size={50} color="#222" />
        <Text style={styles.title}>Admin Signup</Text>
        <View style={styles.underline} />
      </View>
      <View style={styles.bottomSection}>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Confirm Password" 
          secureTextEntry 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Signup</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#222",
  },
  underline: {
    width: 80,
    height: 4,
    backgroundColor: "#007BFF",
    marginTop: 8,
    borderRadius: 2,
  },
  bottomSection: {
    width: "90%",
  },
  input: {
    width: "100%",
    padding: 14,
    backgroundColor: "#CFD8DC",
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#B0BEC5",
  },
  signupButton: {
    width: "100%",
    padding: 16,
    backgroundColor: "#000",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
