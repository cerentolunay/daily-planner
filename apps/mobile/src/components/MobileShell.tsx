import { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import { FloatingCaptureButton } from "./FloatingCaptureButton";

export function MobileShell({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        {children}
      </ScrollView>
      <FloatingCaptureButton />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lilac,
  },
  content: {
    padding: 18,
    paddingTop: 58,
    paddingBottom: 110,
    gap: 16,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 1.6,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    color: colors.purple,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "900",
  },
});
