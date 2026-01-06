import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function DeviceScreen() {
  const router = useRouter();
  const { id, status } = useLocalSearchParams();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDevices = async () => {
      setLoading(true);
      const url = status
        ? `https://algotrack.in/webapiAlgosenztemp/api/Login/GetHumidityData?companyid=${id}&status=${status}`
        : `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetVehicleDataSummary?companyId=${id}`;

      try {
        const response = await axios.get(url);
        const data = response.data;
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [id, status]);

  const customVehicle = status ? devices : devices?.allVehicles;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, fontSize: 16, color: '#333' }}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 🔹 Header with back arrow and title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Humidity</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {customVehicle?.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.detailsCard}>
              {/* 🟩 Top row format: Registration left, Date right */}
              <View style={styles.topRow}>
                <Text style={styles.value}>{item.registrationNo || item.vehicleNo}</Text>
                <Text style={styles.dateText}>{item.lastUpdated || item.gpsDateTime}</Text>
              </View>

              {/* 🟩 Location on a separate line */}
              <Text style={styles.value}>{item.location}</Text>

              <View style={styles.fullLine} />

              {/* Sensor Table */}
              <View>
                <View style={[styles.row, styles.tableHeader]}>
                  <Text style={[styles.cell, styles.headerCell]}>Sensor No.</Text>
                  <Text style={[styles.cell, styles.headerCell]}>Temperature</Text>
                  <Text style={[styles.cell, styles.headerCell]}>Humidity</Text>
                </View>

               {[
  {
    sensorNo: 'S1',
    installed: item.temp1InstalledFlag === 1,   // ⭐ ADDED
    temp: item.temp1,
    humidity: item.humidity1,
  },
  {
    sensorNo: 'S2',
    installed: item.temp2InstalledFlag === 1,   // ⭐ ADDED
    temp: item.temp2,
    humidity: item.humidity2,
  },
].map((sensor, i) => {
  if (!sensor.installed) return null;            // ⭐ ADDED

  const temp = sensor.temp;
  const humidity = sensor.humidity;


                    // 🔹 Color logic Color logic humidity and temperaure
                  let tempColor = '#3e98fa';
                  if (temp >= 30) tempColor = 'orange';
                  else if (temp >= 20) tempColor = 'green';

                  let humidityColor = ''; // default < 75

                  if (humidity >= 75 && humidity <= 95) {
                    humidityColor = 'green';
                  } else if (humidity > 95) {
                    humidityColor = 'red';
                  }else if(humidity < 75)
                  {
                    humidityColor = '#FFC000';
                  }


                  return (
                  <View key={i} style={styles.row}>
  <Text style={styles.cell}>{sensor.sensorNo}</Text>   
  <Text style={[styles.cell, { color: tempColor }]}>{temp}°C</Text>
  <Text style={[styles.cell, { color: humidityColor }]}>{humidity}%</Text>
</View>
                  );
                })}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },

  // 🔹 Header Style
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3e98fa',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backIcon: { marginRight: 10 },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  card: { backgroundColor: '#f8f8f8', borderRadius: 10, padding: 15, marginBottom: 10, elevation: 2 },
  detailsCard: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginTop: 10, elevation: 3 },
  fullLine: { height: 1, backgroundColor: '#ccc', width: '100%', marginVertical: 10 },

  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  value: { fontSize: 12, fontWeight: '900', color: '#000' },
  dateText: { fontSize: 12, fontWeight: 'bold', color: '#000' },

  tableHeader: { backgroundColor: '#f2f2f2' },
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  cell: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 'bold' },
  headerCell: { fontWeight: 'bold', fontSize: 12 },
});
