import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const notifications = [
  {
    id: "1",
    title: "Order Confirmed",
    message: "Your order #2456 has been successfully placed.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    title: "Price Alert",
    message: "Stock price reached your target value.",
    time: "1 hour ago",
    unread: false,
  },
];

export default function Notification() {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, item.unread && styles.unreadCard]}
      activeOpacity={0.7}
    >
      <Ionicons
        name="notifications-outline"
        size={26}
        color={item.unread ? "#ff5634" : "#777"}
        style={styles.icon}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      {item.unread && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Notifications</Text>

        {/* Placeholder for center alignment */}
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#80acdb",
    columnGap: 12,
  },

  headerText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
  },

  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff5634",
  },

  icon: {
    marginRight: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  message: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  time: {
    fontSize: 11,
    color: "#999",
    marginTop: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff5634",
    marginLeft: 8,
  },
});
