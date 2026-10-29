import {describe,expect,it} from 'vitest';
import {californiaCitationSearchAliases} from '../shared/california-law-codes';
import {getChargesByJurisdiction} from '../shared/criminal-charges';
import {getCaliforniaCanonicalRecord} from '../shared/california-authority';
describe('California charging-paper citation search',()=>{
  it('finds real catalog entries by conventional dotted citations without losing code identity',()=>{
    const charges=getChargesByJurisdiction('CA');
    for(const [query,id] of [
      ['Ins. Code 1871.4','ca-ins-1871-4-a-1'],
      ['Lab. Code 3700.5','ca-lab-3700-5-a'],
      ['Unemp. Ins. Code 2101','ca-uic-2101-a'],
      ['Welf. & Inst. Code 10980','ca-wic-10980-c-1'],
      ['Bus. & Prof. Code 2052','ca-bpc-2052-a'],
    ]) {
      const charge=charges.find(c=>c.id===id);
      expect(charge,id).toBeDefined();
      expect(charge!.searchAliases?.some(alias=>alias.toLowerCase().includes(query.toLowerCase())),query).toBe(true);
    }
    expect(californiaCitationSearchAliases('INS','2101')).not.toContain('Unemp. Ins. Code 2101');
    expect(californiaCitationSearchAliases('UIC','2101')).not.toContain('Ins. Code 2101');
  });
  it('adds common abbreviations while preserving archive keys and full names',()=>{
    for(const [code,alias] of [['PEN','PC'],['VEH','VC'],['HSC','H&S'],['BPC','B&P'],['HNC','H&N'],['INS','IC'],['UIC','UI'],['LAB','LC'],['WIC','W&I']] as const){
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
