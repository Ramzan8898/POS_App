import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EditProfileModal from "../../components/EditProfileModal";
import Header from "../../components/header";

const BASE_URL = "http://192.168.1.17:8000/api";

export default function Index() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (!stored) {
          router.replace("login/index");
          return;
        }
        setUser(JSON.parse(stored));
      } catch (err) {
        console.log("LOAD USER ERR:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const updateProfile = async (updated) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const form = new FormData();
      form.append("method", "POST");
      form.append("name", updated.name);
      form.append("username", updated.username);
      form.append("email", updated.email);
      if (updated.photo && !updated.photo.startsWith("http")) {
        form.append("photo", {
          uri: updated.photo,
          type: "image/jpeg",
          name: `profile_${Date.now()}.jpg`,
        });
      }

      const res = await fetch(`${BASE_URL}/profile/update/${user.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: form,
      });

      const data = await res.json();
      console.log("PROFILE API RESPONSE =>", data);

      if (!data.success) {
        Alert.alert("Update Failed", data.message ?? "Server error");
        return false;
      }

      const updatedUser = data.user;

      if (!updatedUser) {
        Alert.alert("Error", "User not returned from server");
        return false;
      }

      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      return true; // 👈 indicate success
    } catch (e) {
      console.log("UPDATE ERR =>", e);
      Alert.alert("Error", "Unable to update profile");
      return false;
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E57A6" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="My Profile" />

      <View style={styles.card}>
        <Image
          source={
            user.photo
              ? { uri: `http://192.168.1.17:8000/storage/${user.photo}` }
              : require("../../assets/images/placeholder.jpg")
          }
          style={styles.avatar}
        />

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.name}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="edit" size={22} color="#fff" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <EditProfileModal
        visible={modalVisible}
        user={user}
        onClose={() => setModalVisible(false)}
        onSave={updateProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  screen: { flex: 1, backgroundColor: "#f7f9fc" },
  card: {
    margin: 20,
    backgroundColor: "#fff",
    paddingVertical: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "#1E57A6",
  },
  name: { marginTop: 12, fontSize: 20, fontWeight: "700", color: "#1E57A6" },
  email: { marginTop: 5, fontSize: 14, color: "#666" },
  editBtn: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F48424",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  editText: { color: "#fff", marginLeft: 6, fontSize: 16, fontWeight: "600" },
});
