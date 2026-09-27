"""Offline statewide source discovery. Candidates are NOT offenses or publication approvals.

Every table row and version is retained in a deterministic compressed ledger. Full
statutory text stays in the source archive; hashes and bounded excerpts bind triage
to those bytes. No network, application database, credentials, or LLM calls.
"""
import argparse
from collections import Counter, defaultdict
import datetime as dt
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[3]
spec = importlib.util.spec_from_file_location('ca_bulk', Path(__file__).with_name('extract-bulk.py'))
bulk = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bulk)
SCANNER_VERSION = 1
HIERARCHY = ['division', 'title', 'part', 'chapter', 'article']
CODE_NAMES = {
    'Business and Professions': 'BPC', 'Civil Procedure': 'CCP', 'Civil': 'CIV',
    'Commercial': 'COM', 'Corporations': 'CORP', 'Education': 'EDC', 'Elections': 'ELEC',
    'Evidence': 'EVID', 'Family': 'FAM', 'Financial': 'FIN', 'Fish and Game': 'FGC',
    'Food and Agricultural': 'FAC', 'Government': 'GOV', 'Harbors and Navigation': 'HNC',
    'Health and Safety': 'HSC', 'Insurance': 'INS', 'Labor': 'LAB', 'Military and Veterans': 'MVC',
    'Penal': 'PEN', 'Probate': 'PROB', 'Public Contract': 'PCC', 'Public Resources': 'PRC',
    'Public Utilities': 'PUC', 'Revenue and Taxation': 'RTC', 'Streets and Highways': 'SHC',
    'Unemployment Insurance': 'UIC', 'Vehicle': 'VEH', 'Water': 'WAT', 'Welfare and Institutions': 'WIC',
}
# Intentionally broad signals: a reference to a felony is not necessarily a new offense.
SIGNALS = {
    'felony_language': re.compile(r'\bfelon(?:y|ies)\b', re.I),
    'misdemeanor_language': re.compile(r'\bmisdemeanors?\b', re.I),
    'infraction_language': re.compile(r'\binfractions?\b', re.I),
    'punishment_language': re.compile(r'\b(?:punish(?:able|ed|ment)|imprison(?:ment|ed)|county jail|state prison)\b', re.I),
    'offense_language': re.compile(r'\b(?:guilty of|criminal offense|public offense)\b', re.I),
    'prohibition_language': re.compile(r'\b(?:it is unlawful|shall not|may not|no person shall|no individual shall)\b', re.I),
    'regulatory_reference': re.compile(r'\b(?:regulations?|rules)\b', re.I),
}
PENAL = set(SIGNALS) - {'prohibition_language', 'regulatory_reference'}
TRANSITION = re.compile(r'\b(?:shall (?:become operative|become inoperative|remain in effect)|as of that date is repealed|operative (?:on|until)|inoperative on)\b', re.I)
THIS_SCOPE = re.compile(r'\bthis (article|chapter|part|division|code)\b', re.I)
NUM = r'\d+[a-z]?(?:\.\d+[a-z]?)*'
REFERENCE = re.compile(r'\bSections?\s+(' + NUM + r'(?:\s*(?:,\s*(?:and\s+|or\s+)?|and\s+|or\s+|to\s+|through\s+)' + NUM + r')*)', re.I)
CODE_QUALIFIER = re.compile(r'\bof (?:the )?([A-Za-z][A-Za-z &-]{0,65}?) Code\b', re.I)


