import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../src/constants/colors";
import { MobileShell } from "../src/components/MobileShell";
import { TaskCard } from "../src/components/TaskCard";
import { Button, Card, EmptyState } from "../src/components/ui";
import { getTasks, updateTask } from "../src/lib/api";
import { ApiTask } from "../src/types";

export default function FocusScreen() {
  const [task, setTask] = useState<ApiTask | null>(null);

  async function load() {
    const tasks = await getTasks();
    setTask(tasks.find((item) => item.status !== "done") || null);
  }

  useEffect(() => {
    load();
  }, []);

  async function markDone() {
    if (!task) return;
    await updateTask(task.id, { status: "done" });
    load();
  }

  return (
    <MobileShell title="Odak" eyebrow="Tek iş">
      {task ? (
        <>
          <Card style={styles.timer}>
            <Text style={styles.timerText}>25:00</Text>
            <Text style={styles.timerSub}>Bugünün odağına küçük bir blok ayır.</Text>
          </Card>
          <TaskCard task={task} onChanged={load} />
          <Button onPress={markDone}>Tamamlandı Olarak İşaretle</Button>
          <Button variant="ghost">Sonra Devam Et</Button>
        </>
      ) : <EmptyState title="Bugünün odağı hazır değil" text="Inbox’tan bir görev oluşturduğunda burada odak akışı başlayacak." />}
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  timer: {
    alignItems: "center",
    backgroundColor: "rgba(255,210,48,0.55)",
  },
  timerText: {
    color: colors.purple,
    fontSize: 48,
    fontWeight: "900",
  },
  timerSub: {
    marginTop: 8,
    color: colors.muted,
    fontWeight: "800",
  },
});
