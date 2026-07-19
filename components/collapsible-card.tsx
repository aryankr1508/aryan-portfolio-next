"use client";

import { ChevronDown, ExternalLink, ArrowUpRight } from "lucide-react";
import type { ExperienceProject } from "@/lib/portfolio-data";

type CollapsibleCardProps = {
  title: string;
  subtitle: string;
  duration: string;
  details: string[];
  projects?: ExperienceProject[];
  defaultOpen?: boolean;
  accent?: "sky" | "emerald";
  link?: {
    label: string;
    url: string;
  };
  /** Called when user clicks "View in Projects" on a company project */
  onViewProject?: (projectName: string) => void;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CollapsibleCard({
  title,
  subtitle,
  duration,
  details,
  projects,
  defaultOpen = false,
  accent = "sky",
  link,
  onViewProject
}: CollapsibleCardProps) {
  const dotColor = accent === "emerald" ? "bg-emerald-400" : "bg-sky-400";
  const durationColor = accent === "emerald" ? "text-emerald-600" : "text-sky-600";

  return (
    <details
      open={defaultOpen}
      className="group showcase-card card-resume rounded-3xl border border-white/80 bg-white/68 transition hover:border-slate-300"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-6">
        <div className="space-y-2">
          <p className={`text-xs uppercase tracking-[0.14em] ${durationColor}`}>
            {duration}
          </p>
          <h4 className="font-display text-xl font-semibold text-slate-900">{title}</h4>
          <p className="text-sm font-medium text-slate-500">{subtitle}</p>
        </div>
        <span className="mt-1 rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition group-open:rotate-180">
          <ChevronDown size={16} />
        </span>
      </summary>

      <div className="space-y-4 px-6 pb-6">
        <ul className="space-y-2">
          {details.map((detail) => (
            <li key={detail} className="flex items-start gap-3 text-slate-600">
              <span className={`mt-1.5 h-2 w-2 rounded-full ${dotColor}`} />
              <span className="leading-relaxed">{detail}</span>
            </li>
          ))}
        </ul>

        {projects?.length ? (
          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Work from this role
            </p>
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                    {project.role ? (
                      <p className="text-xs font-medium text-slate-500">{project.role}</p>
                    ) : null}
                  </div>

                  {onViewProject ? (
                    <button
                      type="button"
                      onClick={() => onViewProject(slugify(project.name))}
                      className="view-project-badge inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-500/20 hover:text-blue-700"
                      aria-label={`Explore ${project.name} in Selected Work`}
                    >
                      Explore
                      <ArrowUpRight size={13} />
                    </button>
                  ) : null}

                  {!onViewProject && project.link ? (
                    <a
                      href={project.link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="button-ghost shrink-0 !px-3 !py-2"
                    >
                      {project.link.label}
                      <ExternalLink size={14} />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {link ? (
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="button-ghost"
          >
            {link.label}
            <ExternalLink size={15} />
          </a>
        ) : null}
      </div>
    </details>
  );
}
