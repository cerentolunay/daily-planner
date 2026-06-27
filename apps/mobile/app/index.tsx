import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { colors } from "../src/constants/colors";
import { MobileShell } from "../src/components/MobileShell";
import { Button, Card, EmptyState } from "../src/components/ui";
import { TaskCard } from "../src/components/TaskCard";
import { getTasks } from "../src/lib/api";
import { ApiTask } from "../src/types";

function greeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Günaydın 👋";
  if (hour < 18) return "İyi çalışmalar ☀️";
  if (hour < 23) return "İyi akşamlar 🌙";
  return "Gece modu ✨";
}

export default function TodayScreen() {
  const [tasks, setTasks] = useState<ApiTask[]>([]);

  async function load() {
    setTasks(await getTasks());
  }

  useEffect(() => {
    load();
  }, []);

  const todayTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter((task) => task.deadline && new Date(task.deadline).toDateString() === today);
  }, [tasks]);
  const completed = todayTasks.filter((task) => task.status === "done").length;
  const progress = todayTasks.length ? Math.round((completed / todayTasks.length) * 100) : 0;
  const focus = todayTasks.find((task) => task.status !== "done") || tasks.find((task) => task.status !== "done");

  return (
    <MobileShell title={greeting()} eyebrow="Bugün">
      <Card style={styles.hero}>
        <Text style={styles.heroTitle}>Bugün neler başaracağız?</Text>
        <Text style={styles.heroText}>{todayTasks.length ? `Bugün ${todayTasks.length} görevin var.` : "Bugün için planlanmış görev yok. Hafif bir gün olabilir."}</Text>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
        <Text style={styles.progressText}>Günlük ilerleme %{progress}</Text>
        <Button onPress={() => router.push("/inbox" as never)}>Hızlı Capture</Button>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Bugünün odağı</Text>
        <Text style={styles.focusText}>{focus?.title || "Henüz odak görevi yok."}</Text>
      </Card>

      <View style={{ gap: 12 }}>
        <Text style={styles.sectionTitle}>Bugünkü görevler</Text>
        {todayTasks.length ? todayTasks.map((task) => <TaskCard key={task.id} task={task} onChanged={load} />) : <EmptyState title="Bugün tertemiz" text="İstersen küçük bir görev ekleyerek gününü planlamaya başlayabilirsin." />}
      </View>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "rgba(255,210,48,0.58)",
    gap: 12,
  },
  heroTitle: {
    color: colors.purple,
    fontSize: 26,
    fontWeight: "900",
  },
  heroText: {
    color: colors.muted,
    fontWeight: "800",
  },
  progressTrack: {
    height: 14,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.72)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.neon,
  },
  progressText: {
    color: colors.purple,
    fontWeight: "900",
  },
  sectionTitle: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: "900",
  },
  focusText: {
    marginTop: 8,
    color: colors.muted,
    fontWeight: "800",
  },
});
