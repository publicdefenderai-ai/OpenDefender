import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('review',HERE/'weapons-dependencies-review.py')
v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)

class WeaponsDependenciesTests(unittest.TestCase):
    def test_ranges_retain_decimal_sections_both_boundaries_and_all_versions(self):
        with tempfile.TemporaryDirectory() as folder:
            archive=Path(folder)/'source.zip'
            rows=[]
            for i,(law,section) in enumerate([('PEN','25900.'),('PEN','25900.5.'),('PEN','26060.'),('PEN','26060.1.'),('VEH','25900.'),('PEN','25900.')]):
                values={k:'x' for k in v.a.r.bulk.COLUMNS}
                values.update(lawCode=law,section=section,contentMember=f'LAW_SECTION_TBL_{i}.lob',versionId=str(i))
                rows.append('\t'.join(values[k] for k in v.a.r.bulk.COLUMNS))
            with zipfile.ZipFile(archive,'w') as z:
                z.writestr('LAW_SECTION_TBL.dat','\n'.join(rows))
                for i in range(len(rows)):z.writestr(f'LAW_SECTION_TBL_{i}.lob',f'<p>public source {i}</p>')
            keys=v.a.range_keys(archive,[dict(lawCode='PEN',first='25900',last='26060')])
            self.assertEqual(keys,['PEN:25900','PEN:25900.5','PEN:26060'])
            docs,missing=v.a.extract_keys(archive,keys+['PEN:999'])
            self.assertEqual(missing,['PEN:999'])
            self.assertEqual(len(docs['PEN:25900']),2)
            self.assertNotIn('transUid',docs['PEN:25900'][0])
            with self.assertRaisesRegex(ValueError,'Invalid research range'):
                v.a.range_keys(archive,[dict(lawCode='PEN',first='26060',last='25900')])

    def test_committed_packet_preserves_successor_and_does_not_publish(self):
        p=v.build()
        self.assertEqual(p,json.loads((v.OUT/'california-weapons-dependencies-review.json').read_text()))
        self.assertEqual(p['counts'],dict(requiredSections=79,reusedSections=22,newResearchSections=57,retainedVersions=81,instructions=11,newChoices=0,newPins=0,receiptRenewals=0))
        self.assertEqual(len(next(s for s in p['sources'] if s['key']=='PEN:30515')['versions']),2)
        self.assertEqual([i['id'] for i in p['instructions']],['2530','2540','2541','2542','2543','2544','2545','2546','2560','2561','2562'])
        self.assertNotIn('—',v.render(p))

    def test_corruption_missing_source_and_false_comparison_fail(self):
        packet=v.load('california-weapons-dependencies-acquisition.json')
        mutations=[
            lambda p:p['requiredKeys'].pop(),
            lambda p:p['reusedKeys'].pop(),
            lambda p:p['missingKeys'].append('PEN:30600'),
            lambda p:p.update(approvedSuccessorSha256='bad'),
            lambda p:p['retainedComparison']['sections'][0].update(observedHash='bad'),
            lambda p:p['retainedComparison']['sections'][0].update(expectedVersions=999),
            lambda p:p['documents'][next(iter(p['documents']))][0].update(contentXml='changed'),
        ]
        for mutate in mutations:
            altered=copy.deepcopy(packet);mutate(altered)
            with self.assertRaises(ValueError):v.build(altered)

if __name__=='__main__':unittest.main()
