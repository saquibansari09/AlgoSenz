import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TemperatureReport = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Default Start = Today 00:00
  const today = new Date();

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(new Date());

  const [startTime, setStartTime] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
  );

  const [endTime, setEndTime] = useState(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    ),
  );

  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const [debugInfo, setDebugInfo] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [tableData, setTableData] = useState([]); // Table data from API

  useEffect(() => {
    getCompanyIdAndFetchVehicles();
  }, []);

  const getCompanyIdAndFetchVehicles = async () => {
    try {
      let storedCompanyId = await AsyncStorage.getItem("companyId");
      if (!storedCompanyId) {
        const userInfoRaw = await AsyncStorage.getItem("userInfo");
        if (userInfoRaw) {
          const parsed = JSON.parse(userInfoRaw);
          storedCompanyId = parsed?.companyID || parsed?.CompanyID;
        }
      }

      if (storedCompanyId) {
        setCompanyId(storedCompanyId);
        fetchVehicles(storedCompanyId);
      } else {
        setDebugInfo("Company ID not found. Please log in again.");
        setLoading(false);
      }
    } catch (error) {
      setDebugInfo(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  const fetchVehicles = async (cId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://algotrack.in/webapiAlgosenztemp/api/Login/GetAllRegistrationNumbers?companyId=${cId}`,
      );
      const data = await response.json();

      const vehiclesData = data.vehicles || [];

      const mappedVehicles = vehiclesData.map((item, index) => ({
        id: index + 1,
        number: item.registrationNo, // ✅ Highlighted: use registrationNo
        temp1InstalledFlag: item.temp1InstalledFlag,
        temp2InstalledFlag: item.temp2InstalledFlag,
      }));

      setVehicles(mappedVehicles);
      setFilteredVehicles(mappedVehicles);
    } catch (error) {
      setDebugInfo(`Error: ${error.message}`);
      setVehicles([]);
      setFilteredVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText.trim() === "") setFilteredVehicles(vehicles);
    else {
      const filtered = vehicles.filter((v) =>
        v.number.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredVehicles(filtered);
    }
  }, [searchText, vehicles]);

  const handleSelectVehicle = (item) => {
    setSelectedVehicle(item);
    setSearchText(item.number);
    setShowTable(false);
  };

  const formatDateOnly = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTimeOnly = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleGenerate = async () => {
    // ✅ Use selectedVehicle instead of relying on searchText
    if (!selectedVehicle) {
      alert("Please select a vehicle!");
      return;
    }

    setLoading(true);

    try {
      const startDateStr = formatDateOnly(startDate);
      const endDateStr = formatDateOnly(endDate);
      const startTimeStr = formatTimeOnly(startTime);
      const endTimeStr = formatTimeOnly(endTime);

      // ✅ Use selectedVehicle.number directly
      const response = await fetch(
        `https://www.algotrack.in/webapiAlgosenztemp/api/Login/GetTemperatureReport?registrationNo=${encodeURIComponent(
          selectedVehicle.number,
        )}&startDate=${startDateStr}&startTime=${startTimeStr}&endDate=${endDateStr}&endTime=${endTimeStr}`,
      );

      const data = await response.json();

      // Map only gpsDateTime and temperatures
      const mappedData = data.map((item, index) => ({
        id: index + 1,
        gpsDateTime: item.gpsDateTime || item.DateTime || "",
        temp1: item.temp1 || item.s1 || 0,
        temp2: item.temp2 || item.s2 || 0,
      }));
      setTableData(mappedData);
      setShowTable(true);
    } catch (error) {
      alert("Failed to fetch temperature report: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.vehicleItem,
        selectedVehicle?.id === item.id && styles.selectedItem,
      ]}
      onPress={() => handleSelectVehicle(item)}
    >
      <Text style={styles.vehicleText}>{item.number}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            router.replace("/Home"); // ⭐ Go to Home AND activate Home tab
          }}
          style={styles.headerBack}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Temperature Report</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons
          name="search"
          size={18}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Device"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            setShowTable(false);
          }}
        />
      </View>

      {/* Debug Info */}
      {debugInfo ? (
        <View style={styles.debugPanel}>
          <Text style={styles.debugText}>{debugInfo}</Text>
        </View>
      ) : null}

      {/* Vehicle List */}
      <View style={styles.listWrap}>
        {loading && !showTable ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#80acdb" />
            <Text style={styles.loadingText}>
              Loading registration numbers...
            </Text>
          </View>
        ) : filteredVehicles.length > 0 ? (
          <FlatList
            data={filteredVehicles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              No registration numbers found
            </Text>
          </View>
        )}
      </View>

      {/* START/END DATE & TIME */}
      <Text style={styles.label}>Start Date & Time</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setStartDatePickerVisibility(true)}
        >
          <Ionicons name="calendar" size={20} color="#80acdb" />
          <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setStartTimePickerVisibility(true)}
        >
          <Ionicons name="time-outline" size={20} color="#80acdb" />
          <Text style={styles.dateText}>
            {startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>End Date & Time</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setEndDatePickerVisibility(true)}
        >
          <Ionicons name="calendar" size={20} color="#80acdb" />
          <Text style={styles.dateText}>{endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setEndTimePickerVisibility(true)}
        >
          <Ionicons name="time-outline" size={20} color="#80acdb" />
          <Text style={styles.dateText}>
            {endTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Generate Button */}
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateButtonText}>Generate</Text>
      </TouchableOpacity>

      {/* Date & Time Pickers */}
      {isStartDatePickerVisible && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setStartDatePickerVisibility(false);
            if (d) setStartDate(d);
          }}
        />
      )}
      {isStartTimePickerVisible && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setStartTimePickerVisibility(false);
            if (d) setStartTime(d);
          }}
        />
      )}
      {isEndDatePickerVisible && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setEndDatePickerVisibility(false);
            if (d) setEndDate(d);
          }}
        />
      )}
      {isEndTimePickerVisible && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setEndTimePickerVisibility(false);
            if (d) setEndTime(d);
          }}
        />
      )}

      {/* Temperature Table (gpsDateTime + Temps) */}
      {showTable && selectedVehicle && (
        <ScrollView horizontal style={{ margin: 16 }}>
          <View>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: 150 }]}>
                Date & Time
              </Text>
              {selectedVehicle.temp1InstalledFlag === 1 && (
                <Text style={[styles.tableCell, { width: 100 }]}>S1 Temp</Text>
              )}
              {selectedVehicle.temp2InstalledFlag === 1 && (
                <Text style={[styles.tableCell, { width: 100 }]}>S2 Temp</Text>
              )}
            </View>

            {/* Table Rows */}
            <FlatList
              data={tableData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.tableRow,
                    { backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#fff" },
                  ]}
                >
                  <Text style={[styles.tableCell, { width: 150 }]}>
                    {item.gpsDateTime}
                  </Text>
                  {selectedVehicle.temp1InstalledFlag === 1 && (
                    <Text style={[styles.tableCell, { width: 100 }]}>
                      {item.temp1}°C
                    </Text>
                  )}
                  {selectedVehicle.temp2InstalledFlag === 1 && (
                    <Text style={[styles.tableCell, { width: 100 }]}>
                      {item.temp2}°C
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#80acdb",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerBack: {
    marginRight: 12,
  },
  headerTitle: { color: "#000", fontSize: 15, fontWeight: "bold" },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ddd",

    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: "100%", color: "#222" },
  listWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    maxHeight: 200,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listContent: { paddingBottom: 8 },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: { fontSize: 14, color: "#666", fontWeight: "500" },
  vehicleItem: {
    backgroundColor: "#fafafa",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  vehicleText: { color: "#000", fontWeight: "600" },
  selectedItem: { backgroundColor: "#dcefff" },
  separator: { height: 1, backgroundColor: "#ddd" },
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginHorizontal: 16, // <-- added horizontal margin
  },

  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    width: 140,
    height: 44,
    borderWidth: 1,
    borderColor: "#80acdb",
    borderRadius: 6,
    marginRight: 12,
  },

  dateText: { marginLeft: 6, color: "#80acdb", fontWeight: "600" },
  generateButton: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#80acdb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  generateButtonText: { color: "#000", fontSize: 16, fontWeight: "600" },
  debugPanel: {
    backgroundColor: "#fff3cd",
    padding: 8,
    marginHorizontal: 16,
    marginTop: 12,
  },
  debugText: { color: "#856404", fontSize: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  timeText: { fontSize: 14, fontWeight: "700", marginBottom: 5 },
  tempLabel: { fontSize: 16, fontWeight: "600" },
  tempValue: { fontSize: 16, fontWeight: "bold", color: "#ff5733" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#80acdb",
  },
  tableCell: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
});

export default TemperatureReport;
