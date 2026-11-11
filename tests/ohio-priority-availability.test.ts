import { describe, expect, it } from 'vitest';
import { captureOhioPublic, ohioPriorityInventory } from '../scripts/data-review/ohio-priority-availability';

const status={success:true,sourceCount:259,snapshotCount:259,currentSnapshotCount:259,pendingReviewCount:0,linkedChargeCount:134,
  selectableChargeCount:10,catalogRecordCount:115,lastRun:{id:'omit-this-id',status:'completed',completedAt:'2026-10-27T02:21:42Z'}};
function page(id:string,offset:number,nextOffset:number|null) {
  return {success:true,count:1,totalAvailable:2,pagination:{totalMatches:2,offset,nextOffset,snapshot:'same-pages'},
    charges:[{id,name:'Public charge',code:'2911.21',maxPenalty:'M4',extra:'omit-this-field'}]};
}
const replay=(responses:unknown[]) => async () => Response.json(responses.shift());
describe('Ohio public availability observation',()=>{
  it('reads all IDs across stable pages, preserves distinct status counts, and keeps public fields only',async()=>{
    const observation=await captureOhioPublic(replay([page('oh-a',0,1),page('oh-b',1,null),status]));
    expect(observation.choices.map(c=>c.id)).toEqual(['oh-a','oh-b']);
    expect(observation.status.selectableChargeCount).toBe(10);
    expect(JSON.stringify(observation)).not.toMatch(/omit-this/);
  });
  it.each(['duplicate','changed snapshot','early end','wrong jurisdiction','wrong offset','count drift'])('rejects %s',async mutation=>{
    const a=page('oh-a',0,1), b=page('oh-b',1,null);
    if(mutation==='duplicate')b.charges[0].id='oh-a';
    if(mutation==='changed snapshot')b.pagination.snapshot='other';
    if(mutation==='early end')a.pagination.nextOffset=null;
    if(mutation==='wrong jurisdiction')a.charges[0].id='pa-other';
    if(mutation==='wrong offset')b.pagination.offset=0;
    if(mutation==='count drift')b.totalAvailable=3;
    await expect(captureOhioPublic(replay([a,b,status]))).rejects.toThrow();
  });
  it('keeps exact reviewed identities separate from same-section legacy records and held IDs',()=>{
    const o={observedAt:'2026-11-11T06:07:44.073Z',origin:'https://opendefender.net',snapshot:'fixture',
      choices:[{id:'oh-domestic-violence',name:'Domestic Violence',code:'2919.25',maxPenalty:'fixture'},{id:'oh-criminal-trespass',name:'Criminal Trespass',code:'2911.21',maxPenalty:'fixture'}],
      status:{lastImportCompletedAt:null,lastImportStatus:null}};
    const report=ohioPriorityInventory(o);
    expect(report.counts.publicReviewed).toBe(0);
    const dv=report.priorityGroups.find(g=>g.priority==='domestic violence')!;
    expect(dv.reviewed.length).toBeGreaterThan(0);
    expect(dv.reviewed.every(r=>!r.public)).toBe(true);
    expect(dv.publicLegacyIds).toEqual(['oh-domestic-violence']);
    expect(report.holds).toContainEqual({id:'oh-orc-2911-21-criminal-trespass',sections:['1509.01']});
  });
});
