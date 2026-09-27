"""Replay only missing dependencies for the next batch; never refresh source dates."""
import importlib.util
import json
from pathlib import Path
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
spec = importlib.util.spec_from_file_location('previous', HERE / 'acquire-person-property.py')
previous = importlib.util.module_from_spec(spec)
spec.loader.exec_module(previous)
bulk = previous.bulk


def main():
    output = ROOT / 'scripts/data-review/output'
    additions = json.loads((ROOT / 'shared/california-protected-person-additions.json').read_text())
    previous_review = output / 'california-forgery-theft-review.json'
    candidate_keys = [row['key'] for row in json.loads(previous_review.read_text())['sections'] if row['status'] == 'substantive_research_open']
    candidate_keys = sorted(set(candidate_keys) | {'PEN:241', 'PEN:243'})
    if len(candidate_keys) != 61:
        raise ValueError('Previous open queue changed')
    required = set(candidate_keys) | {key for row in additions for key in row['supportingKeys']}
    retained = {}
    for name in previous.RETAINED + ['california-person-property-acquisition.json', 'california-forgery-theft-acquisition.json']:
        for key, versions in json.loads((output / name).read_text())['documents'].items():
            if key in retained and retained[key] != versions:
                raise ValueError('Conflicting retained evidence: ' + key)
            retained[key] = versions
    receipt = json.loads((ROOT / '.cache/california-bulk/archive-receipt.json').read_text())
    archive = ROOT / '.cache/california-bulk/pubinfo_2025.zip'
    if receipt['sha256'] != json.loads(previous_review.read_text())['archiveSha256'] or archive.stat().st_size != receipt['bytes'] or bulk.sha256_file(archive) != receipt['sha256']:
        raise ValueError('Archive provenance changed')
    requested = [dict(lawCode=key.split(':')[0], section=key.split(':')[1]) for key in sorted(required - set(retained))]
    documents = {}
    for row in bulk.extract(archive, requested):
        if not row['versions']:
            raise ValueError('Required source absent')
        for v in row['versions']:
            v.pop('transUid', None)
            v['sourceUrl'] = f"https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode={row['lawCode']}&sectionNum={row['section']}."
        documents[row['lawCode'] + ':' + row['section']] = row['versions']
    result = dict(schemaVersion=1, scope='protected_person_dependency_acquisition_not_publication', archive=receipt,
                  previousReviewSha256=bulk.sha256_file(previous_review), candidateKeys=candidate_keys,
                  reusedKeys=sorted(required & set(retained)), documents=documents)
    (output / 'california-protected-person-acquisition.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(candidateSections=len(candidate_keys), reusedSections=len(result['reusedKeys']), newSections=len(documents), newVersions=sum(map(len, documents.values())))))

if __name__ == '__main__':
    main()
