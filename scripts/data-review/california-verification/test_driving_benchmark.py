import importlib.util
import json
import unittest
from pathlib import Path
HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('driving',HERE/'extract-driving-benchmark.py')
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class DrivingBenchmark(unittest.TestCase):
    def setUp(self):
        self.source=json.loads((HERE.parent/'output/california-driving-benchmark-source.json').read_text())
        self.pages=[(p['page'],p['text']) for p in self.source['pages']]
    def test_replay_matches_retained_instruction_boundaries(self):
        self.assertEqual(m.extract_instructions(self.pages),self.source['instructions'])
    def test_missing_page_is_rejected(self):
        with self.assertRaisesRegex(ValueError,'pages'): m.extract_instructions(self.pages[1:])
    def test_missing_or_duplicate_instruction_is_rejected(self):
        pages=list(self.pages)
        pages[0]=(pages[0][0],pages[0][1].replace('2100.','2099.',1))
        with self.assertRaisesRegex(ValueError,'inventory'):m.extract_instructions(pages)
    def test_body_reference_cannot_become_instruction_boundary(self):
        pages=list(self.pages)
        pages[0]=(pages[0][0],pages[0][1]+'\n2199. Fake body heading')
        with self.assertRaisesRegex(ValueError,'boundary'):m.extract_instructions(pages)

if __name__=='__main__':unittest.main()
