import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('major', Path(__file__).with_name('extract-major-omission-benchmark.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class MajorBenchmarkTests(unittest.TestCase):
    def test_single_reserved_number_is_not_an_instruction(self):
        m.check_contents(['761','763'], ['761','763'], '761. Duty\n762. \nReserved for Future Use\n763. Factors\n')

    def test_missing_duplicate_and_unexpected_body_entries_fail(self):
        for extracted in [['520'], ['520','520'], ['520','526','527']]:
            with self.assertRaises(ValueError):
                m.check_contents(['520','526'], extracted, '520. Murder\n526. Aiding\n')

    def test_general_contents_cannot_hide_chapter_entry(self):
        with self.assertRaises(ValueError):
            m.check_contents(['520','526'], ['520','526'], '520. Murder\n526–540. Reserved for Future Use\n')
        m.check_contents(['520','526'], ['520','526'], '520. Murder\n526. Aiding\n527–540. Reserved for Future Use\n')

    def test_letter_suffix_is_retained(self):
        m.check_contents(['540A','540B'], ['540A','540B'], '540A.\nFatal act\n540B.\nCoparticipant\n')

if __name__ == '__main__':
    unittest.main()
