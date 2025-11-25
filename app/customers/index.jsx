import { View } from "react-native";
import Header from "../../components/header";
import UserTable from "../../components/show";

export default function Index() {
  const customerData = [
    {
      image: "",
      name: "Ali Khan",
      phone: "03001234567",
      shopName: "WebsCare",
      address: "Lahore",
    },
  ];

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <Header title="Customers" />

      <UserTable
        data={customerData}
        showSalary={false}
        showShopName={true}
        onView={(user) => console.log("Customer View", user)}
        onEdit={(user) => console.log("Customer Edit", user)}
        onDelete={(user) => console.log("Customer Delete", user)}
      />
    </View>
  );
}
