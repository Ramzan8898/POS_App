import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserTable({
  data = [],
  showSalary = true,
  showShopName = true,
  showType = false,
  showRole = false, // ⭐ NEW PROP
  onView,
  onEdit,
  onDelete,
}) {
  const BASE_URL = "http://192.168.1.17:8000";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { flex: 0.6 }]}>#</Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>User</Text>

        {showSalary && (
          <Text style={[styles.headerCell, { flex: 1 }]}>Salary</Text>
        )}

        {showShopName && (
          <Text style={[styles.headerCell, { flex: 1 }]}>Shop</Text>
        )}

        {showType && <Text style={[styles.headerCell, { flex: 1 }]}>Type</Text>}

        {showRole && <Text style={[styles.headerCell, { flex: 1 }]}>Role</Text>}

        <Text style={[styles.headerCell, { flex: 1 }]}>Actions</Text>
      </View>

      {/* ROWS */}
      {data.map((user, index) => (
        <View key={index} style={styles.row}>
          {/* SERIAL */}
          <Text style={[styles.cell, { flex: 0.6 }]}>{index + 1}</Text>

          {/* USER DETAILS */}
          <View style={[styles.userColumn, { flex: 2 }]}>
            <Image
              source={
                user.photo
                  ? { uri: `http://192.168.1.17:8000/storage/${user.photo}` }
                  : require("../assets/images/placeholder.jpg")
              }
              style={styles.profile}
            />
            <View>
              <Text style={styles.userName} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
            </View>
          </View>

          {/* SALARY */}
          {showSalary && (
            <Text style={[styles.cell, { flex: 1 }]}>
              {user.salary ? +user.salary : "-"}
            </Text>
          )}

          {/* SHOP NAME */}
          {showShopName && (
            <Text style={[styles.cell, { flex: 1 }]}>
              {user.shopName || "-"}
            </Text>
          )}

          {/* SUPPLIER TYPE */}
          {showType && (
            <Text style={[styles.cell, { flex: 1 }]}>{user.type || "-"}</Text>
          )}

          {/* ROLE BADGE */}
          {showRole && (
            <View
              style={[styles.roleBadge, { flex: 0.7, alignSelf: "center" }]}
            >
              <Text style={styles.roleText}>{user.role || "N/A"}</Text>
            </View>
          )}

          {/* ACTION BUTTONS */}
          <View style={[styles.actions, { flex: 1 }]}>
            <TouchableOpacity onPress={() => onView?.(user)}>
              <MaterialIcons name="visibility" size={18} color="#F48424" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onEdit?.(user)}>
              <MaterialIcons name="edit" size={18} color="#F48424" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onDelete?.(user)}>
              <MaterialIcons name="delete" size={18} color="#F48424" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#19529C",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerCell: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EAF0",
    alignItems: "center",
    minHeight: 70,
  },
  cell: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  userColumn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profile: {
    width: 45,
    height: 45,
    borderRadius: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E57A6",
  },
  userPhone: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  roleBadge: {
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "#1E57A6",
    alignItems: "center",
  },
  roleText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 3,
  },
});
