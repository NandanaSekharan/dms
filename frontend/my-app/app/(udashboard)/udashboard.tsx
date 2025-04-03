import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';

const uDashboard = () => {
  const [username, setUsername] = useState('');
  const currentDate = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const headerBackground = require("../assets/images/bg1.jpg");

  useEffect(() => {
    const getUsername = async () => {
      try {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        if (loggedInUser) {
          const userData = JSON.parse(loggedInUser);
          setUsername(userData.username || '');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
    getUsername();
  }, []);

  return (
    <LinearGradient colors={["#FFFFFF", "#B0BEC5"]} style={styles.container}>
      <ImageBackground source={headerBackground} style={styles.headerBackground} resizeMode="cover">
        <View style={styles.headerOverlay}>
          <Text style={styles.title}>Welcome to the Disaster Management System for Users</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
      </ImageBackground>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome back, {username}!</Text>
      </View>
    </LinearGradient>
  );
};

export default uDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  headerBackground: { width: "100%", height: 150, justifyContent: "center" },
  headerOverlay: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 20, 
    width: "100%", 
    backgroundColor: "rgba(0,0,0,0.3)", 
    height: "100%" 
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#fff", textAlign: "center" },
  date: { fontSize: 14, color: "#fff", marginRight: 10 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcomeText: { fontSize: 18, color: "#444" },
});
