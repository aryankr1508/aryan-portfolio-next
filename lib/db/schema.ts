import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";
import type { PortfolioSnapshot } from "@/lib/portfolio-data";

export const portfolioDocuments = pgTable("portfolio_documents", {
  id: text("id").primaryKey(),
  draftContent: jsonb("draft_content").$type<PortfolioSnapshot>().notNull(),
  publishedContent: jsonb("published_content").$type<PortfolioSnapshot>().notNull(),
  draftVersion: integer("draft_version").notNull().default(1),
  publishedVersion: integer("published_version").notNull().default(1),
  updatedBy: text("updated_by").notNull(),
  publishedBy: text("published_by").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow()
});

export const portfolioRevisions = pgTable(
  "portfolio_revisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: text("document_id")
      .notNull()
      .references(() => portfolioDocuments.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    event: text("event").notNull(),
    content: jsonb("content").$type<PortfolioSnapshot>().notNull(),
    actor: text("actor").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("portfolio_revisions_document_created_idx").on(
      table.documentId,
      table.createdAt
    ),
    uniqueIndex("portfolio_revisions_document_version_event_uidx").on(
      table.documentId,
      table.version,
      table.event
    )
  ]
);

export const portfolioMedia = pgTable(
  "portfolio_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pathname: text("pathname").notNull().unique(),
    url: text("url").notNull().unique(),
    originalName: text("original_name").notNull(),
    kind: text("kind").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    altText: text("alt_text"),
    actor: text("actor").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [index("portfolio_media_created_idx").on(table.createdAt)]
);

export const portfolioAuditLog = pgTable(
  "portfolio_audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [index("portfolio_audit_created_idx").on(table.createdAt)]
);
