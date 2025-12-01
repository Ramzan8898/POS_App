import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Header from "../../../components/header";
import InputField from "../../../components/input";

const BASE_URL = "http://192.168.1.17:8000/api";

export default function EditSupplier() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");

  const fetchSupplier = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/supplier/edit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("EDIT SUPPLIER RESPONSE =>", data);

      if (data.Supplier) {
        const s = data.Supplier;

        setName(s.name);
        setPhone(s.phone);
        setType(s.type ?? "");
        setAddress(s.address ?? "");

        if (s.photo) {
          setImage({
            uri: `${BASE_URL.replace("/api", "")}/storage/${s.photo}`,
          });
        }
      }
    } catch (e) {
      console.log("FETCH EDIT ERROR:", e);
      Alert.alert("Error", "Unable to load supplier data");
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, []);

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

  const handleUpdate = async () => {
    animate();

    if (!name || !phone) {
      return Alert.alert("Required", "Name & Phone are required!");
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");

      const form = new FormData();
      form.append("_method", "PUT");
      form.append("name", name);
      form.append("phone", phone);
      form.append("type", type);
      form.append("address", address);

      if (image && !image.uri.startsWith("http")) {
        form.append("photo", {
          uri: image.uri,
          type: "image/jpeg",
          name: `supplier_${Date.now()}.jpg`,
        });
      }

      const res = await fetch(`${BASE_URL}/supplier/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: form,
      });

      const data = await res.json();

      if (data.Message === "Success") {
        Alert.alert("Updated", "Supplier updated successfully!");
        router.back();
      }
    } catch (e) {
      Alert.alert("Error", "Update failed!");
    } finally { 
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Header title="Edit Supplier" />

        <View style={styles.imageRow}>
          <Image
            source={
              image
                ? { uri: image.uri }
                : require("../../../assets/images/placeholder.jpg")
            }
            style={styles.profile}
          />
          <Pressable style={styles.browseBtn} onPress={pickImage}>
            <Text style={styles.browseText}>Change Image</Text>
          </Pressable>
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

        <Animated.View
          style={[styles.saveWrapper, { transform: [{ scale: scaleAnim }] }]}
        >
          <Pressable style={styles.saveBtn} onPress={handleUpdate}>
            <Text style={styles.saveText}>
              {saving ? "Updating..." : "Update"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 30, backgroundColor: "#fff" },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E57A6",
    paddingHorizontal: 25,
    marginBottom: 20,
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
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  browseText: { color: "#1E57A6", fontWeight: "600" },
  saveWrapper: { alignItems: "center", marginTop: 30 },
  saveBtn: {
    backgroundColor: "#F48424",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
