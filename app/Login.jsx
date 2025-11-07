import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { Colors } from "../constants/Colors";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Updated login logic using working API
  const handleLoginWithAPI = async () => {
    if (!username || !password) {
      Alert.alert("Validation Error", "Please enter both username and password");
      return;
    }

    try {
      const url = `https://algotrack.in/webapiAlgosenztemp/api/Login/IsValidUser?userName=${encodeURIComponent(
        username
      )}&passWord=${encodeURIComponent(password)}`;

      console.log("🌐 Request URL:", url);
      const response = await axios.get(url);
      console.log("✅ API Raw Response:", response.data);

      // ✅ Success if userID exists
      if (response.data && response.data.userID) {
        await AsyncStorage.setItem("userInfo", JSON.stringify(response.data));
        Alert.alert("Login Successful", `Welcome ${response.data.companyName || ""}!`);
        console.log("✅ User Info Saved:", response.data);
        router.replace("/Home");
      } else {
        Alert.alert("Login Failed", "Invalid username or password.");
        console.log("❌ Invalid login response:", response.data);
      }
    } catch (error) {
      console.error("❌ API Error:", error?.response || error);
      Alert.alert(
        "Login Error",
        error.response
          ? `Server returned ${error.response.status} - ${error.response.statusText}`
          : "Something went wrong during login."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Add logo if needed */}
        {/* <Image
          source={require("../assets/images/img-remove.png")}
          style={styles.image}
        /> */}
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.heading}>
          Your Ultimate
          <Text style={styles.highlight}> Vehicle App</Text>
        </Text>
        <Text style={styles.description}>
          Find your favorite near and post your own {"\n"}business to your Vehicle
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />

        {/* ✅ Password input with toggle eye icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleLoginWithAPI}>
          <Text style={styles.btnText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  subContainer: {
    padding: 20,
    marginTop: -20,
    alignItems: "center",
  },
  heading: {
    fontSize: 25,
    fontFamily: "SpaceMono-Regular",
    textAlign: "center",
  },
  highlight: {
    color: Colors.PRIMARY,
  },
  description: {
    fontSize: 15,
    fontFamily: "SpaceMono-Regular",
    marginVertical: 5,
    color: Colors.GRAY,
    textAlign: "center",
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
  btn: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "SpaceMono-Regular",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: {
    padding: 5,
  },
});

export default LoginScreen;
