"""Safety/accounting tests run through the existing Vitest Python test bridge."""
import datetime as dt
import importlib.util
import json
import gzip
from pathlib import Path
import tempfile
import unittest
import zipfile
from test_extract_bulk import row

spec = importlib.util.spec_from_file_location('discovery', Path(__file__).with_name('discover-statewide.py'))
d = importlib.util.module_from_spec(spec)
spec.loader.exec_module(d)


class DiscoveryTests(unittest.TestCase):
    def fixture(self, items):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        archive = Path(temporary.name) / 'source.zip'
        with zipfile.ZipFile(archive, 'w') as z:
            z.writestr('LAW_SECTION_TBL.dat', ''.join(r for r, content in items))
            for r, content in items:
                member = d.bulk.parse_row(r)['contentMember']
                if content is not None:
                    z.writestr(member, content)
        return d.read_archive(archive, dt.date(2026, 9, 27))

    def test_accounting_versions_references_and_negative_detection(self):
        records, errors = self.fixture([
            (row('PEN', '1.', 'LAW_SECTION_TBL_1.lob'), '<p>Violation of Section 2 is punishable by imprisonment. This code applies.</p>'),
            (row('PEN', '2.', 'LAW_SECTION_TBL_2.lob'), '<p>A definition.</p>'),
            (row('VEH', '2.', 'LAW_SECTION_TBL_3.lob'), '<p>A different definition.</p>'),
            (row('PEN', '2.', 'LAW_SECTION_TBL_4.lob', 'v2').replace('2026-01-01', '2027-01-01'), '<p>Future definition.</p>'),
        ])
        summary, sections, groups, unresolved, batches = d.assemble(records, errors, {'records': [{'id': 'existing', 'primaryKeys': ['PEN:1']}]})
        index = {s['key']: s for s in sections}
        self.assertEqual(summary['accounting']['sourceVersionRows'], 4)
        self.assertEqual(summary['accounting']['catalogPrimaryKeys'], 1)
        self.assertEqual(index['PEN:2']['disposition'], 'possible_penalty_target_candidate')
        self.assertEqual(index['VEH:2']['disposition'], 'no_criminal_signal_detected_not_excluded')
        self.assertIn('future_effective_metadata', index['PEN:2']['sourceHolds'])
        self.assertIn('multiple_rows_not_current_version_selection', index['PEN:2']['sourceHolds'])
        self.assertTrue(any(h['kind'] == 'blanket_scope_unexpanded' for h in unresolved))
        self.assertEqual(groups[0]['targetKeys'], ['PEN:2'])
        self.assertEqual(sum(b['candidateSections'] for b in batches), 2)
        self.assertTrue(all(s['publicationStatus'] == 'discovery_only_not_approved' for s in sections))
        for record in records:
            for evidence in record['evidence']:
                self.assertGreater(evidence['end'], evidence['start'])
        self.assertEqual(summary['accounting']['publishedNewCharges'], 0)

    def test_reference_code_identity_and_unexpanded_ranges(self):
        hints = d.reference_hints('Sections 240 and 241 of the Penal Code; Section 240 of the Vehicle Code; Sections 1 through 4; Section 3 of the Unknown Code; Section 9 of the Elections Code.', 'HSC')
        self.assertEqual([h['code'] for h in hints], ['PEN', 'VEH', 'HSC', None, 'ELEC'])
        self.assertEqual(hints[2]['kind'], 'range_unexpanded')
        self.assertEqual(hints[2]['sections'], ['1', '4'])

    def test_source_failures_are_retained_not_dropped(self):
        records, errors = self.fixture([
            (row('PEN', '1.', '../private-file'), None),
            (row('PEN', '2.', 'LAW_SECTION_TBL_2.lob'), '<p>broken'),
            (row('PEN', '3.', 'LAW_SECTION_TBL_3.lob'), '<!DOCTYPE x><p>unsafe</p>'),
        ])
        summary, sections, *_ = d.assemble(records, errors, {'records': []})
        self.assertEqual(len(records), 3)
        self.assertEqual(len(errors), 3)
        self.assertEqual(summary['status'], 'incomplete_source_failures')
        self.assertTrue(all(s['disposition'] == 'source_failure_unresolved' for s in sections))

    def test_identity_collision_is_held(self):
        first = row('CONS', 'SEC. 2', 'LAW_SECTION_TBL_1.lob')
        second = row('CONS', 'SEC. 2', 'LAW_SECTION_TBL_2.lob', 'v2')
        fields = second.split('\t'); fields[12] = '`II`'; second = '\t'.join(fields)
        records, errors = self.fixture([(first, '<p>A misdemeanor.</p>'), (second, '<p>Other text.</p>')])
        _, sections, _, _, batches = d.assemble(records, errors, {'records': []})
        self.assertIn('hierarchy_identity_collision_requires_review', sections[0]['sourceHolds'])
        self.assertEqual(batches[0]['id'], 'CONS:identity-review')

    def test_unknown_severity_not_minor_and_deferrals_require_evidence(self):
        records, errors = self.fixture([(row('PEN', '1.', 'LAW_SECTION_TBL_1.lob'), '<p>No person shall do this.</p>')])
        _, sections, *_ = d.assemble(records, errors, {'records': []})
        self.assertEqual(sections[0]['priority'], 'severity_unknown_research')
        with self.assertRaises(ValueError):
            d.validate_deferrals([{'key': 'PEN:1'}], sections)
        decision = {'key': 'PEN:1', 'decision': 'withhold_low_priority_unresolved', 'reason': 'test', 'reviewedBy': 'reviewer', 'reviewedAt': '2026-09-27', 'revisitCondition': 'new authority', 'severityEvidence': 'reviewed source'}
        self.assertEqual(d.validate_deferrals([decision], sections), [decision])
        sections[0]['catalogIds'] = ['existing']
        with self.assertRaises(ValueError): d.validate_deferrals([decision], sections)

    def test_evidence_spans_bind_to_normalized_text(self):
        text = 'A prefix. ' + 'x' * 200 + ' Whoever violates this section is guilty of a misdemeanor. ' + 'y' * 300
        counts, evidence = d.scan_text(text)
        self.assertEqual(counts['misdemeanor_language'], 1)
        for span in evidence:
            self.assertEqual(span['text'], text[span['start']:span['end']])

    def test_inspector_rejects_changed_evidence(self):
        spec = importlib.util.spec_from_file_location('inspector', Path(__file__).with_name('inspect-statewide.py'))
        inspector = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(inspector)
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            artifacts = [d.write_gzip_rows(folder / name, [{'key': 'PEN:1'}]) for name in ['section-accounting.jsonl.gz', 'source-versions.jsonl.gz']]
            (folder / 'summary.json').write_text(json.dumps({'artifacts': artifacts, 'asOf': '2026-09-27', 'archive': {}}))
            self.assertEqual(len(inspector.inspect('PEN:1', folder)['versions']), 1)
            (folder / 'source-versions.jsonl.gz').write_bytes(b'changed')
            with self.assertRaisesRegex(ValueError, 'hash mismatch'):
                inspector.inspect('PEN:1', folder)

    def test_normalization_and_deterministic_ledger(self):
        self.assertEqual(d.normalized_text(b'<p>No<span/>person shall.</p>'), 'No person shall.')
        with tempfile.TemporaryDirectory() as directory:
            a, b = (Path(directory) / name for name in ['a.gz', 'b.gz'])
            d.write_gzip_rows(a, [{'text': 'evidence'}])
            d.write_gzip_rows(b, [{'text': 'evidence'}])
            self.assertEqual(a.read_bytes(), b.read_bytes())


