import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, ScrollView, Platform, Modal, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL } from "../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportsList: {
    flex: 1,
    padding: 10,
  },
  reportCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',  // Add this
  },
  reportType: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  reportLocation: {
    color: '#666',
    marginBottom: 5,
  },
  reportDate: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  thumbnailImage: {
    width: 50,
    height: 50,
    marginRight: 5,
    borderRadius: 5,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 8,
    backgroundColor: '#ff4444',
    borderRadius: 5,
    zIndex: 2,  // Add this
    elevation: 4,  // Add this for Android
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reportContent: {  // Add this new style
    marginTop: 40,  // Add space for delete button
  },
});

const ReportScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportType, setReportType] = useState('Damage Assessment');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`);
      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Handle multiple images
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    } else {
      alert('You did not select any image.');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!location.trim() || !description.trim()) {
        setError('Please fill in all required fields');
        return;
      }

      const formData = new FormData();
      formData.append('type', reportType);
      formData.append('location', location);
      formData.append('description', description);

      // Improved image handling
      for (let i = 0; i < images.length; i++) {
        const uri = images[i];
        const name = uri.split('/').pop() || `image${i}.jpg`;
        const match = /\.(\w+)$/.exec(name);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('images', {
          uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
          type,
          name,
        } as any);
      }

      const response = await fetch(`${API_BASE_URL}/reports/submit`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Remove Content-Type header to let browser set it with boundary
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit report');
      }

      setReportType('Damage Assessment');
      setLocation('');
      setDescription('');
      setImages([]);
      alert('Report submitted successfully!');
      handleSubmitSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
      console.error('Error submitting report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSuccess = async () => {
    setModalVisible(false);
    await fetchReports(); // Refresh reports after submission
  };

  const handleDelete = async (reportId: string) => {
    console.log('Delete button pressed for report:', reportId);
    const deleteUrl = `${API_BASE_URL}/reports/${reportId}`;
    console.log('Delete URL:', deleteUrl);

    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies if needed
              });
              
              console.log('Delete response status:', response.status);
              
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete report');
              }

              // Update UI first for better UX
              setReports(prevReports => 
                prevReports.filter((report: any) => report._id !== reportId)
              );
              
              // Then try to parse response
              try {
                const responseData = await response.json();
                console.log('Delete response:', responseData);
              } catch (err) {
                // Response might be empty, which is fine
                console.log('No response body');
              }
              
              Alert.alert('Success', 'Report deleted successfully');
            } catch (err: any) {
              console.error('Delete error:', err);
              Alert.alert(
                'Error',
                'Failed to delete report. Please try again.'
              );
            }
          }
        }
      ]
    );
  };

  // Move the form into a Modal component
  const ReportForm = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalView}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Submit a Report</Text>

          <Text>Report Type</Text>
          <Picker selectedValue={reportType} onValueChange={setReportType}>
            <Picker.Item label="Damage Assessment" value="Damage Assessment" />
            <Picker.Item label="Resource Needs" value="Resource Needs" />
            <Picker.Item label="General Incident" value="General Incident" />
          </Picker>
          
          <Text>Location</Text>
          <TextInput
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
            style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
          />

          <Text>Description</Text>
          <TextInput
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            style={{ borderWidth: 1, padding: 8, marginBottom: 10, height: 100 }}
          />

          <TouchableOpacity onPress={pickImage} style={{ backgroundColor: 'blue', padding: 10, marginBottom: 10 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Attach Photos</Text>
          </TouchableOpacity>

          <ScrollView horizontal>
            {images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={{ width: 50, height: 50, marginRight: 5 }} />
            ))}
          </ScrollView>

          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button 
              title={loading ? "Submitting..." : "Submit Report"} 
              onPress={handleSubmit}
              disabled={loading} 
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header with Add Report Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Report</Text>
        </TouchableOpacity>
      </View>

      {/* Display Reports List */}
      <ScrollView style={styles.reportsList}>
        {reports.map((report: any) => (
          <View key={report._id} style={styles.reportCard}>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDelete(report._id)}
              activeOpacity={0.7}  // Add this for better touch feedback
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <View style={styles.reportContent}>
              <Text style={styles.reportType}>{report.type}</Text>
              <Text style={styles.reportLocation}>{report.location}</Text>
              <Text numberOfLines={2}>{report.description}</Text>
              <ScrollView horizontal>
                {report.images.map((img: string, index: number) => (
                  <Image 
                    key={index} 
                    source={{ uri: `${API_BASE_URL}${img}` }} 
                    style={styles.thumbnailImage} 
                  />
                ))}
              </ScrollView>
              <Text style={styles.reportDate}>
                {new Date(report.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Report Form Modal */}
      <ReportForm />
    </View>
  );
};

export default ReportScreen;
