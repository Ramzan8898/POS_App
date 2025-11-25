import { useState } from "react";
import { StyleSheet, View } from "react-native";

import BottomModal from "../../components/BottomModal";
import Header from "../../components/header";
import RoleAssignModal from "../../components/RoleAssignModal";
import UserTable from "../../components/show";
import ViewUser from "../../components/ViewUser";

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState(""); // view | editRole
  const [selectedUser, setSelectedUser] = useState(null);

  const userList = [
    {
      id: 1,
      image: "",
      name: "Ali Khan",
      phone: "0300-1234567",
      role: "Admin",
      address: "Lahore",
    },
    {
      id: 2,
      image: "",
      name: "Ahmed Raza",
      phone: "0301-9988776",
      role: "Cashier",
      address: "Karachi",
    },
    {
      id: 3,
      image: "",
      name: "Hamza Tariq",
      phone: "0313-8765432",
      role: "Salesman",
      address: "Islamabad",
    },
  ];

  const openView = (user) => {
    setMode("view");
    setSelectedUser(user);
    setModalVisible(true);
  };

  const openRoleAssign = (user) => {
    setMode("editRole");
    setSelectedUser(user);
    setModalVisible(true);
  };

  return (
    <View style={styles.screen}>
      <Header title="Users" />

      <UserTable
        data={userList}
        showSalary={false}
        showShopName={false}
        showRole={true}
        onView={openView}
        onEdit={openRoleAssign}
        onDelete={(u) => console.log("Delete User:", u)}
      />

      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        {mode === "view" && <ViewUser data={selectedUser} />}

        {mode === "editRole" && (
          <RoleAssignModal
            user={selectedUser}
            onUpdateRole={(role) => {
              alert(`Role updated to ${role}`);
              setModalVisible(false);
            }}
          />
        )}
      </BottomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
});
