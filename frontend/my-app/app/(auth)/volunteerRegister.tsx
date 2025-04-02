import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import { API_BASE_URL } from "../constants";
import { LinearGradient } from 'expo-linear-gradient';

export default function VolunteerSignUp() {
  const [teamName, setTeamName] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    number: false,
    special: false,
    uppercase: false,
  });

  const validatePassword = (password: string): void => {
    setPasswordValidation({
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password),
    });
  };

  const handleSignUp = async () => {
    if (!teamName || !signUpPassword || !confirmPassword || !phoneNumber) {
      return Alert.alert('Error', 'Please fill all fields.');
    }
    if (signUpPassword !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match.');
    }
    if (!Object.values(passwordValidation).every(Boolean)) {
      return Alert.alert('Error', 'Password does not meet requirements.');
    }

    setIsSignUpLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/volunteer/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          password: signUpPassword,
          phoneNumber,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowSuccessModal(true);
        setTeamName('');
        setSignUpPassword('');
        setConfirmPassword('');
        setPhoneNumber('');
      } else {
        if (data.message.includes("Team name already exists")) {
          Alert.alert('Error', 'This team name is already taken. Please choose another.');
        } else if (data.message.includes("Phone number already registered")) {
          Alert.alert('Error', 'This phone number is already registered.');
        } else {
          Alert.alert('Error', data.message || 'Sign-up failed.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again later.');
    } finally {
      setIsSignUpLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LinearGradient colors={["#FFFFFF", "#B0BEC5"]} style={styles.container}>
        <View style={styles.innerContainer}>
          <FontAwesome5 name="hands-helping" size={50} color="#222" />
          <Text style={styles.title}>Volunteer Registration</Text>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="users" size={20} color="gray" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Team Name" 
              value={teamName} 
              onChangeText={setTeamName} 
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="phone" size={20} color="gray" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
          </View>

          <View style={styles.passwordContainer}>
            <FontAwesome5 name="lock" size={20} color="gray" style={styles.icon} />
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Password" 
              secureTextEntry={!showSignUpPassword} 
              value={signUpPassword} 
              onChangeText={(text) => {
                setSignUpPassword(text);
                validatePassword(text);
              }} 
            />
            <TouchableOpacity onPress={() => setShowSignUpPassword(!showSignUpPassword)} style={styles.eyeButton}>
              <FontAwesome5 name={showSignUpPassword ? 'eye-slash' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <View style={styles.validationContainer}>
            <Text style={[styles.validationText, passwordValidation.length && styles.validationValid]}>
              • Minimum 8 characters
            </Text>
            <Text style={[styles.validationText, passwordValidation.uppercase && styles.validationValid]}>
              • Contains uppercase letter
            </Text>
            <Text style={[styles.validationText, passwordValidation.number && styles.validationValid]}>
              • Contains number
            </Text>
            <Text style={[styles.validationText, passwordValidation.special && styles.validationValid]}>
              • Contains special character
            </Text>
          </View>

          <View style={styles.passwordContainer}>
            <FontAwesome5 name="lock" size={20} color="gray" style={styles.icon} />
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Confirm Password" 
              secureTextEntry={!showConfirmPassword} 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
              <FontAwesome5 name={showConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {isSignUpLoading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
              <Text style={styles.signupButtonText}>Register as Volunteer</Text>
            </TouchableOpacity>
          )}

          <Modal
            animationType="fade"
            transparent={true}
            visible={showSuccessModal}
            onRequestClose={() => setShowSuccessModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FontAwesome5 name="check-circle" size={50} color="green" />
                <Text style={styles.modalTitle}>Success!</Text>
                <Text style={styles.modalText}>Your volunteer account has been created successfully.</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowSuccessModal(false)}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginRight: 10,
  },
  innerContainer: {
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#263238',
    fontWeight: 'bold',
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#CFD8DC',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#B0BEC5',
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#CFD8DC',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#B0BEC5',
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  eyeButton: {
    padding: 10,
  },
  validationContainer: {
    width: '90%',
    marginBottom: 15,
  },
  validationText: {
    color: '#666',
    marginBottom: 5,
  },
  validationValid: {
    color: 'green',
  },
  signupButton: {
    width: '90%',
    padding: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#263238',
    borderRadius: 12,
    padding: 10,
    width: '50%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
