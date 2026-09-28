import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('benchmark', Path(__file__).with_name('extract-calcrim-benchmark.py'))
b = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b)

class BenchmarkTests(unittest.TestCase):
    def pages(self):
        return [(p, (b.EXPECTED[p-b.FIRST]+'. Test instruction\n\nBody' if p-b.FIRST < len(b.EXPECTED) else 'Continuation')) for p in range(b.FIRST,b.LAST+1)]

    def test_missing_duplicate_and_wrong_edition_instructions_fail_closed(self):
        for replacement in ['Continuation', '2300. Duplicate', '9999. Wrong edition']:
            pages=self.pages(); pages[4]=(pages[4][0],replacement)
            with self.assertRaisesRegex(ValueError,'inventory changed'):
                b.extract_instructions(pages)

    def test_page_gaps_and_far_into_page_headings_are_rejected(self):
        with self.assertRaisesRegex(ValueError,'Incomplete benchmark pages'):
            b.extract_instructions(self.pages()[:-1])
        pages=self.pages(); pages[0]=(pages[0][0],'x'*101+'\n'+pages[0][1])
        with self.assertRaisesRegex(ValueError,'boundary'):
            b.extract_instructions(pages)

    def test_instruction_spans_include_every_continuation_page(self):
        rows=b.extract_instructions(self.pages())
        self.assertEqual(len(rows),46)
        self.assertEqual(rows[-1]['lastPage'],b.LAST)
        self.assertEqual(sum(len(r['pageHashes']) for r in rows),124)
        self.assertEqual(rows[0]['pageHashes'][0]['sha256'],b.digest(self.pages()[0][1].encode()))

if __name__=='__main__':
    unittest.main()
