import assert from "node:assert/strict";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { portfolioSnapshotSchema } from "../lib/content/schema";
import {
  portfolioAuditLog,
  portfolioDocuments,
  portfolioMedia,
  portfolioRevisions
} from "../lib/db/schema";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to verify the portfolio database");
}

const database = drizzle({ client: neon(databaseUrl) });

async function main() {
  const [document] = await database
    .select()
    .from(portfolioDocuments)
    .where(eq(portfolioDocuments.id, "main"))
    .limit(1);

  assert.ok(document, "The main portfolio document has not been seeded");

  const draft = portfolioSnapshotSchema.parse(document.draftContent);
  const published = portfolioSnapshotSchema.parse(document.publishedContent);
  const [[revisions], [auditEvents], [media]] = await Promise.all([
    database.select({ value: count() }).from(portfolioRevisions),
    database.select({ value: count() }).from(portfolioAuditLog),
    database.select({ value: count() }).from(portfolioMedia)
  ]);

  assert.ok(revisions.value >= 1, "Expected at least one content revision");
  assert.ok(auditEvents.value >= 1, "Expected at least one audit event");

  console.log({
    documentId: document.id,
    draftVersion: document.draftVersion,
    publishedVersion: document.publishedVersion,
    draftProjects: draft.projects.length,
    publishedProjects: published.projects.length,
    draftCompanyProjects: draft.experienceItems.reduce(
      (total, item) => total + (item.companyProjects?.length ?? 0),
      0
    ),
    revisions: revisions.value,
    auditEvents: auditEvents.value,
    media: media.value
  });
}

main().catch((error) => {
  console.error("Portfolio database verification failed.", error);
  process.exitCode = 1;
});