class CommittedDiscoveryTests(unittest.TestCase):
    def test_committed_ledgers_reconcile_and_match_provenance(self):
        root = Path(__file__).resolve().parents[3]
        directory = root / 'scripts/data-review/output/california-statewide'
        summary = json.loads((directory / 'summary.json').read_text())
        for name, expected in summary['code'].items():
            self.assertEqual(d.bulk.sha256_file(Path(__file__).with_name(name)), expected)
        self.assertEqual(d.bulk.sha256_file(root / 'scripts/data-review/output/california-catalog-coverage.json'), summary['catalogSha256'])
        for artifact in summary['artifacts']:
            self.assertEqual(d.bulk.sha256_file(directory / artifact['file']), artifact['sha256'])
        with gzip.open(directory / 'section-accounting.jsonl.gz', 'rt') as stream:
            sections = [json.loads(line) for line in stream]
        self.assertEqual(len(sections), summary['accounting']['sourceSectionKeys'])
        self.assertEqual(sum(s['versionRows'] for s in sections), summary['accounting']['sourceVersionRows'])
        self.assertEqual(len({s['key'] for s in sections}), len(sections))
        self.assertTrue(all(s['publicationStatus'] == 'discovery_only_not_approved' for s in sections))
        candidates = {s['key'] for s in sections if s['disposition'] != 'no_criminal_signal_detected_not_excluded'}
        batches = json.loads((directory / 'review-batches.json').read_text())
        members = [key for batch in batches for key in batch['sectionKeys']]
        self.assertEqual(set(members), candidates)
        self.assertEqual(len(members), len(candidates))
        self.assertEqual(summary['accounting']['codes'], 30)
        self.assertEqual(summary['accounting']['readFailures'], 0)
        self.assertEqual(summary['accounting']['catalogKeysMissingFromSnapshot'], [])


if __name__ == '__main__': unittest.main()
