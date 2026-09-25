"""Acquire the official 2025-2026 session archive once, with a source-byte receipt.

Existing complete evidence is reused without extending its acquisition timestamp.
Use --refresh explicitly to acquire a new archive. No public app pages are crawled.
"""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[3]
URL = 'https://downloads.leginfo.legislature.ca.gov/pubinfo_2025.zip'


def digest_file(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        while chunk := stream.read(4 * 1024 * 1024): digest.update(chunk)
    return digest.hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh', action='store_true')
    args = parser.parse_args()
    cache = ROOT / '.cache/california-bulk'
    cache.mkdir(parents=True, exist_ok=True)
    target = cache / 'pubinfo_2025.zip'
    receipt_path = cache / 'archive-receipt.json'
    if not args.refresh and (target.exists() or receipt_path.exists()):
        if not target.exists() or not receipt_path.exists():
            raise SystemExit('Archive/receipt pair incomplete; inspect cache and use --refresh to reacquire')
        receipt = json.loads(receipt_path.read_text())
        if receipt['sourceUrl'] != URL or target.stat().st_size != receipt['bytes'] or digest_file(target) != receipt['sha256']:
            raise SystemExit('Cached archive does not match its receipt; use --refresh to reacquire')
        print('Reused verified cached bytes; original acquisition timestamp preserved')
        return
    digest = hashlib.sha256()
    size = 0
    partial = target.with_suffix('.zip.part')
    with urllib.request.urlopen(URL, timeout=60) as response:
        if response.status != 200 or response.geturl() != URL:
            raise ValueError('Unexpected archive response or redirect')
        expected = int(response.headers['Content-Length'])
        modified = response.headers.get('Last-Modified')
        with partial.open('wb') as stream:
            while chunk := response.read(4 * 1024 * 1024):
                stream.write(chunk); digest.update(chunk); size += len(chunk)
    if size != expected:
        raise ValueError('Incomplete archive; existing completed evidence was not replaced')
    receipt = {
        'sourceUrl': URL, 'retrievedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'lastModified': modified, 'bytes': size, 'sha256': digest.hexdigest(),
        'scope': 'official session archive; legal currentness and applicability not yet verified',
    }
    temporary_receipt = receipt_path.with_suffix('.json.part')
    temporary_receipt.write_text(json.dumps(receipt, indent=2) + '\n')
    # If interrupted between replacements, hash verification rejects the mismatched pair.
    os.replace(partial, target)
    os.replace(temporary_receipt, receipt_path)
    print(json.dumps(receipt))


if __name__ == '__main__': main()
