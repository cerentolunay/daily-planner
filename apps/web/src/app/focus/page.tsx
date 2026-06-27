import AppShell from "../../components/AppShell";
import { FocusClient } from "../../components/FocusClient";
import { Card } from "../../components/ui";
import { getProjects, getTasks } from "../../lib/api";
import { buildDailyPlan } from "../../lib/planner";

export default async function FocusPage() {
  const [tasks, projects] = await Promise.all([getTasks(), getProjects()]);
  const plan = buildDailyPlan(tasks, projects);

  return (
    <AppShell activePage="focus">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Odak Modu</p>
          <h1 className="mt-3 text-3xl font-black text-purple">Bugünün işine sakin bir başlangıç yap.</h1>
          <p className="mt-2 text-purple/68">Günlük plandan bir görev seç ve ileride eklenecek gerçek timer alanını hazır gör.</p>
        </Card>
        <FocusClient tasks={plan} />
      </section>
    </AppShell>
  );
}
