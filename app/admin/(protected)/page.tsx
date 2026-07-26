import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CloudCog,
  FileText,
  ImageIcon,
  Images,
  Layers3,
  Rocket,
  Settings2
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
  const quickActions = [
    {
      href: "/admin/content",
      title: "Update site content",
      description: "Profile, headings, skills, social links and contact details",
      icon: Settings2
    },
    {
      href: "/admin/projects",
      title: "Manage projects",
      description: "Companies, case studies, freelance work and featured order",
      icon: BriefcaseBusiness
    },
    {
      href: "/admin/media",
      title: "Upload media",
      description: "Profile images, project visuals and the latest resume PDF",
      icon: ImageIcon
    },
    {
      href: "/admin/revisions",
      title: "Review history",
      description: "See every save and safely restore an earlier draft",
      icon: FileText
    }
  ];

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            What would you like to update?
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Choose a master below, save your changes privately, then return here
            to publish when the preview looks right.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 xl:min-w-[280px]">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                hasUnpublishedChanges
                  ? "bg-amber-400/15 text-amber-300"
                  : "bg-emerald-400/15 text-emerald-300"
              }`}
            >
              {hasUnpublishedChanges ? (
                <Rocket size={17} />
              ) : (
                <CheckCircle2 size={17} />
              )}
            </span>
            <div>
              <p className="text-sm font-bold">
                {hasUnpublishedChanges
                  ? "Draft ready for review"
                  : "Everything is published"}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Draft v{document.draftVersion} · Published v
                {document.publishedVersion}
              </p>
            </div>
          </div>
          <form action={publishDraftAction} className="mt-4">
            <AdminSubmitButton
              idleLabel="Publish saved draft"
              pendingLabel="Publishing…"
              disabled={!hasUnpublishedChanges}
              confirmation="Publish this saved draft to the public preview now?"
            />
          </form>
        </div>
      </header>

      <section aria-labelledby="quick-actions-heading">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="quick-actions-heading"
            className="font-display text-xl font-semibold"
          >
            Quick actions
          </h2>
          <span className="text-xs text-slate-600">Private draft workspace</span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-emerald-400/35 hover:bg-slate-800/75"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-emerald-300">
                  <Icon size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{action.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    {action.description}
                  </span>
                </span>
                <ArrowRight
                  size={17}
                  className="shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-emerald-300"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-label="Content totals" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article
              key={metric.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
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

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Current versions</p>
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
            How changes reach the preview
          </p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Edit", "Choose a content master"],
              ["2", "Save", "Create a private revision"],
              ["3", "Publish", "Refresh the public preview"]
            ].map(([number, title, description]) => (
              <li key={number} className="rounded-xl bg-slate-950/70 p-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-400 text-xs font-black text-slate-950">
                  {number}
                </span>
                <p className="mt-3 text-sm font-bold">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {description}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-slate-600">
            Last published{" "}
            {document.publishedAt.toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Kolkata"
            })}
          </p>
        </article>
      </section>
    </div>
  );
}
