"""Retain an independent, bounded drug-instruction benchmark, never a penalty source.

Replay requires the official PDF and its original acquisition receipt in the cache.
PyMuPDF is needed only for extraction; committed evidence and parser tests work offline.
"""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
FIRST, LAST = 1589, 1712
EXPECTED = ['2300','2301','2302','2303','2304','2305','2306','2307','2315','2316','2320','2321','2330','2331','2335','2336','2337','2338','2350','2351','2352','2361','2363','2364','2370','2375','2376','2380','2381','2382','2383','2384','2390','2391','2392','2393','2400','2401','2410','2412','2413','2430','2431','2432','2440','2441']

def digest(data):
    return hashlib.sha256(data).hexdigest()

def extract_instructions(pages):
    starts = []
    for number, text in pages:
        for match in re.finditer(r'(?m)^(2[34]\d\d)\.\s', text):
            starts.append((match.group(1), number, match.start()))
    if [s[0] for s in starts] != EXPECTED:
        raise ValueError('Instruction inventory changed: review edition/page boundaries')
    by_page = dict(pages)
    if sorted(by_page) != list(range(FIRST, LAST + 1)):
        raise ValueError('Incomplete benchmark pages')
    rows = []
    for i, (identity, page, offset) in enumerate(starts):
        end = starts[i+1][1] - 1 if i+1 < len(starts) else LAST
        if offset > 100 or end < page:
            raise ValueError('Unexpected instruction boundary')
        title = re.sub(r'\s+', ' ', by_page[page][offset:].split('\n\n')[0]).strip()
        rows.append(dict(id=identity, firstPage=page, lastPage=end, heading=title[:550],
                         pageHashes=[dict(page=p, sha256=digest(by_page[p].encode())) for p in range(page,end+1)]))
    return rows

def main():
    import fitz
    cache = ROOT / '.cache/california-bulk'
    receipt = json.loads((cache/'calcrim-2026-receipt.json').read_text())
    pdf = (cache/'calcrim-2026.pdf').read_bytes()
    if receipt['sourceUrl'] != 'https://courts.ca.gov/system/files/file/calcrim-2026.pdf' or len(pdf) != receipt['bytes'] or digest(pdf) != receipt['sha256']:
        raise ValueError('Unbound official PDF')
    doc = fitz.open(stream=pdf, filetype='pdf')
    if len(doc) != receipt['pdfPages']:
        raise ValueError('Page count changed')
    pages = [(p, doc[p-1].get_text()) for p in range(FIRST,LAST+1)]
    output = dict(schemaVersion=1, scope='2026_calcrim_drug_chapter_independent_miss_detection_not_statutory_certification',
                  receipt=receipt, limits=['Instructions are not all offenses or filing-frequency evidence.',
                  'Statutes control current elements and penalties. An instruction may reference absent or outdated law.',
                  'This retains the February 2026 edition drug chapter only, not a review of every later supplement.'],
                  instructions=extract_instructions(pages),
                  pages=[dict(page=p,text=t,sha256=digest(t.encode())) for p,t in pages])
    (ROOT/'scripts/data-review/output/california-controlled-substances-benchmark-source.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(instructions=len(output['instructions']),pages=len(pages))))

if __name__ == '__main__':
    main()
