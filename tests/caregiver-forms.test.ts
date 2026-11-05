import { describe,it,expect } from 'vitest';
import { officialCaregiverForms as official } from '../shared/templates/official-caregiver-forms';
import { getPOATemplate,getAvailableStates } from '../shared/templates/poa-child-custody';
describe('caregiver form publication',()=>{
 it('retires custom substitutes where complete official forms are provided',()=>{
  expect(getAvailableStates()).toEqual(['CA','TX','FL','NY','IL']);
  for(const state of ['CA','TX','NY']){expect(getPOATemplate(state)).toBeNull();expect(official[state].url).toMatch(/^https:/);expect(official[state].en.length).toEqual(official[state].es.length);}
 });
 it('preserves the distinctions in the official-form guidance',()=>{
  expect(official.CA.en.join(' ')).toContain('non-relative');expect(official.CA.en.join(' ')).toContain('no fixed six-month');
  expect(official.TX.en.join(' ')).toContain('automatic six-month');expect(official.TX.en.join(' ')).toContain('10 days');
  expect(official.NY.en.join(' ')).toContain('12 months');expect(official.NY.en.join(' ')).toContain('oral or written');
 });
 it('Florida keeps two witnesses and uses acknowledgment, with optional expiration and second parent',()=>{
  const fl=getPOATemplate('FL')!;expect(fl.witnessesRequired).toBe(2);expect(fl.notarizationRequired).toBe(true);
  expect(fl.legalCitation).toContain('709.2105');expect(fl.legalCitation).not.toContain('709.2104');
  expect(fl.template.en).toContain('acknowledged before me');expect(fl.template.en).not.toContain('Sworn to');
  expect(fl.template.es).toContain('reconocido ante mí');expect(fl.template.es).not.toContain('Jurado y suscrito');
  for(const text of [fl.template.en,fl.template.es]){expect(text).toContain('[END_DATE]');expect(text).toContain('[START_DATE]');}
  expect(fl.template.en).toContain('SECOND PARENT');expect(fl.template.es).toContain('SEGUNDO PROGENITOR');
 });
});
