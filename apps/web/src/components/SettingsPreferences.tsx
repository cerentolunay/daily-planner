"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "./ui";

type Preferences = {
  sidebarCollapsed: boolean;
  deadlineReminder: boolean;
  showOverdue: boolean;
  dailySummary: boolean;
  weeklySummary: boolean;
  defaultPriority: "low" | "medium" | "high" | "urgent";
  defaultDeadlineHour: string;
};

const defaultPreferences: Preferences = {
  sidebarCollapsed: false,
  deadlineReminder: true,
  showOverdue: true,
  dailySummary: true,
  weeklySummary: false,
  defaultPriority: "medium",
  defaultDeadlineHour: "18",
};

const storageKey = "dailyplanner.preferences";

export function SettingsPreferences() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
  }, []);

  function update(next: Partial<Preferences>) {
    const value = { ...preferences, ...next };
    setPreferences(value);
    window.localStorage.setItem(storageKey, JSON.stringify(value));
    setMessage("Tercihler kaydedildi.");
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["deadlineReminder", "Deadline yaklaşınca hatırlat"],
          ["showOverdue", "Geciken görevleri göster"],
          ["dailySummary", "Günlük plan özeti"],
          ["weeklySummary", "Haftalık özet"],
          ["sidebarCollapsed", "Sidebar daraltılmış başlasın"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center justify-between gap-4 rounded-2xl bg-white/70 p-4 font-bold text-purple">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={Boolean(preferences[key as keyof Preferences])}
              onChange={(event) => update({ [key]: event.target.checked } as Partial<Preferences>)}
              className="h-5 w-5 accent-purple"
            />
          </label>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2 font-bold text-purple">
          <span>Varsayılan öncelik</span>
          <select
            value={preferences.defaultPriority}
            onChange={(event) => update({ defaultPriority: event.target.value as Preferences["defaultPriority"] })}
            className="w-full rounded-2xl border border-purple/18 bg-white/75 px-4 py-3 text-sm text-purple outline-none"
          >
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
            <option value="urgent">Acil</option>
          </select>
        </label>
        <label className="space-y-2 font-bold text-purple">
          <span>Varsayılan deadline saati</span>
          <Input value={preferences.defaultDeadlineHour} onChange={(event) => update({ defaultDeadlineHour: event.target.value })} />
        </label>
      </div>

      <Button onClick={() => update(defaultPreferences)}>Varsayılana Dön</Button>
      {message ? <p className="rounded-2xl bg-neon/55 p-3 text-sm font-bold text-purple">{message}</p> : null}
    </div>
  );
}
