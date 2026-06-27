import AppShell from "../../../components/AppShell";
import { Card } from "../../../components/ui";
import { getProjects, getTasks } from "../../../lib/api";
import { isOverdue, weeklyTasks } from "../../../lib/planner";

export default async function WeeklyReviewPage() {
  const [tasks, projects] = await Promise.all([getTasks(), getProjects()]);
  const week = weeklyTasks(tasks);
  const completed = week.filter((task) => task.status === "done");
  const overdue = tasks.filter((task) => isOverdue(task));
  const busiestProject = projects
    .map((project) => ({ name: project.name, count: tasks.filter((task) => task.project_id === project.id).length }))
    .sort((a, b) => b.count - a.count)[0];

  const metrics = [
    { label: "Toplam görev", value: week.length, color: "bg-yellow/45" },
    { label: "Tamamlanan", value: completed.length, color: "bg-neon/45" },
    { label: "En yoğun proje", value: busiestProject?.name || "Yok", color: "bg-white/75" },
    { label: "Geciken işler", value: overdue.length, color: "bg-lilac/65" },
  ];

  return (
    <AppShell activePage="today">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Weekly Review</p>
          <h1 className="mt-3 text-3xl font-black text-purple md:text-5xl">Haftalık Özet</h1>
          <p className="mt-3 text-sm font-bold text-purple/65">Haftanın ritmini gör, sonraki hafta için daha net bir başlangıç hazırla.</p>
        </Card>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className={`rounded-[30px] border border-white/75 p-6 text-purple shadow-glow ${metric.color}`}>
              <p className="text-3xl font-black">{metric.value}</p>
              <p className="mt-2 text-sm font-bold text-purple/65">{metric.label}</p>
            </div>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-black text-purple">Sonraki hafta önerileri</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <p className="rounded-2xl bg-white/70 p-4 text-sm font-bold text-purple">Geciken işleri haftanın ilk odak bloğuna al.</p>
            <p className="rounded-2xl bg-white/70 p-4 text-sm font-bold text-purple">En yoğun projede maksimum 3 öncelik belirle.</p>
            <p className="rounded-2xl bg-white/70 p-4 text-sm font-bold text-purple">Smart Inbox thread’lerini haftalık plan öncesi temizle.</p>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
