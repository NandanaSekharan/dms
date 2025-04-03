import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddComplaintScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [complaints, setComplaints] = useState<{ _id: string; title: string; description: string; status: string; viewed: boolean }[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);

  // ✅ Fetch user from AsyncStorage
  const fetchUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('loggedInUser');
      if (userData) {
        setUsername(userData); // No need to parse since it's a simple string
      } else {
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.replace('/login');
    }
  };

  // ✅ Fetch user's complaints
  const fetchComplaints = async () => {
    if (!username) return;
    try {
      const response = await fetch(`${API_BASE_URL}/complaints?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch complaints");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (username) fetchComplaints();
  }, [username]);

  // ✅ Handle complaint submission
  const handleSubmit = async () => {
    if (!title || !description || !username) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          username
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTitle("");
        setDescription("");
        setTimeout(() => setShowSuccess(false), 3000);
        fetchComplaints();
      } else {
        const data = await response.json();
        Alert.alert("Error", data.message || "Failed to submit complaint.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  const handleDelete = async (complaintId: string) => {
    setSelectedComplaint(complaintId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedComplaint) return;

    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${selectedComplaint}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComplaints(complaints.filter(c => c._id !== selectedComplaint));
        Alert.alert('Success', 'Complaint deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete complaint');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error while deleting complaint');
    }

    setDeleteModalVisible(false);
    setSelectedComplaint(null);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        {/* ✅ Display logged-in username */}
        {username && (
          <View style={{ backgroundColor: '#e8f5e9', padding: 15, borderRadius: 8, marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#2e7d32' }}>
              Welcome, {username}
            </Text>
          </View>
        )}

        {showSuccess && (
          <View style={{ backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, marginBottom: 15 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Complaint Registered Successfully!</Text>
          </View>
        )}

        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Add Complaint</Text>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10, height: 100 }}
          multiline
        />
        <Button title="Submit" onPress={handleSubmit} />

        {/* ✅ Display list of user's complaints */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Your Complaints</Text>
          {complaints.map((complaint) => (
            <View key={complaint._id} style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>{complaint.title}</Text>
              <Text>{complaint.description}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                <View>
                  <Text style={{ color: complaint.status === 'Pending' ? 'orange' : 'green' }}>
                    Status: {complaint.status}
                  </Text>
                  <Text style={{ color: complaint.viewed ? 'green' : 'gray' }}>
                    {complaint.viewed ? 'Volunteer responded' : 'Not viewed'}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleDelete(complaint._id)}
                  style={{ 
                    backgroundColor: '#ff4444', 
                    padding: 8, 
                    borderRadius: 5 
                  }}
                >
                  <Text style={{ color: 'white' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
            <View style={{ 
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: '80%',
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: 18, marginBottom: 20 }}>
                Are you sure you want to delete this complaint?
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                <TouchableOpacity
                  onPress={() => setDeleteModalVisible(false)}
                  style={{ 
                    backgroundColor: '#999',
                    padding: 10,
                    borderRadius: 5,
                    width: '40%',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'white' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmDelete}
                  style={{ 
                    backgroundColor: '#ff4444',
                    padding: 10,
                    borderRadius: 5,
                    width: '40%',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'white' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default AddComplaintScreen;
