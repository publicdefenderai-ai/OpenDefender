import records from './ohio-major-publication.json';
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from './evidence-backed-charge-batch';

// Ordinary adult, natural-person sentencing only. Grade comes from each offense,
// not this shared table; specifications and special sanctions remain separate.
export const OHIO_MAJOR_SENTENCING = {
  M1: 'M1: up to 180 days in jail and a conventional fine up to $1,000.',
  M2: 'M2: up to 90 days in jail and a conventional fine up to $750.',
  M3: 'M3: up to 60 days in jail and a conventional fine up to $500.',
  F5: 'F5: if prison is imposed, 6 to 12 months; conventional fine up to $2,500.',
  F4: 'F4: if prison is imposed, 6 to 18 months; conventional fine up to $5,000.',
  F3: 'F3: if prison is imposed, 9, 12, 18, 24, 30, or 36 months; conventional fine up to $10,000.',
  F2: 'F2: for an offense on or after March 22, 2019, a prison minimum of 2 to 8 years with an indefinite maximum under section 2929.144; conventional fine up to $15,000.',
  F1: 'F1: for an offense on or after March 22, 2019, a prison minimum of 3 to 11 years with an indefinite maximum under section 2929.144; conventional fine up to $20,000.',
} as const;
export function ohioMajorDependencies(row: typeof records[number]): string[] {
  return [...new Set(['2901.01', '2901.22', ...row.dependencies,
    ...(row.degrees.some(g => g.startsWith('M')) ? ['2929.24','2929.28'] : []),
    ...(row.degrees.some(g => g.startsWith('F')) ? ['2929.13','2929.14','2929.18','2929.32'] : []),
    ...(row.degrees.some(g => g === 'F1' || g === 'F2') ? ['2929.144'] : []),
  ])];
}
export const OHIO_MAJOR_DEFINITIONS: EvidenceBackedChargeDefinition[] = records.map(row => {
  if (!row.degrees.length || row.degrees.some(g => !(g in OHIO_MAJOR_SENTENCING))) throw Error(`Unsupported Ohio grade ${row.id}`);
  const categories = row.categories as EvidenceBackedChargeDefinition['category'][];
  const expected = row.degrees.some(g => g.startsWith('F')) ? 'felony' : 'misdemeanor';
  if (categories[0] !== expected || categories.includes('misdemeanor') !== row.degrees.some(g => g.startsWith('M'))) throw Error(`Ohio category mismatch ${row.id}`);
  const penalty = row.gradeSummary + ' ' + row.degrees.map(g => OHIO_MAJOR_SENTENCING[g as keyof typeof OHIO_MAJOR_SENTENCING]).join(' ') +
    (row.degrees.some(g => g === 'F1' || g === 'F2') ? ' For one qualifying felony alone, section 2929.144 generally sets the maximum at the minimum plus 50%; multiple counts and specifications use different rules. Earlier offense dates require separate review.' : '') +
    ' These are ordinary adult sentencing ranges, not a prediction or an all-inclusive total maximum. Restitution, costs, special fines, specifications, other counts, and case-specific rules may add consequences.';
  const english = { plainSummary: row.conductSummary, degreeContext: penalty };
  const sources = [row.section, ...ohioMajorDependencies(row)];
  return {
    id: row.id, jurisdiction: 'OH', code: row.section, slug: row.id,
    name: row.statutoryName, category: categories[0], categories,
    verifiedMonth: '2026-11',
    aliases: Object.fromEntries(['en','es','zh'].map(language => [language,
      [`ORC ${row.section}`, `R.C. ${row.section}`, `Ohio Rev. Code ${row.section}`, `§ ${row.section}`, ...row.scope.split(',').map(scope => `ORC ${row.section}(${scope})`.replace(/\(A\(1\)\)/, '(A)(1)'))],
    ])) as { en: string[]; es: string[]; zh: string[] },
    citations: sources.map(section => ({ citation: `Ohio Rev. Code Ann. § ${section}`, url: `https://codes.ohio.gov/ohio-revised-code/section-${section}` })),
    // Explicit English fallback, surfaced through untranslated in the resolver.
    // Do not label these strings as Spanish/Chinese translations.
    text: { en: english, es: english, zh: english },
  };
});
export const OHIO_MAJOR_IDS = new Set(OHIO_MAJOR_DEFINITIONS.map(row => row.id));
export const OHIO_MAJOR_BATCH = projectEvidenceBackedChargeBatch(OHIO_MAJOR_DEFINITIONS);
