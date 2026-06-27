import { useEffect, useState } from "react";
import { MobileShell } from "../src/components/MobileShell";
import { ProjectCard } from "../src/components/ProjectCard";
import { Button, Card, EmptyState, Input } from "../src/components/ui";
import { createProject, getProjects, getTasks } from "../src/lib/api";
import { ApiProject, ApiTask } from "../src/types";

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [name, setName] = useState("");

  async function load() {
    const [nextProjects, nextTasks] = await Promise.all([getProjects(), getTasks()]);
    setProjects(nextProjects);
    setTasks(nextTasks);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!name.trim()) return;
    await createProject({ name: name.trim(), description: "Mobilde oluşturuldu", color: "yellow" });
    setName("");
    load();
  }

  return (
    <MobileShell title="Projeler" eyebrow="Alanlar">
      <Card style={{ gap: 10 }}>
        <Input value={name} onChangeText={setName} placeholder="Yeni proje adı" />
        <Button onPress={save}>Proje Ekle</Button>
      </Card>
      {projects.length ? projects.map((project) => (
        <ProjectCard key={project.id} project={project} count={tasks.filter((task) => task.project_id === project.id).length} />
      )) : <EmptyState title="Henüz proje yok" text="İşlerini şirket, okul veya kişisel alanlara ayırabilirsin." />}
    </MobileShell>
  );
}
