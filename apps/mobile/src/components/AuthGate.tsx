import { ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { forgotPassword, getCurrentUser, loginUser, registerUser, resendVerification, resetPassword, verifyEmail } from "../lib/api";
import { clearAuthTokens, getAccessToken, setAuthTokens, subscribeAuthChange } from "../lib/storage";
import { ApiUser } from "../types";
import { Button, Card, Input } from "./ui";

type Mode = "login" | "register" | "verify" | "forgot" | "reset";

export function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("Cerem");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function restore() {
      const token = await getAccessToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const currentUser = await getCurrentUser();
      if (!currentUser) await clearAuthTokens();
      setUser(currentUser);
      setIsLoading(false);
    }
    restore();
    return subscribeAuthChange(restore);
  }, []);

  function feedback(messageText = "", errorText = "") {
    setMessage(messageText);
    setError(errorText);
  }

  async function submit() {
    feedback();
    if (!email.trim()) {
      setError("E-posta zorunludur.");
      return;
    }
    setIsSubmitting(true);

    if (mode === "register") {
      const result = await registerUser({ name, email, password });
      setIsSubmitting(false);
      if (!result) return setError("Kayıt başlatılamadı.");
      setMessage(result.detail);
      setMode("verify");
      return;
    }

    if (mode === "verify") {
      const result = await verifyEmail({ email, code });
      setIsSubmitting(false);
      if (!result) return setError("Kod doğrulanamadı.");
      setMessage(result.detail);
      setMode("login");
      return;
    }

    if (mode === "forgot") {
      const result = await forgotPassword(email);
      setIsSubmitting(false);
      if (!result) return setError("Kod gönderilemedi.");
      setMessage(result.detail);
      setMode("reset");
      return;
    }

    if (mode === "reset") {
      const result = await resetPassword({ email, code, new_password: newPassword });
      setIsSubmitting(false);
      if (!result) return setError("Şifre güncellenemedi.");
      setMessage(result.detail);
      setMode("login");
      return;
    }

    const result = await loginUser({ email, password });
    setIsSubmitting(false);
    if (!result) return setError("Giriş yapılamadı. E-posta doğrulamasını kontrol et.");
    await setAuthTokens(result.access_token, result.refresh_token);
    setUser(result.user);
  }

  async function resendCode() {
    feedback();
    const result = await resendVerification(email);
    if (!result) return setError("Kod gönderilemedi.");
    setMessage(result.detail);
  }

  if (isLoading) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>Oturum kontrol ediliyor...</Text>
      </View>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  const title = mode === "register" ? "Kayıt Ol" : mode === "verify" ? "E-posta Kodunu Doğrula" : mode === "forgot" ? "Şifremi Unuttum" : mode === "reset" ? "Yeni Şifre Belirle" : "Giriş Yap";

  return (
    <View style={styles.root}>
      <Card style={styles.card}>
        <Text style={styles.logo}>DailyPlanner</Text>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.tabs}>
          <Button variant={mode === "login" ? "primary" : "ghost"} onPress={() => setMode("login")}>Giriş</Button>
          <Button variant={mode === "register" ? "primary" : "ghost"} onPress={() => setMode("register")}>Kayıt</Button>
        </View>
        {mode === "register" ? <Input value={name} onChangeText={setName} placeholder="Ad" /> : null}
        <Input value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="E-posta" />
        {mode === "login" || mode === "register" ? <Input value={password} onChangeText={setPassword} secureTextEntry placeholder="Şifre" /> : null}
        {mode === "verify" || mode === "reset" ? <Input value={code} onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))} keyboardType="number-pad" placeholder="6 haneli kod" /> : null}
        {mode === "reset" ? <Input value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="Yeni şifre" /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Button onPress={submit} disabled={isSubmitting}>{isSubmitting ? "İşleniyor..." : title}</Button>
        {mode === "verify" ? <Button variant="ghost" onPress={resendCode}>Kodu Yeniden Gönder</Button> : null}
        {mode === "login" ? <Button variant="ghost" onPress={() => setMode("forgot")}>Şifremi Unuttum</Button> : null}
        <Text style={styles.note}>Kodlar 10 dakika geçerlidir. Yeni kod için 60 saniye beklenir.</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.lilac,
    padding: 18,
  },
  card: {
    gap: 12,
  },
  logo: {
    color: colors.purple,
    fontSize: 28,
    fontWeight: "900",
  },
  title: {
    color: colors.purple,
    fontSize: 20,
    fontWeight: "900",
  },
  tabs: {
    flexDirection: "row",
    gap: 10,
  },
  error: {
    color: colors.purple,
    backgroundColor: "rgba(255,210,48,0.55)",
    borderRadius: 16,
    padding: 12,
    fontWeight: "800",
  },
  message: {
    color: colors.purple,
    backgroundColor: "rgba(225,251,98,0.55)",
    borderRadius: 16,
    padding: 12,
    fontWeight: "800",
  },
  note: {
    color: colors.muted,
    fontWeight: "700",
    textAlign: "center",
  },
});
