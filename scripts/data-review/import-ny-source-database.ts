import fs from "node:fs";
import path from "node:path";
import type { NewYorkAuthorityManifest } from "../../server/data/new-york-source-database-seed";
import { seedNewYorkSourceDatabase } from "../../server/services/new-york-source-database";
import { fetchNewYorkAuthorityManifest } from "../../server/services/new-york-authority-fetcher";

try {
  const envContent = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
} catch {
  // Replit Secrets are already exposed to the process when present.
}

const apiKey = process.env.NY_SENATE_API_KEY ?? "";
if (!apiKey) {
  console.error("NY_SENATE_API_KEY is not set. Add it in Replit Secrets.");
  process.exit(1);
}

async function main(): Promise<void> {
  const manifest: NewYorkAuthorityManifest = await fetchNewYorkAuthorityManifest();
  const outputPath = path.join(process.cwd(), "scripts/data-review/output/ny-source-manifest.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  const result = await seedNewYorkSourceDatabase(manifest);
  console.log(JSON.stringify({
    outputPath,
    manifestRecords: manifest.catalogRecords.length,
    ...result,
  }, null, 2));
  if (!result.success) process.exitCode = 1;
}

void main().catch((error) => {
  console.error("NY source database import failed:", error);
  process.exit(1);
});