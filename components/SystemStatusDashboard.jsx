// // components/SystemStatusDashboard.js
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import * as Battery from 'expo-battery';
// import { PieChart } from 'react-native-chart-kit';
// import RNPickerSelect from 'react-native-picker-select';

// const screenWidth = Dimensions.get('window').width;

// export default function SystemStatusDashboard() {
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [batteryLevel, setBatteryLevel] = useState(null);
//   const [isCharging, setIsCharging] = useState(null);

//   const batteryDetails = {
//     production_date: '19-12-2023',
//     label: 'Demo Label',
//     capacity: '100Ah',
//     manufacturer: 'ABC Batteries',
//     battery_type: 'Lithium-Ion',
//     rating: '4.5 Stars',
//   };

//   useEffect(() => {
//     const fetchBatteryInfo = async () => {
//       try {
//         const level = await Battery.getBatteryLevelAsync();
//         const batteryState = await Battery.getBatteryStateAsync();

//         setBatteryLevel(level);
//         setIsCharging(batteryState === Battery.BatteryState.CHARGING || batteryState === Battery.BatteryState.FULL);
//       } catch (error) {
//         console.error('Error fetching battery info:', error);
//       }
//     };

//     fetchBatteryInfo();
//   }, []);

//   const pieData = [
//     {
//       name: 'Charging',
//       population: isCharging ? 1 : 0,
//       color: '#4CAF50',
//       legendFontColor: '#7F7F7F',
//       legendFontSize: 15,
//     },
//     {
//       name: 'Discharging',
//       population: isCharging === false ? 1 : 0,
//       color: '#F44336',
//       legendFontColor: '#7F7F7F',
//       legendFontSize: 15,
//     },
//   ];

//   const getBatteryDetails = (value) => {
//     setSelectedVehicle(value);
//     // API call logic can go here
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.heading}>System Status Dashboard</Text>

//       <View style={styles.card}>
//         <Text style={styles.label}>Select Vehicle</Text>
//         <RNPickerSelect
//           onValueChange={(value) => getBatteryDetails(value)}
//           placeholder={{ label: 'Select Vehicle', value: null }}
//           items={[
//             { label: '864356064376214', value: '65376' },
//             // Add more vehicles if needed
//           ]}
//           style={pickerSelectStyles}
//         />
//       </View>

//       {selectedVehicle && (
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Image source={require('../assets/images/images-car.jpg')} style={styles.icon} />
//             <Text style={styles.cardTitle}>BATTERY</Text>
//           </View>

//           <View style={styles.infoRow}>
//             <View style={styles.col}>
//               <Text style={styles.info}><Text style={styles.label}>Label: </Text>{batteryDetails.label}</Text>
//               <Text style={styles.info}><Text style={styles.label}>Production Date: </Text>{batteryDetails.production_date}</Text>
//               <Text style={styles.info}><Text style={styles.label}>Capacity: </Text>{batteryDetails.capacity}</Text>
//             </View>
//             <View style={[styles.col, styles.rightCol]}>
//               <Text style={styles.info}><Text style={styles.label}>Manufacturer: </Text>{batteryDetails.manufacturer}</Text>
//               <Text style={styles.info}><Text style={styles.label}>Battery Type: </Text>{batteryDetails.battery_type}</Text>
//               <Text style={styles.info}><Text style={styles.label}>Rating: </Text>{batteryDetails.rating}</Text>
//             </View>
//           </View>
//         </View>
//       )}

//       <View style={styles.card}>
//         <Text style={styles.label}>
//           Battery Level: {batteryLevel !== null ? `${(batteryLevel * 100).toFixed(0)}%` : 'Loading...'}
//         </Text>
//         <Text style={styles.label}>
//           Charging: {isCharging !== null ? (isCharging ? 'Yes' : 'No') : 'Loading...'}
//         </Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.label}>Charging Status</Text>
//         <PieChart
//           data={pieData}
//           width={screenWidth - 40}
//           height={220}
//           chartConfig={{
//             backgroundColor: '#ffffff',
//             backgroundGradientFrom: '#ffffff',
//             backgroundGradientTo: '#ffffff',
//             decimalPlaces: 0,
//             color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
//           }}
//           accessor="population"
//           backgroundColor="transparent"
//           paddingLeft="15"
//         />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f0f2f5',
//     flex: 1,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//     elevation: 3,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//     fontWeight: 'bold',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   icon: {
//     width: 24,
//     height: 24,
//     marginRight: 10,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   col: {
//     flex: 1,
//   },
//   rightCol: {
//     marginLeft: 20,
//   },
//   info: {
//     fontSize: 14,
//     marginBottom: 5,
//   },
// });

// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 4,
//     color: 'black',
//     paddingRight: 30,
//     backgroundColor: '#f9f9f9',
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 4,
//     color: 'black',
//     paddingRight: 30,
//     backgroundColor: '#f9f9f9',
//   },
// });
