"""Retain complete homicide/gang families; compare body headings to chapter contents."""
import hashlib
import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
PLAN = Path(__file__).with_name('major-omission-plan.json')
spec = importlib.util.spec_from_file_location('family_parser', Path(__file__).with_name('extract-people-weapons-benchmark.py'))
parser = importlib.util.module_from_spec(spec)
spec.loader.exec_module(parser)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def check_contents(expected, extracted, text):
    # Single reserved numbers (762), like reserved ranges, are not instructions.
    entries = re.findall(r'(?m)^(\d{3,4}[A-Z]?)\.\s+([^\n]+)', text)
    actual = [identity for identity, title in entries if not title.startswith('Reserved for Future Use')]
    if expected != extracted or expected != actual:
        raise ValueError('Instruction inventory differs from plan or chapter contents')

def extract(doc, plan):
    pages, contents, instructions = [], [], []
    for family in plan['families']:
        starts = []
        for n in range(family['firstPage'], family['lastPage'] + 1):
            text = doc[n-1].get_text()
            pages.append(dict(page=n, text=text, sha256=digest(text.encode())))
            heading = parser.instruction_heading(doc[n-1].get_text('dict')['blocks'])
            if heading:
                starts.append(dict(id=heading[0], heading=heading[1], firstPage=n, family=family['id']))
        toc = []
        for n in range(family['tocFirstPage'], family['tocLastPage'] + 1):
            text = doc[n-1].get_text()
            toc.append(dict(page=n, text=text, sha256=digest(text.encode())))
        check_contents(family['instructionIds'], [s['id'] for s in starts], '\n'.join(p['text'] for p in toc))
        contents.extend(toc)
        for i, row in enumerate(starts):
            expected = next(r for r in plan['instructions'] if r['id'] == row['id'])
            if expected != row:
                raise ValueError('Heading or start boundary differs from reviewed plan')
            row['lastPage'] = starts[i+1]['firstPage']-1 if i+1 < len(starts) else family['lastPage']
            row['pageHashes'] = [dict(page=p['page'], sha256=p['sha256']) for p in pages if row['firstPage'] <= p['page'] <= row['lastPage']]
            instructions.append(row)
    comparisons = []
    for n in plan['comparisonContentsPages']:
        text = doc[n-1].get_text()
        comparisons.append(dict(page=n, text=text, sha256=digest(text.encode())))
    return dict(instructions=instructions, pages=pages, contentsPages=contents, comparisonContentsPages=comparisons)

def main():
    import fitz
    receipt = json.loads((ROOT/'.cache/california-bulk/calcrim-2026-receipt.json').read_text())
    prior = json.loads((ROOT/'scripts/data-review/output/california-people-weapons-benchmark-source.json').read_text())
    data = (ROOT/'.cache/california-bulk/calcrim-2026.pdf').read_bytes()
    if receipt != prior['receipt'] or len(data) != receipt['bytes'] or digest(data) != receipt['sha256']:
        raise ValueError('Unbound official PDF or receipt')
    doc = fitz.open(stream=data, filetype='pdf')
    if len(doc) != receipt['pdfPages']:
        raise ValueError('PDF page count changed')
    packet = dict(schemaVersion=1, scope='major_omission_benchmark_not_publication', receipt=receipt,
                  planSha256=digest(PLAN.read_bytes()), **extract(doc, json.loads(PLAN.read_text())))
    (ROOT/'scripts/data-review/output/california-major-omission-benchmark.json').write_text(json.dumps(packet, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(instructions=len(packet['instructions']), pages=len(packet['pages']))))

if __name__ == '__main__':
    main()
