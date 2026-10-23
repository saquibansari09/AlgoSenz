import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function UpdatePasswordScreen() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [errors, setErrors] = useState({});

  // ⭐⭐⭐ VALIDATION WITHOUT ALERT — INLINE ERROR ⭐⭐⭐
  const validateInputs = () => {
    let temp = {};

    if (!oldPassword) temp.oldPassword = "Old password is required";
    else if (oldPassword.length < 4)
      temp.oldPassword = "Minimum 4 characters required";

    if (!newPassword) temp.newPassword = "New password is required";
    else if (newPassword.length < 4)
      temp.newPassword = "Minimum 4 characters required";

    if (!mobile) temp.mobile = "Mobile number is required";
    else if (mobile.length !== 10 || !/^[0-9]+$/.test(mobile))
      temp.mobile = "Enter valid 10 digit mobile number";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) temp.email = "Email is required";
    else if (!emailRegex.test(email)) temp.email = "Invalid email address";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };
  // ⭐⭐⭐ END VALIDATION ⭐⭐⭐

  const handleUpdate = async () => {
    if (!validateInputs()) return;

    try {
      const companyID = await AsyncStorage.getItem("companyId");

      const body = {
        CompanyID: companyID,
        OldPassword: oldPassword,
        NewPassword: newPassword,
        NewMobileNo: mobile,
        NewEmailId: email,
      };

      await axios.post(
        "https://www.algotrack.in/webapiAlgosenztemp/api/Login/PostUpdatePassword",
        body,
        { headers: { "Content-Type": "application/json" } },
      );

      // ✅ Show success alert instead of setSuccess
      Alert.alert("Success", "Password updated successfully!");

      // Optional: clear fields after update
      setOldPassword("");
      setNewPassword("");
      setMobile("");
      setEmail("");
      setErrors({});
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Update Password</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* CONTENT */}
      <View style={styles.container}>
        {/* LOGO */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.logo}
          />
        </View>

        {/* OLD PASSWORD */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="gray"
            style={styles.leftIcon}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Old Password"
            placeholderTextColor="#555" // ✅ Light gray placeholder
            secureTextEntry={!showOld}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity onPress={() => setShowOld(!showOld)}>
            <Ionicons
              name={showOld ? "eye-off" : "eye"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {errors.oldPassword && (
          <Text style={styles.error}>{errors.oldPassword}</Text>
        )}

        {/* NEW PASSWORD */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-open-outline"
            size={20}
            color="gray"
            style={styles.leftIcon}
          />
          <TextInput
            style={styles.inputField}
            placeholder="New Password"
            placeholderTextColor="#555" // ✅ Light gray placeholder
            secureTextEntry={!showNew}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNew(!showNew)}>
            <Ionicons
              name={showNew ? "eye-off" : "eye"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {errors.newPassword && (
          <Text style={styles.error}>{errors.newPassword}</Text>
        )}

        {/* MOBILE */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="call-outline"
            size={20}
            color="gray"
            style={styles.leftIcon}
          />
          <TextInput
            style={styles.inputField}
            placeholder="New Mobile No"
            placeholderTextColor="#555" // ✅ Light gray placeholder
            value={mobile}
            onChangeText={setMobile}
            keyboardType="numeric"
          />
        </View>
        {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}

        {/* EMAIL */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="gray"
            style={styles.leftIcon}
          />
          <TextInput
            style={styles.inputField}
            placeholder="New Email"
            placeholderTextColor="#555" // ✅ Light gray placeholder
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        {/* UPDATE BUTTON */}
        <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },

  backButton: {
    marginTop: 10,
    width: 40,
  },

  root: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#80acdb",
    paddingHorizontal: 16,
    paddingVertical: 14,
    columnGap: 12,
  },

  headerTitle: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
  },

  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    borderWidth: 3,
    borderColor: "#80acdb",
    resizeMode: "cover",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 5,
  },

  inputField: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    color: "#000", // ✅ TEXT COLOR BLACK
  },

  leftIcon: {
    marginRight: 10, // Left icon aur text ke beech ka space
  },

  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 8, // gap between input fields
  },

  btn: {
    backgroundColor: "#80acdb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: { color: "#000", fontSize: 15, fontWeight: "bold" },
});
