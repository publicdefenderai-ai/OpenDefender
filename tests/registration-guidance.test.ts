import {describe,it,expect} from 'vitest';
import {buildRegistrationContextBlock} from '../shared/registration-guidance';
import {buildCollateralConsequenceContextBlock,getSexOffenderRule} from '../shared/collateral-consequences-data';
import receipt from '../scripts/data-review/output/california-archive-refresh-receipt.json';

describe('bounded registration guidance',()=>{
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
