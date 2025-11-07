import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";

export default function ProfileUpdate() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleUpdate = () => {
    if (oldPassword !== "123456") {
      setError("Not match old password");
      return;
    }
    if (newPassword.trim() === "") {
      setError("Please enter new password");
      return;
    }
    setError("");
    alert("Profile updated successfully!");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Update</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../assets/images/1.jpg")}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>Aartiparab</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        {/* Old Password */}
        <Text style={styles.label}>Old Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter old password"
            secureTextEntry={!showPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity
            style={styles.iconInsideInput}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* Change Password */}
        <Text style={styles.label}>Change Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            style={styles.iconInsideInput}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Ionicons
              name={showNewPassword ? "eye-off" : "eye"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter Mobile Number"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="Enter Email Id"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateText}>UPDATE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 12,
    fontWeight: "600",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 16,
    padding: 6,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  form: {
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginTop: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    paddingRight: 40,
  },
  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  iconInsideInput: {
    position: "absolute",
    right: 10,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
  },
  updateButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  updateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
