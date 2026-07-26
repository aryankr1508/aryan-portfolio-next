"use server";

import { updateTag } from "next/cache";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import {
  PORTFOLIO_CACHE_TAG,
  publishPortfolioDraft,
  restorePortfolioRevisionToDraft,
  savePortfolioDraft
} from "@/lib/content/repository";
import { portfolioSnapshotSchema } from "@/lib/content/schema";
import type { PortfolioSnapshot } from "@/lib/portfolio-data";

export type AdminActionState = {
  ok: boolean;
  message: string;
  issues?: string[];
  savedContent?: string;
};

const revisionIdSchema = z.uuid();

export async function saveDraftAction(
  _previousState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const serializedContent = formData.get("content");

  if (typeof serializedContent !== "string") {
    return {
      ok: false,
      message: "The draft payload is missing.",
      savedContent: _previousState.savedContent
    };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(serializedContent);
  } catch {
    return {
      ok: false,
      message: "The draft contains invalid JSON.",
      savedContent: _previousState.savedContent
    };
  }

  const validated = portfolioSnapshotSchema.safeParse(payload);
  if (!validated.success) {
    return {
      ok: false,
      message: "Fix the validation issues before saving.",
      savedContent: _previousState.savedContent,
      issues: validated.error.issues.slice(0, 12).map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
      })
    };
  }

  try {
    const result = await savePortfolioDraft(
      validated.data as PortfolioSnapshot,
      admin.actor
    );
    revalidatePath("/admin", "layout");
    return {
      ok: true,
      message: `Draft version ${result.version} saved. Public content is unchanged.`,
      savedContent: JSON.stringify(validated.data)
    };
  } catch (error) {
    console.error("Unable to save portfolio draft", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to save the draft.",
      savedContent: _previousState.savedContent
    };
  }
}

export async function publishDraftAction(): Promise<void> {
  const admin = await requireAdmin();
  await publishPortfolioDraft(admin.actor);
  updateTag(PORTFOLIO_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/admin", "layout");
}

export async function restoreRevisionAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const revisionId = revisionIdSchema.parse(formData.get("revisionId"));
  await restorePortfolioRevisionToDraft(revisionId, admin.actor);
  revalidatePath("/admin", "layout");
}
