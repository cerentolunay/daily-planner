import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { ApiProject } from "../types";

export function ProjectCard({ project, count = 0 }: { project: ApiProject; count?: number }) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}><Text style={styles.iconText}>{project.name.slice(0, 1)}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{project.name}</Text>
        <Text style={styles.text}>{count} görev · {project.description || "Açıklama yok"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.76)",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.neon,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: colors.purple,
    fontWeight: "900",
    fontSize: 18,
  },
  title: {
    color: colors.purple,
    fontWeight: "900",
    fontSize: 17,
  },
  text: {
    marginTop: 4,
    color: colors.muted,
    fontWeight: "700",
  },
});
