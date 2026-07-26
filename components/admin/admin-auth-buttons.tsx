"use client";

import { Github, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AdminSignInButton() {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signIn.social({
          provider: "github",
          callbackURL: "/admin",
          errorCallbackURL: "/admin/login?error=oauth"
        });
        setPending(false);
      }}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
    >
      <Github size={17} />
      {pending ? "Connecting…" : "Continue with GitHub"}
    </button>
  );
}

export function AdminSignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.replace("/admin/login");
              router.refresh();
            }
          }
        });
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:opacity-60"
    >
      <LogOut size={14} />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
