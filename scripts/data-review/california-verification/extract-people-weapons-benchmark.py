"""Retain five complete CALCRIM families, checking each against its printed contents."""
import hashlib
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
PLAN = Path(__file__).with_name('people-weapons-plan.json')
def digest(data):
    return hashlib.sha256(data).hexdigest()
def instruction_heading(blocks):
    identity, parts = None, []
    for block in blocks:
        for line in block.get('lines', []):
            spans = [s for s in line['spans'] if s['text'].strip()]
            text = ''.join(s['text'] for s in line['spans'])
            title = spans and all(s['font'] == 'Helvetica-Bold' and 10 <= s['size'] <= 12 for s in spans)
            if identity:
                if not title:
                    return identity, re.sub(r'\s+', ' ', ' '.join(parts)).strip()
                parts.append(text)
            elif title and line['bbox'][1] < 160:
                match = re.match(r'^(\d{3,4}[A-Z]?)\.\s', text)
                if match:
                    identity = match[1]
                    parts.append(text)
    return (identity, re.sub(r'\s+', ' ', ' '.join(parts)).strip()) if identity else None

def check_inventory(expected, extracted, toc):
    if extracted != expected or re.findall(r'(?m)^(\d{3,4}[A-Z]?)\.\s', toc) != expected:
        raise ValueError('Instruction inventory differs from plan or printed contents')

def main():
    import fitz
    plan = json.loads(PLAN.read_text())
    cache = ROOT / '.cache/california-bulk'
    receipt = json.loads((cache / 'calcrim-2026-receipt.json').read_text())
    pdf = (cache / 'calcrim-2026.pdf').read_bytes()
    if receipt['sourceUrl'] != 'https://courts.ca.gov/system/files/file/calcrim-2026.pdf' or len(pdf) != receipt['bytes'] or digest(pdf) != receipt['sha256']:
        raise ValueError('Unbound official PDF')
    doc = fitz.open(stream=pdf, filetype='pdf')
    if len(doc) != receipt['pdfPages']:
        raise ValueError('PDF page count changed')
    pages, rows, contents = [], [], []
    for family in plan['families']:
        starts = []
        for page in range(family['firstPage'], family['lastPage'] + 1):
            text = doc[page-1].get_text()
            pages.append(dict(page=page, text=text, sha256=digest(text.encode())))
            heading = instruction_heading(doc[page-1].get_text('dict')['blocks'])
            if heading:
                starts.append(dict(id=heading[0], heading=heading[1], firstPage=page, family=family['id']))
        toc_pages = [dict(page=p, text=doc[p-1].get_text()) for p in range(family['tocFirstPage'], family['tocLastPage']+1)]
        for p in toc_pages:
            p['sha256'] = digest(p['text'].encode())
        check_inventory(family['instructionIds'], [s['id'] for s in starts], '\n'.join(p['text'] for p in toc_pages))
        contents.extend(toc_pages)
        for i, row in enumerate(starts):
            expected = next(r for r in plan['instructions'] if r['id'] == row['id'])
            if expected['heading'] != row['heading'] or expected['firstPage'] != row['firstPage']:
                raise ValueError('Heading or boundary changed')
            row['lastPage'] = starts[i+1]['firstPage']-1 if i+1 < len(starts) else family['lastPage']
            row['pageHashes'] = [dict(page=p['page'], sha256=p['sha256']) for p in pages if row['firstPage'] <= p['page'] <= row['lastPage']]
            rows.append(row)
    output = dict(schemaVersion=1, scope='people_weapons_benchmark_not_legal_certification', receipt=receipt,
                  planSha256=digest(PLAN.read_bytes()), instructions=rows, pages=pages, contentsPages=contents)
    (ROOT/'scripts/data-review/output/california-people-weapons-benchmark-source.json').write_text(json.dumps(output, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(instructions=len(rows), pages=len(pages), contentsPages=len(contents))))
if __name__ == '__main__':
    main()
