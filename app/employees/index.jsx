import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddUser from "../../components/AddEmployee";
import BottomModal from "../../components/BottomModal";
import Header from "../../components/header";
import UserTable from "../../components/show";
import ViewUser from "../../components/ViewUser";

const BASE_URL = "http://192.168.1.17:8000/api";

export default function Index() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState(""); // view | add
  const [selectedUser, setSelectedUser] = useState(null);

  // ==============================================
  // FETCH ALL EMPLOYEES
  // ==============================================
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("EMPLOYEES =>", data);

      if (Array.isArray(data.Employees)) {
        setEmployees(data.Employees);
      } else {
        setEmployees([]);
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

  // ==============================================
  // DELETE EMPLOYEE
  // ==============================================
  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this employee?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");

              const res = await fetch(`${BASE_URL}/employee/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              const data = await res.json();
              console.log("DELETE RESPONSE:", data);

              if (data.Message || data.message) {
                Alert.alert("Deleted", "Employee removed successfully!");
                fetchEmployees();
              }
            } catch (e) {
              console.log("Delete Error:", e);
            }
          },
        },
      ]
    );
  };

  // ==============================================
  // UI LOADER
  // ==============================================
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E57A6" />
        <Text>Loading Employees...</Text>
      </View>
    );
  }

  // ==============================================
  // MAIN UI
  // ==============================================
  return (
    <View style={styles.screen}>
      <Header title="Employees" />

      <UserTable
        data={employees}
        showRole={false}
        showShopName={false}
        onView={(user) => {
          setSelectedUser(user);
          setMode("view");
          setModalVisible(true);
        }}
        onEdit={(emp) => router.push(`/employees/edit/${emp.id}`)}
        onDelete={(emp) => handleDelete(emp.id)}
      />

      {/* ADD BUTTON */}
      <View style={styles.addButtonWrapper}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setMode("add");
            setSelectedUser(null);
            setModalVisible(true);
          }}
        >
          <MaterialIcons name="add" size={22} color="#fff" />
            <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM MODAL */}
      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        {mode === "view" && (
          <ViewUser data={selectedUser} showShopName={false} />
        )}
        {mode === "add" && (
          <AddUser
            title="Add Employee"
            showType={false}
            showShopName={false}
            onSuccess={fetchEmployees}
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
