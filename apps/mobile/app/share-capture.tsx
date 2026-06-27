import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "../src/constants/colors";
import { MobileShell } from "../src/components/MobileShell";
import { Button, Card, Textarea } from "../src/components/ui";
import { saveSharedCapture } from "../src/components/CaptureComposer";
import { analyzeText } from "../src/lib/api";

export default function ShareCaptureScreen() {
  const params = useLocalSearchParams<{ text?: string; url?: string; mode?: string }>();
  const initial = params.text || params.url || (params.mode === "url" ? "https://example.com" : "Abi cuma gününe kadar Codesight sunumunu hazırlar mısın?");
  const [content, setContent] = useState(String(initial));
  const [message, setMessage] = useState("");

  async function save() {
    await saveSharedCapture(content);
    setMessage("Paylaşılan içerik Inbox’a kaydedildi. Backend yoksa kuyruğa alındı.");
  }

  async function analyze() {
    await analyzeText(content);
    setMessage("AI analizi backend üzerinden denendi. TaskDraft için Inbox akışını kullanabilirsin.");
  }

  return (
    <MobileShell title="Paylaşılan İçerik" eyebrow="Share Capture">
      <Card style={{ gap: 12 }}>
        <Text style={styles.label}>Kaynak: WhatsApp / Diğer</Text>
        <Textarea value={content} onChangeText={setContent} placeholder="Paylaşılan metin veya link" />
        <Button onPress={save}>Inbox’a Kaydet</Button>
        <Button variant="secondary" onPress={analyze}>AI ile Analiz Et</Button>
        <Button variant="ghost" onPress={() => router.back()}>Vazgeç</Button>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </Card>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.muted,
    fontWeight: "900",
  },
  message: {
    color: colors.purple,
    backgroundColor: "rgba(225,251,98,0.45)",
    borderRadius: 14,
    padding: 10,
    fontWeight: "900",
  },
});
