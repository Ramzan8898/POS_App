import { useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ButtonText({ title }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity style={styles.signinButton} onPress={animatePress}>
          <Text style={styles.signinButtonText}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  signinButton: {
    backgroundColor: "#F48424",
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  signinButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  container:{
    marginTop: 30,
    width: "100%",
    marginBottom: 25,
    paddingHorizontal: 95,
  }
});
