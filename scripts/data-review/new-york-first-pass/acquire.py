"""Research-only Senate HTML acquisition; never imports or changes authority files."""
import datetime, hashlib, html.parser, json, pathlib, re, sys, time, subprocess

BENCHMARK = ['120.00','120.05','120.10','120.14','121.11','121.12','130.20','140.05','140.10','140.15','140.20','140.25','140.30','145.00','145.05','155.25','155.30','155.35','155.40','160.05','160.10','160.15','165.40','170.20','195.05','205.30','215.50','240.26']
DEPENDENCIES = ['140.00','155.00','155.05','155.15','165.55','70.15','80.05','80.00','RPA:1971-A','RPA:1971','PBH:1392']

class SenateText(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.kind = None
        self.depth = 0
        self.parts = {'title': [], 'text': []}
    def handle_starttag(self, tag, attrs):
        classes = dict(attrs).get('class', '').split()
        if self.kind:
            if tag == 'br': self.parts[self.kind].append('\n')
            elif tag not in ['img','input','meta','link','hr']: self.depth += 1
        elif 'nys-openleg-result-text' in classes or 'nys-openleg-result-title-short' in classes:
            self.kind = 'text' if 'nys-openleg-result-text' in classes else 'title'
            self.depth = 1
    def handle_endtag(self, tag):
        if tag in ['br','img','input','meta','link','hr']: return
        if self.kind:
            self.depth -= 1
            if not self.depth: self.kind = None
    def handle_data(self, data):
        if self.kind: self.parts[self.kind].append(data)

def parse(data, section):
    p = SenateText(); p.feed(data)
    title = ''.join(p.parts['title']).strip()
    text = ''.join(p.parts['text']).strip()
    if not title or len(text) < 60 or not re.match(r'§\s*'+re.escape(section)+r'\b', text, re.I):
        raise ValueError('Missing exact official heading/body for section '+section)
    heading_only = r'^§\s*'+re.escape(section)+r'\.?\s*'+re.escape(' '.join(title.rstrip('.').split()))+r'\.?$'
    if re.match(heading_only, ' '.join(text.split()), re.I):
        raise ValueError('Official section body is missing')
    return title, text

def acquire(directory):
    root = pathlib.Path(__file__).resolve().parents[3]
    out = pathlib.Path(directory).resolve()
    if out == root or root in out.parents: raise ValueError('Candidate acquisition must remain outside checkout')
    out.mkdir(parents=True, exist_ok=False)
    rows = []
    for reference in dict.fromkeys(BENCHMARK + DEPENDENCIES):
        code, section = reference.split(':') if ':' in reference else ('PEN', reference)
        url = 'https://www.nysenate.gov/legislation/laws/'+code+'/'+section
        body = subprocess.check_output(['curl', '--fail', '--silent', '--show-error', '--max-time', '25', '--max-filesize', '2000000', url])
        if len(body)>2_000_000: raise ValueError('Oversized section')
        retrieved = datetime.datetime.now(datetime.timezone.utc).isoformat()
        title, text = parse(body.decode('utf-8'), section)
        (out / (code+'-'+section+'.html')).write_bytes(body)
        rows.append(dict(sourceKey='ny:'+code+':'+section, sourceUrl=url, section=section, officialTitle=title,
            text=text, contentSha256=hashlib.sha256(text.encode()).hexdigest(), pageSha256=hashlib.sha256(body).hexdigest(),
            retrievedAt=retrieved, effectiveDateStart=None, versionStatus='current_publisher_page_no_independent_amendment_chronology',
            acquisitionChannel='senate_human_page_research_only_not_authority_API'))
        (out/'sources.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2)+'\n')
        print(section, flush=True)
        time.sleep(.6)
    return rows

if __name__ == '__main__':
    if len(sys.argv)!=2: raise SystemExit('Usage: acquire.py /absolute/new/external-candidate-directory')
    acquire(sys.argv[1])
