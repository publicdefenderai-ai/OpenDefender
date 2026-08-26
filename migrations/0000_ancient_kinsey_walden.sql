CREATE TABLE "ai_daily_costs" (
	"date" text PRIMARY KEY NOT NULL,
	"total_cost" real DEFAULT 0 NOT NULL,
	"breakdown" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"request_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attorney_review_items" (
	"item_id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reviewed_by" text DEFAULT '' NOT NULL,
	"reviewed_date" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "case_feedback" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"case_id" text NOT NULL,
	"case_name" text NOT NULL,
	"jurisdiction" text NOT NULL,
	"charge_category" text,
	"is_helpful" boolean NOT NULL,
	"case_stage" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "court_data" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"court_id" text NOT NULL,
	"court_name" text NOT NULL,
	"jurisdiction" text NOT NULL,
	"address" text,
	"phone" text,
	"website" text,
	"hours" jsonb,
	"services" text[],
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "court_records" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record_type" text NOT NULL,
	"courtlistener_id" text,
	"pacer_id" text,
	"court_id" text NOT NULL,
	"court_name" text,
	"case_name" text NOT NULL,
	"case_number" text,
	"docket_number" text,
	"date_filed" timestamp,
	"description" text,
	"document_url" text,
	"recap_url" text,
	"pacer_url" text,
	"is_recap_available" boolean DEFAULT false,
	"metadata" jsonb,
	"last_checked" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "diversion_programs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"jurisdiction_type" text NOT NULL,
	"state" text NOT NULL,
	"county" text,
	"cities" text[],
	"zip_codes" text[],
	"program_types" text[] NOT NULL,
	"eligibility_notes" text,
	"contact" jsonb,
	"sources" text[],
	"last_updated" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "expungement_rules" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"state" text NOT NULL,
	"overview" text NOT NULL,
	"waiting_periods" jsonb,
	"exclusions" text[],
	"conditions" text[],
	"steps" text[],
	"sources" text[],
	"last_updated" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "glossary_terms" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"term" text NOT NULL,
	"definition" text NOT NULL,
	"aliases" text[],
	"tags" text[],
	"slug" text NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	CONSTRAINT "glossary_terms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "guidance_flags" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flagged_at" timestamp DEFAULT now(),
	"jurisdiction" text,
	"confidence_bucket" text,
	"flag_reason" text NOT NULL,
	"session_id_hash" text
);
--> statement-breakpoint
CREATE TABLE "legal_aid_organizations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"organization_type" text NOT NULL,
	"address" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text,
	"county" text,
	"county_served" text[],
	"phone" text,
	"email" text,
	"website" text,
	"latitude" text,
	"longitude" text,
	"services" text[],
	"eligibility" text,
	"data_source" text NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "legal_cases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"jurisdiction" text NOT NULL,
	"charges" text[] NOT NULL,
	"case_stage" text NOT NULL,
	"custody_status" text,
	"has_attorney" boolean,
	"consent_given" boolean,
	"incident_description" text,
	"selected_concerns" text[],
	"guidance" jsonb,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legal_resources" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"content" text NOT NULL,
	"jurisdiction" text,
	"source" text NOT NULL,
	"url" text,
	"last_updated" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "legiscan_bills" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_id" text NOT NULL,
	"bill_number" text NOT NULL,
	"state" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text NOT NULL,
	"change_hash" text NOT NULL,
	"last_action" text,
	"last_action_date" timestamp,
	"url" text,
	"affects_statutes" text[],
	"needs_review" boolean DEFAULT true,
	"reviewed_at" timestamp,
	"first_detected" timestamp DEFAULT now(),
	"last_checked" timestamp DEFAULT now(),
	"metadata" jsonb,
	CONSTRAINT "legiscan_bills_bill_id_unique" UNIQUE("bill_id")
);
--> statement-breakpoint
CREATE TABLE "privacy_consents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_hash" text NOT NULL,
	"consent_type" text NOT NULL,
	"consent_version" text NOT NULL,
	"granted" boolean NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"consented_at" timestamp DEFAULT now(),
	CONSTRAINT "privacy_consents_session_hash_consent_type_unique" UNIQUE("session_hash","consent_type")
);
--> statement-breakpoint
CREATE TABLE "provider_metrics" (
	"provider" varchar(32) NOT NULL,
	"operation" varchar(64) NOT NULL,
	"bucket_start" timestamp NOT NULL,
	"request_count" integer DEFAULT 0 NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"failure_count" integer DEFAULT 0 NOT NULL,
	"timeout_count" integer DEFAULT 0 NOT NULL,
	"client_error_count" integer DEFAULT 0 NOT NULL,
	"cancelled_count" integer DEFAULT 0 NOT NULL,
	"duration_total_ms" integer DEFAULT 0 NOT NULL,
	"duration_max_ms" integer DEFAULT 0 NOT NULL,
	"last_outcome" varchar(24) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "provider_metrics_provider_operation_bucket_start_pk" PRIMARY KEY("provider","operation","bucket_start")
);
--> statement-breakpoint
CREATE TABLE "statute_scrapes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jurisdiction" text NOT NULL,
	"scrape_type" text NOT NULL,
	"status" text NOT NULL,
	"statutes_scraped" text DEFAULT '0',
	"error_count" text DEFAULT '0',
	"error_message" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"last_updated_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "statute_update_queue" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jurisdiction" text NOT NULL,
	"citation" text NOT NULL,
	"reason" text NOT NULL,
	"triggered_by" text,
	"priority" text DEFAULT 'normal' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" text DEFAULT '0',
	"last_attempt" timestamp,
	"error_message" text,
	"queued_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "statutes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"citation" text NOT NULL,
	"jurisdiction" text NOT NULL,
	"level" text NOT NULL,
	"chapter" text,
	"section" text NOT NULL,
	"content" text NOT NULL,
	"summary" text,
	"category" text,
	"related_charges" text[],
	"penalties" text,
	"url" text,
	"source_api" text,
	"last_updated" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	CONSTRAINT "statutes_citation_jurisdiction_unique" UNIQUE("citation","jurisdiction")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE INDEX "case_feedback_session_id_idx" ON "case_feedback" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "case_feedback_case_id_idx" ON "case_feedback" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "case_feedback_session_case_idx" ON "case_feedback" USING btree ("session_id","case_id");--> statement-breakpoint
