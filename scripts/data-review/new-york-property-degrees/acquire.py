"""Research-only acquisition of this batch's additional Senate dependencies."""
import importlib.util, pathlib, sys
parent=pathlib.Path(__file__).resolve().parent.parent/'new-york-first-pass'/'acquire.py'
spec=importlib.util.spec_from_file_location('ny_candidate_acquire',parent)
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
module.BENCHMARK=['155.20','145.10','145.12','265.00','GBS:511','VAT:123','RCO:2','70.10']
module.DEPENDENCIES=[]
if __name__=='__main__':
    if len(sys.argv)!=2: raise SystemExit('Usage: acquire.py /absolute/new/external-candidate-directory')
    module.acquire(sys.argv[1])
