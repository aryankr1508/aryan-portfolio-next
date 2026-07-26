import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, isAdminAuthConfigured } from "@/lib/auth";

export type AdminIdentity = {
  actor: string;
  githubId: string;
  name: string;
  image: string | null;
};

function adminIdentityFromEmail(email: string | null | undefined) {
  const match = email?.match(/^(\d+)@github\.admin\.invalid$/);
  return match?.[1] ?? null;
}

export const getOptionalAdminIdentity = cache(async (): Promise<AdminIdentity | null> => {
  if (!isAdminAuthConfigured()) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: await headers()
  });
  const githubId = adminIdentityFromEmail(session?.user.email);

  if (!session || !githubId || githubId !== process.env.ADMIN_GITHUB_ID) {
    return null;
  }

  return {
    actor: `github:${githubId}`,
    githubId,
    name: session.user.name,
    image: session.user.image ?? null
  };
});

export const requireAdmin = cache(async (): Promise<AdminIdentity> => {
  if (!isAdminAuthConfigured()) {
    redirect("/admin/login?setup=required");
  }

  const identity = await getOptionalAdminIdentity();
  if (!identity) {
    redirect("/admin/login");
  }

  return identity;
});
