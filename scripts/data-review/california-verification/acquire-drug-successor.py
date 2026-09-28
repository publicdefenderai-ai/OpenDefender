"""Acquire only missing dependencies for the combined drug follow-up; preserve time."""
import importlib.util
import json
from pathlib import Path
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
spec = importlib.util.spec_from_file_location('refresh', HERE/'refresh-retained.py')
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)
CANDIDATES = ['HSC:'+s for s in ['11358','11359','11360','11366.6','11366.7','11366.8','11370.6','11370.9','11379.6','11383','11383.5','11383.6','11383.7','11550']]

def main():
    path = r.OUTPUT/'california-drug-successor-acquisition.json'
    retained = r.retained_documents(names=[n for n in r.RETAINED if n != path.name])
    required = set(CANDIDATES) | {'BPC:26032'}
    definitions = ROOT/'shared/california-drug-successor-additions.json'
    if definitions.exists():
        for a in json.loads(definitions.read_text()):
            required.update(a['supportingKeys'])
    cache = ROOT/'.cache/california-bulk'
    receipt = json.loads((cache/'archive-receipt.json').read_text())
    archive = cache/'pubinfo_2025.zip'
    if receipt['sha256'] != r.BASELINE_SHA or archive.stat().st_size != receipt['bytes'] or r.bulk.sha256_file(archive) != receipt['sha256']:
        raise ValueError('Archive provenance changed')
    documents = {}
    for row in r.bulk.extract(archive, [dict(lawCode=k.split(':')[0],section=k.split(':')[1]) for k in sorted(required-set(retained))]):
        key=row['lawCode']+':'+row['section']
        if not row['versions']: raise ValueError('Missing dependency: '+key)
        for v in row['versions']:
            v.pop('transUid',None)
            v['sourceUrl']=f"https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode={row['lawCode']}&sectionNum={row['section']}."
        documents[key]=row['versions']
    r.atomic_json(path,dict(schemaVersion=1,scope='drug_successor_dependency_acquisition_not_publication',archive=receipt,candidateKeys=sorted(CANDIDATES),reusedKeys=sorted(required&set(retained)),documents=documents))
    print(json.dumps(dict(candidateSections=len(CANDIDATES),newSections=len(documents),reusedSections=len(required&set(retained)))))

if __name__=='__main__':main()
