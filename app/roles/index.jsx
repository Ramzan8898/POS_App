import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import BottomModal from "../../components/BottomModal";
import Header from "../../components/header";

export default function Index() {
  const [roles, setRoles] = useState([
    "Admin",
    "Manager",
    "Cashier",
    "Salesman",
    "Employee",
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newRole, setNewRole] = useState("");

  const addRole = () => {
    if (!newRole.trim()) return;
    setRoles([...roles, newRole.trim()]);
    setNewRole("");
    setModalVisible(false);
  };

  return (
    <View style={styles.screen}>
      <Header title="Roles" />

      {roles.map((r, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.role}>{r}</Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity onPress={() => alert("Edit role placeholder")}>
              <MaterialIcons name="edit" size={20} color="#F48424" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setRoles((prev) => prev.filter((role) => role !== r))
              }
            >
              <MaterialIcons name="delete" size={20} color="#F48424" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* ADD ROLE BUTTON */}
      <View style={styles.addButtonWrapper}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.addText}>Add Role</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM MODAL */}
      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Role</Text>

          <TextInput
            placeholder="Enter role name"
            value={newRole}
            onChangeText={setNewRole}
            style={styles.input}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={addRole}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 15, backgroundColor: "#fff" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  role: { fontSize: 16, fontWeight: "600", color: "#1E57A6" },

  addButtonWrapper: {
    position: "absolute",
    bottom: 85,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E57A6",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    elevation: 5,
  },

  addText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 6,
    fontSize: 16,
  },

  modalContainer: {
    paddingVertical: 25,
    paddingHorizontal: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E57A6",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#1E57A6",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
