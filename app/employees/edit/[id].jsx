import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "../../../components/header";

const BASE_URL = "http://192.168.1.20:8000/api";

export default function EditEmployee() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");

  const [photo, setPhoto] = useState(null); // NEW STATE
  const [existingPhoto, setExistingPhoto] = useState(null); // OLD PHOTO URL

  const fetchEmployee = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const employee = data.Employee;

      setName(employee.name);
      setPhone(employee.phone);
      setSalary(String(employee.salary || ""));
      setAddress(employee.address || "");
      setExistingPhoto(
        employee.photo
          ? `${BASE_URL.replace("/api", "")}/storage/${employee.photo}`
          : null
      );
    } catch (err) {
      console.log("Fetch Error:", err);
      Alert.alert("Error", "Unable to fetch employee");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  // 📸 PICK PHOTO
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const picked = result.assets[0];
      setPhoto(picked);
    }
  };

  // UPDATE EMPLOYEE
  const update = async () => {
    if (!name || !phone) return Alert.alert("Error", "Name & Phone required");

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");

      const form = new FormData();
      form.append("name", name);
      form.append("phone", phone);
      form.append("salary", salary);
      form.append("address", address);
      form.append("_method", "PUT");

      if (photo) {
        form.append("photo", {
          uri: photo.uri,
          name: `employee_${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }

      const res = await fetch(`${BASE_URL}/employee/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);

      if (data.Message || data.message) {
        // backend casing safe
        Alert.alert("Success", "Employee updated successfully!");
        router.back();
      }
    } catch (err) {
      console.log("Update Error:", err);
      Alert.alert("Error", "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E57A6" />
        <Text>Loading Employee...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Edit Employee" />
      <ScrollView style={{ padding: 20 }}>
        {/* PHOTO PREVIEW */}
        <View style={styles.photoBox}>
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.photo} />
          ) : existingPhoto ? (
            <Image source={{ uri: existingPhoto }} style={styles.photo} />
          ) : (
            <Text>No Photo</Text>
          )}

          <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
            <Text style={{ color: "#fff" }}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* FORM FIELDS */}
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
        />
        <TextInput
          style={styles.input}
          value={salary}
          onChangeText={setSalary}
          placeholder="Salary"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
          multiline
        />

        <TouchableOpacity style={styles.btn} onPress={update} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Update Employee</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E57A6",
    marginBottom: 20,
  },

  photoBox: { alignItems: "center", marginBottom: 20 },
  photo: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },

  photoBtn: { backgroundColor: "#1E57A6", padding: 10, borderRadius: 8 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#F48424",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
