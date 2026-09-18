import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import type {
  FloridaReviewedAnalysisEntry,
  FloridaReviewedDraft,
} from "../../server/data/florida-reviewed-source-records";
import type { EvidenceBackedChargeDefinition } from "../../shared/evidence-backed-charge-batch";

const ROOT = process.cwd();
const REPORT_PATH = resolve(ROOT, "scripts/data-review/output/florida-reviewed-analysis.json");
const RECEIPT_PATH = resolve(ROOT, "scripts/data-review/output/florida-reviewed-refresh-receipt.json");
const ELIGIBILITY_PATH = resolve(ROOT, "shared/florida-reviewed-eligibility.json");
const CACHE_PATH = resolve(ROOT, "scripts/data-review/output/florida-batch-source-cache.json");
const TECHNICAL_HOLDS_PATH = resolve(
  ROOT, "scripts/data-review/output/florida-reviewed-technical-holds.json",
);
const DEFINITION_PATHS = ["a", "b", "c"].map(part =>
  resolve(ROOT, `shared/florida-reviewed-data/${part}.json`));
const ANALYSIS_PATHS = ["a", "b", "c"].map(part =>
  resolve(ROOT, `scripts/data-review/output/florida-reviewed-analysis-${part}.json`));
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const hashJson = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const writeJson = (path: string, value: unknown) =>
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

function entriesFrom(value: unknown): FloridaReviewedAnalysisEntry[] {
  if (Array.isArray(value)) return value as FloridaReviewedAnalysisEntry[];
  if (!value || typeof value !== "object") return [];
  const packet = value as Record<string, unknown>;
  for (const key of ["entries", "records", "analysis"]) {
    if (Array.isArray(packet[key])) return packet[key] as FloridaReviewedAnalysisEntry[];
  }
  return [];
}

function decision(
  definition: EvidenceBackedChargeDefinition,
  draftHash: string,
  status: "eligible" | "held",
  reason: string,
) {
  const base = {
    id: definition.id,
    status,
    reason,
    draftHash,
    definitionHash: hashJson(definition),
  };
  return { ...base, approvalHash: hashJson(base) };
}

