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

# ── Maryland parser ───────────────────────────────────────────────────────────

# Maryland code article abbreviations → full citation prefix
MD_CODE_MAP = {
    "CR":  "Md. Code Ann., Crim. Law §",
    "CP":  "Md. Code Ann., Crim. Proc. §",
    "TR":  "Md. Code Ann., Transp. §",
    "HO":  "Md. Code Ann., Health-Occ. §",
    "HG":  "Md. Code Ann., Health-Gen. §",
    "BO":  "Md. Code Ann., Bus. Occ. & Prof. §",
    "BR":  "Md. Code Ann., Bus. Reg. §",
    "CA":  "Md. Code Ann., Corps. & Ass'ns §",
    "CL":  "Md. Code Ann., Com. Law §",
    "CS":  "Md. Code Ann., Corp. & Ass'ns §",
    "EC":  "Md. Code Ann., Elec. §",
    "ED":  "Md. Code Ann., Educ. §",
    "EN":  "Md. Code Ann., Env't §",
    "ET":  "Md. Code Ann., Est. & Trusts §",
    "FA":  "Md. Code Ann., Fam. Law §",
    "FI":  "Md. Code Ann., Fin. Inst. §",
    "FL":  "Md. Code Ann., Fam. Law §",
    "FP":  "Md. Code Ann., For. Pol. §",
    "GS":  "Md. Code Ann., Gen. Prov. §",
    "IN":  "Md. Code Ann., Ins. §",
    "LG":  "Md. Code Ann., Local Gov't §",
    "NR":  "Md. Code Ann., Nat. Res. §",
    "PS":  "Md. Code Ann., Pub. Safety §",
    "PU":  "Md. Code Ann., Pub. Util. §",
    "RP":  "Md. Code Ann., Real Prop. §",
    "SF":  "Md. Code Ann., State Fin. & Proc. §",
    "SG":  "Md. Code Ann., State Gov't §",
    "SP":  "Md. Code Ann., State Pers. & Pens. §",
    "TP":  "Md. Code Ann., Tax-Prop. §",
    "TG":  "Md. Code Ann., Tax-Gen. §",
}


def parse_md() -> list[dict]:
    import pdfplumber

    path = SOURCE_DIR / "MD - offensetable.pdf"
    results = []
    skipped = 0
    current_category = ""

    # Table columns: [entry_num, category+name, offense_code, citation, F/M, max_penalty, blank, person/prop, cat_class, blank]
    with pdfplumber.open(str(path)) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if len(row) < 5:
                        continue
                    raw_name = clean(row[1]) if len(row) > 1 else ""
                    citation_raw = clean(row[3]) if len(row) > 3 else ""
                    fm_raw = clean(row[4]) if len(row) > 4 else ""
                    cat_class = clean(row[8]) if len(row) > 8 else ""

                    if not raw_name or not citation_raw:
                        skipped += 1
                        continue
                    if fm_raw.upper() in ("FELONY/MISDEMEANOR", "F/M", "TYPE"):
                        continue  # header row

                    # raw_name format: "Category\nOffense Name" or just "Offense Name"
                    # Split on newline — first line is category, subsequent are name
                    parts = [p.strip() for p in row[1].split("\n") if p.strip()] if row[1] else []
                    if len(parts) >= 2:
                        current_category = parts[0]
                        offense_name = " ".join(parts[1:])
                    elif parts:
                        offense_name = parts[0]
                    else:
                        skipped += 1
                        continue

                    if not offense_name or len(offense_name) < 3:
                        skipped += 1
                        continue

                    # Expand MD code abbreviation
                    # citation_raw like "CR, §3-601(b)(2)(ii)" or "CR, §3-601"
                    cit_match = re.match(r'^([A-Z]{2,3}),?\s*§?\s*(.+)$', citation_raw.replace("\n", ""))
                    if cit_match:
                        abbr = cit_match.group(1).strip()
                        section = cit_match.group(2).strip().lstrip("§").strip()
                        # Remove OCR-artifact spaces within section numbers (e.g. "3- 601" → "3-601")
                        section = re.sub(r'(\d)\s*-\s*(\d)', r'\1-\2', section)
                        section = re.sub(r'(\d)\s*\.\s*(\d)', r'\1.\2', section)
                        section = re.sub(r'\s{2,}', ' ', section).strip()
                        prefix = MD_CODE_MAP.get(abbr, f"Md. Code Ann., {abbr} §")
                        citation = f"{prefix} {section}"
                    else:
                        citation = citation_raw

                    i_felony = "felony" in fm_raw.lower()
                    i_misdemeanor = "misdemeanor" in fm_raw.lower()

                    charge_class = cat_class if cat_class else fm_raw

                    results.append({
                        "state": "MD",
                        "chargeName": offense_name,
                        "citation": citation,
                        "chargeClass": charge_class,
                        "isFelony": i_felony,
                        "isMisdemeanor": i_misdemeanor,
                        "category": current_category,
                        "source": "Maryland MSCCSP Offense Table Jan 2026",
                    })

    # Deduplicate by citation + name
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  MD: {len(deduped)} unique charges parsed ({skipped} rows skipped)")
    return deduped


# ── Michigan parser ───────────────────────────────────────────────────────────

