/**
 * Import and verify Florida catalog citations against the Florida
 * Legislature's official Online Sunshine statute HTML. The committed
 * manifest is later seeded without network calls.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { criminalCharges } from "../../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../../shared/criminal-charge-citations";
import {
  buildFloridaManifestRecord,
  buildFloridaSourceUrl,
  normalizeFloridaSubdivision,
  parseFloridaCitation,
  type FloridaAuthorityManifest,
  type FloridaSourceDocument,
} from "../../server/data/florida-source-database-seed";

const RATE_LIMIT_MS = 700;
const MAX_RETRIES = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchStatute(url: string): Promise<{ html: string } | { error: string }> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(20000),
        headers: {
          "User-Agent": "OpenDefender-FloridaAuthorityImporter/1.0",
          Accept: "text/html, */*",
        },
      });
      if (response.status === 429 && attempt < MAX_RETRIES) {
        await sleep(1500 * (attempt + 1));
        continue;
      }
      if (!response.ok) return { error: `HTTP ${response.status}` };
      return { html: await response.text() };
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await sleep(1000 * (attempt + 1));
        continue;
      }
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }
  return { error: "Florida source request exhausted retries" };
}

function decodeHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|span)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const EFFECTIVE_DATE_PATTERN =
  /\beff(?:ective)?\.?\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2}),\s+(\d{4})/gi;
const MONTH_NAMES: Record<string, string> = {
  jan: "January", january: "January", feb: "February", february: "February",
  mar: "March", march: "March", apr: "April", april: "April", may: "May",
  jun: "June", june: "June", jul: "July", july: "July", aug: "August",
  august: "August", sep: "September", sept: "September", september: "September",
  oct: "October", october: "October", nov: "November", november: "November",
  dec: "December", december: "December",
};

export function extractLatestFloridaEffectiveDate(text: string): string | null {
  const dates = [...text.matchAll(EFFECTIVE_DATE_PATTERN)]
    .map((match) => {
      const month = MONTH_NAMES[match[1].toLowerCase()];
      const day = Number(match[2]);
      const year = Number(match[3]);
      return {
        value: `${month} ${day}, ${year}`,
        time: Date.UTC(year, new Date(`${month} 1, 2000`).getUTCMonth(), day),
      };
    })
    .filter((date) => Number.isFinite(date.time));
  dates.sort((left, right) => right.time - left.time);
  return dates[0]?.value ?? null;
}

interface FloridaHtmlNode {
  tag: string;
  className: string;
  text: string;
  order: number;
  parent: FloridaHtmlNode | null;
  children: FloridaHtmlNode[];
}

function parseFloridaHtmlTree(html: string): FloridaHtmlNode {
  let order = 0;
  const root: FloridaHtmlNode = {
    tag: "root",
    className: "",
    text: "",
    order: order++,
    parent: null,
    children: [],
  };
  const stack: FloridaHtmlNode[] = [root];
  const tokens = html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? [];
  for (const token of tokens) {
    if (token.startsWith("<!--")) continue;
    if (token.startsWith("</")) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    if (token.startsWith("<")) {
      if (/^<\s*(?:br|hr|img|input|meta|link)\b/i.test(token)) continue;
      const tag = token.match(/^<\s*([a-z0-9]+)/i)?.[1]?.toLowerCase();
      if (!tag) continue;
      const className = token.match(/\bclass\s*=\s*["']([^"']*)["']/i)?.[1] ?? "";
      const node: FloridaHtmlNode = {
        tag,
        className,
        text: "",
        order: order++,
        parent: stack[stack.length - 1],
        children: [],
      };
      stack[stack.length - 1].children.push(node);
      if (!/\/\s*>$/.test(token)) stack.push(node);
      continue;
    }
    stack[stack.length - 1].text += token;
  }
  return root;
}

function hasFloridaSubdivision(html: string, subdivision: string): boolean {
  const requested = normalizeFloridaSubdivision(subdivision);
  if (requested.length === 0) return false;
  const root = parseFloridaHtmlTree(html);
  const numberNodes: FloridaHtmlNode[] = [];
  const visit = (node: FloridaHtmlNode) => {
    if (node.className.split(/\s+/).includes("Number")) numberNodes.push(node);
    node.children.forEach(visit);
  };
  visit(root);
  const blockClasses = new Set(["Subsection", "Paragraph", "SubParagraph"]);
  const hasClass = (node: FloridaHtmlNode, className: string) =>
    node.className.split(/\s+/).includes(className);
  const nearestBlockAncestor = (node: FloridaHtmlNode): FloridaHtmlNode | null => {
    let current = node.parent;
    while (current) {
      if ([...blockClasses].some((className) => hasClass(current, className))) return current;
      current = current.parent;
    }
    return null;
  };
  const nearestSubsectionAncestor = (node: FloridaHtmlNode): FloridaHtmlNode | null => {
    let current = node.parent;
    while (current) {
      if (hasClass(current, "Subsection")) return current;
      current = current.parent;
    }
    return null;
  };

  return numberNodes.some((node) => {
    const ownPath = normalizeFloridaSubdivision(decodeHtml(node.text));
    if (ownPath.length >= requested.length &&
      requested.every((part, index) => ownPath[index] === part)) {
      return true;
    }

    const blocks: FloridaHtmlNode[] = [];
    let current = node.parent;
    while (current) {
      if ([...blockClasses].some((className) => hasClass(current, className))) blocks.push(current);
      current = current.parent;
    }
    const path: string[] = [];
    for (const block of blocks.reverse()) {
      const number = numberNodes.find((candidate) =>
        candidate.order <= node.order && nearestBlockAncestor(candidate) === block,
      );
      if (number) {
        path.push(...normalizeFloridaSubdivision(decodeHtml(number.text)));
      } else if (hasClass(block, "Subsection")) {
        const inheritedPrefix = numberNodes
          .filter((candidate) =>
            candidate.order <= node.order && nearestSubsectionAncestor(candidate) === block,
          )
          .map((candidate) => normalizeFloridaSubdivision(decodeHtml(candidate.text)))
          .find((candidatePath) =>
            candidatePath.length > 1 && /^\d+$/.test(candidatePath[0]),
          );
        if (inheritedPrefix) path.push(inheritedPrefix[0]);
      }
    }
    return path.length >= requested.length &&
      requested.every((part, index) => path[index] === part);
  });
}

