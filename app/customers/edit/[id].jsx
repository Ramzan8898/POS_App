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

const BASE_URL = "http://192.168.1.17:8000/api";

export default function EditCustomer() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [balance, setBalance] = useState("");
  const [shopname, setShopName] = useState("");
  const [address, setAddress] = useState("");

  const [photo, setPhoto] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);

  // GET CUSTOMER DETAILS
  const fetchCustomer = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/customer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { Customer } = await res.json();

      setName(Customer.name);
      setPhone(Customer.phone);
      setBalance(Customer.balance ?? "");
      setShopName(Customer.shopname ?? ""); // FIXED
      setAddress(Customer.address ?? "");

      if (Customer.photo) {
        setExistingPhoto(
          `${BASE_URL.replace("/api", "")}/storage/${Customer.photo}`
        );
      }
    } catch (err) {
      Alert.alert("Error", "Unable to fetch customer!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  // SELECT NEW PHOTO
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!res.canceled) setPhoto(res.assets[0]);
  };

  // UPDATE CUSTOMER
  const updateCustomer = async () => {
    if (!name || !phone)
      return Alert.alert("Validation", "Name & Phone required!");

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");

      const form = new FormData();
      form.append("name", name);
      form.append("phone", phone);
      form.append("balance", balance);
      form.append("shopname", shopname); // FIXED KEY ✔
      form.append("address", address);
      form.append("_method", "PUT");

      if (photo) {
        form.append("photo", {
          uri: photo.uri,
          type: "image/jpeg",
          name: `customer_${Date.now()}.jpg`,
        });
      }

      const res = await fetch(`${BASE_URL}/customer/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);

      if (data.Message || data.success) {
        Alert.alert("Done!", "Customer updated successfully");
        router.back();
      } else {
        Alert.alert("Error", data.error ?? "Update failed!");
      }
    } catch (e) {
      Alert.alert("Error", "Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#19529C" />
      </View>
    );

  return (
    <View style={styles.screen}>
      <Header title="Edit Customer" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: "center", marginBottom: 15 }}>
          <Image
            source={
              photo
                ? { uri: photo.uri }
                : existingPhoto
                ? { uri: existingPhoto }
                : require("../../../assets/images/placeholder.jpg")
            }
            style={styles.photo}
          />

          <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
            <Text style={{ color: "#fff" }}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />

        <TextInput
          style={styles.input}
          value={balance}
          onChangeText={setBalance}
          placeholder="Balance"
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          value={shopname}
          onChangeText={setShopName}
          placeholder="Shop Name"
        />

        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
        />

        <TextInput
          style={[styles.input, { height: 80 }]}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
          multiline
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={updateCustomer}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Update Customer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  photo: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  pickBtn: { backgroundColor: "#19529C", padding: 10, borderRadius: 10 },
  btn: {
    backgroundColor: "#F48424",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
