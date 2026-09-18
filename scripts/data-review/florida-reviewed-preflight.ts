import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const FLORIDA_REVIEWED_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
export const FLORIDA_REVIEWED_PREFLIGHT_LEAD_MS = 48 * 60 * 60 * 1000;

type JsonObject = Record<string, unknown>;

export interface FloridaReviewedPreflightInputs {
  report: unknown;
  receipt: unknown;
  eligibility: unknown;
  cache: unknown;
}

export interface FloridaReviewedPreflightResult {
  ok: boolean;
  status: "ready" | "action_required" | "invalid";
  checkedAt: string;
  leadHours: 48;
  expiresAt: string | null;
  dueBefore: string | null;
  dueWithinLead: boolean;
  dependencies: {
    required: string[];
    requiringRetrieval: string[];
    missing: string[];
    hashDrift: string[];
    stale: string[];
    reassemblyRequired: string[];
  };
  metadataErrors: string[];
  actions: string[];
}

const isObject = (value: unknown): value is JsonObject =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);
const hashJson = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const hashText = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const isHash = (value: unknown): value is string =>
  typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
const timestamp = (value: unknown) =>
  typeof value === "string" && Number.isFinite(Date.parse(value))
    ? Date.parse(value)
    : null;
const sorted = (values: Iterable<string>) => [...new Set(values)].sort();

/**
 * Pure, read-only inspection of the four reviewed-evidence artifacts. It does
 * not grant approval: even an unchanged, newly retrieved document must be
 * reassembled and explicitly activated before its new timestamp is usable.
 */
