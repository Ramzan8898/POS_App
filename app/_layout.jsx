import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log("TOKEN =>", token);
      if (token) {
        setInitialRoute("(tabs)");
      } else {
        setInitialRoute("login/index");
      }
    };
    checkAuth();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#19529C" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="splash/index" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="products/index" />
      <Stack.Screen name="employees/index" />
      <Stack.Screen name="customers/index" />
      <Stack.Screen name="suppliers/index" />
      <Stack.Screen name="salary/index" />
      <Stack.Screen name="attendence/index" />
      <Stack.Screen name="roles/index" />
      <Stack.Screen name="users/index" />
      <Stack.Screen name="orders/index" />
      <Stack.Screen name="pos/receipt" />
      <Stack.Screen name="databasebackup/index" />
    </Stack>
  );
}
