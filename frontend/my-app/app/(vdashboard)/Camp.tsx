import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../constants";

interface Camp {
  _id: string;
  name: string;
  location: string;
  capacity: number;
}

export default function CampScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [formData, setFormData] = useState({ 
    name: "", 
    location: "", 
    capacity: "",
  });

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

  const handleAddCamp = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/camps/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name, 
          location: formData.location, 
          capacity: Number(formData.capacity),
        }),
      });

      if (response.ok) {
        fetchCamps(); // Refresh list
        setIsModalVisible(false);
        setFormData({ name: "", location: "", capacity: "" });
        setIsSuccessModalVisible(true); // Show success modal
        setTimeout(() => setIsSuccessModalVisible(false), 2000); // Auto hide after 2 seconds
      }
    } catch (error) {
      console.error("Error adding camp:", error);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedCampId(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCamp = async () => {
    if (!selectedCampId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/camps/${selectedCampId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCamps();
        setIsDeleteModalVisible(false);
        setSelectedCampId(null);
      }
    } catch (error) {
      console.error("Error deleting camp:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Disaster Relief Camps</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.addButtonText}>Add Camp</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Camp</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Camp Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Capacity"
              keyboardType="numeric"
              value={formData.capacity}
              onChangeText={(text) => setFormData({ ...formData, capacity: text })}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddCamp}>
              <Text style={styles.submitButtonText}>Add Camp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={isSuccessModalVisible} animationType="fade" transparent={true}>
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            <Text style={styles.successModalText}>Camp Details Added Successfully!</Text>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Confirm Delete</Text>
            <Text style={styles.deleteModalText}>Are you sure you want to delete this camp?</Text>
            
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.deleteModalButton, styles.deleteButton]}
                onPress={handleDeleteCamp}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.list}>
        {camps.map((camp) => (
          <View key={camp._id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.name}>{camp.name}</Text>
                <Text style={styles.location}>{camp.location}</Text>
                <Text style={styles.capacity}>Capacity: {camp.capacity}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => confirmDelete(camp._id)}
                style={styles.deleteIconButton}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
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
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#E6F3FF", padding: 8, borderRadius: 8 },
  addButtonText: { color: "#007AFF", fontSize: 14, fontWeight: "500", marginLeft: 4 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  input: { backgroundColor: "#f9f9f9", borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ddd" },
  submitButton: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, alignItems: "center" },
  submitButtonText: { color: "#fff", fontWeight: "bold" },
  list: { marginTop: 20 },
  card: { backgroundColor: "white", padding: 16, borderRadius: 8, marginBottom: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  deleteButton: { padding: 8 },
  name: { fontSize: 18, fontWeight: "bold" },
  location: { fontSize: 14, color: "#666" },
  capacity: { fontSize: 14, color: "#007AFF", marginTop: 4 },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
  },
  successModalText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  deleteModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deleteModalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  deleteModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  deleteIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
  },
});
