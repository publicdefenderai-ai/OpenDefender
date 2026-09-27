"""Acquire the fixed four-group batch plus addition dependencies from the retained archive.

Offline replay preserves every version and checks the existing acquisition receipt.
It supplies research text, not publication approval or a refreshed currentness date.
"""
import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
spec = importlib.util.spec_from_file_location('bulk', HERE / 'extract-bulk.py')
bulk = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bulk)
BATCH_IDS = [
    'PEN:division=-/title=8./part=1./chapter=1.',
    'PEN:division=-/title=8./part=1./chapter=9.',
    'PEN:division=-/title=13./part=1./chapter=4.',
    'PEN:division=-/title=13./part=1./chapter=5.',
]
RETAINED = ['california-batch-one-review.json', 'california-batch-two-review.json',
            'california-batch-three-review.json', 'california-batch-four-review.json',
            'california-batch-five-review.json', 'california-batch-six-review.json',
            'california-catalog-source-expansion.json']


def main():
    output = ROOT / 'scripts/data-review/output'
    batches_path = output / 'california-statewide/review-batches.json'
    batches = json.loads(batches_path.read_text())
    keys = sorted({key for batch in batches if batch['id'] in BATCH_IDS for key in batch['sectionKeys']})
    if len(keys) != 142:
        raise ValueError('The fixed discovery batch changed; review scope before regeneration')
    additions = json.loads((ROOT / 'shared/california-person-property-additions.json').read_text())
    required = set(keys) | {key for row in additions for key in row['supportingKeys']}
    retained = {}
    for name in RETAINED:
        for key, versions in json.loads((output / name).read_text())['documents'].items():
            if key in retained and retained[key] != versions:
                raise ValueError('Conflicting retained source: ' + key)
            retained[key] = versions
    receipt = json.loads((ROOT / '.cache/california-bulk/archive-receipt.json').read_text())
    archive = ROOT / '.cache/california-bulk/pubinfo_2025.zip'
    discovery = json.loads((output / 'california-statewide/summary.json').read_text())
    if receipt['sha256'] != discovery['archive']['sha256'] or archive.stat().st_size != receipt['bytes'] or bulk.sha256_file(archive) != receipt['sha256']:
        raise ValueError('Archive does not match discovery provenance')
    requested = [{'lawCode': key.split(':')[0], 'section': key.split(':')[1]} for key in sorted(required - set(retained))]
    documents = {}
    for row in bulk.extract(archive, requested):
        key = row['lawCode'] + ':' + row['section']
        if not row['versions']:
            raise ValueError('Required section absent: ' + key)
        for version in row['versions']:
            version.pop('transUid', None)
            version['sourceUrl'] = f"https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode={row['lawCode']}&sectionNum={row['section']}."
        documents[key] = row['versions']
    result = dict(schemaVersion=1, scope='person_property_acquisition_not_publication_approval',
                  archive=receipt, batchIds=BATCH_IDS, batchManifestSha256=bulk.sha256_file(batches_path),
                  candidateKeys=keys, reusedKeys=sorted(required & set(retained)), documents=documents)
    (output / 'california-person-property-acquisition.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({'candidateSections': len(keys), 'reusedSections': len(result['reusedKeys']), 'newSections': len(documents), 'newVersions': sum(len(v) for v in documents.values())}))


if __name__ == '__main__': main()
