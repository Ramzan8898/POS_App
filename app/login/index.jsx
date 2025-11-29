import Entypo from "@expo/vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import Logo from "../../assets/images/logo.png";
import ButtonText from "../../components/button";
import InputField from "../../components/input";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = "http://192.168.1.20:8000/api/login";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter both email & password");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE =>", data);

      if (data.token) {
        await AsyncStorage.setItem("token", data.token); // ✅ FIXED
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        router.push("(tabs)");
      } else {
        Alert.alert("Login Failed", "Invalid Credentials");
      }
    } catch (err) {
      console.log("Login error:", err);
      Alert.alert("Login Failed", "Server not responding");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />

      <InputField
        label="Email"
        placeholder="Enter Email"
        value={email}
        onChangeText={(t) => setEmail(t)}
        iconLeft={<Entypo name="mail" size={20} color="#19529C" />}
      />

      <InputField
        label="Password"
        placeholder="Enter Password"
        secure={true}
        value={password}
        onChangeText={(t) => setPassword(t)}
        iconLeft={<Entypo name="lock" size={20} color="#19529C" />}
      />

      <View style={styles.button}>
        <ButtonText title="Sign In" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#fff" },
  button: { marginTop: 20, paddingHorizontal: 25 },
  logo: { height: 220, alignSelf: "center", resizeMode: "contain" },
});
