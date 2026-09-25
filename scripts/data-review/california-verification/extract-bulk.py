"""Offline extraction from the official PUBINFO session archive. Never publishes charges.

Run after baseline.ts and after downloading the archive with archive-receipt.json.
Retains ALL matching source versions; active flags and dates are not legal approval.
"""
import hashlib
import json
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[3]
COLUMNS = "id lawCode section opStatutes opChapter opSection effectiveDate versionId division title part chapter article history contentMember activeFlag transUid transUpdate".split()


def decode_field(value):
    if value in (r"\N", "NULL"):
        return None
    if value.startswith('`') and value.endswith('`'):
        value = value[1:-1]
    escapes = {'0': '\0', 'b': '\b', 'n': '\n', 'r': '\r', 't': '\t', 'Z': '\x1a', '\\': '\\', '`': '`', '"': '"', "'": "'"}
    def replace(match):
        char = match.group(1)
        if char not in escapes:
            raise ValueError(f"Unsupported source escape: {char!r}")
        return escapes[char]
    return re.sub(r"\\(.)", replace, value)


def parse_row(line):
    cells = line.rstrip('\r\n').split('\t')
    if len(cells) != len(COLUMNS):
        raise ValueError(f"LAW_SECTION_TBL schema mismatch: {len(cells)} columns")
    return dict(zip(COLUMNS, map(decode_field, cells)))


def sha256_file(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        while chunk := stream.read(4 * 1024 * 1024):
            digest.update(chunk)
    return digest.hexdigest()


def extract(archive, requests):
    wanted = {(r['lawCode'], r['section']) for r in requests}
    matches = {key: [] for key in wanted}
    with zipfile.ZipFile(archive) as source:
        names = source.namelist()
        if len(set(names)) != len(names):
            raise ValueError('Duplicate archive members')
        # Read named members only, never extract archive paths onto the filesystem.
        with source.open('LAW_SECTION_TBL.dat') as table:
            for line_no, raw in enumerate(table, 1):
                row = parse_row(raw.decode('utf-8'))
                key = (row['lawCode'], (row['section'] or '').removesuffix('.'))
                if key not in wanted:
                    continue
                member = row['contentMember']
                if not member or not re.fullmatch(r'LAW_SECTION_TBL_[0-9]+\.lob', member):
                    raise ValueError(f'Unexpected content member at row {line_no}')
                content = source.read(member)
                if not content.strip():
                    raise ValueError(f'Empty statutory content at row {line_no}')
                matches[key].append({
                    **row, 'tableRow': line_no,
                    'tableRowSha256': hashlib.sha256(raw).hexdigest(),
                    'contentSha256': hashlib.sha256(content).hexdigest(),
                    'contentXml': content.decode('utf-8'),
                })
    return [{'lawCode': law, 'section': section, 'versions': matches[(law, section)]}
            for law, section in sorted(wanted)]


def main():
    cache = ROOT / '.cache/california-bulk'
    archive = cache / 'pubinfo_2025.zip'
    receipt = json.loads((cache / 'archive-receipt.json').read_text())
    if archive.stat().st_size != receipt['bytes'] or sha256_file(archive) != receipt['sha256']:
        raise ValueError('Archive differs from acquisition receipt')
    baseline = json.loads((ROOT / 'scripts/data-review/output/california-batch-one-baseline.json').read_text())
    records = extract(archive, baseline['sourceRequests'])
    missing = [f"{r['lawCode']}:{r['section']}" for r in records if not r['versions']]
    evidence = {'archive': receipt, 'scope': 'Acquired source versions only; currentness, applicability, and publication remain unverified', 'records': records}
    (cache / 'batch-one-source-versions.json').write_text(json.dumps(evidence, indent=2) + '\n')
    summary = {
        'schemaVersion': 1, 'archive': receipt,
        'scope': evidence['scope'], 'requestedSections': len(records),
        'matchedSections': len(records) - len(missing), 'missingSections': missing,
        'sections': [{**r, 'versions': [{k: v for k, v in version.items() if k not in ('contentXml', 'transUid')} for version in r['versions']]} for r in records],
    }
    target = ROOT / 'scripts/data-review/output/california-batch-one-acquisition.json'
    target.write_text(json.dumps(summary, indent=2) + '\n')
    print(json.dumps({k: v for k, v in summary.items() if k != 'sections'}))
    if missing:
        raise SystemExit('Missing sections recorded; do not treat extraction as complete')


if __name__ == '__main__':
    main()
