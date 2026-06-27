import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../src/constants/colors";
import { MobileShell } from "../src/components/MobileShell";
import { TaskCard } from "../src/components/TaskCard";
import { Card, EmptyState } from "../src/components/ui";
import { getTasks } from "../src/lib/api";
import { ApiTask } from "../src/types";

const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export default function CalendarScreen() {
  const [tasks, setTasks] = useState<ApiTask[]>([]);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  const datedTasks = useMemo(() => tasks.filter((task) => task.deadline), [tasks]);
  const overdue = datedTasks.filter((task) => new Date(task.deadline || "") < new Date() && task.status !== "done");

  return (
    <MobileShell title="Takvim" eyebrow="Haftalık görünüm">
      <Card>
        <View style={styles.week}>
          {days.map((day, index) => (
            <View key={day} style={[styles.day, index === new Date().getDay() - 1 && styles.activeDay]}>
              <Text style={styles.dayText}>{day}</Text>
              <Text style={styles.dayNumber}>{index + 1}</Text>
            </View>
          ))}
        </View>
      </Card>
      <Text style={styles.sectionTitle}>Deadline’ı olan görevler</Text>
      {datedTasks.length ? datedTasks.slice(0, 6).map((task) => <TaskCard key={task.id} task={task} />) : <EmptyState title="Bu hafta sakin" text="Deadline eklediğin görevler burada belirecek." />}
      <Text style={styles.sectionTitle}>Gecikenler</Text>
      {overdue.length ? overdue.map((task) => <TaskCard key={task.id} task={task} />) : <EmptyState title="Geciken yok" text="Takvim akışı temiz görünüyor." />}
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  week: {
    flexDirection: "row",
    gap: 8,
  },
  day: {
    flex: 1,
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  activeDay: {
    backgroundColor: colors.yellow,
  },
  dayText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
  },
  dayNumber: {
    marginTop: 4,
    color: colors.purple,
    fontWeight: "900",
  },
  sectionTitle: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: "900",
  },
});
