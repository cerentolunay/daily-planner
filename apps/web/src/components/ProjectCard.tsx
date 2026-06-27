type ProjectCardProps = {
  name: string;
  active: number;
  overdue: number;
  next: string;
  accent: "burnt" | "lagoon" | "copper" | "lust";
};

const accentClass = {
  burnt: "from-burnt/40 border-burnt/50 text-[#ffd4bd]",
  lagoon: "from-lagoon/40 border-lagoon/50 text-[#b9f4f9]",
  copper: "from-copper/60 border-copper/70 text-[#ffd3c8]",
  lust: "from-lust/30 border-lust/50 text-[#ffbbb5]",
};

export function ProjectCard({ name, active, overdue, next, accent }: ProjectCardProps) {
  return (
    <article className={`rounded-[28px] border bg-gradient-to-br ${accentClass[accent]} to-[#10232a] p-6 shadow-glow`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/50">Proje</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{name}</h2>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-white/10" />
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#0f2228]/70 p-4">
          <p className="text-2xl font-semibold text-white">{active}</p>
          <p className="text-xs text-white/50">aktif görev</p>
        </div>
        <div className="rounded-2xl bg-[#0f2228]/70 p-4">
          <p className={`text-2xl font-semibold ${overdue > 0 ? "text-[#ffb0a8]" : "text-white"}`}>{overdue}</p>
          <p className="text-xs text-white/50">geciken</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm">
        <span className="text-white/50">Sonraki teslim: </span>
        <span className="font-semibold text-white">{next}</span>
      </div>
    </article>
  );
}
