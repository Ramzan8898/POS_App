import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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

const BASE_URL = "http://192.168.1.20:8000/api";

export default function Index() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState(""); // add | edit | view
  const [selectedUser, setSelectedUser] = useState(null);

  // ============================================
  // GET TOKEN
  // ============================================
  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  // ============================================
  // FETCH ALL EMPLOYEES  => GET /api/employees
  // ============================================
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const { data } = await axios.get(`${BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && Array.isArray(data.employees)) {
        setEmployees(data.employees);
      }
    } catch (error) {
      console.log("Fetch Employees Error:", error);
      Alert.alert("Error", "Unable to fetch employees!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ============================================
  // STORE EMPLOYEE => POST /api/employees
  // payload: FormData()
  // ============================================
  const storeEmployee = async (payload) => {
    try {
      const token = await getToken();

      const { data } = await axios.post(`${BASE_URL}/employees`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        Alert.alert("Success", "Employee added successfully!");
        setModalVisible(false);
        fetchEmployees();
      }
    } catch (e) {
      console.log("Store Employee Error:", e);
      Alert.alert("Error", "Unable to add employee!");
    }
  };

  // ============================================
  // FETCH SINGLE EMPLOYEE => GET /api/employees/{id}
  // ============================================
  const fetchSingleEmployee = async (id) => {
    try {
      const token = await getToken();

      const { data } = await axios.get(`${BASE_URL}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.employee;
    } catch (e) {
      console.log("Fetch Single Error:", e);
    }
  };

  // ============================================
  // UPDATE EMPLOYEE => PUT /api/employees/{id}
  // payload must be FormData with _method=PUT
  // ============================================
  const updateEmployee = async (id, payload) => {
    try {
      payload.append("_method", "PUT");
      const token = await getToken();

      const { data } = await axios.post(
        `${BASE_URL}/employees/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        Alert.alert("Success", "Employee updated successfully!");
        setModalVisible(false);
        fetchEmployees();
      }
    } catch (e) {
      console.log("Update Error:", e);
      Alert.alert("Error", "Unable to update employee!");
    }
  };

  // ============================================
  // DELETE EMPLOYEE => DELETE /api/employees/{id}
  // ============================================
  const deleteEmployee = async (id) => {
    try {
      const token = await getToken();

      await axios.delete(`${BASE_URL}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Deleted!", "Employee removed successfully!");
      fetchEmployees();
    } catch (e) {
      console.log("Delete Error:", e);
      Alert.alert("Error", "Unable to delete employee!");
    }
  };

  // ============================================
  // OPEN MODALS
  // ============================================
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

  // ============================================
  // LOADING UI
  // ============================================
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E57A6" />
        <Text>Loading Employees...</Text>
      </View>
    );

  // ============================================
  // UI
  // ============================================
  return (
    <View style={styles.screen}>
      <Header title="Employees" />

      <UserTable
        data={employees}
        onView={async (user) => {
          const fullEmployee = await fetchSingleEmployee(user.id);
          setSelectedUser(fullEmployee);
          setMode("view");
          setModalVisible(true);
        }}
        onEdit={async (user) => {
          const fullEmployee = await fetchSingleEmployee(user.id);
          setSelectedUser(fullEmployee);
          setMode("edit");
          setModalVisible(true);
        }}
        onDelete={(user) => deleteEmployee(user.id)}
        showRole={false}
        showShopName={false}
      />

      <View style={styles.addButtonWrapper}>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>

      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        {mode === "view" && (
          <ViewUser data={selectedUser} showShopName={false} />
        )}

        {mode === "edit" && (
          <AddUser
            title="Edit Employee"
            data={selectedUser}
            onSubmit={(payload) => updateEmployee(selectedUser.id, payload)}
            showType={false}
            showShopName={false}
          />
        )}

        {mode === "add" && (
          <AddUser
            title="Add Employee"
            onSubmit={storeEmployee}
            showType={false}
            showShopName={false}
          />
        )}
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
