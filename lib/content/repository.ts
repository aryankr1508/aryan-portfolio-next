import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDatabase, isDatabaseConfigured } from "@/lib/db/client";
import {
  portfolioAuditLog,
  portfolioDocuments,
  portfolioMedia,
  portfolioRevisions
} from "@/lib/db/schema";
import {
  staticPortfolioSnapshot,
  type PortfolioSnapshot
} from "@/lib/portfolio-data";
import { portfolioSnapshotSchema } from "@/lib/content/schema";
import { getPublicPortfolioSnapshot } from "@/lib/content/visibility";

export const PORTFOLIO_DOCUMENT_ID = "main";
export const PORTFOLIO_CACHE_TAG = "portfolio:published";

function databaseContentEnabled() {
  return process.env.PORTFOLIO_CONTENT_SOURCE === "database";
}

async function loadPublishedPortfolioFromDatabase(): Promise<PortfolioSnapshot> {
  const database = getDatabase();
  const [document] = await database
    .select({ content: portfolioDocuments.publishedContent })
    .from(portfolioDocuments)
    .where(eq(portfolioDocuments.id, PORTFOLIO_DOCUMENT_ID))
    .limit(1);

  if (!document) {
    throw new Error("The portfolio content document has not been seeded");
  }

  return getPublicPortfolioSnapshot(
    portfolioSnapshotSchema.parse(document.content) as PortfolioSnapshot
  );
}

const loadCachedPublishedPortfolio = unstable_cache(
  loadPublishedPortfolioFromDatabase,
  ["portfolio:published:v3"],
  {
    revalidate: 86_400,
    tags: [PORTFOLIO_CACHE_TAG]
  }
);

export async function getPublishedPortfolio(): Promise<PortfolioSnapshot> {
  if (!databaseContentEnabled() || !isDatabaseConfigured()) {
    return getPublicPortfolioSnapshot(staticPortfolioSnapshot);
  }

  try {
    return await loadCachedPublishedPortfolio();
  } catch (error) {
    console.error("Falling back to checked-in portfolio content", error);
    return getPublicPortfolioSnapshot(staticPortfolioSnapshot);
  }
}

export type PortfolioAdminDocument = {
  draftContent: PortfolioSnapshot;
  publishedContent: PortfolioSnapshot;
  draftVersion: number;
  publishedVersion: number;
  updatedBy: string;
  publishedBy: string;
  updatedAt: Date;
  publishedAt: Date;
};

export async function getPortfolioAdminDocument(): Promise<PortfolioAdminDocument> {
  const database = getDatabase();
  const [document] = await database
    .select()
    .from(portfolioDocuments)
    .where(eq(portfolioDocuments.id, PORTFOLIO_DOCUMENT_ID))
    .limit(1);

  if (!document) {
    throw new Error("The portfolio content document has not been seeded");
  }

  return {
    ...document,
    draftContent: portfolioSnapshotSchema.parse(
      document.draftContent
    ) as PortfolioSnapshot,
    publishedContent: portfolioSnapshotSchema.parse(
      document.publishedContent
    ) as PortfolioSnapshot
  };
}

export async function savePortfolioDraft(
  content: PortfolioSnapshot,
  actor: string
) {
  const parsedContent = portfolioSnapshotSchema.parse(content) as PortfolioSnapshot;
  const database = getDatabase();
  const [document] = await database
    .select({
      draftVersion: portfolioDocuments.draftVersion,
      publishedVersion: portfolioDocuments.publishedVersion
    })
    .from(portfolioDocuments)
    .where(eq(portfolioDocuments.id, PORTFOLIO_DOCUMENT_ID))
    .limit(1);

  if (!document) {
    throw new Error("The portfolio content document has not been seeded");
  }

  const nextVersion =
    Math.max(document.draftVersion, document.publishedVersion) + 1;
  const now = new Date();

  const [updated] = await database.batch([
    database
      .update(portfolioDocuments)
      .set({
        draftContent: parsedContent,
        draftVersion: nextVersion,
        updatedBy: actor,
        updatedAt: now
      })
      .where(
        and(
          eq(portfolioDocuments.id, PORTFOLIO_DOCUMENT_ID),
          eq(portfolioDocuments.draftVersion, document.draftVersion),
          eq(portfolioDocuments.publishedVersion, document.publishedVersion)
        )
      )
      .returning({ version: portfolioDocuments.draftVersion }),
    database.insert(portfolioRevisions).values({
      documentId: PORTFOLIO_DOCUMENT_ID,
      version: nextVersion,
      event: "draft",
      content: parsedContent,
      actor,
      createdAt: now
    }),
    database.insert(portfolioAuditLog).values({
      actor,
      action: "draft.saved",
      entity: PORTFOLIO_DOCUMENT_ID,
      metadata: { version: nextVersion },
      createdAt: now
    })
  ]);

  if (!updated.length) {
    throw new Error("The draft changed while it was being saved. Reload and try again.");
  }

  return { version: nextVersion };
}

