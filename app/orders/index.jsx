import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/header";

const ORDER_URL = "http://192.168.1.17:8000/api/orders";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(ORDER_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      const list =
        json.orders ||
        json.data ||
        json.Orders ||
        (Array.isArray(json) ? json : []);

      setOrders(list);
    } catch (e) {
      console.log("Orders Fetch Error:", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // SEARCH FILTER
  const filteredOrders = orders.filter((item) =>
    item.invoice_no?.toString().includes(search)
  );

  // OPEN RECEIPT
  const openReceipt = (order) => {
    const products =
      order.order_details ||
      order.details ||
      order.items ||
      order.products ||
      [];

    router.push({
      pathname: "/receipt",
      params: {
        order_id: order.id,
        total: order.total,
        paid: order.pay,
        due: order.due,
        customer: order.customer?.name ?? "Walk-in Customer",
        date: order.order_date,
        status: order.payment_status,
        previousBalance: order.previous_balance ?? 0,
        discount: order.discount ?? 0,
        tax: order.tax ?? 0,
        subtotal: order.subtotal ?? order.total,
        cart: JSON.stringify(products),
        balance: order.customer?.balance ?? 0,
        invoice:order.invoice_no
      },
    });
  };

  // EDIT ORDER → LOAD INTO POS SCREEN
  const editOrder = (order) => {
    const products =
      order.order_details ||
      order.details ||
      order.items ||
      order.products ||
      [];

    router.push({
      pathname: "/(tabs)/pos", // 👈 GOES TO POS TAB
      params: {
        edit: "true",
        order_id: order.id,
        customer_id: order.customer_id,
        subtotal: order.subtotal,
        discount: order.discount,
        tax: order.tax,
        previousBalance: order.previous_balance,
        paid: order.pay,
        due: order.due,
        total: order.total,
        cart: JSON.stringify(products),
      },
    });
  };

  // DELETE ORDER
  const deleteOrder = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${ORDER_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (json.success) {
        setOrders((prev) => prev.filter((order) => order.id !== id)); // realtime UI update
        alert("Order Deleted Successfully!");
      } else {
        alert(json.message ?? "Delete failed");
      }
    } catch (e) {
      console.log("Order Delete Error:", e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Orders" />

      {/* SEARCH BOX */}
      <TextInput
        placeholder="Search invoice no..."
        style={styles.searchBox}
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : filteredOrders.length === 0 ? (
        <Text style={styles.empty}>No orders found</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* TOP ROW */}
              <View style={styles.row}>
                <Text style={styles.orderId}>#{item.invoice_no}</Text>
                <Text
                  style={[
                    styles.status,
                    item.payment_status === "complete"
                      ? styles.statusComplete
                      : styles.statusPending,
                  ]}
                >
                  {item.payment_status}
                </Text>
              </View>

              <Text style={styles.customer}>
                {item.customer?.name ?? "Walk-in Customer"}
              </Text>

              <View style={styles.row}>
                <Text style={styles.subInfo}>
                  Due: {item.due} | Paid: {item.pay}
                </Text>

                {/* ACTION BUTTONS */}
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity onPress={() => editOrder(item)}>
                    <MaterialCommunityIcons
                      name="pencil"
                      size={23}
                      color="#1E57A6"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deleteOrder(item.id)}>
                    <MaterialCommunityIcons
                      name="delete"
                      size={23}
                      color="#E91E63"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => openReceipt(item)}>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={28}
                      color="#1E57A6"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.total}>Total Rs {item.total}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    borderWidth: 2,
    borderColor: "#1E57A6",
    margin: 12,
    padding: 10,
    borderRadius: 12,
    fontSize: 16,
  },
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#F48424",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: { fontSize: 17, fontWeight: "700", color: "#1E1E1E" },
  customer: { marginTop: 6, fontSize: 15, fontWeight: "600", color: "#222" },
  status: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: "#fff",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  statusComplete: { backgroundColor: "#27A55B" },
  statusPending: { backgroundColor: "#E91E63" },
  subInfo: { marginTop: 2, fontSize: 15, fontWeight: "600", color: "#555" },
  total: { marginTop: 1, fontSize: 17, fontWeight: "800", color: "#1E57A6" },
  empty: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});
