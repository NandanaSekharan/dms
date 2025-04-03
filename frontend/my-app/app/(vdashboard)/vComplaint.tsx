import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Modal, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddComplaintScreen = () => {
  const router = useRouter();
  const [complaints, setComplaints] = useState<{ 
    _id: string; 
    title: string; 
    description: string; 
    status: string; 
    username: string;
    viewed: boolean 
  }[]>([]);
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

  // ✅ Fetch all complaints
  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints`);
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

  const handleViewAndComplete = async (complaintId: string, complete: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/view`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          viewed: true,
          status: complete ? 'Resolved' : 'Pending'
        })
      });

      if (response.ok) {
        const updatedComplaint = await response.json();
        setComplaints(complaints.map(c => 
          c._id === complaintId ? updatedComplaint : c
        ));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update complaint status');
    }
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

        {/* ✅ Display list of complaints */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>All Complaints</Text>
          {complaints.map((complaint) => (
            <View key={complaint._id} style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>{complaint.title}</Text>
              <Text>{complaint.description}</Text>
              <Text style={{ fontStyle: 'italic', color: '#666', marginTop: 5 }}>
                Posted by: {complaint.username}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ color: complaint.status === 'Pending' ? 'orange' : 'green' }}>
                    Status: {complaint.status}
                  </Text>
                  <Text style={{ color: complaint.viewed ? 'gray' : 'blue' }}>
                    {complaint.viewed ? '✓ Viewed' : 'Not viewed'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity 
                    onPress={() => handleViewAndComplete(complaint._id, false)}
                    style={{ 
                      backgroundColor: complaint.viewed ? '#ccc' : '#007AFF',
                      padding: 8, 
                      borderRadius: 5 
                    }}
                    disabled={complaint.viewed && complaint.status === 'Pending'}
                  >
                    <Text style={{ color: 'white' }}>
                      {complaint.viewed ? 'Viewed' : 'Mark as Viewed'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleViewAndComplete(complaint._id, true)}
                    style={{ 
                      backgroundColor: complaint.status === 'Resolved' ? '#4CAF50' : '#FFA500',
                      padding: 8, 
                      borderRadius: 5 
                    }}
                  >
                    <Text style={{ color: 'white' }}>
                      {complaint.status === 'Resolved' ? 'Completed' : 'Mark Complete'}
                    </Text>
                  </TouchableOpacity>
                  {username === complaint.username && (
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
                  )}
                </View>
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
