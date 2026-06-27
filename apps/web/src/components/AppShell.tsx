import Link from "next/link";

const navItems = [
  { href: "/", label: "Bugün", key: "today", marker: "B" },
  { href: "/tasks", label: "Görevler", key: "tasks", marker: "G" },
  { href: "/inbox", label: "Gelen Kutusu", key: "inbox", marker: "K" },
  { href: "/calendar", label: "Takvim", key: "calendar", marker: "T" },
  { href: "/projects", label: "Projeler", key: "projects", marker: "P" },
  { href: "/settings", label: "Ayarlar", key: "settings", marker: "A" },
];

interface AppShellProps {
  children: React.ReactNode;
  activePage: string;
}

export default function AppShell({ children, activePage }: AppShellProps) {
  return (
    <div className="min-h-screen bg-pearl text-white">
      <div className="mx-auto flex min-h-screen max-w-[1480px] flex-col gap-5 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
        <aside className="rounded-[28px] border border-white/10 bg-[#13272c]/95 p-5 shadow-glow lg:sticky lg:top-6 lg:h-[calc(100vh-48px)] lg:w-[292px] lg:shrink-0">
          <div className="flex h-full flex-col">
            <div className="rounded-3xl border border-white/10 bg-[#1A2C30] p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-burnt text-lg font-black text-[#1A2C30]">
                  D
                </div>
                <div>
                  <p className="text-lg font-semibold">DailyPlanner</p>
                  <p className="text-xs text-white/60">Akıllı günlük plan</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-lagoon/25 p-3">
                  <p className="text-2xl font-semibold">5</p>
                  <p className="text-xs text-white/60">bugün</p>
                </div>
                <div className="rounded-2xl bg-lust/20 p-3">
                  <p className="text-2xl font-semibold text-[#ffb0a8]">1</p>
                  <p className="text-xs text-white/60">geciken</p>
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
                    className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                      active
                        ? "border-burnt/70 bg-burnt text-[#1A2C30] shadow-[0_12px_30px_rgba(254,126,60,0.22)]"
                        : "border-white/5 bg-white/[0.03] text-white/75 hover:border-lagoon/60 hover:bg-lagoon/20 hover:text-white"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl text-xs font-bold ${
                        active ? "bg-[#1A2C30]/20" : "bg-white/10 text-white/70 group-hover:bg-lagoon/30"
                      }`}
                    >
                      {item.marker}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto hidden rounded-3xl border border-copper/70 bg-copper/40 p-5 lg:block">
              <p className="text-sm font-semibold">Bu haftanın ritmi</p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Odak görevlerini sabitle, gecikenleri kırmızıyla takip et.
              </p>
              <button className="mt-4 w-full rounded-2xl bg-burnt px-4 py-3 text-sm font-bold text-[#1A2C30] transition hover:bg-[#ff925c]">
                Görev Ekle
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
