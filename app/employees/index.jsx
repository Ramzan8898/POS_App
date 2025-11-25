import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/header";
import UserTable from "../../components/show";

export default function Index() {
  const employeeData = [
    {
      image: "",
      name: "Ali Khan",
      phone: "0300-1234567",
      salary: "25000",
      shopName: "",
      address: "Lahore",
    },
    {
      image: "",
      name: "Ahmed Raza",
      phone: "0312-9988776",
      salary: "30000",
      shopName: "",
      address: "Karachi",
    },
  ];

  return (
    <View style={styles.screen}>
      <Header title="Employees" />

      <UserTable
        data={employeeData}
        showSalary={true}
        showShopName={false}
        onView={(user) => console.log("View", user)}
        onEdit={(user) => console.log("Edit", user)}
        onDelete={(user) => console.log("Delete", user)}
      />

      {/* BOTTOM FIXED ADD BUTTON */}
      <View style={styles.addButtonWrapper}>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#1E57A6",
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
