import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/header";

const PRODUCT_URL = "http://192.168.1.17:8000/api/products";
const CUSTOMER_URL = "http://192.168.1.17:8000/api/customers";

export default function Index() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [previousBalance, setPreviousBalance] = useState(0);
  const [taxPercent, setTaxPercent] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  // ============================
  // FETCH PRODUCTS
  // ============================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(PRODUCT_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setProducts(Array.isArray(json) ? json : json.Products ?? []);
    } catch (e) {
      console.log("Product Fetch Error:", e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // FETCH CUSTOMERS
  // ============================
  const fetchCustomers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(CUSTOMER_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      console.log("CUSTOMER API RESPONSE:", json); // 🟢 DEBUG LINE

      const list =
        json.customers ||
        json.Customers ||
        json.data ||
        (Array.isArray(json) ? json : []);

      setCustomers(list);
    } catch (e) {
      console.log("Customer Fetch Error:", e);
      setCustomers([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  // FILTER PRODUCTS
  const filtered = products.filter((item) =>
    item.product_name.toLowerCase().includes(search.toLowerCase())
  );

  // CART FUNCTIONS
  const addToCart = (product) => {
    if (product.product_store <= 0) return;

    const exists = cart.find((p) => p.id === product.id);
    if (exists) increaseQty(product.id);
    else {
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
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
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
        .map((p) => (p.id === id && p.qty > 1 ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
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
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearPOS = () => {
    setCart([]);
    setSelectedCustomer(null);
    setPaidAmount("");
    setPreviousBalance(0);
    setTaxPercent("");
    setDiscountPercent("");
    fetchProducts();
  };

  // ============================
  // BILL CALCULATIONS
  // ============================
  // ============================
  // BILL CALCULATIONS (FIXED)
  // ============================

  const subtotal = cart.reduce(
    (sum, item) => sum + item.selling_price * item.qty,
    0
  );
  const tax = Number(taxPercent) || 0;
  const discount = Number(discountPercent) || 0;

  const billTotal = subtotal + tax - discount; // ❌ PREVIOUS BALANCE NOT INCLUDED HERE

  const paid = Number(paidAmount) || 0;

  // ✔️ Correct due calculation
  const due = billTotal - paid + previousBalance;

  // SELECT CUSTOMER
  const selectCustomer = (cust) => {
    setSelectedCustomer(cust);
    setPreviousBalance(Number(cust.balance || 0));
    setCustomerModal(false);
  };

  // ============================
  // PROCEED TO PAYMENT
  // ============================
  const proceedToPayment = async () => {
    if (!selectedCustomer) return alert("Select customer first!");
    if (cart.length === 0) return alert("Cart is empty!");

    try {
      const token = await AsyncStorage.getItem("token");

      const payload = {
        customer_id: selectedCustomer.id,
        payment_status: paid >= billTotal ? "complete" : "pending",
        subtotal,
        tax,
        discount,
        previous_balance: previousBalance,
        total: billTotal,
        total_products: cart.reduce((s, p) => s + p.qty, 0),
        cart_items: cart.map((item) => ({
          id: item.id,
          qty: item.qty,
          price: item.selling_price,
          total: item.qty * item.selling_price,
        })),
        pay: paid,
        due: due,
      };

      const res = await fetch("http://192.168.1.17:8000/api/orders/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      console.log(json);

      if (json.success) {
        alert("Order Submitted Successfully!");
        clearPOS();

        router.push({
          pathname: "/pos/receipt",
          params: {
            order_id: json.order_id,
            subtotal,
            tax,
            discount,
            previousBalance,
            paid,
            due,
            total: billTotal,
            cart: JSON.stringify(cart),
          },
        });

        setTimeout(() => clearPOS(), 500);
      }
    } catch (e) {
      console.log("Order Store Error:", e);
      alert("Order failed");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="POS" />

      {/* RESET BUTTON */}
      <TouchableOpacity style={styles.resetBtn} onPress={clearPOS}>
        <MaterialCommunityIcons name="delete" size={20} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 5, fontWeight: "700" }}>
          Reset POS
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        {/* CUSTOMER SELECT */}
        <TouchableOpacity
          style={styles.customerBox}
          onPress={() => setCustomerModal(true)}
        >
          <MaterialCommunityIcons
            name="account"
            size={24}
            color={selectedCustomer ? "#27A55B" : "#1E57A6"}
          />
          <Text style={styles.customerText}>
            {selectedCustomer ? selectedCustomer.name : "Select Customer"}
          </Text>
        </TouchableOpacity>

        {/* MODAL */}
        <Modal visible={customerModal} animationType="slide">
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Customer</Text>

            <FlatList
              data={customers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.customerRow}
                  onPress={() => selectCustomer(item)}
                >
                  <Text style={styles.customerName}>{item.name}</Text>
                  <Text style={styles.customerBalance}>
                    Udhaar: Rs {item.balance}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => setCustomerModal(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* SEARCH */}
        <View style={styles.rowHeader}>
          <Text style={styles.ProductTitle}>Products</Text>

          <View style={styles.searchSmallBox}>
            <MaterialCommunityIcons name="magnify" size={20} color="#1E57A6" />
            <TextInput
              placeholder="Search..."
              style={{ flex: 1, marginLeft: 6 }}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* PRODUCT LIST */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filtered}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                disabled={item.product_store <= 0}
                style={[
                  styles.productCard,
                  item.product_store <= 0 && { opacity: 0.3 },
                ]}
                onPress={() => addToCart(item)}
              >
                <Image
                  source={
                    item.product_image
                      ? { uri: item.product_image }
                      : require("../../assets/images/product.webp")
                  }
                  style={styles.productImg}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{item.product_name}</Text>
                  <Text style={styles.productPrice}>
                    Rs {item.selling_price}
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="plus-circle"
                  size={26}
                  color="#1E57A6"
                />
              </TouchableOpacity>
            )}
          />
        )}

        {/* CART TITLE */}
        {cart.length > 0 && (
          <Text style={styles.sectionTitle}>Selected Items</Text>
        )}

        {/* CART */}
        <FlatList
          data={cart}
          scrollEnabled={false}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.empty}>No product selected</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.cartCard}>
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

              <View style={styles.qtyArea}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => decreaseQty(item.id)}
                >
                  <MaterialCommunityIcons name="minus" size={18} />
                </TouchableOpacity>

                <Text style={styles.qty}>{item.qty}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => increaseQty(item.id)}
                >
                  <MaterialCommunityIcons name="plus" size={18} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.delBtn}
                onPress={() => deleteItem(item.id)}
              >
                <MaterialCommunityIcons name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* BILL FORM */}
        <View style={styles.billInputBox}>
          <TextInput
            keyboardType="numeric"
            placeholder="Tax"
            style={styles.input}
            value={String(taxPercent)}
            onChangeText={setTaxPercent}
          />

          <TextInput
            keyboardType="numeric"
            placeholder="Discount"
            style={styles.input}
            value={String(discountPercent)}
            onChangeText={setDiscountPercent}
          />

          <TextInput
            keyboardType="numeric"
            placeholder="Previous Balance"
            style={styles.input}
            value={String(previousBalance)}
            editable={false}
          />

          <TextInput
            keyboardType="numeric"
            placeholder="Paid Amount"
            style={[styles.input, { borderColor: "#27A55B" }]}
            value={String(paidAmount)}
            onChangeText={setPaidAmount}
          />
        </View>

        {/* BILL SUMMARY */}
        <View style={styles.billBox}>
          <Row label="Subtotal" value={subtotal} />
          <Row label="Tax" value={tax} />
          <Row label="Discount" value={-discount} />
          <Row label="Previous Balance" value={previousBalance} />
          <Row label="Paid Now" value={paid} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Due (Udhaar)</Text>
            <Text style={styles.totalAmount}>Rs {due}</Text>
          </View>
        </View>
      </ScrollView>

      {/* PAYMENT BUTTON */}
      {cart.length > 0 && selectedCustomer && (
        <TouchableOpacity style={styles.payBtn} onPress={proceedToPayment}>
          <MaterialCommunityIcons name="credit-card" size={22} color="#fff" />
          <Text style={styles.payText}>Proceed to Payment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ROW COMPONENT
const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={{ fontSize: 15 }}>{label}</Text>
    <Text style={{ fontWeight: "700" }}>
      Rs {parseFloat(value || 0).toFixed(0)}
    </Text>
  </View>
);

// STYLES
const styles = StyleSheet.create({
  resetBtn: {
    position: "absolute",
    top: 55,
    right: 12,
    backgroundColor: "#E91E63",
    zIndex: 99,
    padding: 6,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  customerBox: {
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: "#1E57A6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  customerText: { marginLeft: 10, fontWeight: "700", fontSize: 16 },
  modalContent: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  customerRow: {
    padding: 14,
    backgroundColor: "#f7f7f7",
    marginVertical: 4,
    borderRadius: 10,
  },
  customerName: { fontWeight: "700", fontSize: 16 },
  customerBalance: { color: "#777" },
  closeModal: {
    marginTop: 20,
    backgroundColor: "#1E57A6",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  searchSmallBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1E57A6",
    borderRadius: 10,
    paddingHorizontal: 10,
    width: "55%",
    height: 45,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F48424",
    textAlign: "center",
    marginVertical: 10,
  },
  ProductTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F48424",
    textAlign: "center",
    marginVertical: 10,
  },
  productCard: {
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  productImg: { width: 50, height: 50, marginRight: 10, borderRadius: 8 },
  productName: { fontWeight: "700" },
  productPrice: { color: "#F48424", fontWeight: "700", marginTop: 4 },
  empty: { textAlign: "center", marginTop: 8, fontSize: 16 },
  cartCard: {
    margin: 12,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  cartImg: { width: 45, height: 45, marginRight: 10, borderRadius: 8 },
  cartName: { fontWeight: "700" },
  cartPrice: { color: "#1E57A6", marginTop: 3 },
  qtyArea: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    borderWidth: 2,
    borderColor: "#1E57A6",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: { marginHorizontal: 8, fontWeight: "700" },
  delBtn: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#E91E63",
    width: 22,
    height: 22,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  billInputBox: {
    margin: 12,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: "#1E57A6",
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
  },
  billBox: {
    margin: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  totalRow: {
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  payText: { color: "#fff", marginLeft: 8, fontWeight: "700", fontSize: 16 },
});
