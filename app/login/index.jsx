import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import Logo from "../../assets/images/logo.png";
import ButtonText from "../../components/button";
import InputField from "../../components/input";

export default function Index() {
  const title = "Sign In";
  const router = useRouter();
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
          iconLeft={<Entypo name="mail" size={20} color="#19529C" />}
        />

        {/* PASSWORD */}
        <InputField
          label="Password"
          placeholder="Enter password"
          secure={true}
          iconLeft={<Entypo name="lock" size={20} color="#19529C" />}
        />
      </View>

      <View style={styles.button}>
        <ButtonText title={title} onPress={() => router.push("(tabs)")} />
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
