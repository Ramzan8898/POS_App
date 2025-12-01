import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import AddUser from "../../components/AddCustomer";
import BottomModal from "../../components/BottomModal";
import Header from "../../components/header";
import UserTable from "../../components/show";
import ViewUser from "../../components/ViewUser";

const BASE_URL = "http://192.168.1.17:8000/api";

export default function Index() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // FETCH CUSTOMERS
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (Array.isArray(data.Customers)) setCustomers(data.Customers);
    } catch (e) {
      console.log("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // DELETE CUSTOMER
  const deleteCustomer = async (id) => {
    Alert.alert("Confirm Delete", "Do you really want to delete this customer?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/customer/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (data.success) {
              Alert.alert("Deleted!", "Customer removed successfully!");
              fetchCustomers();
            }
          } catch (e) {
            console.log("Delete Error:", e);
          }
        },
      },
    ]);
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#19529C" />
        <Text>Loading customers...</Text>
      </View>
    );

  const openAdd = () => {
    setMode("add");
    setSelectedUser(null);
    setModalVisible(true);
  };

  const openView = (user) => {
    setSelectedUser(user);
    setMode("view");
    setModalVisible(true);
  };

  const openEdit = (user) => {
    router.push(`/customers/edit/${user.id}`);
  };

  return (
    <View style={styles.screen}>
      <Header title="Customers" />

      <UserTable
        data={customers}
        showSalary={false}
        showShopName={true}
        onView={openView}
        onEdit={openEdit}
        onDelete={(user) => deleteCustomer(user.id)}
      />

      <View style={styles.addButtonWrapper}>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Customer</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <BottomModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        {mode === "add" && (
          <AddUser
            title="Customer"
            onSuccess={fetchCustomers}
            onClose={() => setModalVisible(false)}
          />
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
    left: 0,
    right: 0,
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#F48424",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  addButtonText: { color: "#fff", fontSize: 16, marginLeft: 6, fontWeight: "600" },
});