export function extractFloridaDocument(
  html: string,
  section: string,
  sourceUrl: string,
  retrievedAt: Date,
  subdivision: string | null = null,
): FloridaSourceDocument | null {
  const sectionStart = html.indexOf('<div class="Section">');
  const bodyEnd = sectionStart >= 0 ? html.indexOf("</body>", sectionStart) : -1;
  if (sectionStart < 0 || bodyEnd < 0) return null;
  const block = html.slice(sectionStart, bodyEnd);
  const sectionNumber = block.match(/class="SectionNumber">([^<]*)<\/span>/i)?.[1]
    ? decodeHtml(block.match(/class="SectionNumber">([^<]*)<\/span>/i)![1])
      .replace(/[^\d.]/g, "")
    : undefined;
  if (sectionNumber !== section) return null;
  const catchline = block.match(/class="CatchlineText">([\s\S]*?)<\/span>/i)?.[1];
  if (!catchline) return null;
  const title = decodeHtml(catchline).replace(/[.;\s]+$/, "").trim();
  const text = decodeHtml(block);
  if (!title || !text) return null;
  if (subdivision && !hasFloridaSubdivision(block, subdivision)) return null;
  return {
    section,
    title,
    text,
    sourceUrl,
    retrievedAt,
    effectiveDateStart: extractLatestFloridaEffectiveDate(text),
  };
}

export async function main(): Promise<void> {
  const importedAt = new Date();
  const floridaCharges = criminalCharges.filter((charge) => charge.jurisdiction === "FL");
  const cache = new Map<string, FloridaSourceDocument | null>();
  const htmlCache = new Map<string, { html: string; sourceUrl: string } | null>();
  const errors = new Map<string, string>();
  let requests = 0;

  for (const charge of floridaCharges) {
    const references = parseFloridaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    for (const reference of references) {
      const referenceKey = `${reference.section}|${reference.subdivision ?? ""}`;
      if (cache.has(referenceKey)) continue;
      let source = htmlCache.get(reference.section);
      if (source === undefined) {
        if (requests > 0) await sleep(RATE_LIMIT_MS);
        const sourceUrl = buildFloridaSourceUrl(reference.section);
        const result = await fetchStatute(sourceUrl);
        requests++;
        if ("error" in result) {
          htmlCache.set(reference.section, null);
          errors.set(referenceKey, result.error);
          cache.set(referenceKey, null);
          console.error(`[FAIL] ${reference.section}${reference.subdivision ?? ""}: ${result.error}`);
          continue;
        }
        source = { html: result.html, sourceUrl };
        htmlCache.set(reference.section, source);
      }
      const document = source
        ? extractFloridaDocument(
        source.html,
        reference.section,
        source.sourceUrl,
        importedAt,
        reference.subdivision,
      )
        : null;
      cache.set(referenceKey, document);
      if (document) {
        console.log(`[OK] ${reference.section}${reference.subdivision ?? ""} — ${document.title}`);
      } else {
        const error = `Official page did not contain the expected section${reference.subdivision ? ` and subdivision ${reference.subdivision}` : ""} structure`;
        errors.set(referenceKey, error);
        console.error(`[FAIL] ${reference.section}${reference.subdivision ?? ""}: invalid section structure`);
      }
    }
  }

  const catalogRecords = floridaCharges.map((charge) => {
    const references = parseFloridaCitation(CHARGE_CITATIONS[charge.id]?.citation ?? "");
    const documents = references.flatMap((reference) => {
      const document = cache.get(`${reference.section}|${reference.subdivision ?? ""}`);
      return document ? [document] : [];
    });
    const missing = references.find((reference) =>
      !cache.get(`${reference.section}|${reference.subdivision ?? ""}`),
    );
    const record = buildFloridaManifestRecord(
      charge,
      documents,
      importedAt,
      missing
        ? `Florida Legislature section ${missing.section}${missing.subdivision ?? ""} could not be verified.`
        : undefined,
    );
    console.log(
      `[${record.disposition}] ${record.chargeId}${record.canonicalTitle ? ` — ${record.canonicalTitle}` : ""}`,
    );
    return record;
  });

  const manifest: FloridaAuthorityManifest = {
    jurisdiction: "FL",
    generatedAt: importedAt,
    source: "Florida Legislature Online Sunshine (leg.state.fl.us/statutes)",
    catalogRecords,
  };
  const outputPath = path.join(process.cwd(), "scripts/data-review/output/fl-source-manifest.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify({
    outputPath,
    catalogRecords: catalogRecords.length,
    retained: catalogRecords.filter((record) =>
      record.disposition === "retain" || record.disposition === "exact_alias_rename").length,
    withheld: catalogRecords.filter((record) =>
      record.disposition !== "retain" && record.disposition !== "exact_alias_rename").length,
    sources: new Set(catalogRecords.flatMap((record) =>
      record.provisions.map((provision) => provision.sourceKey))).size,
    snapshots: catalogRecords.reduce((sum, record) => sum + record.provisions.length, 0),
    requests,
    sectionErrors: Object.fromEntries(errors),
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    console.error("Florida source database import failed:", error);
    process.exit(1);
  });
}