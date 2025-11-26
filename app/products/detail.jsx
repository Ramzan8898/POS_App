import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/header";

const BASE_URL = "http://192.168.1.23:8000";

export default function ProductDetail() {
  const { id } = useLocalSearchParams(); //
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProductDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (data.product) setProduct(data.product);
    } catch (err) {
      console.log("Detail Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E57A6" />
        <Text>Loading Product...</Text>
      </View>
    );

  if (!product)
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: "red" }}>Product Not Found</Text>
      </View>
    );

  return (
    <View style={styles.screen}>
      <Header title="Product Detail" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* IMAGE */}
        <View style={styles.imgView}>
          <Image
            source={
              product.product_image
                ? { uri: `${BASE_URL}/storage/${product.product_image}` }
                : require("../../assets/images/product.webp")
            }
            style={styles.img}
          />
        </View>

        {/* NAME */}
        <Text style={styles.title}>{product.product_name}</Text>

        {/* DETAILS */}
        <View style={styles.box}>
          <DetailRow label="Product Code" value={product.product_code} />
          <DetailRow label="Category" value={product.category?.name} />
          <DetailRow label="Supplier" value={product.supplier?.shopname} />
          <DetailRow label="Stock" value={product.product_store} />
          <DetailRow
            label="Buying Price"
            value={`Rs ${product.buying_price}`}
          />
          <DetailRow
            label="Selling Price"
            value={`Rs ${product.selling_price}`}
          />
        </View>

        {/* BACK BUTTON */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? "N/A"}</Text>
    </View>
  );
}

/* ------------------- STYLES ------------------- */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20, paddingBottom: 100,flex:1 },

  img: {
    width: "80%",
    height: 280,
    borderRadius: 12,
    marginBottom: 20,
  },

  imgView: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    justifyContent:'center',
    alignItems:'center'
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E57A6",
    textAlign: "center",
    marginTop:10
  },

  box: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    marginBottom: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  label: { fontSize: 15, fontWeight: "600", color: "#555" },
  value: { fontSize: 15, fontWeight: "700", color: "#000" },

  backBtn: {
    backgroundColor: "#1E57A6",
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: { color: "#fff", marginLeft: 6, fontSize: 15, fontWeight: "600" },
});
