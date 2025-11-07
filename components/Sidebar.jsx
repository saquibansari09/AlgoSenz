// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   Modal,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { Colors } from "../constants/Colors";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';

// const Sidebar = ({ isSidebarOpen, toggleSidebar, handleNavigation }) => {
//   const slideAnim = useRef(new Animated.Value(-200)).current;
//   const [reportsOpen, setReportsOpen] = useState(false); // 🔹 Toggle state for reports
//     const router = useRouter(); // ✅ FIX: Now router exists here


//   useEffect(() => {
//     Animated.timing(slideAnim, {
//       toValue: isSidebarOpen ? 0 : -200,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   }, [isSidebarOpen]);

//   // Main Sidebar Items
//   const mainMenu = [
//     { name: "Home", icon: "home" },
//     { name: "BMS", icon: "analytics" },
//     { name: "Dashboard", icon: "speedometer" },
//     { name: "Reports", icon: "document-text" },
//     { name: "Settings", icon: "settings" },
//     { name: "Admin", icon: "shield-checkmark" },
//     { name: "Contact", icon: "mail" },
//     { name: "Logout", icon: "log-out" },
//   ];

//  const reportItems = [
//   { name: "TemperatureReport", path: "/Reports/TemperatureReport" },
//   { name: "HumidityReport", path: "/Reports/HumidityReport" },
//   // { name: "SpeedReport", path: "/Reports/SpeedReport" },
//   // { name: "LocationEntry", path: "/Reports/LocationEntryExit" },
// ];

//   return (
//     <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
//       <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
//         <Ionicons name="close" size={28} color="white" />
//       </TouchableOpacity>

//       {mainMenu.map((item, index) => (
//         <View key={index}>
//           {item.name === "Reports" ? (
//             <>
//               {/* Reports Item with Arrow */}
//               <TouchableOpacity
//                 style={styles.sidebarItem}
//                 onPress={() => setReportsOpen(!reportsOpen)}
//               >
//                 <Ionicons name={item.icon} size={24} color="white" />
//                 <Text style={styles.sidebarText}>{item.name}</Text>
//                 <Ionicons
//                   name={reportsOpen ? "chevron-up" : "chevron-down"}
//                   size={20}
//                   color="white"
//                   style={{ marginLeft: "auto" }}
//                 />
//               </TouchableOpacity>

//               {/* Sub Report Items */}
//               {reportsOpen &&
//                 reportItems.map((report, i) => (
//                   <TouchableOpacity
//                     key={i}
//                     style={styles.subMenuItem}
//                     onPress={() => {
//                       router.push(report.path);  // ✅ Navigate to the new screen
//                       toggleSidebar(); // ✅ Close sidebar after navigation
//                     }}
//                   >
//                     <Text style={styles.subMenuText}>{report.name}</Text>
//                   </TouchableOpacity>
//                 ))}

//             </>
//           ) : (
//             <TouchableOpacity
//               style={styles.sidebarItem}
//               onPress={() => handleNavigation(item.name)}
//             >
//               <Ionicons name={item.icon} size={24} color="white" />
//               <Text style={styles.sidebarText}>{item.name}</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       ))}
//     </Animated.View>
//   );
// };

// const Sidebars = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const router = useRouter();

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//   const toggleProfileModal = () => setIsProfileModalOpen(!isProfileModalOpen);

//   const handleNavigation = async (page) => {
//     if (page === "Logout") {
//       Alert.alert("Logout", "Are you sure you want to logout?", [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Logout",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await AsyncStorage.removeItem("userInfo");
//               setIsSidebarOpen(false);
//               router.replace("/Login");
//             } catch (error) {
//               console.log("Logout error:", error);
//             }
//           },
//         },
//       ]);
//     } else {
//       router.push(`/${page}`);
//       setIsSidebarOpen(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Sidebar
//         isSidebarOpen={isSidebarOpen}
//         toggleSidebar={toggleSidebar}
//         handleNavigation={handleNavigation}
//       />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={toggleSidebar}>
//           <Ionicons name="menu" size={30} color="white" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={toggleProfileModal}>
//           <Ionicons name="person-circle-outline" size={30} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Profile Modal */}
//       <Modal transparent visible={isProfileModalOpen} animationType="slide">
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Profile</Text>
//             <Text style={styles.modalText}>Name: John Doe</Text>
//             <Text style={styles.modalText}>Email: johndoe@example.com</Text>
//             <TouchableOpacity
//               style={styles.closeModalButton}
//               onPress={toggleProfileModal}
//             >
//               <Text style={styles.closeModalText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", display: "contents" },
//   header: {
//     height: 90,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 25,
//     backgroundColor: Colors.PRIMARY,
//   },
//   sidebar: {
//     position: "absolute",
//     top: 70,
//     bottom: 0,
//     width: 200,
//     backgroundColor: Colors.PRIMARY,
//     paddingHorizontal: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 2, height: 2 },
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//     zIndex: 10,
//   },
//   closeButton: {
//     position: "absolute",
//     top: -15,
//     right: 10,
//   },
//   sidebarItem: {
//     marginTop: 25,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   sidebarText: {
//     fontSize: 16,
//     color: "white",
//     marginLeft: 10,
//   },
//   subMenuItem: {
//     marginLeft: 35,
//     marginTop: 10,
//   },
//   subMenuText: {
//     fontSize: 14,
//     color: "white",
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContainer: {
//     width: 300,
//     padding: 20,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   closeModalButton: {
//     marginTop: 20,
//     backgroundColor: "#30ae9f",
//     padding: 10,
//     borderRadius: 5,
//   },
//   closeModalText: {
//     color: "white",
//     fontSize: 16,
//   },
// });

// export default Sidebars;
