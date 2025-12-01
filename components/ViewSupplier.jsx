import { Image, StyleSheet, Text, View } from "react-native";

export default function ViewSupplier({ data }) {
  if (!data) return null;

  return (
    <View style={styles.container}>
      <Image
        source={
          data.photo
            ? { uri: data.photo }
            : require("../assets/images/placeholder.jpg")
        }
        style={styles.avatar}
      />

      <Text style={styles.title}>{data.name}</Text>
      <Text style={styles.item}>📞 {data.phone}</Text>
      <Text style={styles.item}>🏪 {data.shopname}</Text>
      <Text style={styles.item}>📍 {data.address}</Text>
      <Text style={styles.item}>🔖 {data.type || "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25, alignItems: "center" },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E57A6",
    marginBottom: 10,
  },
  item: { fontSize: 16, marginTop: 4 },
});
