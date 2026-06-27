"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ApiInboxItem, ApiInboxThread, ApiProject, ApiTask, getInboxItems, getInboxThreads, getProjects, getTasks } from "../lib/api";

const commands = [
  { label: "Yeni görev oluştur", hint: "N", href: "/tasks", action: "new-task" },
  { label: "Yeni proje oluştur", hint: "", href: "/projects", action: "new-project" },
  { label: "Bugün sayfasına git", hint: "G B", href: "/" },
  { label: "Görevler sayfasına git", hint: "G T", href: "/tasks" },
  { label: "Takvime git", hint: "G C", href: "/calendar" },
  { label: "Gelen kutusuna git", hint: "G I", href: "/inbox" },
  { label: "Odak modunu aç", hint: "", href: "/focus" },
  { label: "Entegrasyonları aç", hint: "", href: "/integrations" },
  { label: "Günlük özeti aç", hint: "", href: "/review/daily" },
  { label: "Haftalık özeti aç", hint: "", href: "/review/weekly" },
  { label: "Ayarları aç", hint: "", href: "/settings" },
];

const integrationResults = ["WhatsApp", "Gmail", "Google Calendar", "Slack", "GitHub", "Discord", "Notion", "Outlook"];

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
}

export function AppExperience() {
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [burst, setBurst] = useState(false);
  const [goMode, setGoMode] = useState(false);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [inboxItems, setInboxItems] = useState<ApiInboxItem[]>([]);
  const [threads, setThreads] = useState<ApiInboxThread[]>([]);

  const filteredCommands = useMemo(() => {
    const normalized = query.toLocaleLowerCase("tr-TR");
    return commands.filter((command) => command.label.toLocaleLowerCase("tr-TR").includes(normalized));
  }, [query]);

  const normalizedQuery = query.toLocaleLowerCase("tr-TR");
  const searchGroups = [
    {
      title: "Görevler",
      items: tasks.filter((task) => task.title.toLocaleLowerCase("tr-TR").includes(normalizedQuery)).slice(0, 4).map((task) => ({ label: task.title, href: "/tasks" })),
    },
    {
      title: "Projeler",
      items: projects.filter((project) => project.name.toLocaleLowerCase("tr-TR").includes(normalizedQuery)).slice(0, 4).map((project) => ({ label: project.name, href: "/projects" })),
    },
    {
      title: "Inbox",
      items: inboxItems.filter((item) => item.raw_text.toLocaleLowerCase("tr-TR").includes(normalizedQuery)).slice(0, 4).map((item) => ({ label: item.title || item.raw_text.slice(0, 60), href: "/inbox" })),
    },
    {
      title: "Thread’ler",
      items: threads.filter((thread) => thread.title.toLocaleLowerCase("tr-TR").includes(normalizedQuery)).slice(0, 4).map((thread) => ({ label: thread.title, href: "/inbox" })),
    },
    {
      title: "Entegrasyonlar",
      items: integrationResults.filter((item) => item.toLocaleLowerCase("tr-TR").includes(normalizedQuery)).map((item) => ({ label: item, href: "/integrations" })),
    },
  ].filter((group) => group.items.length);

  function runCommand(href: string) {
    setPaletteOpen(false);
    setQuickOpen(false);
    setQuery("");
    router.push(href);
  }

  useEffect(() => {
    function onCelebrate(event: Event) {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setToast(detail?.message || "Harika! Bir görev daha tamamlandı 🎉");
      setBurst(true);
      window.setTimeout(() => setBurst(false), 900);
      window.setTimeout(() => setToast(""), 2800);
    }

    window.addEventListener("dailyplanner:celebrate", onCelebrate);
    return () => window.removeEventListener("dailyplanner:celebrate", onCelebrate);
  }, []);

  useEffect(() => {
    if (!paletteOpen) return;
    Promise.all([getTasks(), getProjects(), getInboxItems(), getInboxThreads()]).then(([nextTasks, nextProjects, nextItems, nextThreads]) => {
      setTasks(nextTasks);
      setProjects(nextProjects);
      setInboxItems(nextItems);
      setThreads(nextThreads);
    });
  }, [paletteOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
        return;
      }

      if (event.key === "Escape") {
        setPaletteOpen(false);
        setQuickOpen(false);
        setGoMode(false);
        return;
      }

      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();

      if (goMode) {
        const routes: Record<string, string> = {
          b: "/",
          t: "/tasks",
          c: "/calendar",
          i: "/inbox",
          p: "/projects",
        };
        if (routes[key]) {
          event.preventDefault();
          setGoMode(false);
          router.push(routes[key]);
          return;
        }
        setGoMode(false);
      }

      if (key === "g") {
        setGoMode(true);
        window.setTimeout(() => setGoMode(false), 1300);
        return;
      }

      if (key === "n") {
        event.preventDefault();
        router.push("/tasks");
        return;
      }

      if (event.key === "/") {
        const search = document.querySelector<HTMLInputElement>("[data-task-search='true']");
        if (search) {
          event.preventDefault();
          search.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goMode, router]);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {quickOpen ? (
          <div className="w-[min(320px,calc(100vw-40px))] rounded-[28px] border border-white/80 bg-white/92 p-3 text-purple shadow-glow backdrop-blur">
            <Link className="block rounded-2xl px-4 py-3 text-sm font-black transition hover:bg-yellow" href="/tasks" onClick={() => setQuickOpen(false)}>
              Yeni Görev
            </Link>
            <Link className="block rounded-2xl px-4 py-3 text-sm font-black transition hover:bg-neon" href="/projects" onClick={() => setQuickOpen(false)}>
              Yeni Proje
            </Link>
            <Link className="block rounded-2xl px-4 py-3 text-sm font-black transition hover:bg-lilac/70" href="/inbox" onClick={() => setQuickOpen(false)}>
              Gelen Kutusuna Ekle
            </Link>
            <Link className="block rounded-2xl px-4 py-3 text-sm font-black transition hover:bg-lilac/70" href="/inbox" onClick={() => setQuickOpen(false)}>
              Bugüne Not Bırak
            </Link>
          </div>
        ) : null}
        <button
          aria-label="Hızlı ekle"
          onClick={() => setQuickOpen((current) => !current)}
          className="grid h-16 w-16 place-items-center rounded-full bg-yellow text-4xl font-black leading-none text-purple shadow-[0_18px_38px_rgba(255,210,48,0.42)] transition hover:-translate-y-1 hover:bg-neon focus:outline-none focus:ring-4 focus:ring-white/80"
        >
          +
        </button>
      </div>

      {paletteOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-start bg-purple/28 px-4 py-16 backdrop-blur-sm sm:place-items-center sm:py-4">
          <div className="w-full max-w-2xl rounded-[30px] border border-white/80 bg-white/95 p-4 text-purple shadow-glow">
            <div className="flex items-center gap-3 rounded-2xl bg-lilac/65 px-4 py-3">
              <span className="text-lg font-black">⌘</span>
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Her şeyi ara..."
                className="min-w-0 flex-1 bg-transparent text-base font-bold text-purple outline-none placeholder:text-purple/45"
              />
              <button onClick={() => setPaletteOpen(false)} className="rounded-xl bg-white/80 px-3 py-2 text-xs font-black text-purple">
                Esc
              </button>
            </div>
            <div className="mt-3 max-h-[52vh] space-y-2 overflow-y-auto">
              {filteredCommands.length ? (
                <div>
                  <p className="px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-purple/45">Komutlar</p>
                  {filteredCommands.map((command) => (
                  <button
                    key={command.label}
                    onClick={() => runCommand(command.href)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition hover:bg-yellow"
                  >
                    <span>{command.label}</span>
                    {command.hint ? <span className="rounded-full bg-lilac px-3 py-1 text-xs text-purple/75">{command.hint}</span> : null}
                  </button>
                  ))}
                </div>
              ) : null}
              {searchGroups.map((group) => (
                <div key={group.title}>
                  <p className="px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-purple/45">{group.title}</p>
                  {group.items.map((item) => (
                    <button
                      key={`${group.title}-${item.label}`}
                      onClick={() => runCommand(item.href)}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition hover:bg-neon"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
              {!filteredCommands.length && !searchGroups.length ? (
                <p className="rounded-2xl bg-lilac/55 p-4 text-sm font-bold text-purple/65">
                  Bu aramada sonuç bulamadım. Daha kısa bir kelime deneyebilirsin.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed left-1/2 top-5 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 rounded-[24px] border border-neon bg-white/95 px-5 py-4 text-center text-sm font-black text-purple shadow-glow">
          {toast}
        </div>
      ) : null}

      {burst ? (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center gap-3 text-3xl animate-soft-pop">
          <span>✨</span>
          <span>🎉</span>
          <span>⚡</span>
        </div>
      ) : null}

      {goMode ? (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-purple px-4 py-2 text-xs font-black text-white shadow-glow">
          Git: B Bugün · T Görevler · C Takvim · I Gelen · P Projeler
        </div>
      ) : null}
    </>
  );
}
