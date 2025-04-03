import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Navbar = () => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300)); // Initial position off-screen
  const [menuAnim] = useState(new Animated.Value(1)); // Add this for menu button opacity
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -300 : 0;
    const menuOpacity = isDrawerOpen ? 1 : 0;
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(menuAnim, {
        toValue: menuOpacity,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
    
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
    toggleDrawer();
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    router.push("/");
  };

  const features = [
    { name: "Dashboard", icon: "grid", route: "/udashboard" },
    // { name: "Volunteer", icon: "people", route: "/Volunteer" },
    { name: "Request", icon: "help-circle", route: "/Request" },
    { name: "Complaint", icon: "alert", route: "/uComplaints" },
    { name: "Camp", icon: "home", route: "/uCamp" },
    // { name: "Funds", icon: "cash", route: "/Funds" },
    // { name: "Disaster Place", icon: "earth", route: "/DisasterPlace" },
    // { name: "Report", icon: "document-text", route: "/Report" },
    // { name: "Weather Updates", icon: "partly-sunny", route: "/Weather" },
    { name: "Emergency Contacts", icon: "call-outline", route: "/uContacts" }, // Changed this line
    { name: "Logout", icon: "log-out", route: "", onPress: handleLogout },
  ];

  return (
    <View style={[styles.container, { height: screenHeight }]}>
      <View style={styles.pillBar}>
        <Animated.View style={{ opacity: menuAnim }}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
            <Ionicons name="menu" size={30} color="#00838F" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.drawerItem}
            onPress={() => {
              if (feature.onPress) {
                feature.onPress();
              } else {
                router.push(feature.route);
                toggleDrawer();
              }
            }}
          >
            <Ionicons name={feature.icon as any} size={24} color="#00838F" />
            <Text style={styles.drawerItemText}>{feature.name}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Overlay */}
      {isDrawerOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleDrawer}
        />
      )}

      {/* Logout Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={confirmLogout}
              >
                <Text style={[styles.modalButtonText, styles.logoutButtonText]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  pillBar: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'white',
    zIndex: 1002,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },
  menuButton: {
    padding: 13,
    marginLeft: 15,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#FFF',
    zIndex: 2000,
    paddingTop: 80,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#222',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1500,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#00838F',
  },
  modalButtonText: {
    textAlign: 'center',
    fontSize: 16,
  },
  logoutButtonText: {
    color: 'white',
  },
});

export default Navbar;
