import { priorityLabels, statusLabels } from "../constants/labels";

export type ApiTask = {
  id: string;
  title: string;
  description?: string | null;
  project_id?: string | null;
  deadline?: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "waiting" | "done" | "cancelled";
  source_type: string;
  source_text?: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiProject = {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiInboxItem = {
  id: string;
  source_type: string;
  raw_text: string;
  detected_title?: string | null;
  detected_deadline?: string | null;
  detected_project?: string | null;
  detected_priority?: string | null;
  status: "pending" | "converted" | "dismissed";
  created_at: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T[]> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      ...options,
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
}

async function apiJson<T>(path: string, options: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      return null;
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export function getTasks() {
  return apiFetch<ApiTask>("/tasks/");
}

export function getProjects() {
  return apiFetch<ApiProject>("/projects/");
}

export function getInboxItems() {
  return apiFetch<ApiInboxItem>("/inbox/");
}

export const priorityLabel = priorityLabels;
export const statusLabel = statusLabels;

export type TaskPayload = {
  title: string;
  description?: string | null;
  project_id?: string | null;
  deadline?: string | null;
  priority?: ApiTask["priority"];
  status?: ApiTask["status"];
  source_type?: string;
  source_text?: string | null;
};

export type ProjectPayload = {
  name: string;
  description?: string | null;
  color?: string | null;
};

export function createTask(payload: TaskPayload) {
  return apiJson<ApiTask>("/tasks/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTask(taskId: string, payload: Partial<TaskPayload>) {
  return apiJson<ApiTask>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteTask(taskId: string) {
  return apiJson<{ detail: string }>(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export function createProject(payload: ProjectPayload) {
  return apiJson<ApiProject>("/projects/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteProject(projectId: string) {
  return apiJson<{ detail: string }>(`/projects/${projectId}`, {
    method: "DELETE",
  });
}

export function formatDeadline(deadline?: string | null) {
  if (!deadline) {
    return "Tarih yok";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(deadline));
}
