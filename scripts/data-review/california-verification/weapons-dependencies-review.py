"""Validate and render neutral weapons research accounting without publication.

Regenerate after acquisition; --check verifies the committed artifact offline.
"""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('acquire', HERE/'acquire-weapons-dependencies.py')
a = importlib.util.module_from_spec(spec)
spec.loader.exec_module(a)
OUT = a.r.OUTPUT

def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()

def load(name):
    return json.loads((OUT/name).read_text())

def build(packet=None):
    packet = packet if packet is not None else load('california-weapons-dependencies-acquisition.json')
    plan_path = HERE/'weapons-dependencies-plan.json'
    plan = json.loads(plan_path.read_text())
    if packet['planSha256'] != a.r.bulk.sha256_file(plan_path):
        raise ValueError('Research plan changed; regenerate acquisition')
    expected_hashes = {n:a.r.bulk.sha256_file(OUT/n) for n in plan['retainedArtifacts']}
    if packet['retainedArtifactHashes'] != expected_hashes:
        raise ValueError('Retained provider changed')
    approval = load('california-attorney-source-approval.json')
    if packet['approvedSuccessorSha256'] != a.r.bulk.sha256_file(OUT/'california-attorney-source-approval.json'):
        raise ValueError('Approved successor binding changed')
    prior = a.r.retained_documents(names=plan['retainedArtifacts'])
    if approval['key'] != 'PEN:30515' or approval['previousPin'] != dict(hash=a.r.version_digest(prior['PEN:30515']), versions=len(prior['PEN:30515'])):
        raise ValueError('Successor predecessor mismatch')
    prior['PEN:30515'] = approval['documents']['PEN:30515']
    required = sorted(set(plan['explicitKeys']) | set(packet['baselineRangeKeys']) | set(packet['candidateRangeKeys']))
    if packet['requiredKeys'] != required or len(required) != len(set(required)):
        raise ValueError('Required section inventory mismatch')
    if packet['missingKeys'] or packet['candidateMissingKeys']:
        raise ValueError('Missing research sources remain unresolved')
    if packet['reusedKeys'] != sorted(set(required)&set(prior)) or set(packet['documents']) != set(required)-set(prior):
        raise ValueError('Reuse and new evidence accounting mismatch')
    documents = {**{k:prior[k] for k in packet['reusedKeys']}, **packet['documents']}
    sources = []
    for key in required:
        versions = documents[key]
        if not versions:
            raise ValueError('No versions for ' + key)
        for v in versions:
            if v['lawCode']+':'+v['section'].removesuffix('.') != key or digest(v['contentXml']) != v['contentSha256']:
                raise ValueError('Source identity or body hash mismatch: ' + key)
        sources.append(dict(key=key, retention='existing_publication_dependency' if key in prior else 'research_only_not_pinned',
            versionDigest=a.r.version_digest(versions), versions=[{**{k:v[k] for k in ['versionId','contentSha256','effectiveDate','activeFlag','history']}, 'sourceUrl':f"https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode={v['lawCode']}&sectionNum={v['section'].removesuffix('.')}."} for v in versions]))
    comparison = packet['retainedComparison']['sections']
    if [s['key'] for s in comparison] != required:
        raise ValueError('Comparison does not account for every research source')
    for source, row in zip(sources, comparison):
        if row['expectedHash'] != source['versionDigest'] or row['expectedVersions'] != len(source['versions']):
            raise ValueError('Historical comparison not bound to retained source')
        if row['status'] != 'unchanged' or row['observedHash'] != row['expectedHash'] or row['observedVersions'] != row['expectedVersions']:
            raise ValueError('Historical difference requires separate accounting')
    benchmark = load('california-people-weapons-benchmark-source.json')
    instructions = []
    for instruction_id in plan['instructionIds']:
        matches = [i for i in benchmark['instructions'] if i['id'] == instruction_id]
        if len(matches) != 1:
            raise ValueError('Missing or duplicate instruction')
        instruction = matches[0]
        pages = [p for p in benchmark['pages'] if instruction['firstPage'] <= p['page'] <= instruction['lastPage']]
        if [p['page'] for p in pages] != list(range(instruction['firstPage'],instruction['lastPage']+1)) or instruction['pageHashes'] != [dict(page=p['page'],sha256=digest(p['text'])) for p in pages]:
            raise ValueError('Instruction page binding mismatch')
        instructions.append({**instruction, 'pages':[dict(page=p['page'],text=p['text'],sha256=digest(p['text'])) for p in pages]})
    return dict(schemaVersion=1, scope='combined_weapons_dependency_research_not_publication',
        acquisitionSha256=a.r.bulk.sha256_file(OUT/'california-weapons-dependencies-acquisition.json'),
        archive=packet['archive'], historicalComparison=packet['retainedComparison']['receipt'],
        instructionReceipt=benchmark['receipt'], instructions=instructions, sources=sources,
        ranges=plan['ranges'], approvedSuccessorSha256=packet['approvedSuccessorSha256'],
        counts=dict(requiredSections=len(required),reusedSections=len(packet['reusedKeys']),newResearchSections=len(packet['documents']),
                    retainedVersions=sum(len(v) for v in documents.values()),instructions=len(instructions),newChoices=0,newPins=0,receiptRenewals=0),
        limitations=[
            'This packet collects the two remaining priority weapons groups together. It does not approve conduct summaries, grading branches, defenses or enforceability.',
            'The ranges include exceptions, registration and permit provisions, not a list of new criminal charges. Cross-references outside these ranges still require assessment before publication.',
            'All matching source versions are retained. Active flags and effective metadata are not independent determinations of operative law; the existing PEN:30515 successor approval is preserved.',
            'The comparison uses the retained October 1 archive. It is not a fresh acquisition, a receipt renewal or a determination of current enforceability.',
            'CALCRIM 2540 through 2546 are retained for grading context; inclusion does not mean each instruction applies to every loaded-firearm branch.',
            'The CALCRIM 2560 possession context does not automatically authorize the distinct 30600 conduct choices. Sections 30600(b)-(c) and 30615 remain separate punishment and offense-unit dependencies.',
            'No attorney deliberations, source holds, publication pins, runtime receipts, product choices or existing translations are changed.'
        ])

