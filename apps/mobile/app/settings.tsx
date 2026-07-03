import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../src/constants/colors";
import { ANDROID_EMULATOR_BACKEND_URL } from "../src/lib/config";
import { clearAuthTokens, getBackendUrl, setBackendUrl } from "../src/lib/storage";
import { healthCheck } from "../src/lib/api";
import { MobileShell } from "../src/components/MobileShell";
import { Button, Card, Input } from "../src/components/ui";

export default function SettingsScreen() {
  const [status, setStatus] = useState<"idle" | "checking" | "ok" | "fail">("idle");
  const [debugUrl, setDebugUrl] = useState("");
  const [urlSaved, setUrlSaved] = useState(false);

  useEffect(() => {
    if (__DEV__) getBackendUrl().then(setDebugUrl);
  }, []);

  async function testConnection() {
    setStatus("checking");
    const ok = await healthCheck();
    setStatus(ok ? "ok" : "fail");
  }

  async function saveDebugUrl() {
    await setBackendUrl(debugUrl);
    setUrlSaved(true);
    setTimeout(() => setUrlSaved(false), 2000);
  }

  async function logout() {
    await clearAuthTokens();
  }

  const statusLabel =
    status === "checking"
      ? "Kontrol ediliyor..."
      : status === "ok"
      ? "Backend bağlantısı başarılı."
      : status === "fail"
      ? "Sunucuya ulaşılamıyor."
      : "";

  return (
    <MobileShell title="Ayarlar" eyebrow="Hesap & Uygulama">
      <Card style={{ gap: 12 }}>
        <Text style={styles.title}>Bağlantı Durumu</Text>
        <Text style={styles.text}>
          Uygulamanın sunucuyla bağlantısını test edebilirsin.
        </Text>
        <Button variant="secondary" onPress={testConnection} disabled={status === "checking"}>
          Bağlantıyı Test Et
        </Button>
        {statusLabel ? (
          <Text style={[styles.statusText, status === "ok" ? styles.statusOk : status === "fail" ? styles.statusFail : styles.statusChecking]}>
            {statusLabel}
          </Text>
        ) : null}
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={styles.title}>AI Ayarları</Text>
        <Text style={styles.text}>
          AI key mobil uygulamada tutulmaz. Tüm AI işlemleri backend üzerinden yapılır.
        </Text>
        <Text style={styles.badge}>Sağlayıcı: Backend</Text>
        <Text style={styles.badge}>Fallback: Backend güvencesi</Text>
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={styles.title}>Oturum</Text>
        <Text style={styles.text}>
          Oturumunu kapatmak istersen aşağıdaki butonu kullanabilirsin.
        </Text>
        <Button variant="ghost" onPress={logout}>Çıkış Yap</Button>
      </Card>

      {__DEV__ ? (
        <Card style={{ gap: 12 }}>
          <Text style={styles.debugTitle}>🛠 Geliştirici — Backend URL</Text>
          <Text style={styles.debugHint}>
            Emülatör için: {ANDROID_EMULATOR_BACKEND_URL}{"\n"}
            Gerçek telefon için: http://BİLGİSAYAR_IP:8000
          </Text>
          <Input
            value={debugUrl}
            onChangeText={setDebugUrl}
            placeholder="http://10.0.2.2:8000"
            autoCapitalize="none"
          />
          <Button onPress={saveDebugUrl}>{urlSaved ? "Kaydedildi ✓" : "URL Kaydet"}</Button>
        </Card>
      ) : null}
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.purple,
    fontSize: 18,
    fontWeight: "900",
  },
  text: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    color: colors.purple,
    backgroundColor: "rgba(225,251,98,0.45)",
    borderRadius: 12,
    padding: 10,
    fontWeight: "800",
    fontSize: 13,
  },
  statusText: {
    fontWeight: "800",
    fontSize: 14,
    borderRadius: 12,
    padding: 10,
  },
  statusOk: {
    color: colors.purple,
    backgroundColor: "rgba(225,251,98,0.55)",
  },
  statusFail: {
    color: colors.purple,
    backgroundColor: "rgba(255,210,48,0.5)",
  },
  statusChecking: {
    color: colors.muted,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  debugTitle: {
    color: colors.purple,
    fontSize: 15,
    fontWeight: "900",
  },
  debugHint: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 20,
  },
});
