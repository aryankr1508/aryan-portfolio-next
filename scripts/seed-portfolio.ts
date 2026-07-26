import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  portfolioAuditLog,
  portfolioDocuments,
  portfolioRevisions
} from "../lib/db/schema";
import { portfolioSnapshotSchema } from "../lib/content/schema";
import {
  staticPortfolioSnapshot,
  type PortfolioSnapshot
} from "../lib/portfolio-data";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed portfolio content");
}

const actor = "system:initial-seed";
const content = portfolioSnapshotSchema.parse(
  staticPortfolioSnapshot
) as PortfolioSnapshot;
const database = drizzle({ client: neon(databaseUrl) });

async function main() {
  const [document] = await database
    .insert(portfolioDocuments)
    .values({
      id: "main",
      draftContent: content,
      publishedContent: content,
      updatedBy: actor,
      publishedBy: actor
    })
    .onConflictDoNothing()
    .returning({ id: portfolioDocuments.id });

  if (!document) {
    console.log("Portfolio content already exists; seed left it unchanged.");
    return;
  }

  await database.batch([
    database.insert(portfolioRevisions).values({
      documentId: "main",
      version: 1,
      event: "publish",
      content,
      actor
    }),
    database.insert(portfolioAuditLog).values({
      actor,
      action: "content.seeded",
      entity: "main",
      metadata: { version: 1 }
    })
  ]);

  console.log("Portfolio content seeded from the checked-in snapshot.");
}

main().catch((error) => {
  console.error("Portfolio content seed failed.", error);
  process.exitCode = 1;
});
