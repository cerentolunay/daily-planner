import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../src/constants/colors";
import { AuthGate } from "../src/components/AuthGate";

export default function RootLayout() {
  return (
    <AuthGate>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.purple,
          tabBarInactiveTintColor: "rgba(93,84,145,0.45)",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "rgba(93,84,145,0.1)",
            height: 68,
            paddingTop: 8,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontWeight: "700",
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Bugün",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            title: "Inbox",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "mail-unread" : "mail-unread-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Görevler",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "checkmark-circle" : "checkmark-circle-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Takvim",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "calendar" : "calendar-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Ayarlar",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="ai-preview" options={{ href: null }} />
        <Tabs.Screen name="projects" options={{ href: null }} />
        <Tabs.Screen name="focus" options={{ href: null }} />
        <Tabs.Screen name="share-capture" options={{ href: null }} />
      </Tabs>
    </AuthGate>
  );
}
