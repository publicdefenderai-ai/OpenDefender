import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(new URL(".", import.meta.url));
const targets = [
  {
    id: "fl-381.986",
    authority: "Fla. Stat. § 381.986",
    url: "https://www.flsenate.gov/Laws/Statutes/2026/381.986",
    expected: {
      title: "Chapter 381 Section 986 - 2026 Florida Statutes",
      edition: "2026 Florida Statutes",
      section: "F.S. 381.986",
    },
  },
  {
    id: "fl-39.01",
    authority: "Fla. Stat. § 39.01",
    url: "https://www.flsenate.gov/Laws/Statutes/2026/39.01",
    expected: {
      title: "Chapter 39 Section 01 - 2026 Florida Statutes",
      edition: "2026 Florida Statutes",
      section: "F.S. 39.01",
    },
  },
  ...["802", "822", "830"].map(section => ({
    id: `usc-21-${section}`,
    authority: `21 U.S.C. § ${section}`,
    url: `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title21-section${section}&num=0&edition=prelim`,
    expected: {
      title: `21 USC ${section}:`,
      section: `&sect;${section}.`,
      preliminaryEdition: 'documentYear ="prelim"',
    },
  })),
];

const sha256 = value => createHash("sha256").update(value).digest("hex");
const sanitizeHeaders = headers => Object.fromEntries(
  [...headers.entries()].filter(([name]) => !["set-cookie"].includes(name.toLowerCase())),
);

await mkdir(outputDirectory, { recursive: true });
const startedAt = new Date().toISOString();
const receipts = [];

for (const target of targets) {
  const retrievedAt = new Date().toISOString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(target.url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html",
        "User-Agent": "OpenDefender-OfficialAuthorityRecovery/1.0",
      },
    });
    const body = await response.text();
    if (body.length > 2_000_000) throw new Error(`Response exceeds 2,000,000 character bound`);
    const evidenceChecks = Object.fromEntries(
      Object.entries(target.expected).map(([name, marker]) => [name, body.includes(marker)]),
    );
    const currentThrough = body.match(/currentthrough:(\d{8})_(\d+-\d+)/)?.slice(1) ?? null;
    const filename = `${target.id}.html`;
    await writeFile(new URL(filename, import.meta.url), body);
    receipts.push({
      id: target.id,
      authority: target.authority,
      requestedUrl: target.url,
      finalUrl: response.url,
      retrievedAt,
      httpStatus: response.status,
      responseHeaders: sanitizeHeaders(response.headers),
      rawBodyFile: filename,
      rawBodyBytes: Buffer.byteLength(body),
      rawBodySha256: sha256(body),
      evidenceChecks,
      currentThrough: currentThrough
        ? { dateEncodedByPublisher: currentThrough[0], publicLawEncodedByPublisher: currentThrough[1] }
        : null,
      acceptedAsLead: response.ok && Object.values(evidenceChecks).every(Boolean),
    });
  } catch (error) {
    receipts.push({
      id: target.id,
      authority: target.authority,
      requestedUrl: target.url,
      retrievedAt,
      error: error instanceof Error ? error.message : String(error),
      acceptedAsLead: false,
    });
  } finally {
    clearTimeout(timer);
  }
}

const receipt = {
  schemaVersion: 1,
  purpose: "Development-only recovery leads; no runtime activation or legal approval",
  collector: {
    startedAt,
    finishedAt: new Date().toISOString(),
    requestCount: targets.length,
    retryCount: 0,
    perRequestTimeoutMilliseconds: 30_000,
    responseCharacterLimit: 2_000_000,
  },
  provenanceNotes: [
    "Florida responses are from the official Florida Senate website's explicitly year-addressed 2026 statute route.",
    "Federal responses are from the Office of the Law Revision Counsel's official preliminary-edition section route.",
    "retrievedAt records acquisition time only. Florida edition markers and federal publisher currentthrough metadata are recorded separately as currentness evidence.",
    "Raw hashes cover the UTF-8 response body exactly as saved by this collector.",
  ],
  receipts,
};
await writeFile(new URL("acquisition-receipt.json", import.meta.url), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({
  requests: receipt.collector.requestCount,
  acceptedLeads: receipts.filter(item => item.acceptedAsLead).length,
  failures: receipts.filter(item => !item.acceptedAsLead).map(item => item.id),
}, null, 2));