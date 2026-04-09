/**
 * Detect Fabricated Charges
 *
 * Scans all criminal charges for structural and content signals of
 * template-generated or fabricated entries. Produces a JSON report and
 * a human-readable console summary.
 *
 * Checks by tier:
 *
 *   Tier 1 — Structural (high signal, low false-positive rate)
 *     DUPLICATE_CODE        — Same statute code used by two charges in the same state
 *     IL_DOUBLE_SLASH       — IL ILCS code contains '5/5/' (corruption we've seen before)
 *     TX_HOMICIDE_CODE      — TX homicide charge with code outside § 19.xx range
 *     SHORT_CODE            — Statute code under 3 characters
 *
 *   Tier 2 — Naming conventions (medium signal; requires per-state knowledge)
 *     THIRD_DEGREE_MURDER   — "Murder in the Third Degree" (valid only in MN and a few others)
 *     DEGREE_ASSAULT_WRONG  — Degree-based assault naming in confirmed non-degree states (TX, FL, CA, IL)
 *     WRONG_TERMINOLOGY     — "Rape" used in FL, which uses "Sexual Battery" (§ 794.011)
 *     THIRD_DEGREE_GENERAL  — Any other "in the Third Degree" charge name
 *
 *   Tier 3 — Boilerplate detection (high volume; flag quality issues, not fabrications per se)
 *     BOILERPLATE_DESC      — Description < 100 chars ending in "under [State] law"
 *     IDENTICAL_DESC        — Description identical to 3+ other charges (after normalizing state names)
 *     TEMPLATE_DEFENSES     — commonDefenses is exactly the default template array
 *
 * Usage:
 *   npx tsx scripts/data-review/detect-fabricated-charges.ts
 *   npx tsx scripts/data-review/detect-fabricated-charges.ts --state TX
 *   npx tsx scripts/data-review/detect-fabricated-charges.ts --tier 1
 *   npx tsx scripts/data-review/detect-fabricated-charges.ts --tier 2
 *   npx tsx scripts/data-review/detect-fabricated-charges.ts --summary-only
 *
 * Output:
 *   scripts/data-review/output/fabricated-charges-report.json
 */

import fs from 'fs';
import path from 'path';
import { criminalCharges } from '../../shared/criminal-charges';
import type { CriminalCharge } from '../../shared/criminal-charges';

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

const stateArg = args.indexOf('--state');
const STATE_FILTER: string | null = stateArg !== -1 ? (args[stateArg + 1] ?? '').toUpperCase() : null;

const tierArg = args.indexOf('--tier');
const TIER_FILTER: number | null = tierArg !== -1 ? parseInt(args[tierArg + 1] ?? '', 10) : null;

const SUMMARY_ONLY = args.includes('--summary-only');

// ── Output ────────────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(process.cwd(), 'scripts/data-review/output');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'fabricated-charges-report.json');

// ── State naming conventions ──────────────────────────────────────────────────

/**
 * States confirmed (via statute lookup during the CA/NY/TX/FL/IL audit) NOT to
 * use degree-based naming for assault offenses. These states use Simple/Aggravated
 * structure instead.
 */
const CONFIRMED_NO_DEGREE_ASSAULT = new Set(['TX', 'FL', 'CA', 'IL']);

/**
 * States confirmed NOT to have "Murder in the Third Degree".
 * MN (§ 609.195) is the primary state that does. Most others don't.
 * This set covers only states where we've verified absence.
 */
const CONFIRMED_NO_THIRD_DEGREE_MURDER = new Set(['CA', 'TX', 'FL', 'IL', 'NY']);

/**
 * States confirmed NOT to use "Rape" as a charge name.
 * FL uses "Sexual Battery" (§ 794.011).
 * Note: CA § 261 IS called "Rape" — CA is intentionally excluded.
 */
const CONFIRMED_NO_RAPE_TERMINOLOGY = new Set(['FL']);

/**
 * The exact commonDefenses array produced by the Replit agent template.
 * Any charge with exactly this array has no charge-specific defense analysis.
 */
const TEMPLATE_DEFENSES_JSON = JSON.stringify([
  'Consent',
  'Mistaken identity',
  'False accusation',
  'Insufficient evidence',
]);

/**
 * Full state name → 2-letter code, used for description normalization.
 */
const STATE_NAMES: string[] = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

const STATE_CODE_TO_NAME: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas',
  KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
  VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
  WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia',
};

