"""Acquire combined justice/property research in one pass; freeze reuse providers."""
import importlib.util
import json
from pathlib import Path
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
spec = importlib.util.spec_from_file_location('refresh', HERE/'refresh-retained.py')
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)
def candidate_keys(plan, batches):
    by_id = {row['id']: row for row in batches}
    if any(k not in by_id for k in plan['discoveryGroupIds']):
        raise ValueError('Justice/property discovery group missing')
    return sorted(set(plan['extraKeys']).union(*(set(i['sourceKeys']) for i in plan['instructions']),
                   *(set(by_id[k]['sectionKeys']) for k in plan['discoveryGroupIds'])))
def main():
    plan_path = HERE/'justice-property-plan.json'
    plan = json.loads(plan_path.read_text())
    manifest = r.OUTPUT/'california-statewide/review-batches.json'
    required = set(candidate_keys(plan, json.loads(manifest.read_text())))
    retained = r.retained_documents(names=plan['retainedArtifacts'])
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
    result = dict(schemaVersion=1, scope='justice_property_research_not_publication', archive=receipt,
                  planSha256=r.bulk.sha256_file(plan_path), batchManifestSha256=r.bulk.sha256_file(manifest),
                  retainedArtifactHashes={n:r.bulk.sha256_file(r.OUTPUT/n) for n in plan['retainedArtifacts']},
                  candidateKeys=sorted(required), reusedKeys=sorted(required & set(retained)), missingKeys=missing, documents=documents)
    r.atomic_json(r.OUTPUT/'california-justice-property-acquisition.json', result)
    print(json.dumps(dict(candidateSections=len(required), reusedSections=len(result['reusedKeys']), newSections=len(documents), missingKeys=missing)))
if __name__ == '__main__':
    main()
