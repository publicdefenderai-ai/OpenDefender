"""Retain eight complete CALCRIM families, checking each against its printed contents."""
import hashlib
import json
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
PLAN = Path(__file__).with_name('justice-property-plan.json')
def digest(data):
    return hashlib.sha256(data).hexdigest()
# Reuse the tested layout parser; this family needs explicit single-number reservations.
import importlib.util
spec = importlib.util.spec_from_file_location('people_layout', Path(__file__).with_name('extract-people-weapons-benchmark.py'))
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)
instruction_heading = layout.instruction_heading

def contents_inventory(text):
    return [m[1] for m in re.finditer(r'(?m)^(\d{3,4}[A-Z]?)\.\s+([^\n]+)', text)
            if m[2].strip() != 'Reserved for Future Use']

def check_inventory(expected, extracted, toc):
    if len(set(expected)) != len(expected) or extracted != expected or contents_inventory(toc) != expected:
        raise ValueError('Instruction inventory differs from plan or printed contents')

def source_keys(heading):
    match = re.search(r'\((Pen\. Code|Veh\. Code|Rev\. & Tax\. Code|Bus\. & Prof\. Code),?\s*§{1,2}\s*(.*)\)$', heading)
    if not match:
        if 'Code' in heading:
            raise ValueError('Unsupported instruction code reference')
        return []
    codes = {'Pen. Code':'PEN', 'Veh. Code':'VEH', 'Rev. & Tax. Code':'RTC', 'Bus. & Prof. Code':'BPC'}
    # Remove subdivisions before collecting sections: (a)(1–7) is not section 7.
    reference = re.sub(r'\([^)]*\)', '', match[2])
    return sorted({codes[match[1]]+':'+x for x in re.findall(r'\d+(?:\.\d+)*[a-z]*', reference)})

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
            if expected['heading'] != row['heading'] or expected['firstPage'] != row['firstPage'] or expected['sourceKeys'] != source_keys(row['heading']):
                raise ValueError('Heading or boundary changed')
            row['lastPage'] = starts[i+1]['firstPage']-1 if i+1 < len(starts) else family['lastPage']
            row['pageHashes'] = [dict(page=p['page'], sha256=p['sha256']) for p in pages if row['firstPage'] <= p['page'] <= row['lastPage']]
            rows.append(row)
    output = dict(schemaVersion=1, scope='justice_property_benchmark_not_legal_certification', receipt=receipt,
                  planSha256=digest(PLAN.read_bytes()), instructions=rows, pages=pages, contentsPages=contents)
    (ROOT/'scripts/data-review/output/california-justice-property-benchmark-source.json').write_text(json.dumps(output, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(instructions=len(rows), pages=len(pages), contentsPages=len(contents))))
if __name__ == '__main__':
    main()
