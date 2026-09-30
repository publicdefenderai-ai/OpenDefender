"""Bind approved interpretations to source versions without rewriting historical packets."""
import importlib.util
import hashlib
import json
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
spec=importlib.util.spec_from_file_location('refresh',HERE/'refresh-retained.py')
r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)

def build():
    decisions=json.loads((ROOT/'shared/california-attorney-decisions.json').read_text())
    docs=r.retained_documents()
    keys=sorted({k for row in decisions for k in row['requiredKeys']})
    return dict(schemaVersion=1,scope='attorney_approved_interpretations_not_claims_mechanically_proven_by_statutory_spans',reviewedAt='2026-09-30',
        decisionsSha256=hashlib.sha256((ROOT/'shared/california-attorney-decisions.json').read_bytes()).hexdigest(),
        successorSha256=hashlib.sha256((r.OUTPUT/'california-attorney-source-approval.json').read_bytes()).hexdigest(),
        documents={k:docs[k] for k in keys},
        evidence=[dict(key=k,versionId=v['versionId'],contentSha256=v['contentSha256'],span=dict(start=0,end=len(v['contentXml']),text=v['contentXml'])) for k in keys for v in docs[k]],
        limitations=['Judicial URLs support attorney interpretations; no cited case is represented as directly deciding the false-imprisonment fine ceiling.', 'Court-status decision dated September 30, 2026; statutory freshness is not automated docket monitoring.', 'New penalty text is English-only with explicit fallback notices; translations await review.', 'Historical source acquisition and October 5 expiration are unchanged.'])
if __name__=='__main__':
    r.atomic_json(r.OUTPUT/'california-attorney-decision-review.json',build())
    print('Bound four decisions to retained statutory versions; no receipt renewal.')
