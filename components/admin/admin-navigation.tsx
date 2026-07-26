"use client";

import {
  BriefcaseBusiness,
  ChevronRight,
  FileClock,
  Gauge,
  ImageIcon,
  LoaderCircle,
  Settings2
} from "lucide-react";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Status and publishing",
    icon: Gauge
  },
  {
    href: "/admin/content",
    label: "Site content",
    description: "Profile, copy and skills",
    icon: Settings2
  },
  {
    href: "/admin/projects",
    label: "Experience & projects",
    description: "Companies and case studies",
    icon: BriefcaseBusiness
  },
  {
    href: "/admin/media",
    label: "Media & resume",
    description: "Images and PDF files",
    icon: ImageIcon
  },
  {
    href: "/admin/revisions",
    label: "History",
    description: "Revisions and audit log",
    icon: FileClock
  }
];

function PendingIndicator() {
  const { pending } = useLinkStatus();

  return pending ? (
    <LoaderCircle
      size={15}
      aria-label="Loading page"
      className="shrink-0 animate-spin text-emerald-300"
    />
  ) : (
    <ChevronRight size={15} className="shrink-0 text-slate-600" />
  );
}

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin navigation"
      className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:pb-0"
    >
      {navigation.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={(event) => {
              const adminWindow = window as Window & {
                __portfolioAdminDirty?: boolean;
              };
              if (
                adminWindow.__portfolioAdminDirty &&
                !window.confirm(
                  "You have unsaved draft changes. Leave this page and discard them?"
                )
              ) {
                event.preventDefault();
              }
            }}
            className={`group flex min-w-[190px] items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition lg:min-w-0 ${
              active
                ? "border-emerald-400/35 bg-emerald-400/10 text-white shadow-lg shadow-emerald-950/10"
                : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            <span
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                active
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-slate-950 text-slate-400 group-hover:text-emerald-300"
              }`}
            >
              <Icon size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{item.label}</span>
              <span className="mt-0.5 hidden truncate text-[11px] text-slate-500 lg:block">
                {item.description}
              </span>
            </span>
            <PendingIndicator />
          </Link>
        );
      })}
    </nav>
  );
}
