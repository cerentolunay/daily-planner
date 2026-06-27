type Priority = "Düşük" | "Orta" | "Yüksek" | "Acil";
type Status = "Yapılacak" | "Devam Ediyor" | "Beklemede" | "Tamamlandı" | "İptal Edildi";

const priorityClass: Record<Priority, string> = {
  Düşük: "border-lagoon/50 bg-lagoon/20 text-[#b9f4f9]",
  Orta: "border-copper/70 bg-copper/40 text-[#ffd3c8]",
  Yüksek: "border-burnt/70 bg-burnt/20 text-[#ffd4bd]",
  Acil: "border-lust/70 bg-lust/20 text-[#ffbbb5]",
};

const statusClass: Record<Status, string> = {
  Yapılacak: "border-white/10 bg-white/[0.05] text-white/75",
  "Devam Ediyor": "border-burnt/60 bg-burnt/20 text-[#ffd4bd]",
  Beklemede: "border-copper/70 bg-copper/30 text-[#ffd3c8]",
  Tamamlandı: "border-lagoon/60 bg-lagoon/20 text-[#b9f4f9]",
  "İptal Edildi": "border-white/10 bg-white/[0.04] text-white/50",
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
