import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { API_BASE_URL } from "../constants";

interface Camp {
  _id: string;
  name: string;
  location: string;
  capacity: number;
}

export default function CampScreen() {
  const [camps, setCamps] = useState<Camp[]>([]);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/camps`);
      const data = await response.json();
      setCamps(data);
    } catch (error) {
      console.error("Error fetching camps:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Disaster Relief Camps(user)</Text>
      </View>

      <View style={styles.list}>
        {camps.map((camp) => (
          <View key={camp._id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.name}>{camp.name}</Text>
                <Text style={styles.location}>{camp.location}</Text>
                <Text style={styles.capacity}>Capacity: {camp.capacity}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  list: { marginTop: 20 },
  card: { backgroundColor: "white", padding: 16, borderRadius: 8, marginBottom: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 18, fontWeight: "bold" },
  location: { fontSize: 14, color: "#666" },
  capacity: { fontSize: 14, color: "#007AFF", marginTop: 4 },
});
