import Link from "next/link";
import { AppExperience } from "./AppExperience";

const navItems = [
  { href: "/", label: "Bugün", key: "today", marker: "B" },
  { href: "/tasks", label: "Görevler", key: "tasks", marker: "G" },
  { href: "/inbox", label: "Gelen Kutusu", key: "inbox", marker: "K" },
  { href: "/calendar", label: "Takvim", key: "calendar", marker: "T" },
  { href: "/projects", label: "Projeler", key: "projects", marker: "P" },
  { href: "/focus", label: "Odak", key: "focus", marker: "O" },
  { href: "/integrations", label: "Entegrasyonlar", key: "integrations", marker: "E" },
  { href: "/settings", label: "Ayarlar", key: "settings", marker: "A" },
];

interface AppShellProps {
  children: React.ReactNode;
  activePage: string;
  todayProgress?: number;
}

export default function AppShell({ children, activePage, todayProgress = 0 }: AppShellProps) {
  const progress = Math.max(0, Math.min(100, todayProgress));

  return (
    <div className="min-h-screen bg-lilac text-purple">
      <div className="mx-auto flex min-h-screen max-w-[1480px] flex-col gap-5 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
        <aside className="rounded-[30px] bg-purple p-5 text-white shadow-glow lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] lg:w-[292px] lg:shrink-0">
          <div className="flex h-full flex-col">
            <div className="rounded-3xl bg-white/12 p-5 ring-1 ring-white/18">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-yellow text-lg font-black text-purple">
                  D
                </div>
                <div>
                  <p className="text-lg font-semibold">DailyPlanner</p>
                  <p className="text-xs text-lilac">Akıllı günlük plan</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-neon p-3 text-purple">
                  <p className="text-2xl font-semibold">5</p>
                  <p className="text-xs font-medium">bugün</p>
                </div>
                <div className="rounded-2xl bg-yellow p-3 text-purple">
                  <p className="text-2xl font-semibold">1</p>
                  <p className="text-xs font-medium">geciken</p>
                </div>
              </div>
            </div>

            <nav className="mt-5 space-y-2">
              {navItems.map((item) => {
                const active = activePage === item.key;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-yellow text-purple shadow-[0_12px_26px_rgba(255,210,48,0.25)]"
                        : "bg-white/8 text-white hover:bg-neon hover:text-purple"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl text-xs font-bold ${
                        active ? "bg-white/35" : "bg-white/12 text-white group-hover:bg-white/40 group-hover:text-purple"
                      }`}
                    >
                      {item.marker}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto hidden rounded-3xl bg-lilac p-5 text-purple lg:block">
              <p className="text-sm font-black">Bugünkü ilerleme</p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/75">
                <div className="h-full rounded-full bg-neon transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-2xl font-black">%{progress}</p>
              <p className="mt-5 text-sm font-bold">Bu haftanın ritmi</p>
              <p className="mt-2 text-sm leading-6 text-purple/75">
                Odak görevlerini sabitle, tamamlanan işleri neon enerjisiyle kapat.
              </p>
              <Link href="/tasks" className="mt-4 block w-full rounded-2xl bg-yellow px-4 py-3 text-center text-sm font-bold text-purple transition hover:brightness-105">
                Görev Ekle
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <AppExperience />
    </div>
  );
}
