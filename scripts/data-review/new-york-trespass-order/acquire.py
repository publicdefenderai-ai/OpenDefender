"""Research-only acquisition of this batch's additional Senate dependencies."""
import importlib.util, pathlib, sys
parent=pathlib.Path(__file__).resolve().parent.parent/'new-york-first-pass'/'acquire.py'
spec=importlib.util.spec_from_file_location('ny_candidate_acquire',parent)
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
module.BENCHMARK=['COR:168-A','COR:168-F','COR:168-L','JUD:753-A']
module.DEPENDENCIES=[]
if __name__=='__main__':
    if len(sys.argv)!=2: raise SystemExit('Usage: acquire.py /absolute/new/external-candidate-directory')
    module.acquire(sys.argv[1])
