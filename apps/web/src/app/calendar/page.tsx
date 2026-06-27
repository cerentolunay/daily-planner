import AppShell from "../../components/AppShell";
import { TaskCard } from "../../components/TaskCard";
import { Card } from "../../components/ui";
import { formatDeadline, getProjects, getTasks, priorityLabel, statusLabel } from "../../lib/api";

const weekDays = [
  { day: "Pzt", date: "24", tasks: 1, accent: "bg-neon/45" },
  { day: "Sal", date: "25", tasks: 0, accent: "bg-white/72" },
  { day: "Çar", date: "26", tasks: 2, accent: "bg-yellow/45" },
  { day: "Per", date: "27", tasks: 1, accent: "bg-purple/12" },
  { day: "Cum", date: "28", tasks: 3, accent: "bg-lilac/55" },
  { day: "Cmt", date: "29", tasks: 1, accent: "bg-neon/35" },
  { day: "Paz", date: "30", tasks: 0, accent: "bg-white/72" },
];

export default async function CalendarPage() {
  const [apiTasks, projects] = await Promise.all([getTasks(), getProjects()]);
  const projectMap = new Map(projects.map((project) => [project.id, project.name]));
  const tasks = apiTasks.slice(0, 2).map((task) => ({
    id: task.id,
    title: task.title,
    project: task.project_id ? projectMap.get(task.project_id) || "Proje yok" : "Proje yok",
    deadline: formatDeadline(task.deadline),
    priority: priorityLabel[task.priority],
    status: statusLabel[task.status],
    urgent: task.priority === "urgent",
  }));

  const visibleTasks = tasks;

  return (
    <AppShell activePage="calendar">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Haftalık akış</p>
          <h1 className="mt-3 text-3xl font-black text-purple">Takvim</h1>
          <p className="mt-2 text-purple/68">Bu haftanın görev yoğunluğunu günlere göre açık ve ferah şekilde takip et.</p>
        </Card>

        <Card className="p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-7">
            {weekDays.map((item) => (
              <div key={item.day} className={`min-h-[150px] rounded-3xl p-4 text-purple shadow-[0_10px_22px_rgba(93,84,145,0.1)] ${item.accent}`}>
                <div className="flex items-center justify-between">
                  <p className="font-black">{item.day}</p>
                  <p className="rounded-full bg-white/70 px-3 py-1 text-sm font-bold text-purple">{item.date}</p>
                </div>
                <p className="mt-5 text-3xl font-black">{item.tasks}</p>
                <p className="mt-1 text-sm font-medium text-purple/62">görev</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-2">
          {visibleTasks.length ? (
            visibleTasks.map((task) => (
              <TaskCard key={task.id} {...task} />
            ))
          ) : (
            <div className="rounded-[30px] border border-white/80 bg-white/75 p-8 text-center text-purple shadow-glow xl:col-span-2">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-neon text-3xl">☀️</div>
              <h2 className="mt-5 text-2xl font-black">Bu hafta sakin görünüyor</h2>
              <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-purple/65">
                Deadline eklediğin görevler burada belirecek.
              </p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