// ── Flag types ────────────────────────────────────────────────────────────────

type Tier = 1 | 2 | 3;

interface Flag {
  tier: Tier;
  code: string;
  message: string;
  chargeId: string;
  chargeName: string;
  jurisdiction: string;
  detail?: string;
}

// ── Tier 1: Structural checks ─────────────────────────────────────────────────

function checkDuplicateCodes(charges: CriminalCharge[]): Flag[] {
  const flags: Flag[] = [];
  const seen = new Map<string, string>(); // "JURISDICTION:code" → first chargeId

  for (const charge of charges) {
    if (!charge.code?.trim()) continue;
    const key = `${charge.jurisdiction}:${charge.code.trim()}`;
    const existing = seen.get(key);
    if (existing) {
      flags.push({
        tier: 1,
        code: 'DUPLICATE_CODE',
        message: `Duplicate statute code '${charge.code}' in ${charge.jurisdiction}`,
        chargeId: charge.id,
        chargeName: charge.name,
        jurisdiction: charge.jurisdiction,
        detail: `First seen on charge: ${existing}`,
      });
    } else {
      seen.set(key, charge.id);
    }
  }

  return flags;
}

function checkILDoubleSlash(charges: CriminalCharge[]): Flag[] {
  return charges
    .filter(c => c.jurisdiction === 'IL' && c.code?.includes('5/5/'))
    .map(c => ({
      tier: 1 as Tier,
      code: 'IL_DOUBLE_SLASH',
      message: `IL ILCS code has double-slash corruption: '${c.code}'`,
      chargeId: c.id,
      chargeName: c.name,
      jurisdiction: 'IL',
      detail: `Likely should be: '${c.code?.replace(/5\/5\//g, '5/')}'`,
    }));
}

function checkTXHomicideCodes(charges: CriminalCharge[]): Flag[] {
  const homicidePattern = /murder|manslaughter|homicide|killing/i;
  return charges
    .filter(c => {
      if (c.jurisdiction !== 'TX') return false;
      if (!homicidePattern.test(c.name)) return false;
      if (!c.code?.trim()) return false;
      // TX Penal Code homicide is entirely within § 19.xx (§§ 19.01–19.06).
      return !c.code.trim().match(/^19\./);
    })
    .map(c => ({
      tier: 1 as Tier,
      code: 'TX_HOMICIDE_CODE',
      message: `TX homicide charge has a code outside the § 19.xx range: '${c.code}'`,
      chargeId: c.id,
      chargeName: c.name,
      jurisdiction: 'TX',
      detail: 'TX Penal Code homicide offenses are §§ 19.01–19.06. Any other section is fabricated or misattributed.',
    }));
}

function checkShortCodes(charges: CriminalCharge[]): Flag[] {
  return charges
    .filter(c => {
      const trimmed = c.code?.trim();
      return trimmed && trimmed.length < 3;
    })
    .map(c => ({
      tier: 1 as Tier,
      code: 'SHORT_CODE',
      message: `Statute code is suspiciously short: '${c.code}'`,
      chargeId: c.id,
      chargeName: c.name,
      jurisdiction: c.jurisdiction,
      detail: 'Codes under 3 characters are almost always placeholders or generation artifacts.',
    }));
}

// ── Tier 2: Naming convention checks ─────────────────────────────────────────

function checkThirdDegreeMurder(charges: CriminalCharge[]): Flag[] {
  return charges
    .filter(c => /murder.{0,20}third\s+degree|third\s+degree.{0,20}murder/i.test(c.name))
    .map(c => ({
      tier: 2 as Tier,
      code: 'THIRD_DEGREE_MURDER',
      message: '"Murder in the Third Degree" — almost certainly fabricated',
      chargeId: c.id,
      chargeName: c.name,
      jurisdiction: c.jurisdiction,
      detail: CONFIRMED_NO_THIRD_DEGREE_MURDER.has(c.jurisdiction)
        ? `CONFIRMED: ${c.jurisdiction} does not have this offense. Remove this charge.`
        : `Unconfirmed: verify whether ${c.jurisdiction} statute actually uses this name. MN (§ 609.195) is the primary state that does.`,
    }));
}

