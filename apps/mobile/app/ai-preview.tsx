import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../src/constants/colors";
import { Button, Card } from "../src/components/ui";
import { createTaskDraft, convertTaskDraftToTask } from "../src/lib/api";
import { getAIPreview, clearAIPreview } from "../src/lib/aiPreviewStore";
import { AIAnalysisResult, Priority, TaskStatus } from "../src/types";

// ─── Constants ───────────────────────────────────────────────────────────────

const PRIORITY_OPTIONS: { value: Priority; label: string; bg: string; dark: boolean }[] = [
  { value: "low",    label: "Düşük",  bg: "rgba(210,199,255,0.7)", dark: true  },
  { value: "medium", label: "Orta",   bg: "rgba(255,232,137,0.7)", dark: true  },
  { value: "high",   label: "Yüksek", bg: colors.yellow,           dark: true  },
  { value: "urgent", label: "Acil",   bg: colors.purple,           dark: false },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo",        label: "Yapılacak"    },
  { value: "in_progress", label: "Devam Ediyor" },
  { value: "waiting",     label: "Beklemede"    },
  { value: "done",        label: "Tamamlandı"   },
  { value: "cancelled",   label: "İptal"        },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDeadline(iso?: string | null): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      weekday: "long", day: "numeric", month: "long",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function confidenceColor(n: number) {
  if (n >= 80) return "#22c55e";
  if (n >= 55) return colors.yellow;
  return "#f97316";
}

// ─── Success view (standalone, no data needed) ────────────────────────────────

function SuccessView() {
  return (
    <View style={styles.successRoot}>
      <StatusBar style="dark" />
      <View style={styles.successCheck}>
        <Text style={styles.successCheckText}>✓</Text>
      </View>
      <Text style={styles.successTitle}>Görev oluşturuldu!</Text>
      <Text style={styles.successSub}>Yapılacaklar listene eklendi.</Text>
      <Button onPress={() => router.push("/tasks")}>Göreve Git</Button>
      <Button variant="ghost" onPress={() => router.replace("/inbox")}>
        Inbox'a Dön
      </Button>
    </View>
  );
}

// ─── No-data view ─────────────────────────────────────────────────────────────

function NoDataView() {
  return (
    <View style={styles.centerRoot}>
      <StatusBar style="dark" />
      <Text style={styles.noDataTitle}>Analiz verisi bulunamadı.</Text>
      <Text style={styles.noDataSub}>
        Inbox ekranına dönüp tekrar "AI ile Analiz Et" butonuna bas.
      </Text>
      <Button onPress={() => router.replace("/inbox")}>Inbox'a Dön</Button>
    </View>
  );
}

// ─── Form — data is AIAnalysisResult (never undefined here) ──────────────────

function AIPreviewForm({ data, onDone }: { data: AIAnalysisResult; onDone: () => void }) {
  const [title,       setTitle]       = useState(data.title);
  const [description, setDescription] = useState(data.description ?? "");
  const [deadline,    setDeadline]    = useState(data.deadline ?? "");
  const [priority,    setPriority]    = useState<Priority>(data.priority);
  const [status,      setStatus]      = useState<TaskStatus>(data.status);
  const [subtasks,    setSubtasks]    = useState<string[]>(data.subtasks ?? []);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const confidence       = data.confidence ?? 0;
  const deadlineLabel    = formatDeadline(data.deadline);
  const confColor        = confidenceColor(confidence);

  function updateSubtask(i: number, val: string) {
    setSubtasks((prev) => prev.map((s, idx) => (idx === i ? val : s)));
  }

  function removeSubtask(i: number) {
    setSubtasks((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) { setError("Başlık boş olamaz."); return; }
    if (trimmedTitle.length < 3) { setError("Başlık en az 3 karakter olmalı."); return; }
    setError("");
    setLoading(true);

    if (__DEV__) {
      console.log("[AIPreview] createTaskDraft payload:", {
        title: trimmedTitle, description: description.trim() || null,
        deadline: deadline.trim() || null, priority, status,
        confidence, subtasks_json: subtasks.filter((s) => s.trim()),
      });
    }

    const draft = await createTaskDraft({
      title:       trimmedTitle,
      description: description.trim() || null,
      deadline:    deadline.trim()    || null,
      priority,
      status,
      confidence,
      subtasks_json: subtasks.filter((s) => s.trim()),
      analysis_json: {
        source:        "mobile_ai_preview",
        cache_hit:     data.cache_hit     ?? false,
        used_fallback: data.used_fallback ?? false,
      },
    });

    if (!draft) {
      setLoading(false);
      setError("Görev taslağı oluşturulamadı. Lütfen tekrar dene.");
      return;
    }

    const task = await convertTaskDraftToTask(draft.id);
    setLoading(false);

    if (!task) {
      setError("Görev kaydedilemedi. Lütfen tekrar dene.");
      return;
    }

    onDone();
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>AI ANALİZİ</Text>
        <Text style={styles.pageTitle}>AI bunu şöyle anladı</Text>
        <Text style={styles.pageSubtitle}>
          Kontrol et, gerekirse düzenle. Onayladıktan sonra görev oluşturulacak.
        </Text>

        {/* Banners */}
        {data.used_fallback ? (
          <View style={[styles.banner, styles.bannerWarn]}>
            <Text style={styles.bannerText}>
              ⚠️  Kural tabanlı analiz kullanıldı — AI bağlantısı kurulamadı. Başlık ve tarihi kontrol et.
            </Text>
          </View>
        ) : null}
        {data.cache_hit && !data.used_fallback ? (
          <View style={[styles.banner, styles.bannerInfo]}>
            <Text style={styles.bannerText}>
              ℹ️  Bu metin daha önce analiz edilmişti. Kayıtlı sonuç gösteriliyor.
            </Text>
          </View>
        ) : null}

        {/* Confidence */}
        <Card style={styles.confidenceCard}>
          <View style={styles.confRow}>
            <Text style={styles.confLabel}>AI güveni</Text>
            <Text style={[styles.confValue, { color: confColor }]}>%{confidence}</Text>
          </View>
          <View style={styles.confBarBg}>
            <View style={[styles.confBarFill, { width: `${confidence}%` as any, backgroundColor: confColor }]} />
          </View>
          {data.confidence_label ? (
            <Text style={styles.confLabelSmall}>{data.confidence_label}</Text>
          ) : null}
        </Card>

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Görev başlığı *</Text>
          <TextInput value={title} onChangeText={setTitle} style={styles.input}
            placeholderTextColor="rgba(93,84,145,0.4)" placeholder="Görev başlığı..." />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Açıklama</Text>
          <TextInput value={description} onChangeText={setDescription}
            style={[styles.input, styles.textarea]} multiline textAlignVertical="top"
            placeholderTextColor="rgba(93,84,145,0.4)" placeholder="Açıklama (opsiyonel)..." />
        </View>

        {/* Project hint */}
        {data.project_hint ? (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Proje önerisi</Text>
            <View style={styles.hintBox}>
              <Text style={styles.hintText}>{data.project_hint}</Text>
            </View>
          </View>
        ) : null}

        {/* Deadline */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Son tarih</Text>
          {deadlineLabel ? <Text style={styles.deadlineDisplay}>{deadlineLabel}</Text> : null}
          <TextInput value={deadline} onChangeText={setDeadline} style={styles.input}
            placeholderTextColor="rgba(93,84,145,0.4)"
            placeholder="ör. 2026-07-04T18:00:00  (boş bırakılabilir)"
            autoCapitalize="none" autoCorrect={false} />
        </View>

        {/* Priority */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Öncelik</Text>
          <View style={styles.pillRow}>
            {PRIORITY_OPTIONS.map((p) => (
              <Pressable key={p.value} onPress={() => setPriority(p.value)}
                style={[styles.pill, { backgroundColor: p.bg }, priority === p.value && styles.pillActive]}>
                <Text style={[styles.pillText, !p.dark && { color: "#fff" }]}>{p.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Status */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Durum</Text>
          <View style={styles.pillRow}>
            {STATUS_OPTIONS.map((s) => (
              <Pressable key={s.value} onPress={() => setStatus(s.value)}
                style={[styles.pill, styles.statusPill, status === s.value && styles.statusPillActive]}>
                <Text style={[styles.pillText, status === s.value && { color: "#fff" }]}>{s.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Subtasks */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Alt görevler</Text>
          {subtasks.length === 0 ? (
            <Text style={styles.emptyHint}>AI alt görev önermedi. İstersen ekleyebilirsin.</Text>
          ) : null}
          {subtasks.map((s, i) => (
            <View key={i} style={styles.subtaskRow}>
              <TextInput value={s} onChangeText={(v) => updateSubtask(i, v)}
                style={[styles.input, styles.subtaskInput]}
                placeholderTextColor="rgba(93,84,145,0.4)" placeholder="Alt görev..." />
              <Pressable onPress={() => removeSubtask(i)} style={styles.removeBtn}>
                <Text style={styles.removeBtnText}>×</Text>
              </Pressable>
            </View>
          ))}
          <Button variant="ghost" onPress={() => setSubtasks((prev) => [...prev, ""])}>
            + Madde Ekle
          </Button>
        </View>

        {/* Source summary */}
        {data.source_summary ? (
          <Card style={styles.sourceCard}>
            <Text style={styles.sourceLabel}>AI özeti</Text>
            <Text style={styles.sourceText}>{data.source_summary}</Text>
          </Card>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Button onPress={save} disabled={loading}>
          {loading ? "Kaydediliyor..." : "Görev Olarak Kaydet"}
        </Button>
        <View style={styles.bottomRow}>
          <View style={styles.bottomBtn}>
            <Button variant="ghost" onPress={() => router.back()} disabled={loading}>
              Tekrar Analiz Et
            </Button>
          </View>
          <View style={styles.bottomBtn}>
            <Button variant="ghost" onPress={() => { clearAIPreview(); router.replace("/inbox"); }} disabled={loading}>
              Vazgeç
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Screen shell ─────────────────────────────────────────────────────────────

export default function AIPreviewScreen() {
  const [done, setDone] = useState(false);
  const preview = getAIPreview();

  if (__DEV__) {
    console.log("[AIPreview] store içeriği:", JSON.stringify(preview?.data, null, 2));
  }

  // done önce kontrol edilmeli — clearAIPreview() store'u temizler, done=true kalır
  if (done) return <SuccessView />;
  if (!preview?.data) return <NoDataView />;

  return (
    <AIPreviewForm
      data={preview.data}
      onDone={() => { clearAIPreview(); setDone(true); }}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.lilac },

  centerRoot: { flex: 1, backgroundColor: colors.lilac, justifyContent: "center", alignItems: "center", padding: 24, gap: 16 },
  noDataTitle: { color: colors.purple, fontSize: 20, fontWeight: "900", textAlign: "center" },
  noDataSub:   { color: colors.muted,  fontSize: 14, fontWeight: "700", textAlign: "center", lineHeight: 20 },

  successRoot:      { flex: 1, backgroundColor: colors.lilac, justifyContent: "center", alignItems: "center", padding: 24, gap: 16 },
  successCheck:     { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.neon, justifyContent: "center", alignItems: "center" },
  successCheckText: { fontSize: 32, color: colors.purple, fontWeight: "900" },
  successTitle:     { color: colors.purple, fontSize: 24, fontWeight: "900", textAlign: "center" },
  successSub:       { color: colors.muted, fontWeight: "700", textAlign: "center", lineHeight: 22, marginBottom: 8 },

  content:      { padding: 20, paddingTop: 56, gap: 16 },
  eyebrow:      { color: colors.muted, fontSize: 11, fontWeight: "900", letterSpacing: 1.6, textTransform: "uppercase" },
  pageTitle:    { color: colors.purple, fontSize: 28, fontWeight: "900", lineHeight: 34 },
  pageSubtitle: { color: colors.muted,  fontSize: 14, fontWeight: "700", lineHeight: 20 },

  banner:     { borderRadius: 14, padding: 12 },
  bannerWarn: { backgroundColor: "rgba(255,210,48,0.5)" },
  bannerInfo: { backgroundColor: "rgba(225,251,98,0.4)" },
  bannerText: { color: colors.purple, fontWeight: "700", fontSize: 13, lineHeight: 18 },

  confidenceCard: { gap: 8, backgroundColor: "rgba(255,255,255,0.55)" },
  confRow:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  confLabel:      { color: colors.purple, fontWeight: "800", fontSize: 14 },
  confValue:      { fontSize: 22, fontWeight: "900" },
  confBarBg:      { height: 8, backgroundColor: "rgba(93,84,145,0.12)", borderRadius: 4, overflow: "hidden" },
  confBarFill:    { height: 8, borderRadius: 4 },
  confLabelSmall: { color: colors.muted, fontSize: 12, fontWeight: "700" },

  field:      { gap: 8 },
  fieldLabel: { color: colors.purple, fontWeight: "900", fontSize: 15 },
  input: {
    backgroundColor: "rgba(255,255,255,0.78)",
    borderColor: "rgba(93,84,145,0.15)", borderWidth: 1, borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 12,
    color: colors.purple, fontWeight: "700", fontSize: 15,
  },
  textarea:        { minHeight: 90, maxHeight: 140 },
  hintBox:         { backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 14, padding: 12 },
  hintText:        { color: colors.muted, fontWeight: "700", fontSize: 14 },
  deadlineDisplay: { color: colors.purple, fontWeight: "900", fontSize: 15 },

  pillRow:          { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill:             { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 2, borderColor: "transparent" },
  pillActive:       { borderColor: colors.purple },
  pillText:         { color: colors.purple, fontWeight: "800", fontSize: 13 },
  statusPill:       { backgroundColor: "rgba(255,255,255,0.6)" },
  statusPillActive: { backgroundColor: colors.purple },

  subtaskRow:    { flexDirection: "row", gap: 8, alignItems: "center" },
  subtaskInput:  { flex: 1 },
  removeBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,210,48,0.6)", justifyContent: "center", alignItems: "center" },
  removeBtnText: { color: colors.purple, fontSize: 20, fontWeight: "900", lineHeight: 22 },
  emptyHint:     { color: colors.muted, fontWeight: "700", fontSize: 13 },

  sourceCard:  { gap: 6, backgroundColor: "rgba(255,255,255,0.5)" },
  sourceLabel: { color: colors.muted, fontSize: 12, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.2 },
  sourceText:  { color: colors.purple, fontWeight: "700", fontSize: 14, lineHeight: 20 },

  errorText: {
    color: colors.purple, backgroundColor: "rgba(255,210,48,0.5)",
    borderRadius: 14, padding: 12, fontWeight: "800", fontSize: 14,
  },
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(210,199,255,0.97)",
    borderTopColor: "rgba(93,84,145,0.12)", borderTopWidth: 1,
    padding: 16, paddingBottom: 28, gap: 10,
  },
  bottomRow: { flexDirection: "row", gap: 10 },
  bottomBtn: { flex: 1 },
});
