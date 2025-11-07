import React, { useState } from "react";
import { View, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function DateTimeModal({ onSelectDate }) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const showPicker = () => setIsVisible(true);
  const hidePicker = () => setIsVisible(false);

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hidePicker();
    if (onSelectDate) onSelectDate(date);
  };

  return (
    <View>
      <TouchableOpacity onPress={showPicker} style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3e98fa",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
