/** Primary display tier follows an explicit statutory default, never degree-array order. */
type Row = { id: string; degrees: string[]; categories: string[]; primaryClassification?: {
  category: string; basis: string; ordinaryDegrees: string[]; evidence: { section: string; quote: string }[];
} };
export function ohioPrimaryClassification(row: Row): 'felony' | 'misdemeanor' {
  const expected = [...new Set(row.degrees.map(g => g.startsWith('F') ? 'felony' : 'misdemeanor'))];
  if (!row.degrees.length || row.degrees.some(g => !/^[FM][1-5]$/.test(g)) || new Set(row.categories).size !== row.categories.length || expected.length !== row.categories.length || expected.some(c => !row.categories.includes(c))) throw Error(`Ohio category mismatch ${row.id}`);
  const profile = row.primaryClassification;
  if (!profile) {
    if (expected.length !== 1) throw Error(`Missing Ohio primary classification ${row.id}`);
    return expected[0] as 'felony' | 'misdemeanor';
  }
  if (!expected.includes(profile.category) || row.categories[0] !== profile.category || !profile.evidence.length || profile.evidence.some(e => !e.section || !e.quote.trim())) throw Error(`Invalid Ohio primary classification ${row.id}`);
  if (profile.basis === 'statutory_ordinary_grade') {
    if (!profile.ordinaryDegrees.length || profile.ordinaryDegrees.some(g => !row.degrees.includes(g) || (g.startsWith('F') ? 'felony' : 'misdemeanor') !== profile.category)) throw Error(`Invalid Ohio ordinary grade ${row.id}`);
  } else if (profile.basis !== 'branch_dependent' || profile.ordinaryDegrees.length) throw Error(`Invalid Ohio branch classification ${row.id}`);
  return profile.category as 'felony' | 'misdemeanor';
}
export function validateOhioClassificationEvidence(row: Row, grading: {section: string; text: string}[]): void {
  ohioPrimaryClassification(row);
  const profile = row.primaryClassification;
  if (!profile) return;
  for (const evidence of profile.evidence) if (!grading.some(span => span.section === evidence.section && span.text.includes(evidence.quote))) throw Error(`Unbound Ohio ordinary classification ${row.id}`);
  for (const grade of profile.ordinaryDegrees) {
    const degree = ['', 'first', 'second', 'third', 'fourth', 'fifth'][Number(grade.slice(1))];
    if (!profile.evidence.some(e => e.quote.includes(`${grade[0] === 'F' ? 'felony' : 'misdemeanor'} of the ${degree} degree`))) throw Error(`Unbound Ohio ordinary grade ${row.id}`);
  }
}
