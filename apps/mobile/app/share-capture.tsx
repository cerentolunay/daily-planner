import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "../src/constants/colors";
import { MobileShell } from "../src/components/MobileShell";
import { Button, Card, Textarea } from "../src/components/ui";

export default function ShareCaptureScreen() {
  const params = useLocalSearchParams<{ text?: string; url?: string; mode?: string }>();
  const initial =
    params.text ||
    params.url ||
    (params.mode === "url" ? "https://example.com" : "Abi cuma gününe kadar Codesight sunumunu hazırlar mısın?");
  const [content, setContent] = useState(String(initial));

  useEffect(() => {
    if (params.text || params.url) {
      router.replace({
        pathname: "/inbox",
        params: {
          text: String(params.text || params.url || ""),
          source: "android_share",
        },
      });
    }
  }, [params.text, params.url]);

  function continueToInbox() {
    router.replace({
      pathname: "/inbox",
      params: {
        text: content,
        source: content.startsWith("http") ? "manual" : "android_share",
      },
    });
  }

  return (
    <MobileShell title="Paylaşılan İçerik" eyebrow="Share Capture">
      <Card style={{ gap: 12 }}>
        <Text style={styles.label}>Kaynak: WhatsApp / Diğer</Text>
        <Textarea value={content} onChangeText={setContent} placeholder="Paylaşılan metin veya link" />
        <Button onPress={continueToInbox}>Inbox Intake'a Devam Et</Button>
        <Button variant="ghost" onPress={() => router.back()}>Vazgeç</Button>
      </Card>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.muted,
    fontWeight: "900",
  },
});
