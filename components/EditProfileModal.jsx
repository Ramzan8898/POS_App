import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditProfileModal({ visible, user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(user.image);

  const pickImage = async () => {
    let img = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!img.canceled) setPhoto(img.assets[0].uri);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Edit Profile</Text>

          {/* IMAGE PICK */}
          <TouchableOpacity onPress={pickImage} style={styles.center}>
            <Image
              source={
                photo
                  ? { uri: photo }
                  : require("../assets/images/placeholder.jpg")
              }
              style={styles.avatar}
            />
            <Text style={styles.changePhoto}>Change Photo</Text>
          </TouchableOpacity>

          {/* NAME */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          {/* EMAIL (NOT EDITABLE) */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#eee" }]}
            value={user.email}
            editable={false}
          />

          {/* PASSWORD */}
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter new password"
            value={password}
            onChangeText={setPassword}
          />

          {/* BUTTONS */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() =>
                onSave({
                  ...user,
                  name,
                  image: photo,
                  ...(password && { password }),
                })
              }
            >
              <Text style={styles.saveText}>Save</Text>
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
    color: "#1E57A6",
    marginBottom: 20,
    textAlign: "center",
  },

  center: { alignItems: "center" },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#1E57A6",
  },

  changePhoto: {
    marginTop: 5,
    color: "#1E57A6",
    fontWeight: "700",
  },

  label: {
    fontSize: 14,
    marginTop: 15,
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginTop: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  cancelBtn: {
    borderWidth: 2,
    borderColor: "#F48424",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  cancelText: {
    color: "#F48424",
    fontWeight: "700",
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: "#1E57A6",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
