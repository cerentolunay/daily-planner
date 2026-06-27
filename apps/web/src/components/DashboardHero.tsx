"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui";

type DashboardHeroProps = {
  todayCount: number;
  overdueCount: number;
  urgentCount: number;
  progressRate: number;
  focusTitle?: string;
};

function greetingForHour(hour: number) {
  if (hour >= 5 && hour < 12) {
    return {
      title: "Günaydın 👋",
      line: "Bugün neler başaracağız?",
    };
  }

  if (hour >= 12 && hour < 18) {
    return {
      title: "İyi çalışmalar ☀️",
      line: "Günün ritmini yakaladın mı?",
    };
  }

  if (hour >= 18 && hour < 23) {
    return {
      title: "İyi akşamlar 🌙",
      line: "Bugünü toparlayalım mı?",
    };
  }

  return {
    title: "Gece modu ✨",
    line: "Yarın için küçük bir plan iyi gelebilir.",
  };
}

function summaryText(todayCount: number, overdueCount: number, urgentCount: number, progressRate: number) {
  if (!todayCount) return "Bugün için planlanmış görev yok. Rahat bir gün olabilir.";
  if (urgentCount) return `Acil ${urgentCount} iş seni bekliyor.`;
  if (progressRate > 0) return `Bugünkü görevlerinin %${progressRate} kadarı tamamlandı.`;
  return `Bugün ${todayCount} görevin var, ${overdueCount} tanesi gecikmiş.`;
}

export function DashboardHero({ todayCount, overdueCount, urgentCount, progressRate, focusTitle }: DashboardHeroProps) {
  const [hour, setHour] = useState(9);

  useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  const greeting = useMemo(() => greetingForHour(hour), [hour]);

  return (
    <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[34px] border border-white/80 bg-white/75 p-6 text-purple shadow-glow md:p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">DailyPlanner</p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-purple md:text-5xl">{greeting.title}</h1>
        <p className="mt-3 text-xl font-black text-purple/78">{greeting.line}</p>
        <p className="mt-5 rounded-3xl bg-lilac/55 p-4 text-sm font-bold leading-6 text-purple/68">
          {summaryText(todayCount, overdueCount, urgentCount, progressRate)}
        </p>
      </div>

      <div className="group relative overflow-hidden rounded-[34px] border border-white/80 bg-yellow/70 p-6 text-purple shadow-glow transition duration-300 hover:-translate-y-1 md:p-8">
        <div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-neon/75 blur-2xl animate-float-soft" />
        <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-white/45 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/60">Bugünün ritmi</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight md:text-5xl">
            Planını netleştir, küçük adımlarla ilerle.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="flex items-center justify-between text-sm font-black">
                <span>Bugünkü tamamlanma</span>
                <span>%{progressRate}</span>
              </div>
              <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/70">
                <div className="h-full rounded-full bg-neon animate-fill-progress" style={{ width: `${progressRate}%` }} />
              </div>
              <p className="mt-4 text-sm font-bold text-purple/68">
                Bugünün odağı: <span className="font-black text-purple">{focusTitle || "Henüz odak görevi yok"}</span>
              </p>
            </div>
            <Link href="/tasks">
              <Button className="w-full md:w-auto">Yeni Görev</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
