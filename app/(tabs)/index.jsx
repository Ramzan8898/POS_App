import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import hamburger from "../../assets/images/sidebar.png";
import Cards from "../../components/cards";
import Sidebar from "../../components/sidebar";
export default function Index() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Image
          source={hamburger}
          style={{ width: 50, height: 50, margin: 20 }}
        />
      </TouchableOpacity>
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <View style={styles.grid}>
        <Cards title="Products" icon="planet" count={11} progress={64} />
        <Cards
          title="Total Orders"
          icon="basket-fill"
          count={1250}
          progress={78}
        />
        <Cards
          title="Employees"
          icon="account-group"
          count={48}
          progress={92}
        />
        <Cards
          title="Customers"
          icon="account-multiple-check"
          count={350}
          progress={65}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
