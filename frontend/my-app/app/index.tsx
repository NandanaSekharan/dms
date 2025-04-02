import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, BackHandler } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Index() {
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true; // Prevents going back
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [])
    );

    return (
        <LinearGradient colors={["#F8F9FA", "#E3E6EC"]} style={styles.container}>
            <View style={styles.topSection}>
                <Text style={styles.title}>Disaster</Text>
                <View style={styles.underline} />
            </View>

            <View style={styles.bottomSection}>
                <TouchableOpacity onPress={() => router.push("/userRegister")} style={styles.buttonWrapper}>
                    <View style={styles.buttonCard}>
                        <View style={styles.iconWrapper}>
                            <FontAwesome name="id-card" size={22} color="white" />
                        </View>
                        <Text style={styles.buttonText}>Register as User</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/volunteerRegister")} style={styles.buttonWrapper}>
                    <View style={styles.buttonCard}>
                        <View style={styles.iconWrapper}>
                            <FontAwesome name="heart" size={22} color="white" />
                        </View>
                        <Text style={styles.buttonText}>Register as Volunteer</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/Login")} style={styles.buttonWrapper}>
                    <View style={styles.buttonCard}>
                        <View style={styles.iconWrapper}>
                            <FontAwesome name="sign-in" size={22} color="white" />
                        </View>
                        <Text style={styles.buttonText}>Login as User</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/volunteerLogin")} style={styles.buttonWrapper}>
                    <View style={styles.buttonCard}>
                        <View style={styles.iconWrapper}>
                            <FontAwesome name="sign-in" size={22} color="white" />
                        </View>
                        <Text style={styles.buttonText}>Login as Volunteer</Text>
                    </View>
                </TouchableOpacity>

                {/* Don't have an account? Sign Up Link */}
                <TouchableOpacity onPress={() => router.push("/SignUpPage")}>
                    <Text style={styles.signupText}>Admin <Text style={styles.signupLink}>login</Text></Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    topSection: {
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 42,
        fontWeight: "bold",
        color: "#222",
        fontFamily: "Poppins_700Bold",
    },
    underline: {
        width: 80,
        height: 4,
        backgroundColor: "#007BFF",
        marginTop: 8,
        borderRadius: 2,
    },
    bottomSection: {
        width: "90%",
        alignItems: "center",
    },
    buttonWrapper: {
        width: "100%",
        alignItems: "center",
    },
    buttonCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#FFF",
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 18,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#007BFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    buttonText: {
        color: "#222",
        fontSize: 18,
        fontFamily: "Poppins_600SemiBold",
    },
    signupText: {
        fontSize: 16,
        color: "#222",
        marginTop: 10,
    },
    signupLink: {
        color: "#007BFF",
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
});