async function main() {
  const mode = process.argv[2];
  if (mode !== "--prepare" && mode !== "--activate-reviewed") {
    throw new Error(
      "Use --prepare to write an all-held review packet, then --activate-reviewed only after reviewing that exact packet",
    );
  }
  for (const path of [...DEFINITION_PATHS, ...ANALYSIS_PATHS, CACHE_PATH]) {
    if (!existsSync(path)) throw new Error(`Required Florida reviewed input is missing: ${path}`);
  }
  const definitions = DEFINITION_PATHS.flatMap(path =>
    readJson(path) as EvidenceBackedChargeDefinition[]);
  const analyses = ANALYSIS_PATHS.flatMap(path => entriesFrom(readJson(path)));
  const cache = readJson(CACHE_PATH);

  const reportBackup = `${REPORT_PATH}.assembly-backup`;
  const receiptBackup = `${RECEIPT_PATH}.assembly-backup`;
  const originalEligibility = readFileSync(ELIGIBILITY_PATH, "utf8");
  let movedReport = false;
  let movedReceipt = false;
  try {
    if (mode === "--prepare") {
      if (existsSync(reportBackup) || existsSync(receiptBackup)) {
        throw new Error("A previous Florida assembly backup must be resolved first");
      }
      if (existsSync(REPORT_PATH)) {
        renameSync(REPORT_PATH, reportBackup);
        movedReport = true;
      }
      if (existsSync(RECEIPT_PATH)) {
        renameSync(RECEIPT_PATH, receiptBackup);
        movedReceipt = true;
      }
      // This temporary ledger only lets the shared catalog module load while
      // definitions are being authored. With no runtime report, it exposes no
      // records and cannot become an approval.
      writeJson(ELIGIBILITY_PATH, {
        schemaVersion: 1,
        reportHash: "",
        decisions: definitions.map(definition => ({
          id: definition.id,
          status: "held",
          reason: "Assembly in progress; not publication approval",
        })),
      });
    }

    const runtime = await import("../../server/data/florida-reviewed-source-records");
    const assembled = runtime.assembleFloridaReviewedReport(
      definitions,
      analyses,
      cache,
      new Date(),
    );
    writeJson(TECHNICAL_HOLDS_PATH, {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      holds: assembled.technicalHolds,
    });

    if (mode === "--activate-reviewed") {
      if (!existsSync(REPORT_PATH) ||
          JSON.stringify(readJson(REPORT_PATH)) !== JSON.stringify(assembled.report)) {
        throw new Error("Activation requires the exact previously prepared and reviewed report");
      }
    } else {
      writeJson(REPORT_PATH, assembled.report);
    }

    const analysisById = new Map(
      analyses.map(entry => [entry.id, entry]),
    );
    const draftById = new Map(
      assembled.report.drafts.map(draft => [draft.id, draft]),
    );
    const decisions = definitions.map(definition => {
      const id = definition.id;
      const draft = draftById.get(id);
      const analysis = analysisById.get(id);
      const technicalHold = assembled.technicalHolds.find(row => row.id === id);
      if (!analysis || (draft && analysis.status !== "eligible")) {
        throw new Error(`Definition ${id} lacks an explicit reviewed analysis decision consistent with its draft`);
      }
      return decision(
        definition,
        draft ? hashJson(draft) : hashJson({ id, technicalHold }),
        mode === "--activate-reviewed" && draft ? "eligible" : "held",
        mode === "--activate-reviewed" && draft
          ? String(analysis.reason)
          : technicalHold?.reason ??
            "Prepared for consolidated review; publication remains held",
      );
    });
    const eligibility = {
      schemaVersion: 1 as const,
      reportHash: hashJson(assembled.report),
      decisions,
    };
    writeJson(ELIGIBILITY_PATH, eligibility);

    if (mode === "--activate-reviewed") {
      const documents = new Map<string, {
        sourceKey: string;
        contentHash: string;
        retrievedAt: string;
      }>();
      for (const draft of assembled.report.drafts) {
        for (const dependency of draft.requiredDependencies) {
          const document = assembled.report.sourceEvidence[dependency.sourceKey];
          documents.set(dependency.sourceKey, {
            sourceKey: document.sourceKey,
            contentHash: document.contentHash,
            retrievedAt: document.retrievedAt,
          });
        }
      }
      const now = new Date();
      const oldest = Math.min(...[...documents.values()].map(document =>
        Date.parse(document.retrievedAt)));
      const expiresAt = new Date(Math.min(
        now.getTime() + MAX_AGE_MS,
        oldest + MAX_AGE_MS,
      ));
      if (!documents.size || !Number.isFinite(oldest) || expiresAt <= now) {
        throw new Error("Reviewed Florida sources are too old to issue a freshness receipt");
      }
      writeJson(RECEIPT_PATH, {
        schemaVersion: 1,
        reportHash: hashJson(assembled.report),
        eligibilityHash: hashJson(eligibility),
        checkedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        documents: [...documents.values()].sort((a, b) =>
          a.sourceKey.localeCompare(b.sourceKey)),
      });
    } else {
      rmSync(RECEIPT_PATH, { force: true });
    }
    rmSync(reportBackup, { force: true });
    rmSync(receiptBackup, { force: true });
    console.log(
      mode === "--prepare"
        ? `Prepared ${assembled.report.drafts.length} Florida drafts and ${assembled.technicalHolds.length} held records; all remain held`
        : `Activated ${assembled.report.drafts.length} explicitly reviewed Florida drafts; ${assembled.technicalHolds.length} records remain held`,
    );
  } catch (error) {
    writeFileSync(ELIGIBILITY_PATH, originalEligibility);
    if (movedReport) {
      rmSync(REPORT_PATH, { force: true });
      renameSync(reportBackup, REPORT_PATH);
    }
    if (movedReceipt) {
      rmSync(RECEIPT_PATH, { force: true });
      renameSync(receiptBackup, RECEIPT_PATH);
    }
    throw error;
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});