export function inspectFloridaReviewedPreflight(
  inputs: FloridaReviewedPreflightInputs,
  now = new Date(),
): FloridaReviewedPreflightResult {
  const metadataErrors: string[] = [];
  const missing = new Set<string>();
  const hashDrift = new Set<string>();
  const stale = new Set<string>();
  const requiringRetrieval = new Set<string>();
  const reassemblyRequired = new Set<string>();
  const nowMs = now.getTime();

  if (!Number.isFinite(nowMs)) metadataErrors.push("inspection time is invalid");
  const report = isObject(inputs.report) ? inputs.report : null;
  const eligibility = isObject(inputs.eligibility) ? inputs.eligibility : null;
  const receipt = isObject(inputs.receipt) ? inputs.receipt : null;
  const cache = isObject(inputs.cache) ? inputs.cache : null;

  if (!report || report.schemaVersion !== 1 ||
      report.kind !== "florida_source_first_review" ||
      !Array.isArray(report.drafts) || !isObject(report.sourceEvidence)) {
    metadataErrors.push("report header or collections are malformed");
  }
  if (!eligibility || eligibility.schemaVersion !== 1 ||
      !isHash(eligibility.reportHash) || !Array.isArray(eligibility.decisions)) {
    metadataErrors.push("eligibility header or decisions are malformed");
  } else if (report && eligibility.reportHash !== hashJson(report)) {
    metadataErrors.push("eligibility reportHash does not bind the actual report");
  }
  if (!cache || cache.schemaVersion !== 1 || cache.jurisdiction !== "FL" ||
      !isObject(cache.documents)) {
    metadataErrors.push("cache header or documents are malformed");
  }
  if (!receipt || receipt.schemaVersion !== 1 || !isHash(receipt.reportHash) ||
      !isHash(receipt.eligibilityHash) || !Array.isArray(receipt.documents)) {
    metadataErrors.push("freshness receipt header or documents are malformed");
  } else {
    if (report && receipt.reportHash !== hashJson(report)) {
      metadataErrors.push("receipt reportHash does not bind the actual report");
    }
    if (eligibility && receipt.eligibilityHash !== hashJson(eligibility)) {
      metadataErrors.push("receipt eligibilityHash does not bind the actual eligibility ledger");
    }
  }

  const checkedAtMs = timestamp(receipt?.checkedAt);
  const expiresAtMs = timestamp(receipt?.expiresAt);
  const expiresAt = typeof receipt?.expiresAt === "string" && expiresAtMs !== null
    ? receipt.expiresAt
    : null;
  if (checkedAtMs === null || expiresAtMs === null) {
    metadataErrors.push("receipt checkedAt or expiresAt is malformed");
  } else if (checkedAtMs > nowMs || expiresAtMs <= checkedAtMs ||
      expiresAtMs - checkedAtMs > FLORIDA_REVIEWED_MAX_AGE_MS) {
    metadataErrors.push("receipt time bounds are impossible or exceed seven days");
  }

  const evidence = report && isObject(report.sourceEvidence)
    ? report.sourceEvidence
    : {};
  const cacheDocuments = cache && isObject(cache.documents) ? cache.documents : {};
  const receiptByKey = new Map<string, JsonObject>();
  if (Array.isArray(receipt?.documents)) {
    for (const item of receipt.documents) {
      if (!isObject(item) || typeof item.sourceKey !== "string" ||
          !isHash(item.contentHash) || timestamp(item.retrievedAt) === null) {
        metadataErrors.push("receipt contains a malformed document row");
        continue;
      }
      if (receiptByKey.has(item.sourceKey)) {
        metadataErrors.push(`receipt repeats sourceKey ${item.sourceKey}`);
      }
      receiptByKey.set(item.sourceKey, item);
    }
  }

  const requiredByKey = new Map<string, { section: string; hash: string }>();
  if (Array.isArray(report?.drafts)) {
    for (const draft of report.drafts) {
      if (!isObject(draft) || !Array.isArray(draft.requiredDependencies)) {
        metadataErrors.push("report contains a malformed draft");
        continue;
      }
      for (const dependency of draft.requiredDependencies) {
        if (!isObject(dependency) || typeof dependency.sourceKey !== "string" ||
            !isHash(dependency.contentHash)) {
          metadataErrors.push("report contains a malformed dependency");
          continue;
        }
        const document = evidence[dependency.sourceKey];
        if (!isObject(document) || typeof document.section !== "string") {
          missing.add(dependency.sourceKey);
          continue;
        }
        const prior = requiredByKey.get(dependency.sourceKey);
        if (prior && prior.hash !== dependency.contentHash) {
          metadataErrors.push(`dependency ${dependency.sourceKey} has conflicting pinned hashes`);
        }
        requiredByKey.set(dependency.sourceKey, {
          section: document.section,
          hash: dependency.contentHash,
        });
      }
    }
  }

  for (const [sourceKey, required] of requiredByKey) {
    const document = evidence[sourceKey];
    const reportRetrievedAt = isObject(document) ? timestamp(document.retrievedAt) : null;
    if (!isObject(document) || document.sourceKey !== sourceKey ||
        document.contentHash !== required.hash || typeof document.text !== "string" ||
        hashText(document.text) !== required.hash || reportRetrievedAt === null) {
      metadataErrors.push(`report evidence binding is malformed or tampered: ${sourceKey}`);
      hashDrift.add(required.section);
    }

    const receiptDocument = receiptByKey.get(sourceKey);
    if (!receiptDocument) {
      missing.add(required.section);
    } else if (receiptDocument.contentHash !== required.hash ||
        receiptDocument.retrievedAt !== (isObject(document) ? document.retrievedAt : undefined)) {
      metadataErrors.push(`receipt document does not exactly bind report evidence: ${sourceKey}`);
      hashDrift.add(required.section);
    }

    const cached = cacheDocuments[required.section];
    if (!isObject(cached)) {
      missing.add(required.section);
      requiringRetrieval.add(required.section);
      continue;
    }
    const cacheRetrievedAt = timestamp(cached.retrievedAt);
    if (cached.section !== required.section || !isHash(cached.contentHash) ||
        typeof cached.text !== "string" || cached.contentHash !== hashText(cached.text) ||
        cacheRetrievedAt === null) {
      metadataErrors.push(`cache document is malformed or tampered: ${required.section}`);
      hashDrift.add(required.section);
      continue;
    }
    if (cached.contentHash !== required.hash) {
      hashDrift.add(required.section);
      continue;
    }
    if (nowMs - cacheRetrievedAt > FLORIDA_REVIEWED_MAX_AGE_MS ||
        cacheRetrievedAt > nowMs) {
      stale.add(required.section);
      requiringRetrieval.add(required.section);
    } else if (reportRetrievedAt !== null && cacheRetrievedAt > reportRetrievedAt) {
      reassemblyRequired.add(required.section);
    }
  }

  for (const sourceKey of receiptByKey.keys()) {
    if (!requiredByKey.has(sourceKey)) {
      metadataErrors.push(`receipt contains unrequired sourceKey ${sourceKey}`);
    }
  }

  const dueBeforeMs = expiresAtMs === null
    ? null
    : expiresAtMs - FLORIDA_REVIEWED_PREFLIGHT_LEAD_MS;
  const dueWithinLead = dueBeforeMs === null || nowMs >= dueBeforeMs;
  const hasDependencyAction = Boolean(
    missing.size || hashDrift.size || stale.size || reassemblyRequired.size,
  );
  const invalid = metadataErrors.length > 0;
  const ok = !invalid && !hasDependencyAction && !dueWithinLead;
  const actions: string[] = [];
  if (invalid) actions.push("Stop: repair or regenerate tampered/malformed metadata; do not activate it.");
  if (requiringRetrieval.size) {
    actions.push("Retrieve only the listed requiringRetrieval sections; skip fresh cached sections.");
  }
  if (hashDrift.size) {
    actions.push("Hold changed hashes for evidence and legal review; never rebind them automatically.");
  }
  if (reassemblyRequired.size) {
    actions.push("Reassemble a receipt/report from unchanged newer evidence, then explicitly review and activate it.");
  }
  if (dueWithinLead && !invalid) {
    actions.push("Freshness is expired or due within 48 hours; follow the selective recovery runbook.");
  }

  return {
    ok,
    status: invalid ? "invalid" : ok ? "ready" : "action_required",
    checkedAt: now.toISOString(),
    leadHours: 48,
    expiresAt,
    dueBefore: dueBeforeMs === null ? null : new Date(dueBeforeMs).toISOString(),
    dueWithinLead,
    dependencies: {
      required: sorted([...requiredByKey.values()].map(value => value.section)),
      requiringRetrieval: sorted(requiringRetrieval),
      missing: sorted(missing),
      hashDrift: sorted(hashDrift),
      stale: sorted(stale),
      reassemblyRequired: sorted(reassemblyRequired),
    },
    metadataErrors,
    actions,
  };
}

