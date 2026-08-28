CREATE TABLE "statute_source_review_decisions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"snapshot_id" varchar NOT NULL,
	"jurisdiction" text NOT NULL,
	"decision" text NOT NULL,
	"reviewer" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"snapshot_hash" text NOT NULL,
	"previous_snapshot_id" varchar,
	"decided_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "statute_source_review_decisions_snapshot_idx" ON "statute_source_review_decisions" USING btree ("snapshot_id");--> statement-breakpoint
CREATE INDEX "statute_source_review_decisions_jurisdiction_date_idx" ON "statute_source_review_decisions" USING btree ("jurisdiction","decided_at");--> statement-breakpoint
CREATE UNIQUE INDEX "statute_snapshots_one_current_per_source_citation" ON "statute_source_snapshots" USING btree ("source_id","citation") WHERE "statute_source_snapshots"."status" = 'current';