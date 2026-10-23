import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
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

        const companyId =
          parsedUser?.companyID ||
          parsedUser?.CompanyID ||
          parsedUser?.companyId ||
          (await AsyncStorage.getItem("companyId")) ||
          (await AsyncStorage.getItem("companyID"));

        if (!companyId) {
          console.log("⏳ companyId not ready yet");
          return;
        }

        const statsRes = await axios.get(
          `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetAllCounts/${companyId}`,
        );
        setVehicleStats(statsRes.data);

        const tempRes = await axios.get(
          `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetTemperatureCount/${companyId}`,
        );

        const humRes = await axios.get(
          `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetHumidityCount/${companyId}`,
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
      bgIconColor: "#ffe6e6",
      gradientColors: ["#ffffff", "#fff5f5"],
    },
    {
      title: "Reporting",
      value: `${vehicleStats?.reportingCount || 0} Devices`,
      color: "#00ccb3",
      icon: "wifi-outline",
      tab: "reporting",
      bgIconColor: "#e6fffb",
      gradientColors: ["#ffffff", "#f0fffb"],
    },
    {
      title: "Delayed",
      value: `${vehicleStats?.delayedCount || 0} Devices`,
      color: "#0099ff",
      icon: "pause-circle-outline",
      tab: "delayed",
      bgIconColor: "#e6f2ff",
      gradientColors: ["#ffffff", "#f0f6ff"],
    },
    {
      title: "Critical",
      value: `${vehicleStats?.nonReportingCount || 0} Devices`,
      color: "#ff3333",
      icon: "power-outline",
      tab: "critical",
      bgIconColor: "#ffe6e6",
      gradientColors: ["#ffffff", "#fff5f5"],
    },
  ];

  const createDonut = (data, radius, onPress) => {
    const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);
    const center = 85;
    const visible = data.filter((i) => i.value > 0);

    if (visible.length === 1) {
      const item = visible[0];
      const labelX = center;
      const labelY = center - radius + 30;

      return (
        <G>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill={item.color}
            onPress={() => onPress(data.indexOf(item))}
          />
          <SVGText
            x={labelX}
            y={labelY}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {item.value}
          </SVGText>
        </G>
      );
    }

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

      const midAngle = startAngle + sliceAngle / 2;
      const labelX = center + (radius / 1.4) * Math.cos(midAngle);
      const labelY = center + (radius / 1.4) * Math.sin(midAngle);

      startAngle = endAngle;

      return (
        <G key={index}>
          <Path d={path} fill={item.color} onPress={() => onPress(index)} />
          <SVGText
            x={labelX}
            y={labelY}
            fill="white"
            fontSize="13"
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
      `/TempScreen?id=${selectedItem.id}&label=${selectedItem.label}&value=${selectedItem.value}&status=${selectedItem.label}`,
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
      `/HumidityScreen?id=${selectedItem.id}&label=${selectedItem.label}&value=${selectedItem.value}&status=${selectedItem.status}`,
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

  const renderStatsList = (data) => (
    <View style={styles.statsListContainer}>
      {data.map((item) => (
        <View key={item.key} style={styles.statRow}>
          <View style={styles.statLabelContainer}>
            <View style={[styles.statDot, { backgroundColor: item.color }]} />
            <Text style={styles.statLabelText}>{item.label}</Text>
          </View>
          <Text style={styles.statValueText}>{item.value}</Text>
        </View>
      ))}
    </View>
  );

  const totalTemp = tempData.reduce((sum, item) => sum + item.value, 0);
  const totalHum = humData.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0,
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="home-outline" size={22} color="#111" />
            <Text style={styles.headerTitle}>Home</Text>
          </View>
          <View style={styles.realtimeContainer}>
            <Text style={styles.realtimeText}>Real-time Overview</Text>
            <View style={styles.greenDot} />
          </View>
        </View>

        {/* Cards with Linear Gradient */}
        {Array.from({ length: Math.ceil(cardData.length / 2) }).map(
          (_, rowIndex) => {
            const rowCards = cardData.slice(rowIndex * 2, rowIndex * 2 + 2);
            return (
              <View key={rowIndex} style={styles.cardRow}>
                {rowCards.map((card, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.smallCardWrapper}
                    onPress={() => router.push(`/DeviceTab/${card.tab}`)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={card.gradientColors}
                      style={styles.smallCard}
                    >
                      <View style={styles.cardInnerRow}>
                        <View
                          style={[
                            styles.iconCircle,
                            { backgroundColor: card.bgIconColor },
                          ]}
                        >
                          <Ionicons
                            name={card.icon}
                            size={24}
                            color={card.color}
                          />
                        </View>
                        <View style={styles.cardTextContainer}>
                          <Text style={styles.cardTitle}>{card.title}</Text>
                          <View style={styles.cardValueRow}>
                            <Text
                              style={[styles.cardValue, { color: card.color }]}
                            >
                              {card.value.split(" ")[0]}
                            </Text>
                            <Text style={styles.cardDevicesLabel}>
                              {" "}
                              {card.value.split(" ")[1]}
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color="#b0b0b0"
                        />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            );
          },
        )}

        {/* Temperature Box Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrapper}>
              <View style={styles.sectionIconBg}>
                <Ionicons
                  name="thermometer-outline"
                  size={20}
                  color="#0080ff"
                />
              </View>
              <Text style={styles.sectionHeading}>Temperature</Text>
            </View>
            <View style={styles.badgeContainer}>
              <Ionicons name="snow-outline" size={14} color="#0066cc" />
              <Text style={styles.badgeText}>°C</Text>
            </View>
          </View>

          <View style={styles.chartAndStatsRow}>
            <View style={styles.chartWrapper}>
              <Svg height={170} width={170}>
                {createDonut(tempData, 75, handleTempSelect)}
                <Circle cx={85} cy={85} r={35} fill="white" />
              </Svg>
              <TouchableOpacity
                style={styles.centerIconContainer}
                onPress={handleTempIconClick}
              >
                <Text style={styles.centerCount}>{totalTemp}</Text>
                <Text style={styles.centerSubText}>Total Devices</Text>
              </TouchableOpacity>
            </View>
            {renderStatsList(tempData)}
          </View>
        </View>

        {/* Humidity Box Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrapper}>
              <View style={styles.sectionIconBg}>
                <Ionicons name="water-outline" size={20} color="#0080ff" />
              </View>
              <Text style={styles.sectionHeading}>Humidity</Text>
            </View>
            <View style={styles.badgeContainer}>
              <Ionicons name="water" size={14} color="#0066cc" />
              <Text style={styles.badgeText}>%RH</Text>
            </View>
          </View>

          <View style={styles.chartAndStatsRow}>
            <View style={styles.chartWrapper}>
              <Svg height={170} width={170}>
                {createDonut(humData, 75, handleHumSelect)}
                <Circle cx={85} cy={85} r={35} fill="white" />
              </Svg>
              <TouchableOpacity
                style={styles.centerIconContainer}
                onPress={handleHumIconClick}
              >
                <Text style={styles.centerCount}>{totalHum}</Text>
                <Text style={styles.centerSubText}>Total Devices</Text>
              </TouchableOpacity>
            </View>
            {renderStatsList(humData)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7fc" },
  scrollContainer: { padding: 16, paddingBottom: 100 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginLeft: 8,
  },
  realtimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  realtimeText: {
    fontSize: 12,
    color: "#666",
    marginRight: 6,
    fontWeight: "500",
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  smallCardWrapper: {
    width: "48%",
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    overflow: "hidden",
  },
  smallCard: {
    padding: 12,
    borderRadius: 14,
  },
  cardInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 2,
  },
  cardValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  cardValue: { fontSize: 18, fontWeight: "bold" },
  cardDevicesLabel: { fontSize: 11, color: "#777" },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e6f2ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f2ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0066cc",
    marginLeft: 4,
  },
  chartAndStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartWrapper: {
    position: "relative",
    height: 170,
    width: 170,
    alignItems: "center",
    justifyContent: "center",
  },
  statsListContainer: {
    flex: 1,
    marginLeft: 15,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  statLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statLabelText: {
    fontSize: 14,
    color: "#441",
    fontWeight: "500",
  },
  statValueText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
  },
  centerIconContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -20 }],
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },
  centerCount: { fontSize: 16, fontWeight: "bold", color: "#111" },
  centerSubText: { fontSize: 10, color: "#111", textAlign: "center" },
});

export default Home;

