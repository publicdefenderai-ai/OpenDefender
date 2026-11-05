import {checkStatutoryReceipts} from "../check-statutory-receipt-freshness.mjs";
/** Read-only public-source probes. No database, legal approval, receipt or pin writes. */
import {readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {stateStatuteConfigs} from '../../server/data/state-statute-urls';
import {SOURCE_POLICY_JURISDICTIONS} from '../../shared/source-verification-policy.mjs';
type Source = {url:string; jurisdictions:string[]; kind:'portal'|'retained-section'; markers:string[]};
export function sourceInventory(root=process.cwd()): Source[] {
  const sources = new Map<string,Source>();
  const add=(url:string, jurisdiction:string, kind:Source['kind'], markers:string[]=[])=>{
    try {const u=new URL(url); if(!['http:','https:'].includes(u.protocol)||u.username||u.password||/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2[0-9]|3[01])\.|\[::1\])|\.local$/i.test(u.hostname)) throw new Error('Invalid configured source URL');
      const old=sources.get(url); sources.set(url,{url,jurisdictions:[...new Set([...(old?.jurisdictions??[]),jurisdiction])],kind:old?.kind==='retained-section'?old.kind:kind,markers:[...new Set([...(old?.markers??[]),...markers.filter(m=>m.length>=4)])]});
    } catch { throw new Error(`Invalid configured source URL for ${jurisdiction}`); }
  };
  for(const [state,config] of Object.entries(stateStatuteConfigs)) add(config.baseUrl,state,'portal');
  const dir=resolve(root,'scripts/data-review/output');
  for(const name of readdirSync(dir).filter(n=>/^[a-z]{2}-source-manifest\.json$/.test(n))) {
    const manifest=JSON.parse(readFileSync(resolve(dir,name),'utf8'));
    for(const record of manifest.catalogRecords??[]) for(const p of record.provisions??[]) if(p.sourceUrl) add(p.sourceUrl,manifest.jurisdiction,'retained-section',[p.officialTitle??'']);
  }
  // Source-first batches are not necessarily present in the legacy manifests.
  const evidenceFiles=['ohio-substantive-review.json','ohio-common-charge-evidence.json','ohio-source-correction-evidence.json','ohio-chapter-2903-evidence.json','ohio-major-publication-evidence.json','florida-batch-source-cache.json'];
  for(const name of evidenceFiles) {
    const path=resolve(dir,name);if(!existsSync(path))continue;
    const walk=(value:any):void=>{if(!value||typeof value!=='object')return;
      if(typeof value.sourceUrl==='string') add(value.sourceUrl,name.startsWith('ohio')?'OH':'FL','retained-section',[value.title??value.officialTitle??'']);
      for(const item of Object.values(value))if(item&&typeof item==='object')walk(item);
    };walk(JSON.parse(readFileSync(path,'utf8')));
  }
  add('https://uscode.house.gov/','US','portal');
  const pins=JSON.parse(readFileSync(resolve(root,'shared/california-retained-pins.json'),'utf8'));
  for(const key of Object.keys(pins)) {const [code,section]=key.split(':'); add(`https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${code}&sectionNum=${section}.`,'CA','retained-section',[`>${section}.`]);}
  return [...sources.values()].sort((a,b)=>a.url.localeCompare(b.url));
}
export async function probe(source:Source, fetcher:typeof fetch=fetch) {
  try {
    const response=await fetcher(source.url,{redirect:'manual',signal:AbortSignal.timeout(10000),headers:{'User-Agent':'OpenDefender-SourceAvailability/1.0',Accept:'text/html,text/plain;q=0.9'}});
    if(response.status!==200) {await response.body?.cancel();return {status:response.status>=300&&response.status<400?'redirect_requires_review':'http_unavailable',httpStatus:response.status};}
    if(!/text\/(html|plain)/i.test(response.headers.get('content-type')??'')) {await response.body?.cancel();return {status:'reachable_uninspected',httpStatus:200};}
    const reader=response.body?.getReader();let text='',bytes=0;const decoder=new TextDecoder();
    if(reader) try {while(bytes<512000){const {done,value}=await reader.read();if(done)break;const bounded=value.subarray(0,512000-bytes);bytes+=bounded.length;text+=decoder.decode(bounded,{stream:true});}}finally{await reader.cancel();}
    if(/access denied|403 forbidden|verify you are human|captcha|just a moment/i.test(text)) return {status:'access_blocked',httpStatus:200};
    if(!text.trim()) return {status:'content_unconfirmed',httpStatus:200};
    if(source.kind==='portal') return {status:'portal_reachable_not_section_verified',httpStatus:200};
    if(!source.markers.length||!source.markers.some(m=>text.toLowerCase().includes(m.toLowerCase()))) return {status:'content_unconfirmed',httpStatus:200};
    return {status:'section_marker_present_not_legal_verification',httpStatus:200};
  } catch {return {status:'transport_unavailable',httpStatus:null};}
}
const failures=new Set(['reachable_uninspected','redirect_requires_review','http_unavailable','access_blocked','content_unconfirmed','transport_unavailable']);
export function nextObservation(status:string, previous?:{status:string; failures:number}) {
  const count=failures.has(status)?(previous?.failures??0)+1:0;
  return {status,failures:count,notify:count===2 || (count>2 && previous?.status!==status)};
}
async function main(){
  const directory=resolve('.cache/source-availability');mkdirSync(directory,{recursive:true});
  const path=resolve(directory,'state.json');const previous=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{};
  const allSources=sourceInventory();const offset=(Math.floor(Date.now()/(7*86400000))*200)%allSources.length;
  const inventory=[...allSources.slice(offset),...allSources.slice(0,offset)]; const results:any[]=[];const state={...previous}; let cursor=0;
  const deadline=Date.now()+20*60*1000;
  await Promise.all(Array.from({length:4},async()=>{while(cursor<inventory.length&&Date.now()<deadline){const source=inventory[cursor++];const result=await probe(source);const observation=nextObservation(result.status,previous[source.url]);state[source.url]=observation;results.push({...source,...result,...observation});}}));
  const deadlines=checkStatutoryReceipts();
  const deadlineAlerts=deadlines.receipts.filter((r:any)=>r.status!=='current'&&previous[`receipt:${r.name}`]?.status!==r.status);
  for(const r of deadlines.receipts)state[`receipt:${r.name}`]={status:r.status};
  const report={deadlines,deadlineAlerts,checkedAt:new Date().toISOString(),scope:'availability_only_no_legal_approval',policyJurisdictions:SOURCE_POLICY_JURISDICTIONS,
    inventoryCount:inventory.length,checkedCount:results.length,uncheckedCount:inventory.length-results.length,
    currentlyFailing:results.filter(r=>r.failures>0).length, persistentFailures:results.filter(r=>r.failures>=2).length,
    portalOnlyJurisdictions:SOURCE_POLICY_JURISDICTIONS.filter(j=>!inventory.some(s=>s.kind==='retained-section'&&s.jurisdictions.includes(j))),results};
  writeFileSync(path,JSON.stringify(state,null,2));writeFileSync(resolve(directory,'report.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({checked:results.length,unchecked:report.uncheckedCount,newPersistentFailures:results.filter(r=>r.notify).length}));
  if(report.uncheckedCount||deadlineAlerts.length||results.some(r=>r.notify))process.exitCode=1;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
