const days = [
  { label: "Pzt", date: "24", active: false },
  { label: "Sal", date: "25", active: false },
  { label: "Çar", date: "26", active: true },
  { label: "Per", date: "27", active: false },
  { label: "Cum", date: "28", active: false },
  { label: "Cmt", date: "29", active: false },
  { label: "Paz", date: "30", active: false },
];

export function CalendarPreview() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => (
        <div
          key={day.label}
          className={`rounded-2xl border p-3 text-center ${
            day.active ? "border-burnt bg-burnt text-[#1A2C30]" : "border-white/10 bg-[#0f2228] text-white/60"
          }`}
        >
          <p className="text-xs font-semibold">{day.label}</p>
          <p className="mt-2 text-lg font-bold">{day.date}</p>
        </div>
      ))}
    </div>
  );
}
