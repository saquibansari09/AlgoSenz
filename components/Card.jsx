// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   Pressable,
//   Platform,
// } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// const reports = [
//   {
//     id: 'summary',
//     title: 'Summary',
//     description:
//       'This report shows a detailed daily report of the vehicle...',
//   },
//   {
//     id: 'trip',
//     title: 'Trip',
//     description:
//       'This report shows daily vehicle distance covered with speed...',
//   },
//   {
//     id: 'stops__idle',
//     title: 'Stops / Idle',
//     description:
//       'This report shows the daily Stop/Idle status of vehicle...',
//   },
//   {
//     id: 'events',
//     title: 'Events',
//     description:
//       'This report shows vehicle events – ignition on/off, overspeed...',
//   },
//   {
//     id: 'positions',
//     title: 'Positions',
//     description:
//       'This report shows lat-longs of vehicle. The data shown is raw data...',
//   },
//   {
//     id: 'push_api_logs',
//     title: 'Push API logs',
//     description:
//       'This report shows the logs of push API calls made by the vehicle...',
//   },
//   {
//     id: 'stops_idle_modified',
//     title: 'Stops / Idle - Modified',
//     description:
//       'An enhanced version of the Stops/Idle report...',
//   },
//   {
//     id: 'master_report_2',
//     title: 'Master Report 2.0',
//     description:
//       'A comprehensive report combining multiple metrics...',
//   },
//   {
//     id: 'post_geofence',
//     title: 'Indian Post Geofence Report',
//     description:
//       'A geofence report specific to the Indian Post department...',
//   },
//   {
//     id: 'schedule_wise',
//     title: 'Schedule Wise Report',
//     description:
//       'This report provides analytics based on predefined schedules...',
//   },
//   {
//     id: 'gate_register',
//     title: 'Gate Register',
//     description:
//       'Tracks vehicle in/out movement from specified gates...',
//   },
//   {
//     id: 'driver_wise',
//     title: 'Driver Wise Report',
//     description:
//       'This report shows vehicle usage and performance...',
//   },
//   {
//     id: 'driver_report_dept',
//     title: 'DRIVER REPORT (DEPARTMENTAL)',
//     description:
//       'Tracks departmental drivers, shift adherence...',
//   },
// ];

// const ReportCard = ({ title, description, isDesktop }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <View style={[styles.card, isDesktop && styles.desktopShadow]}>
//       <Pressable
//         onHoverIn={() => setIsHovered(true)}
//         onHoverOut={() => setIsHovered(false)}
//         style={[
//           styles.iconCircle,
//           isHovered && styles.iconCircleHover,
//         ]}
//       >
//         <MaterialIcons name="description" size={28} color="#000" />
//       </Pressable>
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.description}>{description}</Text>
//     </View>
//   );
// };

// const ReportsScreen = () => {
//   const [searchText, setSearchText] = useState('');
//   const [cardsPerRow, setCardsPerRow] = useState(3);

//   useEffect(() => {
//     const updateLayout = () => {
//       const screenWidth = Dimensions.get('window').width;
//       if (screenWidth < 600) {
//         setCardsPerRow(1);
//       } else if (screenWidth < 900) {
//         setCardsPerRow(2);
//       } else {
//         setCardsPerRow(3);
//       }
//     };

//     updateLayout();
//     Dimensions.addEventListener('change', updateLayout);

//     return () => {
//       Dimensions.removeEventListener('change', updateLayout);
//     };
//   }, []);

//   const filteredReports = reports.filter((report) =>
//     report.title.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const groupedReports = [];
//   for (let i = 0; i < filteredReports.length; i += cardsPerRow) {
//     groupedReports.push(filteredReports.slice(i, i + cardsPerRow));
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Select a Report</Text>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search"
//         value={searchText}
//         onChangeText={setSearchText}
//         placeholderTextColor="#999"
//       />
//       <ScrollView contentContainerStyle={styles.cardList}>
//         {groupedReports.map((group, index) => (
//           <View style={styles.cardRow} key={index}>
//             {group.map((report) => (
//               <ReportCard
//                 key={report.id}
//                 title={report.title}
//                 description={report.description}
//                 isDesktop={cardsPerRow === 3}
//               />
//             ))}
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   searchInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//     marginBottom: 16,
//   },
//   cardList: {
//     paddingBottom: 16,
//   },
//   cardRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 16,
//     flexWrap: 'wrap',
//   },
//   card: {
//     flex: 1,
//     margin: 8,
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     minHeight: 250,
//     maxWidth: 300,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   desktopShadow: {
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   iconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#f0f0f0',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//     transitionDuration: '200ms',
//   },
//   iconCircleHover: {
//     backgroundColor: '#e0e0e0',
//     transform: [{ scale: 1.05 }],
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'center',
//   },
// });

// export default ReportsScreen;
