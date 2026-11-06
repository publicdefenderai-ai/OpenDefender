/** Candidate-only official acquisition. Does not touch existing reviewed receipts. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { extractExactFloridaDocument, extractFloridaEdition, floridaSectionUrl } from '../batch/florida-adapter';
const sections = ['784.03', '784.041', '784.048', '784.08', '784.082', '784.085', '784.011', '784.021', '784.045', '775.082', '775.083', '775.084', '741.28', '741.2801', '741.30', '784.046', '794.011', '800.04', '847.0135', '921.244', '948.01', '843.01'];
const folder = process.argv[2];
if (!folder)
    throw Error('Pass a dedicated candidate directory; no active artifact is modified');
fs.mkdirSync(folder, { recursive: true });
const documents: Record<string, unknown> = {};
for (const section of sections) {
    const url = floridaSectionUrl(section), retrievedAt = new Date();
    const raw = execFileSync('curl', ['--fail', '--silent', '--show-error', '--max-time', '45', '--proto', '=https', url], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
    const edition = extractFloridaEdition(raw);
    if (edition !== 'Florida Statutes 2026')
        throw Error(`${section}: expected current 2026 selected edition; got ${edition}`);
    const doc = extractExactFloridaDocument(raw, section, url, retrievedAt, edition);
    if (!doc)
        throw Error(`Official exact-section parser failed for ${section}`);
    fs.writeFileSync(path.join(folder, `${section}.html`), raw);
    documents[section] = doc;
    fs.writeFileSync(path.join(folder, 'candidate.json'), JSON.stringify({ schemaVersion: 1, jurisdiction: 'FL', documents }, null, 2) + '\n');
    console.log(`${section}: ${doc.contentHash}`);
    await new Promise(r => setTimeout(r, 2000));
}
