type Priority = "Düşük" | "Orta" | "Yüksek" | "Acil";
type Status = "Yapılacak" | "Devam Ediyor" | "Beklemede" | "Tamamlandı" | "İptal Edildi";

const priorityClass: Record<Priority, string> = {
  Düşük: "border-purple/15 bg-lilac text-purple",
  Orta: "border-purple/35 bg-white text-purple",
  Yüksek: "border-yellow bg-yellow text-purple",
  Acil: "border-purple bg-purple text-white",
};

const statusClass: Record<Status, string> = {
  Yapılacak: "border-purple/15 bg-white text-purple",
  "Devam Ediyor": "border-yellow bg-yellow/70 text-purple",
  Beklemede: "border-lilac bg-lilac text-purple",
  Tamamlandı: "border-neon bg-neon text-purple",
  "İptal Edildi": "border-purple/10 bg-white/60 text-purple/55",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${priorityClass[priority]}`}>
      {priority}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[status]}`}>
      {status}
    </span>
  );
}
