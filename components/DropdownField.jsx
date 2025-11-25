import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DropdownField({
  label = "",
  value,
  onChange,
  options = [],
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* FIELD */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <MaterialIcons name="category" size={22} color="#19529C" />
        <Text style={styles.valueText}>
          {value ? value : label ? label : "Select option"}
        </Text>
        <MaterialIcons
          name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={22}
          color="#19529C"
        />
      </TouchableOpacity>

      {/* OVERLAY DROPDOWN */}
      {open && (
        <View style={styles.dropdownOverlay}>
          <View style={styles.dropdownBox}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 25,
    marginBottom: 10,
    position: "relative",
    zIndex: 100,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1E57A6",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    zIndex: 100,
  },

  valueText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },

  dropdownOverlay: {
    position: "absolute",
    top: 60,
    left: 25,
    right: 25,
    zIndex: 9999,
  },

  dropdownBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D7DF",
    maxHeight: 150,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },

  optionText: {
    fontSize: 15,
    color: "#333",
  },
});
