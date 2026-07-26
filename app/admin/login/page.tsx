import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminSignInButton } from "@/components/admin/admin-auth-buttons";
import { getOptionalAdminIdentity } from "@/lib/admin/auth";
import { isAdminAuthConfigured } from "@/lib/auth";

type AdminLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({
  searchParams
}: AdminLoginPageProps) {
  const identity = await getOptionalAdminIdentity();
  if (identity) {
    redirect("/admin");
  }

  const params = await searchParams;
  const configured = isAdminAuthConfigured();
  const setupRequired = params.setup === "required" || !configured;
  const oauthError = params.error === "oauth";

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-slate-100">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/85 p-7 shadow-2xl shadow-black/25 sm:p-9">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
          <ShieldCheck size={24} />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
          Private administration
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Portfolio control room
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Sign in with the allowlisted GitHub account. Authentication alone does
          not grant access; every admin operation also verifies the configured
          GitHub account ID.
        </p>

        {setupRequired ? (
          <div className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-100">
            Admin authentication is not configured in this environment. Add the
            documented Better Auth and GitHub OAuth environment variables before
            signing in.
          </div>
        ) : (
          <div className="mt-7">
            <AdminSignInButton />
          </div>
        )}

        {oauthError ? (
          <p className="mt-4 text-sm text-rose-300">
            GitHub authentication did not complete. Check the OAuth callback and
            try again.
          </p>
        ) : null}
      </section>
    </main>
  );
}
