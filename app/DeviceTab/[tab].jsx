import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  BarChart,
  AreaChart,
  Grid,
  XAxis,
  YAxis,
} from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import "react-native-svg-charts"

const tabs = ["All", "Reporting", "Delayed", "Critical"];
const ranges = ["Today", "7 Days", "1 Month", "3 Months"];

const generateHourly = () =>
  Array.from({ length: 24 }, (_, i) => ({
    label: `${i}:00`,
    temperature: +(20 + Math.random() * 8).toFixed(1),
    humidity: +(40 + Math.random() * 25).toFixed(1),
  }));

const generateDays = (n) =>
  Array.from({ length: n }, (_, i) => ({
    label: `D${i + 1}`,
    temperature: +(20 + Math.random() * 10).toFixed(1),
    humidity: +(35 + Math.random() * 30).toFixed(1),
  }));

const generateWeeks = (n) =>
  Array.from({ length: n }, (_, i) => ({
    label: `W${i + 1}`,
    temperature: +(18 + Math.random() * 12).toFixed(1),
    humidity: +(30 + Math.random() * 35).toFixed(1),
  }));

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
    } catch (e) {
      return <Text>{text}</Text>;
    }
  };

  // ✅ Fetch devices dynamically using stored companyID (Cold Star / CH / Schenker)
  useEffect(() => {
    let mounted = true;

    const fetchDevices = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userInfo");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        // ✅ Dynamic companyID from login API
        const companyId = parsedUser?.companyID;

        if (!companyId) {
          console.warn("⚠️ No company ID found. Please log in again.");
          if (mounted) setLoading(false);
          return;
        }

        console.log("✅ Using company ID:", companyId);

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
          )
            status = "Reporting";
          else if (
            delayed.some((v) => v.registrationNo?.trim().toLowerCase() === regNo)
          )
            status = "Delayed";

          return {
            deviceNumber: item.registrationNo || "",
            location: item.location || "",
            dateTime: item.gpsDateTime || item.lastUpdated || "",
            sensors: [
              {
                sensorNo: "S1",
                temperature:
                  item.temp1 !== undefined && item.temp1 !== null
                    ? +item.temp1
                    : "--",
                humidity:
                  item.humidity1 !== undefined && item.humidity1 !== null
                    ? +item.humidity1
                    : "--",
              },
              {
                sensorNo: "S2",
                temperature:
                  item.temp2 !== undefined && item.temp2 !== null
                    ? +item.temp2
                    : "--",
                humidity:
                  item.humidity2 !== undefined && item.humidity2 !== null
                    ? +item.humidity2
                    : "--",
              },
            ],
            status,
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

  const fetchChartData = async (registrationNo, range) => {
    try {
      setChartLoading(true);
      const today = new Date();
      const startDate = new Date(today);
      const endDate = new Date(today);

      if (range === "7 Days") startDate.setDate(today.getDate() - 6);
      if (range === "1 Month") startDate.setDate(today.getDate() - 30);
      if (range === "3 Months") startDate.setDate(today.getDate() - 90);

      const formatDate = (d) => d.toISOString().split("T")[0];
      const url = `https://algotrack.in/webapiAlgosenztemp/api/Login/GetDataByDateOfVehicle?registrationNo=${encodeURIComponent(
        registrationNo
      )}&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`;

      const res = await axios.get(url);
      const arr = Array.isArray(res.data) ? res.data : [];

      if (arr.length > 0) {
        setChartData(
          arr.map((item, idx) => {
            const temp =
              parseFloat(item.temp1 ?? item.temperature ?? NaN) || 0;
            const hum =
              parseFloat(item.humidity1 ?? item.humidity ?? NaN) || 0;
            const label = item.time || item.dateTime || `#${idx + 1}`;
            return {
              temperature: +temp.toFixed(1),
              humidity: +hum.toFixed(1),
              label,
            };
          })
        );
      } else {
        if (range === "Today") setChartData(generateHourly());
        else if (range === "7 Days") setChartData(generateDays(7));
        else if (range === "1 Month") setChartData(generateDays(30));
        else setChartData(generateWeeks(12));
      }
    } catch (e) {
      console.error("Chart Fetch Error:", e);
      if (range === "Today") setChartData(generateHourly());
      else if (range === "7 Days") setChartData(generateDays(7));
      else if (range === "1 Month") setChartData(generateDays(30));
      else setChartData(generateWeeks(12));
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
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
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
                      {/*<Text style={styles.statusText}>Status: {item.status}</Text>*/}
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

                      {item.sensors.map((data, idx) => {
                        const tempVal =
                          typeof data.temperature === "number"
                            ? data.temperature
                            : null;
                        const humVal =
                          typeof data.humidity === "number"
                            ? data.humidity
                            : null;

                        let tempColor =
                          tempVal === null
                            ? "#000"
                            : tempVal >= 30
                            ? "orange"
                            : tempVal >= 20
                            ? "green"
                            : "#3e98fa";
                        let humidityColor =
                          humVal === null
                            ? "#000"
                            : humVal >= 70
                            ? "orange"
                            : humVal >= 40
                            ? "green"
                            : "#3e98fa";

                        return (
                          <View
                            key={data.sensorNo + idx}
                            style={[
                              styles.row,
                              {
                                backgroundColor:
                                  idx % 2 === 0 ? "#f9f9f9" : "#fff",
                              },
                            ]}
                          >
                            <Text style={styles.cell}>{data.sensorNo}</Text>
                            <Text style={[styles.cell, { color: tempColor }]}>
                              {tempVal !== null ? `${tempVal}°C` : "--"}
                            </Text>
                            <Text
                              style={[styles.cell, { color: humidityColor }]}
                            >
                              {humVal !== null ? `${humVal}%` : "--"}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              </TouchableOpacity>

              {selectedCardIndex === index && (
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Temperature & Humidity</Text>

                  <View style={styles.rangeContainer}>
                    {ranges.map((range) => (
                      <TouchableOpacity
                        key={range}
                        style={[
                          styles.rangeButton,
                          selectedRange === range && styles.activeRangeButton,
                        ]}
                        onPress={() => setSelectedRange(range)}
                      >
                        <Text
                          style={[
                            styles.rangeText,
                            selectedRange === range && styles.activeRangeText,
                          ]}
                        >
                          {range}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {chartLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : chartData.length === 0 ? (
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                      No Data
                    </Text>
                  ) : (
                    <View style={{ flexDirection: "row", height: 180 }}>
                      <YAxis
                        data={chartData.map((d) => d.temperature)}
                        contentInset={{ top: 20, bottom: 10 }}
                        svg={{ fill: "white", fontSize: 10 }}
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <AreaChart
                          style={{ flex: 1 }}
                          data={chartData.map((d) => d.temperature)}
                          contentInset={{ top: 20, bottom: 10 }}
                          curve={shape.curveNatural}
                          svg={{
                            fill: "url(#grad)",
                            stroke: "#4fc3f7",
                            strokeWidth: 2,
                          }}
                        >
                          <Defs>
                            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                              <Stop
                                offset="0%"
                                stopColor="#4fc3f7"
                                stopOpacity={0.8}
                              />
                              <Stop
                                offset="100%"
                                stopColor="#3e98fa"
                                stopOpacity={0.1}
                              />
                            </LinearGradient>
                          </Defs>
                          <Grid />
                        </AreaChart>

                        <BarChart
                          style={StyleSheet.absoluteFill}
                          data={chartData.map((d) => d.humidity)}
                          svg={{ fill: "rgba(255,255,255,0.18)" }}
                          contentInset={{ top: 20, bottom: 10 }}
                        />

                        <XAxis
                          style={{ marginTop: 10 }}
                          data={chartData}
                          formatLabel={(_, idx) => chartData[idx]?.label || ""}
                          contentInset={{ left: 10, right: 10 }}
                          svg={{ fontSize: 9, fill: "white" }}
                        />
                      </View>
                    </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  detailsRow: { flexDirection: "row", justifyContent: "space-between" },
  column: { flex: 1, paddingHorizontal: 6 },
  value: { fontSize: 12, fontWeight: "900", color: "#000" },
  statusText: { fontSize: 12, fontWeight: "600", marginTop: 5, color: "#000" },
  row: { flexDirection: "row", paddingVertical: 4 },
  cell: { width: 100, textAlign: "center", fontSize: 12, color: "#000" },
  headerCell: { fontWeight: "bold", color: "#000" },
  tableHeader: { borderBottomWidth: 1, borderColor: "#ddd" },
  chartContainer: {
    backgroundColor: "#3e98fa",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  chartTitle: { color: "white", fontWeight: "bold", fontSize: 14 },
  rangeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  rangeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  activeRangeButton: { backgroundColor: "#ff5634" },
  rangeText: { color: "#fff", fontSize: 12 },
  activeRangeText: { fontWeight: "bold" },
});
