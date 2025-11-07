import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TemperatureReport = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const vehiclesData = [
      { id: 1, number: "MH01AB1234" },
      { id: 2, number: "MH02CD5678" },
      { id: 3, number: "MH03EF9012" },
      { id: 4, number: "MH04GH3456" },
    ];
    setVehicles(vehiclesData);
    setFilteredVehicles(vehiclesData);
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter((v) =>
        v.number.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredVehicles(filtered);
    }
  }, [searchText, vehicles]);

  const handleSelectVehicle = (item) => {
    setSelectedVehicle(item);
    setSearchText(item.number);
    setShowTable(false);
  };

  const handleGenerate = () => {
    if (searchText.trim() !== "") {
      const matched = vehicles.find(
        (v) => v.number.toLowerCase() === searchText.toLowerCase()
      );
      if (matched) {
        setSelectedVehicle(matched);
        setShowTable(true);
      } else {
        alert("Device not found!");
      }
    } else {
      alert("Please select or type a vehicle number!");
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

  const tableData = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    datetime: new Date(Date.now() - i * 60000).toLocaleString(),
    s1: 100 + i,
    s2: 200 + i,
    s3: 300 + i,
    s4: 400 + i,
  }));

  return (
    <View style={styles.container}>
      {/* Header: matches Profile style (blue bar) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Temperature Report</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#666" style={styles.searchIcon} />
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

      {/* FlatList: constrained height, scrolls separately */}
      <View style={styles.listWrap}>
        <FlatList
          data={filteredVehicles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Generate Button */}
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateButtonText}>Generate</Text>
      </TouchableOpacity>

      {/* Table */}
      {showTable && selectedVehicle && (
        <View style={styles.tableContainer}>
          <Text style={styles.tableHeading}>Device: {selectedVehicle.number}</Text>

          <ScrollView horizontal bounces={false}>
            <View>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={styles.tableColumnWide}>
                  <Text style={styles.headerText}>Date & Time</Text>
                </View>
                <View style={styles.tableColumn}>
                  <Text style={styles.headerText}>S1</Text>
                </View>
                <View style={styles.tableColumn}>
                  <Text style={styles.headerText}>S2</Text>
                </View>
                <View style={styles.tableColumn}>
                  <Text style={styles.headerText}>S3</Text>
                </View>
                <View style={styles.tableColumn}>
                  <Text style={styles.headerText}>S4</Text>
                </View>
              </View>

              <ScrollView style={styles.tableBody} nestedScrollEnabled>
                {tableData.map((row) => (
                  <View key={row.id} style={styles.tableRow}>
                    <View style={styles.tableColumnWide}>
                      <Text style={styles.cellText}>{row.datetime}</Text>
                    </View>
                    <View style={styles.tableColumn}>
                      <Text style={styles.cellText}>{row.s1}</Text>
                    </View>
                    <View style={styles.tableColumn}>
                      <Text style={styles.cellText}>{row.s2}</Text>
                    </View>
                    <View style={styles.tableColumn}>
                      <Text style={styles.cellText}>{row.s3}</Text>
                    </View>
                    <View style={styles.tableColumn}>
                      <Text style={styles.cellText}>{row.s4}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  /* Header (blue full-width like Profile) */
  header: {
    backgroundColor: "#3e98fa",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerBack: {
    marginRight: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  /* Search */
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

  /* FlatList container: fixed max height so it won't push Generate/button off-screen */
  listWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    maxHeight: 220,
    borderRadius: 8,
    overflow: "hidden",
  },
  listContent: { paddingBottom: 8 },

  /* Vehicle item */
  vehicleItem: {
    backgroundColor: "#fafafa",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  vehicleText: {
    color: "#000",
    fontWeight: "600",
  },
  selectedItem: {
    backgroundColor: "#e6f0ff",
  },
  separator: { height: 1, backgroundColor: "#eee" },

  /* Generate button */
  generateButton: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#3e98fa",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  generateButtonText: { color: "#fff", fontWeight: "700" },

  /* Table */
  tableContainer: {
    margin: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeading: {
    fontWeight: "700",
    padding: 10,
    backgroundColor: "#fafafa",
  },
  tableRow: { flexDirection: "row", alignItems: "center" },
  tableHeader: { backgroundColor: "#f2f2f2" },
  tableColumn: {
    minWidth: 90,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  tableColumnWide: {
    minWidth: 220,
    paddingHorizontal: 12,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  headerText: { fontWeight: "700", fontSize: 12, textAlign: "center" },
  cellText: { fontSize: 12, textAlign: "center" },
  tableBody: { maxHeight: 320 },
});

export default TemperatureReport;
