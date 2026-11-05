import { execFileSync } from 'node:child_process';

// Load the application module through its TypeScript loader rather than asking
// Playwright's test loader to resolve the application's transitive JSON imports.
// Keep these expectations derived from the catalog, never a copied ID list.
const fixture = JSON.parse(execFileSync(process.execPath, [
  '--import', 'tsx', '--input-type=module', '-e',
  `import { CALIFORNIA_CANONICAL_RECORDS, CALIFORNIA_LEGACY_DISPOSITIONS } from './shared/california-authority.ts';
   console.log(JSON.stringify({
     records: CALIFORNIA_CANONICAL_RECORDS.map(({canonicalId, selectable}) => ({canonicalId, selectable})),
     dispositions: CALIFORNIA_LEGACY_DISPOSITIONS.map(({legacyId}) => ({legacyId}))
   }));`,
], { encoding: 'utf8' })) as {
  records: Array<{canonicalId: string; selectable: boolean}>;
  dispositions: Array<{legacyId: string}>;
};

export const CALIFORNIA_CANONICAL_RECORDS = fixture.records;
export const CALIFORNIA_LEGACY_DISPOSITIONS = fixture.dispositions;