function checkDegreeAssaultWrongState(charges: CriminalCharge[]): Flag[] {
  const degreePattern = /assault.{0,40}(first|second|third|1st|2nd|3rd)\s+degree|(first|second|third|1st|2nd|3rd)\s+degree.{0,40}assault/i;
  return charges
    .filter(c => CONFIRMED_NO_DEGREE_ASSAULT.has(c.jurisdiction) && degreePattern.test(c.name))
    .map(c => ({
      tier: 2 as Tier,
      code: 'DEGREE_ASSAULT_WRONG_STATE',
      message: `Degree-based assault naming in ${c.jurisdiction} (confirmed non-degree state)`,
      chargeId: c.id,
      chargeName: c.name,
      jurisdiction: c.jurisdiction,
      detail: `${c.jurisdiction} uses Simple Assault / Aggravated Assault structure, not first/second/third degree. This charge was likely generated from a template.`,
    }));
}

function checkWrongTerminology(charges: CriminalCharge[]): Flag[] {
  return charges
    .filter(c => CONFIRMED_NO_RAPE_TERMINOLOGY.has(c.jurisdiction) && /\brape\b/i.test(c.name))
    .map(c => ({
      tier: 2 as Tier,
      code: 'WRONG_TERMINOLOGY',
      message: `"Rape" used as charge name in ${c.jurisdiction}`,
      chargeId: c.id,
      chargeName: c.name,
      jurisdiction: c.jurisdiction,
      detail: `${c.jurisdiction} uses "Sexual Battery" (§ 794.011), not "Rape". This is a terminology mismatch with state law.`,
    }));
}

function checkThirdDegreeGeneral(charges: CriminalCharge[]): Flag[] {
  const alreadyCaughtPattern = /murder|assault/i;
  return charges
    .filter(c => {
      if (alreadyCaughtPattern.test(c.name)) return false; // handled by more specific checks
      return /in\s+the\s+third\s+degree/i.test(c.name);
    })
    .map(c => ({
      tier: 2 as Tier,
      code: 'THIRD_DEGREE_GENERAL',
      message: `"In the Third Degree" naming — verify this matches the actual statute`,
      chargeId: c.id,
      chargeName: c.name,
      jurisdiction: c.jurisdiction,
      detail: 'Third-degree naming is state-specific. Confirm the statute text uses this exact language before keeping this entry.',
    }));
}

// ── Tier 3: Boilerplate detection ─────────────────────────────────────────────

function checkBoilerplateDescription(charges: CriminalCharge[]): Flag[] {
  const flags: Flag[] = [];

  for (const charge of charges) {
    const desc = charge.description?.trim();
    if (!desc) continue;

    const stateName = STATE_CODE_TO_NAME[charge.jurisdiction] ?? charge.jurisdiction;

    // Template pattern: short description ending with "under [State] law"
    const isBoilerplate =
      desc.length < 100 &&
      new RegExp(`under ${stateName} law\\.?$`, 'i').test(desc);

    if (isBoilerplate) {
      flags.push({
        tier: 3,
        code: 'BOILERPLATE_DESC',
        message: 'Description is template boilerplate with no substantive legal content',
        chargeId: charge.id,
        chargeName: charge.name,
        jurisdiction: charge.jurisdiction,
        detail: desc,
      });
    }
  }

  return flags;
}

function checkIdenticalDescriptions(charges: CriminalCharge[]): Flag[] {
  // Normalize: lowercase + replace all state names with placeholder
  const normalize = (desc: string): string => {
    let s = desc.toLowerCase().trim();
    for (const name of STATE_NAMES) {
      s = s.replace(new RegExp(name.toLowerCase(), 'gi'), 'STATE');
    }
    return s;
  };

  // Group charges by normalized description
  const groups = new Map<string, string[]>(); // normalized → chargeIds
  for (const charge of charges) {
    if (!charge.description?.trim()) continue;
    const key = normalize(charge.description);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(charge.id);
  }

  const flags: Flag[] = [];

  for (const [, ids] of groups) {
    // 3+ charges sharing the same normalized description is a template signal.
    // 1–2 could be coincidence (e.g., two states happen to phrase a law the same way).
    if (ids.length < 3) continue;

    for (const id of ids) {
      const charge = charges.find(c => c.id === id);
      if (!charge) continue;
      const sample = ids.filter(i => i !== id).slice(0, 3);
      flags.push({
        tier: 3,
        code: 'IDENTICAL_DESC',
        message: `Description identical to ${ids.length - 1} other charge(s) after normalizing state names`,
        chargeId: charge.id,
        chargeName: charge.name,
        jurisdiction: charge.jurisdiction,
        detail: `Shared with: ${sample.join(', ')}${ids.length - 1 > 3 ? ` (+${ids.length - 1 - 3} more)` : ''}`,
      });
    }
  }

  return flags;
}

