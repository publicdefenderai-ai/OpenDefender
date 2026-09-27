"""Read a section's hash-checked discovery evidence without acquiring the archive."""
import argparse
import gzip
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]


def inspect(key, directory):
    summary = json.loads((directory / 'summary.json').read_text())
    artifacts = {a['file']: a for a in summary['artifacts']}
    result = {'key': key, 'asOf': summary['asOf'], 'archive': summary['archive'],
              'warning': 'Discovery evidence only. No current-law selection, penalty assignment or publication approval.'}
    for name, label in [('section-accounting.jsonl.gz', 'accounting'), ('source-versions.jsonl.gz', 'versions')]:
        path = directory / name
        if hashlib.sha256(path.read_bytes()).hexdigest() != artifacts[name]['sha256']:
            raise ValueError(f'Artifact hash mismatch: {name}')
        with gzip.open(path, 'rt') as stream:
            result[label] = [row for line in stream if (row := json.loads(line))['key'] == key]
    if not result['accounting']:
        raise ValueError('Section key not present in the discovery snapshot')
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('key', help='Code-qualified key, for example PEN:240 or HSC:11350')
    parser.add_argument('--directory', type=Path, default=ROOT / 'scripts/data-review/output/california-statewide')
    args = parser.parse_args()
    print(json.dumps(inspect(args.key, args.directory), indent=2, ensure_ascii=False))
