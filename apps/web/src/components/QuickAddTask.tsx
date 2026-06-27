import { Button, Input } from "./ui";

export function QuickAddTask() {
  return (
    <div className="rounded-[30px] border border-yellow/70 bg-yellow/35 p-5 text-purple shadow-[0_14px_28px_rgba(255,210,48,0.18)]">
      <p className="text-sm font-black">Hızlı Ekle</p>
      <div className="mt-4 space-y-3">
        <Input placeholder="Yeni görev başlığı" />
        <Button className="w-full">Görev Ekle</Button>
      </div>
    </div>
  );
}