function checkTemplateDefenses(charges: CriminalCharge[]): Flag[] {
  return charges
    .filter(c => {
      if (!c.commonDefenses?.length) return false;
      return JSON.stringify(c.commonDefenses) === TEMPLATE_DEFENSES_JSON;
    })
    .map(c => ({
      tier: 3 as Tier,
      code: 'TEMPLATE_DEFENSES',
      message: 'commonDefenses is the unchanged template array — no charge-specific analysis',
      chargeId: c.id,
      chargeName: c.name,
      jurisdiction: c.jurisdiction,
      detail: 'Generated defenses: Consent, Mistaken identity, False accusation, Insufficient evidence.',
    }));
}

// ── Report types ──────────────────────────────────────────────────────────────

interface StateCount {
  tier1: number;
  tier2: number;
  tier3: number;
  total: number;
}

interface Report {
  generatedAt: string;
  totalCharges: number;
  flaggedCharges: number;
  totalFlags: number;
  flagsBySeverity: { tier1: number; tier2: number; tier3: number };
  flagsByCode: Record<string, number>;
  flagsByState: Record<string, StateCount>;
  /** All tier 1 and 2 flags — the actionable set. Omits tier 3 for brevity. */
  tier1and2Flags: Flag[];
  /** Tier 3 summary by state only (full list is too large to include inline). */
  tier3SummaryByState: Record<string, number>;
  /** Full tier 3 flag list for programmatic use. */
  tier3Flags: Flag[];
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main(): void {
  let charges = criminalCharges as CriminalCharge[];

  if (STATE_FILTER) {
    charges = charges.filter(c => c.jurisdiction === STATE_FILTER);
    if (charges.length === 0) {
      console.error(`No charges found for state: ${STATE_FILTER}`);
      process.exit(1);
    }
  }

  console.log('\n=== Fabricated Charge Detector ===');
  console.log(`Total charges: ${charges.length}${STATE_FILTER ? ` (filtered to ${STATE_FILTER})` : ''}`);
  if (TIER_FILTER) console.log(`Tier filter:   ${TIER_FILTER}`);
  console.log('');

  // ── Run checks ──────────────────────────────────────────────────────────────

  const tier1Flags: Flag[] = [];
  const tier2Flags: Flag[] = [];
  const tier3Flags: Flag[] = [];

  if (!TIER_FILTER || TIER_FILTER === 1) {
    tier1Flags.push(...checkDuplicateCodes(charges));
    tier1Flags.push(...checkILDoubleSlash(charges));
    tier1Flags.push(...checkTXHomicideCodes(charges));
    tier1Flags.push(...checkShortCodes(charges));
  }

  if (!TIER_FILTER || TIER_FILTER === 2) {
    tier2Flags.push(...checkThirdDegreeMurder(charges));
    tier2Flags.push(...checkDegreeAssaultWrongState(charges));
    tier2Flags.push(...checkWrongTerminology(charges));
    tier2Flags.push(...checkThirdDegreeGeneral(charges));
  }

  if (!TIER_FILTER || TIER_FILTER === 3) {
    tier3Flags.push(...checkBoilerplateDescription(charges));
    tier3Flags.push(...checkIdenticalDescriptions(charges));
    tier3Flags.push(...checkTemplateDefenses(charges));
  }

  const allFlags = [...tier1Flags, ...tier2Flags, ...tier3Flags];
  const flaggedIds = new Set(allFlags.map(f => f.chargeId));

  // ── Aggregate stats ──────────────────────────────────────────────────────────

  const flagsByCode: Record<string, number> = {};
  const flagsByState: Record<string, StateCount> = {};

  for (const flag of allFlags) {
    flagsByCode[flag.code] = (flagsByCode[flag.code] ?? 0) + 1;

    if (!flagsByState[flag.jurisdiction]) {
      flagsByState[flag.jurisdiction] = { tier1: 0, tier2: 0, tier3: 0, total: 0 };
    }
    const slot = `tier${flag.tier}` as keyof StateCount;
    (flagsByState[flag.jurisdiction][slot] as number)++;
    flagsByState[flag.jurisdiction].total++;
  }

  const tier3SummaryByState: Record<string, number> = {};
  for (const flag of tier3Flags) {
    tier3SummaryByState[flag.jurisdiction] = (tier3SummaryByState[flag.jurisdiction] ?? 0) + 1;
  }

  // ── Console: Summary ─────────────────────────────────────────────────────────

  console.log('── Overall ──────────────────────────────────────────────────────');
  console.log(`Flagged charges:           ${flaggedIds.size} of ${charges.length} (${Math.round(flaggedIds.size / charges.length * 100)}%)`);
  console.log(`Tier 1 flags (structural): ${tier1Flags.length}`);
  console.log(`Tier 2 flags (naming):     ${tier2Flags.length}`);
  console.log(`Tier 3 flags (boilerplate):${tier3Flags.length}`);
  console.log('');

  console.log('── Flags by type ────────────────────────────────────────────────');
  for (const [code, count] of Object.entries(flagsByCode).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${code.padEnd(28)} ${String(count).padStart(5)}`);
  }
  console.log('');

  // Top states by tier 1+2 impact (most meaningful signals)
  const stateRanked = Object.entries(flagsByState)
    .map(([state, counts]) => ({ state, t12: counts.tier1 + counts.tier2, ...counts }))
    .filter(s => s.t12 > 0)
    .sort((a, b) => b.t12 - a.t12);

  if (stateRanked.length > 0) {
    console.log('── States with Tier 1+2 flags (top 25) ─────────────────────────');
    console.log(`  ${'State'.padEnd(6)} ${'T1'.padStart(4)} ${'T2'.padStart(4)} ${'T3'.padStart(6)}`);
    for (const s of stateRanked.slice(0, 25)) {
      console.log(`  ${s.state.padEnd(6)} ${String(s.tier1).padStart(4)} ${String(s.tier2).padStart(4)} ${String(s.tier3).padStart(6)}`);
    }
    console.log('');
  }

  // ── Console: Detail (tier 1 + 2 only, tier 3 is too voluminous) ─────────────

  if (!SUMMARY_ONLY) {
    if (tier1Flags.length > 0) {
      console.log('── Tier 1: Structural flags (fix immediately) ───────────────────');
      for (const flag of tier1Flags) {
        console.log(`\n  [${flag.code}] ${flag.chargeName} (${flag.jurisdiction}) — ${flag.chargeId}`);
        console.log(`  ${flag.message}`);
        if (flag.detail) console.log(`  → ${flag.detail}`);
      }
      console.log('');
    }

    if (tier2Flags.length > 0) {
      console.log('── Tier 2: Naming convention flags (verify against statute) ─────');
      for (const flag of tier2Flags) {
        console.log(`\n  [${flag.code}] ${flag.chargeName} (${flag.jurisdiction}) — ${flag.chargeId}`);
        console.log(`  ${flag.message}`);
        if (flag.detail) console.log(`  → ${flag.detail}`);
      }
      console.log('');
    }

    if ((TIER_FILTER === 3) && tier3Flags.length > 0) {
      console.log('── Tier 3: Boilerplate flags (shown because --tier 3 was set) ───');
      for (const flag of tier3Flags.slice(0, 50)) {
        console.log(`\n  [${flag.code}] ${flag.chargeName} (${flag.jurisdiction})`);
        if (flag.detail) console.log(`  → ${flag.detail}`);
      }
      if (tier3Flags.length > 50) {
        console.log(`\n  ... and ${tier3Flags.length - 50} more. See JSON report for full list.`);
      }
      console.log('');
    }
  }

  // ── Write JSON report ────────────────────────────────────────────────────────

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const report: Report = {
    generatedAt: new Date().toISOString(),
    totalCharges: charges.length,
    flaggedCharges: flaggedIds.size,
    totalFlags: allFlags.length,
    flagsBySeverity: {
      tier1: tier1Flags.length,
      tier2: tier2Flags.length,
      tier3: tier3Flags.length,
    },
    flagsByCode,
    flagsByState,
    tier1and2Flags: [...tier1Flags, ...tier2Flags],
    tier3SummaryByState,
    tier3Flags,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2));
  console.log(`Report written to: ${OUTPUT_PATH}`);

  // Exit 1 if any tier 1 flags found (structural problems are blocking)
  if (tier1Flags.length > 0 && !STATE_FILTER) {
    process.exit(1);
  }
}

main();
