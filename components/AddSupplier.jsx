import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
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
import InputField from "./input";

const BASE_URL = "http://192.168.1.17:8000/api";

export default function AddSupplier({ onSuccess, onClose }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!res.canceled) setImage(res.assets[0]);
  };

  const animate = () => {
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

  const handleSave = async () => {
    animate();

    if (!name || !phone) {
      return Alert.alert("Required", "Supplier name & phone are required!");
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");

      const form = new FormData();
      form.append("name", name);
      form.append("phone", phone);
      form.append("type", type);
      form.append("address", address);

      if (image) {
        form.append("photo", {
          uri: image.uri,
          type: "image/jpeg",
          name: `supplier_${Date.now()}.jpg`,
        });
      }

      const res = await fetch(`${BASE_URL}/supplier/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: form,
      });

      const data = await res.json();
      console.log("STORE SUPPLIER =>", data);

      if (data.Message === "Success") {
        Alert.alert("Success", "Supplier added successfully!");
        onSuccess?.();
        onClose?.();
      } else {
        Alert.alert("Error", "Unable to add supplier!");
      }
    } catch (e) {
      console.log("STORE ERROR:", e);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Supplier</Text>

      <View style={styles.imageRow}>
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

      <InputField
        placeholder="Name"
        value={name}
        onChangeText={setName}
        iconLeft={<Entypo name="user" size={20} color="#19529C" />}
      />

      <InputField
        placeholder="Phone"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
        iconLeft={<MaterialIcons name="phone" size={20} color="#19529C" />}
      />

      <InputField
        placeholder="Supplier Type"
        value={type}
        onChangeText={setType}
        iconLeft={<MaterialIcons name="payments" size={20} color="#19529C" />}
      />

      <InputField
        placeholder="Address"
        value={address}
        multiline
        onChangeText={setAddress}
        iconLeft={<Entypo name="location" size={20} color="#19529C" />}
      />

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
    fontWeight: "bold",
    paddingHorizontal: 25,
    marginBottom: 25,
    color: "#1E57A6",
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 15,
  },
  browseBtn: {
    borderWidth: 1,
    borderColor: "#1E57A6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  browseText: { color: "#1E57A6", fontWeight: "600" },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginTop: 25,
  },
  cancelBtn: {
    borderWidth: 2,
    borderColor: "#F48424",
    padding: 10,
    borderRadius: 10,
  },
  cancelText: { color: "#F48424", fontWeight: "bold" },
  saveBtn: { backgroundColor: "#1E57A6", padding: 12, borderRadius: 10 },
  saveText: { color: "#fff", fontWeight: "bold" },
});
