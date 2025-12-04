import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Cards from "../../components/cards";
import Header from "../../components/header";

const BASE_URL = "http://192.168.1.17:8000";

export default function Index() {
  const router = useRouter();

  const [productCount, setProductCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [ordersCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const getLength = (obj, keys) => {
    for (let k of keys) {
      if (obj[k] && Array.isArray(obj[k])) return obj[k].length;
    }
    return 0;
  };

  const loadDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      // PRODUCTS
      const productsRes = await fetch(`${BASE_URL}/api/products`, { headers });
      const productsData = await productsRes.json();
      setProductCount(
        getLength(productsData, ["products", "Products", "data", "items"])
      );

      // ORDERS
      const ordersRes = await fetch(`${BASE_URL}/api/orders`, { headers });
      const ordersData = await ordersRes.json();
      setOrderCount(
        getLength(ordersData, ["orders", "Orders", "data", "items"])
      );

      // EMPLOYEES
      const employeesRes = await fetch(`${BASE_URL}/api/employees`, {
        headers,
      });
      const employeesData = await employeesRes.json();
      setEmployeeCount(
        getLength(employeesData, ["employees", "Employees", "data", "items"])
      );

      // CUSTOMERS
      const customersRes = await fetch(`${BASE_URL}/api/customers`, {
        headers,
      });
      const customersData = await customersRes.json();
      setCustomerCount(
        getLength(customersData, ["customers", "Customers", "data", "items"])
      );
    } catch (err) {
      console.log("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
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
        <Pressable onPress={() => router.push("/products")}>
          <Cards
            title="Products"
            icon="cart-outline"
            count={productCount}
            progress={64}
          />
        </Pressable>

        <Pressable onPress={() => router.push("/orders")}>
          <Cards
            title="Total Orders"
            icon="basket-fill"
            count={ordersCount}
            progress={78}
          />
        </Pressable>

        <Pressable onPress={() => router.push("/employees")}>
          <Cards
            title="Employees"
            icon="account-group"
            count={employeeCount}
            progress={92}
          />
        </Pressable>

        <Pressable onPress={() => router.push("/customers")}>
          <Cards
            title="Customers"
            icon="account-multiple-check"
            count={customerCount}
            progress={65}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "column", paddingHorizontal: 10, marginTop: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
