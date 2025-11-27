import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import EditProfileModal from "../../components/EditProfileModal";
import BottomModal from "../../components/BottomModal";
import Header from "../../components/header";
import UserTable from "../../components/show";
import ViewUser from "../../components/ViewUser";
const BASE_URL = "http://192.168.1.23:8000";

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState(""); // view | editRole
  const [selectedUser, setSelectedUser] = useState(null);
  const [Loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/users`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.users) setUserList(data.users);
      setLoading(false);

    } catch (e) {
      console.log("Fetching Users Error:", e);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const openView = (user) => {
    setMode("view");
    setSelectedUser(user);
    setModalVisible(true);
  };

  const openEditProfile = (user) => {
    setMode("editProfile");
    setSelectedUser(user);
    setModalVisible(true);
  };
  if (Loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E57A6" />
        <Text>Loading Users...</Text>
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <Header title="Users" />

      <UserTable
        data={userList}
        showSalary={false}
        showShopName={false}
        showRole={true}
        onView={openView}
        onEdit={openEditProfile}
        onDelete={(u) => console.log("Delete User:", u)}
      />
      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        {mode === "view" && <ViewUser data={selectedUser} />}
      </BottomModal>

      {mode === "editProfile" && (
        <EditProfileModal
          user={selectedUser}
          visible={modalVisible}
          onSave={(updatedUser) => {
            alert("Profile updated!");
            setModalVisible(false);
            setMode();
            fetchUsers();
          }}
          onClose={() => setModalVisible(false)}

        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
