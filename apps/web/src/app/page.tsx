import AppShell from "../components/AppShell";
import { ActivityTimeline } from "../components/ActivityTimeline";
import { CalendarPreview } from "../components/CalendarPreview";
import { DashboardHero } from "../components/DashboardHero";
import { QuickAddTask } from "../components/QuickAddTask";
import { StreakCard } from "../components/StreakCard";
import { TaskCard } from "../components/TaskCard";
import { Button, Card } from "../components/ui";
import { formatDeadline, getInboxItems, getProjects, getTasks, priorityLabel, statusLabel } from "../lib/api";
import { buildDailyPlan, completionRateForToday, weeklyTasks } from "../lib/planner";

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

  const todayTasks = apiTasks.filter((task) => task.deadline && new Date(task.deadline).toDateString() === new Date().toDateString());
  const todayOpenTasks = todayTasks.filter((task) => task.status !== "done");
  const overdueTasks = apiTasks.filter((task) => task.deadline && new Date(task.deadline) < new Date() && task.status !== "done");
  const urgentTasks = apiTasks.filter((task) => task.priority === "urgent" && task.status !== "done");
  const upcomingTasks = apiTasks
    .filter((task) => task.deadline && new Date(task.deadline).getTime() > Date.now() && new Date(task.deadline).getTime() <= Date.now() + 7 * 24 * 60 * 60 * 1000)
    .slice(0, 4);
  const focusTask = todayOpenTasks[0] || overdueTasks[0] || upcomingTasks[0];
  const dailyPlan = buildDailyPlan(apiTasks, projects);
  const todayProgress = completionRateForToday(apiTasks);
  const thisWeekTasks = weeklyTasks(apiTasks);
  const weeklyCompleted = thisWeekTasks.filter((task) => task.status === "done").length;
  const weeklyRate = thisWeekTasks.length ? Math.round((weeklyCompleted / thisWeekTasks.length) * 100) : 0;
  const busiestProject = projects
    .map((project) => ({
      name: project.name,
      count: apiTasks.filter((task) => task.project_id === project.id).length,
    }))
    .sort((a, b) => b.count - a.count)[0];
  const completionRate = apiTasks.length ? Math.round((apiTasks.filter((task) => task.status === "done").length / apiTasks.length) * 100) : 0;

  const metrics = [
    { label: "Bugünkü görev", value: String(todayTasks.length), color: "border-yellow bg-yellow/45" },
    { label: "Pozitif akış", value: String(apiTasks.filter((task) => task.status === "done").length), color: "border-neon bg-neon/45" },
    { label: "Gelen mesaj", value: String(inboxItems.length), color: "border-white/80 bg-white/70" },
    { label: "Proje", value: String(projects.length), color: "border-purple/20 bg-purple/10" },
  ];

  return (
    <AppShell activePage="today" todayProgress={todayProgress.rate}>
      <section className="space-y-5">
        <DashboardHero
          todayCount={todayTasks.length}
          overdueCount={overdueTasks.length}
          urgentCount={urgentTasks.length}
          progressRate={todayProgress.rate}
          focusTitle={focusTask?.title}
        />

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

            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Bugünkü Planın</p>
                  <h2 className="mt-2 text-2xl font-black text-purple">Önerilen sıra</h2>
                </div>
                <span className="rounded-full bg-yellow px-3 py-1 text-sm font-black text-purple">{dailyPlan.length} öneri</span>
              </div>
              <div className="space-y-3">
                {dailyPlan.length ? (
                  dailyPlan.map((task, index) => (
                    <div key={task.id} className="grid gap-3 rounded-3xl bg-white/70 p-4 md:grid-cols-[42px_1fr_auto] md:items-center">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow text-sm font-black text-purple">{index + 1}</div>
                      <div>
                        <p className="font-black text-purple">{task.title}</p>
                        <p className="mt-1 text-sm text-purple/65">{task.projectName} · {formatDeadline(task.deadline)}</p>
                      </div>
                      <span className="rounded-full bg-neon px-3 py-1 text-xs font-black text-purple">{task.importanceLabel}</span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-white/70 p-4 text-sm font-bold text-purple/65">
                    Bugünün odağı hazır değil. Yeni bir görev ekleyerek planlamaya başlayabilirsin.
                  </p>
                )}
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
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Bugünkü Tamamlanma</p>
              {todayProgress.total ? (
                <>
                  <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/70">
                    <div className="h-full rounded-full bg-neon" style={{ width: `${todayProgress.rate}%` }} />
                  </div>
                  <p className="mt-3 text-sm font-bold text-purple/65">
                    {todayProgress.completed}/{todayProgress.total} görev tamamlandı · %{todayProgress.rate}
                  </p>
                </>
              ) : (
                <p className="mt-4 rounded-2xl bg-white/70 p-4 text-sm font-bold text-purple/65">Bugün için planlanmış görev yok.</p>
              )}
            </Card>

            <Card className="border-yellow/70 bg-yellow/35 p-6">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/65">Haftalık Momentum</p>
              {thisWeekTasks.length ? (
                <>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-4xl font-black">{thisWeekTasks.length}</p>
                      <p className="text-sm font-bold text-purple/65">bu hafta görev</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black">{weeklyCompleted}</p>
                      <p className="text-sm font-bold text-purple/65">tamamlandı</p>
                    </div>
                  </div>
                  <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/70">
                    <div className="h-full rounded-full bg-neon animate-fill-progress" style={{ width: `${weeklyRate}%` }} />
                  </div>
                  <p className="mt-3 text-sm font-black text-purple">%{weeklyRate} ilerleme</p>
                </>
              ) : (
                <p className="mt-4 rounded-2xl bg-white/70 p-4 text-sm font-bold text-purple/65">
                  Bu hafta için henüz veri yok.
                </p>
              )}
            </Card>

            <StreakCard />

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

            <Card className="p-6">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Son Hareketler</p>
              <h2 className="mt-2 text-xl font-black text-purple">Canlı akış</h2>
              <div className="mt-5">
                <ActivityTimeline />
              </div>
            </Card>

            <QuickAddTask />

            <Card className="border-neon/80 bg-neon/35 p-6">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/65">Insight</p>
              <div className="mt-5 space-y-3 text-sm">
                {apiTasks.length ? (
                  <>
                    <div className="rounded-2xl bg-white/70 p-4">Bugün en yoğun projen: <strong>{busiestProject?.name || "Proje yok"}</strong></div>
                    <div className="rounded-2xl bg-white/70 p-4">Bu hafta <strong>{thisWeekTasks.length}</strong> görevin var</div>
                    <div className="rounded-2xl bg-white/70 p-4"><strong>{overdueTasks.length}</strong> görev gecikmiş durumda</div>
                    <div className="rounded-2xl bg-white/70 p-4">Tamamlanan görev oranın <strong>%{completionRate}</strong></div>
                  </>
                ) : (
                  <p className="rounded-2xl bg-white/70 p-4 text-sm font-bold text-purple/65">Henüz analiz yapacak kadar görev yok.</p>
                )}
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
