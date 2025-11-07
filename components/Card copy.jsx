// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Platform,
//   Dimensions,
// } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');
// const isMobile = width < 768; // To check if the screen is mobile

// const reports = [
//   {
//     id: 'summary',
//     title: 'Summary',
//     description:
//       'This report shows a detailed daily report of the vehicle. It includes parameters – geofence, ignitions (on/off & first/last), speed, distance, start/end address, motion time, idle time, stop time, average speed, max speed, ‘view on map’ is also available under this report.',
//   },
//   {
//     id: 'trip',
//     title: 'Trip',
//     description:
//       'This report shows daily vehicle distance covered with speed. It includes – duration, distance, average speed, max speed, start/end address, start/end time and ‘view on map’ is also available.',
//   },
//   {
//     id: 'stops__idle',
//     title: 'Stops / Idle',
//     description:
//       'This report shows the daily Stop/Idle status of vehicle and the duration. The minimum stop minutes can be changed as per requirement. It includes – type (stop/idle), duration, address, start and end time.',
//   },
//   {
//     id: 'events',
//     title: 'Events',
//     description:
//       'This report shows vehicle events – ignition on/off, overspeed, geofence (enter/exit), low battery, power on/off, sos, powercut, vibration, shock, tow, tampering, crash, power restored, harsh acceleration, harsh cornering and harsh braking.',
//   },
//   {
//     id: 'positions',
//     title: 'Positions',
//     description:
//       'This report shows lat-longs of vehicle. The data shown is raw data and works with only single selection of a vehicle at a time. The reports shows – speed, ignition, distance, motion, coords, address, GPS time, server time, device time, external power, temperature.',
//   },
//   {
//     id: 'push_api_logs',
//     title: 'Push API logs',
//     description:
//       'This report shows the logs of push API calls made by the vehicle. You can verify if the data has been sent and received properly.',
//   },
//   {
//     id: 'stops_idle_modified',
//     title: 'Stops / Idle - Modified',
//     description:
//       'An enhanced version of the Stops/Idle report with filters for specific durations and location types.',
//   },
//   {
//     id: 'master_report_2',
//     title: 'Master Report 2.0',
//     description:
//       'A comprehensive report combining multiple metrics like distance, events, stops, and routes into one.',
//   },
//   {
//     id: 'post_geofence',
//     title: 'Indian Post Geofence Report',
//     description:
//       'A geofence report specific to the Indian Post department with custom zones and timing rules.',
//   },
//   {
//     id: 'schedule_wise',
//     title: 'Schedule Wise Report',
//     description:
//       'This report provides analytics based on predefined schedules and deviations.',
//   },
//   {
//     id: 'gate_register',
//     title: 'Gate Register',
//     description:
//       'Tracks vehicle in/out movement from specified gates with timestamps and authorization.',
//   },
//   {
//     id: 'driver_wise',
//     title: 'Driver Wise Report',
//     description:
//       'This report shows vehicle usage and performance mapped against assigned drivers.',
//   },
//   {
//     id: 'driver_report_dept',
//     title: 'DRIVER REPORT (DEPARTMENTAL)',
//     description:
//       'Tracks departmental drivers, shift adherence, and vehicle usage to ensure discipline and accountability.',
//   },
// ];

// const ReportCard = ({ title, description }) => (
//   <TouchableOpacity style={styles.card}>
//     <View style={styles.header}>
//       <MaterialIcons name="description" size={24} color="#000" style={styles.icon} />
//       <Text style={styles.title}>{title}</Text>
//     </View>
//     <Text style={styles.description}>{description}</Text>
//   </TouchableOpacity>
// );

// const ReportsScreen = () => {
//   const [searchText, setSearchText] = useState('');

//   const filteredReports = reports.filter((report) =>
//     report.title.toLowerCase().includes(searchText.toLowerCase())
//   );

//   // Group into rows of 3 for tablets/desktops, else single for mobile
//   const groupSize = isMobile ? 1 : 3;
//   const groupedReports = [];
//   for (let i = 0; i < filteredReports.length; i += groupSize) {
//     groupedReports.push(filteredReports.slice(i, i + groupSize));
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
//     justifyContent: isMobile ? 'center' : 'space-between', // Align centrally for mobile
//     marginBottom: 16,
//     flexWrap: 'wrap',
//   },
//   card: {
//     width: isMobile ? '100%' : '31%', // 100% width for mobile, 31% for desktop/tablet
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     minHeight: 250,
//     justifyContent: 'flex-start',
//     marginBottom: 16,
//     shadowColor: '#000', // Unified shadow color for both platforms
//     ...Platform.select({
//       ios: {
//         shadowOffset: { width: 0, height: 6 },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 8, // Stronger shadow effect for Android
//       },
//     }),
//   },
  
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   icon: {
//     marginRight: 8,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   description: {
//     fontSize: 14,
//     color: '#555',
//     marginTop: 8,
//   },
// });

// export default ReportsScreen;
