import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, G, Path, Text as SVGText } from "react-native-svg";

const Home = () => {
  const router = useRouter();
  const [vehicleStats, setVehicleStats] = useState({});
  const [tempData, setTempData] = useState([]);
  const [humData, setHumData] = useState([]);
  const [selectedTempSlice, setSelectedTempSlice] = useState(null);
  const [selectedHumSlice, setSelectedHumSlice] = useState(null);
  const tempOpacity = useRef(new Animated.Value(0)).current;
  const humOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userInfo");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        let companyId =
          parsedUser?.companyID ||
          parsedUser?.CompanyID ||
          parsedUser?.companyId ||
          (await AsyncStorage.getItem("companyID")) ||
          (await AsyncStorage.getItem("companyId"));

        if (!companyId) {
          console.error("❌ No company ID found in stored user info");
          return;
        }

        const statsRes = await axios.get(
          `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetAllCounts/${companyId}`
        );
        setVehicleStats(statsRes.data);

        const tempRes = await axios.get(
          `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetTemperatureCount/${companyId}`
        );

        const humRes = await axios.get(
          `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetHumidityCount/${companyId}`
        );

        setTempData([
          {
            id: companyId,
            key: 1,
            value: tempRes.data.normalTemperatureCount || 0,
            label: "Normal",
            color: "#298e29ff",
          },
          {
            id: companyId,
            key: 2,
            value: tempRes.data.lowTemperatureCount || 0,
            label: "Low",
            color: "#FFC000",
          },
          {
            id: companyId,
            key: 3,
            value: tempRes.data.highTemperatureCount || 0,
            label: "High",
            color: "#de4343ff",
          },
        ]);

        setHumData([
          {
            id: companyId,
            key: 1,
            status: "Normal",
            value: humRes.data.normalHumidityCount || 0,
            label: "Normal",
            color: "#298e29ff",
          },
          {
            id: companyId,
            key: 2,
            status: "Low",
            value: humRes.data.lowHumidityCount || 0,
            label: "Low",
            color: "#FFC000",
          },
          {
            id: companyId,
            key: 3,
            status: "High",
            value: humRes.data.highHumidityCount || 0,
            label: "High",
            color: "#de4343ff",
          },
        ]);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }

    };

    fetchAllData();
  }, []);

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

  // --------- DONUT CHART HELPER ---------
  // --------- DONUT CHART HELPER ---------
const createDonut = (data, radius, onPress) => {
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const center = 110;

  const visible = data.filter(i => i.value > 0);

  // ⭐ If only 1 slice → draw full circle + label on EDGE
  if (visible.length === 1) {
    const item = visible[0];

    const labelX = center;      // middle horizontally
    const labelY = center - radius + 40; // ⭐ push label INTO slice

    return (
      <G>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill={item.color}
          onPress={() => onPress(data.indexOf(item))}
        />

        {/* ⭐ label on slice (NOT in middle white circle) */}
        <SVGText
          x={labelX}
          y={labelY}
          fill="black"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
        >
          {item.value}
        </SVGText>
      </G>
    );
  }

  // ⭐ Multi slice logic
  let startAngle = 0;
  return data.map((item, index) => {
    if (item.value === 0) return null;

    const sliceAngle = (item.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const path = `
      M ${center} ${center}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

    // ⭐ label inside slice (higher so white circle won't hide)
    const midAngle = startAngle + sliceAngle / 2;
    const labelX = center + (radius / 1.4) * Math.cos(midAngle);
    const labelY = center + (radius / 1.4) * Math.sin(midAngle);

    startAngle = endAngle;

    return (
      <G key={index}>
        <Path d={path} fill={item.color} onPress={() => onPress(index)} />

        {/* ⭐ label ALWAYS visible on slice */}
        <SVGText
          x={labelX}
          y={labelY}
          fill="black"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
        >
          {item.value}
        </SVGText>
      </G>
    );
  });
};



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

  const handleTempIconClick = () => {
    if (tempData.length > 0) {
      router.push(`/TempScreen?all=true&id=${tempData[0].id}`);
    }
  };

  const handleHumIconClick = () => {
    if (humData.length > 0) {
      router.push(`/HumidityScreen?all=true&id=${humData[0].id}`);
    }
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
          <View style={{ position: "relative", height: 220, width: 220 }}>
            <Svg height={220} width={220}>
              {createDonut(tempData, 100, handleTempSelect)}
              <Circle cx={110} cy={110} r={45} fill="white" />
            </Svg>
            <TouchableOpacity style={styles.centerIconContainer} onPress={handleTempIconClick}>
              <Text style={styles.centerCount}>{totalTemp}</Text>
              <Image source={require("../assets/images/thermometer.png")} style={styles.centerImage} resizeMode="contain" />
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
          <View style={{ position: "relative", height: 220, width: 220 }}>
            <Svg height={220} width={220}>
              {createDonut(humData, 100, handleHumSelect)}
              <Circle cx={110} cy={110} r={45} fill="white" />
            </Svg>
            <TouchableOpacity style={styles.centerIconContainer} onPress={handleHumIconClick}>
              <Text style={styles.centerCount}>{totalHum}</Text>
              <Image source={require("../assets/images/smart-sensor.png")} style={styles.centerImage} resizeMode="contain" />
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
  centerIconContainer: { position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -25 }, { translateY: -35 }], alignItems: "center", justifyContent: "center" },
  centerImage: { width: 45, height: 55 },
  centerCount: { fontSize: 18, fontWeight: "600" },
});

export default Home;
