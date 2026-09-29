import {describe,expect,it} from 'vitest';
import transitions from '../shared/california-source-transitions.json';
import {validateCaliforniaSourceTransitions,californiaTransitionRequiresReview} from '../shared/california-source-transitions';
const entry=(reviewBefore:string,key='VEH:23109')=>({key,reviewBefore,reason:'Review required'});
describe('California transition inventory validation',()=>{
  it('validates every committed row and rejects malformed future additions',()=>{
    expect(validateCaliforniaSourceTransitions(transitions)).toHaveLength(transitions.length);
    for(const date of ['2033-13-01','Jan 1 2033','2033/01/01','','2033-02-29','2032-02-30']){
      expect(()=>validateCaliforniaSourceTransitions([...transitions,entry(date,'VEH:12951')])).toThrow('transition date');
    }
    expect(()=>validateCaliforniaSourceTransitions(null)).toThrow();
  });
  it('rejects unknown codes, malformed or unretained sections, duplicate keys and missing reasons',()=>{
    for(const key of ['VH:23109','VEH23109','VEH:23109(a)','VEH:999999'])expect(()=>validateCaliforniaSourceTransitions([entry('2033-01-01',key)])).toThrow();
    expect(()=>validateCaliforniaSourceTransitions([entry('2033-01-01'),entry('2034-01-01')])).toThrow('duplicate');
    expect(()=>validateCaliforniaSourceTransitions([{...entry('2033-01-01'),reason:''}])).toThrow('reason');
  });
  it('uses California midnight in winter, summer and on daylight-saving transition days',()=>{
    for(const [date,utc] of [['2033-01-01','2033-01-01T08:00:00Z'],['2033-07-01','2033-07-01T07:00:00Z'],['2026-03-08','2026-03-08T08:00:00Z'],['2026-11-01','2026-11-01T07:00:00Z']]){
      expect(validateCaliforniaSourceTransitions([entry(date)])[0].reviewAt).toBe(Date.parse(utc));
    }
    expect(californiaTransitionRequiresReview(['VEH:23109'],new Date('invalid'))).toBe(true);
  });
});
