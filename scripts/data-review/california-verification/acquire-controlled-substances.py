"""Retain the full Chapter 6 review group and explicit dependencies, without renewing time."""
import importlib.util
import json
from pathlib import Path
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
spec = importlib.util.spec_from_file_location('refresh', HERE / 'refresh-retained.py')
refresh = importlib.util.module_from_spec(spec)
spec.loader.exec_module(refresh)
BATCH_ID = 'HSC:division=10./title=-/part=-/chapter=6.'
OUTPUT = ROOT / 'scripts/data-review/output'

def main():
    manifest = OUTPUT / 'california-statewide/review-batches.json'
    batch = next(row for row in json.loads(manifest.read_text()) if row['id'] == BATCH_ID)
    # The complete chapter permits context/exception review rather than cherry-picking signals.
    benchmark_keys = ['BPC:4326', 'HSC:11550']
    required = set(batch['sectionKeys']) | set(benchmark_keys) | {'HSC:11007', 'HSC:11018', 'HSC:11019', 'HSC:11006.5', 'HSC:11018.5'}
    definition_path = ROOT / 'shared/california-controlled-substances-additions.json'
    if definition_path.exists():
        for row in json.loads(definition_path.read_text()):
            required.update(row['supportingKeys'])
    prior_path = OUTPUT / 'california-controlled-substances-acquisition.json'
    retained = refresh.retained_documents(names=[name for name in refresh.RETAINED if name != prior_path.name])
    cache = ROOT / '.cache/california-bulk'
    receipt = json.loads((cache / 'archive-receipt.json').read_text())
    archive = cache / 'pubinfo_2025.zip'
    if receipt['sha256'] != refresh.BASELINE_SHA or archive.stat().st_size != receipt['bytes'] or refresh.bulk.sha256_file(archive) != receipt['sha256']:
        raise ValueError('Archive provenance changed')
    requests = [dict(lawCode=k.split(':')[0], section=k.split(':')[1]) for k in sorted(required-set(retained))]
    documents = {}
    missing_benchmark = []
    for row in refresh.bulk.extract(archive, requests):
        if not row['versions']:
            key = row['lawCode']+':'+row['section']
            if key in benchmark_keys and not (definition_path.exists() and any(key in a['supportingKeys'] for a in json.loads(definition_path.read_text()))):
                missing_benchmark.append(key)
                continue
            raise ValueError('Required source absent: '+key)
        for v in row['versions']:
            v.pop('transUid', None)
            v['sourceUrl'] = f"https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode={row['lawCode']}&sectionNum={row['section']}."
        documents[row['lawCode']+':'+row['section']] = row['versions']
    result = dict(schemaVersion=1, scope='controlled_substances_dependency_acquisition_not_publication', archive=receipt,
                  batchId=BATCH_ID, batchManifestSha256=refresh.bulk.sha256_file(manifest), candidateKeys=sorted(set(batch['sectionKeys']) | set(benchmark_keys)), benchmarkKeys=benchmark_keys,
                  reusedKeys=sorted(required & set(retained)), missingBenchmarkKeys=missing_benchmark, documents=documents)
    refresh.atomic_json(prior_path, result)
    print(json.dumps(dict(chapterSections=len(batch['sectionKeys']), candidateSections=len(result['candidateKeys']), reusedSections=len(result['reusedKeys']), newSections=len(documents), newVersions=sum(map(len,documents.values())))))

if __name__ == '__main__':
    main()
