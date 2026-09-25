"""Offline, hash-verified acquisition for the full existing selectable catalog.

Run coverage.ts first. Never fetches, publishes, selects a version, or extracts paths.
"""
import hashlib
import importlib.util
import json
from pathlib import Path
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
spec = importlib.util.spec_from_file_location('california_bulk', HERE / 'extract-bulk.py')
bulk = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bulk)


def main():
    output = ROOT / 'scripts/data-review/output'
    coverage = json.loads((output / 'california-catalog-coverage.json').read_text())
    review = json.loads((output / 'california-batch-one-review.json').read_text())
    receipt = json.loads((ROOT / '.cache/california-bulk/archive-receipt.json').read_text())
    archive = ROOT / '.cache/california-bulk/pubinfo_2025.zip'
    if receipt['sha256'] != review['archive']['sha256'] or archive.stat().st_size != receipt['bytes'] or bulk.sha256_file(archive) != receipt['sha256']:
        raise ValueError('Archive differs from reviewed acquisition receipt')
    requests = [row for row in coverage['sourceRequests'] if f"{row['lawCode']}:{row['section']}" not in review['documents']]
    records = bulk.extract(archive, requests)
    missing = [f"{row['lawCode']}:{row['section']}" for row in records if not row['versions']]
    if missing:
        raise ValueError(f'Missing catalog sections; no complete artifact written: {missing}')
    documents = {}
    for row in records:
        key = f"{row['lawCode']}:{row['section']}"
        for version in row['versions']:
            version.pop('transUid', None)
            version['sourceUrl'] = f"https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode={row['lawCode']}&sectionNum={row['section']}."
        documents[key] = row['versions']
    # Count the statute table's sections, NOT offenses. This gives a discovery
    # starting point across every code rather than pretending the catalog is law.
    counts = {}
    digest = hashlib.sha256()
    with zipfile.ZipFile(archive) as source:
        with source.open('LAW_SECTION_TBL.dat') as table:
            for raw in table:
                digest.update(raw)
                row = bulk.parse_row(raw.decode('utf-8'))
                if not row['lawCode'] or not row['section']:
                    raise ValueError('Statute row has no code/section identity')
                count = counts.setdefault(row['lawCode'], {'sections': set(), 'versions': 0})
                count['sections'].add(row['section'].removesuffix('.'))
                count['versions'] += 1
    universe = [{'lawCode': key, 'distinctSections': len(value['sections']), 'versionRows': value['versions']} for key, value in sorted(counts.items())]
    report = {
        'schemaVersion': 1, 'scope': 'catalog_source_acquisition_not_legal_verification',
        'archive': receipt, 'tableSha256': digest.hexdigest(),
        'statutoryUniverse': universe,
        'limits': [
            'Section and version counts include noncriminal law, future law, and other provisions. They are not an offense denominator.',
            'No criminal-offense classifier, completeness conclusion, current-version selection, or publication decision is made.',
            'Catalog requests cover declared primary sources only. Sentencing, exceptions, definitions, and case-law dependencies still require review.',
            'The archive date is preserved; this offline extraction does not refresh the law.',
        ],
        'documents': documents,
    }
    destination = output / 'california-catalog-source-expansion.json'
    temporary = destination.with_suffix('.json.tmp')
    temporary.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(destination)
    print(json.dumps({'additionalSections': len(documents), 'additionalVersions': sum(len(v) for v in documents.values()), 'lawCodes': len(universe), 'statutorySectionsNotOffenses': sum(row['distinctSections'] for row in universe)}))


if __name__ == '__main__':
    main()
