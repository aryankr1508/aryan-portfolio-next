CREATE TABLE "portfolio_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"draft_content" jsonb NOT NULL,
	"published_content" jsonb NOT NULL,
	"draft_version" integer DEFAULT 1 NOT NULL,
	"published_version" integer DEFAULT 1 NOT NULL,
	"updated_by" text NOT NULL,
	"published_by" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pathname" text NOT NULL,
	"url" text NOT NULL,
	"original_name" text NOT NULL,
	"kind" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"alt_text" text,
	"actor" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_media_pathname_unique" UNIQUE("pathname"),
	CONSTRAINT "portfolio_media_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "portfolio_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" text NOT NULL,
	"version" integer NOT NULL,
	"event" text NOT NULL,
	"content" jsonb NOT NULL,
	"actor" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "portfolio_revisions" ADD CONSTRAINT "portfolio_revisions_document_id_portfolio_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."portfolio_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "portfolio_audit_created_idx" ON "portfolio_audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "portfolio_media_created_idx" ON "portfolio_media" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "portfolio_revisions_document_created_idx" ON "portfolio_revisions" USING btree ("document_id","created_at");