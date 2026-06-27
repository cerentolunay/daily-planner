import AppShell from "../../components/AppShell";
import { Button, Card } from "../../components/ui";
import { TaskManager } from "../../components/TaskManager";
import { getProjects, getTasks } from "../../lib/api";

export default async function TasksPage() {
  const [apiTasks, projects] = await Promise.all([getTasks(), getProjects()]);

  return (
    <AppShell activePage="tasks">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Görev Merkezi</p>
              <h1 className="mt-3 text-3xl font-black text-purple">Görevler</h1>
              <p className="mt-2 text-purple/68">Tüm görevlerini öncelik, durum ve tarihe göre yönet.</p>
            </div>
            <Button>Görev Ekle</Button>
          </div>
        </Card>

        <TaskManager initialTasks={apiTasks} projects={projects} />
      </section>
    </AppShell>
  );
}
