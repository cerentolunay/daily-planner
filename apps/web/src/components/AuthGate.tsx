"use client";

import { useEffect, useState } from "react";
import {
  clearAuthToken,
  forgotPassword,
  getAuthToken,
  getCurrentUser,
  loginUser,
  registerUser,
  resendVerification,
  resetPassword,
  setAuthTokens,
  verifyEmail,
  type ApiUser,
} from "../lib/api";
import { Button, Card, Input } from "./ui";

type Mode = "login" | "register" | "verify" | "forgot" | "reset";

export function AuthGate({ children }: { children: React.ReactNode }) {
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
    async function restoreSession() {
      if (!getAuthToken()) {
        setIsLoading(false);
        return;
      }
      const currentUser = await getCurrentUser();
      if (!currentUser) clearAuthToken();
      setUser(currentUser);
      setIsLoading(false);
    }

    restoreSession();
  }, []);

  function resetFeedback() {
    setError("");
    setMessage("");
  }

  function switchMode(nextMode: Mode) {
    resetFeedback();
    setMode(nextMode);
  }

  async function submit() {
    resetFeedback();
    if (!email.trim()) {
      setError("E-posta zorunludur.");
      return;
    }
    setIsSubmitting(true);

    if (mode === "register") {
      if (name.trim().length < 2 || password.length < 8) {
        setError("Ad en az 2, şifre en az 8 karakter olmalıdır.");
        setIsSubmitting(false);
        return;
      }
      const result = await registerUser({ name: name.trim(), email: email.trim(), password });
      setIsSubmitting(false);
      if (!result.data) {
        setError(result.error || "Kayıt başlatılamadı.");
        return;
      }
      setMessage(result.data.detail);
      setMode("verify");
      return;
    }

    if (mode === "verify") {
      const result = await verifyEmail({ email: email.trim(), code });
      setIsSubmitting(false);
      if (!result.data) {
        setError(result.error || "Kod doğrulanamadı.");
        return;
      }
      setMessage(result.data.detail);
      setMode("login");
      return;
    }

    if (mode === "forgot") {
      const result = await forgotPassword(email.trim());
      setIsSubmitting(false);
      if (!result.data) {
        setError(result.error || "Kod gönderilemedi.");
        return;
      }
      setMessage(result.data.detail);
      setMode("reset");
      return;
    }

    if (mode === "reset") {
      const result = await resetPassword({ email: email.trim(), code, new_password: newPassword });
      setIsSubmitting(false);
      if (!result.data) {
        setError(result.error || "Şifre güncellenemedi.");
        return;
      }
      setMessage(result.data.detail);
      setMode("login");
      return;
    }

    if (!password.trim()) {
      setError("Şifre zorunludur.");
      setIsSubmitting(false);
      return;
    }
    const result = await loginUser({ email: email.trim(), password });
    setIsSubmitting(false);
    if (!result.data) {
      setError(result.error || "Oturum açılamadı.");
      return;
    }
    setAuthTokens(result.data.access_token, result.data.refresh_token);
    setUser(result.data.user);
  }

  async function resendCode() {
    resetFeedback();
    if (!email.trim()) {
      setError("E-posta zorunludur.");
      return;
    }
    const result = await resendVerification(email.trim());
    if (!result.data) {
      setError(result.error || "Kod gönderilemedi.");
      return;
    }
    setMessage(result.data.detail);
  }

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-lilac p-6 text-purple">
        <div className="rounded-3xl bg-white/75 px-6 py-4 text-sm font-black shadow-glow">Oturum kontrol ediliyor...</div>
      </div>
    );
  }

  if (!user) {
    const title =
      mode === "register" ? "Kayıt Ol" : mode === "verify" ? "E-posta Kodunu Doğrula" : mode === "forgot" ? "Şifremi Unuttum" : mode === "reset" ? "Yeni Şifre Belirle" : "Giriş Yap";

    return (
      <main className="grid min-h-screen place-items-center bg-lilac p-4 text-purple">
        <Card className="w-full max-w-[540px] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow text-xl font-black">D</div>
            <div>
              <p className="text-2xl font-black">DailyPlanner</p>
              <p className="text-sm font-bold text-purple/62">{title}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-lilac/65 p-2">
            <button onClick={() => switchMode("login")} className={`rounded-xl px-4 py-3 text-sm font-black ${mode === "login" ? "bg-yellow" : "bg-white/55"}`}>
              Giriş
            </button>
            <button onClick={() => switchMode("register")} className={`rounded-xl px-4 py-3 text-sm font-black ${mode === "register" ? "bg-yellow" : "bg-white/55"}`}>
              Kayıt
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {mode === "register" ? <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ad" /> : null}
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-posta" />
            {mode === "login" || mode === "register" ? <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifre" /> : null}
            {mode === "verify" || mode === "reset" ? <Input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6 haneli kod" inputMode="numeric" /> : null}
            {mode === "reset" ? <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Yeni şifre" /> : null}
            {error ? <p className="rounded-2xl bg-yellow/50 p-3 text-sm font-bold text-purple">{error}</p> : null}
            {message ? <p className="rounded-2xl bg-neon/55 p-3 text-sm font-bold text-purple">{message}</p> : null}
            <Button className="w-full" onClick={submit} disabled={isSubmitting}>
              {isSubmitting ? "İşleniyor..." : title}
            </Button>
            {mode === "verify" ? <Button className="w-full" variant="ghost" onClick={resendCode}>Kodu Yeniden Gönder</Button> : null}
            {mode === "login" ? (
              <button onClick={() => switchMode("forgot")} className="w-full text-center text-sm font-black text-purple/70">
                Şifremi unuttum
              </button>
            ) : null}
            <p className="text-center text-xs font-bold leading-5 text-purple/58">
              Kodlar 10 dakika geçerlidir. Aynı e-postaya 60 saniyede bir yeni kod gönderilebilir.
            </p>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-50 hidden rounded-2xl bg-white/80 px-3 py-2 text-xs font-black text-purple shadow-glow md:flex md:items-center md:gap-3">
        {user.name}
        <button
          onClick={() => {
            clearAuthToken();
            setUser(null);
          }}
          className="rounded-xl bg-purple px-3 py-2 text-white"
        >
          Çıkış
        </button>
      </div>
      {children}
    </>
  );
}
