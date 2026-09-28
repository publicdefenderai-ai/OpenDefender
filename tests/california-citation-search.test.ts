import {describe,expect,it} from 'vitest';
import {californiaCitationSearchAliases} from '../shared/california-law-codes';
import {getChargesByJurisdiction} from '../shared/criminal-charges';
import {getCaliforniaCanonicalRecord} from '../shared/california-authority';
describe('California charging-paper citation search',()=>{
  it('adds common abbreviations while preserving archive keys and full names',()=>{
    for(const [code,alias] of [['PEN','PC'],['VEH','VC'],['HSC','H&S'],['BPC','B&P'],['HNC','H&N']] as const){
      const list=californiaCitationSearchAliases(code,'123(a)');
      expect(list).toContain(`${alias} 123(a)`);expect(list).toContain(`${code} 123(a)`);
    }
    expect(californiaCitationSearchAliases('LAB','200')).toContain('LAB 200');
  });
  it('covers additions and corrected legacy records without erasing deliberate conduct aliases',()=>{
    const charges=getChargesByJurisdiction('CA');
    for(const charge of charges){
      const record=getCaliforniaCanonicalRecord(charge.id)!;
      for(const alias of californiaCitationSearchAliases(record.lawCode,record.code))expect(charge.searchAliases,charge.id).toContain(alias);
    }
    expect(charges.find(c=>c.id==='ca-possession-of-controlled-substance')?.searchAliases).toContain('H&S 11350');
    for(const id of ['ca-veh-20001-b-1','ca-veh-20001-b-2'])expect(charges.find(c=>c.id===id)?.searchAliases).toContain('VC 20001(a)');
    expect(charges.find(c=>c.id==='ca-veh-2800-2')?.searchAliases).toContain('VC 2800.2');
  });
});
