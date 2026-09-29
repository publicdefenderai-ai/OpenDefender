import {createHash} from 'node:crypto';
import {sexualOffensesDocuments} from '../scripts/data-review/california-verification/sexual-offenses-review';
import {sourceText} from '../scripts/data-review/california-verification/person-property-review';
import {describe,it,expect} from 'vitest';
import {buildRegistrationContextBlock} from '../shared/registration-guidance';
import {buildCollateralConsequenceContextBlock,getSexOffenderRule} from '../shared/collateral-consequences-data';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';

describe('bounded registration guidance',()=>{
  it('binds each adult tier summary to the retained statutory tier clause',()=>{
    const versions=sexualOffensesDocuments()['PEN:290'];expect(versions).toHaveLength(1);
    const v=versions[0];expect(createHash('sha256').update(v.contentXml).digest('hex')).toBe(v.contentSha256);
    const statute=sourceText(v.contentXml).replace(/\s+/g,' ');
    const guidance=buildRegistrationContextBlock('CA',new Date(receipt.checkedAt));
    // These are independent source/prose anchors, not proof that exceptions or individual tier assignments are resolved.
    for(const [source,prose] of [
      ['A tier one offender is subject to registration for a minimum of 10 years','10 years for tier one'],
      ['A tier two offender is subject to registration for a minimum of 20 years','20 years for tier two'],
      ['A tier three offender is subject to registration for life','lifetime registration for tier three'],
    ]){expect(statute).toContain(source);expect(guidance).toContain(prose);}
  });
  it('supplies adult context without assigning an individual obligation or automatic termination',()=>{
    const text=buildRegistrationContextBlock(' ca ',new Date(receipt.checkedAt));
    for(const value of ['10 years','20 years','statutory exceptions','Juvenile','does not automatically','does not assign a tier','https://oag.ca.gov/'])expect(text).toContain(value);
    expect(text).not.toContain('2,000');expect(text).not.toContain('AB 1149');
  });
  it('withholds numeric details when evidence expires and for unreviewed jurisdictions',()=>{
    for(const text of [buildRegistrationContextBlock('CA',new Date(receipt.expiresAt)),buildRegistrationContextBlock('FL')]){
      expect(text).not.toContain('10 years');expect(text).not.toContain('20 years');
      expect(text).toContain('A charge alone does not establish');
    }
    expect(getSexOffenderRule('CA')).toBeNull();
  });
  it('reaches the production collateral prompt builder',()=>{
    expect(buildCollateralConsequenceContextBlock('CA')).toContain('REGISTRATION:');
    expect(buildCollateralConsequenceContextBlock('TX')).toContain('No reviewed state-specific registration determination');
  });
});
