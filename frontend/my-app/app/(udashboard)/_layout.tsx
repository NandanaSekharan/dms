import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import Navbar from "../components/uNavbar"

export default function Layout() {
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <Slot /> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 110,
  },
});
