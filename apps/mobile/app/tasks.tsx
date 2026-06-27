import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { MobileShell } from "../src/components/MobileShell";
import { TaskCard } from "../src/components/TaskCard";
import { Button, EmptyState } from "../src/components/ui";
import { getTasks, updateTask } from "../src/lib/api";
import { ApiTask } from "../src/types";

const filters = ["Tümü", "Bugün", "Geciken", "Tamamlanan"] as const;

export default function TasksScreen() {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tümü");

  async function load() {
    setTasks(await getTasks());
  }

  useEffect(() => {
    load();
  }, []);

  const visibleTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter((task) => {
      if (filter === "Bugün") return task.deadline && new Date(task.deadline).toDateString() === now.toDateString();
      if (filter === "Geciken") return task.deadline && new Date(task.deadline) < now && task.status !== "done";
      if (filter === "Tamamlanan") return task.status === "done";
      return true;
    });
  }, [filter, tasks]);

  async function schedule(task: ApiTask, days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(18, 0, 0, 0);
    await updateTask(task.id, { deadline: date.toISOString() });
    load();
  }

  return (
    <MobileShell title="Görevler" eyebrow="Plan">
      <View style={styles.filters}>
        {filters.map((item) => (
          <Button key={item} variant={filter === item ? "primary" : "ghost"} onPress={() => setFilter(item)}>{item}</Button>
        ))}
      </View>
      {visibleTasks.length ? visibleTasks.map((task) => (
        <View key={task.id} style={{ gap: 8 }}>
          <TaskCard task={task} onChanged={load} />
          <View style={styles.quickActions}>
            <Button variant="ghost" onPress={() => schedule(task, 0)}>Bugüne Al</Button>
            <Button variant="ghost" onPress={() => schedule(task, 1)}>Yarına Al</Button>
            <Button variant="ghost" onPress={() => schedule(task, 5)}>Bu Hafta</Button>
          </View>
        </View>
      )) : <EmptyState title="Henüz görev yok" text="Inbox’tan bir task draft onayladığında burada görünür." />}
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
