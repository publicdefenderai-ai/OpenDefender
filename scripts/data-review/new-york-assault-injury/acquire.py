"""Research-only acquisition of this batch's additional Senate dependencies."""
import importlib.util, pathlib, sys
parent=pathlib.Path(__file__).resolve().parent.parent/'new-york-first-pass'/'acquire.py'
spec=importlib.util.spec_from_file_location('ny_candidate_acquire',parent)
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
module.BENCHMARK=['85.00','220.00','COR:40','130.16','CPL:220.10','CPL:220.30']
module.DEPENDENCIES=[]
if __name__=='__main__':
    if len(sys.argv)!=2: raise SystemExit('Usage: acquire.py /absolute/new/external-candidate-directory')
    module.acquire(sys.argv[1])
