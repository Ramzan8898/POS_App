import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/header";

const ORDER_URL = "http://192.168.1.17:8000/api/orders";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(ORDER_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      console.log("Orders Response:", json);

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

        
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Orders" />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : orders.length === 0 ? (
        <Text style={styles.empty}>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => openReceipt(item)}
              activeOpacity={0.7}
            >
              {/* FIRST ROW → Invoice + Status */}
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

              {/* CUSTOMER NAME */}
              <Text style={styles.customer}>
                {item.customer?.name ?? "Walk-in Customer"}
              </Text>

              {/* DUE + PAID + ARROW */}
              <View style={styles.row}>
                <Text style={styles.subInfo}>
                  Due: {item.due} | Paid: {item.pay}
                </Text>

                <Text style={styles.arrow}>›</Text>
              </View>

              {/* TOTAL */}
              <Text style={styles.total}>Total Rs {item.total}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 14,
    backgroundColor: "#ffffff",
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

  orderId: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E1E1E",
  },

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

  customer: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  subInfo: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },

  arrow: {
    marginTop: 10,
    fontSize: 36,
    color: "#1E57A6",
    fontWeight: "800",
    marginRight: 4,
  },

  total: {
    marginTop: 1,
    fontSize: 17,
    fontWeight: "800",
    color: "#1E57A6",
  },
});
