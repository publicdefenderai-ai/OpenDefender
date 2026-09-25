import importlib.util
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('extract_bulk', Path(__file__).with_name('extract-bulk.py'))
bulk = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bulk)


def row(law, section, member, version='v1'):
    data = ['1', law, section, '', '', '', '2026-01-01', version, '', '', '', '', '', 'History\\nnext line', member, 'Y', '', '2026-09-20']
    return '\t'.join('`' + field + '`' for field in data) + '\n'


class ExtractionTests(unittest.TestCase):
    def test_schema_drift_fails(self):
        with self.assertRaises(ValueError):
            bulk.parse_row('too\tfew\n')

    def test_mysql_escapes_preserve_literal_backslashes(self):
        self.assertEqual(bulk.decode_field(r'`one\nline\\n`'), 'one\nline\\n')
        self.assertIsNone(bulk.decode_field(r'\N'))
        self.assertIsNone(bulk.decode_field('NULL'))
        self.assertEqual(bulk.decode_field('`NULL`'), 'NULL')

    def test_versions_and_code_identity_are_not_collapsed(self):
        with tempfile.TemporaryDirectory() as directory:
            archive = Path(directory) / 'source.zip'
            with zipfile.ZipFile(archive, 'w') as z:
                z.writestr('LAW_SECTION_TBL.dat', row('PEN','240.','LAW_SECTION_TBL_1.lob') + row('PEN','240.','LAW_SECTION_TBL_2.lob','v2') + row('VEH','240.','LAW_SECTION_TBL_3.lob'))
                for index in range(1,4): z.writestr(f'LAW_SECTION_TBL_{index}.lob', f'<text>version {index}</text>')
            result = bulk.extract(archive, [{'lawCode':'PEN','section':'240'},{'lawCode':'PEN','section':'999'}])
            self.assertEqual([v['versionId'] for v in result[0]['versions']], ['v1','v2'])
            self.assertNotEqual(result[0]['versions'][0]['contentSha256'], result[0]['versions'][1]['contentSha256'])
            self.assertEqual(result[1]['versions'], [])

    def test_unexpected_lob_path_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            archive = Path(directory) / 'source.zip'
            with zipfile.ZipFile(archive, 'w') as z:
                z.writestr('LAW_SECTION_TBL.dat', row('PEN','240.','../private-file'))
            with self.assertRaises(ValueError): bulk.extract(archive, [{'lawCode':'PEN','section':'240'}])


if __name__ == '__main__': unittest.main()
