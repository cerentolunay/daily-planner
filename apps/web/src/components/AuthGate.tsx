"use client";

import { useEffect, useState } from "react";
import { clearAuthToken, getAuthToken, getCurrentUser, loginUser, registerUser, setAuthToken, type ApiUser } from "../lib/api";
import { Button, Card, Input } from "./ui";

type Mode = "login" | "register";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("Cerem");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function restoreSession() {
      if (!getAuthToken()) {
        setIsLoading(false);
        return;
      }
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        clearAuthToken();
      }
      setUser(currentUser);
      setIsLoading(false);
    }

    restoreSession();
  }, []);

  async function submit() {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("E-posta ve şifre zorunludur.");
      return;
    }
    if (mode === "register" && name.trim().length < 2) {
      setError("Ad en az 2 karakter olmalıdır.");
      return;
    }

    setIsSubmitting(true);
    const result =
      mode === "register"
        ? await registerUser({ name: name.trim(), email: email.trim(), password })
        : await loginUser({ email: email.trim(), password });
    setIsSubmitting(false);

    if (!result.data) {
      setError(result.error || "Oturum açılamadı.");
      return;
    }

    setAuthToken(result.data.access_token);
    setUser(result.data.user);
  }

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-lilac p-6 text-purple">
        <div className="rounded-3xl bg-white/75 px-6 py-4 text-sm font-black shadow-glow">Oturum kontrol ediliyor...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-lilac p-4 text-purple">
        <Card className="w-full max-w-[520px] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow text-xl font-black">D</div>
            <div>
              <p className="text-2xl font-black">DailyPlanner</p>
              <p className="text-sm font-bold text-purple/62">Gününü düzenlemek için giriş yap</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-lilac/65 p-2">
            <button onClick={() => setMode("login")} className={`rounded-xl px-4 py-3 text-sm font-black ${mode === "login" ? "bg-yellow" : "bg-white/55"}`}>
              Giriş
            </button>
            <button onClick={() => setMode("register")} className={`rounded-xl px-4 py-3 text-sm font-black ${mode === "register" ? "bg-yellow" : "bg-white/55"}`}>
              Kayıt
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {mode === "register" ? <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ad" /> : null}
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-posta" />
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifre" />
            {error ? <p className="rounded-2xl bg-yellow/50 p-3 text-sm font-bold text-purple">{error}</p> : null}
            <Button className="w-full" onClick={submit} disabled={isSubmitting}>
              {isSubmitting ? "İşleniyor..." : mode === "register" ? "Hesap Oluştur" : "Giriş Yap"}
            </Button>
            <p className="text-center text-xs font-bold leading-5 text-purple/58">
              Verilerin kullanıcı hesabına göre ayrılır; başka kullanıcıların görevleri görünmez.
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
