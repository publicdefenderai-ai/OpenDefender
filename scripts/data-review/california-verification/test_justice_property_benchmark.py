import importlib.util
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('justice',Path(__file__).with_name('extract-justice-property-benchmark.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class JusticePropertyBenchmarkTests(unittest.TestCase):
    def test_single_reserved_number_is_not_an_instruction(self):
        toc='1808. Organized Retail Theft\n1809. \nReserved for Future Use\n1810. Diversion of Construction Funds'
        self.assertEqual(m.contents_inventory(toc),['1808','1810'])
        m.check_inventory(['1808','1810'],['1808','1810'],toc)
        with self.assertRaises(ValueError):m.check_inventory(['1808'],['1808'],toc)
    def test_missing_last_family_entries_are_not_lost_by_numeric_cutoff(self):
        toc='2997. Money Laundering\n3001. Failure to Appear\n3002. Failure to Appear on Own Recognizance\n3010. Recording Communications'
        with self.assertRaises(ValueError):m.check_inventory(['2997'],['2997'],toc)
        m.check_inventory(['2997','3001','3002','3010'],['2997','3001','3002','3010'],toc)
    def test_subdivision_range_is_not_an_extra_statute(self):
        self.assertEqual(m.source_keys('2765. Misappropriation (Pen. Code § 424(a)(1–7))'),['PEN:424'])
        self.assertEqual(m.source_keys('1801. Grading (Pen. Code, §§ 486, 487–488, 490.2)'),['PEN:486','PEN:487','PEN:488','PEN:490.2'])
    def test_code_identity_and_letter_suffixes(self):
        for text,expected in [('1820. Taking Vehicle (Veh. Code, § 10851(a), (b))',['VEH:10851']),('2800. Tax (Rev. & Tax. Code, § 19701(a))',['RTC:19701']),('2960. Alcohol (Bus. & Prof. Code, § 25662(a))',['BPC:25662']),('1920. Forgery (Pen. Code, § 470a)',['PEN:470a'])]:
            self.assertEqual(m.source_keys(text),expected)
        with self.assertRaises(ValueError):m.source_keys('Unknown (New Code, § 123)')
    def test_duplicate_instruction_fails_closed(self):
        with self.assertRaises(ValueError):m.check_inventory(['2700','2700'],['2700','2700'],'2700. Order\n2700. Order')
if __name__=='__main__':unittest.main()
