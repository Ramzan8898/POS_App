import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy"; // ✅ FIXED
import * as MediaLibrary from "expo-media-library"; // ✅ For saving to gallery
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import Header from "../../components/header";

export default function Receipt() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const cart = JSON.parse(params.cart);

  const subtotal = Number(params.subtotal);
  const tax = Number(params.tax);
  const discount = Number(params.discount);
  const previousBalance = Number(params.previousBalance);
  const total = Number(params.total);

  const shotRef = useRef();

  // ---------------- SAVE & SHARE IMAGE ---------------- //
  const saveAndShare = async () => {
    try {
      const uri = await shotRef.current.capture();

      const fileUri = FileSystem.documentDirectory + "receipt.png";

      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      // Save to gallery
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status === "granted") {
        await MediaLibrary.saveToLibraryAsync(fileUri);
      }

      // Share
      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.log("RECEIPT ERROR => ", err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Receipt" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          <ViewShot ref={shotRef} options={{ format: "png", quality: 1 }}>
            <View style={styles.receiptBox}>
              <Text style={styles.header}>Customer Receipt</Text>

              {cart.map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.qty}>{item.qty}x</Text>
                  <Text style={styles.price}>Rs {item.price * item.qty}</Text>
                </View>
              ))}

              <View style={styles.line} />

              <View style={styles.summary}>
                <Text>Subtotal</Text>
                <Text>Rs {subtotal}</Text>
              </View>
              <View style={styles.summary}>
                <Text>Tax</Text>
                <Text>Rs {tax}</Text>
              </View>
              <View style={styles.summary}>
                <Text>Discount</Text>
                <Text>- Rs {discount}</Text>
              </View>
              <View style={styles.summary}>
                <Text>Previous Balance</Text>
                <Text>Rs {previousBalance}</Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Final Total</Text>
                <Text style={styles.totalText}>Rs {total}</Text>
              </View>

              <Text style={styles.thanks}>Thanks for shopping!</Text>
            </View>
          </ViewShot>

          {/* ---------------- BUTTONS ---------------- */}
          <TouchableOpacity style={styles.btn} onPress={saveAndShare}>
            <MaterialCommunityIcons name="download" size={22} color="#fff" />
            <Text style={styles.btnText}>Save & Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#1E57A6" }]}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
            <Text style={styles.btnText}>Back to POS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  receiptBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  header: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1E57A6",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  name: { fontSize: 16, flex: 1 },
  qty: { width: 40, textAlign: "center" },
  price: { width: 90, textAlign: "right" },
  line: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 12,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  totalText: { fontSize: 18, fontWeight: "700", color: "#1E57A6" },
  thanks: { textAlign: "center", marginTop: 15, fontWeight: "600" },

  btn: {
    backgroundColor: "#F48424",
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
