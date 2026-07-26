import {
  BriefcaseBusiness,
  FileClock,
  FileText,
  Gauge,
  ImageIcon,
  Settings2
} from "lucide-react";
import Link from "next/link";
import { AdminSignOutButton } from "@/components/admin/admin-auth-buttons";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const adminNavigation = [
  { href: "/admin", label: "Dashboard", icon: Gauge },
  { href: "/admin/content", label: "Content masters", icon: Settings2 },
  { href: "/admin/projects", label: "Projects", icon: BriefcaseBusiness },
  { href: "/admin/media", label: "Media & resume", icon: ImageIcon },
  { href: "/admin/revisions", label: "Revisions", icon: FileClock },
  { href: "/", label: "Public portfolio", icon: FileText }
];

export default async function AdminLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Aryan Portfolio
            </p>
            <p className="mt-1 font-display text-xl font-semibold">
              Content administration
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">{admin.name}</span>
            <AdminSignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside>
          <nav className="grid gap-2 sm:grid-cols-3 lg:sticky lg:top-6 lg:grid-cols-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/35 hover:text-white"
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
