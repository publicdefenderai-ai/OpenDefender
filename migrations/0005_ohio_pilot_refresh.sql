CREATE TABLE IF NOT EXISTS ohio_pilot_refresh_state (
  id text PRIMARY KEY,
  receipt jsonb,
  approved_pinset text,
  review_required boolean NOT NULL DEFAULT false,
  reason text,
  next_check_at timestamptz NOT NULL DEFAULT now(),
  lease_token text,
  lease_until timestamptz,
  last_run_id varchar,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS ohio_pilot_review_decisions (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id varchar NOT NULL REFERENCES statute_ingestion_runs(id),
  pinset text NOT NULL,
  reviewer text NOT NULL,
  note text NOT NULL,
  decision text NOT NULL,
  decided_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ohio_pilot_review_decision_check CHECK (decision IN ('approve', 'reject'))
);
-- Idempotent so projects using drizzle push can install the audit guard too.
CREATE OR REPLACE FUNCTION prevent_ohio_pilot_review_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Ohio pilot review decisions are append-only';
END;
$$;
DROP TRIGGER IF EXISTS ohio_pilot_review_append_only ON ohio_pilot_review_decisions;
CREATE TRIGGER ohio_pilot_review_append_only
BEFORE UPDATE OR DELETE ON ohio_pilot_review_decisions
FOR EACH ROW EXECUTE FUNCTION prevent_ohio_pilot_review_mutation();