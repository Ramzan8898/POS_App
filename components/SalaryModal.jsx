import { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SalaryModal({ visible, data, onClose, onSave }) {
  if (!data) return null;

  const [paid, setPaid] = useState(String(data.paid));
  const [deduction, setDeduction] = useState(String(data.deduction));
  const [bonus, setBonus] = useState(String(data.bonus));
  const [remarks, setRemarks] = useState(data.remarks);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.heading}>Salary Payment</Text>

          <Text style={styles.label}>Paid Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={paid}
            onChangeText={setPaid}
          />

          <Text style={styles.label}>Cutting / Deduction</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={deduction}
            onChangeText={setDeduction}
          />

          <Text style={styles.label}>Bonus</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={bonus}
            onChangeText={setBonus}
          />

          <Text style={styles.label}>Remarks</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={remarks}
            onChangeText={setRemarks}
          />

          {/* BUTTONS */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() =>
                onSave({
                  ...data,
                  paid: Number(paid),
                  deduction: Number(deduction),
                  bonus: Number(bonus),
                  remarks,
                })
              }
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E57A6",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    borderWidth: 2,
    borderColor: "#F48424",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  cancelText: { color: "#F48424", fontSize: 16, fontWeight: "bold" },
  saveBtn: {
    backgroundColor: "#1E57A6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  saveText: { color: "#fff", fontSize: 16 },
});
