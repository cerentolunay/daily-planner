type ProjectCardProps = {
  name: string;
  active: number;
  overdue: number;
  next: string;
  accent: "yellow" | "neon" | "lilac" | "purple";
};

const accentClass = {
  yellow: "from-yellow/30 border-yellow/60 text-yellow",
  neon: "from-neon/25 border-neon/60 text-neon",
  lilac: "from-lilac/20 border-lilac/50 text-lilac",
  purple: "from-purple/70 border-purple text-lilac",
};

export function ProjectCard({ name, active, overdue, next, accent }: ProjectCardProps) {
  return (
    <article className={`rounded-[28px] border bg-gradient-to-br ${accentClass[accent]} to-night p-6 shadow-glow`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-lilac/70">Proje</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{name}</h2>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-white/10 ring-1 ring-lilac/20" />
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-night/70 p-4">
          <p className="text-2xl font-semibold text-white">{active}</p>
          <p className="text-xs text-lilac/70">aktif görev</p>
        </div>
        <div className="rounded-2xl bg-night/70 p-4">
          <p className={`text-2xl font-semibold ${overdue > 0 ? "text-yellow" : "text-white"}`}>{overdue}</p>
          <p className="text-xs text-lilac/70">geciken</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-lilac/20 bg-white/[0.035] px-4 py-3 text-sm">
        <span className="text-lilac/70">Sonraki teslim: </span>
        <span className="font-semibold text-white">{next}</span>
      </div>
    </article>
  );
}
