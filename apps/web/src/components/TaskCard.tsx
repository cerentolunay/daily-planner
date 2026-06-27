import { PriorityBadge, StatusBadge } from "./badges";

type TaskCardProps = {
  title: string;
  project: string;
  deadline: string;
  priority: "Düşük" | "Orta" | "Yüksek" | "Acil";
  status: "Yapılacak" | "Devam Ediyor" | "Beklemede" | "Tamamlandı" | "İptal Edildi";
  urgent?: boolean;
};

export function TaskCard({ title, project, deadline, priority, status, urgent }: TaskCardProps) {
  return (
    <article
      className={`rounded-3xl border p-5 transition hover:-translate-y-0.5 ${
        urgent
          ? "border-yellow/70 bg-yellow/10 shadow-[0_18px_38px_rgba(255,210,48,0.15)]"
          : "border-lilac/20 bg-night/60 hover:border-neon/50"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-7 text-white">{title}</h3>
          <p className="mt-2 text-sm text-lilac/70">{project}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <PriorityBadge priority={priority} />
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl border border-lilac/10 bg-white/[0.035] px-4 py-3 text-sm">
        <span className="text-lilac/60">Son tarih</span>
        <span className={urgent ? "font-bold text-yellow" : "font-semibold text-white/80"}>{deadline}</span>
      </div>
    </article>
  );
}
