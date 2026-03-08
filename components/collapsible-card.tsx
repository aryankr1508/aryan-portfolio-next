"use client";

import { ChevronDown, ExternalLink } from "lucide-react";
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
};

export default function CollapsibleCard({
  title,
  subtitle,
  duration,
  details,
  projects,
  defaultOpen = false,
  accent = "sky",
  link
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
              Project Deep Dives
            </p>
            <div className="space-y-3">
              {projects.map((project) => (
                <details key={project.name} className="group/project rounded-2xl border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                      <p className="text-xs leading-relaxed text-slate-600">{project.summary}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 transition group-open/project:rotate-180">
                      <ChevronDown size={14} />
                    </span>
                  </summary>

                  <div className="space-y-3 px-4 pb-4">
                    {project.role ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-teal-700">
                        {project.role}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={`${project.name}-${tech}`}
                          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <ul className="space-y-1.5">
                      {project.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className={`mt-1.5 h-2 w-2 rounded-full ${dotColor}`} />
                          <span className="leading-relaxed">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {project.confidentialityNote ? (
                      <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                        {project.confidentialityNote}
                      </p>
                    ) : null}

                    {project.link ? (
                      <a href={project.link.url} target="_blank" rel="noreferrer" className="button-ghost">
                        {project.link.label}
                        <ExternalLink size={15} />
                      </a>
                    ) : null}
                  </div>
                </details>
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
