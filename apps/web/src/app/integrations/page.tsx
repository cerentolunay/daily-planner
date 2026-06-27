import AppShell from "../../components/AppShell";
import { Card } from "../../components/ui";

const integrations = [
  { name: "WhatsApp", source: "whatsapp", description: "WhatsApp mesajlarını paylaşarak veya ileride Business API ile yakala." },
  { name: "Gmail", source: "email", description: "E-postalardan görevleri yakala ve Inbox’a düşür." },
  { name: "Google Calendar", source: "calendar", description: "Deadline ve etkinliklerini planınla senkronize et." },
  { name: "Slack", source: "slack", description: "Kanal mesajlarından iş sinyallerini Smart Inbox’a aktar." },
  { name: "GitHub", source: "github", description: "Issue, PR ve yorumlardan yapılacakları yakala." },
  { name: "Discord", source: "discord", description: "Topluluk ve ekip konuşmalarından görev adaylarını çıkar." },
  { name: "Notion", source: "notion", description: "Notion notlarından planner görevleri oluştur." },
  { name: "Outlook", source: "email", description: "Outlook e-postalarını yakalama akışına hazırla." },
];

export default function IntegrationsPage() {
  return (
    <AppShell activePage="integrations">
      <section className="space-y-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Connector Center</p>
          <h1 className="mt-3 text-3xl font-black text-purple md:text-5xl">Entegrasyonlar</h1>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-purple/68">
            Gerçek bağlantılar sonraki sürümlerde gelecek. Bu merkez kaynak tiplerini, mimari hazırlığı ve yakalama akışlarını görünür kılar.
          </p>
        </Card>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {integrations.map((integration, index) => (
            <article key={integration.name} className="overflow-hidden rounded-[30px] border border-white/80 bg-white/75 text-purple shadow-glow">
              <div className={index % 3 === 0 ? "h-3 bg-yellow" : index % 3 === 1 ? "h-3 bg-neon" : "h-3 bg-purple"} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-purple/55">{integration.source}</p>
                    <h2 className="mt-3 text-2xl font-black">{integration.name}</h2>
                  </div>
                  <span className="rounded-full bg-lilac px-3 py-1 text-xs font-black text-purple">Yakında</span>
                </div>
                <p className="mt-5 text-sm font-bold leading-6 text-purple/65">{integration.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
