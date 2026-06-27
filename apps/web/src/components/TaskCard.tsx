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
      className={`rounded-3xl border bg-white/78 p-5 text-purple shadow-[0_12px_26px_rgba(93,84,145,0.12)] transition hover:-translate-y-0.5 ${
        urgent ? "border-yellow ring-4 ring-yellow/25" : "border-white/80 hover:border-neon"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-7 text-purple">{title}</h3>
          <p className="mt-2 text-sm font-medium text-purple/62">{project}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <PriorityBadge priority={priority} />
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-lilac/45 px-4 py-3 text-sm">
        <span className="font-medium text-purple/58">Son tarih</span>
        <span className={urgent ? "font-bold text-purple" : "font-bold text-purple/80"}>{deadline}</span>
      </div>
    </article>
  );
}
