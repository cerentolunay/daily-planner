import AppShell from "../../components/AppShell";
import { PriorityBadge, StatusBadge } from "../../components/badges";
import { Button, Card, Textarea } from "../../components/ui";

export default function InboxPage() {
  return (
    <AppShell activePage="inbox">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-burnt">Mesajdan göreve</p>
          <h1 className="mt-3 text-3xl font-semibold">Gelen Kutusu</h1>
          <p className="mt-2 max-w-2xl text-white/60">
            WhatsApp veya e-posta metnini yapıştır, şimdilik örnek algılama kartı üzerinden göreve dönüştür.
          </p>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1fr_0.72fr]">
          <Card className="p-6">
            <label className="block text-sm font-semibold text-white/80">WhatsApp mesajını yapıştır</label>
            <div className="mt-3">
              <Textarea placeholder="Abi cuma gününe kadar Codesight sunumunu hazırlar mısın?" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button>Görev Çıkar</Button>
              <Button variant="ghost">Taslak Kaydet</Button>
            </div>
          </Card>

          <Card className="border-lagoon/40 bg-lagoon/10 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#b9f4f9]">Önizleme</p>
                <h2 className="mt-2 text-2xl font-semibold">Algılanan Görev</h2>
              </div>
              <PriorityBadge priority="Yüksek" />
            </div>

            <div className="mt-5 space-y-4 rounded-3xl border border-white/10 bg-[#0f2228]/80 p-5">
              <div>
                <p className="text-sm text-white/50">Orijinal mesaj</p>
                <p className="mt-2 rounded-2xl bg-white/[0.045] p-4 text-sm leading-6 text-white/90">
                  Abi cuma gününe kadar Codesight sunumunu hazırlar mısın?
                </p>
              </div>
              <div className="grid gap-3 text-sm">
                <p>
                  <span className="text-white/50">Başlık: </span>
                  <span className="font-semibold">Codesight sunumunu hazırla</span>
                </p>
                <p>
                  <span className="text-white/50">Proje: </span>
                  <span className="font-semibold">Cyber-Quanta</span>
                </p>
                <p>
                  <span className="text-white/50">Son tarih: </span>
                  <span className="font-semibold">Cuma</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <PriorityBadge priority="Yüksek" />
                  <StatusBadge status="Yapılacak" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
