type ProjectCardProps = {
  name: string;
  active: number;
  total?: number;
  done?: number;
  overdue: number;
  next: string;
  accent: "yellow" | "neon" | "lilac" | "purple";
};

const accentClass = {
  yellow: "bg-yellow",
  neon: "bg-neon",
  lilac: "bg-lilac",
  purple: "bg-purple",
};

export function ProjectCard({ name, active, total, done = 0, overdue, next, accent }: ProjectCardProps) {
  const totalTasks = total ?? active + done + overdue;

  return (
    <article className="overflow-hidden rounded-[30px] border border-white/70 bg-white/78 text-purple shadow-glow">
      <div className={`h-3 ${accentClass[accent]}`} />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple/55">Proje</p>
            <h2 className="mt-3 text-2xl font-black text-purple">{name}</h2>
          </div>
          <div className={`grid h-11 w-11 place-items-center rounded-2xl ${accentClass[accent]} text-sm font-black text-purple`}>
            {name.slice(0, 1)}
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/65 p-4">
            <p className="text-2xl font-black text-purple">{totalTasks}</p>
            <p className="text-xs font-medium text-purple/62">toplam görev</p>
          </div>
          <div className="rounded-2xl bg-lilac/45 p-4">
            <p className="text-2xl font-black text-purple">{active}</p>
            <p className="text-xs font-medium text-purple/62">aktif görev</p>
          </div>
          <div className="rounded-2xl bg-neon/45 p-4">
            <p className="text-2xl font-black text-purple">{done}</p>
            <p className="text-xs font-medium text-purple/62">tamamlanan</p>
          </div>
          <div className="rounded-2xl bg-yellow/35 p-4">
            <p className="text-2xl font-black text-purple">{overdue}</p>
            <p className="text-xs font-medium text-purple/62">geciken</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-neon/45 px-4 py-3 text-sm">
          <span className="font-medium text-purple/65">Sonraki teslim: </span>
          <span className="font-black text-purple">{next}</span>
        </div>
      </div>
    </article>
  );
}
