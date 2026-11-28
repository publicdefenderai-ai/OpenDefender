import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import {build,validatePacket,hash} from '../scripts/data-review/new-york-trespass-order/review.mjs';
import {fetchCandidateDocument} from '../scripts/data-review/new-york-trespass-order/collect-api.mjs';
const dir='scripts/data-review/new-york-trespass-order/';
const sources=JSON.parse(fs.readFileSync(dir+'candidate-sources.json','utf8'));
const packet=build(sources);
const row=(section:string,scope:string)=>packet.records.find((r:any)=>r.section===section&&r.scope===scope)!;
const text=(r:any,role:string)=>r.bindings.find((b:any)=>b.role===role).text;
describe('NY trespass and court/public-order research',()=>{
 it('accounts independently for ten mappings, three holds and four primary sections',()=>{
  expect(packet.records.map((r:any)=>`${r.section}:${r.scope}`)).toEqual(['140.05:whole','140.15:1','140.15:2','215.50:1','215.50:2','215.50:3','215.50:4','240.26:1','240.26:2','240.26:3']);
  expect(packet.heldAlternatives.map((r:any)=>r.scope)).toEqual(['5','6','7']);expect(sources).toHaveLength(16);
  expect(packet.counts.publishedChoices).toBe(0);expect(packet.records.every((r:any)=>r.publicationStatus.startsWith('blocked_'))).toBe(true);
 });
 it('binds every span and source without inventing effective dates',()=>{
  for(const s of sources){expect(hash(s.text)).toBe(s.contentSha256);expect(s.effectiveDateStart).toBeNull();}
  for(const r of [...packet.records,...packet.heldAlternatives])for(const b of r.bindings){const s=sources.find((d:any)=>d.sourceKey===b.sourceKey);expect(b.contentSha256).toBe(s.contentSha256);expect(b.end).toBeGreaterThan(b.start);if(b.text)expect(s.text.slice(b.start,b.end)).toBe(b.text);}
 });
 it('preserves violations, 364-day misdemeanors and alternative gain fines',()=>{
  expect(row('140.05','whole').statutoryGrade).toBe('violation');
  for(const r of packet.records){const violation=['140.05','240.26'].includes(r.section);expect(text(r,'ordinary_imprisonment')).toContain(violation?'fifteen days':'three\nhundred sixty-four days');expect(text(r,'ordinary_fine')).toContain(violation?'two hundred\nfifty dollars':'one thousand dollars');expect(text(r,'alternative_gain_fine')).toContain('double the');}
 });
 it('keeps five school exceptions and risk/victim-knowledge elements separate from dwelling trespass',()=>{
  const r=row('140.15','2');const t=text(r,'conduct_subdivision').replace(/\s+/g,' ');
  for(const phrase of ['level two or level three','attends or formerly attended','lawfully registered student','lawful student participant','parent or a legal guardian','designated polling place','superintendent or chief administrator'])expect(t).toContain(phrase);
  expect(t).not.toContain('unlawfully in a dwelling');expect(r.bindings.filter((b:any)=>b.sourceKey.startsWith('ny:COR:'))).toHaveLength(3);
 });
 it('keeps contempt lawful-process, labor and lawful-question boundaries',()=>{
  expect(text(row('215.50','1'),'conduct_subdivision')).toContain('immediate view and presence');
  expect(text(row('215.50','3'),'conduct_subdivision')).toContain('lawful process');
  expect(row('215.50','3').bindings.some((b:any)=>b.sourceKey==='ny:JUD:753-A')).toBe(true);
  expect(text(row('215.50','4'),'conduct_subdivision')).toContain('legal and proper');
  expect(row('215.50','4').summary).toContain('privileged');
 });
 it('retains harassment intent, legitimate purpose and only the stated labor exclusions',()=>{
  for(const s of ['1','2','3'])expect(text(row('240.26',s),'shared_conduct_preamble')).toContain('intent to harass, annoy or alarm');
  expect(row('240.26','1').bindings.some((b:any)=>b.role==='labor_exclusion')).toBe(false);
  for(const s of ['2','3'])expect(text(row('240.26',s),'labor_exclusion')).toContain('Subdivisions two and three');
  expect(text(row('240.26','3'),'conduct_subdivision')).toContain('legitimate purpose');expect(row('240.26','1').summary).toContain('constitutional');
 });
 for(const mutation of ['grade','summary','span','dependency','hold','hash'])it('rejects '+mutation+' tampering',()=>{
  const p=structuredClone(packet);if(mutation==='grade')p.records[0].statutoryGrade='class A misdemeanor';if(mutation==='summary')p.records[0].summary+=' changed';if(mutation==='span')p.records[0].bindings[0].end--;if(mutation==='dependency')p.records[0].bindings.pop();if(mutation==='hold')p.heldAlternatives.pop();if(mutation==='hash')p.sourcePacketHash='0'.repeat(64);expect(()=>validatePacket(p,sources)).toThrow();
 });
 it('keeps reused acquisition records byte-equivalent to prior packets',()=>{
  const retained=new Map();for(const name of ['new-york-first-pass','new-york-person-order','new-york-assault-injury'])for(const s of JSON.parse(fs.readFileSync(`scripts/data-review/${name}/candidate-sources.json`,'utf8')))if(!retained.has(s.sourceKey))retained.set(s.sourceKey,s);
  const reused=sources.filter((s:any)=>s.sourceKey.startsWith('ny:PEN:'));expect(reused).toHaveLength(12);for(const s of reused)expect(s).toEqual(retained.get(s.sourceKey));
 });
 it('validates special API law and section identities and suppresses transport details',async()=>{
  const s=sources.find((s:any)=>s.sourceKey==='ny:COR:168-L');
  const good=async()=>({ok:true,json:async()=>({success:true,result:{lawId:'COR',docLevelId:'168-L',title:'Risk assessment',text:'Statutory source text '.repeat(8)}})}) as any;
  expect((await fetchCandidateDocument(s,'fixture-token',good)).sourceKey).toBe(s.sourceKey);
  await expect(fetchCandidateDocument(s,'fixture-token',async()=>{throw Error('fixture-token');})).rejects.toThrow('Official API acquisition failed for COR:168-L');
  await expect(fetchCandidateDocument({...s,sourceKey:'ny:COR:999'},'fixture-token',good)).rejects.toThrow('Exact batch identity');
 });
});
