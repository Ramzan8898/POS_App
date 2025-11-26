import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EditProfileModal from "../../components/EditProfileModal";
import Header from "../../components/header";

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.log("Error loading user:", err);
      }
    };

    loadUser();
  }, []);

  // 🔥 FIX: Prevent crash while user is null
  if (!user) {
    router.push("login/index");
  }

  return (
    <View style={styles.screen}>
      <Header title="My Profile" />

      {/* PROFILE CARD */}
      <View style={styles.card}>
        <Image
          source={
            user.photo
              ? { uri: `http://192.168.1.23:8000/storage/${user.photo}` }
              : require("../../assets/images/placeholder.jpg")
          }
          style={styles.avatar}
        />

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="edit" size={22} color="#fff" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <EditProfileModal
        visible={modalVisible}
        user={user}
        onClose={() => setModalVisible(false)}
        onSave={(updated) => {
          setUser(updated);
          setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },

  card: {
    margin: 20,
    backgroundColor: "#fff",
    paddingVertical: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "#1E57A6",
  },

  name: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "#1E57A6",
  },

  email: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
  },

  editBtn: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F48424",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  editText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
  },
});
