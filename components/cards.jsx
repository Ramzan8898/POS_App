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
          <MaterialCommunityIcons name={icon} size={32} color="#1E57A6" />
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
    margin: "1.5%",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#1E57A6",
    borderRadius: 15,
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius:20


  },

  iconBox: {
    width: 55,
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  rightSection: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight:'bold',
    color: "#fff",
  },

  count: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 3,
    color: "#fff",
  },

  progressBg: {
    width: "100%",
    height: 10,
    borderRadius: 10,
    borderWidth:1,
    overflow: "hidden",
    borderColor:'#fff'
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
  },
});
