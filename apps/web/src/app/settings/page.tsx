import AppShell from "../../components/AppShell";
import { Card } from "../../components/ui";

export default function SettingsPage() {
  return (
    <AppShell activePage="settings">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-burnt">Tercihler</p>
          <h1 className="mt-3 text-3xl font-semibold">Ayarlar</h1>
          <p className="mt-2 text-white/60">Uygulama ayarları sonraki sürümlerde eklenecek.</p>
        </Card>

        <Card className="border-copper/60 bg-copper/30 p-6">
          <p className="text-white/80">Bu ekran temel altyapıyı hazırlamak için oluşturuldu.</p>
        </Card>
      </section>
    </AppShell>
  );
}
