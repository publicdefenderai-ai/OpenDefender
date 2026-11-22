"""Acquire only the 12 new dependencies; reused evidence keeps its original dates."""
import importlib.util, pathlib, sys
parent = pathlib.Path(__file__).resolve().parent.parent / 'new-york-first-pass' / 'acquire.py'
spec = importlib.util.spec_from_file_location('ny_candidate_acquire', parent)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.BENCHMARK = ['10.00','15.00','15.05','25.00','120.15','121.14','CPL:1.20','CPL:2.10','CPL:530.12','FCT:812','FCT:828','FCT:842']
module.DEPENDENCIES = []
if __name__ == '__main__':
    if len(sys.argv) != 2: raise SystemExit('Usage: acquire.py /absolute/new/external-candidate-directory')
    module.acquire(sys.argv[1])
