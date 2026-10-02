import {describe,it,expect} from 'vitest';
import {readVehicleCloseout,validateVehicleCloseout,renderVehicleCloseout} from '../scripts/data-review/california-verification/vehicle-closeout';

describe('California vehicle research closeout',()=>{
 it('preserves the published vehicle choice and retains two bounded legal decisions',()=>{
  expect(validateVehicleCloseout()).toEqual({questions:2,newChoices:0,retainedSections:10});
  const p=readVehicleCloseout();
  expect(p.questions.map(q=>q.id)).toEqual(['CA-VEH-01','CA-VEH-02']);
  expect(p.questions.every(q=>q.status==='targeted_attorney_review')).toBe(true);
  for(const q of p.questions){
   for(const key of q.readKeys)expect(p.sources.some(s=>s.key===key)).toBe(true);
   for(const id of q.authorityIds)expect(p.authorities.some(a=>a.id===id)).toBe(true);
  }
  expect(p.settled.join(' ')).toContain('Bullard addresses that issue');
  expect(p.nextWork).toContain('major-omission audit');
 });
 it('rejects altered source text, instruction evidence and publication disposition',()=>{
  const source=readVehicleCloseout();source.sources[0].text+=' changed';
  expect(()=>validateVehicleCloseout(source)).toThrow('drift');
  const instruction=readVehicleCloseout();instruction.instruction.pages[0].text+=' changed';
  expect(()=>validateVehicleCloseout(instruction)).toThrow('drift');
  const disposition=readVehicleCloseout();disposition.questions[1].pendingTreatment='Publish as felony-only';
  expect(()=>validateVehicleCloseout(disposition)).toThrow('drift');
 });
 it('renders assumptions, questions and source links without house-style dashes',()=>{
  const text=renderVehicleCloseout();
  expect(text).toContain('**Assumptions:**');
  expect(text).toContain('**Decision needed:**');
  expect(text).toContain('sectionNum=10851');
  expect(text).toContain('People v. Bullard');
  expect(text).not.toMatch(/[—–]/);
 });
});
