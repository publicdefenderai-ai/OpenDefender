import { ohioPrimaryClassification } from './ohio-primary-classification';
import records from './ohio-custody-publication.json';
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from './evidence-backed-charge-batch';

import { OHIO_MAJOR_SENTENCING } from './ohio-major-batch';
export const OHIO_CUSTODY_SENTENCING = { ...OHIO_MAJOR_SENTENCING, M4: 'M4: up to 30 days in jail and a conventional fine up to $250.', MM: 'Minor misdemeanor: no incarceration; fine up to $150 under section 2929.28.' };

export function ohioCustodyDependencies(row: typeof records[number]): string[] {
  return [...new Set(['2901.01', '2901.22', '2921.01', ...row.dependencies,
    ...(row.degrees.some(g => g.startsWith('M')) ? ['2929.24','2929.28'] : []),
    ...(row.degrees.some(g => g.startsWith('F')) ? ['2929.13','2929.14','2929.18','2929.32'] : []),
    ...(row.degrees.some(g => g === 'F1' || g === 'F2') ? ['2929.144'] : []),
  ])];
}
export const OHIO_CUSTODY_DEFINITIONS: EvidenceBackedChargeDefinition[] = records.map(row => {
  if (!row.degrees.length || row.degrees.some(g => !(g in OHIO_CUSTODY_SENTENCING))) throw Error(`Unsupported Ohio grade ${row.id}`);
  const categories = row.categories as EvidenceBackedChargeDefinition['category'][];
  const category = ohioPrimaryClassification(row);
  const penalty = row.gradeSummary + ' ' + row.degrees.map(g => { const range = (row.sentencingOverrides as Record<string, string>)[g] ?? OHIO_CUSTODY_SENTENCING[g as keyof typeof OHIO_CUSTODY_SENTENCING]; return row.sentencingMode === 'custody_only' ? range.split('; conventional fine')[0] + '.' : range; }).join(' ') +
    (row.degrees.some(g => g === 'F1' || g === 'F2') ? ' For an ordinary non-life indefinite term on one qualifying felony alone, section 2929.144 generally sets the maximum at the minimum plus 50%; multiple counts and specifications use different rules. Earlier offense dates require separate review.' : '') +
    ' These are ordinary adult sentencing ranges, not a prediction or an all-inclusive total maximum. Restitution, costs, special fines, specifications, other counts, and case-specific rules may add consequences.';
  const english = { plainSummary: row.conductSummary, degreeContext: penalty };
  const sources = [row.section, ...ohioCustodyDependencies(row)];
  return {
    id: row.id, jurisdiction: 'OH', code: row.code, slug: row.id,
    name: row.statutoryName, category, categories,
    verifiedMonth: '2026-11',
    aliases: Object.fromEntries(['en','es','zh'].map(language => [language,
      [`ORC ${row.section}`, `R.C. ${row.section}`, `Ohio Rev. Code ${row.section}`, `§ ${row.section}`, ...row.scope.split(',').map(scope => `ORC ${row.section}(${scope})`.replace(/\(([A-Z])\((\d+)\)\)/g, '($1)($2)'))],
    ])) as { en: string[]; es: string[]; zh: string[] },
    citations: sources.map(section => ({ citation: `Ohio Rev. Code Ann. § ${section}`, url: `https://codes.ohio.gov/ohio-revised-code/section-${section}` })),
    // Explicit English fallback, surfaced through untranslated in the resolver.
    // Do not label these strings as Spanish/Chinese translations.
    text: { en: english, es: english, zh: english },
  };
});
export const OHIO_CUSTODY_IDS = new Set(OHIO_CUSTODY_DEFINITIONS.map(row => row.id));
export const OHIO_CUSTODY_BATCH = projectEvidenceBackedChargeBatch(OHIO_CUSTODY_DEFINITIONS);
