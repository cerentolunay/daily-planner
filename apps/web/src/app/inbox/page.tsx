import AppShell from "../../components/AppShell";
import { InboxComposer } from "../../components/InboxComposer";
import { PriorityBadge, StatusBadge } from "../../components/badges";
import { Card } from "../../components/ui";
import { getInboxItems } from "../../lib/api";

export default async function InboxPage() {
  const inboxItems = await getInboxItems();
  const latestMessage = inboxItems[0]?.raw_text || "Abi cuma gününe kadar Codesight sunumunu hazırlar mısın?";

  return (
    <AppShell activePage="inbox">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Mesajdan göreve</p>
          <h1 className="mt-3 text-3xl font-black text-purple">Gelen Kutusu</h1>
          <p className="mt-2 max-w-2xl text-purple/68">
            WhatsApp veya e-posta metnini yapıştır, taslak görevi API üzerinden gelen kutusuna kaydet.
          </p>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1fr_0.72fr]">
          <Card className="p-6">
            <InboxComposer />
          </Card>

          <Card className="border-lilac bg-white/78 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Önizleme</p>
                <h2 className="mt-2 text-2xl font-black text-purple">Algılanan Görev</h2>
              </div>
              <PriorityBadge priority="Yüksek" />
            </div>

            <div className="mt-5 space-y-4 rounded-3xl bg-lilac/45 p-5">
              <div>
                <p className="text-sm font-bold text-purple/62">Orijinal mesaj</p>
                <p className="mt-2 rounded-2xl bg-white/70 p-4 text-sm leading-6 text-purple">
                  {latestMessage}
                </p>
              </div>
              <div className="grid gap-3 text-sm text-purple">
                <p>
                  <span className="text-purple/62">Başlık: </span>
                  <span className="font-black">Codesight sunumunu hazırla</span>
                </p>
                <p>
                  <span className="text-purple/62">Proje: </span>
                  <span className="font-black">Cyber-Quanta</span>
                </p>
                <p>
                  <span className="text-purple/62">Son tarih: </span>
                  <span className="font-black">Cuma</span>
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
