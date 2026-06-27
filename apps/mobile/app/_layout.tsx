import { Tabs } from "expo-router";
import { colors } from "../src/constants/colors";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: "rgba(93,84,145,0.55)",
        tabBarStyle: {
          backgroundColor: "rgba(255,255,255,0.94)",
          borderTopColor: "rgba(93,84,145,0.12)",
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontWeight: "900",
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Bugün" }} />
      <Tabs.Screen name="inbox" options={{ title: "Inbox" }} />
      <Tabs.Screen name="tasks" options={{ title: "Görevler" }} />
      <Tabs.Screen name="calendar" options={{ title: "Takvim" }} />
      <Tabs.Screen name="settings" options={{ title: "Ayarlar" }} />
      <Tabs.Screen name="projects" options={{ href: null }} />
      <Tabs.Screen name="focus" options={{ href: null }} />
      <Tabs.Screen name="share-capture" options={{ href: null }} />
    </Tabs>
  );
}
