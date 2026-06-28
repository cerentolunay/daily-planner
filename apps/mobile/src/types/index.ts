export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "waiting" | "done" | "cancelled";

export type ApiSubtask = {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  position: number;
};

export type ApiTask = {
  id: string;
  title: string;
  description?: string | null;
  deadline?: string | null;
  priority: Priority;
  status: TaskStatus;
  project_id?: string | null;
  source_type: string;
  source_text?: string | null;
  subtasks?: ApiSubtask[];
};

export type ApiProject = {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
};

export type ApiInboxItem = {
  id: string;
  source_type: string;
  content_type: "text" | "url" | "file" | "image" | "voice" | "note";
  raw_text: string;
  title?: string | null;
  status: "unprocessed" | "analyzed" | "converted" | "dismissed" | "archived" | "pending";
  thread_id?: string | null;
};

export type ApiInboxThread = {
  id: string;
  title: string;
  summary?: string | null;
  confidence: number;
  status: "open" | "reviewed" | "converted" | "archived";
  items: ApiInboxItem[];
};

export type ApiTaskDraft = {
  id: string;
  thread_id?: string | null;
  title: string;
  description?: string | null;
  project_hint?: string | null;
  deadline?: string | null;
  priority: Priority;
  status: TaskStatus;
  confidence: number;
  analysis_json?: Record<string, unknown> | null;
  subtasks_json?: string[] | null;
};

export type CaptureQueueItem = {
  id: string;
  raw_text: string;
  title: string;
  source_type: "manual" | "whatsapp" | "web";
  content_type: "text" | "url";
  source_url?: string | null;
  created_at: string;
  metadata_json: Record<string, unknown>;
};

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  is_email_verified: boolean;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  user: ApiUser;
};
