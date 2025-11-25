import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon focused={focused} icon="home" size={28} />
          ),
        }}
      />

      <Tabs.Screen
        name="pos"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon focused={focused} icon="point-of-sale" size={26} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon focused={focused} icon="account-circle" size={26} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ focused, icon, size }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.spring(scale, {
        toValue: 1.2,
        tension: 150,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scale, {
        toValue: 1,
        tension: 150,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {focused ? (
        <LinearGradient
          colors={["#F48424", "#FF6B35"]}
          style={styles.activeIconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons name={icon} size={size} color="#FFFFFF" />
        </LinearGradient>
      ) : (
        <View style={styles.inactiveIconContainer}>
          <MaterialCommunityIcons name={icon} size={size} color="#1E57A6" />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 70,
    borderTopRightRadius:25,
    borderTopLeftRadius:25,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    paddingHorizontal: 20,
    borderTopWidth:2,
    borderTopColor:'#ecececff'
  },
  activeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F48424",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inactiveIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
