"use client";

import { useState } from "react";
import { ApiTask, createTask } from "../lib/api";
import { Button, Input, Textarea } from "./ui";

type ExtractedTask = {
  title: string;
  deadline: string;
  project: string;
  priority: ApiTask["priority"];
  status: ApiTask["status"];
};

const emptyExtracted: ExtractedTask = {
  title: "",
  deadline: "",
  project: "Cyber-Quanta",
  priority: "medium",
  status: "todo",
};

function toDateTimeInput(keyword: "today" | "tomorrow") {
  const date = new Date();
  if (keyword === "tomorrow") date.setDate(date.getDate() + 1);
  date.setHours(17, 0, 0, 0);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function mockExtract(rawText: string): ExtractedTask {
  const lower = rawText.toLocaleLowerCase("tr-TR");
  return {
    title: rawText.split(/[.?]/)[0]?.replace(/^abi\s+/i, "").trim() || "Yeni görev",
    deadline: lower.includes("yarın") ? toDateTimeInput("tomorrow") : lower.includes("bugün") ? toDateTimeInput("today") : "",
    project: lower.includes("codesight") ? "Cyber-Quanta" : "Genel",
    priority: lower.includes("acil") ? "urgent" : lower.includes("önemli") ? "high" : "medium",
    status: lower.includes("beklemede") ? "waiting" : "todo",
  };
}

export function InboxComposer() {
  const [rawText, setRawText] = useState("Abi bugün Codesight sunumunu hazırlar mısın?");
  const [extracted, setExtracted] = useState<ExtractedTask>(emptyExtracted);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleExtract() {
    setError("");
    setMessage("");
    if (!rawText.trim()) {
      setError("Mesaj alanı boş olamaz.");
      return;
    }
    setExtracted(mockExtract(rawText));
  }

  async function saveAsTask() {
    setError("");
    setMessage("");

    if (!extracted.title.trim()) {
      setError("Başlık zorunludur.");
      return;
    }

    setIsSaving(true);
    const saved = await createTask({
      title: extracted.title.trim(),
      description: rawText,
      deadline: extracted.deadline ? new Date(extracted.deadline).toISOString() : null,
      priority: extracted.priority,
      status: extracted.status,
      source_type: "whatsapp_paste",
      source_text: rawText,
    });
    setIsSaving(false);

    if (!saved) {
      setError("Görev kaydedilemedi.");
      return;
    }

    setMessage("Görev başarıyla oluşturuldu.");
    setRawText("");
    setExtracted(emptyExtracted);
  }

  return (
    <>
      <label className="block text-sm font-semibold text-purple">WhatsApp mesajını yapıştır</label>
      <div className="mt-3">
        <Textarea
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          placeholder="Abi bugün Codesight sunumunu hazırlar mısın?"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" onClick={handleExtract} disabled={!rawText.trim()}>
          Göreve Dönüştür
        </Button>
        <Button type="button" variant="ghost" onClick={() => setRawText("")}>
          Temizle
        </Button>
      </div>

      <div className="mt-5 space-y-3 rounded-3xl bg-lilac/45 p-4">
        <Input value={extracted.title} onChange={(event) => setExtracted({ ...extracted, title: event.target.value })} placeholder="Algılanan başlık" />
        <Input value={extracted.project} onChange={(event) => setExtracted({ ...extracted, project: event.target.value })} placeholder="Proje" />
        <Input type="datetime-local" value={extracted.deadline} onChange={(event) => setExtracted({ ...extracted, deadline: event.target.value })} />
        <select value={extracted.priority} onChange={(event) => setExtracted({ ...extracted, priority: event.target.value as ApiTask["priority"] })} className="w-full rounded-2xl border border-purple/18 bg-white/75 px-4 py-3 text-sm text-purple outline-none">
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
          <option value="urgent">Acil</option>
        </select>
        <select value={extracted.status} onChange={(event) => setExtracted({ ...extracted, status: event.target.value as ApiTask["status"] })} className="w-full rounded-2xl border border-purple/18 bg-white/75 px-4 py-3 text-sm text-purple outline-none">
          <option value="todo">Yapılacak</option>
          <option value="in_progress">Devam Ediyor</option>
          <option value="waiting">Beklemede</option>
          <option value="done">Tamamlandı</option>
        </select>
        <Button className="w-full" onClick={saveAsTask} disabled={isSaving || !extracted.title.trim()}>
          {isSaving ? "Kaydediliyor" : "Görev Olarak Kaydet"}
        </Button>
      </div>

      {error ? <p className="mt-3 rounded-2xl bg-yellow/45 p-3 text-sm font-bold text-purple">{error}</p> : null}
      {message ? <p className="mt-3 rounded-2xl bg-neon/55 p-3 text-sm font-bold text-purple">{message}</p> : null}
    </>
  );
}
