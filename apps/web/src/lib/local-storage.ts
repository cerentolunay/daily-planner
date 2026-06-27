"use client";

export type ActivityType = "task_created" | "task_done" | "task_updated" | "project_created" | "inbox_converted";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  text: string;
  createdAt: string;
};

const prefix = "dailyplanner";

export const storageKeys = {
  activities: `${prefix}.activities`,
  streakDays: `${prefix}.streakDays`,
  preferences: `${prefix}.preferences`,
  lastSelectedFilter: `${prefix}.lastSelectedFilter`,
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function recordActivity(type: ActivityType, text: string) {
  const activities = readJson<ActivityItem[]>(storageKeys.activities, []);
  const next = [
    {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      text,
      createdAt: new Date().toISOString(),
    },
    ...activities,
  ].slice(0, 10);

  writeJson(storageKeys.activities, next);
  window.dispatchEvent(new CustomEvent("dailyplanner:activity", { detail: next }));
}

export function celebrate(message = "Harika! Bir görev daha tamamlandı 🎉") {
  window.dispatchEvent(new CustomEvent("dailyplanner:celebrate", { detail: { message } }));
}

export function trackStreakDay() {
  const today = new Date().toISOString().slice(0, 10);
  const days = readJson<string[]>(storageKeys.streakDays, []);
  if (!days.includes(today)) {
    writeJson(storageKeys.streakDays, [...days, today].sort());
  }
}

export function getCurrentStreak(days: string[]) {
  if (!days.length) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const daySet = new Set(days);

  while (daySet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
