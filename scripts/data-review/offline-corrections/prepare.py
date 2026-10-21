"""Validate a local review packet and prepare inactive corrections outside repositories.
Standard library only. No network, application imports, activation or receipt writes.
"""
import argparse
from datetime import date
import re
import hashlib
import json
from pathlib import Path
import zipfile


def digest(value):
    return hashlib.sha256(value).hexdigest()


def validate_packet(path):
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        if len(names) != len(set(names)) or any(Path(n).is_absolute() or '..' in Path(n).parts for n in names):
            raise ValueError('Ambiguous or unsafe packet members')
        if sum(i.file_size for i in archive.infolist()) > 100_000_000:
            raise ValueError('Packet exceeds review size limit')
        manifest = json.loads(archive.read('manifest.json'))
        if set(names) != set(manifest) | {'manifest.json'}:
            raise ValueError('Packet manifest coverage mismatch')
        for name, expected in manifest.items():
            if digest(archive.read(name)) != expected:
                raise ValueError('Packet integrity mismatch')
        read = lambda name: json.loads(archive.read(name))
        proposal = read('proposed-record-changes.json')
        sources = read('candidate-source-documents.json')
        retained = read('retained-source-documents.json')
        claims = read('span-evidence.json')
        quotes = read('quote-rebinding-candidates.json')
    for label, docs in (('candidate', sources), ('retained', retained)):
        for key, doc in docs.items():
            effective = doc.get('effectiveDateStart')
            if not isinstance(effective, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', effective):
                raise ValueError(f'{label} source {key}: effectiveDateStart must be a YYYY-MM-DD date')
            try:
                date.fromisoformat(effective)
            except ValueError as error:
                raise ValueError(f'{label} source {key}: invalid effectiveDateStart calendar date') from error
            if key != doc['section'] or digest(doc['text'].encode()) != doc['contentHash']:
                raise ValueError('Unbound source document')
    def check(span, docs, section=None):
        key = section or span['section']
        doc = docs[key]
        start, end = span['start'], span['end']
        if type(start) is not int or type(end) is not int or not 0 <= start < end <= len(doc['text']):
            raise ValueError('Invalid evidence offsets')
        if doc['contentHash'] != span['sourceHash'] or doc['text'][start:end] != span['text']:
            raise ValueError('Evidence passage mismatch')
    for claim in claims:
        check(claim['candidate'], sources)
        if claim['retained']:
            check(claim['retained'], retained)
        if claim['unchangedText'] is True and (not claim['retained'] or claim['retained']['text'] != claim['candidate']['text']):
            raise ValueError('False unchanged-evidence assertion')
    for quote in quotes:
        check(quote['oldSpan'], retained, quote['section'])
        check(quote['candidateSpan'], sources, quote['section'])
    rows = proposal['records']
    if len({r['id'] for r in rows}) != len(rows):
        raise ValueError('Duplicate record identity')
    claim_ids = {c['id'] for c in claims}
    if len(claim_ids) != len(claims):
        raise ValueError('Duplicate evidence identity')
    for row in rows:
        if not set(row['changedSources'] + row['additionalDependencies']) <= set(sources):
            raise ValueError('Missing source dependency')
        if not row['evidenceIds'] or not set(row['evidenceIds']) <= claim_ids:
            raise ValueError('Missing evidence identity')
        covered = {c['candidate']['section'] for c in claims if c['id'] in row['evidenceIds']}
        if not set(row['changedSources'] + row['additionalDependencies']) <= covered:
            raise ValueError('Dependency lacks a record-bound evidence passage')
        if not row['mustRemainWithheld'] or not row['runtimeStatus'].startswith('WITHHELD:'):
            raise ValueError('Proposal lacks withholding boundary')
    proposal['_validatedEvidence'] = {c['id']: c for c in claims}
    proposal['_retainedSources'] = retained
    return proposal, sources


def prepare(proposal, sources, baseline):
    if '_validatedEvidence' not in proposal or '_retainedSources' not in proposal:
        raise ValueError('Call validate_packet before preparing corrections')
    if not baseline.is_dir():
        raise ValueError('Baseline directory does not exist or is not a directory')
    baseline_files = sorted((baseline / 'shared/ohio-reviewed-data').glob('*.json'))
    if not baseline_files:
        raise ValueError('Baseline lacks shared/ohio-reviewed-data JSON files')
    definitions = {}
    for path in baseline_files:
        for definition in json.loads(path.read_text()):
            if definition['id'] in definitions:
                raise ValueError('Duplicate baseline definition')
            definitions[definition['id']] = definition
    evidence = proposal['_validatedEvidence']
    # Local proposal data is never an application authority or publication decision.
    output = []
    for row in proposal['records']:
        current = row['currentEnglish']
        if isinstance(current, dict):
            if row['id'] not in definitions or definitions[row['id']]['text']['en'] != current:
                raise ValueError('Baseline guidance drift; review before preparing corrections')
        else:
            if row['classification'] != 'dependency_evidence_only' or row['proposedEnglish']:
                raise ValueError('Unsupported baseline projection')
            provider = baseline / 'server/data/ohio-hazing-and-protection-source.ts'
            provider_text = provider.read_text() if provider.exists() else ''
            if not re.search(r'chargeId:\s*"' + re.escape(row['id']) + r'"', provider_text):
                raise ValueError('Unknown source-only baseline record')
            retained = proposal['_retainedSources']
            for key in row['changedSources']:
                if key not in retained or retained[key]['contentHash'] not in provider_text:
                    raise ValueError('Source-only baseline pin drift')
        proposed = row['proposedEnglish'] or {}
        allowed = {'plainSummary', 'degreeContext', 'appendToPlainSummary', 'relatedOffenseContext'}
        if set(proposed) - allowed or any(not isinstance(v, str) or not v.strip() for v in proposed.values()):
            raise ValueError('Unknown or empty guidance field')
        fields = {}
        context = proposed.get('relatedOffenseContext')
        if isinstance(current, dict):
            fields = {k: v for k, v in proposed.items() if k in ('plainSummary', 'degreeContext')}
            if 'appendToPlainSummary' in proposed:
                if 'plainSummary' in fields:
                    raise ValueError('Conflicting summary changes')
                fields['plainSummary'] = current['plainSummary'] + ' ' + proposed['appendToPlainSummary']
        keys = sorted(set(row['changedSources'] + row['additionalDependencies']))
        spans = []
        for evidence_id in row['evidenceIds']:
            if evidence_id not in evidence:
                raise ValueError('Missing validated record evidence')
            bound = evidence[evidence_id]['candidate']
            doc = sources[bound['section']]
            # Convert validated Python code-point positions for a future JS adapter.
            start = len(doc['text'][:bound['start']].encode('utf-16-le')) // 2
            end = len(doc['text'][:bound['end']].encode('utf-16-le')) // 2
            spans.append({**bound, 'start': start, 'end': end,
                          'offsetConvention': 'javascript_utf16_exclusive_end'})
        output.append({'id': row['id'], 'status': 'inactive_candidate', 'publication': 'held',
                       'review': 'pending', 'runtimeEligible': False, 'classification': row['classification'],
                       'englishFieldChanges': fields, 'baselineEnglish': current,
                       'proposedFullEnglish': {**current, **fields} if isinstance(current, dict) else None,
                       'evidenceSpans': spans, 'relatedContextCandidate': context,
                       'translationStatus': 'requires_review_before_publication' if proposed else 'existing_wording_unchanged',
                       'sourceBindings': [{'section': k, 'contentHash': sources[k]['contentHash'],
                                           'effectiveFrom': sources[k]['effectiveDateStart']} for k in keys],
                       'withholdingBoundary': row['mustRemainWithheld']})
    return {'kind': 'offline_correction_candidates_not_runtime_input', 'activationAllowed': False,
            'receiptRenewalAllowed': False, 'preserveExistingHolds': True,
            'sourceDocuments': {k: sources[k] for k in sorted({b['section'] for r in output for b in r['sourceBindings']} | {s['section'] for r in output for s in r['evidenceSpans']})},
            'reviewLimitations': ['Prepared from retained review evidence, not a new currentness check.',
                                  'Exact excerpts do not prove semantic support or grant legal approval.',
                                  'Not an application import format; translations and applicability require review.'],
            'records': output}


def outside_repositories(path):
    resolved = path.resolve()
    if any((parent / '.git').exists() for parent in [resolved, *resolved.parents]):
        raise ValueError('Private output must be outside every Git checkout')
    return resolved


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--packet', type=Path, required=True)
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    out = outside_repositories(args.output)
    proposal, sources = validate_packet(args.packet)
    result = prepare(proposal, sources, args.baseline.resolve())
    result['packetSha256'] = digest(args.packet.read_bytes())
    result['baselineGuidanceHashes'] = {str(p.relative_to(args.baseline)): digest(p.read_bytes())
                                     for p in sorted((args.baseline / 'shared/ohio-reviewed-data').glob('*.json'))}
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open('x') as handle:
        json.dump(result, handle, indent=2, ensure_ascii=False)
        handle.write('\n')
    print(json.dumps({'records': len(result['records']), 'englishChanges': sum(bool(r['englishFieldChanges']) for r in result['records']),
                      'contextChanges': sum(bool(r['relatedContextCandidate']) for r in result['records']),
                      'activationAllowed': False}))


if __name__ == '__main__':
    main()
