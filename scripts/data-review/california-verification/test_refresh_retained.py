"""Freshness comparison must reject changed law while tolerating storage relocation."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
import tempfile
from unittest.mock import patch
from types import SimpleNamespace

spec = importlib.util.spec_from_file_location('refresh', Path(__file__).with_name('refresh-retained.py'))
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)

class RetainedRefreshTests(unittest.TestCase):
    def test_quarterly_deadline_preserves_acquisition_and_clamps_month_end(self):
        import datetime as dt
        self.assertEqual(r.quarterly_deadline(dt.datetime(2026, 11, 30, tzinfo=dt.timezone.utc)).isoformat(), '2027-02-28T00:00:00+00:00')
        self.assertEqual(r.quarterly_deadline(dt.datetime(2027, 11, 30, tzinfo=dt.timezone.utc)).isoformat(), '2028-02-29T00:00:00+00:00')


    def test_comparison_only_cannot_write_active_receipt_or_comparison(self):
        import datetime as dt
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder); candidate = root / 'candidate'; candidate.mkdir()
            output = root / 'active'; output.mkdir()
            (root / 'shared').mkdir()
            original = self.version(); documents = {'PEN:1': [original]}
            pins = {'PEN:1': dict(hash=r.version_digest([original]), versions=1)}
            (root / 'shared/california-retained-pins.json').write_text(json.dumps(pins))
            (candidate / 'archive.zip').write_bytes(b'archive')
            (candidate / 'archive-receipt.json').write_text(json.dumps(dict(retrievedAt=dt.datetime.now(dt.timezone.utc).isoformat(), sourceUrl=r.SOURCE_URL, bytes=7, sha256='candidate')))
            active = output / 'california-archive-refresh-receipt.json'; active.write_text('original receipt')
            with patch.object(r, 'ROOT', root), patch.object(r, 'OUTPUT', output), patch.object(r, 'retained_documents', return_value=documents), patch.object(r.bulk, 'sha256_file', return_value='candidate'), patch.object(r.bulk, 'extract', return_value=[dict(lawCode='PEN', section='1', versions=[original])]), patch('sys.argv', ['refresh-retained.py', '--candidate', str(candidate)]):
                r.main()
            self.assertEqual(active.read_text(), 'original receipt')
            self.assertEqual(len(list(output.iterdir())), 1)
            self.assertTrue((candidate / 'california-retained-refresh-comparison.json').exists())

    def version(self):
        text = '<p>Original statutory text</p>'
        return dict(id='PEN1', lawCode='PEN', section='1.', versionId='v1', activeFlag='Y',
                    effectiveDate='2026-01-01', transUpdate='2026-09-01', contentXml=text,
                    contentSha256=hashlib.sha256(text.encode()).hexdigest(), contentMember='LAW_SECTION_TBL_1.lob',
                    tableRow=1, tableRowSha256='row', transUid='publisher-user')

    def test_accepts_only_storage_relocation_without_substantive_metadata_change(self):
        original = self.version()
        relocated = {**original, 'contentMember': 'LAW_SECTION_TBL_99.lob', 'tableRow': 100, 'tableRowSha256': 'new', 'transUid': 'another', 'transUpdate': 'later publisher transaction'}
        self.assertEqual(r.version_digest([original]), r.version_digest([relocated]))
        for key in ['id', 'lawCode', 'section', 'versionId', 'activeFlag', 'effectiveDate']:
            with self.subTest(key=key):
                self.assertNotEqual(r.version_digest([original]), r.version_digest([{**original, key: 'changed'}]))

    def test_withholds_changed_text_missing_sections_and_added_versions(self):
        old = self.version()
        changed = {**old, 'contentXml': '<p>Amended</p>', 'contentSha256': hashlib.sha256(b'<p>Amended</p>').hexdigest()}
        for observed in [{}, {'PEN:1': [changed]}, {'PEN:1': [old, {**old, 'versionId': 'v2'}]}]:
            self.assertEqual(r.compare_versions({'PEN:1': [old]}, observed)[0]['status'], 'changed_or_missing')
        with self.assertRaisesRegex(ValueError, 'Unbound'):
            r.version_digest([{**old, 'contentXml': 'unbound'}])

    def test_committed_pins_cover_every_retained_dependency_version(self):
        documents = r.retained_documents()
        expected = {k: dict(hash=r.version_digest(v), versions=len(v)) for k, v in sorted(documents.items())}
        self.assertEqual(json.loads((r.ROOT / 'shared/california-retained-pins.json').read_text()), expected)

    def test_successor_rejects_wrong_baseline_missing_version_and_unbound_text(self):
        original = json.loads((r.OUTPUT / 'california-attorney-source-approval.json').read_text())
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder)
            for name in r.RETAINED:
                (output / name).symlink_to(r.OUTPUT / name)
            for failure in ('baseline', 'version', 'text'):
                approval = copy.deepcopy(original)
                if failure == 'baseline':
                    approval['previousPin']['hash'] = '0' * 64
                elif failure == 'version':
                    approval['operativeVersionId'] = 'absent'
                else:
                    approval['documents']['PEN:30515'][0]['contentXml'] += ' altered'
                (output / 'california-attorney-source-approval.json').write_text(json.dumps(approval))
                with self.assertRaises(ValueError):
                    r.retained_documents(output=output)


    def test_curl_transport_binds_success_and_rejects_partial_or_redirected_downloads(self):
        for status, length in [('200', 7), ('302', 7), ('200', 8), ('200', None)]:
            with self.subTest(status=status, length=length), tempfile.TemporaryDirectory() as folder:
                path = Path(folder)
                (path/'archive.zip').write_bytes(b'old')
                (path/'archive-receipt.json').write_text('{"unchanged": true}')
                def transfer(args, **kwargs):
                    self.assertNotIn('--insecure', args)
                    self.assertNotIn('--location', args)
                    self.assertEqual(args[-1], r.SOURCE_URL)
                    Path(args[args.index('--output')+1]).write_bytes(b'archive')
                    Path(args[args.index('--dump-header')+1]).write_text(
                        'HTTP/2 '+status+'\n'+('Content-Length: '+str(length)+'\n' if length is not None else '')+'Last-Modified: retained publisher time\n')
                    return SimpleNamespace(returncode=0, stdout=status, stderr='')
                with patch.object(r.subprocess, 'run', side_effect=transfer):
                    if status == '200' and length == 7:
                        r.acquire_candidate_curl(path)
                        receipt = json.loads((path/'archive-receipt.json').read_text())
                        self.assertEqual(receipt['bytes'], 7)
                        self.assertEqual(receipt['sha256'], hashlib.sha256(b'archive').hexdigest())
                        self.assertEqual(receipt['sourceUrl'], r.SOURCE_URL)
                        self.assertIsNotNone(r.dt.datetime.fromisoformat(receipt['retrievedAt']).tzinfo)
                    else:
                        with self.assertRaises(ValueError): r.acquire_candidate_curl(path)
                        self.assertEqual((path/'archive.zip').read_bytes(), b'old')
                        self.assertEqual(json.loads((path/'archive-receipt.json').read_text()), {'unchanged':True})

if __name__ == '__main__':
    unittest.main()
