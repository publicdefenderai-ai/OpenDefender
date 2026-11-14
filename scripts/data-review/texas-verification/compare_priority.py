"""Reconcile DPS code identities against the committed manifest and a frozen public observation."""
import json
import re
import subprocess
from pathlib import Path

OUTPUT = Path("scripts/data-review/output")
LAW_IDS = {"PC": "PE", "HSC": "HS", "TRC": "TN"}
SELECTABLE = {"retain", "exact_alias_rename"}


def compare():
    ranking = json.loads((OUTPUT / "texas-2025-arrest-priorities.json").read_text())
    manifest = json.loads((OUTPUT / "tx-source-manifest.json").read_text())["catalogRecords"]
    public = json.loads((OUTPUT / "texas-priority-public-selector.json").read_text())
    live = {c["id"]: c for c in public["charges"]}
    eligible = {r["chargeId"]: r for r in manifest if r["disposition"] in SELECTABLE}
    if (set(live) != set(eligible) or len(live) != len(public["charges"]) or
            public["pagination"]["nextOffset"] is not None or len(live) != public["pagination"]["totalMatches"]):
        raise ValueError("Incomplete observation or selectable manifest/public identity mismatch")
    # Historical citation metadata can identify a held relative, but never establish legal coverage.
    script = ("import { CHARGE_CITATIONS } from './shared/criminal-charge-citations.ts';"
              "console.log(JSON.stringify(Object.fromEntries(Object.entries(CHARGE_CITATIONS)"
              ".filter(([id]) => id.startsWith('tx-')).map(([id,row]) => [id,row.citation]))))")
    citations = json.loads(subprocess.check_output(["node", "--import", "tsx", "--input-type=module", "-e", script]))
    prefixes = {"PC": "Tex. Penal Code", "HSC": "Tex. Health & Safety Code", "TRC": "Tex. Transp. Code"}
    result = []
    for dps in ranking["top25"]:
        match = re.fullmatch(r"(\d+\.\d+)(.*)", dps["citation"])
        if not match or dps["law"] not in LAW_IDS:
            raise ValueError("Unmapped ranked citation")
        section, suffix = match.groups()
        same = {}
        for identity, record in eligible.items():
            provisions = [p for p in record["provisions"] if p["lawId"] == LAW_IDS[dps["law"]] and p["section"] == section]
            if provisions:
                same[identity] = sorted({p["subdivision"] or "" for p in provisions})
        # The second-DWI ID purports to cover this encounter, but is bound to ordinary §49.04(b).
        semantic = ["tx-dui-second-offense"] if dps["code"] == "54040010" else []
        exact_reference = [k for k, scopes in same.items() if suffix in scopes]
        # The DPS unenhanced DWI code is section-wide. Both stable IDs represent different
        # recidivism scopes, so only first-offense corresponds to the ordinary code.
        if dps["code"] == "54040009":
            exact_reference = [k for k in exact_reference if k == "tx-dui-first-offense"]
        citation_pattern = re.escape(prefixes[dps["law"]]) + r" §§?\s*" + re.escape(section) + r"(?:\(|$)"
        withheld = sorted(r["chargeId"] for r in manifest if r["disposition"] not in SELECTABLE
                          and re.match(citation_pattern, citations.get(r["chargeId"], "")))
        state = ("same_reference_incomplete_penalty" if exact_reference else
                 "named_choice_wrong_grading_source" if semantic else
                 "section_only" if same else "withheld_candidate" if withheld else "no_exact_public_choice")
        result.append(dict(rank=len(result)+1, **dps, referenceMatches=exact_reference,
                           sameSectionPublic=same, semanticOnly=semantic, withheldCandidates=withheld, disposition=state))
    return result


if __name__ == "__main__":
    print(json.dumps(compare(),indent=2))
