"""Freshness comparison must reject changed law while tolerating storage relocation."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
import tempfile

spec = importlib.util.spec_from_file_location('refresh', Path(__file__).with_name('refresh-retained.py'))
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)

class RetainedRefreshTests(unittest.TestCase):
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

if __name__ == '__main__':
    unittest.main()
