import { ApiInboxItem, ApiInboxThread, ApiProject, ApiTask, ApiTaskDraft, ApiUser, AuthResponse, CaptureQueueItem } from "../types";
import { clearAuthTokens, getAccessToken, getBackendUrl, getRefreshToken, setAuthTokens } from "./storage";

async function request<T>(path: string, options?: RequestInit, allowRefresh = true): Promise<T | null> {
  try {
    const baseUrl = await getBackendUrl();
    const token = await getAccessToken();
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers || {}),
      },
    });
    if (response.status === 401 && allowRefresh) {
      const refreshed = await refreshSession();
      if (refreshed) return request<T>(path, options, false);
    }
    if (!response.ok) return null;
    return response.status === 204 ? null : ((await response.json()) as T);
  } catch {
    return null;
  }
}

async function refreshSession() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;
  const baseUrl = await getBackendUrl();
  const response = await fetch(`${baseUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!response.ok) {
    await clearAuthTokens();
    return false;
  }
  const payload = (await response.json()) as AuthResponse;
  await setAuthTokens(payload.access_token, payload.refresh_token);
  return true;
}

async function list<T>(path: string): Promise<T[]> {
  return (await request<T[]>(path, { method: "GET" })) || [];
}

export function getTasks() {
  return list<ApiTask>("/tasks/");
}

export function registerUser(payload: { name: string; email: string; password: string }) {
  return request<{ detail: string }>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

export function verifyEmail(payload: { email: string; code: string }) {
  return request<{ detail: string }>("/auth/verify-email", { method: "POST", body: JSON.stringify(payload) });
}

export function resendVerification(email: string) {
  return request<{ detail: string }>("/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) });
}

export function loginUser(payload: { email: string; password: string }) {
  return request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export function forgotPassword(email: string) {
  return request<{ detail: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

export function resetPassword(payload: { email: string; code: string; new_password: string }) {
  return request<{ detail: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) });
}

export function getCurrentUser() {
  return request<ApiUser>("/auth/me", { method: "GET" });
}

export function createTask(payload: Partial<ApiTask>) {
  return request<ApiTask>("/tasks/", { method: "POST", body: JSON.stringify(payload) });
}

export function updateTask(id: string, payload: Partial<ApiTask>) {
  return request<ApiTask>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function deleteTask(id: string) {
  return request<{ detail: string }>(`/tasks/${id}`, { method: "DELETE" });
}

export function getProjects() {
  return list<ApiProject>("/projects/");
}

export function createProject(payload: Partial<ApiProject>) {
  return request<ApiProject>("/projects/", { method: "POST", body: JSON.stringify(payload) });
}

export function getInboxItems() {
  return list<ApiInboxItem>("/inbox/");
}

export function getInboxThreads() {
  return list<ApiInboxThread>("/inbox/threads");
}

export function createInboxItem(payload: {
  source_type: string;
  content_type: string;
  raw_text: string;
  title?: string | null;
  source_url?: string | null;
  metadata_json?: Record<string, unknown>;
}) {
  return request<ApiInboxItem>("/inbox/", { method: "POST", body: JSON.stringify(payload) });
}

export function createMobileInboxItem(payload: { source: "manual" | "whatsapp" | "android_share"; raw_text: string }) {
  return request<ApiInboxItem>("/api/inbox/", { method: "POST", body: JSON.stringify(payload) });
}

export function analyzeMobileInboxItem(id: string) {
  return request<ApiInboxItem>(`/api/inbox/${id}/analyze`, { method: "POST", body: JSON.stringify({}) });
}

export function convertMobileInboxItemToTasks(id: string) {
  return request<ApiTask[]>(`/api/inbox/${id}/convert-to-tasks`, { method: "POST", body: JSON.stringify({}) });
}

export function analyzeInboxItem(id: string) {
  return request<ApiTaskDraft>(`/inbox/${id}/analyze`, { method: "POST", body: JSON.stringify({}) });
}

export function createInboxThread(payload: { title: string; summary?: string; item_ids: string[]; status?: string }) {
  return request<ApiInboxThread>("/inbox/threads", { method: "POST", body: JSON.stringify(payload) });
}

export function analyzeInboxThread(id: string) {
  return request<ApiTaskDraft>(`/inbox/threads/${id}/analyze`, { method: "POST", body: JSON.stringify({}) });
}

export function analyzeText(text: string) {
  return request<ApiTaskDraft | Record<string, unknown>>("/ai/analyze/text", { method: "POST", body: JSON.stringify({ text }) });
}

export function analyzeThread(messages: string[]) {
  return request<ApiTaskDraft | Record<string, unknown>>("/ai/analyze/thread", { method: "POST", body: JSON.stringify({ messages }) });
}

export function createTaskDraft(payload: Partial<ApiTaskDraft>) {
  return request<ApiTaskDraft>("/task-drafts/", { method: "POST", body: JSON.stringify(payload) });
}

export function convertTaskDraftToTask(id: string) {
  return request<ApiTask>(`/task-drafts/${id}/convert-to-task`, { method: "POST", body: JSON.stringify({}) });
}

export async function submitCapture(item: CaptureQueueItem) {
  return createInboxItem({
    source_type: item.source_type,
    content_type: item.content_type,
    raw_text: item.raw_text,
    title: item.title,
    source_url: item.source_url,
    metadata_json: item.metadata_json,
  });
}

export function formatDeadline(deadline?: string | null) {
  if (!deadline) return "Son tarih yok";
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(deadline));
}
