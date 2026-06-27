"use client";

import { useEffect, useState } from "react";
import { ActivityItem, readJson, storageKeys } from "../lib/local-storage";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ActivityTimeline() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    setActivities(readJson<ActivityItem[]>(storageKeys.activities, []));

    function onActivity(event: Event) {
      setActivities((event as CustomEvent<ActivityItem[]>).detail || []);
    }

    window.addEventListener("dailyplanner:activity", onActivity);
    return () => window.removeEventListener("dailyplanner:activity", onActivity);
  }, []);

  return (
    <div className="space-y-3">
      {activities.length ? (
        activities.map((activity) => (
          <div key={activity.id} className="grid grid-cols-[64px_1fr] gap-3 rounded-2xl bg-white/70 p-4 text-sm">
            <span className="font-black text-purple/55">{formatTime(activity.createdAt)}</span>
            <span className="font-bold text-purple">{activity.text}</span>
          </div>
        ))
      ) : (
        <div className="rounded-3xl bg-white/70 p-5 text-sm font-bold leading-6 text-purple/65">
          Henüz hareket yok. Bir görev eklediğinde, tamamladığında veya inbox’tan iş çıkardığında burada canlı bir akış oluşacak.
        </div>
      )}
    </div>
  );
}
