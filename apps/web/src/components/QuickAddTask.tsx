import { Button, Input } from "./ui";

export function QuickAddTask() {
  return (
    <div className="rounded-[28px] border border-burnt/30 bg-burnt/10 p-5">
      <p className="text-sm font-semibold text-[#ffd4bd]">Hızlı Ekle</p>
      <div className="mt-4 space-y-3">
        <Input placeholder="Yeni görev başlığı" />
        <Button className="w-full">Görev Ekle</Button>
      </div>
    </div>
  );
}
