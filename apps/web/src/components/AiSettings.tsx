"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui";

type AiPreferences = {
  extraction: boolean;
  dailyPlan: boolean;
  summarization: boolean;
  autoGrouping: boolean;
  confidenceThreshold: string;
};

const storageKey = "dailyplanner.aiPreferences";

const defaults: AiPreferences = {
  extraction: true,
  dailyPlan: true,
  summarization: false,
  autoGrouping: false,
  confidenceThreshold: "70",
};

export function AiSettings() {
  const [preferences, setPreferences] = useState(defaults);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) setPreferences({ ...defaults, ...JSON.parse(raw) });
  }, []);

  function update(next: Partial<AiPreferences>) {
    const value = { ...preferences, ...next };
    setPreferences(value);
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["extraction", "AI görev çıkarımı"],
          ["dailyPlan", "AI günlük plan önerileri"],
          ["summarization", "AI özetleme"],
          ["autoGrouping", "AI otomatik gruplama"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center justify-between gap-4 rounded-2xl bg-white/70 p-4 font-bold text-purple">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={Boolean(preferences[key as keyof AiPreferences])}
              onChange={(event) => update({ [key]: event.target.checked } as Partial<AiPreferences>)}
              className="h-5 w-5 accent-purple"
            />
          </label>
        ))}
      </div>
      <label className="block space-y-2 font-bold text-purple">
        <span>AI confidence eşiği</span>
        <Input value={preferences.confidenceThreshold} onChange={(event) => update({ confidenceThreshold: event.target.value })} />
      </label>
    </div>
  );
}
