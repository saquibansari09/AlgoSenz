import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Slot, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { Colors } from "../constants/Colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  const router = useRouter();
  const segments = useSegments();

  // ✅ Determine if current route is Login page
  const isLoginPage =
    segments.length === 0 || segments[0]?.toLowerCase() === "login";

  const toggleProfileModal = () => setIsProfileModalOpen(!isProfileModalOpen);
  const toggleReportsModal = () => setIsReportsModalOpen(!isReportsModalOpen);

  const handleNavigation = async (page) => {
    if (page === "Logout") {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("userInfo");
            setIsLoggedIn(false);
            router.replace("/Login");
          },
        },
      ]);
    } else if (page === "Reports") {
      toggleReportsModal();
    } else if (page === "Account") {
      toggleProfileModal();
      setActiveTab("Account");
    } else {
      setActiveTab(page);
      router.push(`/${page}`);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

        if (userInfo?.userID) {
          setIsLoggedIn(true);
          if (isLoginPage) router.replace("/Home");
        } else {
          setIsLoggedIn(false);
          if (!isLoginPage) router.replace("/Login");
        }
      } catch (error) {
        console.error("Login check failed:", error);
        setIsLoggedIn(false);
        router.replace("/Login");
      } finally {
        setIsLoading(false);
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, [segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  // ✅ Only render login screen without header/tabs if not logged in
  if (!isLoggedIn && isLoginPage) {
    return <Slot />;
  }

  const tabs = [
    { name: "Home", icon: "home-outline" },
    { name: "Reports", icon: "bar-chart-outline" },
    { name: "Account", icon: "person-circle-outline" },
    { name: "Logout", icon: "log-out-outline" },
  ];

  return (
    <View style={styles.container}>
      {/* ✅ Header only visible after login */}
      {isLoggedIn && !isLoginPage && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{activeTab}</Text>
          <TouchableOpacity onPress={toggleProfileModal}>
            <Ionicons name="person-circle-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Page Content */}
      <View style={styles.pageContent}>
        <Slot />
      </View>

      {/* ✅ Bottom Tabs only visible after login */}
      {isLoggedIn && !isLoginPage && (
        <View style={styles.tabBar}>
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.name;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.tabItem, isActive && styles.activeTab]}
                onPress={() => handleNavigation(tab.name)}
              >
                <Ionicons
                  name={tab.icon}
                  size={24}
                  color={isActive ? "red" : Colors.GRAY}


                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? "red" : Colors.GRAY },
                  ]}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Profile Modal */}
      <Modal transparent visible={isProfileModalOpen} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Account Options</Text>

            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => {
                router.push("/Account/Notification");
                setActiveTab("Account");
                toggleProfileModal();
              }}
            >
              <Text style={styles.reportText}>Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => {
                router.push("/Account/ProfileUpdate");
                setActiveTab("Account");
                toggleProfileModal();
              }}
            >
              <Text style={styles.reportText}>Profile Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={toggleProfileModal}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reports Modal */}
      <Modal transparent visible={isReportsModalOpen} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Report</Text>

            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => {
                router.push("/Reports/TemperatureReport");
                setActiveTab("Reports");
                toggleReportsModal();
              }}
            >
              <Text style={styles.reportText}>Temperature Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => {
                router.push("/Reports/HumidityReport");
                setActiveTab("Reports");
                toggleReportsModal();
              }}
            >
              <Text style={styles.reportText}>Humidity Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={toggleReportsModal}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: Colors.PRIMARY,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  pageContent: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 3,
    borderTopColor: "transparent",
  },
  activeTab: { borderTopColor: "red" },
  tabLabel: { fontSize: 12, marginTop: 2 },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  closeModalButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#30ae9f",
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  closeModalText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  reportButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#17b3d6",
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  reportText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
