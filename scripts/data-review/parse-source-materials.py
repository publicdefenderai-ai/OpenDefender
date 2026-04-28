#!/usr/bin/env python3
"""
Parse downloaded sentencing commission source materials into normalized JSON.

Outputs: scripts/data-review/output/parsed-state-charges.json
Format per entry:
  {
    "state": "NC",
    "chargeName": "First-degree murder",
    "citation": "G.S. 14-17",
    "chargeClass": "A",
    "isFelony": true,
    "isMisdemeanor": false,
    "source": "NC Combined Offense List 2025"
  }

Usage:
  python3 scripts/data-review/parse-source-materials.py
  python3 scripts/data-review/parse-source-materials.py --state KS
  python3 scripts/data-review/parse-source-materials.py --state NC
  python3 scripts/data-review/parse-source-materials.py --state MO
"""

import json
import re
import sys
import os
from pathlib import Path
from typing import Optional

SOURCE_DIR = Path(__file__).parent / "source-materials"
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_FILE = OUTPUT_DIR / "parsed-state-charges.json"

# ── Helpers ──────────────────────────────────────────────────────────────────

def clean(s) -> str:
    if s is None:
        return ""
    return str(s).strip().replace("\n", " ").replace("  ", " ").strip()


def is_felony(class_str: str) -> bool:
    c = class_str.upper()
    return any(x in c for x in ["FELONY", "F/", "/F", "OFF-GRID", "SEVERITY"])


def is_misdemeanor(class_str: str) -> bool:
    c = class_str.upper()
    return "MISD" in c or "M/" in c or "/M" in c or c in ["A", "B", "C"] and "FELONY" not in c


# ── Kansas parser ─────────────────────────────────────────────────────────────

def parse_kansas() -> list[dict]:
    import xlrd

    results = []

    files = [
        ("KS - felony-listings.xls", "felony"),
        ("KS - misdemeanor-listings.xls", "misdemeanor"),
    ]

    for filename, charge_type in files:
        path = SOURCE_DIR / filename
        wb = xlrd.open_workbook(str(path))
        ws = wb.sheet_by_name("statute")

        # Row 0 = headers, Row 1 = sub-headers (A/C/S columns), Row 2+ = data
        for row_idx in range(2, ws.nrows):
            row = ws.row_values(row_idx)
            if not any(row):
                continue

            description = clean(row[2])
            if not description:
                continue

            # Use new statute number (col 8 for felony, col 7 for misdemeanor)
            if charge_type == "felony":
                new_statute = clean(row[8])
                severity_raw = row[3]
                # xlrd returns numeric cells as floats; convert e.g. 1.0 → "1"
                if isinstance(severity_raw, float) and severity_raw == int(severity_raw):
                    severity = str(int(severity_raw))
                else:
                    severity = clean(severity_raw)
                person = clean(row[7])
                charge_class = f"Felony severity {severity}" if severity else "Felony"
            else:
                new_statute = clean(row[7])
                severity = clean(row[3])
                person = clean(row[6])
                charge_class = f"Misdemeanor class {severity}" if severity else "Misdemeanor"

            if not new_statute:
                continue

            citation = f"K.S.A. § {new_statute}" if new_statute else ""

            results.append({
                "state": "KS",
                "chargeName": description,
                "citation": citation,
                "chargeClass": charge_class,
                "isFelony": charge_type == "felony",
                "isMisdemeanor": charge_type == "misdemeanor",
                "personCategory": person,
                "source": "Kansas Sentencing Commission 2013",
            })

    print(f"  KS: {len(results)} charges parsed")
    return results


# ── North Carolina parser ─────────────────────────────────────────────────────

def parse_nc() -> list[dict]:
    import pdfplumber

    path = SOURCE_DIR / "NC - Combined Offense List by GS Number 2025.pdf"
    results = []
    skipped = 0

    # Class mapping: NC uses numbers for misdemeanors (1,2,3) and letters for felonies (A-I)
    felony_classes = {"A", "B1", "B2", "C", "D", "E", "F", "G", "H", "I"}
    misdemeanor_classes = {"1", "2", "3", "A1"}

    with pdfplumber.open(str(path)) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if len(row) < 3:
                        continue
                    statute_raw = clean(row[0])
                    class_raw = clean(row[1])
                    offense_raw = clean(row[2])

                    # Skip header rows
                    if "GENERAL STATUTES" in statute_raw.upper() or "SECTION" in statute_raw.upper():
                        continue
                    if not offense_raw or not class_raw:
                        skipped += 1
                        continue

                    # Normalize class
                    charge_class = class_raw.upper()
                    i_felony = charge_class in felony_classes
                    i_misdemeanor = charge_class in misdemeanor_classes

                    # Build citation
                    if statute_raw.lower().startswith("common law"):
                        citation = "Common Law"
                    else:
                        # Strip any trailing/leading noise
                        section = re.sub(r'\s+', ' ', statute_raw)
                        citation = f"N.C. Gen. Stat. § {section}"

                    results.append({
                        "state": "NC",
                        "chargeName": offense_raw,
                        "citation": citation,
                        "chargeClass": charge_class,
                        "isFelony": i_felony,
                        "isMisdemeanor": i_misdemeanor,
                        "source": "NC Combined Offense List Dec 2025",
                    })

    print(f"  NC: {len(results)} charges parsed ({skipped} rows skipped)")
    return results


