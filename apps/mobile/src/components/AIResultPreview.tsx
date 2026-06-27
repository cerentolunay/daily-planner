import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { priorityLabels, statusLabels } from "../constants/labels";
import { ApiTaskDraft } from "../types";
import { convertTaskDraftToTask } from "../lib/api";
import { Button, Card, Input, Textarea } from "./ui";

export function AIResultPreview({
  draft,
  onChange,
  onConverted,
}: {
  draft: ApiTaskDraft | null;
  onChange: (draft: ApiTaskDraft) => void;
  onConverted?: () => void;
}) {
  if (!draft) {
    return (
      <Card>
        <Text style={styles.title}>AI bunu şöyle anladı</Text>
        <Text style={styles.text}>Bir inbox item analiz ettiğinde görev taslağı burada görünecek.</Text>
      </Card>
    );
  }

  async function convert() {
    await convertTaskDraftToTask(draft.id);
    onConverted?.();
  }

  return (
    <Card style={{ gap: 12 }}>
      <Text style={styles.title}>AI bunu şöyle anladı</Text>
      <Input value={draft.title} onChangeText={(title) => onChange({ ...draft, title })} placeholder="Başlık" />
      <Textarea value={draft.description || ""} onChangeText={(description) => onChange({ ...draft, description })} placeholder="Açıklama" />
      <Input value={draft.project_hint || ""} onChangeText={(project_hint) => onChange({ ...draft, project_hint })} placeholder="Proje" />
      <Text style={styles.badge}>Öncelik: {priorityLabels[draft.priority]} · Durum: {statusLabels[draft.status]}</Text>
      <Text style={styles.badge}>Confidence %{Math.round(draft.confidence)}</Text>
      {draft.analysis_json?.cache_hit ? <Text style={styles.notice}>Bu analiz daha önce yapılmıştı, kayıtlı sonuç gösteriliyor.</Text> : null}
      {draft.analysis_json?.used_fallback ? <Text style={styles.notice}>Gemini yerine hızlı kural tabanlı analiz kullanıldı.</Text> : null}
      <View style={styles.subtasks}>
        <Text style={styles.subTitle}>Yapılacaklar</Text>
        {(draft.subtasks_json || []).map((item, index) => (
          <Text key={`${item}-${index}`} style={styles.subtask}>• {item}</Text>
        ))}
      </View>
      <Button onPress={convert}>Görev Olarak Kaydet</Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: "900",
  },
  text: {
    marginTop: 8,
    color: colors.muted,
    fontWeight: "700",
  },
  badge: {
    color: colors.purple,
    backgroundColor: "rgba(225,251,98,0.45)",
    borderRadius: 14,
    padding: 10,
    fontWeight: "900",
  },
  notice: {
    color: colors.purple,
    backgroundColor: "rgba(255,210,48,0.42)",
    borderRadius: 14,
    padding: 10,
    fontWeight: "800",
  },
  subtasks: {
    backgroundColor: "rgba(210,199,255,0.45)",
    borderRadius: 18,
    padding: 12,
  },
  subTitle: {
    color: colors.purple,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtask: {
    color: colors.muted,
    fontWeight: "800",
    marginBottom: 6,
  },
});
