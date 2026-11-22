/** Candidate acquisition only: reuses exact-identity validation, never an importer. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {fetchCandidateDocument,validateOutput} from '../new-york-first-pass/collect-api.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
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
