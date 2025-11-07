// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   useWindowDimensions,
// } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';

// const batteryData = [

//   {
//     icon: require('../assets/images/soc.webp'),
//     label: 'STATE OF CHARGE',
//     value: '%',
//   },
//   {
//     icon: require('../assets/images/image.png'),
//     label: 'VOLTAGE',
//     value: 'V',
//   },
//   {
//     icon: require('../assets/images/current.png'),
//     label: 'CURRENT',
//     value: 'A',
//   },
//   {
//     icon: require('../assets/images/battery_temp.png'),
//     label: 'TEMPERATURE',
//     value: '℃',
//   },
//   // {
//   //   icon: require('../assets/images/cell_voltage_min.png'),
//   //   label: 'MINIMUM CELL VOLTAGE',
//   //   value: 'V',
//   // },
//   // 
//   // {
//   //   icon: require('../assets/images/battery_temp.png'),
//   //   label: 'MINIMUM CELL TEMPERATURE',
//   //   value: '℃',
//   // },
  
// ];

// const BatteryInfoCards = () => {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 600;

//   const getCardWidth = () => {
//     if (isMobile) return '95%';
//     if (width >= 1200) return '23%';
//     return '47%';
//   };

//   const chartConfig = {
//     backgroundGradientFrom: '#fff',
//     backgroundGradientTo: '#fff',
//     decimalPlaces: 2,
//     color: (opacity = 1) => `rgba(255, 86, 52, ${opacity})`, // labels color
//     labelColor: () => '#333',
//     propsForDots: {
//       r: '0',
//     },
//     propsForBackgroundLines: {
//       strokeDasharray: '', // solid horizontal lines
//     },
//     strokeWidth: 2,
//   };

//   const voltageData = {
//     labels: ['1', '2', '3', '4', '5', '6'],
//     datasets: [{ data: [3.7, 3.8, 3.6, 3.9, 4.0, 3.85] }],
//   };

//   const temperatureData = {
//     labels: ['1', '2', '3', '4', '5', '6'],
//     datasets: [{ data: [30, 32, 33, 31, 34, 35] }],
//   };

//   return (
//     <ScrollView contentContainerStyle={[styles.container, isMobile && styles.mobileContainer]}>
//       {batteryData.map((item, index) => (
//         <View
//           key={index}
//           style={[
//             styles.cardContainer,
//             { width: getCardWidth(), marginHorizontal: isMobile ? 0 : 6 },
//           ]}
//         >
//           <View style={styles.card}>
//             <Image source={item.icon} style={styles.icon} resizeMode="contain" />
//             <Text style={styles.heading}>{item.label}</Text>
//             <Text style={styles.value}>{item.value}</Text>
//           </View>
//         </View>
//       ))}

//       {/* Voltage Graph */}
//       <Text style={styles.graphTitle}>Voltage Graph</Text>
//       <View style={styles.horizontalLine} />
//       <LineChart
//         data={voltageData}
//         width={width - 32}
//         height={220}
//         chartConfig={chartConfig}
//         withDots={false}
//         withHorizontalLines={true}   // show horizontal lines
//         withVerticalLines={false}    // hide vertical lines
//         style={styles.chart}
//         lineColor={() => 'transparent'}  // hide zig-zag line
//         withShadow={false}

//       />

//       {/* Temperature Graph */}
//       <Text style={styles.graphTitle}>Temperature Graph</Text>
//       <View style={styles.horizontalLine} />
//       <LineChart
//         data={temperatureData}
//         width={width - 32}
//         height={220}
//         chartConfig={chartConfig}
//         withDots={false}
//         withHorizontalLines={true}   // show horizontal lines
//         withVerticalLines={false}    // hide vertical lines
//         style={styles.chart}
//         lineColor={() => 'transparent'}  // hide zig-zag line
//         withShadow={false}

//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: 12,
//     paddingBottom: 40,
//   },
//   mobileContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardContainer: {
//     marginTop: 16,
//     marginBottom: 16,
//     backgroundColor: '#fff',
//     borderColor: '#e6e6e6',
//     borderWidth: 1,
//     borderRadius: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 150,
//   },
//   icon: {
//     width: 45,
//     height: 45,
//     marginBottom: 8,
//   },
//   heading: {
//     textAlign: 'center',
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#333',
//   },
//   value: {
//     marginTop: 12,
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   graphTitle: {
//     width: '100%',
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 20,
//     marginBottom: 10,
//     color: '#333',
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 10,
//     alignSelf: 'center',
//   },
//   horizontalLine: {
//     width: '90%',
//     height: 1,
//     backgroundColor: 'black',
//     alignSelf: 'center',
//     marginBottom: 8,
//   },
// });

// export default BatteryInfoCards;
