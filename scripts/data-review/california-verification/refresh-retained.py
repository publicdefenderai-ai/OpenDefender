"""Compare all retained statutory versions without treating ZIP churn as changed law.

Candidate bytes must be freshly downloaded to a separate cache with their authentic
receipt. Offline replay preserves that time. Only unchanged retained dependencies may renew currency; changed dependencies
remain explicit runtime holds. This program cannot approve changed legal content.
"""
import argparse
import datetime as dt
import hashlib
import importlib.util
import json
from pathlib import Path
import os
import urllib.request

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
OUTPUT = ROOT / 'scripts/data-review/output'
spec = importlib.util.spec_from_file_location('bulk', HERE / 'extract-bulk.py')
bulk = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bulk)
BASELINE_SHA = 'dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'
SOURCE_URL = 'https://downloads.leginfo.legislature.ca.gov/pubinfo_2025.zip'
RETAINED = [f'california-batch-{n}-review.json' for n in ['one', 'two', 'three', 'four', 'five', 'six']] + [
    'california-catalog-source-expansion.json', 'california-person-property-acquisition.json',
    'california-forgery-theft-acquisition.json', 'california-protected-person-acquisition.json', 'california-controlled-substances-acquisition.json', 'california-drug-successor-acquisition.json', 'california-driving-publication-acquisition.json', 'california-traffic-acquisition.json', 'california-vehicle-identification-acquisition.json', 'california-violence-detention-acquisition.json', 'california-sexual-offenses-acquisition.json', 'california-registration-exploitation-acquisition.json', 'california-weapons-threats-acquisition.json', 'california-weapons-eligibility-acquisition.json']
# Member locations, table order and publisher transaction user IDs do not establish
# statutory identity. Transaction update timestamps are retained separately for
# audit; text and all legal/version/effective/active metadata remain in the digest.
IGNORED = {'contentMember', 'tableRow', 'tableRowSha256', 'transUid', 'sourceUrl', 'contentXml', 'transUpdate'}