def packed(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def digest(value):
    return hashlib.sha256(value).hexdigest()


def normalized_text(content):
    if re.search(br'<!\s*(?:DOCTYPE|ENTITY)', content, re.I):
        raise ValueError('DTD/entity declarations are not accepted')
    root = ET.fromstring(content)
    return re.sub(r'\s+', ' ', ' '.join(root.itertext())).strip()


def scan_text(text):
    counts, evidence = {}, []
    for kind, pattern in SIGNALS.items():
        matches = list(pattern.finditer(text))
        if matches:
            counts[kind] = len(matches)
            hit = matches[0]
            start, end = max(0, hit.start() - 140), min(len(text), hit.end() + 220)
            evidence.append({'kind': kind, 'start': start, 'end': end, 'text': text[start:end]})
    return counts, evidence


def reference_hints(text, owner_code):
    """Reference discovery only. Never assigns a grade or resolves applicability.

    A code qualifier is bound only when it directly follows the numeric reference
    (possibly with subdivision text). Unrecognized code names remain unresolved.
    Ranges are recorded and deliberately not expanded or inferred from floats.
    """
    hints = []
    for match in REFERENCE.finditer(text):
        tail = text[match.end():match.end() + 130]
        tail = re.split(r'\bSections?\b|[;.]\s+[A-Z]', tail, maxsplit=1)[0]
        qualifier = CODE_QUALIFIER.search(tail)
        code, status = owner_code, 'same_code_reference_not_applicability'
        if qualifier:
            # Reject distant qualifiers across a different proposition.
            prefix = tail[:qualifier.start()]
            if not re.search(r'\b(?:and|or|which|that|shall|is|under)\b', prefix, re.I):
                name = re.sub(r'\s+', ' ', qualifier.group(1)).strip().casefold()
                code = next((v for k, v in CODE_NAMES.items() if k.casefold() == name), None)
                status = 'cross_code_reference_not_applicability' if code else 'unrecognized_code_qualifier'
            else:
                code, status = None, 'ambiguous_code_qualification'
        numbers = re.findall(NUM, match.group(1), re.I)
        is_range = bool(re.search(r'\b(?:to|through)\b', match.group(1), re.I))
        hints.append({'code': code, 'sections': numbers, 'kind': 'range_unexpanded' if is_range else 'explicit_reference',
                      'status': status, 'start': match.start(), 'end': match.end(), 'text': match.group(0)})
    return hints


def temporal_holds(row, text, as_of):
    holds = []
    date = row['effectiveDate']
    if date:
        try:
            effective = dt.date.fromisoformat(date[:10])
        except ValueError:
            holds.append('invalid_effective_date_metadata')
        else:
            if effective > as_of:
                holds.append('future_effective_metadata')
    else:
        holds.append('effective_date_metadata_missing')
    if TRANSITION.search(text) or TRANSITION.search(row['history'] or ''):
        holds.append('operative_or_repeal_language_requires_review')
    return holds


def read_archive(archive, as_of, progress=False):
    records, errors = [], []
    seen_ids = set()
    with zipfile.ZipFile(archive) as source:
        names = source.namelist()
        if len(set(names)) != len(names):
            raise ValueError('Duplicate archive members')
        with source.open('LAW_SECTION_TBL.dat') as table:
            for line_no, raw in enumerate(table, 1):
                # Schema/identity failure aborts: it cannot be silently dropped from accounting.
                row = bulk.parse_row(raw.decode('utf-8'))
                if not row['lawCode'] or not row['section'] or not row['versionId']:
                    raise ValueError(f'Missing row identity at table row {line_no}')
                key = f"{row['lawCode']}:{row['section'].removesuffix('.')}"
                rec = {'tableRow': line_no, 'tableRowSha256': digest(raw), 'key': key,
                       'versionId': row['versionId'], 'hierarchy': {k: row[k] for k in HIERARCHY},
                       'effectiveDate': row['effectiveDate'], 'activeFlag': row['activeFlag'],
                       'contentSha256': None, 'textSha256': None, 'signalCounts': {}, 'evidence': [],
                       'sourceHolds': [], 'references': [], 'scopeHints': [], 'readStatus': 'ok'}
                ident = (key, row['versionId'], tuple(row[k] for k in HIERARCHY))
                if ident in seen_ids:
                    rec['sourceHolds'].append('duplicate_source_identity')
                seen_ids.add(ident)
                member = row['contentMember']
                try:
                    if not member or not re.fullmatch(r'LAW_SECTION_TBL_[0-9]+\.lob', member):
                        raise ValueError('Unexpected content member path')
                    content = source.read(member)
                    rec['contentSha256'] = digest(content)
                    text = normalized_text(content)
                    if not text:
                        raise ValueError('Empty statutory text')
                    rec['textSha256'] = digest(text.encode())
                    rec['signalCounts'], rec['evidence'] = scan_text(text)
                    rec['sourceHolds'] += temporal_holds(row, text, as_of)
                    if PENAL.intersection(rec['signalCounts']):
                        rec['references'] = reference_hints(text, row['lawCode'])
                        rec['scopeHints'] = sorted(set(m.group(1).lower() for m in THIS_SCOPE.finditer(text)))
                except (ValueError, KeyError, UnicodeError, ET.ParseError) as error:
                    rec['readStatus'] = 'failed'
                    rec['sourceHolds'].append('unreadable_source')
                    errors.append({'tableRow': line_no, 'key': key, 'reason': str(error)[:180]})
                records.append(rec)
                if progress and line_no % 25000 == 0:
                    print(f'Accounted for {line_no} source versions', file=sys.stderr, flush=True)
    return records, errors


def assemble(records, errors, catalog):
    by_key = defaultdict(list)
    for rec in records:
        by_key[rec['key']].append(rec)
    catalog_ids = defaultdict(list)
    for row in catalog['records']:
        for key in row['primaryKeys']:
            catalog_ids[key].append(row['id'])
    # Group-level holds prevent collapsing alternate versions or repeated constitutional numbering.
    for key, versions in by_key.items():
        holds = []
        if len(versions) > 1:
            holds.append('multiple_rows_not_current_version_selection')
        if len({packed(v['hierarchy']) for v in versions}) > 1:
            holds.append('hierarchy_identity_collision_requires_review')
        if not re.fullmatch(NUM, key.split(':', 1)[1], re.I):
            holds.append('nonstandard_section_identity')
        for rec in versions:
            rec['sourceHolds'] = sorted(set(rec['sourceHolds'] + holds))
    linked = defaultdict(set)
    groups, unresolved = [], []
    # Penalty/punishment language is required to create possible penalty relationships.
    for key, versions in sorted(by_key.items()):
        penalty_versions = [v for v in versions if set(v['signalCounts']) & {'punishment_language', 'offense_language'}]
        if not penalty_versions:
            continue
        targets, scopes = set(), set()
        for rec in penalty_versions:
            for hint in rec['references']:
                if hint['kind'] == 'range_unexpanded' or not hint['code']:
                    unresolved.append({'sourceKey': key, 'versionId': rec['versionId'], **hint})
                    continue
                for number in hint['sections']:
                    target = f"{hint['code']}:{number}"
                    if target in by_key:
                        targets.add(target)
                    else:
                        unresolved.append({'sourceKey': key, 'versionId': rec['versionId'], **hint, 'targetKey': target, 'status': 'target_not_in_snapshot'})
            for scope in rec['scopeHints']:
                # Hierarchy order varies by code. Keep blanket references visible,
                # but require reading the clause before expanding scope membership.
                unresolved.append({'sourceKey': key, 'versionId': rec['versionId'],
                                   'kind': 'blanket_scope_unexpanded', 'scope': scope,
                                   'hierarchy': rec['hierarchy']})
                scopes.add(scope)
        targets.discard(key)
        if targets:
            gid = 'penalty-source:' + key
            groups.append({'id': gid, 'sourceKey': key, 'scopeHints': sorted(scopes), 'targetKeys': sorted(targets),
                           'relationship': 'possible_reference_or_scope_only_no_grade_assignment',
                           'sourceHolds': sorted(set(h for v in versions for h in v['sourceHolds']))})
            for target in targets:
                linked[target].add(key)
    sections = []
    for key, versions in sorted(by_key.items()):
        signals = sorted(set(k for v in versions for k in v['signalCounts']))
        if any(v['readStatus'] != 'ok' for v in versions):
            disposition = 'source_failure_unresolved'
        elif PENAL.intersection(signals):
            disposition = 'criminal_language_candidate'
        elif linked[key]:
            disposition = 'possible_penalty_target_candidate'
        elif 'prohibition_language' in signals:
            disposition = 'prohibition_only_unresolved'
        else:
            disposition = 'no_criminal_signal_detected_not_excluded'
        if catalog_ids.get(key):
            priority = 'existing_catalog_reconciliation'
        elif 'felony_language' in signals or 'punishment_language' in signals:
            priority = 'higher_consequence_signal_review'
        elif disposition == 'criminal_language_candidate':
            priority = 'other_criminal_signal_review'
        elif disposition in ('possible_penalty_target_candidate', 'prohibition_only_unresolved', 'source_failure_unresolved'):
            priority = 'severity_unknown_research'
        else:
            priority = 'negative_detection_audit'
        sections.append({'key': key, 'versionRows': len(versions), 'disposition': disposition, 'priority': priority,
                         'signals': signals, 'possiblePenaltySources': sorted(linked[key]),
                         'catalogIds': sorted(set(catalog_ids.get(key, []))),
                         'sourceHolds': sorted(set(h for v in versions for h in v['sourceHolds'])),
                         'publicationStatus': 'discovery_only_not_approved'})
    counts = Counter(s['disposition'] for s in sections)
    summary = {'schemaVersion': 1, 'scannerVersion': SCANNER_VERSION, 'scope': 'state_statutory_source_discovery_not_offense_inventory',
               'status': 'incomplete_source_failures' if errors else 'source_scan_complete_legal_discovery_open',
               'accounting': {'sourceVersionRows': len(records), 'sourceSectionKeys': len(sections), 'codes': len({r['key'].split(':')[0] for r in records}),
                              'readFailures': len(errors), 'dispositions': dict(sorted(counts.items())),
                              'candidateSectionKeys': len(sections) - counts['no_criminal_signal_detected_not_excluded'],
                              'possiblePenaltySourceGroups': len(groups), 'unresolvedReferenceHints': len(unresolved),
                              'sourceHeldKeys': sum(bool(s['sourceHolds']) for s in sections),
                              'catalogPrimaryKeys': len(catalog_ids), 'catalogKeysMissingFromSnapshot': sorted(set(catalog_ids) - set(by_key)),
                              'verifiedNewOffenses': 0, 'publishedNewCharges': 0, 'statewideOffenseDenominator': None},
               'byCode': [{'code': code, 'sourceSectionKeys': sum(s['key'].startswith(code + ':') for s in sections),
                           'sourceVersionRows': sum(r['key'].startswith(code + ':') for r in records),
                           'dispositions': dict(sorted(Counter(s['disposition'] for s in sections if s['key'].startswith(code + ':')).items()))}
                          for code in sorted({r['key'].split(':')[0] for r in records})],
               'failures': errors,
               'limits': [
                   'A candidate section is not an offense. References, civil provisions, procedures and historical text produce false positives.',
                   'No-signal sections are not certified noncriminal. Independent inventories and negative-sample audits remain necessary.',
                   'Active flags and effective-date metadata do not select current operative law. All versions and identity conflicts remain visible.',
                   'Possible penalty targets are broad research hints, not findings that a prohibition exists or a punishment applies.',
                   'Blanket scopes are retained unexpanded; code-specific hierarchy and penalty applicability need review.',
                   'Ranges, subdivision applicability and uncertain cross-code references remain unresolved; no grade is propagated.',
                   'State regulations, local ordinances, uncodified enactments and comprehensive case-law enforceability are not scanned here.',
                   'Severity-unknown candidates are not assumed minor. Only reviewed low-priority candidates may enter the explicit deferral inventory.',
               ]}
    # Every key belongs to exactly one primary chapter batch. Penalty groups are reusable overlapping research aids.
    batches = defaultdict(list)
    for section in sections:
        if section['disposition'] == 'no_criminal_signal_detected_not_excluded':
            continue
        representative = by_key[section['key']][0]
        identity_conflict = 'hierarchy_identity_collision_requires_review' in section['sourceHolds']
        h = representative['hierarchy']
        batch = section['key'].split(':')[0] + ':' + ('identity-review' if identity_conflict else '/'.join(f'{name}={h[name] or "-"}' for name in HIERARCHY[:-1]))
        batches[batch].append(section['key'])
    batch_rows = []
    index = {s['key']: s for s in sections}
    for bid, keys in batches.items():
        priority_counts = Counter(index[key]['priority'] for key in keys)
        batch_rows.append({'id': bid, 'sectionKeys': keys, 'candidateSections': len(keys), 'priorityCounts': dict(sorted(priority_counts.items())),
                           'catalogIds': sorted(set(cid for key in keys for cid in index[key]['catalogIds'])),
                           'possiblePenaltySources': sorted(set(p for key in keys for p in index[key]['possiblePenaltySources'])),
                           'status': 'engineering_review_not_attorney_assignment'})
    batch_rows.sort(key=lambda b: (-b['priorityCounts'].get('higher_consequence_signal_review', 0), -len(b['catalogIds']), -len(b['sectionKeys']), b['id']))
    assert sum(counts.values()) == len(by_key)
    assert sum(b['candidateSections'] for b in batch_rows) == summary['accounting']['candidateSectionKeys']
    return summary, sections, groups, unresolved, batch_rows


def write_gzip_rows(path, rows):
    # Fixed gzip timestamp and no embedded local filename make replays byte-identical.
    with path.open('wb') as raw:
        with gzip.GzipFile(fileobj=raw, mode='wb', filename='', mtime=0) as stream:
            for row in rows:
                stream.write((packed(row) + '\n').encode())
    return {'file': path.name, 'sha256': bulk.sha256_file(path), 'bytes': path.stat().st_size, 'rows': len(rows)}


def validate_deferrals(decisions, sections):
    index = {row['key']: row for row in sections}
    seen = set()
    for item in decisions:
        if item['key'] in seen or item['key'] not in index:
            raise ValueError('Duplicate or unknown deferral key')
        seen.add(item['key'])
        if item.get('decision') != 'withhold_low_priority_unresolved' or not all(item.get(k) for k in ['reason', 'reviewedBy', 'reviewedAt', 'revisitCondition', 'severityEvidence']):
            raise ValueError('A deferral requires an explicit reviewed reason, severity evidence and revisit condition')
        if index[item['key']]['catalogIds']:
            raise ValueError('Discovery deferral cannot silently withhold an existing catalog record')
    return decisions


def render(summary, batches):
    a = summary['accounting']
    lines = ['# California statewide source discovery', '', f"Snapshot acquired: {summary['archive']['retrievedAt']}. Assessment date: {summary['asOf']}.", '',
             f"Accounted for {a['sourceVersionRows']:,} version rows and {a['sourceSectionKeys']:,} code/section keys across {a['codes']} codes. Read failures: {a['readFailures']}.", '',
             f"{a['candidateSectionKeys']:,} section keys need candidate or unresolved research. These are NOT {a['candidateSectionKeys']:,} crimes. New verified offenses: 0. New published charges: 0.", '',
             *[f'- {s}' for s in summary['limits']], '', '| Disposition | Section keys |', '| --- | ---: |',
             *[f'| {k} | {v:,} |' for k, v in a['dispositions'].items()], '',
             '## Larger review batches', '', 'Each candidate belongs to exactly one chapter batch. Shared penalty-source groups are overlapping aids; their references never assign punishment. Split large chapter batches into reviewable releases after reading the common authorities.', '',
             '| Batch | Candidate sections | Higher-consequence signals | Existing catalog records |', '| --- | ---: | ---: | ---: |',
             *[f"| {b['id']} | {b['candidateSections']} | {b['priorityCounts'].get('higher_consequence_signal_review', 0)} | {len(b['catalogIds'])} |" for b in batches[:30]], '',
             'The complete batch manifest and compressed ledgers are committed beside this report. All source text can be recovered from the hash-bound archive; excerpts are navigation aids, not full statutory analysis.', '',
             f"Reviewed low-priority deferrals: {summary['deferredCandidateCount']}. Unreviewed candidates remain unpublished discovery work, not assumed minor offenses.", '',
             'Next: independently test discovery misses and review high-consequence/common-charge families. Time-box minor ambiguous candidates only after assessing severity; record the reason and revisit condition. Do not ask an attorney to perform routine source lookup or data entry.', '']
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--as-of', required=True, type=dt.date.fromisoformat)
    parser.add_argument('--archive', type=Path, default=ROOT / '.cache/california-bulk/pubinfo_2025.zip')
    parser.add_argument('--receipt', type=Path, default=ROOT / '.cache/california-bulk/archive-receipt.json')
    parser.add_argument('--catalog', type=Path, default=ROOT / 'scripts/data-review/output/california-catalog-coverage.json')
    parser.add_argument('--output', type=Path, default=ROOT / 'scripts/data-review/output/california-statewide')
    args = parser.parse_args()
    receipt = json.loads(args.receipt.read_text())
    if receipt['sourceUrl'] != 'https://downloads.leginfo.legislature.ca.gov/pubinfo_2025.zip' or args.archive.stat().st_size != receipt['bytes'] or bulk.sha256_file(args.archive) != receipt['sha256']:
        raise SystemExit('Archive does not match its official-source receipt')
    if args.as_of < dt.date.fromisoformat(receipt['retrievedAt'][:10]):
        raise SystemExit('Assessment date predates source acquisition')
    catalog = json.loads(args.catalog.read_text())
    records, errors = read_archive(args.archive, args.as_of, progress=True)
    summary, sections, groups, unresolved, batches = assemble(records, errors, catalog)
    decisions = json.loads(Path(__file__).with_name('statewide-deferrals.json').read_text())
    validate_deferrals(decisions, sections)
    summary.update({'archive': receipt, 'asOf': args.as_of.isoformat(), 'catalogSha256': bulk.sha256_file(args.catalog),
                    'deferredCandidateCount': len(decisions), 'deferrals': decisions,
                    'code': {name: bulk.sha256_file(Path(__file__).with_name(name)) for name in ['discover-statewide.py', 'extract-bulk.py']}})
    args.output.mkdir(parents=True, exist_ok=True)
    summary['artifacts'] = [write_gzip_rows(args.output / name, rows) for name, rows in [
        ('source-versions.jsonl.gz', records), ('section-accounting.jsonl.gz', sections),
        ('possible-penalty-groups.jsonl.gz', groups), ('unresolved-references.jsonl.gz', unresolved)]]
    (args.output / 'review-batches.json').write_text(json.dumps(batches, indent=2) + '\n')
    summary['artifacts'].append({'file': 'review-batches.json', 'sha256': bulk.sha256_file(args.output / 'review-batches.json'), 'rows': len(batches)})
    (args.output / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
    (args.output / 'README.md').write_text(render(summary, batches))
    print(json.dumps(summary['accounting']))
    if errors or summary['accounting']['catalogKeysMissingFromSnapshot']:
        raise SystemExit('Discovery gaps recorded; source scan cannot be accepted as complete')


if __name__ == '__main__':
    main()
