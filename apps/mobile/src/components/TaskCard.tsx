import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { priorityLabels, statusLabels } from "../constants/labels";
import { ApiTask } from "../types";
import { formatDeadline, updateTask } from "../lib/api";

export function TaskCard({ task, onChanged }: { task: ApiTask; onChanged?: () => void }) {
  const completed = task.subtasks?.filter((subtask) => subtask.is_completed).length || 0;
  const total = task.subtasks?.length || 0;

  async function markDone() {
    await updateTask(task.id, { status: "done" });
    onChanged?.();
  }

  return (
    <View style={styles.card}>
      <View style={[styles.accent, task.priority === "urgent" ? styles.purple : task.priority === "high" ? styles.yellow : styles.neon]} />
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.meta}>{formatDeadline(task.deadline)} · {priorityLabels[task.priority]} · {statusLabels[task.status]}</Text>
      {total ? <Text style={styles.subtasks}>{completed}/{total} yapılacak tamamlandı</Text> : null}
      <View style={styles.actions}>
        <Pressable onPress={markDone} style={styles.action}><Text style={styles.actionText}>Tamamla</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.76)",
    borderColor: colors.border,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  accent: {
    height: 6,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 8,
  },
  yellow: { backgroundColor: colors.yellow },
  neon: { backgroundColor: colors.neon },
  purple: { backgroundColor: colors.purple },
  title: {
    color: colors.purple,
    fontSize: 17,
    fontWeight: "900",
  },
  meta: {
    color: colors.muted,
    fontWeight: "800",
  },
  subtasks: {
    color: colors.purple,
    fontWeight: "900",
    backgroundColor: "rgba(225,251,98,0.45)",
    padding: 10,
    borderRadius: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  action: {
    backgroundColor: colors.yellow,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  actionText: {
    color: colors.purple,
    fontWeight: "900",
  },
});
