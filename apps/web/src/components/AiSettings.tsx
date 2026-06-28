"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui";
import { Select } from "./ui/Select";

type AiPreferences = {
  enabled: boolean;
  provider: "mock" | "gemini";
  extraction: boolean;
  dailyPlan: boolean;
  summarization: boolean;
  autoGrouping: boolean;
  fallback: boolean;
  cache: boolean;
  confidenceThreshold: string;
  dailyLimit: string;
};

const storageKey = "dailyplanner.aiPreferences";

const defaults: AiPreferences = {
  enabled: true,
  provider: "gemini",
  extraction: true,
  dailyPlan: true,
  summarization: false,
  autoGrouping: false,
  fallback: true,
  cache: true,
  confidenceThreshold: "70",
  dailyLimit: "20",
};

const providerOptions = [
  { value: "mock", label: "Mock" },
  { value: "gemini", label: "Gemini" },
] satisfies Array<{ value: AiPreferences["provider"]; label: string }>;

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
          ["enabled", "AI aktif"],
          ["extraction", "AI görev çıkarımı"],
          ["dailyPlan", "AI günlük plan önerileri"],
          ["summarization", "AI özetleme"],
          ["autoGrouping", "AI otomatik gruplama"],
          ["fallback", "Fallback açık"],
          ["cache", "Cache açık"],
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
        <span>Provider</span>
        <Select
          value={preferences.provider}
          onChange={(provider) => update({ provider })}
          options={providerOptions}
        />
      </label>
      <label className="block space-y-2 font-bold text-purple">
        <span>AI confidence eşiği</span>
        <Input value={preferences.confidenceThreshold} onChange={(event) => update({ confidenceThreshold: event.target.value })} />
      </label>
      <label className="block space-y-2 font-bold text-purple">
        <span>Günlük limit bilgisi</span>
        <Input value={preferences.dailyLimit} onChange={(event) => update({ dailyLimit: event.target.value })} />
      </label>
    </div>
  );
}
