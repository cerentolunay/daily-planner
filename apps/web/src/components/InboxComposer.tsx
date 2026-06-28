"use client";

import { useState } from "react";
import { ApiTask, createTask } from "../lib/api";
import { recordActivity } from "../lib/local-storage";
import { Button, Input, Textarea } from "./ui";
import { Select } from "./ui/Select";

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

const priorityOptions = [
  { value: "low", label: "Düşük" },
  { value: "medium", label: "Orta" },
  { value: "high", label: "Yüksek" },
  { value: "urgent", label: "Acil" },
] satisfies Array<{ value: ApiTask["priority"]; label: string }>;

const statusOptions = [
  { value: "todo", label: "Yapılacak" },
  { value: "in_progress", label: "Devam Ediyor" },
  { value: "waiting", label: "Beklemede" },
  { value: "done", label: "Tamamlandı" },
] satisfies Array<{ value: ApiTask["status"]; label: string }>;

function toDateTimeInput(keyword: "today" | "tomorrow" | "week" | "next-week" | number) {
  const date = new Date();
  if (keyword === "tomorrow") date.setDate(date.getDate() + 1);
  if (keyword === "week") {
    const diff = (5 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + diff);
  }
  if (keyword === "next-week") date.setDate(date.getDate() + 7);
  if (typeof keyword === "number") {
    const diff = (keyword - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + diff);
  }
  date.setHours(17, 0, 0, 0);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function mockExtract(rawText: string): ExtractedTask {
  const lower = rawText.toLocaleLowerCase("tr-TR");
  const weekdayMap: Array<[string, number]> = [
    ["pazartesi", 1],
    ["salı", 2],
    ["çarşamba", 3],
    ["perşembe", 4],
    ["cuma", 5],
    ["cumartesi", 6],
    ["pazar", 0],
  ];
  const weekday = weekdayMap.find(([label]) => lower.includes(label));
  const project =
    lower.includes("heptapus") ? "Heptapus" :
    lower.includes("cyber-quanta") || lower.includes("cyber quanta") || lower.includes("codesight") ? "Cyber-Quanta" :
    lower.includes("üniversite") || lower.includes("okul") ? "Üniversite" :
    lower.includes("kişisel") ? "Kişisel" :
    "Genel";

  return {
    title: rawText.split(/[.?]/)[0]?.replace(/^abi\s+/i, "").trim() || "Yeni görev",
    deadline: lower.includes("yarın")
      ? toDateTimeInput("tomorrow")
      : lower.includes("bugün")
        ? toDateTimeInput("today")
        : lower.includes("bu hafta")
          ? toDateTimeInput("week")
          : lower.includes("haftaya")
            ? toDateTimeInput("next-week")
            : weekday
              ? toDateTimeInput(weekday[1])
              : "",
    project,
    priority: lower.includes("acil") || lower.includes("kritik")
      ? "urgent"
      : lower.includes("önemli")
        ? "high"
        : lower.includes("ufak") || lower.includes("basit") || lower.includes("sonra")
          ? "low"
          : "medium",
    status: lower.includes("beklemede")
      ? "waiting"
      : lower.includes("başladım") || lower.includes("devam ediyor")
        ? "in_progress"
        : lower.includes("bitti") || lower.includes("tamamlandı")
          ? "done"
          : "todo",
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
    recordActivity("inbox_converted", `${saved.title} inbox’tan göreve dönüştürüldü`);
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
        <Select value={extracted.priority} onChange={(priority) => setExtracted({ ...extracted, priority })} options={priorityOptions} />
        <Select value={extracted.status} onChange={(status) => setExtracted({ ...extracted, status })} options={statusOptions} />
        <Button className="w-full" onClick={saveAsTask} disabled={isSaving || !extracted.title.trim()}>
          {isSaving ? "Kaydediliyor" : "Görev Olarak Kaydet"}
        </Button>
      </div>

      {error ? <p className="mt-3 rounded-2xl bg-yellow/45 p-3 text-sm font-bold text-purple">{error}</p> : null}
      {message ? <p className="mt-3 rounded-2xl bg-neon/55 p-3 text-sm font-bold text-purple">{message}</p> : null}
    </>
  );
}
