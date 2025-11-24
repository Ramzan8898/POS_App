import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Colors from "../../src/theme/colors";

export default function SplashScreen() {
  useEffect(() => {
    setTimeout(() => {
      router.replace("/login");
    }, 1500);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30, color:Colors.blue }}>Your Logo / Splash</Text>
    </View>
  );
}
