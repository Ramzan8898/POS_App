import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "../../components/header";
import SalaryModal from "../../components/SalaryModal";

const EMPLOYEES = [
  { id: 1, name: "Ali Khan", phone: "0300-1234567", salary: 25000 },
  { id: 2, name: "Ahmed Raza", phone: "0312-9988776", salary: 30000 },
  { id: 3, name: "Bilal Aslam", phone: "0321-5566778", salary: 28000 },
  { id: 4, name: "Hamza Tariq", phone: "0345-8976543", salary: 26000 },
];

export default function Index() {
  const [list, setList] = useState(
    EMPLOYEES.map((emp) => ({
      ...emp,
      paid: 0,
      deduction: 0,
      bonus: 0,
      remarks: "",
    }))
  );

  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openEdit = (item) => {
    setSelected(item);
    setModalVisible(true);
  };

  const saveSalary = (updated) => {
    setList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setModalVisible(false);
  };

  return (
    <View style={styles.screen}>
      <Header title="Salary" />

      {/* MONTH */}
      <View style={styles.monthBox}>
        <MaterialIcons name="calendar-month" size={22} color="#1E57A6" />
        <Text style={styles.monthText}>
          {new Date().toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Text>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => {
          const net = item.paid - item.deduction + item.bonus;
          return (
            <View style={styles.row}>
              {/* INFO */}
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.phone}>{item.phone}</Text>
                <Text style={styles.salary}>
                  Basic Salary: Rs {item.salary}
                </Text>
                <Text style={styles.salary}>Paid: Rs {item.paid}</Text>
                <Text style={styles.salary}>Cutting: Rs {item.deduction}</Text>
                <Text style={styles.salary}>Bonus: Rs {item.bonus}</Text>
                <Text style={styles.net}>Net: Rs {net}</Text>
              </View>

              {/* EDIT BUTTON */}
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => openEdit(item)}
              >
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* MODAL */}
      <SalaryModal
        visible={modalVisible}
        data={selected}
        onClose={() => setModalVisible(false)}
        onSave={saveSalary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  monthBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E57A6",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#1E57A6" },
  phone: { fontSize: 13, color: "#555" },
  salary: { fontSize: 13, color: "#000", marginTop: 2 },
  net: { fontSize: 14, color: "#27AE60", fontWeight: "700", marginTop: 5 },
  editBtn: {
    backgroundColor: "#F48424",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
});
