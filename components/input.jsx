// components/InputField.jsx

import Entypo from "@expo/vector-icons/Entypo";
import { useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function InputField({
  label,
  placeholder,
  secure = false,
  iconLeft,
  ...props
}) {
  const borderAnim = useRef(new Animated.Value(0)).current;
  const [showPassword, setShowPassword] = useState(false);

  const animateField = (to) => {
    Animated.timing(borderAnim, {
      toValue: to,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.fieldWrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: borderAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["#C6C6C6", "#19529C"],
            }),
          },
        ]}
      >
        <View style={styles.row}>
          {/* LEFT ICON */}
          {iconLeft && <View style={styles.leftIcon}>{iconLeft}</View>}

          {/* INPUT BOX */}
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder={placeholder}
            placeholderTextColor="#999"
            secureTextEntry={secure && !showPassword}
            onFocus={() => animateField(1)}
            onBlur={() => animateField(0)}
            {...props}
          />

          {/* RIGHT ICON FOR PASSWORD */}
          {secure && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Entypo
                name={showPassword ? "eye-with-line" : "eye"}
                size={22}
                color="#19529C"
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {
    marginBottom: 25,
    paddingHorizontal: 25,
  },

  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#19529C",
  },

  inputContainer: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#F8F9FB",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  leftIcon: {
    marginRight: 8,
  },

  input: {
    fontSize: 16,
    color: "#000",
  },
});
