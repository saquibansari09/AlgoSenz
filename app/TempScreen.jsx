import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TempScreen() {
  const router = useRouter();
  const { id, status } = useLocalSearchParams(); // status will be "Normal", "Low", "High" from Home
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTemperatureColor = (temp, minTemp, maxTemp) => {
    if (
      typeof temp !== "number" ||
      typeof minTemp !== "number" ||
      typeof maxTemp !== "number"
    ) {
      return "#000"; // default black
    }

    if (temp < minTemp) return "#FFC000"; // 🔵 Low
    if (temp > maxTemp) return "red"; // 🔴 High
    return "green"; // 🟢 Normal
  };

  const getHumidityColor = (humidity, minHumidity, maxHumidity) => {
    if (
      typeof humidity !== "number" ||
      typeof minHumidity !== "number" ||
      typeof maxHumidity !== "number"
    ) {
      return "#000"; // default
    }

    if (humidity < minHumidity) return "#FFC000"; // 🟡 Low
    if (humidity > maxHumidity) return "red"; // 🔴 High
    return "green"; // 🟢 Normal
  };

  useEffect(() => {
    if (!id) return;

    const fetchDevices = async () => {
      setLoading(true);

      try {
        let url = "";

        if (status) {
          // Fetch temperature data based on the slice status
          url = `https://algotrack.in/webapiAlgosenztemp/api/Login/GetTemperatureDataByStatus?companyId=${id}&status=${status}`;
        } else {
          // If no status, fetch all vehicles
          url = `https://algotrack.in/webapiAlgosenztemp/api/Login/GetVehicleDataSummary?companyId=${id}`;
        }

        const response = await axios.get(url);
        const data = response.data;

        // Some APIs return array directly, some return object with allVehicles
        setDevices(data.allVehicles || data);
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [id, status]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF5733" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>
          Loading temperature data...
        </Text>
      </View>
    );
  }

  const customVehicle = devices; // already filtered by status

  return (
    <View style={{ flex: 1 }}>
      {/* 🔹 Header with Back Arrow and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Temperature</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {customVehicle?.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.detailsCard}>
              {/* Top row: Vehicle No + Date */}
              <View style={styles.topRow}>
                <Text style={styles.value}>
                  {item.registrationNo || item.vehicleNo}
                </Text>
                <Text style={styles.dateText}>
                  {item.lastUpdated || item.gpsDateTime}
                </Text>
              </View>

              {/* Location */}
              <Text style={styles.value}>{item.location}</Text>

              <View style={styles.fullLine} />

              {/* Temperature Sensor Table */}
              <View>
                <View style={[styles.row, styles.tableHeader]}>
                  <Text style={[styles.cell, styles.headerCell]}>
                    Sensor No.
                  </Text>
                  <Text style={[styles.cell, styles.headerCell]}>
                    Temperature
                  </Text>
                  <Text style={[styles.cell, styles.headerCell]}>Humidity</Text>
                </View>

                {[
                  {
                    sensorNo: "S1",
                    installed: item.temp1InstalledFlag === 1,
                    temp: item.temp1,
                    humidity: item.humidity1,
                  },
                  {
                    sensorNo: "S2",
                    installed: item.temp2InstalledFlag === 1,
                    temp: item.temp2,
                    humidity: item.humidity2,
                  },
                ].map((sensor, i) => {
                  if (!sensor.installed) return null;

                  const temp = sensor.temp;
                  const humidity = sensor.humidity;

                  // 🔹 Temperature color logic
                  // let tempColor = "#3e98fa";
                  // if (temp >= 30) tempColor = "orange";
                  // else if (temp >= 20) tempColor = "green";

                  // 🔹 Humidity color logic
                  // let humidityColor = "#FFC000";
                  // if (humidity >= 75 && humidity <= 95) humidityColor = "green";
                  // else if (humidity > 95) humidityColor = "red";

                  return (
                    <View key={i} style={styles.row}>
                      <Text style={styles.cell}>{sensor.sensorNo}</Text>
                      {/* <Text style={[styles.cell, { color: tempColor }]}>
                        {temp}°C
                      </Text> */}
                      <Text
                        style={[
                          styles.cell,
                          {
                            color: getTemperatureColor(
                              temp,
                              item.minTemp,
                              item.maxTemp,
                            ),
                          },
                        ]}
                      >
                        {typeof temp === "number" ? `${temp}°C` : "--"}
                      </Text>

                      <Text
                        style={[
                          styles.cell,
                          {
                            color: getHumidityColor(
                              humidity,
                              item.minHumidity,
                              item.maxHumidity,
                            ),
                          },
                        ]}
                      >
                        {typeof humidity === "number" ? `${humidity}%` : "--"}
                      </Text>
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  // 🔹 Header Style
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3e98fa",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backIcon: { marginRight: 10 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    elevation: 3,
  },
  fullLine: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 10,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: { fontSize: 12, fontWeight: "900", color: "#000" },
  dateText: { fontSize: 12, fontWeight: "bold", color: "#000" },

  tableHeader: { backgroundColor: "#f2f2f2" },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cell: { flex: 1, textAlign: "center", fontSize: 12, fontWeight: "bold" },
  headerCell: { fontWeight: "bold", fontSize: 12 },

  backButton: {
    backgroundColor: "#FF5733",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
});
