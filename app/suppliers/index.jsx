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

import { useRouter } from "expo-router";
import AddSupplier from "../../components/AddSupplier";
import BottomModal from "../../components/BottomModal";
import Header from "../../components/header";
import UserTable from "../../components/show";
import ViewSupplier from "../../components/ViewSupplier";

const BASE_URL = "http://192.168.1.17:8000/api";

export default function Index() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState(""); // add | view
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const router = useRouter();

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("SUPPLIERS =>", data);

      if (data.Suppliers) setSuppliers(data.Suppliers);
    } catch (e) {
      console.log("FETCH SUPPLIER ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openAdd = () => {
    setMode("add");
    setSelectedSupplier(null);
    setModalVisible(true);
  };

  const openView = (supplier) => {
    setMode("view");
    setSelectedSupplier(supplier);
    setModalVisible(true);
  };

  const openEdit = (supplier) => {
    router.push(`/suppliers/edit/${supplier.id}`);
  };

  const deleteSupplier = async (supplier) => {
    Alert.alert("Confirm Delete", `Delete ${supplier.name}?`, [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/supplier/${supplier.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (data.Message === "Success") {
              // 🔥 Remove item locally without reloading screen
              setSuppliers((prev) =>
                prev.filter((item) => item.id !== supplier.id)
              );
            } else {
              Alert.alert("Error", "Failed to delete supplier");
            }
          } catch (e) {
            console.log("DELETE ERROR:", e);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <Header title="Suppliers" />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1E57A6"
          style={{ marginTop: 30 }}
        />
      ) : (
        <UserTable
          data={suppliers}
          showSalary={false}
          showShopName={false}
          showType={true}
          onView={openView}
          onEdit={openEdit}
          onDelete={deleteSupplier}
        />
      )}

      <View style={styles.addButtonWrapper}>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Supplier</Text>
        </TouchableOpacity>
      </View>

      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        {mode === "add" && (
          <AddSupplier
            onSuccess={fetchSuppliers}
            onClose={() => setModalVisible(false)}
          />
        )}

        {mode === "view" && <ViewSupplier data={selectedSupplier} />}
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
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
    backgroundColor: "#F48424",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "600",
  },
});