def parse_mi() -> list[dict]:
    import pdfplumber

    path = SOURCE_DIR / "MI - 2025 Sentencing Guidelines.pdf"
    results = []
    skipped = 0

    # Felony list is on pages 141–180 (index 140–179), in MCL order
    # Columns: [blank, MCL_number, category, class, description, stat_max, date_added]
    # Skip alphabetical list (pages 181+) to avoid duplicates

    felony_classes = {"A", "B", "C", "D", "E", "F", "G", "H"}

    with pdfplumber.open(str(path)) as pdf:
        for page_num in range(140, min(180, len(pdf.pages))):
            page = pdf.pages[page_num]
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if len(row) < 5:
                        continue
                    mcl_raw = clean(row[1])
                    category = clean(row[2])
                    cls = clean(row[3])
                    description = clean(row[4])

                    if not mcl_raw or not description:
                        skipped += 1
                        continue
                    if "MCL #" in mcl_raw or "Felonies by" in mcl_raw or "Description" in description:
                        continue  # header

                    # MCL number cleanup: "MCL\n750.316" or "MCL 750.316"
                    mcl_clean = re.sub(r'\s+', ' ', mcl_raw).replace("MCL ", "").strip()
                    if not mcl_clean or not re.match(r'[\d]', mcl_clean):
                        skipped += 1
                        continue

                    citation = f"Mich. Comp. Laws § {mcl_clean}"

                    # All entries in this section are felonies
                    charge_class = f"Felony class {cls}" if cls in felony_classes else cls

                    results.append({
                        "state": "MI",
                        "chargeName": description,
                        "citation": citation,
                        "chargeClass": charge_class,
                        "isFelony": True,
                        "isMisdemeanor": False,
                        "category": category,
                        "source": "Michigan Sentencing Guidelines Manual 2024",
                    })

    # Deduplicate
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  MI: {len(deduped)} unique felony charges parsed ({skipped} rows skipped, misdemeanors not in source)")
    return deduped


# ── Pennsylvania parser ───────────────────────────────────────────────────────

def parse_pa() -> list[dict]:
    import pdfplumber

    # PA uses two files — standard offenses and DUI/BUI offenses
    paths = [
        SOURCE_DIR / "PA - 8th Edition Sentencing Guidelines - 303a.9 Errata Incorporated.pdf",
        SOURCE_DIR / "PA - 8th Edition Sentencing Guidelines - 303a.10 Errata Incorporated.pdf",
    ]

    results = []
    skipped = 0

    # Current Pa.C.S. title context (most entries are 18 Pa.C.S.)
    current_title = "18 Pa.C.S."

    # Pattern: line starting with a section number
    # section number: digits + optional letter/parens/dots/asterisks
    section_pat = re.compile(r'^(\d[\w.\(\)/\*-]+)\s+(.+?)\s+((?:F|M)-\d|S)\s+(\d+)\s+(POG\d+|N/A)(.*)?$')
    title_pat = re.compile(r'(\d+)\s+Pa\.?C\.?S\.?', re.IGNORECASE)

    for path in paths:
        if not path.exists():
            continue

        with pdfplumber.open(str(path)) as pdf:
            for page in pdf.pages:
                text = page.extract_text() or ""

                # Detect title changes ("75 Pa.C.S. §", "42 Pa.C.S. §" etc.)
                for line in text.split("\n"):
                    title_m = title_pat.search(line)
                    if title_m and "Pa.C.S." in line and "§" not in line[:20]:
                        current_title = f"{title_m.group(1)} Pa.C.S."

                # Parse offense lines
                # Handle wrapped lines: if a line ends mid-description, next line continues it
                lines = text.split("\n")
                i = 0
                while i < len(lines):
                    line = lines[i].strip()
                    # Skip standalone page numbers (e.g. "905") — they match section_pat
                    # via wrapped-line logic but are not section numbers
                    if re.match(r'^\d{1,4}$', line):
                        skipped += 1
                        i += 1
                        continue
                    # Try to match as a data line
                    m = section_pat.match(line)
                    if not m:
                        # Check if next line completes a wrapped description
                        if i + 1 < len(lines):
                            combined = line + " " + lines[i + 1].strip()
                            m = section_pat.match(combined)
                            if m:
                                i += 1  # consumed next line
                    if m:
                        section = m.group(1).rstrip("*")
                        description = m.group(2).strip()
                        offense_class = m.group(3)
                        citation = f"{current_title} § {section}"

                        i_felony = offense_class.startswith("F")
                        i_misdemeanor = offense_class.startswith("M")
                        i_summary = offense_class == "S"

                        if not i_summary:  # skip summaries
                            results.append({
                                "state": "PA",
                                "chargeName": description,
                                "citation": citation,
                                "chargeClass": offense_class,
                                "isFelony": i_felony,
                                "isMisdemeanor": i_misdemeanor,
                                "source": "PA Commission on Sentencing 8th Edition 2024",
                            })
                    else:
                        skipped += 1
                    i += 1

    # Deduplicate
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  PA: {len(deduped)} unique charges parsed ({skipped} lines skipped)")
    return deduped


PARSERS = {
    "KS": parse_kansas,
    "NC": parse_nc,
    "MO": parse_mo,
    "MD": parse_md,
    "MI": parse_mi,
    "PA": parse_pa,
}

def main():
    state_filter = None
    if "--state" in sys.argv:
        idx = sys.argv.index("--state")
        state_filter = sys.argv[idx + 1].upper()

    states_to_run = [state_filter] if state_filter else list(PARSERS.keys())

    # Load existing output if merging
    existing = []
    if OUTPUT_FILE.exists():
        with open(OUTPUT_FILE) as f:
            existing = json.load(f)
        if state_filter:
            print(f"Loaded {len(existing)} existing entries from {OUTPUT_FILE.name} (will replace {state_filter})")
        else:
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
