import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";

import {
  Image,
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

  const saveAndShare = async () => {
    try {
      const uri = await shotRef.current.capture();
      const fileUri = FileSystem.documentDirectory + "receipt.png";
      await FileSystem.copyAsync({ from: uri, to: fileUri });

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status === "granted") {
        await MediaLibrary.saveToLibraryAsync(fileUri);
      }

      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.log("RECEIPT ERROR => ", err);
    }
  };

  const [company, setCompany] = useState(null);

  const fetchCompany = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://192.168.1.17:8000/api/company", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      const c =
        json.company ||
        json.Company ||
        json.data ||
        (Array.isArray(json) ? json[0] : null);
      console.log("Image cmpany", c);
      if (c) setCompany(c);
    } catch (e) {
      console.log("COMPANY FETCH ERROR:", e);
    }
  };

  useEffect(() => {
    fetchCompany(); // 👈 IMPORTANT
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Receipt" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          <ViewShot ref={shotRef} options={{ format: "png", quality: 1 }}>
            <View style={styles.receiptBox}>
              {/* HEADER */}
              {company && (
                <View style={{ alignItems: "center", marginBottom: 15 }}>
                  {company.logo && (
                    <Image
                      source={{
                        uri: `http://192.168.1.17:8000/storage/${company.logo}`,
                      }}
                      style={{ width: 80, height: 80, resizeMode: "contain" }}
                    />
                  )}

                  <Text style={styles.companyName}>{company.name}</Text>
                  <Text style={styles.companyInfo}>{company.address}</Text>
                  <Text style={styles.companyInfo}>Phone: {company.phone}</Text>
                </View>
              )}

              <Text style={styles.invoiceTitle}>INVOICE</Text>

              {/* DETAILS */}
              <View style={styles.infoRow}>
                <Text style={styles.label}>Invoice No</Text>
                <Text style={styles.value}>#{params.invoice}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Customer</Text>
                <Text style={styles.value}>{params.customer}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.value}>{params.status}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{params.date}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Balance</Text>
                <Text style={styles.value}>{params.balance}</Text>
              </View>

              {/* TABLE HEADER */}
              <View style={styles.tableHead}>
                <Text style={[styles.col1, styles.tableTxt]}>Item</Text>
                <Text style={[styles.col2, styles.tableTxt]}>Qty</Text>
                <Text style={[styles.col3, styles.tableTxt]}>Amount</Text>
              </View>

              {cart.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.col1}>
                    {item.product.product_name ?? item.name}
                  </Text>
                  <Text style={styles.col2}>{item.qty ?? item.quantity}</Text>
                  <Text style={styles.col3}>
                    {(item.qty ?? item.quantity) *
                      (item.product.selling_price ?? item.price)}
                  </Text>
                </View>
              ))}

              <View style={styles.line} />

              {/* SUMMARY */}
              <View style={styles.row}>
                <Text>Subtotal</Text>
                <Text style={styles.bold}>Rs {subtotal}</Text>
              </View>

              <View style={styles.row}>
                <Text>Tax</Text>
                <Text>Rs {tax}</Text>
              </View>

              <View style={styles.row}>
                <Text>Discount</Text>
                <Text>- Rs {discount}</Text>
              </View>

              <View style={styles.row}>
                <Text> Paid</Text>
                <Text>Rs {params.paid}</Text>
              </View>

              <View style={styles.row}>
                <Text>Due</Text>
                <Text>Rs {params.due}</Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalTxt}>TOTAL </Text>
                <Text style={styles.totalTxt}>Rs {params.total}</Text>
              </View>

              <Text style={styles.footer}>Thank you for shopping!</Text>
            </View>
          </ViewShot>

          <TouchableOpacity style={styles.btn} onPress={saveAndShare}>
            <MaterialCommunityIcons name="download" size={22} color="#fff" />
            <Text style={styles.btnTxt}>Save & Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.btn, { backgroundColor: "#1E57A6" }]}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
            <Text style={styles.btnTxt}>Back</Text>
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
  companyName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E57A6",
    marginTop: 6,
  },

  companyInfo: {
    fontSize: 14,
    color: "#444",
    marginTop: 2,
  },

  companyName: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: "#1E57A6",
  },
  companyInfo: { textAlign: "center", color: "#444", fontSize: 13 },

  invoiceTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: { color: "#555" },
  value: { fontWeight: "600", color: "#222" },

  tableHead: {
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    paddingBottom: 6,
    borderStyle: "dashed",
    borderColor: "#1E57A6",
  },
  tableTxt: { fontWeight: "700", color: "#1E57A6" },
  tableRow: { flexDirection: "row", marginVertical: 6 },

  col1: { flex: 2, fontSize: 15 },
  col2: { flex: 1, textAlign: "center" },
  col3: { flex: 1, textAlign: "right", fontWeight: "700" },

  line: {
    marginVertical: 10,
    borderTopWidth: 1,
    borderColor: "#1E57A6",
    borderStyle: "dashed",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  bold: { fontWeight: "700" },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#1E57A6",
  },
  totalTxt: { fontSize: 18, fontWeight: "800", color: "#1E57A6" },

  footer: { textAlign: "center", marginTop: 15, color: "#666" },

  btn: {
    backgroundColor: "#F48424",
    padding: 12,
    marginTop: 20,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  btnTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
