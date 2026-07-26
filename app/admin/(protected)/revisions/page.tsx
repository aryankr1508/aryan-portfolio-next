import { RotateCcw } from "lucide-react";
import { restoreRevisionAction } from "@/app/admin/(protected)/actions";
import AdminSubmitButton from "@/components/admin/admin-submit-button";
import {
  listPortfolioAuditEvents,
  listPortfolioRevisions
} from "@/lib/content/repository";

export default async function RevisionsPage() {
  const [revisions, auditEvents] = await Promise.all([
    listPortfolioRevisions(),
    listPortfolioAuditEvents(20)
  ]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
          Recovery and audit
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Revision history
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          Restoring a revision creates a new private draft. It never overwrites
          the public site until you review and publish it.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="grid grid-cols-[90px_110px_minmax(180px,1fr)_180px] gap-3 border-b border-slate-800 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
          <span>Version</span>
          <span>Event</span>
          <span>Actor</span>
          <span>Action</span>
        </div>
        {revisions.map((revision) => (
          <div
            key={revision.id}
            className="grid grid-cols-[90px_110px_minmax(180px,1fr)_180px] items-center gap-3 border-b border-slate-800 px-4 py-3 last:border-b-0"
          >
            <span className="font-semibold">v{revision.version}</span>
            <span className="text-sm capitalize text-slate-400">
              {revision.event}
            </span>
            <span className="text-sm text-slate-400">
              {revision.actor}
              <span className="mt-0.5 block text-xs text-slate-600">
                {revision.createdAt.toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Kolkata"
                })}
              </span>
            </span>
            <form action={restoreRevisionAction}>
              <input type="hidden" name="revisionId" value={revision.id} />
              <span className="inline-flex items-center gap-2">
                <RotateCcw size={14} className="text-slate-500" />
                <AdminSubmitButton
                  idleLabel="Restore to draft"
                  pendingLabel="Restoring…"
                  tone="neutral"
                />
              </span>
            </form>
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold">Recent audit events</h2>
        <div className="mt-4 grid gap-3">
          {auditEvents.map((event) => (
            <article
              key={event.id}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">{event.action}</p>
                <time className="text-xs text-slate-600">
                  {event.createdAt.toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata"
                  })}
                </time>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {event.actor} · {event.entity}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
