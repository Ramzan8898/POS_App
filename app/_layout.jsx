import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash/index" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
