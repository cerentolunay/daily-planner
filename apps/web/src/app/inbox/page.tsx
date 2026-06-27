import AppShell from "../../components/AppShell";
import { SmartInbox } from "../../components/SmartInbox";
import { Card } from "../../components/ui";
import { getInboxItems, getInboxThreads, getTaskDrafts } from "../../lib/api";

export default async function InboxPage() {
  const [inboxItems, threads, drafts] = await Promise.all([getInboxItems(), getInboxThreads(), getTaskDrafts()]);

  return (
    <AppShell activePage="inbox">
      <section className="space-y-5">
        <Card className="overflow-hidden p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-purple/55">Universal Capture</p>
              <h1 className="mt-3 text-3xl font-black text-purple md:text-5xl">Smart Inbox</h1>
              <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-purple/68 md:text-base">
                WhatsApp, e-posta, link ve notlardan gelen dağınık işleri önce yakala, sonra ilişkili mesajları tek thread altında analiz edip görev taslağına dönüştür.
              </p>
            </div>
            <div className="rounded-3xl bg-neon/55 px-5 py-4 text-sm font-black text-purple">
              {inboxItems.length} kaynak · {threads.length} thread · {drafts.length} taslak
            </div>
          </div>
        </Card>

        <SmartInbox initialItems={inboxItems} initialThreads={threads} initialDrafts={drafts} />
      </section>
    </AppShell>
  );
}