CREATE INDEX "court_data_jurisdiction_idx" ON "court_data" USING btree ("jurisdiction");--> statement-breakpoint
CREATE INDEX "guidance_flags_flagged_at_idx" ON "guidance_flags" USING btree ("flagged_at");--> statement-breakpoint
CREATE INDEX "legal_aid_state_idx" ON "legal_aid_organizations" USING btree ("state");--> statement-breakpoint
CREATE INDEX "legal_aid_org_type_idx" ON "legal_aid_organizations" USING btree ("organization_type");--> statement-breakpoint
CREATE INDEX "legal_aid_state_org_type_idx" ON "legal_aid_organizations" USING btree ("state","organization_type");--> statement-breakpoint
CREATE INDEX "legal_cases_session_id_idx" ON "legal_cases" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "legal_cases_expires_at_idx" ON "legal_cases" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "legal_resources_jurisdiction_idx" ON "legal_resources" USING btree ("jurisdiction");--> statement-breakpoint
CREATE INDEX "legal_resources_category_idx" ON "legal_resources" USING btree ("category");--> statement-breakpoint
CREATE INDEX "provider_metrics_bucket_start_idx" ON "provider_metrics" USING btree ("bucket_start");--> statement-breakpoint
CREATE INDEX "statutes_jurisdiction_idx" ON "statutes" USING btree ("jurisdiction");--> statement-breakpoint
CREATE INDEX "statutes_category_idx" ON "statutes" USING btree ("category");