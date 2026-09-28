"""Retain the full 2026 CALCRIM vehicle chapter; no statutory publication approval."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
FIRST, LAST = 1481, 1583
EXPECTED = ['2100','2101','2102','2110','2111','2112','2113','2114','2125','2126','2130','2131','2140','2141','2142','2150','2151','2160','2180','2181','2182','2200','2201','2202','2220','2221','2222','2240','2241','2242']

def digest(data):
    return hashlib.sha256(data).hexdigest()

def extract_instructions(pages):
    if [p for p, _ in pages] != list(range(FIRST, LAST + 1)):
        raise ValueError('Incomplete or unordered vehicle benchmark pages')
    starts = []
    for page, text in pages:
        matches = list(re.finditer(r'(?m)^(2[12]\d\d)\.\s', text))
        for match in matches:
            if match.start() > 100:
                raise ValueError('Unexpected instruction boundary')
            starts.append((match.group(1), page, match.start()))
    if [r[0] for r in starts] != EXPECTED:
        raise ValueError('Vehicle instruction inventory changed')
    texts = dict(pages)
    rows = []
    for i, (identity, first, offset) in enumerate(starts):
        last = starts[i + 1][1] - 1 if i + 1 < len(starts) else LAST
        heading = re.sub(r'\s+', ' ', texts[first][offset:].split('The defendant')[0].split('If you')[0].split('The People')[0].split('The law')[0].split('The crime')[0].split('[A driver')[0]).strip()
        # Headings precede the instruction body, and are retained without correcting citations.
        rows.append(dict(id=identity, firstPage=first, lastPage=last, heading=heading,
                         pageHashes=[dict(page=p, sha256=digest(texts[p].encode())) for p in range(first, last + 1)]))
    return rows

def main():
    import fitz
    cache = ROOT / '.cache/california-bulk'
    receipt = json.loads((cache / 'calcrim-2026-receipt.json').read_text())
    pdf = (cache / 'calcrim-2026.pdf').read_bytes()
    if receipt['sourceUrl'] != 'https://courts.ca.gov/system/files/file/calcrim-2026.pdf' or len(pdf) != receipt['bytes'] or digest(pdf) != receipt['sha256']:
        raise ValueError('Unbound official PDF')
    doc = fitz.open(stream=pdf, filetype='pdf')
    if len(doc) != receipt['pdfPages']:
        raise ValueError('PDF page count changed')
    pages = [(p, doc[p-1].get_text()) for p in range(FIRST, LAST + 1)]
    result = dict(schemaVersion=1, scope='vehicle_chapter_independent_miss_detection_not_statutory_certification', receipt=receipt,
                  limits=['February 2026 vehicle chapter only; later supplements not certified.',
                          'Instruction references can be incomplete or outdated. Statutes control current elements and punishment.',
                          'Not all vessel offenses or California offenses appear in these instructions.'],
                  instructions=extract_instructions(pages), pages=[dict(page=p, text=t, sha256=digest(t.encode())) for p,t in pages])
    (ROOT / 'scripts/data-review/output/california-driving-benchmark-source.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(instructions=len(result['instructions']), pages=len(pages))))

if __name__ == '__main__':
    main()
