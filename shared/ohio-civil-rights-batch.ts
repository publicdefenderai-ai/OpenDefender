import { ohioPrimaryClassification } from './ohio-primary-classification';
import records from './ohio-civil-rights-publication.json';
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from './evidence-backed-charge-batch';

import { OHIO_MAJOR_SENTENCING } from './ohio-major-batch';
export const OHIO_CIVIL_RIGHTS_SENTENCING = {...OHIO_MAJOR_SENTENCING, UM: '', MM: 'Minor misdemeanor: no jail and a fine up to $150.', M4: 'M4: up to 30 days in jail and a conventional fine up to $250.'};

export function ohioCivilRightsDependencies(row: typeof records[number]): string[] {
  return [...new Set(['2901.01', '2901.22', ...row.dependencies,
    ...(row.degrees.some(g => !g.startsWith('F')) ? ['2929.24','2929.28'] : []),
    ...(row.degrees.some(g => g.startsWith('F')) ? ['2929.13','2929.14','2929.18','2929.32'] : []),
    ...(row.degrees.some(g => g === 'F1' || g === 'F2') ? ['2929.144'] : []),
  ])];
}
export const OHIO_CIVIL_RIGHTS_DEFINITIONS: EvidenceBackedChargeDefinition[] = records.map(row => {
  if (!row.degrees.length || row.degrees.some(g => !(g in OHIO_CIVIL_RIGHTS_SENTENCING))) throw Error(`Unsupported Ohio grade ${row.id}`);
  const categories = row.categories as EvidenceBackedChargeDefinition['category'][];
  const category = ohioPrimaryClassification(row);
  const ranges = row.degrees.map(grade => OHIO_CIVIL_RIGHTS_SENTENCING[grade as keyof typeof OHIO_CIVIL_RIGHTS_SENTENCING]).filter(Boolean);
  const penalty = [row.gradeSummary,...ranges].join(' ') +
    (row.degrees.some(g => g === 'F1' || g === 'F2') ? ' For an ordinary non-life indefinite term on one qualifying felony alone, section 2929.144 generally sets the maximum at the minimum plus 50%; multiple counts and specifications use different rules. Earlier offense dates require separate review.' : '') +
    ' These are ordinary adult sentencing ranges, not a prediction or an all-inclusive total maximum. Restitution, costs, special fines, specifications, other counts, and case-specific rules may add consequences.';
  const english = { plainSummary: row.conductSummary, degreeContext: penalty };
  const sources = [row.section, ...ohioCivilRightsDependencies(row)];
  return {
    id: row.id, jurisdiction: 'OH', code: row.code, slug: row.id,
    name: row.statutoryName, category, categories,
    verifiedMonth: '2026-11',
    aliases: Object.fromEntries(['en','es','zh'].map(language => [language,
      [`ORC ${row.section}`, `R.C. ${row.section}`, `Ohio Rev. Code ${row.section}`, `§ ${row.section}`, ...[...row.conductPaths,...row.gradingPaths].filter(p => p !== 'whole').map(p => 'ORC '+row.section+'('+p[0]+')'+p.slice(1)), ...row.scope.split(',').filter(scope => scope !== 'whole').map(scope => `ORC ${row.section}(${scope})`.replace(/\(([A-Z])\((\d+)\)\)/g, '($1)($2)'))],
    ])) as { en: string[]; es: string[]; zh: string[] },
    citations: [...sources.map(section => ({ citation: `Ohio Rev. Code Ann. § ${section}`, url: `https://codes.ohio.gov/ohio-revised-code/section-${section}` }))],
    // Explicit English fallback, surfaced through untranslated in the resolver.
    // Do not label these strings as Spanish/Chinese translations.
    text: { en: english, es: english, zh: english },
  };
});
export const OHIO_CIVIL_RIGHTS_IDS = new Set(OHIO_CIVIL_RIGHTS_DEFINITIONS.map(row => row.id));
export const OHIO_CIVIL_RIGHTS_BATCH = projectEvidenceBackedChargeBatch(OHIO_CIVIL_RIGHTS_DEFINITIONS);
