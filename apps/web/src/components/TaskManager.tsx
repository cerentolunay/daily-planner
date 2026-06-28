"use client";

import { useEffect, useMemo, useState } from "react";
import { priorityLabels, sortLabels, statusLabels, taskFilterLabels } from "../constants/labels";
import { ApiProject, ApiTask, createSubtask, deleteSubtask, createTask, deleteTask, getProjects, getTasks, updateSubtask, updateTask } from "../lib/api";
import { celebrate, recordActivity, readJson, storageKeys, writeJson } from "../lib/local-storage";
import { Button, Card, Input } from "./ui";
import { PriorityBadge, StatusBadge } from "./badges";

type UiTask = ApiTask & {
  projectName: string;
};

type TaskForm = {
  id?: string;
  title: string;
  description: string;
  project_id: string;
  deadline: string;
  priority: ApiTask["priority"];
  status: ApiTask["status"];
};

const emptyForm: TaskForm = {
  title: "",
  description: "",
  project_id: "",
  deadline: "",
  priority: "medium",
  status: "todo",
};

const priorityWeight: Record<ApiTask["priority"], number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function isToday(deadline?: string | null) {
  if (!deadline) return false;
  const value = new Date(deadline);
  const now = new Date();
  return value.toDateString() === now.toDateString();
}

function isOverdue(task: UiTask) {
  return Boolean(task.deadline && new Date(task.deadline) < new Date() && task.status !== "done");
}

function isUpcoming(task: UiTask) {
  if (!task.deadline) return false;
  const value = new Date(task.deadline).getTime();
  const now = Date.now();
  return value > now && value <= now + 7 * 24 * 60 * 60 * 1000;
}

