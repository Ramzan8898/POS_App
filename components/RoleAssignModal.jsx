import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RoleAssignModal({ user, onUpdateRole }) {
  const [selected, setSelected] = useState(user.role);

  const roles = ["Admin", "Manager", "Cashier", "Salesman", "Employee"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign Role</Text>
      <Text style={styles.userName}>{user.name}</Text>

      {roles.map((role, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.roleItem, selected === role && styles.roleSelected]}
          onPress={() => setSelected(role)}
        >
          <Text
            style={[styles.roleText, selected === role && { color: "#fff" }]}
          >
            {role}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => onUpdateRole(selected)}
      >
        <Text style={styles.saveText}>Save Role</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25 },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E57A6",
    marginBottom: 10,
  },

  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },

  roleItem: {
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#1E57A6",
    borderRadius: 10,
    marginBottom: 10,
  },

  roleSelected: {
    backgroundColor: "#1E57A6",
  },

  roleText: {
    fontSize: 16,
    textAlign: "center",
    color: "#1E57A6",
  },

  saveBtn: {
    backgroundColor: "#F48424",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  saveText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
