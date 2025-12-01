import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

const productImage = require("../../assets/images/product.webp");

export default function Index() {
  const router = useRouter();

  const ALL_PRODUCTS = [
    { id: "1", name: "Americano", price: 12000, image: productImage },
    { id: "2", name: "Cappuccino", price: 14500, image: productImage },
    { id: "3", name: "Latte", price: 18000, image: productImage },
    { id: "4", name: "Mocha", price: 20000, image: productImage },
    { id: "5", name: "Espresso", price: 10000, image: productImage },
  ];

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const filtered = ALL_PRODUCTS.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // ADD TO CART
  const addToCart = (product) => {
    const exists = cart.find((p) => p.id === product.id);

    if (exists) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...product, qty: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
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
  };

  const deleteItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  // BILLING
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.05;
  const previousBalance = 2000;
  const discount = subtotal * 0.02;
  const total = subtotal + tax + previousBalance - discount;

  const proceedToPayment = () => {
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
  };

  const clearPOS = () => {
    setCart([]);
    setSearch("");
  };

  return (
    <View style={styles.container}>
      <Header title="POS" />

      {/* CLEAR POS BUTTON */}
      <TouchableOpacity style={styles.clearBtn} onPress={clearPOS}>
        <MaterialCommunityIcons name="delete" size={20} color="#fff" />
        <Text style={styles.clearText}>Clear POS</Text>
      </TouchableOpacity>

      {/* SCROLLABLE BODY */}
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={24} color="#1E57A6" />
          <TextInput
            placeholder="Search product..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* PRODUCT LIST */}
        <Text style={styles.sectionTitle}>Products</Text>
        <FlatList
          data={filtered}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => addToCart(item)}
            >
              <Image source={item.image} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>Rs {item.price}</Text>
              </View>
              <MaterialCommunityIcons
                name="plus-circle"
                size={26}
                color="#1E57A6"
              />
            </TouchableOpacity>
          )}
        />

        {/* CART SECTION */}
        <Text style={styles.sectionTitle}>Selected Items</Text>

        <FlatList
          data={cart}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>No product selected</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={item.image} style={styles.cartImg} />

              <View style={{ flex: 1 }}>
                <Text style={styles.cartName}>{item.name}</Text>
                <Text style={styles.cartPrice}>Rs {item.price}</Text>
              </View>

              {/* QTY CONTROLS */}
              <View style={styles.qtyArea}>
                <TouchableOpacity
                  style={styles.circleBtn}
                  onPress={() => decreaseQty(item.id)}
                >
                  <MaterialCommunityIcons
                    name="minus"
                    size={18}
                    color="#1E57A6"
                  />
                </TouchableOpacity>

                <Text style={styles.qty}>{item.qty}</Text>

                <TouchableOpacity
                  style={styles.circleBtn}
                  onPress={() => increaseQty(item.id)}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={18}
                    color="#1E57A6"
                  />
                </TouchableOpacity>
              </View>

              {/* DELETE BUTTON (TOP RIGHT BADGE) */}
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

      {/* FIXED BUTTON */}
      <TouchableOpacity
        style={styles.payBtn}
        onPress={proceedToPayment}
        disabled={cart.length === 0}
      >
        <MaterialCommunityIcons name="credit-card" size={22} color="#fff" />
        <Text style={styles.payText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  sectionTitle: {
    marginLeft: 12,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "700",
    color: "#1E57A6",
    fontSize: 17,
  },

  /* CLEAR POS BUTTON (top-right) */
  clearBtn: {
    position: "absolute",
    top: 55,
    right: 15,
    zIndex: 50,
    backgroundColor: "#E91E63",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clearText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  searchBox: {
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: "#1E57A6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: "#333" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    marginHorizontal: 12,
  },

  image: { width: 55, height: 55, borderRadius: 10, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#333" },
  price: { fontSize: 14, color: "#1E57A6", marginTop: 2 },

  cartItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    position: "relative",
  },
  cartImg: { width: 45, height: 45, borderRadius: 8, marginRight: 10 },
  cartName: { fontSize: 15, fontWeight: "600" },
  cartPrice: { fontSize: 13, color: "#1E57A6" },

  qtyArea: { flexDirection: "row", alignItems: "center" },
  circleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#1E57A6",
    justifyContent: "center",
    alignItems: "center",
  },
  qty: { marginHorizontal: 10, fontSize: 15, fontWeight: "600" },

  billWrapper: {
    backgroundColor: "#fff",
    marginTop: 10,
    marginHorizontal: 12,
    padding: 15,
    borderRadius: 12,
    elevation: 4,
    marginBottom: 15,
  },

  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  billLabel: { fontSize: 15, color: "#444" },
  billValue: { fontSize: 15, fontWeight: "600", color: "#000" },

  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },
  totalLabel: { fontSize: 18, fontWeight: "700", color: "#1E57A6" },
  totalAmount: { fontSize: 18, fontWeight: "700", color: "#1E57A6" },

  payBtn: {
    position: "absolute",
    bottom: 100,
    left: 12,
    right: 12,
    backgroundColor: "#F48424",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  payText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  deleteBtn: {
    position: "absolute",
    top: 0,
    right: -5,
    backgroundColor: "#E91E63",
    width: 20,
    height: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
});
