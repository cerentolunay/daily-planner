"use client";

import { useMemo, useState } from "react";
import { ApiProject, ApiTask, createProject, deleteProject } from "../lib/api";
import { Button, Card, Input } from "./ui";
import { ProjectCard } from "./ProjectCard";

const accents = ["yellow", "neon", "lilac", "purple"] as const;

export function ProjectManager({ initialProjects, tasks }: { initialProjects: ApiProject[]; tasks: ApiTask[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("yellow");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      `${project.name} ${project.description || ""}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")),
    );
  }, [projects, query]);

  async function saveProject() {
    setError("");
    setMessage("");

    if (name.trim().length < 2) {
      setError("Proje adı en az 2 karakter olmalıdır.");
      return;
    }

    const saved = await createProject({
      name: name.trim(),
      description: description.trim() || null,
      color,
    });

    if (!saved) {
      setError("Proje oluşturulamadı.");
      return;
    }

    setProjects((current) => [saved, ...current]);
    setName("");
    setDescription("");
    setColor("yellow");
    setMessage("Proje başarıyla oluşturuldu.");
  }

  async function removeProject(project: ApiProject) {
    if (!window.confirm("Bu projeyi silmek istediğine emin misin?")) return;
    const result = await deleteProject(project.id);
    if (!result) {
      setError("Proje silinemedi.");
      return;
    }
    setProjects((current) => current.filter((item) => item.id !== project.id));
  }

  function metricsFor(projectId: string) {
    const projectTasks = tasks.filter((task) => task.project_id === projectId);
    return {
      total: projectTasks.length,
      active: projectTasks.filter((task) => task.status !== "done" && task.status !== "cancelled").length,
      done: projectTasks.filter((task) => task.status === "done").length,
      overdue: projectTasks.filter((task) => task.priority === "urgent").length,
    };
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card className="p-5 md:p-6">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Projelerde ara..." />
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.length ? (
            filteredProjects.map((project, index) => {
              const metrics = metricsFor(project.id);
              return (
                <div key={project.id} className="space-y-3">
                  <ProjectCard
                    name={project.name}
                    active={metrics.active}
                    overdue={metrics.overdue}
                    done={metrics.done}
                    total={metrics.total}
                    next="Yakında"
                    accent={accents[index % accents.length]}
                  />
                  <Button className="w-full" variant="ghost" onClick={() => removeProject(project)}>
                    Projeyi Sil
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl bg-white/70 p-8 text-center font-bold text-purple md:col-span-2 xl:col-span-3">
              Henüz proje yok.
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Yeni Proje</p>
        <div className="mt-5 space-y-3">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Proje adı" />
          <Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Açıklama" />
          <div className="grid grid-cols-4 gap-2">
            {accents.map((item) => (
              <button
                key={item}
                onClick={() => setColor(item)}
                className={`h-12 rounded-2xl border-2 ${item === color ? "border-purple" : "border-white/80"} ${
                  item === "yellow" ? "bg-yellow" : item === "neon" ? "bg-neon" : item === "lilac" ? "bg-lilac" : "bg-purple"
                }`}
                aria-label={`${item} rengi`}
              />
            ))}
          </div>
          {error ? <p className="rounded-2xl bg-yellow/45 p-3 text-sm font-bold text-purple">{error}</p> : null}
          {message ? <p className="rounded-2xl bg-neon/55 p-3 text-sm font-bold text-purple">{message}</p> : null}
          <Button className="w-full" onClick={saveProject}>
            Proje Oluştur
          </Button>
        </div>
      </Card>
    </div>
  );
}
