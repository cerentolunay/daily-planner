import AppShell from "../components/AppShell";
import { CalendarPreview } from "../components/CalendarPreview";
import { QuickAddTask } from "../components/QuickAddTask";
import { TaskCard } from "../components/TaskCard";
import { Button, Card } from "../components/ui";
import { formatDeadline, getInboxItems, getProjects, getTasks, priorityLabel, statusLabel } from "../lib/api";

const fallbackTasks = [
  {
    id: "mock-1",
    title: "DailyPlanner repo kurulumunu tamamla",
    project: "Cyber-Quanta",
    deadline: "Bugün 17:00",
    priority: "Yüksek" as const,
    status: "Yapılacak" as const,
  },
  {
    id: "mock-2",
    title: "Cyber-Quanta notlarını incele",
    project: "Cyber-Quanta",
    deadline: "Bugün 19:00",
    priority: "Orta" as const,
    status: "Devam Ediyor" as const,
  },
  {
    id: "mock-3",
    title: "Etkinlik formu güncellemesini gönder",
    project: "Personal",
    deadline: "Bugün 21:00",
    priority: "Düşük" as const,
    status: "Beklemede" as const,
  },
];

export default async function Home() {
  const [apiTasks, projects, inboxItems] = await Promise.all([getTasks(), getProjects(), getInboxItems()]);
  const projectMap = new Map(projects.map((project) => [project.id, project.name]));
  const tasks = apiTasks.length
    ? apiTasks.slice(0, 3).map((task) => ({
        id: task.id,
        title: task.title,
        project: task.project_id ? projectMap.get(task.project_id) || "Proje yok" : "Proje yok",
        deadline: formatDeadline(task.deadline),
        priority: priorityLabel[task.priority],
        status: statusLabel[task.status],
      }))
    : fallbackTasks;

  const todayOpenTasks = apiTasks.filter((task) => task.deadline && new Date(task.deadline).toDateString() === new Date().toDateString() && task.status !== "done");
  const overdueTasks = apiTasks.filter((task) => task.deadline && new Date(task.deadline) < new Date() && task.status !== "done");
  const upcomingTasks = apiTasks
    .filter((task) => task.deadline && new Date(task.deadline).getTime() > Date.now() && new Date(task.deadline).getTime() <= Date.now() + 7 * 24 * 60 * 60 * 1000)
    .slice(0, 4);
  const focusTask = todayOpenTasks[0] || overdueTasks[0] || upcomingTasks[0];

  const metrics = [
    { label: "Bugünkü görev", value: String(apiTasks.length || 5), color: "border-yellow bg-yellow/45" },
    { label: "Pozitif akış", value: String(apiTasks.filter((task) => task.status === "done").length || 3), color: "border-neon bg-neon/45" },
    { label: "Gelen mesaj", value: String(inboxItems.length || 2), color: "border-white/80 bg-white/70" },
    { label: "Proje", value: String(projects.length || 4), color: "border-purple/20 bg-purple/10" },
  ];

  return (
    <AppShell activePage="today">
      <section className="space-y-5">
        <Card className="overflow-hidden p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/65">Günaydın, Cerem</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-purple md:text-5xl">
                Bugün planın hafif, net ve canlı.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-purple/68">
                En önemli işleri öne al, tamamlananları neon enerjiyle kapat, günün akışını tek ekrandan izle.
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
            <div key={metric.label} className={`rounded-3xl border p-5 text-purple shadow-glow ${metric.color}`}>
              <p className="text-3xl font-black">{metric.value}</p>
              <p className="mt-2 text-sm font-bold text-purple/62">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-5">
            <Card className="border-yellow/70 bg-yellow/35 p-6">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/65">Bugünün Odağı</p>
              <div className="mt-5 rounded-3xl bg-white/70 p-5">
                {focusTask ? (
                  <>
                    <h2 className="text-2xl font-black text-purple">{focusTask.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-purple/68">
                      Bugün seni bekleyen işler arasında en anlamlı başlangıç noktası bu görev.
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-bold leading-6 text-purple/68">
                    Bugünün odağı hazır değil. Yeni bir görev ekleyerek planlamaya başlayabilirsin.
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Bugün</p>
                  <h2 className="mt-2 text-2xl font-black text-purple">Öncelikli görevler</h2>
                </div>
                <span className="rounded-full bg-neon px-3 py-1 text-sm font-black text-purple">
                  {tasks.length} görev
                </span>
              </div>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} {...task} />
                ))}
              </div>
            </Card>

            <Card className="border-yellow/70 bg-white/78 p-6">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Gecikenler</p>
                  <h2 className="mt-2 text-2xl font-black text-purple">Hemen kapatılacaklar</h2>
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
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Mini Takvim</p>
                  <h2 className="mt-2 text-xl font-black text-purple">Bu hafta</h2>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-purple">Haziran</span>
              </div>
              <CalendarPreview />
            </Card>

            <QuickAddTask />

            <Card className="border-neon/80 bg-neon/35 p-6">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/65">Akış</p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="font-black text-purple">WhatsApp mesajı algılandı</p>
                  <p className="mt-1 text-purple/65">Codesight görevi taslak olarak hazır.</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="font-black text-purple">Takvim boşluğu</p>
                  <p className="mt-1 text-purple/65">16:00 - 17:00 arası odak için uygun.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Yaklaşan Deadline'lar</p>
              <div className="mt-4 space-y-3">
                {upcomingTasks.length ? (
                  upcomingTasks.map((task) => (
                    <div key={task.id} className="rounded-2xl bg-white/70 p-4">
                      <p className="font-black text-purple">{task.title}</p>
                      <p className="mt-1 text-sm text-purple/65">{formatDeadline(task.deadline)}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-white/70 p-4 text-sm font-bold text-purple/65">Bu hafta planlanmış görev yok.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
