import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { ApiInboxItem } from "../types";
import { Button } from "./ui";

export function InboxItemCard({
  item,
  selected,
  onToggle,
  onAnalyze,
}: {
  item: ApiInboxItem;
  selected?: boolean;
  onToggle?: () => void;
  onAnalyze?: () => void;
}) {
  return (
    <Pressable onPress={onToggle} style={[styles.card, selected && styles.selected]}>
      <View style={styles.row}>
        <View style={[styles.check, selected && styles.checkActive]}><Text style={styles.checkText}>{selected ? "✓" : ""}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.source}>{item.source_type} · {item.status}</Text>
          <Text style={styles.title}>{item.title || item.raw_text.slice(0, 80)}</Text>
          <Text style={styles.body} numberOfLines={3}>{item.raw_text}</Text>
        </View>
      </View>
      <Button variant="ghost" onPress={onAnalyze}>AI ile Analiz Et</Button>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.76)",
    padding: 16,
    gap: 12,
  },
  selected: {
    backgroundColor: "rgba(255,210,48,0.38)",
    borderColor: colors.yellow,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  checkActive: {
    backgroundColor: colors.purple,
  },
  checkText: {
    color: colors.white,
    fontWeight: "900",
  },
  source: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    marginTop: 6,
    color: colors.purple,
    fontSize: 16,
    fontWeight: "900",
  },
  body: {
    marginTop: 6,
    color: colors.muted,
    fontWeight: "700",
    lineHeight: 20,
  },
});
