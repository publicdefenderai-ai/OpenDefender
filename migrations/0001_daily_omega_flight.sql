CREATE TABLE "statute_charge_links" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"charge_id" text NOT NULL,
	"snapshot_id" varchar NOT NULL,
	"support_role" text NOT NULL,
	"citation" text NOT NULL,
	"subdivision" text,
	"is_current" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "statute_charge_links_charge_snapshot_role_unique" UNIQUE("charge_id","snapshot_id","support_role")
);
--> statement-breakpoint
CREATE TABLE "statute_ingestion_runs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jurisdiction" text NOT NULL,
	"operation" text NOT NULL,
	"status" text NOT NULL,
	"source_count" integer DEFAULT 0 NOT NULL,
	"snapshot_count" integer DEFAULT 0 NOT NULL,
	"link_count" integer DEFAULT 0 NOT NULL,
	"change_count" integer DEFAULT 0 NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"triggered_by" text,
	"error_message" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "statute_source_snapshots" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" varchar NOT NULL,
	"jurisdiction" text NOT NULL,
	"citation" text NOT NULL,
	"section" text NOT NULL,
	"official_title" text NOT NULL,
	"source_url" text NOT NULL,
	"content" text,
	"content_hash" text NOT NULL,
	"hash_basis" text NOT NULL,
	"retrieved_at" timestamp NOT NULL,
	"effective_date_start" text,
	"effective_date_end" text,
	"status" text DEFAULT 'current' NOT NULL,
	"requires_review" boolean DEFAULT false NOT NULL,
	"supersedes_snapshot_id" varchar,
	"metadata" jsonb,
	CONSTRAINT "statute_snapshots_content_hash_unique" UNIQUE("source_id","citation","official_title","content_hash")
);
--> statement-breakpoint
CREATE TABLE "statute_sources" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_key" text NOT NULL,
	"jurisdiction" text NOT NULL,
	"publisher" text NOT NULL,
	"source_type" text NOT NULL,
	"canonical_url" text NOT NULL,
	"api_identifier" text,
	"access_policy" text NOT NULL,
	"reuse_status" text NOT NULL,
	"can_store_content" boolean DEFAULT false NOT NULL,
	"last_retrieved_at" timestamp,
	"last_checked_at" timestamp,
	"metadata" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "statute_sources_source_key_unique" UNIQUE("source_key")
);
--> statement-breakpoint
ALTER TABLE "statute_charge_links" ADD CONSTRAINT "statute_charge_links_snapshot_id_statute_source_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."statute_source_snapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statute_source_snapshots" ADD CONSTRAINT "statute_source_snapshots_source_id_statute_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."statute_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "statute_charge_links_charge_idx" ON "statute_charge_links" USING btree ("charge_id");--> statement-breakpoint
CREATE INDEX "statute_charge_links_snapshot_idx" ON "statute_charge_links" USING btree ("snapshot_id");--> statement-breakpoint
CREATE INDEX "statute_snapshots_source_citation_idx" ON "statute_source_snapshots" USING btree ("source_id","citation");--> statement-breakpoint
CREATE INDEX "statute_snapshots_jurisdiction_status_idx" ON "statute_source_snapshots" USING btree ("jurisdiction","status");--> statement-breakpoint
CREATE INDEX "statute_sources_jurisdiction_idx" ON "statute_sources" USING btree ("jurisdiction");--> statement-breakpoint
CREATE INDEX "statute_sources_source_type_idx" ON "statute_sources" USING btree ("source_type");