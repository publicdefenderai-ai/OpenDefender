"""Replay public holding excerpts against local official PDFs; no network or database.
Usage: python3 scripts/data-review/florida-sexual-injunction/verify-judicial-pdfs.py DIRECTORY
Requires PyMuPDF. DIRECTORY contains kennedy.pdf and graham.pdf from the recorded URLs.
"""
import hashlib
import json
from pathlib import Path
import re
import sys
import fitz

root = Path(__file__).resolve().parents[3]
rows = json.loads((root / 'shared/florida-reviewed-data/judicial-authorities.json').read_text())
for row in rows:
    path = Path(sys.argv[1]) / (row['id'] + '.pdf')
    if hashlib.sha256(path.read_bytes()).hexdigest() != row['pdfSha256']:
        raise ValueError(f"Official PDF identity differs: {row['id']}")
    with fitz.open(path) as document:
        text = document[row['pdfPage'] - 1].get_text()
    text = re.sub(r'\s+', ' ', text.replace('\xad\n', '').replace('\xad', '')).strip()
    if hashlib.sha256(text.encode()).hexdigest() != row['pageTextSha256']:
        raise ValueError(f"Extracted page differs: {row['id']}")
    excerpt = text[row['pageStart']:row['pageEnd']]
    if excerpt != row['text'] or hashlib.sha256(excerpt.encode()).hexdigest() != row['contentHash']:
        raise ValueError(f"Holding excerpt differs: {row['id']}")
print(f"Verified {len(rows)} official PDF identities, pages and holding spans")
