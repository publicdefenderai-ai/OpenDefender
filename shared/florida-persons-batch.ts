import rows from './florida-persons-publication.json';
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from './evidence-backed-charge-batch';
export const FLORIDA_PERSONS_SENTENCING = {
    F1: 'First-degree felony: ordinary imprisonment up to 30 years and a conventional fine up to $10,000.',
    F2: 'Second-degree felony: ordinary imprisonment up to 15 years and a conventional fine up to $10,000.',
    F3: 'Third-degree felony: ordinary imprisonment up to 5 years and a conventional fine up to $5,000.',
    M1: 'First-degree misdemeanor: imprisonment up to 1 year and a conventional fine up to $1,000.',
} as const;
export const floridaPersonsUrl = (section: string) => { const [c, s] = section.split('.'); const low = Math.floor(Number(c) / 100) * 100; return `https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=${String(low).padStart(4, '0')}-${String(low + 99).padStart(4, '0')}/${c.padStart(4, '0')}/Sections/${c.padStart(4, '0')}.${s}.html`; };
export function floridaPersonsDependencies(row: typeof rows[number]) { return [...new Set([row.section, '775.082', '775.083', ...(row.grade.startsWith('F') ? ['775.084'] : []), ...row.dependencies])]; }
export function validateFloridaPersonsCategories(row: { id: string; grade: string; categories: string[] }) {
    const ordinary = row.grade.startsWith('F') ? 'felony' : 'misdemeanor';
    if (!(row.grade in FLORIDA_PERSONS_SENTENCING) || row.categories[0] !== ordinary ||
        new Set(row.categories).size !== row.categories.length ||
        row.categories.some(category => !['felony', 'misdemeanor'].includes(category)))
        throw Error(`Florida persons category mismatch ${row.id}`);
}
export const FLORIDA_PERSONS_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(row => {
    if (!(row.grade in FLORIDA_PERSONS_SENTENCING))
        throw Error(`Unknown Florida persons grade ${row.id}`);
    validateFloridaPersonsCategories(row);
    // The singular category records the primary section's ordinary grade; categories preserves conditional domestic-violence exposure.
    const category = row.grade.startsWith('F') ? 'felony' : 'misdemeanor';
    const text = { plainSummary: row.conductSummary, degreeContext: FLORIDA_PERSONS_SENTENCING[row.grade as keyof typeof FLORIDA_PERSONS_SENTENCING] + ' ' + row.additionalPenalty + ' These are ordinary adult statutory ranges, not a sentence prediction or a total maximum for every case. Repeat-offender provisions, sentencing rules, other counts, restitution and costs require separate review. Section 775.083 also authorizes higher fines based on twice the pecuniary gain or loss and other specifically authorized amounts.' };
    const aliases = [row.officialTitle, row.statutoryName, ...['Fla. Stat. §', 'F.S.', 'FS', 'Florida Statutes'].map(prefix => `${prefix} ${row.section}${row.scope}`)];
    return { id: row.id, jurisdiction: 'FL', code: row.section + row.scope, slug: row.id, name: row.name, category, categories: row.categories as ('felony' | 'misdemeanor')[], verifiedMonth: '2026-11', aliases: { en: aliases, es: aliases, zh: aliases }, citations: [{ citation: `Fla. Stat. § ${row.section}${row.scope}`, url: floridaPersonsUrl(row.section) }, ...floridaPersonsDependencies(row).map(section => ({ citation: `Fla. Stat. § ${section}`, url: floridaPersonsUrl(section) }))], text: { en: text, es: text, zh: text } };
});
export const FLORIDA_PERSONS_IDS = new Set(FLORIDA_PERSONS_DEFINITIONS.map(row => row.id));
export const FLORIDA_PERSONS_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_PERSONS_DEFINITIONS);
