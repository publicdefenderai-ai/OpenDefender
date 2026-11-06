import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { OHIO_RESIDUAL_DEFINITIONS, OHIO_RESIDUAL_IDS } from '../shared/ohio-residual-batch';
import rows from '../shared/ohio-residual-publication.json';
import { getChargeById, getSelectableCharges, isChargeIdRequiringReselection } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
import { OHIO_RESIDUAL_SOURCES, ohioResidualPacket, validateOhioResidualPacket, validateOhioResidualReceipt, OHIO_RESIDUAL_RECEIPT_PATH } from '../server/data/ohio-residual-source';
import { buildOhioReviewedManifestRecords, buildOhioSourceDatabaseSeed, OHIO_MANIFEST_SOURCE, validateOhioManifestRecord } from '../server/data/ohio-source-database-seed';
import { OHIO_REVIEWED_SOURCES } from '../server/data/ohio-reviewed-source';
import { OHIO_MAJOR_SOURCES } from '../server/data/ohio-major-source';
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from '../server/data/ohio-chapter-2903-source';
import { quarterlyDeadline } from '../shared/source-verification-policy.mjs';
const receipt = JSON.parse(readFileSync(OHIO_RESIDUAL_RECEIPT_PATH, 'utf8'));
const fresh = new Date(receipt.checkedAt);
const bySection = (section: string) => OHIO_RESIDUAL_DEFINITIONS.filter(r => r.citations[0].citation.endsWith(section));
describe('Ohio residual publication', () => {
  it('projects fourteen independently bound records without inventing offense names or translations', () => {
    expect(OHIO_RESIDUAL_IDS.size).toBe(14);
    expect(Object.keys(ohioResidualPacket.documents)).toHaveLength(42);
    expect(() => validateOhioResidualPacket(ohioResidualPacket)).not.toThrow();
    for (const definition of OHIO_RESIDUAL_DEFINITIONS) {
      const charge = getChargeById(definition.id)!;
      expect(charge.name).toBe(definition.name);
      expect(charge.categories).toEqual(definition.categories);
      for (const language of ['es', 'zh']) {
        const explanation = getChargeExplanation(definition.name, 'OH', language, definition.id)!;
        expect(explanation.untranslated).toBe(true);
        expect(explanation.translationDraft).toBe(false);
        expect(explanation.plainSummary).toBe(definition.text.en.plainSummary);
      }
    }
  });
  it('keeps the previously published batches, usury branches and exclusions distinct', () => {
    expect([...OHIO_REVIEWED_SOURCES, ...OHIO_MAJOR_SOURCES, ...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS].some(r => OHIO_RESIDUAL_IDS.has(r.chargeId))).toBe(false);
    expect(ohioResidualPacket.documents['1509.01']).toBeUndefined();
    expect(isChargeIdRequiringReselection('oh-vandalism')).toBe(true);
    const oldVandalism = {id: 'oh-vandalism', name: 'Vandalism', classification: 'misdemeanor', code: '2909.05'};
    expect(resolveGuidanceCharge(oldVandalism, 'OH')).toBeUndefined();
    expect(resolveGuidanceCharge({...oldVandalism, id: undefined}, 'OH')).toBeUndefined();
    expect(getSelectableCharges().some(r => r.id === 'oh-vandalism')).toBe(false);
    expect(getChargeById('oh-orc-2909-05-vandalism')?.category).toBe('felony');
    expect(ohioResidualPacket.documents['3727.01']).toBeUndefined();
    const mischief = ohioResidualPacket.records.find(r => r.section === '2909.07')!;
    expect(mischief.conduct.map(s => s.text).join(' ')).not.toContain('(7) Without privilege');
    const disruption = ohioResidualPacket.records.find(r => r.section === '2909.04')!;
    expect(disruption.conduct.map(s => s.text).join(' ')).not.toContain('Substantially impair');
    expect(bySection('2905.22').map(r => r.code)).toEqual(['2905.22(A)(1)', '2905.22(A)(2)', '2905.22(A)(3)']);
    expect(bySection('2905.22').map(r => r.category)).toEqual(['felony', 'felony', 'misdemeanor']);
    expect(ohioResidualPacket.records.find(r => r.section === '2905.02')!.dependencies).toContain('2971.01');
  });
  it.each(['source', 'offset', 'definition', 'dependency', 'primary', 'broadenedConduct', 'mapping', 'unused'] as const)('rejects changed %s evidence', kind => {
    const packet = structuredClone(ohioResidualPacket), record = packet.records[0];
    if (kind === 'source') packet.documents[record.section].text += 'changed';
    if (kind === 'offset') record.conduct[0].start++;
    if (kind === 'definition') record.definitionHash = '0'.repeat(64);
    if (kind === 'dependency') record.dependencies.pop();
    if (kind === 'primary') record.conduct = [record.evidence.find(s => s.section !== record.section)!];
    if (kind === 'broadenedConduct') record.conduct = [record.evidence[0]];
    if (kind === 'mapping') packet.mappingHash = 'wrong';
    if (kind === 'unused') packet.documents['fake'] = packet.documents[record.section];
    expect(() => validateOhioResidualPacket(packet)).toThrow();
  });
  it('anchors quarterly expiry to the oldest genuine acquisition and keeps packet binding', () => {
    const oldest = Math.min(...Object.values(ohioResidualPacket.documents).map(d => Date.parse(d.retrievedAt)));
    expect(receipt.verificationPolicy).toBe('quarterly-v1');
    expect(receipt.expiresAt).toBe(quarterlyDeadline(new Date(oldest).toISOString()));
    expect(validateOhioResidualReceipt(receipt, fresh)).toBeNull();
    expect(validateOhioResidualReceipt(receipt, new Date(Date.parse(receipt.expiresAt)-1))).toBeNull();
    for (const invalid of [
      {...receipt, expiresAt: new Date(Date.parse(receipt.expiresAt)+1).toISOString()},
      {...receipt, checkedAt: new Date(fresh.getTime()+1).toISOString()},
      {...receipt, packetHash: 'wrong'}, {...receipt, verificationPolicy: undefined},
    ]) expect(validateOhioResidualReceipt(invalid, new Date(fresh.getTime()+1000))).not.toBeNull();
    expect(validateOhioResidualReceipt(receipt, new Date(receipt.expiresAt))).not.toBeNull();
    expect(validateOhioResidualReceipt(receipt, new Date(fresh.getTime()-1))).not.toBeNull();
  });
  it('requires exact evidence links and rechecks expiry for already-built manifests without a database', () => {
    const catalogRecords = buildOhioReviewedManifestRecords(fresh, OHIO_RESIDUAL_SOURCES);
    expect(catalogRecords).toHaveLength(14);
    for (const record of catalogRecords) expect(validateOhioManifestRecord(record)).toBeNull();
    const manifest = {jurisdiction: 'OH' as const, generatedAt: fresh, source: OHIO_MANIFEST_SOURCE, catalogRecords};
    expect(buildOhioSourceDatabaseSeed(manifest, fresh).selectableChargeIds).toHaveLength(14);
    expect(buildOhioSourceDatabaseSeed(manifest, new Date(receipt.expiresAt)).selectableChargeIds).toHaveLength(0);
    const damaged = structuredClone(catalogRecords[0]);
    damaged.provisions[0].contentHash = 'wrong';
    expect(validateOhioManifestRecord(damaged)).not.toBeNull();
  });
  it('retains special custody, protected-victim conditions, thresholds and additional sanctions', () => {
    const penalty = (section: string) => bySection(section).map(r => r.text.en.degreeContext).join(' ');
    expect(penalty('2905.01')).toContain('fifteen years to life');
    expect(penalty('2905.01')).toContain('ten years to life');
    expect(penalty('2905.01')).toContain('ordinary non-life indefinite term');
    expect(penalty('2905.32')).toContain('ten, eleven, twelve, thirteen, fourteen, or fifteen');
    expect(penalty('2905.32')).not.toContain('a prison minimum of 3 to 11 years');
    expect(penalty('2905.11')).toContain('knowledge or reason to know');
    expect(penalty('2909.05')).toContain('additional fine up to $2,500');
    expect(penalty('2909.03')).toContain('$1,000');
    expect(penalty('2909.07')).toContain('$10,000');
    expect(rows.find(r=>r.section==='2905.33')!.dependencies).toEqual(expect.arrayContaining(['2907.321','2907.322','2907.323']));
  });
});
