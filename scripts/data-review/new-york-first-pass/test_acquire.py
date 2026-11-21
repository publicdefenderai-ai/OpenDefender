import pathlib, tempfile, unittest
from acquire import parse, acquire

class CandidateAcquisitionTests(unittest.TestCase):
    def test_self_closing_breaks_keep_entire_statutory_body(self):
        page='<h3 class="nys-openleg-result-title-short">Petit larceny</h3><div class="nys-openleg-result-text">&sect; 155.25 Petit larceny.<br /><br />A person is guilty of petit larceny when he steals property.<br /><br />Petit larceny is a class A misdemeanor.<br /></div><footer>Ignore this</footer>'
        title,text=parse(page,'155.25')
        self.assertEqual(title,'Petit larceny')
        self.assertTrue(text.endswith('Petit larceny is a class A misdemeanor.'))
        self.assertNotIn('Ignore this',text)
        self.assertIn('\n\nA person',text)
    def test_wrong_section_or_heading_only_is_rejected(self):
        for body in ['§ 155.25 Petit larceny.','§ 155.30 Other offense.\n\nThis is some other section with a substantially longer body.']:
            page=f'<h3 class="nys-openleg-result-title-short">Title</h3><div class="nys-openleg-result-text">{body}</div>'
            with self.assertRaises(ValueError): parse(page,'155.25')
    def test_long_official_heading_alone_is_not_substantive_text(self):
        title='Criminal possession of stolen property in the fifth degree'
        page=f'<h3 class="nys-openleg-result-title-short">{title}</h3><div class="nys-openleg-result-text">§ 165.40 {title}.</div>'
        with self.assertRaises(ValueError): parse(page,'165.40')
    def test_checkout_output_is_rejected_before_network(self):
        with self.assertRaises(ValueError): acquire(pathlib.Path(__file__).resolve().parent/'candidate')
    def test_existing_output_rejected_before_network(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaises(FileExistsError): acquire(directory)

if __name__=='__main__':unittest.main()
