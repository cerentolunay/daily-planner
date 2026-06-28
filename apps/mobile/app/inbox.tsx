import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { colors } from "../src/constants/colors";
import { CaptureComposer } from "../src/components/CaptureComposer";
import { InboxItemCard } from "../src/components/InboxItemCard";
import { MobileShell } from "../src/components/MobileShell";
import { Button, Card, EmptyState, Textarea } from "../src/components/ui";
import {
  analyzeInboxItem,
  analyzeInboxThread,
  analyzeMobileInboxItem,
  convertMobileInboxItemToTasks,
  createInboxThread,
  createMobileInboxItem,
  getInboxItems,
  getInboxThreads,
} from "../src/lib/api";
import { setLastCaptureText } from "../src/lib/storage";
import { ApiInboxItem, ApiInboxThread, InboxAIResult } from "../src/types";

function sourceFromParam(value?: string): "manual" | "whatsapp" | "android_share" {
  if (value === "android_share" || value === "whatsapp") return value;
  return "manual";
}

export default function InboxScreen() {
  const params = useLocalSearchParams<{ text?: string; source?: string }>();
  const sharedText = typeof params.text === "string" ? params.text : "";
  const sharedSource = sourceFromParam(typeof params.source === "string" ? params.source : undefined);
  const [rawText, setRawText] = useState(sharedText);
  const [activeItem, setActiveItem] = useState<ApiInboxItem | null>(null);
  const [aiResult, setAiResult] = useState<InboxAIResult | null>(null);
  const [items, setItems] = useState<ApiInboxItem[]>([]);
  const [threads, setThreads] = useState<ApiInboxThread[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const [nextItems, nextThreads] = await Promise.all([getInboxItems(), getInboxThreads()]);
    setItems(nextItems);
    setThreads(nextThreads);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (sharedText) {
      setRawText(sharedText);
      setMessage("Paylaşılan mesaj hazır. Analiz etmeden önce düzenleyebilirsin.");
    }
  }, [sharedText]);

  const selectedItems = useMemo(() => items.filter((item) => selected.includes(item.id)), [items, selected]);

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function analyzeIntake() {
    const text = rawText.trim();
    if (!text) {
      setMessage("Analiz için önce bir mesaj yapıştırmalısın.");
      return;
    }
    setLoading(true);
    setMessage("");
    await setLastCaptureText(text);
    const item = activeItem || (await createMobileInboxItem({ source: sharedText ? sharedSource : "manual", raw_text: text }));
    if (!item) {
      setLoading(false);
      setMessage("Inbox kaydı oluşturulamadı. Backend URL ve oturumunu kontrol et.");
      return;
    }
    setActiveItem(item);
    const analyzed = await analyzeMobileInboxItem(item.id);
    setLoading(false);
    if (!analyzed) {
      setMessage("AI analizi yapılamadı. Daha sonra tekrar deneyebilirsin.");
      return;
    }
    setActiveItem(analyzed);
    setAiResult(analyzed.ai_result_json || null);
    setMessage(analyzed.status === "failed" ? "AI güvenli fallback önerisi gösterdi." : "AI önerileri hazır. Task oluşturmak için onay ver.");
    load();
  }

  async function createTasksFromSuggestion() {
    if (!activeItem) {
      setMessage("Önce mesajı analiz etmelisin.");
      return;
    }
    setLoading(true);
    const created = await convertMobileInboxItemToTasks(activeItem.id);
    setLoading(false);
    if (!created?.length) {
      setMessage("Görev oluşturulamadı.");
      return;
    }
    setMessage(`${created.length} görev oluşturuldu.`);
    setRawText("");
    setActiveItem(null);
    setAiResult(null);
    load();
  }

  async function analyzeExistingItem(item: ApiInboxItem) {
    setLoading(true);
    const nextDraft = await analyzeInboxItem(item.id);
    setLoading(false);
    if (nextDraft) {
      setMessage("Eski Inbox akışında TaskDraft oluşturuldu. Yeni intake alanından task'a çevirebilirsin.");
      const refreshed = await analyzeMobileInboxItem(item.id);
      if (refreshed) {
        setActiveItem(refreshed);
        setRawText(refreshed.raw_text);
        setAiResult(refreshed.ai_result_json || null);
      }
    }
    load();
  }

  async function makeThread(shouldAnalyze: boolean) {
    if (selected.length < 2) {
      setMessage("Thread için en az 2 mesaj seçmelisin.");
      return;
    }
    setLoading(true);
    const thread = await createInboxThread({
      title: `${selectedItems[0]?.title || "Mobil"} konuşması`,
      summary: selectedItems.map((item) => item.raw_text).join("\n"),
      item_ids: selected,
      status: "open",
    });
    if (thread && shouldAnalyze) await analyzeInboxThread(thread.id);
    setLoading(false);
    setSelected([]);
    setMessage(thread ? "Thread hazırlandı." : "Thread oluşturulamadı.");
    load();
  }

  return (
    <MobileShell title="Inbox Intake" eyebrow="WhatsApp Capture">
      <Card style={styles.intakeCard}>
        <Text style={styles.title}>Paylaşılan mesaj</Text>
        <Text style={styles.helper}>WhatsApp mesajını paylaş, yapıştır veya düzenle. AI sadece öneri üretir; görevler onayınla oluşur.</Text>
        <Textarea value={rawText} onChangeText={setRawText} placeholder="WhatsApp mesajını buraya yapıştır..." />
        <Button onPress={analyzeIntake} disabled={loading}>{loading ? "Analiz ediliyor..." : "Analyze with AI"}</Button>
      </Card>

      {aiResult ? (
        <Card style={styles.previewCard}>
          <Text style={styles.title}>Task suggestions</Text>
          {aiResult.used_fallback ? <Text style={styles.notice}>AI fallback kullanıldı. Öneriyi kontrol etmeden task oluşturma.</Text> : null}
          {aiResult.tasks.map((task, index) => (
            <View key={`${task.title}-${index}`} style={styles.suggestion}>
              <Text style={styles.suggestionTitle}>{task.title}</Text>
              {task.description ? <Text style={styles.suggestionText}>{task.description}</Text> : null}
              <Text style={styles.suggestionMeta}>Öncelik: {task.priority} · Son tarih: {task.dueDate || "Yok"}</Text>
              {task.tags?.length ? <Text style={styles.tags}>Etiketler: {task.tags.join(", ")}</Text> : null}
            </View>
          ))}
          <Button onPress={createTasksFromSuggestion} disabled={loading}>Create task(s)</Button>
        </Card>
      ) : null}

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <CaptureComposer onSaved={load} />

      {selected.length ? (
        <Card style={styles.actionBar}>
          <Text style={styles.actionTitle}>{selected.length} mesaj seçildi</Text>
          <View style={styles.actions}>
            <Button onPress={() => makeThread(false)}>Thread Oluştur</Button>
            <Button variant="secondary" onPress={() => makeThread(true)} disabled={loading}>{loading ? "Analiz Ediliyor..." : "Birleştir ve Analiz Et"}</Button>
          </View>
        </Card>
      ) : null}

      <View style={{ gap: 12 }}>
        <Text style={styles.sectionTitle}>Bekleyenler</Text>
        {items.length ? (
          items.map((item) => (
            <InboxItemCard key={item.id} item={item} selected={selected.includes(item.id)} onToggle={() => toggle(item.id)} onAnalyze={() => analyzeExistingItem(item)} />
          ))
        ) : (
          <EmptyState title="Gelen kutun boş" text="WhatsApp, e-posta veya notlardan gelen işleri buraya bırakabilirsin." />
        )}
      </View>

      <View style={{ gap: 12 }}>
        <Text style={styles.sectionTitle}>Thread'ler</Text>
        {threads.length ? (
          threads.map((thread) => (
            <Card key={thread.id}>
              <Text style={styles.threadTitle}>{thread.title}</Text>
              <Text style={styles.threadText}>{thread.items.length} mesaj · %{Math.round(thread.confidence || 0)} confidence</Text>
            </Card>
          ))
        ) : (
          <EmptyState title="Henüz thread yok" text="Birden fazla mesaj seçip tek görev bloğuna dönüştürebilirsin." />
        )}
      </View>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  intakeCard: {
    gap: 12,
    borderColor: "rgba(255,210,48,0.75)",
  },
  previewCard: {
    gap: 12,
    backgroundColor: "rgba(225,251,98,0.35)",
  },
  title: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: "900",
  },
  helper: {
    color: colors.muted,
    fontWeight: "800",
    lineHeight: 20,
  },
  suggestion: {
    gap: 8,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  suggestionTitle: {
    color: colors.purple,
    fontSize: 17,
    fontWeight: "900",
  },
  suggestionText: {
    color: colors.muted,
    fontWeight: "800",
  },
  suggestionMeta: {
    color: colors.purple,
    fontWeight: "900",
  },
  tags: {
    color: colors.muted,
    fontWeight: "800",
  },
  notice: {
    color: colors.purple,
    backgroundColor: "rgba(255,210,48,0.5)",
    borderRadius: 14,
    padding: 10,
    fontWeight: "900",
  },
  actionBar: {
    backgroundColor: colors.purple,
    gap: 12,
  },
  actionTitle: {
    color: colors.white,
    fontWeight: "900",
  },
  actions: {
    gap: 8,
  },
  sectionTitle: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: "900",
  },
  message: {
    color: colors.purple,
    backgroundColor: "rgba(225,251,98,0.45)",
    padding: 12,
    borderRadius: 16,
    fontWeight: "900",
  },
  threadTitle: {
    color: colors.purple,
    fontWeight: "900",
    fontSize: 17,
  },
  threadText: {
    color: colors.muted,
    fontWeight: "800",
    marginTop: 6,
  },
});
