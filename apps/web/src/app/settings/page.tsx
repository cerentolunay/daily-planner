import AppShell from "../../components/AppShell";
import { SettingsPreferences } from "../../components/SettingsPreferences";
import { Card } from "../../components/ui";

export default function SettingsPage() {
  return (
    <AppShell activePage="settings">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Tercihler</p>
          <h1 className="mt-3 text-3xl font-black text-purple">Ayarlar</h1>
          <p className="mt-2 text-purple/68">Uygulama ayarları sonraki sürümlerde eklenecek.</p>
        </Card>

        <Card className="border-neon/80 bg-neon/35 p-6">
          <p className="font-medium text-purple">Bu ekran temel altyapıyı hazırlamak için oluşturuldu.</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Bildirim ve Tercihler</p>
          <div className="mt-5">
            <SettingsPreferences />
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
