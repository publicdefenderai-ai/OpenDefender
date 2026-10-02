import {describe,it,expect} from 'vitest';
import {CALIFORNIA_CONDUCT_SUPPLEMENTS,validateCaliforniaConductSupplementIds} from '../shared/california-conduct-supplements';
import {getCaliforniaCanonicalRecord} from '../shared/california-authority';
describe('California supplement identity validation',()=>{
 it('accepts reviewed supplements that resolve to actual selectable records',()=>{
  expect(()=>validateCaliforniaConductSupplementIds(CALIFORNIA_CONDUCT_SUPPLEMENTS)).not.toThrow();
  for(const row of CALIFORNIA_CONDUCT_SUPPLEMENTS)expect(getCaliforniaCanonicalRecord(row.id)?.selectable).toBe(true);
 });
 it('rejects an orphan even after valid entries',()=>{
  expect(()=>validateCaliforniaConductSupplementIds([...CALIFORNIA_CONDUCT_SUPPLEMENTS,{id:'ca-petty-thefft'}])).toThrow('Unknown California conduct supplement ID');
 });
 it('rejects ambiguous duplicate entries',()=>{
  expect(()=>validateCaliforniaConductSupplementIds([...CALIFORNIA_CONDUCT_SUPPLEMENTS,...CALIFORNIA_CONDUCT_SUPPLEMENTS])).toThrow('Duplicate California conduct supplement ID');
 });
});
