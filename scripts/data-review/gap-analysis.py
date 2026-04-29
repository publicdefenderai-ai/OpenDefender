#!/usr/bin/env python3
"""
Gap analysis: compare our criminal-charges.ts entries against parsed
sentencing commission data for KS, NC, and MO.

Outputs: scripts/data-review/output/gap-analysis-report.json
         scripts/data-review/output/gap-analysis-summary.txt

For each state reports:
  - Charges we have that have NO plausible match in the authoritative source
    (potential phantom / wrong jurisdiction)
  - Charges in the authoritative source that have NO match in our database
    (missing charges)
  - Citation mismatches: we have the charge but our citation differs from the
    authoritative source citation
"""

import json
import re
import unicodedata
from pathlib import Path
from collections import defaultdict

OUTPUT_DIR = Path(__file__).parent / "output"

# ── Text normalization for fuzzy matching ─────────────────────────────────────

def normalize(text: str) -> str:
    """Lowercase, strip punctuation and common legal noise for comparison."""
    if not text:
        return ""
    t = text.lower()
    # Remove degree/ordinal words that vary between sources
    t = re.sub(r'\b(first|second|third|fourth|1st|2nd|3rd|4th)\b', '', t)
    t = re.sub(r'\b(degree|class|level|grade)\b', '', t)
    # Remove common connector words
    t = re.sub(r'\b(in the|of the|to the|by|with|and|or|a|an|the)\b', ' ', t)
    # Remove punctuation
    t = re.sub(r'[^a-z0-9\s]', ' ', t)
    # Normalize whitespace
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def tokens(text: str) -> set:
    return set(normalize(text).split())


def match_score(name_a: str, name_b: str) -> float:
    """Jaccard similarity on normalized token sets."""
    ta = tokens(name_a)
    tb = tokens(name_b)
    if not ta or not tb:
        return 0.0
    intersection = len(ta & tb)
    union = len(ta | tb)
    return intersection / union if union else 0.0


MATCH_THRESHOLD = 0.40  # minimum score to consider a match


def find_best_match(name: str, candidates: list) -> tuple:
    """Return (best_match_entry, score) from candidates list."""
    best = None
    best_score = 0.0
    for c in candidates:
        score = match_score(name, c["chargeName"])
        if score > best_score:
            best_score = score
            best = c
    if best_score >= MATCH_THRESHOLD:
        return best, best_score
    return None, best_score


# ── Citation comparison ───────────────────────────────────────────────────────

def extract_section(citation: str) -> str:
    """Extract just the section number from a citation for comparison."""
    if not citation:
        return ""
    # Match section numbers like 14-17, 565.050, 21-5402
    m = re.search(r'§\s*([\d\w\-\.]+)', citation)
    if m:
        return m.group(1).strip().rstrip('.')
    return ""


# ── Load data ─────────────────────────────────────────────────────────────────

def load_our_charges(state: str) -> list[dict]:
    with open("/tmp/our_charges.json") as f:
        all_charges = json.load(f)
    return [c for c in all_charges if c["jurisdiction"] == state]


def load_our_citations(state: str) -> dict[str, dict]:
    """Load citation overlay entries for a state. Returns dict keyed by chargeId."""
    with open("shared/criminal-charge-citations.ts") as f:
        content = f.read()

    citations = {}
    # Find entries for this state
    state_lower = state.lower()
    # Match overlay entries: "xx-charge-id": { citation: "...", confidence: "...", ... }
    pattern = re.compile(
        r'"(' + state_lower + r'-[^"]+)":\s*\{([^}]+)\}',
        re.DOTALL
    )
    for m in pattern.finditer(content):
        charge_id = m.group(1)
        block = m.group(2)
        entry = {"chargeId": charge_id}
        for field in ["citation", "confidence", "source", "sourceUrl"]:
            fm = re.search(rf'{field}:\s*[\'"]([^\'"]*)[\'"]', block)
            if fm:
                entry[field] = fm.group(1)
        citations[charge_id] = entry
    return citations


def load_authoritative(state: str) -> list[dict]:
    with open(OUTPUT_DIR / "parsed-state-charges.json") as f:
        all_data = json.load(f)
    return [e for e in all_data if e["state"] == state]


# ── Analysis ──────────────────────────────────────────────────────────────────

