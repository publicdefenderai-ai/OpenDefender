import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import packet from '../scripts/data-review/florida-launch/cannabis-trigger-review.json';
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const source = (id: string) => {
  const value = packet.sources.find(row => row.id === id);
  if (!value) throw new Error(`Missing source ${id}`);
  return value;
};
it('retains verifiable public evidence for every post-2017 election, including 2026', () => {
  expect(packet.elections.map(row => row.year)).toEqual([2018, 2020, 2022, 2024, 2026]);
  expect(new Set(packet.sources.map(row => row.id)).size).toBe(packet.sources.length);
  for (const row of packet.sources) {
    expect(hash(row.text)).toBe(row.contentSha256);
    expect(row.end - row.start).toBe(row.text.length);
    expect(Number.isFinite(Date.parse(row.acquisitionCompletedAt))).toBe(true);
    expect(new URL(row.url).protocol).toBe('https:');
  }
  for (const election of packet.elections) {
    const numbers = [...source(election.sourceId).text.matchAll(/No\.?\s*(\d+),?\s*Constitutional/g)].map(m => Number(m[1]));
    expect([...new Set(numbers)]).toEqual(election.stateAmendmentNumbers);
  }
});
it('distinguishes adoption and effective-date contingency from a failed marijuana initiative', () => {
  expect(source('session-law').text.replace(/\s+/g, ' ')).toContain('this act shall expire 6 months after the effective date of such amendment');
  expect(source('2024-result').text).toContain('Ballot #3 - Defeated Adult Personal Use of Marijuana (22-05)');
  expect(source('ballot-2026').text).toContain('Budget Stabilization Fund');
  expect(source('ballot-2026').text).not.toMatch(/marijuana|cannabis/i);
  expect(source('constitution').text).toContain('January 9, 2015; adopted 2016');
  expect(source('constitution').text).toContain('from a nicotine product or any other substance');
  expect(packet.status).toBe('public_evidence_only_activation_requires_separate_review');
});
it('retains both published definition texts without issuing a source receipt', () => {
  const statute = source('current-893.02');
  expect(statute.text).toContain('The term does not include “marijuana,” as defined in s. 381.986');
  expect(statute.text).toContain('If such amendment or adoption takes place');
  expect(statute.text).toContain('The term does not include “low-THC cannabis,”');
  const comparison = JSON.parse(readFileSync('scripts/data-review/florida-launch/restoration-comparison.json','utf8'));
  expect(JSON.stringify(comparison)).toContain(statute.contentSha256);
  expect(packet).not.toHaveProperty('disposition');
});
