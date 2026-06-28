import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../src/constants/colors";
import { ANDROID_EMULATOR_BACKEND_URL } from "../src/lib/config";
import { clearAuthTokens, getBackendUrl, setBackendUrl } from "../src/lib/storage";
import { getTasks } from "../src/lib/api";
import { MobileShell } from "../src/components/MobileShell";
import { Button, Card, Input } from "../src/components/ui";

export default function SettingsScreen() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getBackendUrl().then(setUrl);
  }, []);

  async function save() {
    await setBackendUrl(url);
    setMessage("Backend URL kaydedildi.");
  }

  async function testConnection() {
    await setBackendUrl(url);
    const tasks = await getTasks();
    setMessage(`Backend bağlantısı denendi. ${tasks.length} görev okundu.`);
  }

  async function logout() {
    await clearAuthTokens();
    setMessage("Oturum kapatıldı.");
  }

  return (
    <MobileShell title="Ayarlar" eyebrow="Mobil">
      <Card style={{ gap: 12 }}>
        <Text style={styles.title}>Backend URL</Text>
        <Input value={url} onChangeText={setUrl} placeholder="http://10.0.2.2:8000" autoCapitalize="none" />
        <Button onPress={save}>Kaydet</Button>
        <Button variant="ghost" onPress={() => setUrl(ANDROID_EMULATOR_BACKEND_URL)}>Android Emulator URL Kullan</Button>
        <Button variant="secondary" onPress={testConnection}>Bağlantıyı Test Et</Button>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={styles.title}>AI Ayarları</Text>
        <Text style={styles.text}>AI key mobil uygulamada tutulmaz. Mobil sadece backend AI endpointlerini çağırır.</Text>
        <Text style={styles.badge}>Provider: Backend env</Text>
        <Text style={styles.badge}>Fallback: Backend guard layer</Text>
        <Text style={styles.badge}>Cache: Backend cache</Text>
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={styles.title}>Mobil Capture</Text>
        <Text style={styles.text}>Görsel yakala, ses kaydı ve dosya ekleme sonraki sürümlerde eklenecek.</Text>
        <Text style={styles.badge}>Bildirimler: Yakında</Text>
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={styles.title}>Oturum</Text>
        <Text style={styles.text}>Access token süresi dolarsa mobile app refresh token ile oturumu yeniler.</Text>
        <Button variant="secondary" onPress={logout}>Çıkış Yap</Button>
      </Card>
    </MobileShell>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: "900",
  },
  text: {
    color: colors.muted,
    fontWeight: "800",
    lineHeight: 20,
  },
  badge: {
    color: colors.purple,
    backgroundColor: "rgba(225,251,98,0.45)",
    borderRadius: 14,
    padding: 10,
    fontWeight: "900",
  },
  message: {
    color: colors.purple,
    fontWeight: "900",
  },
});
