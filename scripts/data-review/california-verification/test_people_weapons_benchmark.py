import importlib.util
import unittest
from pathlib import Path
spec = importlib.util.spec_from_file_location('people', Path(__file__).with_name('extract-people-weapons-benchmark.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
def line(text, font='Helvetica-Bold', y=75):
    return dict(bbox=[0,y,400,y+12], spans=[dict(text=text,font=font,size=12)])
class PeopleWeaponsBenchmarkTests(unittest.TestCase):
    def test_letter_suffix_and_multiblock_title(self):
        blocks=[dict(lines=[line('852A. Evidence of Uncharged')]),dict(lines=[line('Domestic Violence',y=88)]),dict(lines=[line('The People presented evidence',font='Times-Bold',y=104)])]
        self.assertEqual(m.instruction_heading(blocks),('852A','852A. Evidence of Uncharged Domestic Violence'))
    def test_body_number_and_footer_not_instruction(self):
        self.assertIsNone(m.instruction_heading([dict(lines=[line('1000. Body citation',font='Times-Roman'),line('1001. Footer',y=720)])]))
    def test_independent_contents_catches_missing_or_duplicate(self):
        for extracted,toc in [(['852A'],'852A. First\n852B. Second'),(['852A','852A'],'852A. First\n852B. Second'),(['852A','852B'],'852A. First')]:
            with self.assertRaises(ValueError):m.check_inventory(['852A','852B'],extracted,toc)
        m.check_inventory(['852A','852B'],['852A','852B'],'852A. First\n852B. Second')
if __name__ == '__main__':unittest.main()
