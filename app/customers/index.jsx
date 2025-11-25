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
  const [mode, setMode] = useState(""); // add | edit | view
  const [selectedUser, setSelectedUser] = useState(null);

  const CustomerData = [
    {
      image: "",
      name: "Ali Khan",
      phone: "0300-1234567",
      salary: "",
      shopName: "TechDot",
      address: "Lahore",
      Role:"Customer"
    },
    {
      image: "",
      name: "Ahmed Raza",
      phone: "0312-9988776",
      salary: "",
      shopName: "WebsCare",
      address: "Karachi",
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
      <Header title="Customer" />

      <UserTable
        data={CustomerData}
        showSalary={false}
        showShopName={true}
        
        onView={openView}
        onEdit={openEdit}
        onDelete={(user) => console.log("Delete", user)}
      />

      {/* ADD BUTTON */}
      <View style={styles.addButtonWrapper}>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Customer</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        {mode === "add" && <AddUser title="Customer" showSalary={false} />}
        {mode === "edit" && (
          <AddUser
            title="Edit Customer"
            data={selectedUser}
            showSalary={false}
          />
        )}
        {mode === "view" && <ViewUser data={selectedUser}   />}
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
    elevation: 5,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "600",
  },
});
