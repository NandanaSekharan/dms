import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  interface Contact {
    _id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
    tags: string[];
  }

  const [contacts, setContacts] = useState<Contact[]>([]);

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
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
