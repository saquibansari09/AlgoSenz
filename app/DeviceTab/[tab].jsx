import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const tabs = ["All", "Reporting", "Delayed", "Critical"];
const ranges = ["Today", "7 Days"];

export default function DeviceTab() {
  const [searchText, setSearchText] = useState("");
  const { tab } = useLocalSearchParams();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedRange, setSelectedRange] = useState("Today");
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [activeMetric, setActiveMetric] = useState("temp1");
  const reversedChartData = [...chartData].reverse(); // 🔥 MUST

  const getHumidityColor = (humidity) => {
  if (typeof humidity !== "number") return "#000";

  if (humidity > 95) return "red";        // 🔴 Critical
  if (humidity >= 75) return "green";     // 🟢 Normal
  return "#FFC000";                       // 🟡 Low
};


  
  const escapeRegExp = (string = "") =>
    string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  const highlightText = (text, query) => {
    if (!query) return <Text>{text}</Text>;
    try {
      const safe = escapeRegExp(query);
      const parts = text.split(new RegExp(`(${safe})`, "gi"));
      return (
        <Text>
          {parts.map((part, index) => (
            <Text
              key={index}
              style={
                part.toLowerCase() === query.toLowerCase()
                  ? { backgroundColor: "yellow", fontWeight: "bold" }
                  : {}
              }
            >
              {part}
            </Text>
          ))}
        </Text>
      );
    } catch {
      return <Text>{text}</Text>;
    }
  };

  // Fetch devices dynamically
  useEffect(() => {
    let mounted = true;

    const fetchDevices = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userInfo");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const companyId = parsedUser?.companyID;

        if (!companyId) {
          console.warn("No company ID found. Please log in again.");
          if (mounted) setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetVehicleDataSummary?companyId=${companyId}`
        );

        const data = response.data || {};
        const allVehicles = data.allVehicles || [];
        const reporting = data.reportingVehicles || [];
        const delayed = data.delayedVehicles || [];

       const allDevices = allVehicles.map((item) => {
  const regNo = item.registrationNo?.trim().toLowerCase();
  let status = "Critical";

  if (
    reporting.some(
      (v) => v.registrationNo?.trim().toLowerCase() === regNo
    )
  ) {
    status = "Reporting";
  } else if (
    delayed.some(
      (v) => v.registrationNo?.trim().toLowerCase() === regNo
    )
  ) {
    status = "Delayed";
  }

  // 🔹 Dynamic sensors array
  const sensors = [];

  // S1
  if (item.temp1InstalledFlag === 1) {
    sensors.push({
      sensorNo: "S1",
      temperature:
        item.temp1 !== undefined && item.temp1 !== null ? +item.temp1 : "--",
      humidity:
        item.humidity1 !== undefined && item.humidity1 !== null
          ? +item.humidity1
          : "--",
    });
  }

  // S2
  if (item.temp2InstalledFlag === 1) {
    sensors.push({
      sensorNo: "S2",
      temperature:
        item.temp2 !== undefined && item.temp2 !== null ? +item.temp2 : "--",
      humidity:
        item.humidity2 !== undefined && item.humidity2 !== null
          ? +item.humidity2
          : "--",
    });
  }

  return {
    deviceNumber: item.registrationNo || "",
    location: item.location || "",
    dateTime: item.gpsDateTime || item.lastUpdated || "",
    sensors, // ✅ only installed sensors
    status,


     // ✅ ADD THESE (if not already)
    temp1InstalledFlag: item.temp1InstalledFlag,
    temp2InstalledFlag: item.temp2InstalledFlag,
  };
});


        if (mounted) setDevices(allDevices);
      } catch (error) {
        console.error("❌ Error fetching devices:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDevices();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (tab) {
      const formattedTab = tab.charAt(0).toUpperCase() + tab.slice(1).trim();
      setActiveTab(formattedTab);
    }
  }, [tab]);

  // Fetch chart data
  const fetchChartData = async (registrationNo, range) => {
    try {
      setChartLoading(true);
      const today = new Date();
      const startDate = new Date(today);

      if (range === "7 Days") startDate.setDate(today.getDate() - 6);
      if (range === "1 Month") startDate.setDate(today.getDate() - 30);
      if (range === "3 Months") startDate.setDate(today.getDate() - 90);

      const formatDate = (d) => d.toISOString().split("T")[0];

      const url = "https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetGraphReport";

      const params = {
        registrationNo: registrationNo,
        startDate: formatDate(startDate),
        endDate: formatDate(today),
      };

      const res = await axios.get(url, { params });
      const arr = Array.isArray(res.data) ? res.data : [];

      if (arr.length > 0) {
        setChartData(
          arr.map((item, idx) => ({
            temp1: parseFloat(item.temp1) || 0,
            temp2: parseFloat(item.temp2) || 0,
            humidity1: parseFloat(item.humidity1) || 0,
            humidity2: parseFloat(item.humidity2) || 0,
            label: item.gpsDateTime?.substring(11, 16) || `#${idx + 1}`,
          }))
        );
      } else {
        setChartData([]);
      }
    } catch (e) {
      console.error("Chart Fetch Error:", e);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCardIndex !== null && devices[selectedCardIndex]) {
      fetchChartData(devices[selectedCardIndex].deviceNumber, selectedRange);
    }
  }, [selectedRange, selectedCardIndex, devices]);

  const filteredDevices = devices.filter((d) => {
    const tabStatus = activeTab.trim().toLowerCase();
    const deviceStatus = d.status.trim().toLowerCase();
    const matchesTab = tabStatus === "all" || tabStatus === deviceStatus;
    const matchesSearch = d.deviceNumber
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tabName) => (
          <TouchableOpacity
            key={tabName}
            style={[styles.tabButton, activeTab === tabName && styles.activeTab]}
            onPress={() => setActiveTab(tabName)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tabName && styles.activeTabText,
              ]}
            >
              {tabName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.topBar}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Registration No"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Cards */}
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {filteredDevices.length > 0 ? (
          filteredDevices.map((item, index) => (
            <View key={index} style={styles.cardContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.card,
                  item.status === "Reporting"
                    ? { borderLeftColor: "#00C853" }
                    : item.status === "Delayed"
                    ? { borderLeftColor: "#FFB300" }
                    : { borderLeftColor: "#D32F2F" },
                ]}
                onPress={() =>
                  setSelectedCardIndex(
                    selectedCardIndex === index ? null : index
                  )
                }
              >
                <View style={styles.detailsCard}>
                  <View style={styles.detailsRow}>
                    <View style={styles.column}>
                      <Text style={styles.value}>
                        {highlightText(item.deviceNumber || "-", searchText)}
                      </Text>
                      <Text style={styles.value}>
                        {item.location || "No location"}
                      </Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.value}>
                        {item.dateTime || "No date"}
                      </Text>
                    </View>
                  </View>

                  {/* Sensor Table */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 8 }}
                  >
                    <View>
                      <View style={[styles.row, styles.tableHeader]}>
                        <Text style={[styles.cell, styles.headerCell]}>
                          Sensor No.
                        </Text>
                        <Text style={[styles.cell, styles.headerCell]}>
                          Temperature
                        </Text>
                        <Text style={[styles.cell, styles.headerCell]}>
                          Humidity
                        </Text>
                      </View>

                      {item.sensors.map((data, idx) => (
                        <View
                          key={data.sensorNo + idx}
                          style={[
                            styles.row,
                            { backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff" },
                          ]}
                        >
                          <Text style={styles.cell}>{data.sensorNo}</Text>
                          <Text style={[styles.cell, { color: "#ff5634" }]}>
                            {typeof data.temperature === "number"
                              ? `${data.temperature}°C`
                              : "--"}
                          </Text>
                          <Text style={[styles.cell, { color: getHumidityColor(data.humidity) }]}>
                            {typeof data.humidity === "number"
                              ? `${data.humidity}%`
                              : "--"}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </TouchableOpacity>

              {/* Chart Section */}
              {selectedCardIndex === index && (
                <View style={styles.chartContainer}>
                 <Text style={styles.chartTitle}>
  {activeMetric.includes("temp")
    ? "Temperature Graph (°C)"
    : "Humidity Graph (%)"}
</Text>


                  {/* Range Buttons */}
                 {/* Range Buttons */}
{/* Range Buttons */}
<View style={styles.toggleRow}>
  {ranges.map((range) => (
    <TouchableOpacity
      key={range}
      style={[
        styles.toggleButton, // same style as temp/hum buttons
        selectedRange === range && { backgroundColor: "#3e98fa" }, // active color
      ]}
      onPress={() => setSelectedRange(range)}
    >
      <Text
        style={[
          styles.toggleText, // same text style
          selectedRange === range && { fontWeight: "bold" },
        ]}
      >
        {range.toUpperCase()}
      </Text>
    </TouchableOpacity>
  ))}
</View>



                  {/* Toggle Buttons */}
                <View style={styles.toggleRow}>
  {(() => {
    const device = devices[selectedCardIndex];

    const buttons = [];

    // 🔹 TEMP 1 & HUM 1
    if (device?.temp1InstalledFlag === 1) {
      buttons.push(
        { key: "temp1", label: "TEMP 1", color: "#ff5634" },
        { key: "humidity1", label: "HUM 1", color: "#00C853" }
      );
    }

    // 🔹 TEMP 2 & HUM 2
    if (device?.temp2InstalledFlag === 1) {
      buttons.push(
        { key: "temp2", label: "TEMP 2", color: "#4fc3f7" },
        { key: "humidity2", label: "HUM 2", color: "#FFB300" }
      );
    }

    return buttons.map((item) => (
      <TouchableOpacity
        key={item.key}
        style={[
          styles.toggleButton,
          activeMetric === item.key && { backgroundColor: item.color },
        ]}
        onPress={() => setActiveMetric(item.key)}
      >
        <Text style={styles.toggleText}>{item.label}</Text>
      </TouchableOpacity>
    ));
  })()}
</View>


                  {chartLoading ? (
                    <ActivityIndicator color="#007AFF" size="small" />
                  ) : chartData.length === 0 ? (
                    <Text style={{ color: "#000", textAlign: "center" }}>No Data</Text>
                  ) : (
                    <ScrollView horizontal>
  <LineChart
  
  data={{
    // ✅ RIGHT → LEFT labels
    labels: reversedChartData.map((d) => d.label),

    datasets: [
      {
        // ✅ RIGHT → LEFT data
        data: reversedChartData.map((d) => d[activeMetric]),

        // ✅ Color based on Temp / Humidity
        color: () =>
          activeMetric.includes("temp") ? "#ff5634" : "#00C853",
      },
    ],
  }}
  width={Math.max(reversedChartData.length * 50, screenWidth - 40)}
  height={220}

  // ✅ Unit shown correctly
  yAxisSuffix={activeMetric.includes("temp") ? "°C" : "%"}

  chartConfig={{
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    propsForDots: {
      r: "3",
      strokeWidth: "1",
      stroke: "#000",
    },
  }}
  bezier
  style={{ borderRadius: 8, marginVertical: 8 }}
/>

</ScrollView>

                  )}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
            No matching results
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: { flexDirection: "row", backgroundColor: "#3e98fa" },
  tabButton: { flex: 1, padding: 12, alignItems: "center" },
  tabText: { color: "white", fontSize: 14 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#ff5634" },
  activeTabText: { fontWeight: "bold" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchIcon: { marginRight: 8, color: "#666" },
  searchInput: { flex: 1, height: 40, fontSize: 14, color: "#333" },
  cardContainer: { marginBottom: 15 },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    borderLeftWidth: 5,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 9,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
  },
  detailsRow: { flexDirection: "row", justifyContent: "space-between" },
  column: { flex: 1, paddingHorizontal: 6 },
  value: { fontSize: 12, fontWeight: "900", color: "#000" },
  row: { flexDirection: "row", paddingVertical: 4 },
  cell: { width: 100, textAlign: "center", fontSize: 12, color: "#000" },
  headerCell: { fontWeight: "bold", color: "#3e98fa" },
  tableHeader: { backgroundColor: "#e3f2fd", borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  chartContainer: { marginTop: 10, backgroundColor: "#fff", borderRadius: 8, padding: 10 },
  chartTitle: { 
  color: "#000", 
  fontWeight: "bold", 
  textAlign: "left",   // ← Align heading to the start
  marginBottom: 8,
  fontSize: 14
},
  rangeContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  rangeButton: { 
  paddingVertical: 4, 
  paddingHorizontal: 10, 
  borderRadius: 8, 
  backgroundColor: "#000", 
  borderWidth: 1, 
  borderColor: "#000" 
},
activeRangeButton: { 
  backgroundColor: "#3e98fa", 
  borderColor: "#3e98fa" 
},
rangeText: { 
  color: "#fff", 
  fontSize: 14 
},
activeRangeText: { 
  fontWeight: "bold", 
  color: "#fff" 
},

  toggleRow: { 
  flexDirection: "row", 
  justifyContent: "flex-start", 
  gap: 4,           // space between buttons
  marginVertical: 5 
},
toggleButton: { 
  width: 70,         // fixed width
  paddingVertical: 6, 
  borderRadius: 6, 
  backgroundColor: "#000", 
  borderWidth: 1, 
  borderColor: "#000", 
  alignItems: "center", 
  justifyContent: "center" // centers text vertically
},
toggleText: { 
  color: "#fff", 
  fontSize: 12, 
  fontWeight: "bold", 
  textAlign: "center" 
},

});
