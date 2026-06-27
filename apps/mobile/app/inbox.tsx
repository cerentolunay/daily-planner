import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../src/constants/colors";
import { AIResultPreview } from "../src/components/AIResultPreview";
import { CaptureComposer } from "../src/components/CaptureComposer";
import { InboxItemCard } from "../src/components/InboxItemCard";
import { MobileShell } from "../src/components/MobileShell";
import { Button, Card, EmptyState } from "../src/components/ui";
import { analyzeInboxItem, analyzeInboxThread, createInboxThread, getInboxItems, getInboxThreads } from "../src/lib/api";
import { ApiInboxItem, ApiInboxThread, ApiTaskDraft } from "../src/types";

export default function InboxScreen() {
  const [items, setItems] = useState<ApiInboxItem[]>([]);
  const [threads, setThreads] = useState<ApiInboxThread[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState<ApiTaskDraft | null>(null);
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

  const selectedItems = useMemo(() => items.filter((item) => selected.includes(item.id)), [items, selected]);

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function analyzeItem(item: ApiInboxItem) {
    setLoading(true);
    const nextDraft = await analyzeInboxItem(item.id);
    setLoading(false);
    if (nextDraft) setDraft(nextDraft);
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
    if (thread && shouldAnalyze) {
      const nextDraft = await analyzeInboxThread(thread.id);
      if (nextDraft) setDraft(nextDraft);
    }
    setLoading(false);
    setSelected([]);
    load();
  }

  return (
    <MobileShell title="Smart Inbox" eyebrow="Capture">
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

      <AIResultPreview draft={draft} onChange={setDraft} onConverted={() => { setDraft(null); setMessage("Görev oluşturuldu."); }} />
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={{ gap: 12 }}>
        <Text style={styles.sectionTitle}>Bekleyenler</Text>
        {items.length ? items.map((item) => (
          <InboxItemCard key={item.id} item={item} selected={selected.includes(item.id)} onToggle={() => toggle(item.id)} onAnalyze={() => analyzeItem(item)} />
        )) : <EmptyState title="Gelen kutun boş" text="WhatsApp, e-posta veya notlardan gelen işleri buraya bırakabilirsin." />}
      </View>

      <View style={{ gap: 12 }}>
        <Text style={styles.sectionTitle}>Thread’ler</Text>
        {threads.length ? threads.map((thread) => (
          <Card key={thread.id}>
            <Text style={styles.threadTitle}>{thread.title}</Text>
            <Text style={styles.threadText}>{thread.items.length} mesaj · %{Math.round(thread.confidence || 0)} confidence</Text>
          </Card>
        )) : <EmptyState title="Henüz thread yok" text="Birden fazla mesaj seçip tek görev bloğuna dönüştürebilirsin." />}
      </View>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
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
