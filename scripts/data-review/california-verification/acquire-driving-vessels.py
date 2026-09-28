"""Acquire a combined driving/vessel research packet, not selectable charges.

Reuses publication evidence without modifying its currentness pins or expiry.
The six discovery groups are bounded candidate lists, not full-code certification.
"""
import importlib.util
import json
from pathlib import Path
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
spec = importlib.util.spec_from_file_location('refresh', HERE/'refresh-retained.py')
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)
GROUP_IDS = [
    'VEH:division=11./title=-/part=-/chapter=12.',
    'VEH:division=6./title=-/part=-/chapter=4.',
    'VEH:division=2./title=-/part=-/chapter=4.',
    'VEH:division=4./title=-/part=-/chapter=3.5.',
    'VEH:division=10./title=-/part=-/chapter=1.',
    'HNC:division=3./title=-/part=-/chapter=5.',
]
# Independent instruction references, shared sentencing/default rules, and earlier carry-forwards.
EXTRA_KEYS = ['VEH:'+s for s in ['305','12500','12951','13106','23536','23538','23540','23542','23546','23548','23550','23550.5','23552','23554','23556','23560','23562','23564','23566','23568','23572','23577','23578','23582','23600','23612','40000.1','40000.11','40000.15','40000.22','40508','42000','42001','42002']] + ['PEN:'+s for s in ['17','18','18.5','19','19.6','19.8','191.5','192','192.5','193','193.5','193.8','499','672','1170']] + ['BPC:23004']

def candidate_keys(batches):
    by_id = {row['id']: row for row in batches}
    if any(k not in by_id for k in GROUP_IDS):
        raise ValueError('Driving discovery group missing')
    return sorted(set(EXTRA_KEYS).union(*(set(by_id[k]['sectionKeys']) for k in GROUP_IDS)))

def main():
    manifest = r.OUTPUT/'california-statewide/review-batches.json'
    required = set(candidate_keys(json.loads(manifest.read_text())))
    retained = r.retained_documents()
    cache = ROOT/'.cache/california-bulk'
    receipt = json.loads((cache/'archive-receipt.json').read_text())
    archive = cache/'pubinfo_2025.zip'
    if receipt['sha256'] != r.BASELINE_SHA or archive.stat().st_size != receipt['bytes'] or r.bulk.sha256_file(archive) != receipt['sha256']:
        raise ValueError('Archive provenance changed')
    documents, missing = {}, []
    requests = [dict(lawCode=k.split(':')[0], section=k.split(':')[1]) for k in sorted(required-set(retained))]
    for row in r.bulk.extract(archive, requests):
        key = row['lawCode']+':'+row['section']
        if not row['versions']:
            missing.append(key)
            continue
        for v in row['versions']:
            v.pop('transUid', None)
            v['sourceUrl'] = f"https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode={row['lawCode']}&sectionNum={row['section']}."
        documents[key] = row['versions']
    result = dict(schemaVersion=1, scope='combined_driving_vessels_research_not_publication', archive=receipt,
                  groupIds=GROUP_IDS, batchManifestSha256=r.bulk.sha256_file(manifest), candidateKeys=sorted(required),
                  reusedKeys=sorted(required & set(retained)), missingKeys=missing, documents=documents)
    r.atomic_json(r.OUTPUT/'california-driving-vessels-acquisition.json', result)
    print(json.dumps(dict(candidateSections=len(required), reusedSections=len(result['reusedKeys']), newSections=len(documents), missingKeys=missing)))

if __name__ == '__main__':
    main()
