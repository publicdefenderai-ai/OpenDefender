import { describe,it,expect } from 'vitest';
import { officialCaregiverForms as official } from '../shared/templates/official-caregiver-forms';
describe('government caregiver form publication',()=>{
 it('provides all five state choices from government publishers',()=>{
  expect(Object.keys(official)).toEqual(['CA','TX','FL','NY','IL']);
  const hosts={CA:'selfhelp.courts.ca.gov',TX:'www.dfps.texas.gov',FL:'www.15thcircuit.com',NY:'ocfs.ny.gov',IL:'dcfs.illinois.gov'};
  for(const [state,host] of Object.entries(hosts)){
   expect(new URL(official[state].url).hostname).toBe(host);
   expect(official[state].en.length).toEqual(official[state].es.length);
  }
  expect(new URL(official.FL.source).hostname).toBe('www.15thcircuit.com');
  expect(official.NY.format).toBe('DOCX');
 });
 it('preserves the state-specific limitations',()=>{
  expect(official.CA.en.join(' ')).toContain('non-relative');expect(official.CA.en.join(' ')).toContain('no fixed six-month');
  expect(official.TX.en.join(' ')).toContain('automatic six-month');expect(official.TX.en.join(' ')).toContain('10 days');
  expect(official.NY.en.join(' ')).toContain('12 months');expect(official.NY.en.join(' ')).toContain('oral or written');
  expect(official.FL.en.join(' ')).toContain('709.2105');expect(official.FL.en.join(' ')).toContain('not a court order');
 });
 it('uses Illinois short-term guardianship with required execution and court qualifications',()=>{
  const il=official.IL.en.join(' ');
  for(const phrase of ['755 ILCS 5/11-5.4','two credible witnesses','neither may be the appointed guardian','guardian also signs','does not require notarization','other living parent must sign','365 days','military-service','administrative separation','juvenile court may vacate','limited property powers'])expect(il).toContain(phrase);
  expect(il).not.toContain('755 ILCS 45');
 });
});
