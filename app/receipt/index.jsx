// File: app/receipt.tsx  (ya jahan bhi hai)

import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
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
  const shotRef = useRef(null);

  const cart = JSON.parse(params.cart || "[]");
  const subtotal = Number(params.subtotal || 0);
  const tax = Number(params.tax || 0);
  const discount = Number(params.discount || 0);
  const total = Number(params.total || 0);
  const paid = Number(params.paid || 0);
  const due = Number(params.due || 0);
  const balance = Number(params.customer_balance || 0);

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
      if (c) setCompany(c);
    } catch (e) {
      console.log("COMPANY FETCH ERROR:", e);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  // 1. FULL SCREENSHOT (PNG) - Works even if receipt is very long
  const saveAsImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission", "Gallery access needed to save image");
        return;
      }

      const uri = await shotRef.current.capture();
      const fileName = `invoice_${params.invoice || Date.now()}.png`;
      const dest = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({ from: uri, to: dest });
      await MediaLibrary.saveToLibraryAsync(dest);
      await Sharing.shareAsync(dest);

      Alert.alert("Success", "Invoice saved to gallery & shared!");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to save image");
    }
  };

  // 2. GENERATE PROFESSIONAL PDF (Best for WhatsApp/Share)
  const generatePDF = async () => {
    try {
      const itemsRows = cart
        .map(
          (item) => `
          <tr>
            <td style="padding:8px; border-bottom:1px solid #ddd;">
              ${item.product?.product_name || item.name || "Item"}
            </td>
            <td style="padding:8px; text-align:center; border-bottom:1px solid #ddd;">
              ${item.qty || item.quantity || 1}
            </td>
            <td style="padding:8px; text-align:right; border-bottom:1px solid #ddd; font-weight:600;">
               ${
                 (item.qty || item.quantity || 1) *
                 (item.product?.selling_price || item.price || 0)
               }
            </td>
          </tr>
        `
        )
        .join("");

      const html = `
        <html>
          <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px 20px; background:white; color:#000; }
          .center { text-align:center; }
          .logo { width:110px; height:110px; object-fit:contain; margin-bottom:10px; }
          h1 { color:#1E57A6; margin:10px 0; font-size:24px; }
          h2 { color:#1E57A6; margin:20px 0 10px; }
          table { width:100%; border-collapse:collapse; margin:20px 0; }
          th { background:#1E57A6; color:white; padding:12px; text-align:left; }
          td { padding:10px; }
          .total { font-size:22px; font-weight:bold; color:#1E57A6; }
          .footer { text-align:center; margin-top:40px; color:#666; font-size:14px; }
        </style>
          </head>
          <body>
        <div class="center">
          ${
            company?.logo
              ? `<img src="http://192.168.1.17:8000/storage/${company.logo}" class="logo" />`
              : ""
          }
          <h1>${company?.name || "Your Store"}</h1>
          <p>${company?.address || ""}<br>Phone: ${company?.phone || ""}</p>
        </div>

        <p><strong>Invoice No:</strong> #${params.invoice || "N/A"}</p>
        <p><strong>Customer:</strong> ${params.customer || "Walk-in"}</p>
        <p><strong>Date:</strong> ${
          params.date || new Date().toLocaleDateString()
        }</p>

        <table>
          <thead>
            <tr>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>

        <div style="margin-top:20px;">
          <div style="display:flex; justify-content:space-between; padding:5px 0;">
            <span>Subtotal</span><span> ${subtotal}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:5px 0;">
            <span>Tax</span><span> ${tax}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:5px 0;">
            <span>Discount</span><span>-  ${discount}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:5px 0;">
            <span>Paid</span><span> ${paid}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:5px 0;">
            <span>Due</span><span> ${due}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:5px 0;">
            <span>Balance</span><span> ${params.balance || "Walk-in"}
          </span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:10px 0; margin-top:10px; border-top:3px solid #1E57A6; font-size:20px;">
            <span class="total">TOTAL</span>
            <span class="total">Rs ${total}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for shopping with us!</p>
        </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
      Alert.alert("PDF Ready", "Professional invoice generated!");
    } catch (err) {
      console.log("PDF Error:", err);
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <Header title="Receipt" />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* FULL RECEIPT FOR SCREENSHOT */}
        <ViewShot
          ref={shotRef}
          options={{ format: "png", quality: 1, result: "tmpfile" }}
        >
          <View style={styles.receiptBox}>
            {/* Company Info */}
            {company && (
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                {company.logo && (
                  <Image
                    source={{
                      uri: `http://192.168.1.17:8000/storage/${company.logo}`,
                    }}
                    style={{ width: 90, height: 90, resizeMode: "contain" }}
                  />
                )}
                <Text style={styles.companyName}>{company.name}</Text>
                <Text style={styles.companyInfo}>{company.address}</Text>
                <Text style={styles.companyInfo}>Phone: {company.phone}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.label}>Invoice No</Text>
              <Text style={styles.value}>#{params.invoice}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Customer</Text>
              <Text style={styles.value}>{params.customer}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{params.date}</Text>
            </View>

            {/* Items Table */}
            <View style={styles.tableHead}>
              <Text style={[styles.col1, styles.tableTxt]}>Item</Text>
              <Text style={[styles.col2, styles.tableTxt]}>Qty</Text>
              <Text style={[styles.col3, styles.tableTxt]}>Amount</Text>
            </View>

            {cart.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.col1}>
                  {item.product?.product_name || item.name}
                </Text>
                <Text style={styles.col2}>{item.qty || item.quantity}</Text>
                <Text style={styles.col3}>
                  {(item.qty || item.quantity) *
                    (item.product?.selling_price || item.price)}
                </Text>
              </View>
            ))}

            <View style={styles.line} />

            <View style={styles.row}>
              <Text>Subtotal</Text>
              <Text style={styles.bold}> {subtotal}</Text>
            </View>
            <View style={styles.row}>
              <Text>Tax</Text>
              <Text> {tax}</Text>
            </View>
            <View style={styles.row}>
              <Text>Discount</Text>
              <Text> {discount}</Text>
            </View>
            <View style={styles.row}>
              <Text>Paid</Text>
              <Text>Rs {params.paid}</Text>
            </View>
            <View style={styles.row}>
              <Text>Due</Text>
              <Text>{params.due}</Text>
            </View>

            <View style={styles.row}>
              <Text>Balance</Text>
              <Text>{params.balance}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalTxt}>TOTAL</Text>
              <Text style={styles.totalTxt}>Rs {total}</Text>
            </View>

            <Text style={styles.footer}>Thank you for shopping!</Text>
          </View>
        </ViewShot>

        {/* ACTION BUTTONS */}
        <View style={{ padding: 20 }}>
          {/* <TouchableOpacity style={styles.btnOrange} onPress={saveAsImage}>
            <MaterialCommunityIcons name="image-plus" size={26} color="#fff" />
            <Text style={styles.btnTxt}>Save as Image</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.btnRed} onPress={generatePDF}>
            <Text style={styles.btnTxt}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.btnBlue}
          >
            <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
            <Text style={styles.btnTxt}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  receiptBox: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 25,
    borderRadius: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E57A6",
    textAlign: "center",
  },
  companyInfo: {
    textAlign: "center",
    color: "#555",
    fontSize: 13,
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
    color: "#1E57A6",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: { color: "#666", fontSize: 15 },
  value: { fontWeight: "600", color: "#222" },
  tableHead: {
    flexDirection: "row",
    marginTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: "#1E57A6",
  },
  tableTxt: { fontWeight: "700", color: "#1E57A6" },
  tableRow: { flexDirection: "row", paddingVertical: 8 },
  col1: { flex: 2, fontSize: 15 },
  col2: { flex: 1, textAlign: "center" },
  col3: { flex: 1, textAlign: "right", fontWeight: "700" },
  line: {
    marginVertical: 15,
    borderTopWidth: 2,
    borderColor: "#1E57A6",
    borderStyle: "dashed",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  bold: { fontWeight: "700" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 4,
    borderColor: "#1E57A6",
  },
  totalTxt: { fontSize: 22, fontWeight: "800", color: "#1E57A6" },
  footer: { textAlign: "center", marginTop: 30, color: "#777", fontSize: 15 },

  btnOrange: {
    backgroundColor: "#F48424",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  btnRed: {
    backgroundColor: "#F48424",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  btnBlue: {
    backgroundColor: "#1E57A6",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  btnTxt: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