# ── Missouri parser ───────────────────────────────────────────────────────────

def parse_mo() -> list[dict]:
    import pdfplumber

    path = SOURCE_DIR / "MO - CombinedChargeCodeManual02112026.pdf"
    results = []
    skipped = 0

    # Data starts after the instructions pages (around page 10+)
    # Charge code format: 565.050-001Y202013__._
    # Statute citation = text before the first '-'
    charge_code_pattern = re.compile(r'^(\d+\.\d+[A-Z]?)-')

    with pdfplumber.open(str(path)) as pdf:
        for page_num, page in enumerate(pdf.pages):
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if not row or len(row) < 5:
                        continue

                    charge_code = clean(row[0])
                    description = clean(row[3])
                    type_class = clean(row[4])

                    # Skip headers and non-data rows
                    if not charge_code or not description:
                        continue
                    if "CHARGE CODE" in charge_code.upper() or "DESCRIPTION" in description.upper():
                        continue

                    # Extract statute from charge code
                    m = charge_code_pattern.match(charge_code)
                    if not m:
                        skipped += 1
                        continue

                    statute = m.group(1)
                    citation = f"Mo. Rev. Stat. § {statute}"

                    # Parse type/class: "F/A" = Felony Class A, "M/B" = Misdemeanor Class B
                    tc = type_class.upper()
                    i_felony = tc.startswith("F")
                    i_misdemeanor = tc.startswith("M")
                    i_infraction = tc.startswith("I")

                    charge_class = type_class if type_class else ""

                    if not i_felony and not i_misdemeanor and not i_infraction:
                        skipped += 1
                        continue

                    results.append({
                        "state": "MO",
                        "chargeName": description.title(),  # normalize ALL CAPS to Title Case
                        "citation": citation,
                        "chargeClass": charge_class,
                        "isFelony": i_felony,
                        "isMisdemeanor": i_misdemeanor,
                        "source": "Missouri Charge Code Manual Feb 2026",
                    })

    # Deduplicate: same citation + description can appear multiple times (modifiers)
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  MO: {len(deduped)} unique charges parsed (deduped from {len(results)}, {skipped} rows skipped)")
    return deduped


# ── Main ──────────────────────────────────────────────────────────────────────

PARSERS = {
    "KS": parse_kansas,
    "NC": parse_nc,
    "MO": parse_mo,
}

def main():
    state_filter = None
    if "--state" in sys.argv:
        idx = sys.argv.index("--state")
        state_filter = sys.argv[idx + 1].upper()

    states_to_run = [state_filter] if state_filter else list(PARSERS.keys())

    # Load existing output if merging
    existing = []
    if OUTPUT_FILE.exists() and not state_filter:
        with open(OUTPUT_FILE) as f:
            existing = json.load(f)
        print(f"Loaded {len(existing)} existing entries from {OUTPUT_FILE.name}")

    all_results = []
    for state in states_to_run:
        if state not in PARSERS:
            print(f"No parser for state: {state}")
            continue
        print(f"Parsing {state}...")
        try:
            results = PARSERS[state]()
            all_results.extend(results)
        except Exception as e:
            print(f"  ERROR parsing {state}: {e}")
            raise

    if state_filter:
        # Replace entries for this state in existing output
        existing = [e for e in existing if e.get("state") != state_filter]
        combined = existing + all_results
    else:
        combined = all_results

    OUTPUT_DIR.mkdir(exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(combined, f, indent=2, ensure_ascii=False)

    # Summary
    from collections import Counter
    by_state = Counter(e["state"] for e in combined)
    print(f"\nTotal: {len(combined)} entries written to {OUTPUT_FILE}")
    print("By state:")
    for state, count in sorted(by_state.items()):
        print(f"  {state}: {count}")


if __name__ == "__main__":
    main()
