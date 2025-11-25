import Entypo from "@expo/vector-icons/Entypo";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import Logo from "../../assets/images/logo.png";
import ButtonText from "../../components/button";
import InputField from "../../components/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Index() {
  const router = useRouter();
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  const API_URL = "http://10.0.2.2:8000/api/login";
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      const response = await axios.post(API_URL, {
        email, password
      });
      console.log("Login successful:", response.data);
      if (response.data.token) {
        await AsyncStorage.setItem("token", "reponse.data.token");
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        router.push("(tabs)");
      } else {
        Alert.alert("Login Failed", "Invalid Email or Password");
      }
    }
    catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", "An error occurred during login. Please try again.");
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.signin}>
        <Image source={Logo} style={styles.logo} />
      </View>

      <View>
        {/* EMAIL */}
        <InputField
          label="Email"
          placeholder="Enter email"
          name="email"
          value={email}
          onChangeText={(text) => SetEmail(text)}
          iconLeft={<Entypo name="mail" size={20} color="#19529C" />}
        />

        {/* PASSWORD */}
        <InputField
          label="Password"
          placeholder="Enter password"
          name="password"
          secure={true}
          value={password}
          onChangeText={(text) => SetPassword(text)}
          iconLeft={<Entypo name="lock" size={20} color="#19529C" />}
        />
      </View>

      <View style={styles.button}>
        <ButtonText title="Sign In" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center" },

  signin: {
    justifyContent: "center",
    alignItems: "center",
  },

  signinText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#19529C",
  },

  button: {
    paddingHorizontal: 25,
  },
  logo: {
    height: 220,
    resizeMode: "contain",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
});
