import { ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AdminSignOutButton } from "@/components/admin/admin-auth-buttons";
import AdminNavigation from "@/components/admin/admin-navigation";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4">
          <Link href="/admin" className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <ShieldCheck size={19} />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                Preview workspace
              </span>
              <span className="block truncate font-display text-lg font-semibold">
                Portfolio admin
              </span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/40 hover:text-white"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">View portfolio</span>
            </Link>
            <div className="hidden text-right md:block">
              <p className="text-xs font-semibold text-slate-300">{admin.name}</p>
              <p className="text-[10px] text-slate-600">Owner access</p>
            </div>
            <AdminSignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 sm:px-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-7 lg:py-7">
        <aside>
          <div className="lg:sticky lg:top-24">
            <AdminNavigation />
            <div className="mt-4 hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-4 lg:block">
              <p className="text-xs font-bold text-slate-300">Safe workflow</p>
              <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-500">
                <li>1. Edit a private draft</li>
                <li>2. Save and review</li>
                <li>3. Publish when ready</li>
              </ol>
            </div>
          </div>
        </aside>

        <main className="min-w-0 pb-12">{children}</main>
      </div>
    </div>
  );
}
