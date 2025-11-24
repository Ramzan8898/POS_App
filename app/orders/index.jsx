import { View } from "react-native";
import Header from "../../components/header";

export default function index() {
  return (
    <>
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <Header title="orders" />
      </View>
    </>
  );
}

