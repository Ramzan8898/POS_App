import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Cards from "../../components/cards";
import Header from "../../components/header";

const BASE_URL = "http://192.168.1.23:8000";

export default function Index() {
  const router = useRouter();
  const [productCount, setProductCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🟢 FETCH BOTH COUNTS IN ONE FUNCTION
  const loadDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // 1️⃣ FETCH PRODUCTS
      const productsRes = await fetch(`${BASE_URL}/api/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const productsData = await productsRes.json();
      if (productsData.products) {
        setProductCount(productsData.products.length);
      }

      // 2️⃣ FETCH EMPLOYEES
      const employeesRes = await fetch(`${BASE_URL}/api/employees`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const employeesData = await employeesRes.json();
      if (employeesData.employees) {
        setEmployeeCount(employeesData.employees.length);
      }
    } catch (err) {
      console.log("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false); // 👈 Loader stops AFTER BOTH COMPLETED
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E57A6" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Dashboard" />

      <View style={styles.grid}>
        {/* PRODUCTS CARD */}
        <Pressable onPress={() => router.push("/products")}>
          <Cards
            title="Products"
            icon="cart-outline"
            count={productCount}
            progress={64}
          />
        </Pressable>

        {/* ORDERS CARD */}
        <Cards
          title="Total Orders"
          icon="basket-fill"
          count={1250}
          progress={78}
        />

        {/* EMPLOYEES CARD */}
        <Pressable onPress={() => router.push("/employees")}>
          <Cards
            title="Employees"
            icon="account-group"
            count={employeeCount}
            progress={92}
          />
        </Pressable>

        {/* CUSTOMERS CARD */}
        <Cards
          title="Customers"
          icon="account-multiple-check"
          count={350}
          progress={65}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "column",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
