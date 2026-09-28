"""Promote only dependencies used by the vehicle identification and duties publication batch."""
import importlib.util
import json
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
spec=importlib.util.spec_from_file_location('r',HERE/'refresh-retained.py')
r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)

def main():
    path=r.OUTPUT/'california-vehicle-identification-acquisition.json'
    prior=r.retained_documents(names=[n for n in r.RETAINED if n!=path.name])
    definitions=json.loads((ROOT/'shared/california-vehicle-identification-additions.json').read_text())
    required=set()
    for a in definitions:required.update([a['lawCode']+':'+a['code'].split('(')[0],*a['supportingKeys']])
    research=json.loads((r.OUTPUT/'california-driving-vessels-acquisition.json').read_text())
    cache=ROOT/'.cache/california-bulk';receipt=json.loads((cache/'archive-receipt.json').read_text());archive=cache/'pubinfo_2025.zip'
    if receipt['sha256']!=r.BASELINE_SHA or archive.stat().st_size!=receipt['bytes'] or r.bulk.sha256_file(archive)!=receipt['sha256']:raise ValueError('Archive provenance changed')
    documents={}
    research_documents={}
    missing_research=[]
    probes={"VEH:10853","BPC:25503.16","HSC:113785"}
    for row in r.bulk.extract(archive,[dict(lawCode=k.split(':')[0],section=k.split(':')[1]) for k in sorted((required-set(prior))|probes)]):
        key=row['lawCode']+':'+row['section']
        if not row['versions']:
            if key=='HSC:113785':
                missing_research.append(key);continue
            raise ValueError('Publication dependency absent: '+key)
        for v in row['versions']:
            v.pop('transUid',None)
            v['sourceUrl']=f"https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode={row['lawCode']}&sectionNum={row['section']}."
        if key in research['documents'] and r.version_digest(row['versions'])!=r.version_digest(research['documents'][key]):raise ValueError('Research source changed')
        if key in probes:research_documents[key]=row['versions']
        else:documents[key]=row['versions']
    r.atomic_json(path,dict(schemaVersion=1,scope='vehicle_identification_publication_dependency_acquisition',archive=receipt,requiredKeys=sorted(required),reusedKeys=sorted(required&set(prior)),promotedResearchKeys=sorted(set(documents)&set(research['documents'])),documents=documents,researchDocuments=research_documents,missingResearchKeys=missing_research))
    print(json.dumps(dict(required=len(required),reused=len(required&set(prior)),newlyPinned=len(documents),promoted=len(set(documents)&set(research['documents'])))))

if __name__=='__main__':main()
