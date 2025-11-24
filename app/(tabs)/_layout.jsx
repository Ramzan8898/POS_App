import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#F48424",
        tabBarInactiveTintColor: "#1E57A6",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={38} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="pos"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="point-of-sale"
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
