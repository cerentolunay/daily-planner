"use client";

import { useState } from "react";
import { createTask } from "../lib/api";
import { recordActivity } from "../lib/local-storage";
import { Button, Input } from "./ui";

export function QuickAddTask() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function saveTask() {
    setError("");
    setMessage("");
    if (title.trim().length < 3) {
      setError("Görev başlığı en az 3 karakter olmalıdır.");
      return;
    }

    setIsSaving(true);
    const saved = await createTask({
      title: title.trim(),
      priority: "medium",
      status: "todo",
      source_type: "quick_add",
    });
    setIsSaving(false);

    if (!saved) {
      setError("Görev kaydedilemedi. Oturumunu ve backend bağlantısını kontrol et.");
      return;
    }

    setTitle("");
    setMessage("Görev kaydedildi.");
    recordActivity("task_created", `${saved.title} hızlı eklendi`);
  }

  return (
    <div className="rounded-[30px] border border-yellow/70 bg-yellow/35 p-5 text-purple shadow-[0_14px_28px_rgba(255,210,48,0.18)]">
      <p className="text-sm font-black">Hızlı Ekle</p>
      <div className="mt-4 space-y-3">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Yeni görev başlığı" />
        {error ? <p className="rounded-2xl bg-white/70 p-3 text-xs font-bold text-purple">{error}</p> : null}
        {message ? <p className="rounded-2xl bg-neon/55 p-3 text-xs font-bold text-purple">{message}</p> : null}
        <Button className="w-full" onClick={saveTask} disabled={isSaving}>
          {isSaving ? "Kaydediliyor" : "Görev Ekle"}
        </Button>
      </div>
    </div>
  );
}
