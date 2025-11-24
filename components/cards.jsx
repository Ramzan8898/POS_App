import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function Cards({ title, icon, count = 0, progress = 50 }) {
  const countAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(countAnim, {
      toValue: count,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    Animated.timing(barAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [count, progress]);

  const animatedBarWidth = barAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {/* LEFT ICON BOX */}
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name={icon} size={32} color="#4CAF50" />
        </View>

        {/* TITLE + COUNT */}
        <View style={styles.rightSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.count}>{count}</Text>

          {/* PROGRESS BAR */}
          <View style={styles.progressBg}>
            <Animated.View
              style={[styles.progressFill, { width: animatedBarWidth }]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "47%",
    margin: "1.5%",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  iconBox: {
    width: 55,
    height: 55,
    backgroundColor: "#EAF7EE",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  rightSection: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C3D68",
  },

  count: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 3,
    color: "#1C3D68",
  },

  progressBg: {
    width: "100%",
    height: 7,
    backgroundColor: "#D8E2E9",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
});
