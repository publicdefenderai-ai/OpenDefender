/**
 * Refresh the committed official-code snapshots used by the MN/VA/MI
 * commission comparison reports.
 *
 * This command always bypasses the seven-day response cache. It fetches every
 * section represented in the citation overlay, validates the response, then
 * atomically updates all three fixtures before replaying the importer to
 * regenerate the per-state and combined reports.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  fetchOfficialDocuments,
  parseCitationSections,
  type OfficialCodeState,
  type OfficialCodeFixture,
} from "./official-code-verifier";

const PROJECT_ROOT = process.cwd();
const FIXTURE_DIR = path.join(PROJECT_ROOT, "tests/fixtures/official-code");
const SOURCE_CACHE_DIR = path.join(PROJECT_ROOT, ".cache/official-code");
const IMPORTER_PATH = path.join(PROJECT_ROOT, "scripts/data-review/import-commission-citations.ts");
const TSX_PATH = path.join(PROJECT_ROOT, "node_modules/.bin/tsx");
const TARGETS: readonly OfficialCodeState[] = ["MN", "VA", "MI"];

function sectionsFor(state: OfficialCodeState): string[] {
  const prefix = `${state.toLowerCase()}-`;
  return [...new Set(
    Object.entries(CHARGE_CITATIONS)
      .filter(([id]) => id.startsWith(prefix))
      .flatMap(([, entry]) => parseCitationSections(entry.citation)),
  )].sort();
}

function fixtureFor(
  state: OfficialCodeState,
  result: Awaited<ReturnType<typeof fetchOfficialDocuments>>,
): OfficialCodeFixture {
  const sources = [...result.documents.values()]
    .sort((a, b) => a.section.localeCompare(b.section))
    .map((document) => {
      const snapshot = result.snapshots.get(document.section);
      if (!snapshot) throw new Error(`Missing raw snapshot for ${state} § ${document.section}`);
      return {
        section: document.section,
        sourceUrl: snapshot.sourceUrl,
        html: snapshot.html,
        sourceHash: document.sourceHash,
        retrievedAt: snapshot.retrievedAt,
      };
    });
  return { state, retrievedAt: new Date().toISOString(), sources };
}

function writeFixture(state: OfficialCodeState, fixture: OfficialCodeFixture): void {
  const fixturePath = path.join(FIXTURE_DIR, `${state.toLowerCase()}-official-code.json`);
  const temporaryPath = `${fixturePath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(fixture, null, 2)}\n`, "utf8");
  fs.renameSync(temporaryPath, fixturePath);
}

async function main(): Promise<void> {
  fs.mkdirSync(FIXTURE_DIR, { recursive: true });

  const refreshed = new Map<OfficialCodeState, OfficialCodeFixture>();
  for (const state of TARGETS) {
    const sections = sectionsFor(state);
    console.log(`\nRefreshing ${state}: ${sections.length} official sections`);
    const result = await fetchOfficialDocuments(state, sections, {
      cacheDir: SOURCE_CACHE_DIR,
      refresh: true,
    });
    const failures = Object.entries(result.errors);
    if (failures.length > 0 || result.documents.size !== sections.length) {
      const details = failures.map(([section, error]) => `${section}: ${error}`).join("\n");
      throw new Error(
        `${state} refresh failed; committed fixture was not changed.\n${details || "One or more sections were not retrieved."}`,
      );
    }
    const incomplete = [...result.documents.values()]
      .filter((document) => !document.title || !document.text || document.currentness.status === "unverified")
      .map((document) => `${document.section} (missing title, text, or dated currentness evidence)`);
    if (incomplete.length > 0) {
      throw new Error(
        `${state} refresh returned incomplete official documents; committed fixture was not changed.\n${incomplete.join("\n")}`,
      );
    }
    for (const [section, decision] of Object.entries(result.cacheStatus)) {
      if (decision.previousStatus === "stale" || decision.previousStatus === "invalid") {
        console.log(`  Replaced ${decision.previousStatus} cached response for § ${section}.`);
      }
    }
    refreshed.set(state, fixtureFor(state, result));
  }

  for (const [state, fixture] of refreshed) {
    writeFixture(state, fixture);
    console.log(`Wrote ${state} fixture with ${fixture.sources.length} source snapshots.`);
  }

  for (const state of TARGETS) {
    console.log(`\nReplaying ${state} fixture to regenerate reports`);
    execFileSync(TSX_PATH, [IMPORTER_PATH, "--state", state.toLowerCase(), "--replay-fixtures"], {
      cwd: PROJECT_ROOT,
      stdio: "inherit",
    });
  }
  console.log("\nOfficial-code snapshots and comparison reports refreshed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});