import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { OHIO_MAJOR_DEFINITIONS, OHIO_MAJOR_IDS } from '../shared/ohio-major-batch';
import { getChargeById } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { OHIO_MAJOR_SOURCES, ohioMajorPacket, validateOhioMajorPacket, validateOhioMajorReceipt, OHIO_MAJOR_RECEIPT_PATH } from '../server/data/ohio-major-source';
import { buildOhioReviewedManifestRecords, buildOhioSourceDatabaseSeed, OHIO_MANIFEST_SOURCE, validateOhioManifestRecord } from '../server/data/ohio-source-database-seed';
import { OHIO_REVIEWED_SOURCES } from '../server/data/ohio-reviewed-source';
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from '../server/data/ohio-chapter-2903-source';
const receipt = JSON.parse(readFileSync(OHIO_MAJOR_RECEIPT_PATH, 'utf8'));
const fresh = new Date(receipt.checkedAt);
describe('Ohio major publication', () => {
  it('supports twenty distinct catalog identities with their own statutory names and dependencies', () => {
    expect(OHIO_MAJOR_IDS.size).toBe(20);
    expect(Object.keys(ohioMajorPacket.documents)).toHaveLength(38);
    expect(() => validateOhioMajorPacket(ohioMajorPacket)).not.toThrow();
    for (const definition of OHIO_MAJOR_DEFINITIONS) {
      const charge = getChargeById(definition.id)!;
      expect(charge).toBeDefined();
      expect(charge.categories).toEqual(definition.categories);
      for (const lang of ['es', 'zh']) {
        const explanation = getChargeExplanation(definition.name, 'OH', lang, definition.id)!;
        expect(explanation.untranslated).toBe(true);
        expect(explanation.translationDraft).toBe(false);
      }
    }
  });
  it('keeps the three Ohio source memberships disjoint and the critical-infrastructure hold intact', () => {
    expect([...OHIO_REVIEWED_SOURCES, ...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r => OHIO_MAJOR_IDS.has(r.chargeId))).toBe(false);
    expect(ohioMajorPacket.documents['1509.01']).toBeUndefined();
    const trespass = ohioMajorPacket.records.find(r => r.section === '2911.211')!;
    expect(trespass.scope).toBe('A(1)');
    expect(OHIO_MAJOR_DEFINITIONS.find(r => r.id === trespass.id)?.categories).toEqual(['misdemeanor']);
    expect(ohioMajorPacket.records.find(r => r.section === '2905.03')!.dependencies).toContain('2971.01');
  });
  it.each(['source', 'offset', 'definition', 'dependency', 'primary'] as const)('rejects changed %s evidence', kind => {
    const packet = structuredClone(ohioMajorPacket), record = packet.records[0];
    if (kind === 'source') packet.documents[record.section].text += 'changed';
    if (kind === 'offset') record.conduct[0].start++;
    if (kind === 'definition') record.definitionHash = '0'.repeat(64);
    if (kind === 'dependency') record.dependencies.pop();
    if (kind === 'primary') record.conduct = [record.evidence.find(s => s.section !== record.section)!];
    expect(() => validateOhioMajorPacket(packet)).toThrow();
  });
  it('anchors expiry to acquisition and rejects future, extended or mismatched windows', () => {
    expect(validateOhioMajorReceipt(receipt, fresh)).toBeNull();
    expect(validateOhioMajorReceipt(receipt, new Date(Date.parse(receipt.expiresAt) - 1))).toBeNull();
    expect(validateOhioMajorReceipt(receipt, new Date(receipt.expiresAt))).not.toBeNull();
    expect(validateOhioMajorReceipt(receipt, new Date(fresh.getTime() - 1))).not.toBeNull();
    expect(validateOhioMajorReceipt({...receipt, expiresAt: '2099-01-01'}, fresh)).not.toBeNull();
    expect(validateOhioMajorReceipt({...receipt, packetHash: 'wrong'}, fresh)).not.toBeNull();
    expect(validateOhioMajorReceipt({...receipt, checkedAt: 'invalid'}, fresh)).not.toBeNull();
  });
  it('validates every source link and rechecks expiry even for an already-built manifest, without database access', () => {
    const catalogRecords = buildOhioReviewedManifestRecords(fresh, OHIO_MAJOR_SOURCES);
    expect(catalogRecords).toHaveLength(20);
    for (const record of catalogRecords) expect(validateOhioManifestRecord(record)).toBeNull();
    const manifest = {jurisdiction: 'OH' as const, generatedAt: fresh, source: OHIO_MANIFEST_SOURCE, catalogRecords};
    expect(buildOhioSourceDatabaseSeed(manifest, fresh).selectableChargeIds).toHaveLength(20);
    expect(buildOhioSourceDatabaseSeed(manifest, new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
  });
  it('retains non-default sanctions and limits rather than flattening to degree alone', () => {
    const penalty = (section: string) => OHIO_MAJOR_DEFINITIONS.filter(r => r.code === section).map(r => r.text.en.degreeContext).join(' ');
    expect(penalty('2911.23')).toContain('120');
    expect(penalty('2909.08')).toMatch(/forfeit/i);
    expect(penalty('2909.23')).toMatch(/response/i);
    expect(penalty('2909.29')).toContain('75,000');
    expect(penalty('2909.27')).toContain('50%');
  });
});
