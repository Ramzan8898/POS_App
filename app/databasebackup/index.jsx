import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "../../components/header";

export default function Index() {
  const [backupList, setBackupList] = useState([
    { id: 1, date: "2025-01-20", size: "1.2 MB" },
    { id: 2, date: "2025-01-19", size: "1.1 MB" },
    { id: 3, date: "2025-01-18", size: "1.1 MB" },
  ]);

  const createBackup = () => {
    const today = new Date().toISOString().split("T")[0];
    const newBackup = {
      id: Date.now(),
      date: today,
      size: "1.2 MB",
    };
    setBackupList([newBackup, ...backupList]);
    alert("Backup created successfully!");
  };

  const downloadBackup = (item) => {
    alert(`Downloading backup: ${item.date}`);
  };

  const deleteBackup = (item) => {
    setBackupList((prev) => prev.filter((b) => b.id !== item.id));
    alert("Backup deleted!");
  };

  return (
    <View style={styles.screen}>
      <Header title="Database Backup" />

      {/* TOP CARD - Auto Backup Info */}
      <View style={styles.card}>
        <MaterialIcons name="backup" size={40} color="#19529C" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.cardTitle}>Automatic Daily Backup</Text>
          <Text style={styles.cardDesc}>
            Your data is safe & auto-backed up every night.
          </Text>
        </View>
      </View>

      {/* CREATE BACKUP */}
      <TouchableOpacity style={styles.backupBtn} onPress={createBackup}>
        <MaterialIcons name="cloud-upload" size={26} color="#fff" />
        <Text style={styles.backupBtnText}>Create Manual Backup</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Backup History</Text>

      {/* BACKUP LIST */}
      <FlatList
        data={backupList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.size}>Size: {item.size}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => downloadBackup(item)}>
                <MaterialIcons name="download" size={22} color="#F48424" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteBackup(item)}>
                <MaterialIcons name="delete" size={22} color="#F48424" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  card: {
    backgroundColor: "#E6F0FA",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    margin: 15,
    borderRadius: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E57A6",
  },

  cardDesc: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },

  backupBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F48424",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 10,
    elevation: 4,
  },

  backupBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 15,
    marginTop: 10,
    color: "#333",
  },

  row: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },

  rowInfo: { flex: 1 },

  date: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E57A6",
  },

  size: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    gap: 15,
  },
});