function toLocalInputValue(deadline?: string | null) {
  if (!deadline) return "";
  const date = new Date(deadline);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function deadlineFor(action: "today" | "tomorrow" | "week" | "clear") {
  if (action === "clear") return null;
  const date = new Date();
  if (action === "tomorrow") date.setDate(date.getDate() + 1);
  if (action === "week") {
    const day = date.getDay();
    const friday = 5;
    const diff = (friday - day + 7) % 7 || 7;
    date.setDate(date.getDate() + diff);
  }
  date.setHours(18, 0, 0, 0);
  return date.toISOString();
}

export function TaskManager({ initialTasks, projects }: { initialTasks: ApiTask[]; projects: ApiProject[] }) {
  const [projectList, setProjectList] = useState(projects);
  const [tasks, setTasks] = useState<UiTask[]>(
    initialTasks.map((task) => ({
      ...task,
      projectName: projects.find((project) => project.id === task.project_id)?.name || "Proje yok",
    })),
  );
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof taskFilterLabels)[number]>("Tümü");
  const [sortBy, setSortBy] = useState<keyof typeof sortLabels>("deadline");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [subtaskDrafts, setSubtaskDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedFilter = readJson<(typeof taskFilterLabels)[number]>(storageKeys.lastSelectedFilter, "Tümü");
    if (taskFilterLabels.includes(storedFilter)) setFilter(storedFilter);
  }, []);

  useEffect(() => {
    async function loadUserData() {
      const [freshTasks, freshProjects] = await Promise.all([getTasks(), getProjects()]);
      setProjectList(freshProjects);
      setTasks(
        freshTasks.map((task) => ({
          ...task,
          projectName: freshProjects.find((project) => project.id === task.project_id)?.name || "Proje yok",
        })),
      );
    }

    loadUserData();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const text = `${task.title} ${task.description || ""} ${task.projectName}`.toLocaleLowerCase("tr-TR");
        const matchesSearch = text.includes(query.toLocaleLowerCase("tr-TR"));
        const matchesFilter =
          filter === "Tümü" ||
          (filter === "Bugün" && isToday(task.deadline)) ||
          (filter === "Yaklaşanlar" && isUpcoming(task)) ||
          (filter === "Gecikenler" && isOverdue(task)) ||
          (filter === "Tamamlananlar" && task.status === "done") ||
          (filter === "Acil" && task.priority === "urgent");
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "priority") return priorityWeight[b.priority] - priorityWeight[a.priority];
        if (sortBy === "created") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return new Date(a.deadline || "2999-01-01").getTime() - new Date(b.deadline || "2999-01-01").getTime();
      });
  }, [filter, query, sortBy, tasks]);

  function startEdit(task: UiTask) {
    setError("");
    setMessage("");
    setForm({
      id: task.id,
      title: task.title,
      description: task.description || "",
      project_id: task.project_id || "",
      deadline: toLocalInputValue(task.deadline),
      priority: task.priority,
      status: task.status,
    });
  }

  async function saveTask() {
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Başlık zorunludur.");
      return;
    }

    if (form.title.trim().length < 3) {
      setError("Başlık en az 3 karakter olmalıdır.");
      return;
    }

    setIsSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      project_id: form.project_id || null,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      priority: form.priority || "medium",
      status: form.status || "todo",
      source_type: "manual",
    };
    const saved = form.id ? await updateTask(form.id, payload) : await createTask(payload);
    setIsSaving(false);

    if (!saved) {
      setError("Görev kaydedilemedi.");
      return;
    }

    const projectName = projectList.find((project) => project.id === saved.project_id)?.name || "Proje yok";
    setTasks((current) =>
      form.id
        ? current.map((task) => (task.id === saved.id ? { ...saved, projectName } : task))
        : [{ ...saved, projectName }, ...current],
    );
    recordActivity(form.id ? "task_updated" : "task_created", form.id ? `${saved.title} güncellendi` : `${saved.title} oluşturuldu`);
    setForm(emptyForm);
    setMessage(form.id ? "Görev güncellendi." : "Görev başarıyla oluşturuldu.");
  }

  async function changeStatus(task: UiTask, status: ApiTask["status"]) {
    const previousStatus = task.status;
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, status } : item)));
    const saved = await updateTask(task.id, { status });
    if (!saved) {
      setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, status: previousStatus } : item)));
      setError("Durum güncellenemedi.");
      return;
    }
    recordActivity(status === "done" ? "task_done" : "task_updated", status === "done" ? `${task.title} tamamlandı` : `${task.title} durumu güncellendi`);
    if (status === "done") celebrate();
  }

  async function scheduleTask(task: UiTask, action: "today" | "tomorrow" | "week" | "clear") {
    const deadline = deadlineFor(action);
    const saved = await updateTask(task.id, { deadline });
    if (!saved) {
      setError("Son tarih güncellenemedi.");
      return;
    }
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, deadline } : item)));
    recordActivity("task_updated", `${task.title} son tarihi güncellendi`);
    setMessage("Son tarih güncellendi.");
  }

  async function removeTask(task: UiTask) {
    if (!window.confirm("Bu görevi silmek istediğine emin misin?")) return;
    const result = await deleteTask(task.id);
    if (!result) {
      setError("Görev silinemedi.");
      return;
    }
    setTasks((current) => current.filter((item) => item.id !== task.id));
  }

  async function addSubtask(task: UiTask) {
    const title = subtaskDrafts[task.id]?.trim();
    if (!title) return;
    const saved = await createSubtask(task.id, { title, position: task.subtasks?.length || 0 });
    if (!saved) {
      setError("Yapılacak eklenemedi.");
      return;
    }
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, subtasks: [...(item.subtasks || []), saved] } : item)));
    setSubtaskDrafts((current) => ({ ...current, [task.id]: "" }));
    recordActivity("task_updated", `${task.title} için yapılacak eklendi`);
  }

  async function toggleSubtask(task: UiTask, subtaskId: string, isCompleted: boolean) {
    const saved = await updateSubtask(task.id, subtaskId, { is_completed: isCompleted });
    if (!saved) {
      setError("Yapılacak güncellenemedi.");
      return;
    }
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? { ...item, subtasks: (item.subtasks || []).map((subtask) => (subtask.id === subtaskId ? saved : subtask)) }
          : item,
      ),
    );
  }

  async function removeSubtask(task: UiTask, subtaskId: string) {
    const result = await deleteSubtask(task.id, subtaskId);
    if (!result) {
      setError("Yapılacak silinemedi.");
      return;
    }
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, subtasks: (item.subtasks || []).filter((subtask) => subtask.id !== subtaskId) } : item,
      ),
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card className="p-5 md:p-6">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <Input data-task-search="true" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Görevlerde ara..." />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as keyof typeof sortLabels)}
            className="rounded-2xl border border-purple/18 bg-white/75 px-4 py-3 text-sm font-bold text-purple outline-none"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="my-5 flex flex-wrap gap-3">
          {taskFilterLabels.map((item) => (
            <button
              key={item}
              onClick={() => {
                setFilter(item);
                writeJson(storageKeys.lastSelectedFilter, item);
              }}
              className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
                filter === item ? "bg-yellow text-purple" : "bg-white/65 text-purple hover:bg-neon"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {error ? <p className="mb-4 rounded-2xl bg-yellow/40 p-3 text-sm font-bold text-purple">{error}</p> : null}
        {message ? <p className="mb-4 rounded-2xl bg-neon/55 p-3 text-sm font-bold text-purple">{message}</p> : null}

        <div className="space-y-4">
          {filteredTasks.length ? (
            filteredTasks.map((task) => (
              <article key={task.id} className="rounded-3xl border border-white/80 bg-white/78 p-5 shadow-[0_12px_26px_rgba(93,84,145,0.12)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-purple">{task.title}</h3>
                    <p className="mt-2 text-sm font-medium text-purple/62">{task.projectName}</p>
                    <p className="mt-2 text-sm text-purple/60">{task.description || "Açıklama yok"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <PriorityBadge priority={priorityLabels[task.priority]} />
                    <StatusBadge status={statusLabels[task.status]} />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <select
                    value={task.status}
                    onChange={(event) => changeStatus(task, event.target.value as ApiTask["status"])}
                    className="rounded-2xl border border-purple/15 bg-lilac/45 px-4 py-3 text-sm font-bold text-purple outline-none"
                  >
                    {(["todo", "in_progress", "waiting", "done"] as const).map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => startEdit(task)}>Düzenle</Button>
                    <Button variant="ghost" onClick={() => changeStatus(task, "done")}>Tamamla</Button>
                    <Button variant="secondary" onClick={() => removeTask(task)}>Sil</Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="ghost" onClick={() => scheduleTask(task, "today")}>Bugüne Al</Button>
                  <Button variant="ghost" onClick={() => scheduleTask(task, "tomorrow")}>Yarına Al</Button>
                  <Button variant="ghost" onClick={() => scheduleTask(task, "week")}>Bu Hafta</Button>
                  <Button variant="ghost" onClick={() => scheduleTask(task, "clear")}>Son Tarihi Temizle</Button>
                </div>
                <div className="mt-4 rounded-3xl bg-lilac/45 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-black text-purple">Yapılacaklar</p>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black text-purple">
                      {(task.subtasks || []).filter((subtask) => subtask.is_completed).length}/{task.subtasks?.length || 0} tamamlandı
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {(task.subtasks || []).length ? (
                      (task.subtasks || []).map((subtask) => (
                        <label key={subtask.id} className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 text-sm font-bold text-purple">
                          <input
                            type="checkbox"
                            checked={subtask.is_completed}
                            onChange={(event) => toggleSubtask(task, subtask.id, event.target.checked)}
                            className="h-5 w-5 accent-purple"
                          />
                          <span className={subtask.is_completed ? "flex-1 text-purple/50 line-through" : "flex-1"}>{subtask.title}</span>
                          <button type="button" onClick={() => removeSubtask(task, subtask.id)} className="rounded-xl bg-lilac px-3 py-1 text-xs font-black text-purple">
                            Sil
                          </button>
                        </label>
                      ))
                    ) : (
                      <p className="rounded-2xl bg-white/60 p-3 text-sm font-bold text-purple/60">
                        Bu görev için henüz yapılacak yok.
                      </p>
                    )}
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                    <Input
                      value={subtaskDrafts[task.id] || ""}
                      onChange={(event) => setSubtaskDrafts((current) => ({ ...current, [task.id]: event.target.value }))}
                      placeholder="Yeni yapılacak ekle"
                    />
                    <Button variant="ghost" onClick={() => addSubtask(task)}>Ekle</Button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[30px] border border-white/80 bg-white/75 p-8 text-center text-purple shadow-glow">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-yellow text-3xl">🎈</div>
              <h3 className="mt-5 text-2xl font-black">Bugün tertemiz görünüyor</h3>
              <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-purple/65">
                İstersen küçük bir görev ekleyerek gününü planlamaya başlayabilirsin.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">
          {form.id ? "Görevi Düzenle" : "Yeni Görev"}
        </p>
        <div className="mt-5 space-y-3">
          <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Başlık" />
          <Input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Açıklama" />
          <select value={form.project_id} onChange={(event) => setForm({ ...form, project_id: event.target.value })} className="w-full rounded-2xl border border-purple/18 bg-white/75 px-4 py-3 text-sm text-purple outline-none">
            <option value="">Proje yok</option>
            {projectList.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <Input type="datetime-local" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} />
          <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as ApiTask["priority"] })} className="w-full rounded-2xl border border-purple/18 bg-white/75 px-4 py-3 text-sm text-purple outline-none">
            {Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ApiTask["status"] })} className="w-full rounded-2xl border border-purple/18 bg-white/75 px-4 py-3 text-sm text-purple outline-none">
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <Button className="w-full" onClick={saveTask} disabled={isSaving}>
            {isSaving ? "Kaydediliyor" : form.id ? "Güncelle" : "Görev Oluştur"}
          </Button>
          {form.id ? (
            <Button className="w-full" variant="ghost" onClick={() => setForm(emptyForm)}>
              Vazgeç
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
