import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddUser from "../../components/add";
import BottomModal from "../../components/BottomModal";
import Header from "../../components/header";
import UserTable from "../../components/show";
import ViewUser from "../../components/ViewUser";

const BASE_URL = "http://192.168.1.23:8000";

export default function Index() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // ****************************************************
  // FETCH ALL EMPLOYEES ==> GET /api/employees
  // ****************************************************
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/employees`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = await res.text();
      if (!raw.trim()) return;

      const data = JSON.parse(raw);

      if (Array.isArray(data.employees)) {
        setEmployees(data.employees);
      }
    } catch (e) {
      console.log("Fetch Employees Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ****************************************************
  // STORE EMPLOYEE ==> POST /api/store
  // ****************************************************
  const storeEmployee = async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/store`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload, // FormData
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Employee added successfully!");
        fetchEmployees();
      }
    } catch (e) {
      console.log("Store Error:", e);
    }
  };

  // ****************************************************
  // GET SINGLE EMPLOYEE ==> GET /api/employees/{id}
  // ****************************************************
  const fetchSingleEmployee = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/employees/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      return data.employee;
    } catch (e) {
      console.log("Fetch Single Error:", e);
    }
  };

  // ****************************************************
  // UPDATE EMPLOYEE ==> PUT /api/employees/{id}
  // ****************************************************
  const updateEmployee = async (id, payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/employees/${id}`, {
        method: "POST", // PUT spoofing using FormData
        headers: { Authorization: `Bearer ${token}` },
        body: payload, // method:_PUT included
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Updated", "Employee updated successfully!");
        fetchEmployees();
      }
    } catch (e) {
      console.log("Update Error:", e);
    }
  };

  // ****************************************************
  // DELETE EMPLOYEE ==> DELETE /api/employees/{id}
  // ****************************************************
  const deleteEmployee = (id) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/api/employees/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (data.success) {
              setEmployees((prev) => prev.filter((e) => e.id !== id));
              Alert.alert("Deleted", "Employee removed!");
            }
          } catch (e) {
            console.log("Delete Error:", e);
          }
        },
      },
    ]);
  };

  // ****************************************************
  // MODAL ACTIONS
  // ****************************************************
  const openAdd = () => {
    setMode("add");
    setSelectedUser(null);
    setModalVisible(true);
  };

  const openEdit = async (user) => {
    const fullEmployee = await fetchSingleEmployee(user.id);
    setSelectedUser(fullEmployee);
    setMode("edit");
    setModalVisible(true);
  };

  const openView = async (user) => {
    const fullEmployee = await fetchSingleEmployee(user.id);
    setSelectedUser(fullEmployee);
    setMode("view");
    setModalVisible(true);
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E57A6" />
        <Text>Loading Employees...</Text>
      </View>
    );

  return (
    <View style={styles.screen}>
      <Header title="Employees" />

      <UserTable
        data={employees}
        showSalary={true}
        onView={openView}
        onEdit={openEdit}
        onDelete={(item) => deleteEmployee(item.id)}
      />

      <View style={styles.addButtonWrapper}>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>

      <BottomModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        {mode === "add" && <AddUser onSubmit={storeEmployee} />}
        {mode === "edit" && (
          <AddUser data={selectedUser} onSubmit={(fd) => updateEmployee(selectedUser.id, fd)} />
        )}
        {mode === "view" && <ViewUser data={selectedUser} />}
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  addButtonWrapper: {
    position: "absolute",
    bottom: 85,
    width: "100%",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#F48424",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
  },
});
