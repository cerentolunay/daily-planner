"use client";

import { useMemo, useState } from "react";

type CalendarPreviewTask = {
  id: string;
  title: string;
  project: string;
  deadline?: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "waiting" | "done" | "cancelled";
};

type CalendarPreviewProps = {
  tasks?: CalendarPreviewTask[];
};

const dayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const priorityStyles = {
  low: "bg-lilac text-purple",
  medium: "bg-white text-purple",
  high: "bg-yellow text-purple",
  urgent: "bg-purple text-white",
};

const priorityLabels = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  urgent: "Acil",
};

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function startOfWeek(date: Date) {
  const day = date.getDay() || 7;
  const monday = startOfDay(date);
  monday.setDate(monday.getDate() - day + 1);
  return monday;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatTime(deadline?: string | null) {
  if (!deadline) return "Saat yok";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "Saat yok";
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function CalendarPreview({ tasks = [] }: CalendarPreviewProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(today);

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  }, [selectedDate]);

  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, CalendarPreviewTask[]>();
    tasks.forEach((task) => {
      if (!task.deadline) return;
      const deadline = new Date(task.deadline);
      if (Number.isNaN(deadline.getTime())) return;
      const key = dateKey(deadline);
      grouped.set(key, [...(grouped.get(key) || []), task]);
    });
    return grouped;
  }, [tasks]);

  const selectedKey = dateKey(selectedDate);
  const selectedTasks = tasksByDate.get(selectedKey) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setSelectedDate((current) => addDays(current, -1))}
          className="rounded-2xl bg-white/75 px-4 py-2 text-sm font-black text-purple shadow-[0_8px_18px_rgba(93,84,145,0.08)] transition hover:bg-neon"
        >
          Önceki gün
        </button>
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-purple/55">Seçili gün</p>
          <p className="mt-1 text-sm font-black text-purple">{formatShortDate(selectedDate)}</p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedDate((current) => addDays(current, 1))}
          className="rounded-2xl bg-yellow px-4 py-2 text-sm font-black text-purple shadow-[0_8px_18px_rgba(93,84,145,0.08)] transition hover:bg-neon"
        >
          Sonraki gün
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const key = dateKey(day);
          const isSelected = key === selectedKey;
          const isToday = key === dateKey(today);
          const dayTaskCount = tasksByDate.get(key)?.length || 0;

          return (
            <button
              type="button"
              key={key}
              onClick={() => setSelectedDate(day)}
              className={`min-h-[86px] rounded-2xl p-2 text-center transition hover:-translate-y-0.5 hover:bg-neon sm:p-3 ${
                isSelected ? "bg-yellow text-purple shadow-[0_12px_24px_rgba(93,84,145,0.16)]" : "bg-white/70 text-purple/70"
              }`}
              aria-pressed={isSelected}
            >
              <p className="text-[11px] font-black sm:text-xs">{dayLabels[index]}</p>
              <p className="mt-2 text-lg font-black">{day.getDate()}</p>
              <div className="mt-2 flex items-center justify-center gap-1">
                {isToday ? <span className="h-2 w-2 rounded-full bg-neon ring-2 ring-purple/10" /> : null}
                <span className="rounded-full bg-purple/10 px-2 py-0.5 text-[10px] font-black text-purple">{dayTaskCount}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl bg-white/68 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-purple">{formatShortDate(selectedDate)} planı</p>
            <p className="mt-1 text-xs font-bold text-purple/58">{selectedTasks.length ? `${selectedTasks.length} görev var` : "Bu güne görev eklenmemiş"}</p>
          </div>
          <span className="rounded-full bg-neon px-3 py-1 text-xs font-black text-purple">Aynı sayfa</span>
        </div>

        <div className="mt-4 space-y-3">
          {selectedTasks.length ? (
            selectedTasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-purple/10 bg-lilac/45 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-purple">{task.title}</p>
                    <p className="mt-1 text-xs font-bold text-purple/58">{task.project}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${priorityStyles[task.priority]}`}>
                    {priorityLabels[task.priority]}
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold text-purple/60">{formatTime(task.deadline)}</p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-lilac/55 p-4 text-sm font-bold leading-6 text-purple/62">
              Salı, Perşembe ya da başka bir güne tıklayarak aynı kart içinde o günün planını görebilirsin. Deadline eklenen görevler burada listelenir.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
