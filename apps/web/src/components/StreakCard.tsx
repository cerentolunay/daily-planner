"use client";

import { useEffect, useState } from "react";
import { getCurrentStreak, readJson, storageKeys, trackStreakDay } from "../lib/local-storage";

export function StreakCard() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    trackStreakDay();
    const days = readJson<string[]>(storageKeys.streakDays, []);
    setStreak(getCurrentStreak(days));
  }, []);

  return (
    <div className="rounded-[30px] border border-white/70 bg-purple p-6 text-white shadow-glow">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-lilac">Planlama Serisi</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-yellow text-3xl">🔥</div>
        <div>
          <p className="text-4xl font-black">{streak || 1} gün</p>
          <p className="mt-1 text-sm font-bold text-lilac">
            {streak > 1 ? "Plan ritmin güzel gidiyor." : "Bugün ilk planlama günün. Güzel başlangıç!"}
          </p>
        </div>
      </div>
    </div>
  );
}
