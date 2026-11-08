import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { describe, it, expect, vi } from 'vitest';
import packet from '../scripts/data-review/output/florida-sexual-injunction-corrections.json';
import originals from '../scripts/data-review/florida-sexual-injunction/previous-definitions.json';
import authorities from '../shared/florida-reviewed-data/judicial-authorities.json';
import receipt from '../scripts/data-review/output/florida-reviewed-refresh-receipt.json';
import report from '../scripts/data-review/output/florida-reviewed-analysis.json';
import eligibility from '../shared/florida-reviewed-eligibility.json';
import { FLORIDA_REVIEWED_DEFINITIONS } from '../shared/florida-reviewed-batch';
import { buildFloridaReviewedSourceRecords, validateFloridaReviewedRefreshReceipt } from '../server/data/florida-reviewed-source-records';
import { getChargeById, classifyChargesForGuidance } from '../shared/criminal-charges';
import { getChargeExplanation } from '../shared/charge-explanations';
const hash = (text: string) => createHash('sha256').update(text).digest('hex');
const rows = buildFloridaReviewedSourceRecords(packet.definitions as any, packet.report as any, packet.eligibility as any);
describe('Florida sexual battery and injunction corrective evidence', () => {
  it('reproduces two existing identities and twelve statute dependencies offline', () => {
    execFileSync(process.execPath, ['--import','tsx','scripts/data-review/florida-sexual-injunction/prepare.ts','--check']);
    expect(rows).toHaveLength(2);
    expect(Object.keys(packet.documents)).toHaveLength(12);
    expect(FLORIDA_REVIEWED_DEFINITIONS).toHaveLength(101);
    for (const d of Object.values(packet.documents)) expect(hash(d.text)).toBe(d.contentHash);
    for (const r of rows) for (const span of [r.identityEvidence,...r.conductEvidence,...r.gradeEvidence]) {
      const source = packet.report.sourceEvidence[span.sourceKey as keyof typeof packet.report.sourceEvidence];
      expect((span.target === 'title' ? source.title : source.text).slice(span.start,span.end)).toBe(span.text);
    }
  });
  it('binds all eight injunction acts and the actual one-prior same-victim rule', () => {
    const row = rows.find(r => r.chargeId.includes('741-31'))!;
    const conduct = row.conductEvidence.map(s => s.text).join(' ');
    for (const phrase of ['vacate the dwelling','500 feet','act of domestic violence','unlawful threat','indirect contact through a third party','100 feet','Defacing or destroying','surrender firearms or ammunition']) expect(conduct).toContain(phrase);
    const grade = row.gradeEvidence.map(s => s.text).join(' ');
    expect(grade).toContain('one or more prior convictions');
    expect(grade).toContain('against the same victim');
    expect(grade).toContain('regardless of whether adjudication is withheld');
    const before = originals.find(r => r.code === '741.31(4)(a)')!;
    expect(before.text.en.degreeContext).toContain('at least one prior');
    const after = packet.definitions.find(r => r.id === before.id)!;
    expect(after.text.en.degreeContext).toContain('up to one year');
    expect(after.text.en.degreeContext).toContain('up to five years');
    expect(after.text.en.degreeContext).toContain('separate branch');
  });
  it('distinguishes statutory capital classification from constitutional limits and juvenile review', () => {
    const row = packet.definitions.find(r => r.code === '794.011(2)')!;
    const text = row.text.en.degreeContext;
    for (const phrase of ['October 1, 2023','prosecutors to seek death','constitutional application is disputed','Kennedy','Graham','realistic opportunity','review is not guaranteed release','offense date and sentence','$15,000','capital branch is excluded','adult-only age condition','no further reclassification']) expect(text).toContain(phrase);
    const source = rows.find(r => r.chargeId.includes('794-011'))!;
    for (const section of ['775.082','775.083','794.0115','921.1401','921.1402','921.1425','741.2801']) expect(source.dependencies.some(d => d.section === section)).toBe(true);
    expect(packet.documents['921.1402'].text).toContain('on or after July 1, 2014');
    expect(packet.documents['794.0115'].text).toContain('18 years of age or older');
    expect(packet.documents['921.1425'].text).toContain('committed on or after October 1, 2023');
  });
  it('binds separately retained majority holdings and exposes their official links in all locales', () => {
    expect(packet.judicialAuthorities).toEqual(authorities);
    for (const a of authorities) {
      expect(hash(a.text)).toBe(a.contentHash);
      expect(a.pageEnd-a.pageStart).toBe(a.text.length);
      expect(a.pdfSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(a.sourceUrl).toMatch(/^https:\/\/tile.loc.gov\/storage-services\/service\/ll\/usrep\//);
      for (const lang of ['en','es','zh']) {
        const exp = getChargeExplanation('', 'FL', lang, a.chargeId)!;
        expect(exp.sources).toContainEqual({citation:a.citation,url:a.sourceUrl,jurisdiction:'FL'});
      }
    }
    expect(authorities.find(a=>a.id==='kennedy')!.text).toContain('did not result, and was not intended to result, in death');
    expect(authorities.find(a=>a.id==='graham')!.text).toContain('A State need not guarantee');
  });
  it('preserves translated base summaries and labels changed translations as drafts', () => {
    for (const original of originals) {
      const after = FLORIDA_REVIEWED_DEFINITIONS.find(d=>d.id===original.id)!;
      expect(after.name).toBe(original.name);
      expect(after.code).toBe(original.code);
      if (after.code === '741.31(4)(a)') {
        expect(after.category).toBe('misdemeanor');
        expect(after.categories).toEqual(['misdemeanor','felony']);
        expect(getChargeById(after.id)?.category).toBe('misdemeanor');
        expect(classifyChargesForGuidance([after.id])[0].categories).toEqual(['misdemeanor','felony']);
      } else expect(after.categories).toEqual(original.categories);
      for (const lang of ['en','es','zh'] as const) {
        const exp=getChargeExplanation('', 'FL',lang,after.id)!;
        expect(exp.plainSummary).toBe(original.text[lang].plainSummary);
        expect(exp.degreeContext).toBe(after.text[lang].degreeContext);
        if(lang!=='en') {expect(exp.translationDraft).toBe(true);expect(exp.untranslated).not.toBe(true);}
      }
    }
  });
  it('rejects corrupted evidence and does not mistake the old receipt for approval of corrected records', () => {
    const broken=structuredClone(packet.report);broken.drafts[0].requiredDependencies.pop();
    expect(()=>buildFloridaReviewedSourceRecords(packet.definitions as any,broken as any,packet.eligibility as any)).toThrow();
    const all=buildFloridaReviewedSourceRecords(FLORIDA_REVIEWED_DEFINITIONS,report as any,eligibility as any);
    expect(validateFloridaReviewedRefreshReceipt(receipt as any,report as any,eligibility as any,all,new Date(receipt.checkedAt))).not.toBeNull();
  });
  it('allows an existing held identity to retain judicial evidence without breaking other Florida choices', async () => {
    vi.resetModules();
    const held = structuredClone(eligibility);
    held.decisions.find(d => d.id === authorities[0].chargeId)!.status = 'held';
    vi.doMock('../shared/florida-reviewed-eligibility.json', () => ({default:held}));
    try {
      const { FLORIDA_REVIEWED_BATCH } = await import('../shared/florida-reviewed-batch');
      expect(FLORIDA_REVIEWED_BATCH.explanations.some(e=>e.canonicalChargeId===authorities[0].chargeId)).toBe(false);
      expect(FLORIDA_REVIEWED_BATCH.explanations.some(e=>e.canonicalChargeId?.includes('741-31'))).toBe(true);
    } finally { vi.doUnmock('../shared/florida-reviewed-eligibility.json'); vi.resetModules(); }
  });

});
