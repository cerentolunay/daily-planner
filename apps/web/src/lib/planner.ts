import { ApiProject, ApiTask } from "./api";

export type PlannedTask = ApiTask & {
  projectName: string;
  importanceLabel: "Hemen ilgilen" | "Bugün bitmeli" | "Yakında önemli" | "Boşlukta yapılabilir";
  score: number;
};

const priorityWeight: Record<ApiTask["priority"], number> = {
  urgent: 40,
  high: 30,
  medium: 20,
  low: 10,
};

export function isSameDay(date: Date, other: Date) {
  return date.toDateString() === other.toDateString();
}

export function isOverdue(task: ApiTask, now = new Date()) {
  return Boolean(task.deadline && new Date(task.deadline) < now && task.status !== "done" && task.status !== "cancelled");
}

export function isTodayTask(task: ApiTask, now = new Date()) {
  return Boolean(task.deadline && isSameDay(new Date(task.deadline), now));
}

export function isTomorrowTask(task: ApiTask, now = new Date()) {
  if (!task.deadline) return false;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(new Date(task.deadline), tomorrow);
}

export function isUpcomingTask(task: ApiTask, days = 7, now = new Date()) {
  if (!task.deadline) return false;
  const value = new Date(task.deadline).getTime();
  return value > now.getTime() && value <= now.getTime() + days * 24 * 60 * 60 * 1000;
}

export function projectNameFor(task: ApiTask, projects: ApiProject[]) {
  return task.project_id ? projects.find((project) => project.id === task.project_id)?.name || "Proje yok" : "Proje yok";
}

export function buildDailyPlan(tasks: ApiTask[], projects: ApiProject[], now = new Date()): PlannedTask[] {
  return tasks
    .filter((task) => task.status !== "done" && task.status !== "cancelled")
    .map((task) => {
      const overdue = isOverdue(task, now);
      const today = isTodayTask(task, now);
      const upcoming = isUpcomingTask(task, 7, now);
      const noDeadlineInProgress = !task.deadline && task.status === "in_progress";
      let importanceLabel: PlannedTask["importanceLabel"] = "Boşlukta yapılabilir";
      let score = priorityWeight[task.priority];

      if (overdue) {
        score += 100;
        importanceLabel = "Hemen ilgilen";
      } else if (today && (task.priority === "urgent" || task.priority === "high")) {
        score += 80;
        importanceLabel = "Bugün bitmeli";
      } else if (today) {
        score += 60;
        importanceLabel = "Bugün bitmeli";
      } else if (upcoming && (task.priority === "urgent" || task.priority === "high")) {
        score += 40;
        importanceLabel = "Yakında önemli";
      } else if (noDeadlineInProgress) {
        score += 15;
        importanceLabel = "Boşlukta yapılabilir";
      }

      return {
        ...task,
        projectName: projectNameFor(task, projects),
        importanceLabel,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function completionRateForToday(tasks: ApiTask[], now = new Date()) {
  const todaysTasks = tasks.filter((task) => isTodayTask(task, now));
  if (!todaysTasks.length) return { completed: 0, total: 0, rate: 0 };
  const completed = todaysTasks.filter((task) => task.status === "done").length;
  return {
    completed,
    total: todaysTasks.length,
    rate: Math.round((completed / todaysTasks.length) * 100),
  };
}

export function weeklyTasks(tasks: ApiTask[], now = new Date()) {
  return tasks.filter((task) => isUpcomingTask(task, 7, now));
}
