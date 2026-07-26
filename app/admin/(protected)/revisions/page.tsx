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

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Saved versions</h2>
          <span className="text-xs text-slate-600">
            Newest first · {revisions.length} shown
          </span>
        </div>
        <div className="grid gap-3">
        {revisions.map((revision) => (
          <article
            key={revision.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl bg-slate-950 px-2 text-sm font-black text-emerald-300">
                v{revision.version}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold capitalize">
                    {revision.event} revision
                  </p>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    Private snapshot
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">
                  Saved by {revision.actor}
                </p>
                <time className="mt-1 block text-[11px] text-slate-600">
                {revision.createdAt.toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Kolkata"
                })}
                </time>
              </div>
            </div>
            <form action={restoreRevisionAction}>
              <input type="hidden" name="revisionId" value={revision.id} />
              <span className="inline-flex items-center gap-2">
                <RotateCcw size={14} className="text-slate-500" />
                <AdminSubmitButton
                  idleLabel="Restore to draft"
                  pendingLabel="Restoring…"
                  tone="neutral"
                  confirmation={`Restore version ${revision.version} into your private draft? Your published preview will not change.`}
                />
              </span>
            </form>
          </article>
        ))}
        </div>
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
