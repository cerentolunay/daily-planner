"use client";

import { useMemo, useState } from "react";
import {
  analyzeInboxThread,
  ApiInboxItem,
  ApiInboxThread,
  ApiTaskDraft,
  createInboxItem,
  createInboxThread,
  deleteInboxItem,
  convertTaskDraft,
  updateTaskDraft,
} from "../lib/api";
import { recordActivity, celebrate } from "../lib/local-storage";
import { priorityLabels, statusLabels } from "../constants/labels";
import { Button, Card, Input, Textarea } from "./ui";
import { PriorityBadge, StatusBadge } from "./badges";

type CaptureMode = "text" | "paste" | "url" | "file" | "image" | "voice";

const captureModes: Array<{ key: CaptureMode; label: string; enabled: boolean }> = [
  { key: "text", label: "Yaz", enabled: true },
  { key: "paste", label: "Yapıştır", enabled: true },
  { key: "url", label: "Link", enabled: true },
  { key: "file", label: "Dosya", enabled: false },
  { key: "image", label: "Görsel", enabled: false },
  { key: "voice", label: "Ses", enabled: false },
];

function confidenceClass(value: number) {
  if (value >= 90) return "bg-neon";
  if (value >= 75) return "bg-yellow";
  if (value >= 50) return "bg-yellow/45";
  return "bg-lilac";
}

function sourceLabel(item: ApiInboxItem) {
  if (item.source_type === "whatsapp") return "WhatsApp";
  if (item.source_type === "email") return "E-posta";
  if (item.content_type === "url") return "Link";
  return item.source_name || "Manuel";
}

