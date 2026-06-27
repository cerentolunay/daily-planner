import AppShell from "../../components/AppShell";
import { TaskCard } from "../../components/TaskCard";
import { Card } from "../../components/ui";

const weekDays = [
  { day: "Pzt", date: "24", tasks: 1, accent: "border-neon/50 bg-neon/10" },
  { day: "Sal", date: "25", tasks: 0, accent: "border-lilac/20 bg-white/[0.035]" },
  { day: "Çar", date: "26", tasks: 2, accent: "border-yellow/50 bg-yellow/10" },
  { day: "Per", date: "27", tasks: 1, accent: "border-purple/70 bg-purple/40" },
  { day: "Cum", date: "28", tasks: 3, accent: "border-lilac/50 bg-lilac/10" },
  { day: "Cmt", date: "29", tasks: 1, accent: "border-neon/40 bg-neon/10" },
  { day: "Paz", date: "30", tasks: 0, accent: "border-lilac/20 bg-white/[0.035]" },
];

export default function CalendarPage() {
  return (
    <AppShell activePage="calendar">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-yellow">Haftalık akış</p>
          <h1 className="mt-3 text-3xl font-semibold">Takvim</h1>
          <p className="mt-2 text-lilac/75">Bu haftanın görev yoğunluğunu günlere göre takip et.</p>
        </Card>

        <Card className="p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-7">
            {weekDays.map((item) => (
              <div key={item.day} className={`min-h-[150px] rounded-3xl border p-4 ${item.accent}`}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{item.day}</p>
                  <p className="rounded-full bg-night/75 px-3 py-1 text-sm text-lilac">{item.date}</p>
                </div>
                <p className="mt-5 text-3xl font-semibold">{item.tasks}</p>
                <p className="mt-1 text-sm text-lilac/70">görev</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-2">
          <TaskCard
            title="Codesight sunumunu hazırla"
            project="Cyber-Quanta"
            deadline="Cuma"
            priority="Yüksek"
            status="Devam Ediyor"
          />
          <TaskCard
            title="DMS dokümantasyonunu tamamla"
            project="University"
            deadline="Geçen hafta"
            priority="Acil"
            status="Beklemede"
            urgent
          />
        </div>
      </section>
    </AppShell>
  );
}
