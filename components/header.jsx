import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import hamburger from "../assets/images/sidebar.png";
import Sidebar from "../components/sidebar";

export default function Header({ title = "Dashboard" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setOpen(true)} style={styles.leftIcon}>
          <Image source={hamburger} style={styles.icon} />
        </TouchableOpacity>

        <View style={styles.centerArea}>
          <Text style={styles.pageTitle}>{title}</Text>
        </View>
      </View>

      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 50,
    paddingVertical: 15,
    marginBottom: 25,
    borderBottomWidth:2,
    borderColor:"#1E57A6",

  },

  leftIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  icon: {
    width: 40,
    height: 40,
  },

  centerArea: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E57A6",
  },
});