export function SmartInbox({
  initialItems,
  initialThreads,
  initialDrafts,
}: {
  initialItems: ApiInboxItem[];
  initialThreads: ApiInboxThread[];
  initialDrafts: ApiTaskDraft[];
}) {
  const [items, setItems] = useState(initialItems);
  const [threads, setThreads] = useState(initialThreads);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<CaptureMode>("paste");
  const [rawText, setRawText] = useState("Abi Codesight sunumunu hazırlayalım. İçinde avantaj dezavantaj da olsun. CBOM kısmını da ekleyelim, cuma bitmiş olsun.");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [activeDraft, setActiveDraft] = useState<ApiTaskDraft | null>(initialDrafts[0] || null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedItems = useMemo(() => items.filter((item) => selected.includes(item.id)), [items, selected]);
  const pendingItems = items.filter((item) => item.status === "unprocessed" || item.status === "pending");
  const analyzedItems = items.filter((item) => item.status === "analyzed");
  const convertedItems = items.filter((item) => item.status === "converted");

  async function capture() {
    setError("");
    const isUrl = mode === "url";
    const content = isUrl ? url : rawText;
    if (!content.trim()) {
      setError(isUrl ? "Link alanı boş olamaz." : "Yakalanacak metin boş olamaz.");
      return;
    }

    const saved = await createInboxItem({
      source_type: isUrl ? "web" : mode === "paste" ? "whatsapp" : "manual",
      content_type: isUrl ? "url" : "text",
      raw_text: isUrl ? `${title || "Link"}\n${url}` : rawText,
      title: title || null,
      source_url: isUrl ? url : null,
      status: "unprocessed",
    });

    if (!saved) {
      setError("Inbox kaydı oluşturulamadı.");
      return;
    }

    setItems((current) => [saved, ...current]);
    setRawText("");
    setUrl("");
    setTitle("");
    setMessage("Yakalanan bilgi gelen kutusuna eklendi.");
    recordActivity("task_updated", "Yeni bilgi Smart Inbox’a yakalandı");
  }

  async function makeThread(shouldAnalyze = false) {
    setError("");
    if (selected.length < 2) {
      setError("Thread oluşturmak için en az 2 mesaj seçmelisin.");
      return;
    }

    const first = selectedItems[0];
    const thread = await createInboxThread({
      title: `${first?.detected_project || first?.title || "Yeni"} hakkında konuşma`,
      summary: selectedItems.map((item) => item.raw_text).join("\n"),
      item_ids: selected,
      status: "open",
    });

    if (!thread) {
      setError("Thread oluşturulamadı.");
      return;
    }

    setThreads((current) => [thread, ...current]);
    setItems((current) => current.map((item) => (selected.includes(item.id) ? { ...item, thread_id: thread.id } : item)));
    setMessage(`${selected.length} mesaj thread olarak gruplandı.`);
    recordActivity("task_updated", `${selected.length} mesaj tek thread altında gruplandı`);

    if (shouldAnalyze) {
      const draft = await analyzeInboxThread(thread.id);
      if (draft) {
        setDrafts((current) => [draft, ...current]);
        setActiveDraft(draft);
        setItems((current) => current.map((item) => (selected.includes(item.id) ? { ...item, status: "analyzed" } : item)));
        setMessage("AI Preview için task draft hazırlandı.");
      }
    }

    setSelected([]);
  }

  async function removeSelected() {
    await Promise.all(selected.map((id) => deleteInboxItem(id)));
    setItems((current) => current.filter((item) => !selected.includes(item.id)));
    setSelected([]);
    setMessage("Seçili mesajlar silindi.");
  }

  async function convertDraft() {
    if (!activeDraft) return;
    const savedDraft = await updateTaskDraft(activeDraft.id, {
      title: activeDraft.title,
      description: activeDraft.description,
      project_hint: activeDraft.project_hint,
      deadline: activeDraft.deadline,
      priority: activeDraft.priority,
      status: activeDraft.status,
      confidence: activeDraft.confidence,
      subtasks_json: activeDraft.subtasks_json,
    });
    const task = savedDraft ? await convertTaskDraft(activeDraft.id) : null;
    if (!task) {
      setError("Task draft göreve çevrilemedi.");
      return;
    }
    setDrafts((current) => current.filter((draft) => draft.id !== activeDraft.id));
    setActiveDraft(null);
    setMessage("Task draft görev olarak kaydedildi.");
    recordActivity("inbox_converted", `${task.title} Smart Inbox’tan göreve dönüştürüldü`);
    celebrate("Smart Inbox görevi hazır etti 🎉");
  }

  function toggleItem(itemId: string) {
    setSelected((current) => (current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]));
  }

  function renderItem(item: ApiInboxItem) {
    const checked = selected.includes(item.id);
    return (
      <article key={item.id} className={`rounded-3xl border p-4 transition ${checked ? "border-yellow bg-yellow/35" : "border-white/80 bg-white/75 hover:border-neon"}`}>
        <div className="flex items-start gap-3">
          <input type="checkbox" checked={checked} onChange={() => toggleItem(item.id)} className="mt-1 h-5 w-5 accent-purple" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-lilac px-3 py-1 text-xs font-black text-purple">{sourceLabel(item)}</span>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black text-purple/65">{item.status}</span>
            </div>
            <h3 className="mt-3 font-black text-purple">{item.title || item.detected_title || item.raw_text.slice(0, 70)}</h3>
            <p className="mt-2 line-clamp-3 text-sm font-bold leading-6 text-purple/65">{item.raw_text}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap gap-2">
          {captureModes.map((item) => (
            <button
              key={item.key}
              onClick={() => item.enabled && setMode(item.key)}
              disabled={!item.enabled}
              className={`rounded-2xl px-4 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${
                mode === item.key ? "bg-yellow text-purple" : "bg-white/70 text-purple hover:bg-neon"
              }`}
            >
              {item.label}
              {!item.enabled ? " · Yakında" : ""}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            {mode === "url" ? (
              <>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Başlık opsiyonel" />
                <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." />
              </>
            ) : (
              <Textarea value={rawText} onChange={(event) => setRawText(event.target.value)} placeholder="WhatsApp mesajını, notu veya e-postayı buraya bırak..." />
            )}
          </div>
          <Button onClick={capture}>Inbox’a Kaydet</Button>
        </div>
        {error ? <p className="mt-4 rounded-2xl bg-yellow/45 p-3 text-sm font-bold text-purple">{error}</p> : null}
        {message ? <p className="mt-4 rounded-2xl bg-neon/55 p-3 text-sm font-bold text-purple">{message}</p> : null}
      </Card>

      {selected.length ? (
        <div className="sticky top-4 z-20 flex flex-wrap items-center gap-3 rounded-[26px] border border-white/80 bg-purple p-4 text-white shadow-glow">
          <span className="font-black">{selected.length} mesaj seçildi</span>
          <Button onClick={() => makeThread(false)}>Thread Oluştur</Button>
          <Button variant="ghost" onClick={() => makeThread(true)}>Birleştir ve Analiz Et</Button>
          <Button variant="ghost" onClick={() => setSelected([])}>Seçimi Temizle</Button>
          <Button variant="secondary" onClick={removeSelected}>Sil</Button>
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_0.82fr]">
        <div className="space-y-5">
          <Card className="p-6">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Bekleyenler</p>
            <div className="mt-4 grid gap-3">
              {pendingItems.length ? pendingItems.map(renderItem) : <EmptyInboxText text="Bekleyen mesaj yok. Yeni bir şey yakaladığında burada belirecek." />}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Thread’ler</p>
            <div className="mt-4 space-y-3">
              {threads.length ? (
                threads.map((thread) => (
                  <button key={thread.id} onClick={() => setActiveDraft(drafts.find((draft) => draft.thread_id === thread.id) || activeDraft)} className="w-full rounded-3xl bg-white/75 p-4 text-left transition hover:bg-yellow/45">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-black text-purple">{thread.title}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-black text-purple ${confidenceClass(thread.confidence)}`}>%{Math.round(thread.confidence)}</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-purple/65">{thread.items.length} kaynak mesaj · {thread.status}</p>
                  </button>
                ))
              ) : (
                <EmptyInboxText text="Henüz thread yok. Birden fazla mesaj seçip konuşmayı tek görev bloğuna dönüştürebilirsin." />
              )}
            </div>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <Card className="p-6">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Analiz Edilenler</p>
              <div className="mt-4 space-y-3">{analyzedItems.length ? analyzedItems.map(renderItem) : <EmptyInboxText text="Analiz edilmiş mesajlar burada listelenecek." />}</div>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Göreve Çevrilenler</p>
              <div className="mt-4 space-y-3">{convertedItems.length ? convertedItems.map(renderItem) : <EmptyInboxText text="Göreve dönüşen kaynaklar burada kalacak." />}</div>
            </Card>
          </div>
        </div>

        <Card className="p-6">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">AI bunu şöyle anladı</p>
          {activeDraft ? (
            <div className="mt-5 space-y-3">
              <Input value={activeDraft.title} onChange={(event) => setActiveDraft({ ...activeDraft, title: event.target.value })} placeholder="Görev başlığı" />
              <Textarea value={activeDraft.description || ""} onChange={(event) => setActiveDraft({ ...activeDraft, description: event.target.value })} placeholder="Açıklama" />
              <Input value={activeDraft.project_hint || ""} onChange={(event) => setActiveDraft({ ...activeDraft, project_hint: event.target.value })} placeholder="Proje" />
              <Input type="datetime-local" value={activeDraft.deadline ? activeDraft.deadline.slice(0, 16) : ""} onChange={(event) => setActiveDraft({ ...activeDraft, deadline: event.target.value })} />
              <div className="flex flex-wrap gap-2">
                <PriorityBadge priority={priorityLabels[activeDraft.priority]} />
                <StatusBadge status={statusLabels[activeDraft.status]} />
                <span className={`rounded-full px-3 py-1 text-xs font-black text-purple ${confidenceClass(activeDraft.confidence)}`}>Confidence %{Math.round(activeDraft.confidence)}</span>
              </div>
              <div className="rounded-3xl bg-lilac/45 p-4">
                <p className="font-black text-purple">Yapılacaklar</p>
                <div className="mt-3 space-y-2">
                  {(activeDraft.subtasks_json || []).map((subtask, index) => (
                    <label key={`${subtask}-${index}`} className="flex gap-3 rounded-2xl bg-white/70 p-3 text-sm font-bold text-purple">
                      <input type="checkbox" className="h-5 w-5 accent-purple" />
                      {subtask}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={convertDraft}>Görev Olarak Kaydet</Button>
                <Button variant="ghost" onClick={() => activeDraft.thread_id && analyzeInboxThread(activeDraft.thread_id).then((draft) => draft && setActiveDraft(draft))}>Tekrar Analiz Et</Button>
                <Button variant="secondary" onClick={() => setActiveDraft(null)}>Vazgeç</Button>
              </div>
            </div>
          ) : (
            <EmptyInboxText text="Bir thread analiz ettiğinde düzenlenebilir görev taslağı burada belirecek." />
          )}
        </Card>
      </div>
    </div>
  );
}

function EmptyInboxText({ text }: { text: string }) {
  return (
    <div className="rounded-3xl bg-white/70 p-5 text-sm font-bold leading-6 text-purple/65">
      {text}
    </div>
  );
}
