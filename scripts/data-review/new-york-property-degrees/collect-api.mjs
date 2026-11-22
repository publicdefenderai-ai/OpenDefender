/** Exact candidate acquisition; no seed-capable importer or database dependency. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validateOutput,fetchCandidateDocument as fetchPenalDocument} from '../new-york-first-pass/collect-api.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
export async function fetchCandidateDocument(reference,apiKey,fetcher=fetch){
 if(reference.sourceKey.startsWith('ny:PEN:'))return fetchPenalDocument(reference,apiKey,fetcher);
 if(!['ny:VAT:125','ny:VAT:123','ny:GBS:511','ny:RCO:2'].includes(reference.sourceKey)||!apiKey)throw Error('Exact batch identity and API credential required');
 const [,lawId,section]=reference.sourceKey.split(':');
 try{
  const response=await fetcher(`https://legislation.nysenate.gov/api/3/laws/${lawId}/${section}?key=${encodeURIComponent(apiKey)}`,{signal:AbortSignal.timeout(15000),redirect:'error'});
  if(!response.ok)throw Error('HTTP failure');
  const value=await response.json();const result=value.result;
  if(!value.success||result?.lawId!==lawId||result.docLevelId!==section||!result.title?.trim()||typeof result.text!=='string'||result.text.length<60)throw Error('Wrong/incomplete source');
  return {sourceKey:reference.sourceKey,lawId,section,title:result.title.trim(),text:result.text,contentSha256:createHash('sha256').update(result.text).digest('hex'),retrievedAt:new Date().toISOString(),activeDate:result.activeDate??null,publishedDates:result.publishedDates??[],metadataMeaning:'Publisher API dates; not independently established substantive effective dates',humanPageContentSha256:reference.contentSha256,sourceUrl:`https://www.nysenate.gov/legislation/laws/${lawId}/${section}`};
 }catch{throw Error(`Official API acquisition failed for ${lawId}:${section}; no candidate authority approved`);}
}
export async function collect(directory,apiKey=process.env.NY_SENATE_API_KEY){
 if(!apiKey)throw Error('NY_SENATE_API_KEY unavailable; use existing approved secret environment');
 const output=validateOutput(directory);fs.mkdirSync(output);
 const sources=JSON.parse(fs.readFileSync(path.join(here,'candidate-sources.json'),'utf8'));const documents=[];
 for(const reference of sources){
  if(documents.length)await new Promise(resolve=>setTimeout(resolve,550));
  documents.push(await fetchCandidateDocument(reference,apiKey));
 }
 fs.writeFileSync(path.join(output,'api-candidate.json'),JSON.stringify({status:'candidate_only_requires_comparison_not_importable_manifest',documents},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({candidateDocuments:documents.length,activeArtifactsChanged:false}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 collect(process.argv[2]??'').catch(error=>{console.error(error.message);process.exitCode=1;});
}
