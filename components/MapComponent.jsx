// import React from 'react';
// import { StyleSheet, View, Text, Linking, Platform, Pressable } from 'react-native';

// const locations = [
//   {
//     id: 1,
//     title: 'Navi Mumbai Office',
//     description: 'Sector 30A, Vashi',
//     latitude: 19.0771,
//     longitude: 72.9981,
//   },
// ];

// export default function App() {
//   return (
//     <View style={styles.container}>
//       {locations.map((loc) => (
//         <View key={loc.id} style={styles.card}>
//           <Text style={styles.title}>{loc.title}</Text>
//           <Text style={styles.description}>{loc.description}</Text>
//           <Text style={styles.coordinates}>
//             📍 Latitude: {loc.latitude}, Longitude: {loc.longitude}
//           </Text>

//           <Pressable
//             style={styles.button}
//             onPress={() =>
//               Linking.openURL(
//                 `https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`
//               )
//             }
//           >
//             <Text style={styles.buttonText}>Open in Google Maps</Text>
//           </Pressable>
//         </View>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e6e6e6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     marginVertical: 10,
//     width: '100%',
//     maxWidth: 400,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#0e1626',
//     marginBottom: 5,
//   },
//   description: {
//     fontSize: 16,
//     color: '#3a4762',
//     marginBottom: 10,
//   },
//   coordinates: {
//     fontSize: 14,
//     color: '#1d2c4d',
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 6,
//     alignSelf: 'flex-start',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });
