import AppShell from "../../components/AppShell";
import { ProjectCard } from "../../components/ProjectCard";
import { Card } from "../../components/ui";

const projectCards = [
  { name: "Heptapus", active: 6, overdue: 1, next: "Yarın", accent: "burnt" as const },
  { name: "Cyber-Quanta", active: 4, overdue: 0, next: "Cuma", accent: "lagoon" as const },
  { name: "University", active: 2, overdue: 1, next: "Perşembe", accent: "lust" as const },
  { name: "Personal", active: 3, overdue: 0, next: "Cumartesi", accent: "copper" as const },
];

export default function ProjectsPage() {
  return (
    <AppShell activePage="projects">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-burnt">Proje panosu</p>
          <h1 className="mt-3 text-3xl font-semibold">Projeler</h1>
          <p className="mt-2 text-white/60">Her proje için aktif işleri, gecikenleri ve en yakın teslimi gör.</p>
        </Card>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {projectCards.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
