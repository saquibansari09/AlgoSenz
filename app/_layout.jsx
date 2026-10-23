import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, usePathname, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get("window");

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [refreshKey, setRefreshKey] = useState(0);

  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

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
            setActiveTab("Home");
            setRefreshKey((prev) => prev + 1);
            router.replace("/Login");
          },
        },
      ]);
    } else if (page === "Reports") {
      setActiveTab("Reports");
      toggleReportsModal();
    } else if (page === "Account") {
      setActiveTab("Account");
      toggleProfileModal();
    } else {
      setActiveTab(page);
      router.push(`/${page}`);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
        if (userInfo?.userID) {
          setIsLoggedIn(true);
          if (isLoginPage) {
            router.replace("/Home");
          }
        } else {
          setIsLoggedIn(false);
          if (!isLoginPage) {
            router.replace("/Login");
          }
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

    checkLoginStatus();
  }, [pathname]);

  useEffect(() => {
    if (!pathname) return;

    const path = pathname.replace("/", "").toLowerCase();

    if (path.startsWith("home")) setActiveTab("Home");
    else if (path.startsWith("reports")) setActiveTab("Reports");
    else if (path.startsWith("account")) setActiveTab("Account");
    else setActiveTab("Home");
  }, [pathname]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!isLoggedIn && isLoginPage) {
    return <Slot key={refreshKey} />;
  }

  const tabs = [
    { name: "Home", icon: "home-outline" },
    { name: "Reports", icon: "bar-chart-outline" },
    { name: "Account", icon: "person-circle-outline" },
    { name: "Logout", icon: "log-out-outline" },
  ];

  return (
    <View style={styles.container} key={refreshKey}>
      <StatusBar barStyle="light-content" backgroundColor="#135CBE" />

      {/* Responsive Branded Header with Background Image */}
      {isLoggedIn && (
        <ImageBackground
          source={require("../assets/images/header.png")}
          style={styles.headerBanner}
          resizeMode="cover"
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft} />
            <TouchableOpacity
              onPress={toggleProfileModal}
              style={styles.profileIconContainer}
            >
              <Ionicons name="person-circle-outline" size={36} color="#fff" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}

      {/* Page Content */}
      <View style={styles.pageContent}>
        <Slot />
      </View>

      {/* Bottom Tabs */}
      {isLoggedIn && (
        <SafeAreaView edges={["bottom"]} style={styles.safeAreaTab}>
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
                    color={isActive ? "#80acdb" : Colors.GRAY}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: isActive ? "#80acdb" : Colors.GRAY },
                    ]}
                  >
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
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

  safeAreaHeader: {},
  headerBanner: {
    width: "100%",
    // Responsive height calculate ki gayi hai screen width ke hisab se (approx 4.5 ratio)
    height: width * 0.22,
    justifyContent: "center",
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerLeft: {
    flex: 1,
  },
  profileIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },

  pageContent: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    paddingBottom: 10,
    height: 70,
    elevation: 10,
  },
  safeAreaTab: { backgroundColor: "#fff" },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 3,
    borderTopColor: "transparent",
  },
  activeTab: { borderTopColor: "#80acdb" },
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
    backgroundColor: "#80acdb",
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  closeModalText: { color: "#000", fontSize: 15, fontWeight: "bold" },
  reportButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#80acdb",
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  reportText: { color: "#000", fontSize: 15, fontWeight: "bold" },
});
