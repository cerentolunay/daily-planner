import AppShell from "../components/AppShell";
import { CalendarPreview } from "../components/CalendarPreview";
import { QuickAddTask } from "../components/QuickAddTask";
import { TaskCard } from "../components/TaskCard";
import { Button, Card } from "../components/ui";

const todayTasks = [
  {
    title: "DailyPlanner repo kurulumunu tamamla",
    project: "Cyber-Quanta",
    deadline: "Bugün 17:00",
    priority: "Yüksek" as const,
    status: "Yapılacak" as const,
  },
  {
    title: "Cyber-Quanta notlarını incele",
    project: "Cyber-Quanta",
    deadline: "Bugün 19:00",
    priority: "Orta" as const,
    status: "Devam Ediyor" as const,
  },
  {
    title: "Etkinlik formu güncellemesini gönder",
    project: "Personal",
    deadline: "Bugün 21:00",
    priority: "Düşük" as const,
    status: "Beklemede" as const,
  },
];

const metrics = [
  { label: "Bugünkü görev", value: "5", color: "border-burnt/50 bg-burnt/10" },
  { label: "Odak süresi", value: "3s", color: "border-lagoon/50 bg-lagoon/20" },
  { label: "Geciken", value: "1", color: "border-lust/50 bg-lust/20" },
  { label: "Proje", value: "4", color: "border-copper/60 bg-copper/30" },
];

export default function Home() {
  return (
    <AppShell activePage="today">
      <section className="space-y-5">
        <Card className="overflow-hidden p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-burnt">Günaydın, Cerem</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
                Bugün 5 görevin var.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
                En önemli işleri üstte tut, gecikenleri kırmızı alanda kapat, günün akışını tek ekrandan izle.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>Görev Ekle</Button>
              <Button variant="secondary">Gelen Kutusu</Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className={`rounded-3xl border p-5 ${metric.color}`}>
              <p className="text-3xl font-semibold">{metric.value}</p>
              <p className="mt-2 text-sm text-white/60">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-5">
            <Card className="border-burnt/40 bg-gradient-to-br from-burnt/20 to-[#13272c] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#ffd4bd]">Bugünün Odağı</p>
              <div className="mt-5 rounded-3xl border border-burnt/40 bg-[#0f2228]/80 p-5">
                <h2 className="text-2xl font-semibold">Codesight sunumunu hazırla</h2>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Sunum akışını tamamla, demo notlarını ekle ve son kontrol için dosyayı paylaş.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/50">Bugün</p>
                  <h2 className="mt-2 text-2xl font-semibold">Öncelikli görevler</h2>
                </div>
                <span className="rounded-full bg-lagoon/20 px-3 py-1 text-sm font-semibold text-[#b9f4f9]">
                  3 görev
                </span>
              </div>
              <div className="space-y-4">
                {todayTasks.map((task) => (
                  <TaskCard key={task.title} {...task} />
                ))}
              </div>
            </Card>

            <Card className="border-lust/40 bg-lust/10 p-6">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#ffb0a8]">Gecikenler</p>
                  <h2 className="mt-2 text-2xl font-semibold">Hemen kapatılacaklar</h2>
                </div>
                <Button variant="danger">Önceliklendir</Button>
              </div>
              <TaskCard
                title="DMS dokümantasyonunu tamamla"
                project="University"
                deadline="Geçen hafta"
                priority="Acil"
                status="Beklemede"
                urgent
              />
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/50">Mini Takvim</p>
                  <h2 className="mt-2 text-xl font-semibold">Bu hafta</h2>
                </div>
                <span className="rounded-full bg-copper/40 px-3 py-1 text-sm text-[#ffd3c8]">Haziran</span>
              </div>
              <CalendarPreview />
            </Card>

            <QuickAddTask />

            <Card className="border-lagoon/40 bg-lagoon/10 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#b9f4f9]">Akış</p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-2xl bg-[#0f2228]/80 p-4">
                  <p className="font-semibold">WhatsApp mesajı algılandı</p>
                  <p className="mt-1 text-white/50">Codesight görevi taslak olarak hazır.</p>
                </div>
                <div className="rounded-2xl bg-[#0f2228]/80 p-4">
                  <p className="font-semibold">Takvim boşluğu</p>
                  <p className="mt-1 text-white/50">16:00 - 17:00 arası odak için uygun.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
