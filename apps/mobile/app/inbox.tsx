import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { colors } from "../src/constants/colors";
import { InboxItemCard } from "../src/components/InboxItemCard";
import { MobileShell } from "../src/components/MobileShell";
import { Button, Card, EmptyState, Textarea } from "../src/components/ui";
import { analyzeText, createInboxItem, getInboxItems } from "../src/lib/api";
import { setLastCaptureText } from "../src/lib/storage";
import { setAIPreview } from "../src/lib/aiPreviewStore";
import { ApiInboxItem } from "../src/types";

function sourceFromParam(value?: string): "whatsapp" | "android_share" | "manual" {
  if (value === "android_share" || value === "whatsapp") return value;
  return "manual";
}

export default function InboxScreen() {
  const params = useLocalSearchParams<{ text?: string; source?: string }>();
  const sharedText = typeof params.text === "string" ? params.text : "";
  const sharedSource = sourceFromParam(typeof params.source === "string" ? params.source : undefined);

  const [rawText, setRawText] = useState(sharedText);
  const [items, setItems] = useState<ApiInboxItem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getInboxItems().then(setItems);
  }, []);

  useEffect(() => {
    if (sharedText) {
      setRawText(sharedText);
      setMessage("Paylaşılan metin hazır. Düzenleyip analiz edebilirsin.");
    }
  }, [sharedText]);

  async function saveToInbox() {
    const text = rawText.trim();
    if (!text) {
      setMessage("Önce bir mesaj yapıştırmalısın.");
      return;
    }
    setLoading(true);
    setMessage("");
    const item = await createInboxItem({
      source_type: sharedText ? sharedSource : "manual",
      content_type: "text",
      raw_text: text,
      title: "Mobil capture",
      metadata_json: { platform: "mobile", capture_method: "manual_paste" },
    });
    setLoading(false);
    if (!item) {
      setMessage("Kaydedilemedi. İnternet bağlantını veya oturum durumunu kontrol et.");
      return;
    }
    setRawText("");
    setMessage("Inbox'a kaydedildi.");
    getInboxItems().then(setItems);
  }

  async function analyzeWithAI() {
    const text = rawText.trim();
    if (!text) {
      setMessage("Önce bir mesaj yapıştırmalısın.");
      return;
    }
    setLoading(true);
    setMessage("AI mesajı analiz ediyor...");
    await setLastCaptureText(text);

    const result = await analyzeText(text);
    setLoading(false);

    if (!result) {
      setMessage("Sunucuya ulaşılamıyor. İnternet bağlantını kontrol et veya uygulamayı yeniden başlat.");
      return;
    }

    setAIPreview(result, text);

    try {
      router.push("/ai-preview");
    } catch (err) {
      if (__DEV__) console.error("[Inbox] router.push ai-preview hatası:", err);
      setMessage("AI analizi tamamlandı fakat önizleme açılamadı. Uygulamayı yeniden başlat.");
    }
  }

  async function analyzeItemWithAI(rawItemText: string) {
    setLoading(true);
    setMessage("AI analiz ediyor...");
    const result = await analyzeText(rawItemText);
    setLoading(false);
    if (!result) {
      setMessage("AI analizi başarısız oldu.");
      return;
    }
    setAIPreview(result, rawItemText);
    try {
      router.push("/ai-preview");
    } catch (err) {
      if (__DEV__) console.error("[Inbox] router.push ai-preview hatası:", err);
      setMessage("Önizleme açılamadı.");
    }
  }

  return (
    <MobileShell title="Inbox" eyebrow="Capture">
      <Card style={styles.captureCard}>
        <Text style={styles.helper}>
          WhatsApp, e-posta veya notlardan gelen işleri buraya bırak.
        </Text>
        <Textarea
          value={rawText}
          onChangeText={setRawText}
          placeholder="WhatsApp mesajını veya notunu buraya yapıştır..."
        />
        <View style={styles.buttonRow}>
          <View style={styles.buttonFlex}>
            <Button variant="ghost" onPress={saveToInbox} disabled={loading}>
              Inbox'a Kaydet
            </Button>
          </View>
          <View style={styles.buttonFlex}>
            <Button onPress={analyzeWithAI} disabled={loading}>
              {loading ? "Analiz ediliyor..." : "AI ile Analiz Et"}
            </Button>
          </View>
        </View>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </Card>

      <View style={{ gap: 12 }}>
        <Text style={styles.sectionTitle}>Bekleyenler</Text>
        {items.length ? (
          items.map((item) => (
            <InboxItemCard
              key={item.id}
              item={item}
              selected={false}
              onToggle={() => {}}
              onAnalyze={() => analyzeItemWithAI(item.raw_text)}
            />
          ))
        ) : (
          <EmptyState
            title="Gelen kutun boş"
            text="WhatsApp, e-posta veya notlardan gelen işleri buraya bırakabilirsin."
          />
        )}
      </View>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  captureCard: {
    gap: 12,
    borderColor: "rgba(255,210,48,0.6)",
  },
  helper: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  buttonFlex: {
    flex: 1,
  },
  message: {
    color: colors.purple,
    backgroundColor: "rgba(225,251,98,0.45)",
    padding: 12,
    borderRadius: 14,
    fontWeight: "700",
    fontSize: 14,
  },
  sectionTitle: {
    color: colors.purple,
    fontSize: 18,
    fontWeight: "900",
  },
});
