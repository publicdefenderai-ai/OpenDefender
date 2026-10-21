import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('prepare', Path(__file__).with_name('prepare.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class OfflineCorrectionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        d = self.root / 'shared/ohio-reviewed-data'
        d.mkdir(parents=True)
        self.current = {'plainSummary': 'Existing fictional text', 'degreeContext': 'Existing context'}
        (d/'a.json').write_text(json.dumps([{'id': 'example', 'text': {'en': self.current}}]))
        self.row = {'id': 'example', 'currentEnglish': self.current, 'classification': 'guidance_and_evidence_update',
                    'proposedEnglish': {'appendToPlainSummary': 'Fictional qualification.'}, 'changedSources': ['1'],
                    'additionalDependencies': [], 'mustRemainWithheld': 'Pending review', 'runtimeStatus': 'WITHHELD: pending', 'evidenceIds': ['e']}
        self.sources = {'1': {'section': '1', 'text': 'Public example', 'contentHash': m.digest(b'Public example'), 'effectiveDateStart': '2020-01-01'}}

    def packet(self, mutate=None):
        s = {'section': '1', 'sourceHash': self.sources['1']['contentHash'], 'start': 0, 'end': 6, 'text': 'Public'}
        data = {'proposed-record-changes.json': {'records': [self.row]}, 'candidate-source-documents.json': self.sources,
                'retained-source-documents.json': self.sources,
                'span-evidence.json': [{'id': 'e', 'candidate': s, 'retained': s, 'unchangedText': True}],
                'quote-rebinding-candidates.json': [{'section': '1', 'oldSpan': s, 'candidateSpan': s}]}
        data = copy.deepcopy(data)
        if mutate: mutate(data)
        members = {k: json.dumps(v).encode() for k,v in data.items()}
        path = self.root/'packet.zip'
        with zipfile.ZipFile(path, 'w') as z:
            for k,v in members.items(): z.writestr(k,v)
            z.writestr('manifest.json', json.dumps({k:m.digest(v) for k,v in members.items()}))
        return path

    def test_preserves_hold_and_qualifications(self):
        p,s = m.validate_packet(self.packet());r=m.prepare(p,s,self.root)
        self.assertFalse(r['activationAllowed'])
        self.assertEqual(r['records'][0]['publication'],'held')
        self.assertFalse(r['records'][0]['runtimeEligible'])
        self.assertEqual(r['records'][0]['englishFieldChanges']['plainSummary'],'Existing fictional text Fictional qualification.')
        self.assertEqual(r['records'][0]['translationStatus'],'requires_review_before_publication')

    def test_rejects_source_drift_even_with_updated_packet_manifest(self):
        with self.assertRaisesRegex(ValueError,'Unbound'):
            m.validate_packet(self.packet(lambda d:d['candidate-source-documents.json']['1'].update(text='Changed')))

    def test_rejects_quote_drift(self):
        with self.assertRaisesRegex(ValueError,'passage'):
            m.validate_packet(self.packet(lambda d:d['span-evidence.json'][0]['candidate'].update(text='Other!')))

    def test_rejects_baseline_drift(self):
        row=copy.deepcopy(self.row);row['currentEnglish']['plainSummary']='Old stale wording'
        with self.assertRaisesRegex(ValueError,'Baseline guidance drift'):
            m.prepare({'records':[row]},self.sources,self.root)

    def test_rejects_duplicate_records(self):
        with self.assertRaisesRegex(ValueError,'Duplicate record'):
            m.validate_packet(self.packet(lambda d:d['proposed-record-changes.json']['records'].append(copy.deepcopy(self.row))))

    def test_rejects_repository_output_and_symlink(self):
        (self.root/'.git').write_text('gitdir: elsewhere')
        with self.assertRaisesRegex(ValueError,'outside'):
            m.outside_repositories(self.root/'private.json')
        alias=self.root.parent/(self.root.name+'-alias');alias.symlink_to(self.root,target_is_directory=True)
        self.addCleanup(alias.unlink)
        with self.assertRaisesRegex(ValueError,'outside'):
            m.outside_repositories(alias/'private.json')

    def test_rejects_traversal_without_extracting(self):
        path=self.packet()
        with zipfile.ZipFile(path,'a') as z:z.writestr('../private.txt','no')
        with self.assertRaisesRegex(ValueError,'unsafe'):m.validate_packet(path)
        self.assertFalse((self.root.parent/'private.txt').exists())

    def test_rejects_missing_dependency(self):
        with self.assertRaisesRegex(ValueError,'Missing source'):
            m.validate_packet(self.packet(lambda d:d['proposed-record-changes.json']['records'][0]['additionalDependencies'].append('2')))


    def test_rejects_missing_record_passages(self):
        with self.assertRaisesRegex(ValueError,'Missing evidence'):
            m.validate_packet(self.packet(lambda d:d['proposed-record-changes.json']['records'][0].update(evidenceIds=[])))

    def test_rejects_unknown_source_only_record(self):
        row=copy.deepcopy(self.row);row.update(currentEnglish='source only', classification='dependency_evidence_only', proposedEnglish=None)
        with self.assertRaisesRegex(ValueError,'Unknown source-only'):
            m.prepare({'records':[row]},self.sources,self.root)

    def test_preserves_unedited_fields_and_separates_context(self):
        self.row['proposedEnglish']={'relatedOffenseContext':'Fictional context'}
        p,s=m.validate_packet(self.packet());r=m.prepare(p,s,self.root)['records'][0]
        self.assertEqual(r['proposedFullEnglish'], self.current)
        self.assertEqual(r['englishFieldChanges'], {})
        self.assertEqual(r['relatedContextCandidate'], 'Fictional context')
        self.assertEqual(r['evidenceSpans'][0]['text'], 'Public')

    def test_converts_astral_offsets_to_javascript(self):
        def edit(d):
            text='😀 Public example'
            for name in ['candidate-source-documents.json','retained-source-documents.json']:
                d[name]['1'].update(text=text,contentHash=m.digest(text.encode()))
            for q in [d['span-evidence.json'][0]['candidate'],d['span-evidence.json'][0]['retained'],d['quote-rebinding-candidates.json'][0]['oldSpan'],d['quote-rebinding-candidates.json'][0]['candidateSpan']]:
                q.update(start=2,end=8,sourceHash=m.digest(text.encode()))
        p,s=m.validate_packet(self.packet(edit));r=m.prepare(p,s,self.root)['records'][0]
        self.assertEqual((r['evidenceSpans'][0]['start'],r['evidenceSpans'][0]['end']),(3,9))


if __name__ == '__main__':
    unittest.main()
