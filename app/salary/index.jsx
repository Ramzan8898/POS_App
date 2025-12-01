import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/header";

const BASE_URL = "http://192.168.1.17:8000/api";

export default function SalaryScreen() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const empRes = await fetch(`${BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const empJson = await empRes.json();
      const list = empJson.Employees ?? [];

      const updated = await Promise.all(
        list.map(async (emp) => {
          const res = await fetch(`${BASE_URL}/salary/employee/${emp.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const js = await res.json();
          const s = js.salary ?? {};

          const paid = s.paid_this_month ?? 0;
          const remaining = (s.basic_salary ?? emp.salary) - paid;

          return {
            ...emp,
            basic_salary: s.basic_salary ?? emp.salary,
            paid_this_month: paid,
            remaining_salary: remaining,
            advance_salary: s.advance_salary ?? 0,
          };
        })
      );

      setEmployees(updated);
    } catch (e) {
      console.log("SALARY FETCH ERROR", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const paySalary = async (emp, amount) => {
    if (emp.remaining_salary <= 0)
      return Alert.alert("Notice", "Salary fully paid already!");

    try {
      const token = await AsyncStorage.getItem("token");

      const payload = {
        employee_id: emp.id,
        date: new Date().toISOString().slice(0, 10),
        amount: amount,
      };

      const res = await fetch(`${BASE_URL}/salary/pay`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      Alert.alert(json.success ? "Success" : "Failed", json.message);

      if (json.success) fetchEmployees();
    } catch (err) {
      console.log("PAY ERROR =>", err);
    }
  };

  const payPartial = (emp) => {
    Alert.prompt(
      "Partial Payment",
      "Enter amount to pay:",
      (val) => {
        const amount = Number(val);
        if (!amount || amount <= 0) return Alert.alert("Invalid Amount");

        if (amount > emp.remaining_salary)
          return Alert.alert("Cannot exceed remaining salary!");

        paySalary(emp, amount);
      },
      "plain-text",
      "",
      "numeric"
    );
  };

  return (
    <View style={styles.screen}>
      <Header title="Salary" />

      <View style={styles.monthBox}>
        <MaterialIcons name="calendar-month" size={22} color="#1E57A6" />
        <Text style={styles.monthText}>{currentMonth}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1E57A6" />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(i) => i.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const isPaid = item.remaining_salary <= 0;

            return (
              <View style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.phone}>{item.phone}</Text>

                  <Text style={styles.salary}>
                    Basic Salary: Rs {item.basic_salary}
                  </Text>
                  <Text style={styles.advance}>
                    Advance: Rs {item.advance_salary}
                  </Text>
                  <Text style={styles.paid}>
                    Paid This Month: Rs {item.paid_this_month}
                  </Text>
                  <Text style={styles.remaining}>
                    Remaining: Rs {item.remaining_salary}
                  </Text>
                </View>

                {/* BUTTON GROUP */}
                <View>
                  {/* FULL PAY BUTTON */}
                  <TouchableOpacity
                    style={[styles.payBtn, isPaid && styles.disabledBtn]}
                    disabled={isPaid}
                    onPress={() => paySalary(item, item.remaining_salary)}
                  >
                    <Text style={styles.btnText}>Full Pay</Text>
                  </TouchableOpacity>

                  {/* PARTIAL PAY BUTTON */}
                  <TouchableOpacity
                    style={[styles.partialBtn, isPaid && styles.disabledBtn]}
                    disabled={isPaid}
                    onPress={() => payPartial(item)}
                  >
                    <Text style={styles.btnText}>Partial</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
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
  monthText: { fontSize: 16, fontWeight: "bold", color: "#1E57A6" },

  row: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#1E57A6" },
  phone: { fontSize: 13, color: "#666" },
  salary: { fontSize: 13, marginTop: 2 },
  advance: { fontSize: 13, color: "#F48424" },
  paid: { fontSize: 13, color: "#1E57A6" },
  remaining: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "700",
    color: "#E91E63",
  },
  done: { color: "#27AE60", fontWeight: "bold" },

  payBtn: {
    backgroundColor: "#27AE60",
    paddingVertical: 6,
    marginBottom: 6,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  partialBtn: {
    backgroundColor: "#F48424",
    paddingVertical: 6,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
