import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
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
