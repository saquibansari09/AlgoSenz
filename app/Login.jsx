import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
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

      await AsyncStorage.removeItem("companyId");
      await AsyncStorage.setItem("companyId", String(companyId));
      console.log("✅ SAVED companyId:", companyId);

      await new Promise((resolve) => setTimeout(resolve, 300));

      Alert.alert("Login Successful", `Welcome ${resp.companyName || ""}`);
      router.replace("/Home");
    } catch (error) {
      Alert.alert("Login Error", "Something went wrong.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.innerBox}>
            {/* LOGO */}
            <Image
              source={require("../assets/images/Logo.png")}
              style={styles.logo}
            />

            {/* TITLE */}
            <Text style={styles.title}>Cold-Chain IoT & Automation</Text>

            {/* SUBTITLE */}
            <Text style={styles.subtitle}>Temperature & Rh Monitoring</Text>

            {/* USERNAME WITH ICON */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Username"
                placeholderTextColor="#555"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD WITH ICON */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  innerBox: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 200,
    height: 60,
    borderRadius: 20,
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

  inputContainer: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Background image par inputs clean dikhe isliye
  },

  inputIcon: {
    marginRight: 10,
  },

  inputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
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
