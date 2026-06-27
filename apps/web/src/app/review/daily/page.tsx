import AppShell from "../../../components/AppShell";
import { Card } from "../../../components/ui";
import { getTasks } from "../../../lib/api";
import { isOverdue, isTodayTask } from "../../../lib/planner";

export default async function DailyReviewPage() {
  const tasks = await getTasks();
  const completed = tasks.filter((task) => isTodayTask(task) && task.status === "done");
  const postponed = tasks.filter((task) => isTodayTask(task) && task.status !== "done");
  const overdue = tasks.filter((task) => isOverdue(task));

  return (
    <AppShell activePage="today">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Daily Review</p>
          <h1 className="mt-3 text-3xl font-black text-purple md:text-5xl">Bugünün Özeti</h1>
          <p className="mt-3 text-sm font-bold text-purple/65">Günü kapatmadan önce tamamlananları, ertelenenleri ve yarın için küçük önerileri gör.</p>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <ReviewCard title="Tamamlanan görevler" items={completed.map((task) => task.title)} empty="Bugün tamamlanan görev yok." accent="bg-neon" />
          <ReviewCard title="Ertelenen görevler" items={postponed.map((task) => task.title)} empty="Bugünden yarına taşınacak görev görünmüyor." accent="bg-yellow" />
          <ReviewCard title="Geciken görevler" items={overdue.map((task) => task.title)} empty="Geciken görev yok. Hafif bir kapanış." accent="bg-purple" />
          <ReviewCard title="Yarın için öneriler" items={postponed.slice(0, 3).map((task) => `${task.title} için 25 dakikalık odak bloğu ayır`)} empty="Yarın için öneri oluşturacak görev yok." accent="bg-lilac" />
        </div>
      </section>
    </AppShell>
  );
}

function ReviewCard({ title, items, empty, accent }: { title: string; items: string[]; empty: string; accent: string }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className={`h-3 ${accent}`} />
      <div className="p-6">
        <h2 className="text-2xl font-black text-purple">{title}</h2>
        <div className="mt-4 space-y-2">
          {items.length ? items.map((item) => <p key={item} className="rounded-2xl bg-white/70 p-3 text-sm font-bold text-purple">{item}</p>) : <p className="rounded-2xl bg-white/70 p-3 text-sm font-bold text-purple/65">{empty}</p>}
        </div>
      </div>
    </Card>
  );
}
