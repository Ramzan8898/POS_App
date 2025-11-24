import { StyleSheet, View } from "react-native";
import Cards from "../../components/cards";
import Header from "../../components/header";

export default function Index() {
  return (
    <>
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <Header title="Dashboard" />

        <View style={styles.grid}>
          <Cards
            title="Products"
            icon="cart-outline"
            count={11}
            progress={64}
          />
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "col",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
