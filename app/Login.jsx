import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";

function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const extractCompanyId = (resp) => {
    if (!resp || typeof resp !== "object") return null;

    const possibleKeys = [
      "companyId",
      "companyID",
      "CompanyID",
      "CompanyId",
      "companyid",
      "Companyid",
    ];

    for (let key of possibleKeys) {
      if (resp[key] !== undefined && resp[key] !== null) {
        return resp[key];
      }
    }
    return null;
  };

  const handleLoginWithAPI = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      const url = `https://algotrack.in/webapiAlgosenztemp/api/Login/IsValidUser?userName=${username}&passWord=${password}`;
      const response = await axios.get(url);
      const resp = response?.data;

      if (!resp || !resp.userID) {
        Alert.alert("Login Failed", "Invalid username or password.");
        return;
      }

      await AsyncStorage.setItem("userInfo", JSON.stringify(resp));

      const companyId = extractCompanyId(resp);

      if (!companyId) {
        Alert.alert("Error", "Company ID missing from API");
        return;
      }

      // ⭐⭐⭐ FIXED PART
      await AsyncStorage.removeItem("companyId");
      await AsyncStorage.setItem("companyId", String(companyId));
      console.log("✅ SAVED companyId:", companyId);

      // ⭐⭐⭐ SMALL DELAY (Expo Router fix)
      await new Promise((resolve) => setTimeout(resolve, 300));

      Alert.alert("Login Successful", `Welcome ${resp.companyName || ""}`);
      router.replace("/Home");
    } catch (error) {
      Alert.alert("Login Error", "Something went wrong.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.innerBox}>
          {/* LOGO */}
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
          />

          {/* APP NAME */}
          <Text style={styles.appName}>ALGOSENZ</Text>

          {/* TITLE */}
          <Text style={styles.title}>
            Realtime solution to your tracking needs
          </Text>

          {/* SUBTITLE */}
          <Text style={styles.subtitle}>Temperature and Humidity</Text>

          {/* USERNAME */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#555"
            value={username}
            onChangeText={setUsername}
          />

          {/* PASSWORD */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#555"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity style={styles.btn} onPress={handleLoginWithAPI}>
            <Text style={styles.btnText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // CENTER EVERYTHING VERTICALLY
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  innerBox: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
    borderRadius: 20, // <-- ADD THIS
  },

  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#135CBE",
    marginBottom: 5,
  },

  title: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#135CBE",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    color: "#444",
    marginBottom: 20,
  },

  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  passwordContainer: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },

  btn: {
    backgroundColor: Colors.PRIMARY,
    width: "90%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LoginScreen;
