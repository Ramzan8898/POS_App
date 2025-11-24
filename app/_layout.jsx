import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="/splash" />
      <Stack.Screen name="/login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="/products" />
      <Stack.Screen name="/employees" />
      <Stack.Screen name="/customers" />
      <Stack.Screen name="/suppliers" />
      <Stack.Screen name="/salary" />
      <Stack.Screen name="/attendence" />
      <Stack.Screen name="/roles" />
      <Stack.Screen name="/users" />
      <Stack.Screen name="/orders" />
      <Stack.Screen name="/databasebackup" />
    </Stack>
  );
}
