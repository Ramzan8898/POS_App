import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/header";

const BASE_URL = "http://192.168.1.17:8000/api/products";

export default function Index() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(BASE_URL, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      console.log("Fetched Products:", json);

      if (Array.isArray(json.Products)) {
        setProducts(json.Products);
      }
    } catch (err) {
      console.log("Fetch Products Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================================================
  // FILTER
  // =========================================================
  const filtered = products.filter((item) =>
    item.product_name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================================================
  // CART FUNCTIONS + STOCK ADJUSTMENT
  // =========================================================

  const addToCart = (product) => {
    if (product.product_store <= 0) return;

    const exists = cart.find((p) => p.id === product.id);

    if (exists) {
      increaseQty(product.id);
    } else {
      setCart((prev) => [...prev, { ...product, qty: 1 }]);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, product_store: p.product_store - 1 } : p
        )
      );
    }
  };

  const increaseQty = (id) => {
    const prod = products.find((p) => p.id === id);
    if (!prod || prod.product_store <= 0) return;

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, product_store: p.product_store - 1 } : p
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((i) => i.qty > 0)
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, product_store: p.product_store + 1 } : p
      )
    );
  };

  const deleteItem = (id) => {
    const item = cart.find((p) => p.id === id);
    if (item) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, product_store: p.product_store + item.qty } : p
        )
      );
    }

    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearPOS = () => {
    setCart([]);
    fetchProducts(); // reset stock
    setSearch("");
  };

  // =========================================================
  // BILLING
  // =========================================================
  const subtotal = cart.reduce(
    (sum, item) => sum + item.selling_price * item.qty,
    0
  );
  const tax = subtotal * 0.05;
  const discount = subtotal * 0.02;
  const previousBalance = 2000;
  const total = subtotal + tax + previousBalance - discount;

  // =========================================================
  // PROCEED TO PAYMENT
  // =========================================================
  const proceedToPayment = () =>
    router.push({
      pathname: "/pos/receipt",
      params: {
        cart: JSON.stringify(cart),
        subtotal,
        tax,
        discount,
        previousBalance,
        total,
      },
    });

  // =========================================================
  // UI
  // =========================================================
  return (
    <View style={styles.container}>
      <Header title="POS" />

      {/* CLEAR POS BUTTON */}
      <TouchableOpacity style={styles.clearBtn} onPress={clearPOS}>
        <MaterialCommunityIcons name="delete" size={20} color="#fff" />
        <Text style={styles.clearText}>Clear POS</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        {/* SEARCH */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={24} color="#1E57A6" />
          <TextInput
            placeholder="Search product..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <Text style={styles.sectionTitle}>Products</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#1E57A6" />
        ) : (
          <FlatList
            data={filtered}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.card,
                  item.product_store <= 0 && { opacity: 0.3 },
                ]}
                disabled={item.product_store <= 0}
                onPress={() => addToCart(item)}
              >
                <Image
                  source={
                    item.product_image
                      ? { uri: item.product_image }
                      : require("../../assets/images/product.webp")
                  }
                  style={styles.image}
                />

                <View style={styles.info}>
                  <Text style={styles.name}>{item.product_name}</Text>
                  <View
                    style={{ display: "flex", flexDirection: "row", gap: 14, alignItems:"center" }}
                  >
                    <View
                      style={[
                        styles.stockBadge,
                        item.product_store === 0 && { backgroundColor: "red" },
                      ]}
                    >
                      <Text style={styles.stockText}>
                        Stock: {item.product_store}
                      </Text>
                    </View>
                    <Text style={styles.price}>Rs, {item.selling_price}</Text>
                  </View>
                </View>

                <MaterialCommunityIcons
                  name="plus-circle"
                  size={24}
                  color="#1E57A6"
                />
              </TouchableOpacity>
            )}
          />
        )}

        {/* CART */}
        <Text style={styles.sectionTitle}>Selected Items</Text>

        <FlatList
          data={cart}
          scrollEnabled={false}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.empty}>No product selected</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image
                source={
                  item.product_image
                    ? { uri: item.product_image }
                    : require("../../assets/images/product.webp")
                }
                style={styles.cartImg}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.cartName}>{item.product_name}</Text>
                <Text style={styles.cartPrice}>Rs {item.selling_price}</Text>
              </View>

              {/* QTY CONTROLS */}
              <View style={styles.qtyArea}>
                <TouchableOpacity
                  style={styles.circleBtn}
                  onPress={() => decreaseQty(item.id)}
                >
                  <MaterialCommunityIcons name="minus" size={18} />
                </TouchableOpacity>

                <Text style={styles.qty}>{item.qty}</Text>

                <TouchableOpacity
                  style={styles.circleBtn}
                  onPress={() => increaseQty(item.id)}
                >
                  <MaterialCommunityIcons name="plus" size={18} />
                </TouchableOpacity>
              </View>

              {/* DELETE */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteItem(item.id)}
              >
                <MaterialCommunityIcons name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* BILL SUMMARY */}
        <View style={styles.billWrapper}>
          <View style={styles.line}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>Rs {subtotal}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.billLabel}>Tax (5%)</Text>
            <Text style={styles.billValue}>Rs {tax}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.billLabel}>Previous Balance</Text>
            <Text style={styles.billValue}>Rs {previousBalance}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.billLabel}>Discount (2%)</Text>
            <Text style={styles.billValue}>- Rs {discount}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>Rs {total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* PAYMENT BUTTON */}
      <TouchableOpacity
        style={[styles.payBtn, { opacity: cart.length === 0 ? 0.4 : 1 }]}
        disabled={cart.length === 0}
        onPress={proceedToPayment}
      >
        <MaterialCommunityIcons name="credit-card" size={22} color="#fff" />
        <Text style={styles.payText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

// =========================================================
// STYLES
// =========================================================
const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: {
    marginLeft: 12,
    marginTop: 15,
    fontSize: 17,
    fontWeight: "700",
    color: "#1E57A6",
  },
  clearBtn: {
    position: "absolute",
    top: 55,
    right: 12,
    zIndex: 20,
    flexDirection: "row",
    backgroundColor: "#E91E63",
    padding: 6,
    borderRadius: 10,
    alignItems: "center",
  },
  clearText: { color: "#fff", fontWeight: "700", marginLeft: 5 },

  searchBox: {
    marginHorizontal: 12,
    marginTop: 10,
    height: 50,
    borderWidth: 2,
    borderColor: "#1E57A6",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: { flex: 1, marginLeft: 8 },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  image: { width: 55, height: 55, borderRadius: 10, marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700" },
  price: { color: "#F48424", fontWeight: "600", marginTop: 3 , fontSize:16},

  stockBadge: {
    marginTop: 4,
    backgroundColor: "#1E57A6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  stockText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  empty: { textAlign: "center", marginTop: 10 },

  cartItem: {
    backgroundColor: "#f8f8f8",
    marginHorizontal: 12,
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },

  cartImg: { width: 50, height: 50, borderRadius: 10, marginRight: 10 },
  cartName: { fontWeight: "700", fontSize: 15 },
  cartPrice: { color: "#1E57A6" },

  qtyArea: { flexDirection: "row", alignItems: "center" },
  circleBtn: {
    borderWidth: 2,
    borderColor: "#1E57A6",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: { marginHorizontal: 10, fontSize: 16, fontWeight: "700" },

  deleteBtn: {
    position: "absolute",
    top: -7,
    right: -5,
    backgroundColor: "#E91E63",
    width: 22,
    height: 22,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  billWrapper: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    elevation: 4,
  },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  billLabel: { fontSize: 15 },
  billValue: { fontWeight: "700" },
  totalLine: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 8,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: { color: "#1E57A6", fontSize: 18, fontWeight: "700" },
  totalAmount: { color: "#1E57A6", fontSize: 18, fontWeight: "700" },

  payBtn: {
    position: "absolute",
    bottom: 100,
    left: 12,
    right: 12,
    backgroundColor: "#F48424",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  payText: { color: "#fff", marginLeft: 8, fontWeight: "700", fontSize: 16 },
});
