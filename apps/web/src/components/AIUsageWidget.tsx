"use client";

import { useEffect, useState } from "react";
import { ApiAIUsageSummary, getAIUsageSummary } from "../lib/api";

export function AIUsageWidget() {
  const [summary, setSummary] = useState<ApiAIUsageSummary | null>(null);

  useEffect(() => {
    getAIUsageSummary().then(setSummary);
  }, []);

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Metric label="Toplam analiz" value={summary?.total_requests ?? 0} />
      <Metric label="Cache sonucu" value={summary?.cache_hits ?? 0} />
      <Metric label="Fallback" value={summary?.fallbacks ?? 0} />
      <Metric label="Başarı oranı" value={`%${Math.round((summary?.success_rate ?? 1) * 100)}`} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/70 p-4 text-purple">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold text-purple/60">{label}</p>
    </div>
  );
}
