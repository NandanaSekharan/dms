import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from "../constants";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      return Alert.alert('Error', 'Please fill all fields.');
    }

    // Hardcoded Admin Login
    if (username === 'admin' && password === '0000') {
      await AsyncStorage.setItem('loggedInUser', username);
      Alert.alert('Success', 'Login successful!');
      return router.push('/(udashboard)/udashboard')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data and token
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('loggedInUser', username);
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));

      Alert.alert('Success', 'Login successful!');
      router.push('/(udashboard)/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid username or password.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <LinearGradient colors={["#FFFFFF", "#B0BEC5"]} style={styles.container}>
      <View style={styles.topSection}>
        <Ionicons name="log-in-outline" size={50} color="#222" />
        <Text style={styles.title}>User Login</Text>
        <View style={styles.underline} />
      </View>
      <View style={styles.bottomSection}>
        <TextInput 
          style={styles.input} 
          placeholder="Username" 
          value={username} 
          onChangeText={setUsername} 
        />
        <View style={styles.passwordContainer}>
          <TextInput 
            style={styles.passwordInput} 
            placeholder="Password" 
            secureTextEntry={!showPassword} 
            value={password} 
            onChangeText={setPassword} 
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#CFD8DC",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#B0BEC5",
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  loginButton: {
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
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
