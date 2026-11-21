/** Standalone candidate collector. Does not import the seed-capable NY importer. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../../..');
export async function fetchCandidateDocument(reference,apiKey,fetcher=fetch){
 const match=/^ny:(PEN|RPA|PBH):([0-9]+\.[0-9]+|[0-9]+(?:-A)?)$/.exec(reference.sourceKey);
 if(!match||!apiKey)throw Error('Exact source identity and NY_SENATE_API_KEY are required');
 const [,lawId,section]=match;
 try{
  const response=await fetcher(`https://legislation.nysenate.gov/api/3/laws/${lawId}/${section}?key=${encodeURIComponent(apiKey)}`,{signal:AbortSignal.timeout(15000),redirect:'error'});
  if(!response.ok)throw Error('HTTP failure');
  const value=await response.json();const r=value.result;
  if(!value.success||r?.lawId!==lawId||r.docLevelId!==section||!r.title?.trim()||typeof r.text!=='string'||r.text.length<60)throw Error('Incomplete exact source');
  return {sourceKey:reference.sourceKey,lawId,section,title:r.title.trim(),text:r.text,contentSha256:createHash('sha256').update(r.text).digest('hex'),retrievedAt:new Date().toISOString(),activeDate:r.activeDate??null,publishedDates:r.publishedDates??[],metadataMeaning:'Publisher API dates; not independently established substantive effective dates',humanPageContentSha256:reference.contentSha256,sourceUrl:`https://www.nysenate.gov/legislation/laws/${lawId}/${section}`};
 }catch{throw Error(`Official API acquisition failed for ${lawId}:${section}; no candidate authority approved`);}
}
export function validateOutput(directory){
 if(!path.isAbsolute(directory))throw Error('Absolute external output directory required');
 const output=path.resolve(directory);const parent=fs.realpathSync(path.dirname(output));
 if(output===root||output.startsWith(root+path.sep)||parent===root||parent.startsWith(root+path.sep)||fs.existsSync(output))throw Error('Output must be new and outside checkout');
 return output;
}
export async function collect(directory,apiKey=process.env.NY_SENATE_API_KEY){
 if(!apiKey)throw Error('NY_SENATE_API_KEY is not available; use the existing approved secret environment without pasting the key');
 const output=validateOutput(directory);fs.mkdirSync(output);
 const sources=JSON.parse(fs.readFileSync(path.join(here,'candidate-sources.json'),'utf8'));const documents=[];
 for(const reference of sources){
  if(documents.length)await new Promise(resolve=>setTimeout(resolve,550));
  documents.push(await fetchCandidateDocument(reference,apiKey));
 }
 const candidate={status:'candidate_only_requires_comparison_not_importable_manifest',documents};
 fs.writeFileSync(path.join(output,'api-candidate.json'),JSON.stringify(candidate,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({candidateDocuments:documents.length,output:path.join(output,'api-candidate.json'),activeArtifactsChanged:false}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 collect(process.argv[2]??'').catch(error=>{console.error(error.message);process.exitCode=1;});
}
