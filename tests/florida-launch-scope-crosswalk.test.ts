import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import sample from '../scripts/data-review/florida-launch/official-sample.json';
import crosswalk from '../scripts/data-review/florida-launch/scope-crosswalk.json';
import { configuredChoices } from '../scripts/data-review/florida-launch/benchmark.mjs';
import { findSubdivisionRange } from '../server/data/florida-reviewed-source-records';

it('reconciles each originally unresolved chart citation to its actual conduct, choices and retained official text', () => {
  const choices = configuredChoices();
  const expected = ['319.30(5)', '328.07(4)', '847.0138 (2) & (3)', '784.021(1)(b)', '847.011', '483.901(7)', '782.071(1)(b)', '893.135 (1)(f)1.b.', '794.011(8)(b)', '893.135 (1)(d)1.c.', '787.01(3)(a)'];
  expect(crosswalk.map(row => row.citation)).toEqual(expected);
  expect(crosswalk.filter(row => row.match === 'new_choice').map(row => row.citation)).toEqual(['794.011(8)(b)', '787.01(3)(a)']);
  const distinguishingTerms: Record<string, string[]> = {
    'fl-fs-319-30-5-a-identifier': ['sold as salvage', 'repairs'],
    'fl-fs-319-30-5-b-identifier': ['plate removed', 'repairs'],
    'fl-fs-328-07-4-a-identifier': ['counterfeit', 'approved replacements'],
    'fl-fs-328-07-4-b-identifier': ['assigned number', 'conceal'],
    'fl-fs-847-0138-2-obscenity': ['specific person', 'subscription'],
    'fl-fs-847-0138-3-obscenity': ['outside florida', 'specific person'],
    'fl-aggravated-assault': ['intent to commit a felony', 'imminent violence'],
    'fl-fs-847-011-1-c-obscenity': ['possession with intent to distribute', 'under 18'],
    'fl-fs-483-901-7-a-regulatory': ['medical physics', 'license'],
    'fl-vehicular-homicide': ['knew or should have known', 'information and aid', '30 years'],
    'fl-fs-893-135-1-f-1-trafficking-in-amphetamine': ['28 g to under 200 g: at least 7 years and a $100,000 fine'],
    'fl-fs-794-011-8-b-child-victims': ['familial or custodial authority', '12 through 17', 'term of years up to life'],
    'fl-fs-893-135-1-d-1-trafficking-in-phencyclidine': ['400 g or more: at least 15 calendar years and a $250,000 fine'],
    'fl-fs-787-01-3-a-child-victims': ['child under 13', 'during the kidnapping', 'life felony'],
  };
  for (const row of crosswalk) {
    expect(sample.rows.find(entry => entry.citation === row.citation)).toMatchObject({description:row.description, degree:row.degree});
    for (const id of row.choiceIds) {
      const choice = choices.find((entry: {id:string}) => entry.id === id);
      const record = getChargeById(id)!;
      const explanation = getChargeExplanation(record.name, 'FL', 'en', id)!;
      const guidance = (explanation.plainSummary + ' ' + explanation.degreeContext).toLowerCase();
      for (const term of distinguishingTerms[id]) expect(guidance, id).toContain(term);
      expect(choice?.code.match(/^\d+\.\d+/)?.[0], id).toBe(row.section);
    }
    const packet = JSON.parse(readFileSync(row.evidenceFile,'utf8'));
    const doc = Object.values<{section:string;text:string;sourceUrl:string}>(packet.report.sourceEvidence).find(entry => entry.section === row.section)!;
    expect(createHash('sha256').update(doc.text).digest('hex')).toBe(row.contentHash);
    expect(row.sourceUrl).toBe(doc.sourceUrl);
    expect(new URL(row.sourceUrl).hostname).toBe('www.leg.state.fl.us');
    for (const scope of row.scopes) expect(findSubdivisionRange(doc.text, scope), row.section + scope).toHaveLength(1);
  }
});
