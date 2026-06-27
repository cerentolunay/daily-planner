import { PriorityBadge, StatusBadge } from "./badges";

type TaskCardProps = {
  title: string;
  project: string;
  deadline: string;
  priority: "Düşük" | "Orta" | "Yüksek" | "Acil";
  status: "Yapılacak" | "Devam Ediyor" | "Beklemede" | "Tamamlandı" | "İptal Edildi";
  urgent?: boolean;
};

const accentClass = {
  Düşük: "bg-lilac",
  Orta: "bg-white",
  Yüksek: "bg-yellow",
  Acil: "bg-purple",
};

function remainingLabel(deadline: string, urgent?: boolean) {
  if (urgent) return "Gecikti";
  if (deadline === "Tarih yok") return "Son tarih yok";
  if (deadline.toLocaleLowerCase("tr-TR").includes("bugün")) return "Bugün bitmeli";
  if (deadline.toLocaleLowerCase("tr-TR").includes("yarın")) return "Yarın";
  return "Planlandı";
}

export function TaskCard({ title, project, deadline, priority, status, urgent }: TaskCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-3xl border bg-white/78 text-purple shadow-[0_12px_26px_rgba(93,84,145,0.12)] transition hover:-translate-y-0.5 ${
        urgent ? "border-yellow ring-4 ring-yellow/25" : "border-white/80 hover:border-neon"
      }`}
    >
      <div className={`h-2 ${urgent ? "bg-purple" : accentClass[priority]}`} />
      <div className="p-5">
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
      <div className="mt-5 grid gap-3 rounded-2xl bg-lilac/45 px-4 py-3 text-sm sm:grid-cols-2">
        <div>
          <span className="block font-medium text-purple/58">Son tarih</span>
          <span className={urgent ? "font-bold text-purple" : "font-bold text-purple/80"}>{deadline}</span>
        </div>
        <div className="sm:text-right">
          <span className="block font-medium text-purple/58">Kalan süre</span>
          <span className="font-black text-purple">{remainingLabel(deadline, urgent)}</span>
        </div>
      </div>
      </div>
    </article>
  );
}
