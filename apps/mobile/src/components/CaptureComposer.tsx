import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { createInboxItem, submitCapture } from "../lib/api";
import { enqueueCapture, getCaptureQueue, removeQueuedCapture, setLastCaptureText } from "../lib/storage";
import { CaptureQueueItem } from "../types";
import { Button, Card, Input, Textarea } from "./ui";

function makeQueueItem(raw_text: string, mode: "manual" | "whatsapp" | "web", source_url?: string): CaptureQueueItem {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    raw_text,
    title: mode === "web" ? "Mobil link capture" : mode === "whatsapp" ? "WhatsApp paylaşımı" : "Manuel capture",
    source_type: mode,
    content_type: mode === "web" ? "url" : "text",
    source_url: source_url || null,
    created_at: new Date().toISOString(),
    metadata_json: {
      platform: "mobile",
      capture_method: mode === "whatsapp" ? "share_intent" : mode === "web" ? "link_capture" : "manual_paste",
      app: mode === "whatsapp" ? "whatsapp" : "dailyplanner",
    },
  };
}

export function CaptureComposer({ onSaved }: { onSaved?: () => void }) {
  const [mode, setMode] = useState<"manual" | "whatsapp" | "web">("manual");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [queue, setQueue] = useState<CaptureQueueItem[]>([]);
  const [message, setMessage] = useState("");

  async function refreshQueue() {
    setQueue(await getCaptureQueue());
  }

  useEffect(() => {
    refreshQueue();
  }, []);

  async function save() {
    const raw = mode === "web" ? url : text;
    if (!raw.trim()) {
      setMessage("Yakalanacak içerik boş olamaz.");
      return;
    }
    const item = makeQueueItem(raw.trim(), mode, mode === "web" ? url.trim() : undefined);
    setLastCaptureText(raw.trim());
    const saved = await submitCapture(item);
    if (!saved) {
      await enqueueCapture(item);
      await refreshQueue();
      setMessage("Backend erişilemedi. Capture bekleyen kuyruğa alındı.");
      return;
    }
    setText("");
    setUrl("");
    setMessage("Capture Inbox’a kaydedildi.");
    onSaved?.();
  }

  async function retry(item: CaptureQueueItem) {
    const saved = await submitCapture(item);
    if (saved) {
      await removeQueuedCapture(item.id);
      await refreshQueue();
      onSaved?.();
    }
  }

  return (
    <Card style={{ gap: 12 }}>
      <Text style={styles.title}>Capture Alanı</Text>
      <View style={styles.tabs}>
        <Button variant={mode === "manual" ? "primary" : "ghost"} onPress={() => setMode("manual")}>Yaz</Button>
        <Button variant={mode === "whatsapp" ? "primary" : "ghost"} onPress={() => setMode("whatsapp")}>Yapıştır</Button>
        <Button variant={mode === "web" ? "primary" : "ghost"} onPress={() => setMode("web")}>Link</Button>
      </View>
      {mode === "web" ? (
        <Input value={url} onChangeText={setUrl} placeholder="https://..." autoCapitalize="none" />
      ) : (
        <Textarea value={text} onChangeText={setText} placeholder="WhatsApp mesajını veya notu buraya yapıştır..." />
      )}
      <Button onPress={save}>Inbox’a Kaydet</Button>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Text style={styles.subtitle}>Bekleyen Capture’lar</Text>
      {queue.length ? (
        queue.map((item) => (
          <View key={item.id} style={styles.queueItem}>
            <Text style={styles.queueText} numberOfLines={2}>{item.raw_text}</Text>
            <View style={styles.queueActions}>
              <Button variant="ghost" onPress={() => retry(item)}>Tekrar Dene</Button>
              <Button variant="secondary" onPress={async () => { await removeQueuedCapture(item.id); refreshQueue(); }}>Sil</Button>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>Bekleyen capture yok.</Text>
      )}
    </Card>
  );
}

export async function saveSharedCapture(rawText: string) {
  const item = makeQueueItem(rawText, rawText.startsWith("http") ? "web" : "whatsapp", rawText.startsWith("http") ? rawText : undefined);
  const saved = await submitCapture(item);
  if (!saved) await enqueueCapture(item);
  return saved;
}

const styles = StyleSheet.create({
  title: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.purple,
    fontWeight: "900",
  },
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  message: {
    color: colors.purple,
    backgroundColor: "rgba(225,251,98,0.45)",
    borderRadius: 14,
    padding: 10,
    fontWeight: "800",
  },
  queueItem: {
    backgroundColor: "rgba(255,255,255,0.64)",
    borderRadius: 18,
    padding: 12,
    gap: 10,
  },
  queueText: {
    color: colors.muted,
    fontWeight: "800",
  },
  queueActions: {
    flexDirection: "row",
    gap: 8,
  },
  empty: {
    color: colors.muted,
    fontWeight: "700",
  },
});