def version_digest(versions):
    if not versions:
        raise ValueError('Missing statutory version')
    normalized = []
    for version in versions:
        if hashlib.sha256(version['contentXml'].encode()).hexdigest() != version['contentSha256']:
            raise ValueError('Unbound source text')
        normalized.append({k: v for k, v in version.items() if k not in IGNORED})
    normalized.sort(key=lambda v: json.dumps(v, sort_keys=True, ensure_ascii=False))
    return hashlib.sha256(json.dumps(normalized, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode()).hexdigest()


def retained_documents(output=OUTPUT, names=None):
    documents = {}
    for name in RETAINED if names is None else names:
        artifact = json.loads((output / name).read_text())
        if artifact.get('archiveSha256', artifact.get('archive', {}).get('sha256')) != BASELINE_SHA:
            raise ValueError('Reviewed archive binding changed: ' + name)
        for key, versions in artifact['documents'].items():
            if any(v['lawCode'] + ':' + v['section'].removesuffix('.') != key for v in versions):
                raise ValueError('Source identity mismatch: ' + key)
            digest = version_digest(versions)
            if key in documents and version_digest(documents[key]) != digest:
                raise ValueError('Conflicting retained source: ' + key)
            documents[key] = versions
    return documents


def compare_versions(retained, observed):
    rows = []
    for key in sorted(retained):
        expected_hash = version_digest(retained[key])
        versions = observed.get(key, [])
        observed_hash = version_digest(versions) if versions else None
        rows.append(dict(key=key, expectedHash=expected_hash, observedHash=observed_hash,
                         expectedVersions=len(retained[key]), observedVersions=len(versions),
                         status='unchanged' if observed_hash == expected_hash else 'changed_or_missing',
                         expectedTransactionUpdates=sorted(str(v.get('transUpdate')) for v in retained[key]),
                         observedTransactionUpdates=sorted(str(v.get('transUpdate')) for v in versions)))
    return rows


def atomic_json(path, value):
    temporary = path.with_name(path.name + '.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    os.replace(temporary, path)


def acquire_candidate(folder):
    folder.mkdir(parents=True, exist_ok=True)
    started = dt.datetime.now(dt.timezone.utc).isoformat()
    digest, size, progress = hashlib.sha256(), 0, 0
    request = urllib.request.Request(SOURCE_URL, headers={'Cache-Control': 'no-cache', 'Accept-Encoding': 'identity'})
    with urllib.request.urlopen(request, timeout=60) as response:
        if response.status != 200 or response.geturl() != SOURCE_URL:
            raise ValueError('Expected a direct HTTP 200 archive response')
        expected = int(response.headers['Content-Length'])
        if expected <= 0 or expected > 3 * 1024 ** 3:
            raise ValueError('Unexpected archive size')
        modified = response.headers.get('Last-Modified')
        with (folder / 'archive.zip.part').open('wb') as output:
            while chunk := response.read(4 * 1024 * 1024):
                size += len(chunk)
                if size > expected:
                    raise ValueError('Archive exceeds declared size')
                output.write(chunk)
                digest.update(chunk)
                if size - progress >= 128 * 1024 * 1024:
                    progress = size
                    print(f'Received {size // (1024 * 1024)} MiB', flush=True)
    if size != expected:
        raise ValueError('Incomplete archive download')
    os.replace(folder / 'archive.zip.part', folder / 'archive.zip')
    atomic_json(folder / 'archive-receipt.json', dict(sourceUrl=SOURCE_URL, retrievedAt=started,
                lastModified=modified, bytes=size, sha256=digest.hexdigest()))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--candidate', type=Path, default=ROOT / '.cache/california-bulk/refresh-candidate')
    parser.add_argument('--activate-unchanged', action='store_true')
    parser.add_argument('--acquire', action='store_true')
    args = parser.parse_args()
    if args.acquire:
        atomic_json(OUTPUT / 'california-archive-refresh-receipt.json', dict(schemaVersion=1,
                    status='unverified', method='retained_section_comparison', attemptedAt=dt.datetime.now(dt.timezone.utc).isoformat()))
        acquire_candidate(args.candidate)
    documents = retained_documents()
    pins = json.loads((ROOT / 'shared/california-retained-pins.json').read_text())
    expected_pins = {k: dict(hash=version_digest(v), versions=len(v)) for k, v in sorted(documents.items())}
    if pins != expected_pins:
        raise ValueError('Retained evidence set changed: review and update the explicit pins before renewal')
    candidate = json.loads((args.candidate / 'archive-receipt.json').read_text())
    archive = args.candidate / 'archive.zip'
    checked = dt.datetime.fromisoformat(candidate['retrievedAt'])
    now = dt.datetime.now(dt.timezone.utc)
    if checked.tzinfo is None or checked > now or now - checked >= dt.timedelta(days=7):
        raise ValueError('Candidate acquisition time is invalid or stale')
    if candidate['sourceUrl'] != SOURCE_URL or archive.stat().st_size != candidate['bytes'] or bulk.sha256_file(archive) != candidate['sha256']:
        raise ValueError('Candidate archive/receipt binding failed')
    requests = [dict(lawCode=k.split(':')[0], section=k.split(':')[1]) for k in sorted(documents)]
    observed = {r['lawCode'] + ':' + r['section']: r['versions'] for r in bulk.extract(archive, requests)}
    rows = compare_versions(documents, observed)
    held = sorted(row['key'] for row in rows if row['status'] != 'unchanged')
    unchanged = not held
    report = dict(schemaVersion=1, scope='retained_statutory_versions_comparison_not_new_legal_approval',
                  baselineArchiveSha256=BASELINE_SHA, candidate=candidate, sections=rows, allUnchanged=unchanged, heldSourceKeys=held)
    atomic_json(OUTPUT / 'california-retained-refresh-comparison.json', report)
    atomic_json(OUTPUT / 'california-changed-source-evidence.json', dict(schemaVersion=1,
                scope='changed_statutory_versions_held_not_approved', candidate=candidate,
                documents={key: [{k: v for k, v in version.items() if k != 'transUid'}
                                 for version in observed.get(key, [])] for key in held}))
    print(json.dumps(dict(sections=len(rows), versions=sum(len(v) for v in documents.values()),
                         unchanged=sum(r['status'] == 'unchanged' for r in rows),
                         changedOrMissing=[r['key'] for r in rows if r['status'] != 'unchanged'])))
    if not unchanged and not args.activate_unchanged:
        atomic_json(OUTPUT / 'california-archive-refresh-receipt.json', dict(schemaVersion=1, status='changed',
                    method='retained_section_comparison', sourceUrl=SOURCE_URL, archiveSha256=BASELINE_SHA,
                    observedArchiveSha256=candidate['sha256'], attemptedAt=now.isoformat()))
        raise SystemExit('Changed dependencies remain held; this command cannot approve them')
    if args.activate_unchanged:
        baseline = json.loads((OUTPUT / RETAINED[0]).read_text())['archive']
        atomic_json(OUTPUT / 'california-archive-refresh-receipt.json', dict(schemaVersion=1, status='matched',
                    method='retained_section_comparison', sourceUrl=SOURCE_URL, archiveSha256=BASELINE_SHA,
                    archiveBytes=baseline['bytes'], observedArchiveSha256=candidate['sha256'], heldSourceKeys=held,
                    checkedAt=checked.isoformat(), expiresAt=(checked + dt.timedelta(days=7)).isoformat()))
        print(f'Activated unchanged retained versions; {len(held)} changed dependencies remain held; acquisition time preserved')

if __name__ == '__main__':
    main()
