import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const Drawer = createDrawerNavigator();

const DashboardScreen = () => {
  const navigation = useNavigation();
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const headerBackground = require("../assets/images/bg1.jpg");

  return (
    <LinearGradient colors={["#FFFFFF", "#B0BEC5"]} style={styles.container}>
      {/* Header Section with Background Image */}
      <ImageBackground source={headerBackground} style={styles.headerBackground} resizeMode="cover">
        <View style={styles.headerOverlay}>
          {/* Left: Menu Button */}
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconButton}>
            <Ionicons name="menu" size={32} color="#fff" />
          </TouchableOpacity>

          {/* Center: Welcome Message */}
          <Text style={styles.title}>Welcome back, to centralized monitor</Text>

          {/* Right: Date, Messages & Notifications */}
          <View style={styles.headerRight}>
            <Text style={styles.date}>{currentDate}</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mail-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to the Disaster Management System</Text>
      </View>
    </LinearGradient>
  );
};

const DrawerContent = ({ navigation }: any) => {
  const [isLogoutModalVisible, setLogoutModalVisible] = React.useState(false);
  const router = useRouter();

  const features = [
    { name: "Department", icon: "briefcase", route: "Department" },
    { name: "Volunteer", icon: "people", route: "Volunteer" },
    { name: "Request", icon: "help-circle", route: "Request" },
    { name: "Complaint", icon: "alert", route: "Complaint" },
    { name: "Camp", icon: "home", route: "Camp" },
    { name: "Funds", icon: "cash", route: "Funds" },
    { name: "Disaster Place", icon: "earth", route: "DisasterPlace" },
    { name: "Report", icon: "document-text", route: "Report" },
    { name: "Weather Updates", icon: "partly-sunny", route: "Weather" },
    { name: "Emergency Contacts", icon: "call-outline", route: "EmergencyContacts" },
    { name: "Logout", icon: "log-out", route: "login" },
  ];

  const handleNavigation = (route: string) => {
    if (route === "login") {
      setLogoutModalVisible(true);
    } else {
      navigation.navigate(route);
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    router.push("/");
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.drawerScrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.drawerContainer}>
          {features.map((feature, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.drawerItem} 
              onPress={() => handleNavigation(feature.route)}
            >
              <Ionicons name={feature.icon as any} size={24} color="#00838F" />
              <Text style={styles.drawerText}>{feature.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Drawer Navigator (NO NavigationContainer Here)
const Dashboard = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="DashboardScreen" component={DashboardScreen} />
    </Drawer.Navigator>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  headerBackground: {
    width: "100%",
    height: 150,
    justifyContent: "center",
  },
  headerOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)", // Transparent overlay for readability
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    color: "#fff",
    marginRight: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "#444",
  },
  drawerScrollContainer: {
    flexGrow: 1, // Ensures the content is scrollable
  },
  drawerContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  drawerText: {
    fontSize: 18,
    marginLeft: 15,
    color: "#222",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  logoutButtonText: {
    color: '#fff',
  },
});
