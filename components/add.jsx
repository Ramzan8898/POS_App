import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import InputField from "./input";

import {
  Alert,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BASE_URL = "http://192.168.1.20:8000/api";

export default function AddUser({
  data,
  showSalary = true,
  showShopName = false,
  title = "Employee",
  showType = false,
  onSuccess, // callback from parent
  onClose, // close modal
}) {
  const scaleAnim = new Animated.Value(1);

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");
  const [supplierType, setSupplierType] = useState(null);

  const [saving, setSaving] = useState(false);

  // BUTTON ANIMATION
  const animateBtn = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // IMAGE PICKER
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // SUBMIT EMPLOYEE
  const handleSave = async () => {
    animateBtn();

    if (!name || !phone) {
      return Alert.alert("Validation", "Name & phone are required");
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");
      const form = new FormData();

      form.append("name", name);
      form.append("phone", phone);
      form.append("salary", salary);
      form.append("address", address);

      // attach photo only if selected
      if (image) {
        form.append("photo", {
          uri: image.uri,
          type: "image/jpeg",
          name: `employee_${Date.now()}.jpg`,
        });
      }

      const res = await fetch(`${BASE_URL}/employee/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      console.log("STORE RESPONSE:", data);

      if (data.Message || data.message) {
        Alert.alert("Success", "Employee added successfully!");
        onSuccess?.(); // refresh table
        onClose?.(); // close modal
      } else {
        Alert.alert("Error", "Failed to add employee");
      }
    } catch (err) {
      console.log("Store Error:", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add {title}</Text>

      {/* IMAGE PICKER */}
      <View style={styles.imageSection}>
        <Image
          source={
            image
              ? { uri: image.uri }
              : require("../assets/images/placeholder.jpg")
          }
          style={styles.profile}
        />

        <TouchableOpacity style={styles.browseBtn} onPress={pickImage}>
          <Text style={styles.browseText}>Select Image</Text>
        </TouchableOpacity>
      </View>

      {/* FIELDS */}
      <InputField
        placeholder="Enter full name"
        value={name}
        onChangeText={setName}
        iconLeft={<Entypo name="user" size={20} color="#19529C" />}
      />

      <InputField
        placeholder="Enter phone number"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
        iconLeft={<MaterialIcons name="phone" size={20} color="#19529C" />}
      />

      {showSalary && (
        <InputField
          placeholder="Enter salary"
          keyboardType="numeric"
          value={salary}
          onChangeText={setSalary}
          iconLeft={<MaterialIcons name="payments" size={20} color="#19529C" />}
        />
      )}

      <InputField
        placeholder="Enter address"
        multiline
        value={address}
        onChangeText={setAddress}
        iconLeft={<Entypo name="location" size={20} color="#19529C" />}
      />

      {/* BUTTONS */}
      <View style={styles.btnRow}>
        <Pressable style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 25 },
  heading: {
    fontSize: 24,
    color: "#1E57A6",
    marginBottom: 25,
    fontWeight: "bold",
    paddingHorizontal: 25,
  },
  imageSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 25,
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 20,
  },
  browseBtn: {
    borderWidth: 1,
    borderColor: "#1E57A6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  browseText: { color: "#1E57A6", fontSize: 16 },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 25,
  },
  cancelBtn: {
    borderWidth: 2,
    borderColor: "#F48424",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelText: { color: "#F48424", fontSize: 16, fontWeight: "bold" },

  saveBtn: {
    backgroundColor: "#1E57A6",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
 