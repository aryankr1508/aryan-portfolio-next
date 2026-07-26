import {
  BriefcaseBusiness,
  CloudCog,
  FileText,
  Images,
  Layers3,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { publishDraftAction } from "@/app/admin/(protected)/actions";
import AdminSubmitButton from "@/components/admin/admin-submit-button";
import { isDatabaseConfigured } from "@/lib/db/client";
import { getPortfolioAdminDocument } from "@/lib/content/repository";

export default async function AdminDashboardPage() {
  if (!isDatabaseConfigured()) {
    return (
      <section className="rounded-3xl border border-amber-400/25 bg-amber-400/10 p-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
          Database setup required
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Connect PostgreSQL before editing
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-amber-100/80">
          The public portfolio is still using its checked-in fallback. Provision
          Neon, apply the committed migrations, and run the seed command to
          activate draft and publish workflows.
        </p>
      </section>
    );
  }

  const document = await getPortfolioAdminDocument();
  const content = document.draftContent;
  const companyProjectCount = content.experienceItems.reduce(
    (total, item) => total + (item.companyProjects?.length ?? 0),
    0
  );
  const hasUnpublishedChanges =
    JSON.stringify(document.draftContent) !==
    JSON.stringify(document.publishedContent);

  const metrics = [
    {
      label: "Companies",
      value: content.experienceItems.length,
      icon: BriefcaseBusiness
    },
    {
      label: "Company projects",
      value: companyProjectCount,
      icon: Layers3
    },
    {
      label: "Personal projects",
      value: content.projects.length,
      icon: CloudCog
    },
    {
      label: "Freelance projects",
      value: content.freelanceShowcaseProjects.length,
      icon: Rocket
    },
    {
      label: "Media references",
      value:
        content.projects.reduce(
          (total, project) => total + project.screenshots.length + 2,
          0
        ) + 2,
      icon: Images
    }
  ];

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            Control room
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            Portfolio publishing
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Edit and save private drafts freely. The public portfolio changes
            only when you publish a fully validated snapshot.
          </p>
        </div>

        <form action={publishDraftAction}>
          <AdminSubmitButton
            idleLabel={hasUnpublishedChanges ? "Publish draft" : "Republish current draft"}
            pendingLabel="Publishing…"
          />
        </form>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article
              key={metric.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <Icon size={17} className="text-emerald-300" />
              <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {metric.label}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
            Version state
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs text-slate-500">Draft</dt>
              <dd className="mt-1 text-xl font-semibold">
                v{document.draftVersion}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Published</dt>
              <dd className="mt-1 text-xl font-semibold">
                v{document.publishedVersion}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-slate-500">State</dt>
              <dd
                className={`mt-1 text-sm font-semibold ${
                  hasUnpublishedChanges ? "text-amber-300" : "text-emerald-300"
                }`}
              >
                {hasUnpublishedChanges
                  ? "Unpublished draft changes"
                  : "Draft matches production"}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
            Last publication
          </p>
          <p className="mt-4 text-lg font-semibold">
            {document.publishedAt.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Kolkata"
            })}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            By {document.publishedBy}
          </p>
          <Link
            href="/admin/revisions"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
          >
            <FileText size={15} />
            View revision history
          </Link>
        </article>
      </section>
    </div>
  );
}