function readJson(path: string): unknown {
  if (!existsSync(path)) throw new Error(`Required input is missing: ${path}`);
  return JSON.parse(readFileSync(path, "utf8")) as unknown;
}

export function runFloridaReviewedPreflightCli(): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Florida reviewed preflight is development-only");
  }
  const root = process.cwd();
  const paths = {
    report: resolve(root, "scripts/data-review/output/florida-reviewed-analysis.json"),
    receipt: resolve(root, "scripts/data-review/output/florida-reviewed-refresh-receipt.json"),
    eligibility: resolve(root, "shared/florida-reviewed-eligibility.json"),
    cache: resolve(root, "scripts/data-review/output/florida-batch-source-cache.json"),
  };
  try {
    const result = inspectFloridaReviewedPreflight({
      report: readJson(paths.report),
      receipt: readJson(paths.receipt),
      eligibility: readJson(paths.eligibility),
      cache: readJson(paths.cache),
    });
    console.log(JSON.stringify({ ...result, inputs: paths }, null, 2));
    if (!result.ok) process.exitCode = 1;
  } catch (error) {
    console.log(JSON.stringify({
      ok: false,
      status: "invalid",
      error: error instanceof Error ? error.message : String(error),
      inputs: paths,
      actions: ["Restore every required input, then rerun this read-only preflight."],
    }, null, 2));
    process.exitCode = 1;
  }
}

if (process.argv[1] &&
    fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runFloridaReviewedPreflightCli();
}