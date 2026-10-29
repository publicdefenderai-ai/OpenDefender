"""Retain both pending weapons dependency families in one offline archive pass.

No publication pins, runtime receipts or catalog files are written. Ranges identify
research scope, not a finding that every exception or legal dependency is resolved.
"""
import importlib.util
import json
from decimal import Decimal, InvalidOperation
from pathlib import Path
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
spec = importlib.util.spec_from_file_location('refresh', HERE/'refresh-retained.py')
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)


def range_keys(archive, ranges):
    bounds = []
    for item in ranges:
        first, last = Decimal(item['first']), Decimal(item['last'])
        if not first.is_finite() or not last.is_finite() or first > last:
            raise ValueError('Invalid research range')
        bounds.append((item['lawCode'], first, last))
    found = set()
    with zipfile.ZipFile(archive) as source:
        if len(source.namelist()) != len(set(source.namelist())):
            raise ValueError('Duplicate archive members')
        with source.open('LAW_SECTION_TBL.dat') as table:
            for raw in table:
                row = r.bulk.parse_row(raw.decode('utf-8'))
                section = (row['section'] or '').removesuffix('.')
                try:
                    number = Decimal(section)
                except InvalidOperation:
                    continue
                if number.is_finite() and any(row['lawCode'] == law and first <= number <= last for law, first, last in bounds):
                    found.add(row['lawCode'] + ':' + section)
    return sorted(found)


def checked_archive(path, receipt, expected=None):
    if (expected and receipt['sha256'] != expected) or path.stat().st_size != receipt['bytes'] or r.bulk.sha256_file(path) != receipt['sha256']:
        raise ValueError('Archive provenance changed: ' + path.name)


def extract_keys(archive, keys):
    docs, missing = {}, []
    for row in r.bulk.extract(archive, [dict(lawCode=k.split(':')[0], section=k.split(':')[1]) for k in sorted(keys)]):
        key = row['lawCode'] + ':' + row['section']
        if not row['versions']:
            missing.append(key)
            continue
        for version in row['versions']:
            version.pop('transUid', None)
            version['sourceUrl'] = f"https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode={row['lawCode']}&sectionNum={row['section']}."
        docs[key] = row['versions']
    return docs, missing


def main():
    plan_path = HERE/'weapons-dependencies-plan.json'
    plan = json.loads(plan_path.read_text())
    cache = ROOT/'.cache/california-bulk'
    archive, candidate_archive = cache/'pubinfo_2025.zip', cache/'refresh-candidate/archive.zip'
    receipt = json.loads((cache/'archive-receipt.json').read_text())
    candidate = json.loads((cache/'refresh-candidate/archive-receipt.json').read_text())
    checked_archive(archive, receipt, r.BASELINE_SHA)
    checked_archive(candidate_archive, candidate)
    baseline_ranges = range_keys(archive, plan['ranges'])
    candidate_ranges = range_keys(candidate_archive, plan['ranges'])
    required = sorted(set(plan['explicitKeys']) | set(baseline_ranges) | set(candidate_ranges))
    prior = r.retained_documents(names=plan['retainedArtifacts'])
    # Named reuse providers are historical; apply the separately approved successor
    # explicitly rather than reverting PEN:30515 to the older research snapshot.
    approval_path = r.OUTPUT/'california-attorney-source-approval.json'
    approval = json.loads(approval_path.read_text())
    if approval['key'] != 'PEN:30515' or approval['previousPin'] != dict(hash=r.version_digest(prior['PEN:30515']), versions=len(prior['PEN:30515'])):
        raise ValueError('Approved successor does not bind the retained predecessor')
    if set(approval['documents']) != {'PEN:30515'} or not any(v['versionId'] == approval['operativeVersionId'] for v in approval['documents']['PEN:30515']):
        raise ValueError('Approved successor identity mismatch')
    prior['PEN:30515'] = approval['documents']['PEN:30515']
    reused = {key: prior[key] for key in required if key in prior}
    documents, missing = extract_keys(archive, set(required)-set(reused))
    observed, candidate_missing = extract_keys(candidate_archive, required)
    expected = {**reused, **documents}
    comparison = r.compare_versions(expected, observed)
    result = dict(schemaVersion=1, scope=plan['scope'], archive=receipt,
                  planSha256=r.bulk.sha256_file(plan_path),
                  approvedSuccessorSha256=r.bulk.sha256_file(approval_path),
                  retainedArtifactHashes={n: r.bulk.sha256_file(r.OUTPUT/n) for n in plan['retainedArtifacts']},
                  baselineRangeKeys=baseline_ranges, candidateRangeKeys=candidate_ranges,
                  requiredKeys=required, reusedKeys=sorted(reused), missingKeys=missing,
                  candidateMissingKeys=candidate_missing, documents=documents,
                  retainedComparison=dict(receipt=candidate, sections=comparison,
                      scope='historical_comparison_not_currentness_or_approval'))
    r.atomic_json(r.OUTPUT/'california-weapons-dependencies-acquisition.json', result)
    print(json.dumps(dict(required=len(required), reused=len(reused), newlyRetained=len(documents),
                         missing=missing, candidateMissing=candidate_missing,
                         changed=[s['key'] for s in comparison if s['status'] != 'unchanged'])))


if __name__ == '__main__':
    main()
