import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const analysisPath = resolve(root, "scripts/data-review/output/florida-reviewed-analysis-a.json");
const cachePath = resolve(root, "scripts/data-review/output/florida-batch-source-cache.json");
const packet = JSON.parse(readFileSync(analysisPath, "utf8"));
const cache = JSON.parse(readFileSync(cachePath, "utf8"));
const entries = new Map(packet.entries.map(entry => [entry.id, entry]));

if (packet.entries.length !== 25 || entries.size !== 25) {
  throw new Error("Expected the valid 25-entry A artifact");
}

function entry(id) {
  const value = entries.get(id);
  if (!value) throw new Error(`Missing targeted A entry ${id}`);
  return value;
}

function exactSpan(section, startText, endText) {
  const text = cache.documents[section]?.text;
  const start = text?.indexOf(startText) ?? -1;
  if (start < 0 || text.indexOf(startText, start + 1) >= 0) {
    throw new Error(`${section}: start text is absent or non-unique`);
  }
  const end = text.indexOf(endText, start);
  if (end < 0) throw new Error(`${section}: end text is absent`);
  const span = text.slice(start, end + endText.length);
  if (text.indexOf(span, start + 1) >= 0) {
    throw new Error(`${section}: resulting span is non-unique`);
  }
  return span;
}

const exposure = entry("fl-fs-800-03-1-unlawful-exposure-of-sexual-organs");
if (exposure.conductQuotes.length !== 5) {
  throw new Error("800.03(1) no longer has the expected pre-finalization evidence");
}
exposure.conductQuotes = exposure.conductQuotes.slice(0, 3);
exposure.notes =
  "Primary conduct evidence is confined to subsection (1). The separately declared whole-section exception dependency supplies subsection (3), which excludes breastfeeding and mere nudity at a place set apart for that purpose; the whole-section grading dependency supplies subsection (2).";

const firearm = entry("fl-fs-790-23-felons-and-delinquents-possession-of-firearms-ammunition-or-electric-weapons-or-devices-unlawful");
if (firearm.conductQuotes.length !== 8) {
  throw new Error("790.23(1) no longer has the expected pre-finalization evidence");
}
firearm.conductQuotes = firearm.conductQuotes.slice(0, 6);
firearm.notes =
  "Primary conduct evidence is confined to subsection (1). The separately declared whole-section exception dependency supplies subsection (2), under which the section does not apply after the specified restoration of civil rights and firearm authority or the specified expungement; whole-section grading evidence supplies subsections (3) and (4).";

entry("fl-fs-800-04-5-lewd-or-lascivious-molestation").identity.quote = exactSpan(
  "800.04",
  "A person who intentionally touches in a lewd or lascivious manner the breasts",
  "commits lewd or lascivious molestation.",
);
entry("fl-fs-800-04-6-lewd-or-lascivious-conduct").identity.quote = exactSpan(
  "800.04",
  "A person who:\n1. \nIntentionally touches a person under 16 years of age in a lewd or lascivious manner;",
  "commits lewd or lascivious conduct.",
);

for (const id of [
  "fl-fs-827-071-2-a-use-of-a-child-in-a-sexual-performance",
  "fl-fs-827-071-2-b-aggravated-use-of-a-child-in-a-sexual-performance",
  "fl-fs-827-071-3-promoting-a-sexual-performance-by-a-child",
]) {
  const value = entry(id);
  if (value.conductQuotes.length !== 1 ||
      !value.conductQuotes[0].startsWith("A person is guilty of ")) {
    throw new Error(`${id}: expected complete statutory guilt clause is unavailable`);
  }
  value.identity.quote = value.conductQuotes[0];
}

writeFileSync(analysisPath, `${JSON.stringify(packet, null, 2)}\n`);
console.log("Finalized seven targeted Florida A analysis entries");