import { Image, StyleSheet, Text, View } from "react-native";

export default function ViewUser({ data }) {
  if (!data) return null;

  return (
    <View style={styles.container}>
      <Image
        source={
          data.photo
            ? { uri: `http://192.168.1.23:8000/storage/${data.photo}` }
            : require("../assets/images/placeholder.jpg")
        }
        style={styles.profile}
      />
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.phone}>{data.phone}</Text>
      {data.salary ? (
        <Text style={styles.info}>Salary: {data.salary}</Text>
      ) : null}
      {data.shopname ? (
        <Text style={styles.info}>Shop Name: {data.shopname}</Text>
      ) : null}
      <Text style={styles.info}>Address: {data.address}</Text>
      {data.role ? <Text style={styles.info}>Role: {data.role}</Text> : null}
      {data.type ? <Text style={styles.info}>Type: {data.type}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    alignItems: "center",
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E57A6",
  },
  phone: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  info: {
    fontSize: 14,
    marginTop: 6,
    color: "#555",
  },
});
