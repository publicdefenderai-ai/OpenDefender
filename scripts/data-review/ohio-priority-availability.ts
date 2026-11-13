/** Read-only inventory. Input is repository-approved evidence and public GET endpoints. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { criminalCharges, getSelectableCharges } from '../../shared/criminal-charges';
import holds from '../../shared/ohio-source-change-holds.json';
import { validateOhioChapter2903RefreshReceipt } from '../../server/data/ohio-chapter-2903-refresh';
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from '../../server/data/ohio-chapter-2903-source';
import { OHIO_REVIEWED_SOURCES, isOhioReviewedSourceFresh } from '../../server/data/ohio-reviewed-source';
import { OHIO_MAJOR_SOURCES, isOhioMajorSourceFresh } from '../../server/data/ohio-major-source';
import { OHIO_RESIDUAL_SOURCES, isOhioResidualSourceFresh } from '../../server/data/ohio-residual-source';
import { OHIO_THEFT_FRAUD_SOURCES, isOhioTheftFraudSourceFresh } from '../../server/data/ohio-theft-fraud-source';
import { OHIO_BENEFITS_FRAUD_SOURCES, isOhioBenefitsFraudSourceFresh } from '../../server/data/ohio-benefits-fraud-source';
import { OHIO_JUSTICE_SOURCES, isOhioJusticeSourceFresh } from '../../server/data/ohio-justice-source';
import { OHIO_CUSTODY_SOURCES, isOhioCustodySourceFresh } from '../../server/data/ohio-custody-source';
import { OHIO_PUBLIC_PEACE_SOURCES, isOhioPublicPeaceSourceFresh } from '../../server/data/ohio-public-peace-source';
import { OHIO_FAMILY_SOURCES, isOhioFamilySourceFresh } from '../../server/data/ohio-family-source';
import { OHIO_PROTECTION_SOURCES, isOhioProtectionSourceFresh } from '../../server/data/ohio-protection-source';

const output = 'scripts/data-review/output/ohio-priority-availability.json';
const sourceGroups = [
  ['chapter-2903',OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS,null], ['reviewed',OHIO_REVIEWED_SOURCES,isOhioReviewedSourceFresh],
  ['major',OHIO_MAJOR_SOURCES,isOhioMajorSourceFresh], ['residual',OHIO_RESIDUAL_SOURCES,isOhioResidualSourceFresh], ['theft-fraud',OHIO_THEFT_FRAUD_SOURCES,isOhioTheftFraudSourceFresh],
  ['benefits-fraud',OHIO_BENEFITS_FRAUD_SOURCES,isOhioBenefitsFraudSourceFresh], ['justice',OHIO_JUSTICE_SOURCES,isOhioJusticeSourceFresh], ['custody',OHIO_CUSTODY_SOURCES,isOhioCustodySourceFresh],
  ['public-peace',OHIO_PUBLIC_PEACE_SOURCES,isOhioPublicPeaceSourceFresh], ['family',OHIO_FAMILY_SOURCES,isOhioFamilySourceFresh], ['protection',OHIO_PROTECTION_SOURCES,isOhioProtectionSourceFresh],
] as const;
const priorities = [
  ['assault',['2903.11','2903.12','2903.13','2903.14']], ['domestic violence',['2919.25']],
  ['theft',['2913.02']], ['impaired driving',['4511.19']], ['drug possession',['2925.11']], ['extortion',['2905.11']],
] as const;
const gapSets = {
  'Sexual offenses':['2907.06','2907.07','2907.08'],
  'Weapons offenses':['2923.15','2923.16'],
  'Drug offenses':['2925.12','2925.22'],
};
type PublicChoice = {id:string;name:string;code:string;maxPenalty:string};
const publicOrigin = 'https://opendefender.net';
const sectionOf = (code:string) => code.match(/\d+\.\d+/)?.[0] ?? null;
export async function captureOhioPublic(get: typeof fetch=fetch) {
  const choices: PublicChoice[] = [];
  let offset = 0, snapshot: string|undefined, total: number|undefined;
  do {
    const url = new URL('/api/criminal-charges',publicOrigin);
    url.search=new URLSearchParams({jurisdiction:'OH',limit:'500',offset:String(offset)}).toString();
    if (snapshot) url.searchParams.set('snapshot',snapshot);
    const response=await get(url,{redirect:'error',signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw Error(`Public selector HTTP ${response.status}`);
    const page=await response.json(), p=page.pagination;
    if(page.success!==true || !Array.isArray(page.charges) || !Number.isSafeInteger(p?.totalMatches) || p.totalMatches<0 ||
        page.count!==page.charges.length || page.totalAvailable!==p.totalMatches || p.offset!==offset ||
        typeof p.snapshot!=='string' || !p.snapshot || (snapshot!==undefined && (snapshot!==p.snapshot || total!==p.totalMatches))) {
      throw Error('Incomplete or changed Ohio public selector page');
    }
    snapshot=p.snapshot;total=p.totalMatches;
    for(const choice of page.charges){
      if((choice.jurisdiction!==undefined && choice.jurisdiction!=='OH') || typeof choice.id!=='string' || !choice.id.startsWith('oh-') || !['id','code','name','maxPenalty'].every(k=>typeof choice[k]==='string') ||
         choices.some(c=>c.id===choice.id))throw Error('Invalid or duplicate Ohio public choice');
      choices.push({id:choice.id,name:choice.name,code:choice.code,maxPenalty:choice.maxPenalty});
    }
    if(p.nextOffset===null)break;
    if(p.nextOffset!==choices.length || p.nextOffset<=offset || p.nextOffset>=p.totalMatches)throw Error('Invalid Ohio pagination');
    offset=p.nextOffset;
  } while(true);
  if(total!==choices.length)throw Error('Missing Ohio public selector choices');
  const response=await get(publicOrigin+'/api/statutes/sources/ohio/status',{redirect:'error',signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw Error(`Ohio public status HTTP ${response.status}`);
  const status=await response.json();
  const counts=['sourceCount','snapshotCount','currentSnapshotCount','pendingReviewCount','linkedChargeCount','selectableChargeCount','catalogRecordCount'];
  if(status.success!==true || counts.some(k=>!Number.isSafeInteger(status[k])||status[k]<0))throw Error('Incomplete Ohio public status');
  return {observedAt:new Date().toISOString(),origin:publicOrigin,snapshot,choices,
    status:{...Object.fromEntries(counts.map(k=>[k,status[k]])),lastImportStatus:status.lastRun?.status??null,lastImportCompletedAt:status.lastRun?.completedAt??null}};
}
export function ohioPriorityInventory(observation:Awaited<ReturnType<typeof captureOhioPublic>>) {
  const raw=criminalCharges.filter(c=>c.jurisdiction==='OH'), configured=new Set(getSelectableCharges().filter(c=>c.jurisdiction==='OH').map(c=>c.id));
  const live=new Set(observation.choices.map(c=>c.id)), seen=new Set<string>();
  const families=sourceGroups.map(([group,sources,validate])=>{
    const receipt=JSON.parse(readFileSync(`scripts/data-review/output/ohio-${group}-refresh-receipt.json`,'utf8'));
    const records=sources.map(r=>{
      if(seen.has(r.chargeId))throw Error('Duplicate reviewed Ohio identity '+r.chargeId);
      const charge=raw.find(c=>c.id===r.chargeId);
      if(!charge || !configured.has(charge.id))throw Error('Missing configured reviewed Ohio identity '+r.chargeId);
      seen.add(charge.id);
      return {id:charge.id,section:r.offense.section,code:charge.code,name:r.canonicalTitle,officialUrl:r.offense.sourceUrl,public:live.has(charge.id)};
    }).sort((a,b)=>a.id.localeCompare(b.id));
    const when=Date.parse(observation.observedAt), start=Date.parse(receipt.checkedAt),end=Date.parse(receipt.expiresAt);
    const localReceiptValid=validate ? validate(new Date(when)) : validateOhioChapter2903RefreshReceipt(receipt,new Date(when))===null;
    return {group,receiptExpiresAt:receipt.expiresAt,localReceiptValid,repositoryWindow:when<start?'before_issuance':when>=end?'expired':'within_dates_only',records};
  });
  const reviewed=families.flatMap(f=>f.records.map(r=>({...r,group:f.group})));
  const priorityGroups=priorities.map(([priority,sections])=>{
    const sectionSet=new Set<string>(sections);
    return {priority,sections,reviewed:reviewed.filter(r=>sectionSet.has(r.section)).map(({id,group,code,name,public:available})=>({id,group,code,name,public:available})),
      publicLegacyIds:observation.choices.filter(c=>!seen.has(c.id)&&sectionSet.has(sectionOf(c.code)??'')).map(c=>c.id)};
  });
  const frontier=JSON.parse(readFileSync('scripts/data-review/output/ohio-coverage-frontier.json','utf8'));
  const researchQueue=Object.entries(gapSets).flatMap(([family,sections])=>sections.map(section=>{
    const row=frontier.rows.find((r:{section:string})=>r.section===section);
    if(!row)throw Error('Missing Ohio discovery section '+section);
    return {family,section,title:row.catchline,officialUrl:row.sourceUrl,
      catalogIds:raw.filter(c=>sectionOf(c.code)===section).map(c=>c.id),reviewedIds:reviewed.filter(r=>r.section===section).map(r=>r.id),
      publicIds:observation.choices.filter(c=>sectionOf(c.code)===section).map(c=>c.id)};
  }));
  return {schemaVersion:1, publicObservation:observation, counts:{raw:raw.length,configured:configured.size,reviewed:seen.size,public:live.size,publicReviewed:reviewed.filter(r=>r.public).length},
    publicIdentityChecks:observation.choices.map(c=>({id:c.id,configured:configured.has(c.id),reviewed:seen.has(c.id),
      sameSectionReviewedIds:reviewed.filter(r=>r.section===sectionOf(c.code)).map(r=>r.id)})),
    priorityGroups,researchQueue,holds:holds.map(({id,sections})=>({id,sections})),families};
}
async function main(){
  const args=process.argv.slice(2);
  if(args.length!==1||!['--capture','--check'].includes(args[0]))throw Error('Use --capture or --check');
  const previous=args[0]==='--check'?readFileSync(output,'utf8'):null;
  const observation=previous?JSON.parse(previous).publicObservation:await captureOhioPublic();
  const report=ohioPriorityInventory(observation), encoded=JSON.stringify(report,null,2)+'\n';
  if(previous!==null){if(previous!==encoded)throw Error('Ohio priority inventory differs from this checkout');}
  else writeFileSync(output,encoded);
  console.log(JSON.stringify(report.counts));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message);process.exitCode=1;});
