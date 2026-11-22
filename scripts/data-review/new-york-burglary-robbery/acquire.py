"""Research-only acquisition of this batch's 12 additional Senate dependencies."""
import importlib.util, pathlib, sys
parent=pathlib.Path(__file__).resolve().parent.parent/'new-york-first-pass'/'acquire.py'
spec=importlib.util.spec_from_file_location('ny_candidate_acquire',parent)
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
module.BENCHMARK=['10.00','15.05','25.00','160.00','60.01','60.05','60.12','65.00','70.00','70.02','70.45','VAT:125']
module.DEPENDENCIES=[]
if __name__=='__main__':
    if len(sys.argv)!=2: raise SystemExit('Usage: acquire.py /absolute/new/external-candidate-directory')
    module.acquire(sys.argv[1])
