"use client";

import { ChevronDown, ExternalLink } from "lucide-react";

type CollapsibleCardProps = {
  title: string;
  subtitle: string;
  duration: string;
  details: string[];
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
  defaultOpen = false,
  accent = "sky",
  link
}: CollapsibleCardProps) {
  const dotColor = accent === "emerald" ? "bg-emerald-400" : "bg-sky-400";
  const durationColor = accent === "emerald" ? "text-emerald-600" : "text-sky-600";

  return (
    <details
      open={defaultOpen}
      className="group rounded-3xl border border-white/80 bg-white/68 transition hover:border-slate-300"
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
