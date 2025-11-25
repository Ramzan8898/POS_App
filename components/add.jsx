import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import InputField from "./input";

export default function AddUser({
  showSalary = true,
  showShopName = true,
  title = "Employee",
}) {
  const [image, setImage] = useState(null);
  const scaleAnim = new Animated.Value(1);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.heading}>Add {title}</Text>

        {/* IMAGE PICKER */}
        <View style={styles.imageSection}>
          <Image
            source={
              image
                ? { uri: image }
                : require("../assets/images/placeholder.jpg")
            }
            style={styles.profile}
          />

          <TouchableOpacity style={styles.browseBtn} onPress={pickImage}>
            <Text style={styles.browseText}>Select Image</Text>
          </TouchableOpacity>
        </View>

        {/* FIELDS USING InputField */}
        <InputField
          placeholder="Enter full name"
          iconLeft={<Entypo name="user" size={20} color="#19529C" />}
        />

        <InputField
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          iconLeft={<MaterialIcons name="phone" size={20} color="#19529C" />}
        />

        {showShopName && (
          <InputField
            placeholder="Enter shop name"
            iconLeft={<Entypo name="shop" size={20} color="#19529C" />}
          />
        )}

        {showSalary && (
          <InputField
            placeholder="Enter salary"
            keyboardType="numeric"
            iconLeft={
              <MaterialIcons name="payments" size={22} color="#19529C" />
            }
          />
        )}

        <InputField
          placeholder="Enter address"
          multiline
          iconLeft={<Entypo name="location" size={20} color="#19529C" />}
        />

        {/* BUTTONS */}
        <View style={styles.btnRow}>
          <Pressable style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable style={styles.saveBtn} onPress={animateBtn}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </Animated.View>
        </View>
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
    borderWidth: 1,
    borderColor: "#E91E63",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  cancelText: { color: "#E91E63", fontSize: 16 },

  saveBtn: {
    backgroundColor: "#1E57A6",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  saveText: { color: "#fff", fontSize: 16 },
});
