import AppShell from "../../components/AppShell";
import { TaskCard } from "../../components/TaskCard";
import { Button, Card } from "../../components/ui";

const tasks = [
  {
    title: "DailyPlanner repo kurulumunu tamamla",
    project: "Cyber-Quanta",
    deadline: "Bugün 17:00",
    priority: "Yüksek" as const,
    status: "Yapılacak" as const,
  },
  {
    title: "Projeyi sprint planına ekle",
    project: "Heptapus",
    deadline: "Yarın",
    priority: "Orta" as const,
    status: "Devam Ediyor" as const,
  },
  {
    title: "DMS dokümantasyonunu tamamla",
    project: "University",
    deadline: "Geçen hafta",
    priority: "Acil" as const,
    status: "Beklemede" as const,
    urgent: true,
  },
  {
    title: "Kişisel haftalık planı toparla",
    project: "Personal",
    deadline: "Cumartesi",
    priority: "Düşük" as const,
    status: "Yapılacak" as const,
  },
];

const filters = ["Bugün", "Yaklaşanlar", "Gecikenler", "Tamamlananlar"];

export default function TasksPage() {
  return (
    <AppShell activePage="tasks">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-yellow">Görev Merkezi</p>
              <h1 className="mt-3 text-3xl font-semibold">Görevler</h1>
              <p className="mt-2 text-lilac/75">Tüm görevlerini öncelik, durum ve tarihe göre yönet.</p>
            </div>
            <Button>Görev Ekle</Button>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <Card className="p-5 md:p-6">
            <div className="mb-5 flex flex-wrap gap-3">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    index === 0
                      ? "border-yellow bg-yellow text-night"
                      : "border-lilac/20 bg-white/[0.04] text-lilac/75 hover:border-neon/70 hover:bg-neon/10"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard key={task.title} {...task} />
              ))}
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="border-neon/40 bg-neon/10 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-neon">Hızlı Bakış</p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-night/70 p-4">
                  <p className="text-2xl font-semibold">2</p>
                  <p className="text-sm text-lilac/70">yüksek ve acil</p>
                </div>
                <div className="rounded-2xl bg-night/70 p-4">
                  <p className="text-2xl font-semibold">1</p>
                  <p className="text-sm text-lilac/70">beklemede</p>
                </div>
              </div>
            </Card>

            <Card className="border-lilac/40 bg-lilac/10 p-6">
              <h2 className="text-xl font-semibold">Planlama notu</h2>
              <p className="mt-3 text-sm leading-6 text-lilac/75">
                Acil işleri sabah bloğuna, düşük öncelikleri gün sonuna taşı.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
