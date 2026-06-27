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
  source_thread_id?: string | null;
  source_inbox_item_id?: string | null;
  created_at: string;
  updated_at: string;
  subtasks?: ApiSubtask[];
};

export type ApiSubtask = {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  position: number;
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
  content_type: "text" | "url" | "file" | "image" | "voice" | "note";
  raw_text: string;
  title?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  metadata_json?: Record<string, unknown> | null;
  detected_title?: string | null;
  detected_deadline?: string | null;
  detected_project?: string | null;
  detected_priority?: string | null;
  status: "unprocessed" | "analyzed" | "converted" | "dismissed" | "archived" | "pending";
  thread_id?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type ApiInboxThread = {
  id: string;
  title: string;
  summary?: string | null;
  project_hint?: string | null;
  deadline_hint?: string | null;
  priority_hint?: string | null;
  confidence: number;
  status: "open" | "reviewed" | "converted" | "archived";
  created_at: string;
  updated_at: string;
  items: ApiInboxItem[];
};

export type ApiTaskDraft = {
  id: string;
  thread_id?: string | null;
  title: string;
  description?: string | null;
  project_hint?: string | null;
  deadline?: string | null;
  priority: ApiTask["priority"];
  status: ApiTask["status"];
  confidence: number;
  analysis_json?: Record<string, unknown> | null;
  subtasks_json?: string[] | null;
  created_at: string;
  updated_at: string;
};

export type ApiAIUsageSummary = {
  total_requests: number;
  cache_hits: number;
  fallbacks: number;
  success_rate: number;
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

async function apiJsonResult<T>(path: string, options: RequestInit): Promise<{ data: T | null; error?: string }> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    const payload = response.status === 204 ? null : await response.json();
    if (!response.ok) {
      const detail = payload?.detail;
      return { data: null, error: detail?.message || "AI analizi sırasında bir sorun oluştu." };
    }
    return { data: payload };
  } catch {
    return { data: null, error: "Backend ile bağlantı kurulamadı." };
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

export function getInboxThreads() {
  return apiFetch<ApiInboxThread>("/inbox/threads");
}

export function getTaskDrafts() {
  return apiFetch<ApiTaskDraft>("/task-drafts/");
}

export function getAIUsageSummary() {
  return apiJson<ApiAIUsageSummary>("/ai/usage/summary", {
    method: "GET",
  });
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
  source_thread_id?: string | null;
  source_inbox_item_id?: string | null;
  subtasks?: Array<{ title: string; is_completed?: boolean; position?: number }>;
};

export type InboxPayload = {
  source_type?: string;
  content_type?: ApiInboxItem["content_type"];
  raw_text: string;
  title?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  status?: string;
  metadata_json?: Record<string, unknown> | null;
};

export type ThreadPayload = {
  title: string;
  summary?: string | null;
  project_hint?: string | null;
  priority_hint?: string | null;
  confidence?: number;
  status?: string;
  item_ids?: string[];
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

export function createSubtask(taskId: string, payload: { title: string; position?: number }) {
  return apiJson<ApiSubtask>(`/tasks/${taskId}/subtasks`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSubtask(taskId: string, subtaskId: string, payload: Partial<Pick<ApiSubtask, "title" | "is_completed" | "position">>) {
  return apiJson<ApiSubtask>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteSubtask(taskId: string, subtaskId: string) {
  return apiJson<{ detail: string }>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: "DELETE",
  });
}

export function createInboxItem(payload: InboxPayload) {
  return apiJson<ApiInboxItem>("/inbox/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateInboxItem(itemId: string, payload: Partial<InboxPayload>) {
  return apiJson<ApiInboxItem>(`/inbox/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteInboxItem(itemId: string) {
  return apiJson<{ detail: string }>(`/inbox/${itemId}`, {
    method: "DELETE",
  });
}

export function createInboxThread(payload: ThreadPayload) {
  return apiJson<ApiInboxThread>("/inbox/threads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function analyzeInboxThread(threadId: string) {
  return apiJsonResult<ApiTaskDraft>(`/inbox/threads/${threadId}/analyze`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function analyzeInboxItem(itemId: string) {
  return apiJsonResult<ApiTaskDraft>(`/inbox/${itemId}/analyze`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function convertTaskDraft(draftId: string) {
  return apiJson<ApiTask>(`/task-drafts/${draftId}/convert-to-task`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function updateTaskDraft(draftId: string, payload: Partial<ApiTaskDraft>) {
  return apiJson<ApiTaskDraft>(`/task-drafts/${draftId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
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
