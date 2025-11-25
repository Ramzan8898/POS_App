import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "../../components/header";
const productImage = require("../../assets/images/product.webp");
export default function Index() {
    // -------- SAMPLE DATA -------- //
    const [products, setProducts] = useState([
        {
            id: "1",
            name: "Americano",
            price: 12000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 2,
        },
        {
            id: "2",
            name: "Cappuccino",
            price: 14500,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
        {
            id: "3",
            name: "Latte",
            price: 18000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
        {
            id: "4",
            name: "Latte",
            price: 18000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
        {
            id: "5",
            name: "Latte",
            price: 18000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
        {
            id: "6",
            name: "Latte",
            price: 18000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
        {
            id: "7",
            name: "Latte",
            price: 18000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
        {
            id: "8",
            name: "Latte",
            price: 18000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
        {
            id: "9",
            name: "Latte",
            price: 18000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
        {
            id: "10",
            name: "Latte",
            price: 18000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
        {
            id: "11",
            name: "Latte",
            price: 18000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
        {
            id: "12",
            name: "Latte",
            price: 18000,
            image: Image.resolveAssetSource(productImage).uri,
            qty: 1,
        },
    ]);

    // -------- ADD QTY -------- //
    const increaseQty = (id) => {
        setProducts((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, qty: item.qty + 1 } : item
            )
        );
    };

    // -------- REMOVE QTY -------- //
    const decreaseQty = (id) => {
        setProducts((prev) =>
            prev.map((item) =>
                item.id === id && item.qty > 1
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>

            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>Rs {item.price}</Text>
            </View>

            <View style={styles.qtyContainer}>
                <TouchableOpacity
                    style={styles.circleBtn}
                    onPress={() => decreaseQty(item.id)}
                >
                    <MaterialCommunityIcons name="minus" size={18} color="#1E57A6" />
                </TouchableOpacity>

                <Text style={styles.qty}>{item.qty}</Text>

                <TouchableOpacity
                    style={styles.circleBtn}
                    onPress={() => increaseQty(item.id)}
                >
                    <MaterialCommunityIcons name="plus" size={18} color="#1E57A6" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
            <Header title="POS" />

            <View style={styles.list} >
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 12 }}
                />
            </View>
        </View>
    );
}

// ---------------- STYLES ---------------- //

const styles = StyleSheet.create({
    list: {
        height: '45%',
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    image: {
        width: 55,
        height: 55,
        borderRadius: 10,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    price: {
        fontSize: 14,
        color: "#1E57A6",
        marginTop: 2,
    },
    qtyContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    circleBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#1E57A6",
        justifyContent: "center",
        alignItems: "center",
    },
    qty: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
});
