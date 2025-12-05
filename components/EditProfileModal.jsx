import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileModal({ visible, user, onClose, onSave }) {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && user) {
      setName(user.name);
      setUserName(user.username);
      setEmail(user.email); // 🔥 REQUIRED
      setPhoto(user.photo);
    }
  }, [visible, user]);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave({ name, username, email, photo });
    setSaving(false);

    if (ok) onClose(); // CLOSE MODAL AFTER SUCCESS
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Edit Profile</Text>

          <TouchableOpacity onPress={pickImage} style={styles.center}>
            <Image
              source={
                photo
                  ? {
                      uri: photo.startsWith("http")
                        ? photo
                        : `http://192.168.1.17:8000/storage/${photo}`,
                    }
                  : require("../assets/images/placeholder.jpg")
              }
              style={styles.avatar}
            />
            <Text style={styles.changePhoto}>Change Photo</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUserName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              disabled={saving}
              onPress={handleSave}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#1E57A6",
  },
  center: { alignItems: "center" },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#1E57A6",
  },
  changePhoto: { marginTop: 5, color: "#1E57A6", fontWeight: "700" },
  label: { marginTop: 15, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    fontSize: 16,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 25 },
  cancelBtn: {
    borderWidth: 2,
    borderColor: "#F48424",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  cancelText: { color: "#F48424", fontWeight: "700" },
  saveBtn: {
    backgroundColor: "#1E57A6",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