export async function publishPortfolioDraft(actor: string) {
  const database = getDatabase();
  const [document] = await database
    .select({
      draftContent: portfolioDocuments.draftContent,
      draftVersion: portfolioDocuments.draftVersion,
      publishedContent: portfolioDocuments.publishedContent,
      publishedVersion: portfolioDocuments.publishedVersion
    })
    .from(portfolioDocuments)
    .where(eq(portfolioDocuments.id, PORTFOLIO_DOCUMENT_ID))
    .limit(1);

  if (!document) {
    throw new Error("The portfolio content document has not been seeded");
  }

  const content = portfolioSnapshotSchema.parse(
    document.draftContent
  ) as PortfolioSnapshot;
  if (
    JSON.stringify(content) ===
    JSON.stringify(
      portfolioSnapshotSchema.parse(document.publishedContent)
    )
  ) {
    return {
      version: document.publishedVersion,
      publishedAt: null,
      unchanged: true
    };
  }

  const nextVersion =
    document.draftVersion > document.publishedVersion
      ? document.draftVersion
      : document.publishedVersion + 1;
  const now = new Date();

  await database.batch([
    database
      .update(portfolioDocuments)
      .set({
        publishedContent: content,
        draftVersion: nextVersion,
        publishedVersion: nextVersion,
        publishedBy: actor,
        publishedAt: now
      })
      .where(eq(portfolioDocuments.id, PORTFOLIO_DOCUMENT_ID)),
    database.insert(portfolioRevisions).values({
      documentId: PORTFOLIO_DOCUMENT_ID,
      version: nextVersion,
      event: "publish",
      content,
      actor,
      createdAt: now
    }),
    database.insert(portfolioAuditLog).values({
      actor,
      action: "content.published",
      entity: PORTFOLIO_DOCUMENT_ID,
      metadata: { version: nextVersion },
      createdAt: now
    })
  ]);

  return { version: nextVersion, publishedAt: now, unchanged: false };
}

export async function restorePortfolioRevisionToDraft(
  revisionId: string,
  actor: string
) {
  const database = getDatabase();
  const [revision] = await database
    .select({ content: portfolioRevisions.content })
    .from(portfolioRevisions)
    .where(
      and(
        eq(portfolioRevisions.id, revisionId),
        eq(portfolioRevisions.documentId, PORTFOLIO_DOCUMENT_ID)
      )
    )
    .limit(1);

  if (!revision) {
    throw new Error("Revision not found");
  }

  const content = portfolioSnapshotSchema.parse(revision.content) as PortfolioSnapshot;
  const result = await savePortfolioDraft(content, actor);

  await database.insert(portfolioAuditLog).values({
    actor,
    action: "revision.restored_to_draft",
    entity: revisionId,
    metadata: { draftVersion: result.version }
  });

  return result;
}

export async function listPortfolioRevisions(limit = 25) {
  return getDatabase()
    .select({
      id: portfolioRevisions.id,
      version: portfolioRevisions.version,
      event: portfolioRevisions.event,
      actor: portfolioRevisions.actor,
      createdAt: portfolioRevisions.createdAt
    })
    .from(portfolioRevisions)
    .where(eq(portfolioRevisions.documentId, PORTFOLIO_DOCUMENT_ID))
    .orderBy(desc(portfolioRevisions.createdAt))
    .limit(limit);
}

export async function listPortfolioAuditEvents(limit = 50) {
  return getDatabase()
    .select()
    .from(portfolioAuditLog)
    .orderBy(desc(portfolioAuditLog.createdAt))
    .limit(limit);
}

export async function recordPortfolioMedia(input: {
  pathname: string;
  url: string;
  originalName: string;
  kind: string;
  contentType: string;
  size: number;
  altText?: string;
  actor: string;
}) {
  const database = getDatabase();
  const [inserted] = await database
    .insert(portfolioMedia)
    .values(input)
    .onConflictDoNothing()
    .returning();

  const media = inserted ?? (
    await database
      .select()
      .from(portfolioMedia)
      .where(eq(portfolioMedia.pathname, input.pathname))
      .limit(1)
  )[0];

  if (!media) {
    throw new Error("Unable to record uploaded media");
  }

  if (inserted) {
    await database.insert(portfolioAuditLog).values({
      actor: input.actor,
      action: "media.uploaded",
      entity: media.id,
      metadata: {
        pathname: input.pathname,
        kind: input.kind,
        size: input.size
      }
    });
  }

  return media;
}

export async function listPortfolioMedia(limit = 100) {
  return getDatabase()
    .select()
    .from(portfolioMedia)
    .orderBy(desc(portfolioMedia.createdAt))
    .limit(limit);
}

export async function seedPortfolioContent(actor = "system:seed") {
  const content = portfolioSnapshotSchema.parse(
    staticPortfolioSnapshot
  ) as PortfolioSnapshot;
  const database = getDatabase();

  await database
    .insert(portfolioDocuments)
    .values({
      id: PORTFOLIO_DOCUMENT_ID,
      draftContent: content,
      publishedContent: content,
      updatedBy: actor,
      publishedBy: actor
    })
    .onConflictDoNothing();

  const [document] = await database
    .select({ id: portfolioDocuments.id })
    .from(portfolioDocuments)
    .where(eq(portfolioDocuments.id, PORTFOLIO_DOCUMENT_ID))
    .limit(1);

  if (!document) {
    throw new Error("Portfolio seed did not create the main document");
  }
}
