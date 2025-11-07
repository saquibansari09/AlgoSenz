import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { PieChart } from "react-native-svg-charts";
import { G, Text as SVGText } from "react-native-svg";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Home = () => {
  const router = useRouter();
  const [vehicleStats, setVehicleStats] = useState({});
  const [tempData, setTempData] = useState([]);
  const [humData, setHumData] = useState([]);
  const [selectedTempSlice, setSelectedTempSlice] = useState(null);
  const [selectedHumSlice, setSelectedHumSlice] = useState(null);
  const tempOpacity = useRef(new Animated.Value(0)).current;
  const humOpacity = useRef(new Animated.Value(0)).current;

  // ✅ Fetch all dashboard data dynamically based on logged-in user
useEffect(() => {
  const fetchAllData = async () => {
    try {
      // ✅ Load stored user info
      const storedUser = await AsyncStorage.getItem("userInfo");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      // ✅ Try multiple possible company ID keys for safety
      const companyId =
        parsedUser?.companyID ||
        parsedUser?.CompanyID ||
        parsedUser?.companyId ||
        (await AsyncStorage.getItem("companyID"));

      if (!companyId) {
        console.error("❌ No company ID found in stored user info");
        return;
      }

      console.log("✅ Logged in Company ID:", companyId);

      // ✅ Fetch Vehicle Stats
      const statsRes = await axios.get(
        `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetAllCounts/${companyId}`
      );
      setVehicleStats(statsRes.data);

      // ✅ Fetch Temperature Data
      const tempRes = await axios.get(
        `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetTemperatureCount/${companyId}`
      );

      // ✅ Fetch Humidity Data
      const humRes = await axios.get(
        `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetHumidityCount/${companyId}`
      );

      // ✅ Set Temperature Data
      setTempData([
        {
          id: companyId,
          key: 1,
          value: tempRes.data.normalTemperatureCount || 0,
          label: "Normal",
          color: "#4CAF50",
        },
        {
          id: companyId,
          key: 2,
          value: tempRes.data.lowTemperatureCount || 0,
          label: "Low",
          color: "#2196F3",
        },
        {
          id: companyId,
          key: 3,
          value: tempRes.data.highTemperatureCount || 0,
          label: "High",
          color: "#FF9800",
        },
      ]);

      // ✅ Set Humidity Data
      setHumData([
        {
          id: companyId,
          key: 1,
          status: "Normal",
          value: humRes.data.normalHumidityCount || 0,
          label: "Normal",
          color: "#4CAF50",
        },
        {
          id: companyId,
          key: 2,
          status: "Low",
          value: humRes.data.lowHumidityCount || 0,
          label: "Low",
          color: "#2196F3",
        },
        {
          id: companyId,
          key: 3,
          status: "High",
          value: humRes.data.highHumidityCount || 0,
          label: "High",
          color: "#FF9800",
        },
      ]);
    } catch (error) {
      console.error("❌ Error fetching home data:", error);
    }
  };

  fetchAllData();
}, []);


  // Card data
  const cardData = [
    {
      title: "All Devices",
      value: `${vehicleStats?.totalCount || 0} Devices`,
      color: "#ff4d4d",
      icon: "hardware-chip-outline",
      tab: "all",
    },
    {
      title: "Reporting",
      value: `${vehicleStats?.reportingCount || 0} Devices`,
      color: "#00ccb3",
      icon: "wifi-outline",
      tab: "reporting",
    },
    {
      title: "Delayed",
      value: `${vehicleStats?.delayedCount || 0} Devices`,
      color: "#0099ff",
      icon: "pause-circle-outline",
      tab: "delayed",
    },
    {
      title: "Critical",
      value: `${vehicleStats?.nonReportingCount || 0} Devices`,
      color: "#ff3333",
      icon: "power-outline",
      tab: "critical",
    },
  ];

  // Temperature slice selection
  const handleTempSelect = (index) => {
    const selectedItem = tempData[index];
    setSelectedTempSlice(index);
    tempOpacity.setValue(0);
    Animated.timing(tempOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    router.push(
      `/TempScreen?id=${selectedItem.id}&label=${selectedItem.label}&value=${selectedItem.value}&status=${selectedItem.label}`
    );
  };

  const handleTempIconClick = () => {
    if (tempData.length > 0) {
      router.push(`/TempScreen?all=true&id=${tempData[0].id}`);
    }
  };

  // Humidity slice selection
  const handleHumSelect = (index) => {
    const selectedItem = humData[index];
    setSelectedHumSlice(index);
    humOpacity.setValue(0);
    Animated.timing(humOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    router.push(
      `/HumidityScreen?id=${selectedItem.id}&label=${selectedItem.label}&value=${selectedItem.value}&status=${selectedItem.status}`
    );
  };

  const handleHumIconClick = () => {
    if (humData.length > 0) {
      router.push(`/HumidityScreen?all=true&id=${humData[0].id}`);
    }
  };

  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, data } = slice;
      return (
        <G key={index}>
          <SVGText
            x={labelCentroid[0]}
            y={labelCentroid[1]}
            fill="black"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={14}
            fontWeight="bold"
          >
            {data.value}
          </SVGText>
        </G>
      );
    });
  };

  const renderLegend = (data) => (
    <View style={styles.legendContainer}>
      {data.map((item) => (
        <View key={item.key} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: item.color }]} />
          <Text style={styles.legendLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );

  const totalTemp = tempData.reduce((sum, item) => sum + item.value, 0);
  const totalHum = humData.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Cards */}
        {Array.from({ length: Math.ceil(cardData.length / 2) }).map((_, rowIndex) => {
          const rowCards = cardData.slice(rowIndex * 2, rowIndex * 2 + 2);
          return (
            <View key={rowIndex} style={styles.cardRow}>
              {rowCards.map((card, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.smallCard}
                  onPress={() => router.push(`/DeviceTab/${card.tab}`)}

                  activeOpacity={0.8}
                >
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardValue, { color: card.color }]}>{card.value}</Text>
                    <Ionicons name={card.icon} size={28} color={card.color} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {/* Temperature Chart */}
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <Text style={styles.donutHeading}>Temperature</Text>
          <View style={{ position: "relative", height: 200, width: 320 }}>
            <PieChart
              style={{ height: 200, width: 320 }}
              data={tempData.map((item, index) => ({
                key: item.key,
                value: item.value,
                svg: { fill: item.color, onPress: () => handleTempSelect(index) },
              }))}
              innerRadius={100}
              outerRadius="50%"
              padAngle={0}
              sort={() => null}
            >
              <Labels />
            </PieChart>

           <TouchableOpacity style={styles.centerIconContainer} onPress={handleTempIconClick}>
  <Text style={styles.centerCount}>{totalTemp}</Text>
  <Image
    source={require("../assets/images/thermometer.png")} // 👈 correct path
    style={styles.centerImage}
    resizeMode="contain"
  />
</TouchableOpacity>

          </View>

          {selectedTempSlice !== null && (
            <Animated.Text style={[styles.selectedValueText, { opacity: tempOpacity }]}>
              {tempData[selectedTempSlice].label}: {tempData[selectedTempSlice].value}
            </Animated.Text>
          )}
          {renderLegend(tempData)}
        </View>

        {/* Humidity Chart */}
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <Text style={styles.donutHeading}>Humidity</Text>
          <View style={{ position: "relative", height: 200, width: 320 }}>
            <PieChart
              style={{ height: 200, width: 320 }}
              data={humData.map((item, index) => ({
                key: item.key,
                value: item.value,
                svg: { fill: item.color, onPress: () => handleHumSelect(index) },
              }))}
              innerRadius={100}
              outerRadius="50%"
              padAngle={0}
              sort={() => null}
            >
              <Labels />
            </PieChart>

            <TouchableOpacity style={styles.centerIconContainer} onPress={handleTempIconClick}>
  <Text style={styles.centerCount}>{totalTemp}</Text>
  <Image
    source={require("../assets/images/smart-sensor.png")} // 👈 correct path
    style={styles.centerImage}
    resizeMode="contain"
  />
</TouchableOpacity>
          </View>

          {selectedHumSlice !== null && (
            <Animated.Text style={[styles.selectedValueText, { opacity: humOpacity }]}>
              {humData[selectedHumSlice].label}: {humData[selectedHumSlice].value}
            </Animated.Text>
          )}
          {renderLegend(humData)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20 },
  scrollContainer: { padding: 16, paddingBottom: 100 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  smallCard: { backgroundColor: "#fff", borderRadius: 10, padding: 12, elevation: 4, width: "48%" },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  cardContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardValue: { fontSize: 14, fontWeight: "600" },
  donutHeading: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10, alignSelf: "flex-start", marginLeft: 5 },
  selectedValueText: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 10 },
  legendContainer: { flexDirection: "row", marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 15 },
  legendColor: { width: 15, height: 15, marginRight: 5, borderRadius: 10 },
  legendLabel: { fontSize: 14, color: "#333" },
  centerIconContainer: {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: [{ translateX: -25 }, { translateY: -35 }],
  alignItems: "center",
  justifyContent: "center",
},

centerImage: {
  width: 45,
  height: 55,
},

centerCount: {
  fontSize: 18,
  fontWeight: "600",
},

});

export default Home;
