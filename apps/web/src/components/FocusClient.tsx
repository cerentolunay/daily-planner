"use client";

import { useMemo, useState } from "react";
import { priorityLabels } from "../constants/labels";
import { PlannedTask } from "../lib/planner";
import { updateTask } from "../lib/api";
import { celebrate, recordActivity } from "../lib/local-storage";
import { Button, Card } from "./ui";
import { PriorityBadge } from "./badges";

export function FocusClient({ tasks }: { tasks: PlannedTask[] }) {
  const [selectedId, setSelectedId] = useState(tasks[0]?.id || "");
  const [message, setMessage] = useState("");
  const selectedTask = useMemo(() => tasks.find((task) => task.id === selectedId) || tasks[0], [selectedId, tasks]);

  async function markDone() {
    if (!selectedTask) return;
    const saved = await updateTask(selectedTask.id, { status: "done" });
    setMessage(saved ? "Görev tamamlandı olarak işaretlendi." : "Görev güncellenemedi.");
    if (saved) {
      recordActivity("task_done", `${selectedTask.title} odak modunda tamamlandı`);
      celebrate("Odak tamam! Bir adım daha hafifledin 🎉");
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <Card className="p-5">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Bugünkü Plan</p>
        <div className="mt-4 space-y-3">
          {tasks.length ? (
            tasks.map((task, index) => (
              <button
                key={task.id}
                onClick={() => setSelectedId(task.id)}
                className={`w-full rounded-2xl p-4 text-left transition ${
                  selectedTask?.id === task.id ? "bg-yellow text-purple" : "bg-white/70 text-purple hover:bg-neon"
                }`}
              >
                <span className="text-xs font-black">#{index + 1}</span>
                <p className="mt-1 font-black">{task.title}</p>
                <p className="mt-1 text-sm font-medium text-purple/65">{task.projectName}</p>
              </button>
            ))
          ) : (
            <div className="rounded-3xl bg-white/70 p-5 text-sm font-bold leading-6 text-purple/65">
              Bugün için odak görevi yok. Küçük bir görev ekleyip günün ritmini başlatabilirsin.
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        {selectedTask ? (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Seçili Görev</p>
                <h2 className="mt-3 text-4xl font-black text-purple">{selectedTask.title}</h2>
                <p className="mt-3 text-purple/68">{selectedTask.projectName} · {selectedTask.importanceLabel}</p>
              </div>
              <PriorityBadge priority={priorityLabels[selectedTask.priority]} />
            </div>
            <div className="my-8 grid place-items-center rounded-[32px] bg-lilac/50 p-10">
              <div className="grid h-44 w-44 place-items-center rounded-full bg-yellow text-5xl font-black text-purple shadow-glow">25:00</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>Odaklanmaya Başla</Button>
              <Button variant="secondary" onClick={markDone}>Tamamlandı Olarak İşaretle</Button>
              <Button variant="ghost">Sonra Devam Et</Button>
            </div>
            {message ? <p className="mt-4 rounded-2xl bg-neon/55 p-3 text-sm font-bold text-purple">{message}</p> : null}
          </>
        ) : (
          <div className="rounded-3xl bg-white/70 p-8 text-center text-purple">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-yellow text-3xl">✨</div>
            <p className="mt-5 font-black">Bugünün odağı hazır değil.</p>
            <p className="mt-2 text-sm font-bold text-purple/65">Yeni bir görev eklediğinde burada odak akışı oluşacak.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
