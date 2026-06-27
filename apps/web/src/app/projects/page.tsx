import AppShell from "../../components/AppShell";
import { ProjectManager } from "../../components/ProjectManager";
import { Card } from "../../components/ui";
import { getProjects, getTasks } from "../../lib/api";

export default async function ProjectsPage() {
  const [projects, tasks] = await Promise.all([getProjects(), getTasks()]);

  return (
    <AppShell activePage="projects">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Proje panosu</p>
          <h1 className="mt-3 text-3xl font-black text-purple">Projeler</h1>
          <p className="mt-2 text-purple/68">Her proje için aktif işleri, gecikenleri ve en yakın teslimi gör.</p>
        </Card>

        <ProjectManager initialProjects={projects} tasks={tasks} />
      </section>
    </AppShell>
  );
}
