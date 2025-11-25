import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/header";

const EMPLOYEES = [
  { id: 1, name: "Ali Khan", phone: "0300-1234567" },
  { id: 2, name: "Ahmed Raza", phone: "0312-9988776" },
  { id: 3, name: "Bilal Aslam", phone: "0321-5566778" },
  { id: 4, name: "Hamza Tariq", phone: "0345-8976543" },
];

const STATUS_OPTIONS = [
  { key: "present", label: "Present", color: "#27AE60" },
  { key: "absent", label: "Absent", color: "#E91E63" },
  { key: "leave", label: "Leave", color: "#F7C948" },
  { key: "late", label: "Late", color: "#1E57A6" },
];

export default function Index() {
  const [attendance, setAttendance] = useState(
    EMPLOYEES.map((emp) => ({ ...emp, status: "present" }))
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openStatusModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const updateStatus = (status) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.id === selectedUser.id ? { ...item, status } : item
      )
    );
    setModalVisible(false);
  };

  const saveAttendance = () => {
    console.log("ATTENDANCE SAVED =>", attendance);
    alert("Attendance Saved Successfully!");
  };

  return (
    <View style={styles.screen}>
      <Header title="Attendance" />

      {/* DATE */}
      <View style={styles.dateBox}>
        <MaterialIcons name="calendar-month" size={22} color="#1E57A6" />
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={attendance}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => {
          const statusObj = STATUS_OPTIONS.find((s) => s.key === item.status);
          return (
            <View style={styles.row}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userPhone}>{item.phone}</Text>
              </View>

              <TouchableOpacity
                style={[styles.statusBtn, { backgroundColor: statusObj.color }]}
                onPress={() => openStatusModal(item)}
              >
                <Text style={styles.statusText}>{statusObj.label}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* SAVE BUTTON */}
      <View style={styles.saveWrapper}>
        <TouchableOpacity style={styles.saveButton} onPress={saveAttendance}>
          <MaterialIcons name="save" size={22} color="#fff" />
          <Text style={styles.saveText}>Save Attendance</Text>
        </TouchableOpacity>
      </View>

      {/* STATUS SELECT MODAL */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Status</Text>

            {STATUS_OPTIONS.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.option, { backgroundColor: opt.color }]}
                onPress={() => updateStatus(opt.key)}
              >
                <Text style={styles.optionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
  },

  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E57A6",
  },

  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },

  userInfo: { flex: 1 },

  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E57A6",
  },

  userPhone: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },

  statusBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
  },

  statusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  saveWrapper: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F48424",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1E57A6",
  },

  option: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  optionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#F48424",
  },

  cancelText: {
    textAlign: "center",
    color: "#F48424",
    fontWeight: "700",
    fontSize: 16,
  },
});
