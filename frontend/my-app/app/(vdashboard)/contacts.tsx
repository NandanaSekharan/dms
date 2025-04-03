import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from "../constants";

const CONTACT_TAGS = [
  'Emergency',
  'Medical',
  'Search & Rescue',
  'Food',
  'Camp',
  'Transport',
  'Security'
];

export default function ContactsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tags: [] as string[]
  });
  interface Contact {
    _id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
    tags: string[];
  }

  const [contacts, setContacts] = useState<Contact[]>([]);

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const determineRole = (tags: string[]) => {
    if (tags.length === 0) return '';
    return `${tags[0]} Coordinator`; // Use the first selected tag as the role
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.tags.length === 0) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const role = determineRole(formData.tags);
    const contactData = { ...formData, role };

    try {
      const response = await fetch(`${API_BASE_URL}/contacts/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Contact added successfully.');
        setIsModalVisible(false);
        setFormData({ name: '', phone: '', email: '', tags: [] });
        fetchContacts(); // Fetch contacts after adding a new one
      } else {
        Alert.alert('Error', data.error || 'Failed to add contact.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`);
      const data = await response.json();
      if (response.ok) {
        setContacts(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch contacts');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);
    const matchesRole = !selectedRole || contact.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const uniqueRoles = Array.from(new Set(contacts.map(contact => contact.role))).filter(Boolean);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Contacts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedRole === '' && styles.filterButtonActive]}
            onPress={() => setSelectedRole('')}
          >
            <Text style={[styles.filterButtonText, selectedRole === '' && styles.filterButtonTextActive]}>All</Text>
          </TouchableOpacity>
          {uniqueRoles.map((role) => (
            <TouchableOpacity
              key={role}
              style={[styles.filterButton, selectedRole === role && styles.filterButtonActive]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={[styles.filterButtonText, selectedRole === role && styles.filterButtonTextActive]}>{role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.contactsList}>
        {filteredContacts.map((contact) => (
          <View key={contact._id} style={styles.contactCard}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactRole}>{contact.role}</Text>
            <Text style={styles.contactInfo}>{contact.phone}</Text>
            <Text style={styles.contactInfo}>{contact.email}</Text>
            <View style={styles.tagsList}>
              {contact.tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Contact</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter full name"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  value={formData.phone}
                  keyboardType="phone-pad"
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  value={formData.email}
                  keyboardType="email-address"
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {CONTACT_TAGS.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tag,
                        formData.tags.includes(tag) && styles.tagSelected
                      ]}
                      onPress={() => toggleTag(tag)}
                    >
                      <Text style={[
                        styles.tagText,
                        formData.tags.includes(tag) && styles.tagTextSelected
                      ]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Add Contact</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F3FF', padding: 8, borderRadius: 8 },
  addButtonText: { color: '#007AFF', fontSize: 14, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: '700', color: '#111827' },
  closeButton: { padding: 8 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 16 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
  tagSelected: { backgroundColor: '#2563EB' },
  tagText: { fontSize: 14, fontWeight: '500', color: '#4B5563' },
  tagTextSelected: { color: '#FFFFFF' },
  submitButton: { backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  contactsList: { marginTop: 16, gap: 16 },
  contactCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  contactName: { fontSize: 18, fontWeight: '600', color: '#111827' },
  contactRole: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  contactInfo: { fontSize: 14, color: '#374151', marginBottom: 4 },
  tagsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tagChip: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  tagChipText: { fontSize: 12, color: '#4B5563' },
  searchContainer: {
    gap: 12,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#4B5563',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
});
