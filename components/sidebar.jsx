import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
const BASE_URL = "http://192.168.1.17:8000/api/profile/logout"; // your API

const { width } = Dimensions.get("window");

export default function Sidebar({ isOpen, onClose }) {
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -width * 0.75,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const router = useRouter();

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // CALL LOGOUT API
      await fetch(BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // REMOVE TOKEN
      await AsyncStorage.removeItem("token");

      // REDIRECT TO LOGIN
      router.replace("/login");
    } catch (err) {
      console.log("Logout Error:", err);
    }
  };

  return (
    <>
      {isOpen && <Pressable style={styles.overlay} onPress={onClose} />}

      <Animated.View style={{ left: slideAnim, ...styles.sidebarContainer }}>
        <View style={styles.sidebar}>
          {/* ---------- CLOSE BUTTON ---------- */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <MaterialCommunityIcons
              name="close-circle"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>

          {/* ---------- MENU ITEMS ---------- */}
          <View style={styles.menuItems}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/(tabs)");
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="view-dashboard"
                size={22}
                color="#F48424"
              />
              <Text style={styles.item}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/orders");
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="basket-fill"
                size={22}
                color="#F48424"
              />
              <Text style={styles.item}>Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/products");
                onClose();
              }}
            >
              <FontAwesome5 name="box-open" size={22} color="#F48424" solid />
              <Text style={styles.item}>Products</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/employees");
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="account-group"
                size={22}
                color="#F48424"
              />
              <Text style={styles.item}>Employees</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/customers");
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="account-multiple-check"
                size={22}
                color="#F48424"
              />
              <Text style={styles.item}>Customers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/suppliers");
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="account-tie"
                size={22}
                color="#F48424"
              />
              <Text style={styles.item}>Suppliers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/salary");
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="cash-multiple"
                size={22}
                color="#F48424"
              />
              <Text style={styles.item}>Salary</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/attendence");
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="calendar-check"
                size={22}
                color="#F48424"
              />
              <Text style={styles.item}>Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/roles");
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="key-variant"
                size={22}
                color="#F48424"
              />
              <Text style={styles.item}>Roles</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/users");
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="account-circle"
                size={22}
                color="#F48424"
              />
              <Text style={styles.item}>Users</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push("/databasebackup");
                onClose();
              }}
            >
              <MaterialCommunityIcons
                name="database"
                size={22}
                color="#F48424"
              />
              <Text style={styles.item}>Database Backup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={logout}>
              <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 12,
    borderWidth: 2,
    borderColor: "#F48424",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#F48424",
  },
  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sidebarContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.75,
    zIndex: 99999999,
  },

  sidebar: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#1E57A6",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
    zIndex: 999,
    // ANDROID shadow
    elevation: 40,

    // IOS shadow
    shadowColor: "#000",
    shadowOpacity: 1000000,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  closeBtn: {
    position: "absolute",
    right: 15,
    top: 40,
    borderColor: "#F48424",
    borderWidth: 3,
    borderRadius: 100,
  },

  item: {
    fontSize: 18,
    marginLeft: 15,
    color: "#fff",
    fontWeight: "500",
  },

  menuItems: { marginTop: 10 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
});
