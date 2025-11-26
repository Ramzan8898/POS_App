import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/header";

const BASE_URL = "http://192.168.1.23:8000";

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const truncateName = (name) => {
    return name.length > 12 ? name.substring(0, 12) + ".." : name;
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {/* Product Column */}
      <View style={styles.productCol}>
        <Image
          source={
            item.product_image
              ? { uri: `${BASE_URL}/storage/${item.product_image}` }
              : require("../../assets/images/product.webp")
          }
          style={styles.img}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.product_name}</Text>
          <Text style={styles.category}>Rs {item.selling_price}</Text>
        </View>
      </View>

      {/* Stock */}
      <Text style={styles.stock}>{item.product_store || item.stock || 0}</Text>

      {/* Price */}

      <TouchableOpacity
        style={styles.eye}
        onPress={() => router.push(`/products/detail?id=${item.id}`)}
      >
        <MaterialIcons name="visibility" size={22} color="#F48424" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E57A6" />
        <Text style={{ marginTop: 10 }}>Loading Products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Products" />

      {/* Header */}
      <View style={styles.tableHeader}>
        <Text
          style={[styles.th, { flex: 2.2, textAlign: "left", paddingLeft: 55 }]}
        >
          Product
        </Text>
        <Text style={[styles.th, { flex: 1 }]}>Stock</Text>
        <Text style={[styles.th, { flex: 0.8 }]}>Action</Text>
      </View>

      {/* List */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1E57A6",
    paddingVertical: 16,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 10,
    elevation: 2,
  },
  th: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14.5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  productCol: {
    flex: 2.2,
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    width: 170,
  },
  category: {
    fontSize: 11.5,
    color: "#777",
    marginTop: 2,
  },

  stock: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  price: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "#F48424",
    textAlign: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eye: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "#F48424",
    textAlign: "right",
    alignItems: "center",
  },
});