def render(p):
    c=p['counts']
    lines=['# California combined weapons dependency evidence','',
        f"Two pending work groups now share {c['requiredSections']} retained sections: {c['reusedSections']} reused and {c['newResearchSections']} newly retained for research. {c['instructions']} official jury instructions are bound to their retained PDF pages.",'',
        'No new choices, publication pins or receipt renewals. This research packet does not establish live availability.','',
        '## Scope and limits','',*['- '+s for s in p['limitations']],'',
        '## Instruction evidence','', '| Instruction | Retained PDF pages |','| --- | --- |',
        *[f"| {i['id']} | {i['firstPage']} to {i['lastPage']} |" for i in p['instructions']], '',
        '## Source versions','', '| Source | Retention | Versions |','| --- | --- |',
        *[f"| [{s['key']}]({s['versions'][0]['sourceUrl']}) | {s['retention']} | {len(s['versions'])} |" for s in p['sources']], '',
        '## Reproduction','',
        'Offline validation: `python3 scripts/data-review/california-verification/weapons-dependencies-review.py --check`.',
        'With both retained archives available, reproduce acquisition using `python3 scripts/data-review/california-verification/acquire-weapons-dependencies.py`, then regenerate this report using the review script without `--check`.',
        'These commands do not access a database or change runtime receipts. The frozen research plan names its reuse providers explicitly.','']
    return '\n'.join(lines).replace('\u2014',':').replace('\u2013','-')

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true')
    args=parser.parse_args()
    p=build(); text=render(p)
    target=OUT/'california-weapons-dependencies-review.json'
    md=OUT/'california-weapons-dependencies-review.md'
    if args.check:
        if json.loads(target.read_text()) != p or md.read_text() != text:
            raise ValueError('Research accounting drift; regenerate the weapons dependency report')
    else:
        a.r.atomic_json(target,p);md.write_text(text)
    print(json.dumps(p['counts']))

if __name__=='__main__':main()