def analyze_state(state: str) -> dict:
    our_charges = load_our_charges(state)
    our_citations = load_our_citations(state)
    auth_charges = load_authoritative(state)

    print(f"\n{'='*60}")
    print(f"{state}: {len(our_charges)} ours vs {len(auth_charges)} authoritative")
    print(f"  Citation overlay entries: {len(our_citations)}")

    # For each of OUR charges, find the best match in authoritative source
    unmatched_ours = []   # we have, authoritative doesn't
    matched_ours = []     # matched with score + citation comparison

    for charge in our_charges:
        our_name = charge["name"]
        our_id = charge["id"]
        our_citation_entry = our_citations.get(our_id, {})
        our_citation = our_citation_entry.get("citation", charge.get("code", ""))

        best_match, score = find_best_match(our_name, auth_charges)

        if best_match is None:
            unmatched_ours.append({
                "chargeId": our_id,
                "chargeName": our_name,
                "category": charge.get("category", ""),
                "ourCitation": our_citation,
                "bestScore": round(score, 3),
                "confidence": our_citation_entry.get("confidence", "unverified"),
            })
        else:
            auth_citation = best_match["citation"]
            our_section = extract_section(our_citation)
            auth_section = extract_section(auth_citation)
            citation_mismatch = bool(
                our_section and auth_section and our_section != auth_section
            )

            matched_ours.append({
                "chargeId": our_id,
                "chargeName": our_name,
                "authChargeName": best_match["chargeName"],
                "matchScore": round(score, 3),
                "ourCitation": our_citation,
                "authCitation": auth_citation,
                "citationMismatch": citation_mismatch,
                "ourSection": our_section,
                "authSection": auth_section,
                "confidence": our_citation_entry.get("confidence", "unverified"),
                "authChargeClass": best_match.get("chargeClass", ""),
                "authIsFelony": best_match.get("isFelony", False),
                "authIsMisdemeanor": best_match.get("isMisdemeanor", False),
            })

    # For each AUTHORITATIVE charge, check if we have it
    # Build index of our normalized names for fast lookup
    our_norm_index = {normalize(c["name"]): c for c in our_charges}

    missing_from_ours = []
    for auth in auth_charges:
        best_match, score = find_best_match(auth["chargeName"], [{"chargeName": c["name"], **c} for c in our_charges])
        if best_match is None:
            missing_from_ours.append({
                "authChargeName": auth["chargeName"],
                "authCitation": auth["citation"],
                "authChargeClass": auth.get("chargeClass", ""),
                "isFelony": auth.get("isFelony", False),
                "isMisdemeanor": auth.get("isMisdemeanor", False),
                "bestScore": round(score, 3),
            })

    # Citation mismatches among matched
    citation_mismatches = [m for m in matched_ours if m["citationMismatch"]]

    # Summary stats
    matched_count = len(matched_ours)
    unmatched_count = len(unmatched_ours)
    missing_count = len(missing_from_ours)
    mismatch_count = len(citation_mismatches)

    print(f"  Matched:          {matched_count}/{len(our_charges)} of our charges found in authoritative source")
    print(f"  Unmatched (ours): {unmatched_count} charges we have with no authoritative match")
    print(f"  Missing:          {missing_count} authoritative charges not in our database")
    print(f"  Citation mismatches: {mismatch_count} matched charges with differing section numbers")

    # Print samples
    if unmatched_ours:
        print(f"\n  Sample unmatched (our charges not in authoritative source):")
        for e in unmatched_ours[:8]:
            print(f"    {e['chargeName']:<50} | {e['ourCitation']}")

    if missing_from_ours:
        print(f"\n  Sample missing (authoritative charges we don't have):")
        felony_missing = [m for m in missing_from_ours if m['isFelony']][:8]
        for e in felony_missing:
            print(f"    {e['authChargeName']:<50} | {e['authCitation']} | {e['authChargeClass']}")

    if citation_mismatches:
        print(f"\n  Sample citation mismatches:")
        for e in citation_mismatches[:6]:
            print(f"    {e['chargeName']:<40} | ours: {e['ourSection']:<15} | auth: {e['authSection']}")

    return {
        "state": state,
        "ourCount": len(our_charges),
        "authCount": len(auth_charges),
        "matchedCount": matched_count,
        "unmatchedOursCount": unmatched_count,
        "missingCount": missing_count,
        "citationMismatchCount": mismatch_count,
        "unmatchedOurs": unmatched_ours,
        "citationMismatches": citation_mismatches,
        "missingFromOurs": missing_from_ours,
        "matchedOurs": matched_ours,
    }


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    import sys
    # Allow --state XX[,YY,...] override; default to all parsed states
    state_arg = None
    if "--state" in sys.argv:
        idx = sys.argv.index("--state")
        state_arg = sys.argv[idx + 1].upper()

    if state_arg:
        states = [s.strip() for s in state_arg.split(",")]
    else:
        states = ["KS", "NC", "MO", "MD", "MI", "PA"]

    results = {}

    for state in states:
        results[state] = analyze_state(state)

    # Write full report
    report_path = OUTPUT_DIR / "gap-analysis-report.json"
    # Merge with existing report if it exists and we're running a subset
    if state_arg and report_path.exists():
        with open(report_path) as f:
            existing_report = json.load(f)
        existing_report.update(results)
        results = existing_report

    with open(report_path, "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\nFull report written to {report_path}")

    # Write human-readable summary
    summary_path = OUTPUT_DIR / "gap-analysis-summary.txt"
    state_labels = {
        "KS": "KS Sentencing Commission 2013",
        "NC": "NC Combined Offense List Dec 2025",
        "MO": "MO Charge Code Manual Feb 2026",
        "MD": "Maryland MSCCSP Offense Table Jan 2026",
        "MI": "MI Sentencing Guidelines Oct 2024",
        "PA": "PA Commission on Sentencing 8th Edition 2024",
        "WA": "Washington Adult Sentencing Manual Oct 2025",
        "MN": "Minnesota Sentencing Guidelines Aug 2025",
        "AR": "Arkansas Sentencing Commission Benchbook 2026",
        "VA": "Virginia Crime Code System FY17",
        "AL": "Alabama Sentencing Commission Presumptive Manual 2024",
        "TX": "Texas Legislative Council Felony Offenses 2018",
    }
    with open(summary_path, "w") as f:
        f.write(f"GAP ANALYSIS SUMMARY — {', '.join(results.keys())}\n")
        sources = ", ".join(state_labels.get(s, s) for s in results.keys())
        f.write(f"Generated against: {sources}\n\n")

        for state, r in results.items():
            f.write(f"{'='*70}\n{state}\n{'='*70}\n")
            f.write(f"Our entries:            {r['ourCount']}\n")
            f.write(f"Authoritative entries:  {r['authCount']}\n")
            f.write(f"Matched:                {r['matchedCount']} ({r['matchedCount']*100//r['ourCount']}%)\n")
            f.write(f"Unmatched (phantom?):   {r['unmatchedOursCount']}\n")
            f.write(f"Missing from ours:      {r['missingCount']}\n")
            f.write(f"Citation mismatches:    {r['citationMismatchCount']}\n\n")

            f.write("UNMATCHED — charges we have with no authoritative match:\n")
            for e in r["unmatchedOurs"]:
                f.write(f"  [{e['category'][:1].upper()}] {e['chargeName']:<50} | {e['ourCitation']} | confidence: {e['confidence']}\n")

            f.write("\nCITATION MISMATCHES — matched charges with differing section numbers:\n")
            for e in r["citationMismatches"]:
                f.write(f"  {e['chargeName']:<45} | ours: {e['ourSection']:<18} | auth: {e['authSection']}\n")

            f.write("\nMISSING FELONIES — in authoritative source but not in our database:\n")
            felonies = [m for m in r["missingFromOurs"] if m["isFelony"]]
            for e in felonies[:40]:
                f.write(f"  {e['authChargeName']:<50} | {e['authCitation']} | {e['authChargeClass']}\n")
            if len(felonies) > 40:
                f.write(f"  ... and {len(felonies)-40} more felonies\n")

            f.write("\nMISSING MISDEMEANORS — in authoritative source but not in our database (sample):\n")
            misds = [m for m in r["missingFromOurs"] if m["isMisdemeanor"]]
            for e in misds[:20]:
                f.write(f"  {e['authChargeName']:<50} | {e['authCitation']} | {e['authChargeClass']}\n")
            if len(misds) > 20:
                f.write(f"  ... and {len(misds)-20} more misdemeanors\n")
            f.write("\n")

    print(f"Summary written to {summary_path}")


if __name__ == "__main__":
    main()
