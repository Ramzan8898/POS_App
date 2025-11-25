import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AddUser from "../../components/add";
import BottomModal from "../../components/BottomModal";
import Header from "../../components/header";
import UserTable from "../../components/show";
import ViewUser from "../../components/ViewUser";

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const supplierData = [
    {
      image: "",
      name: "Supplier One",
      phone: "0300-5555555",
      salary: "",
      shopName: "Alpha Traders",
      address: "Islamabad",
      type: "Distributor",
    },
    {
      image: "",
      name: "Supplier Two",
      phone: "0301-7777777",
      salary: "",
      shopName: "Metro Supplies",
      address: "Faisalabad",
      type: "WholeSaler",
    },
  ];

  const openAdd = () => {
    setMode("add");
    setSelectedUser(null);
    setModalVisible(true);
  };

  const openEdit = (user) => {
    setMode("edit");
    setSelectedUser(user);
    setModalVisible(true);
  };

  const openView = (user) => {
    setMode("view");
    setSelectedUser(user);
    setModalVisible(true);
  };

  return (
    <View style={styles.screen}>
      <Header title="Suppliers" />

      <UserTable
        data={supplierData}
        showSalary={false}
        showShopName={false}
        showType={true}
        onView={openView}
        onEdit={openEdit}
        onDelete={(user) => console.log("Delete", user)}
      />

      {/* ADD BUTTON */}
      <View style={styles.addButtonWrapper}>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Supplier</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM MODAL */}
      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        {mode === "add" && (
          <AddUser title="Supplier" showSalary={false} showShopName={true} />
        )}
        {mode === "edit" && (
          <AddUser
            title="Edit Supplier"
            showSalary={false}
            showShopName={true}
            data={selectedUser}
          />
        )}
        {mode === "view" && <ViewUser data={selectedUser} />}
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

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
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "600",
  },
});
