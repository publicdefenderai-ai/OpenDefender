ALTER TABLE "statute_update_queue" ADD COLUMN "snapshot_id" varchar;--> statement-breakpoint
CREATE INDEX "statute_update_queue_snapshot_idx" ON "statute_update_queue" USING btree ("snapshot_id");--> statement-breakpoint
ALTER TABLE "statute_source_review_decisions" ADD CONSTRAINT "statute_source_review_decisions_decision_check" CHECK ("statute_source_review_decisions"."decision" in ('approve', 'reject'));
--> statement-breakpoint
CREATE FUNCTION prevent_statute_source_review_decision_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'statute source review decisions are append-only';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER statute_source_review_decisions_append_only
BEFORE UPDATE OR DELETE ON statute_source_review_decisions
FOR EACH ROW
EXECUTE FUNCTION prevent_statute_source_review_decision_mutation();