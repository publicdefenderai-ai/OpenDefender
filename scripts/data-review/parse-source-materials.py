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


# ── Washington parser ────────────────────────────────────────────────────────

def parse_wa() -> list[dict]:
    import pdfplumber

    path = SOURCE_DIR / "WA - Adult_Sentencing_Manual_2025_3.pdf"
    results = []
    skipped = 0

    # Seriousness levels used in WA: Roman numerals, DG-I/II/III (drug grid), or Unranked
    level_pat = re.compile(
        r'\s+(A|B|C)\s+(Unranked|DG-I{1,3}|XVI|XV|XIV|XIII|XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\s*$'
    )
    # RCW pattern: starts with digit(s), has at least two dots (e.g. 9A.36.011, 20.01.460)
    rcw_start_pat = re.compile(r'^\d+[A-Z]?\.\d+[A-Z]?\.\d')

    pending_rcw = None
    pending_name = None
    pending_class = None

    def flush():
        if pending_rcw:
            name = re.sub(r'\s+', ' ', pending_name).strip()
            # Strip leading "&" artifact from compound RCW entries
            name = re.sub(r'^&\s*', '', name).strip()
            results.append({
                "state": "WA",
                "chargeName": name,
                "citation": f"Wash. Rev. Code § {pending_rcw}",
                "chargeClass": f"Class {pending_class}",
                "isFelony": True,
                "isMisdemeanor": False,
                "source": "Washington Adult Sentencing Manual Oct 2025",
            })

    skip_lines = {
        "FELONY INDEX BY OFFENSE", "Felony Index by Offense",
        "Seriousness", "Level", "Statute (RCW)", "Offense", "Class",
        "MANDATORY REMAND OFFENSES", "Unranked Offenses",
    }

    with pdfplumber.open(str(path)) as pdf:
        in_index = False
        for page_idx, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            lines = text.split("\n")

            # Detect entry into felony index section
            if not in_index:
                if "FELONY INDEX BY OFFENSE" in text or "Felony Index by Offense" in text:
                    in_index = True
                else:
                    continue

            # Detect leaving the index (next major section starts)
            if in_index and page_idx > 165:
                first = next((l.strip() for l in lines if l.strip()), "")
                if first and "Felony Index" not in text[:300] and not rcw_start_pat.match(first):
                    # Check if this page still has RCW data
                    has_rcw = any(rcw_start_pat.match(l.strip()) for l in lines)
                    if not has_rcw:
                        break

            for line in lines:
                line = line.strip()
                if not line or line in skip_lines:
                    continue
                # Skip page number / footer lines (e.g. "165 2025 Washington State...")
                if re.match(r'^\d{1,3}\s+20\d\d\s+Washington', line):
                    continue
                if re.match(r'^20\d\d\s+Washington', line):
                    continue
                # Skip "RCW 10.64.025(2)" type sub-headers
                if line.startswith("RCW ") and "(" in line and len(line) < 30:
                    continue

                m = level_pat.search(line)
                if m and rcw_start_pat.match(line):
                    flush()
                    pending_class = m.group(1)
                    before = line[:m.start()].strip()
                    # Split RCW (first token) from offense name (rest)
                    space_idx = before.find(" ")
                    if space_idx != -1:
                        pending_rcw = before[:space_idx].strip()
                        pending_name = before[space_idx:].strip()
                    else:
                        pending_rcw = before
                        pending_name = ""
                elif pending_rcw is not None:
                    # Continuation line — append to name
                    # Strip leading subsection ranges like "(i-j)" that are RCW continuations
                    cont = re.sub(r'^\([a-z\d\s\-]+\)\s*', '', line)
                    pending_name += " " + cont
                else:
                    skipped += 1

        flush()

    # Deduplicate
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  WA: {len(deduped)} unique felony charges parsed ({skipped} lines skipped)")
    return deduped


# ── Minnesota parser ──────────────────────────────────────────────────────────

def parse_mn() -> list[dict]:
    import pdfplumber

    path = SOURCE_DIR / "MN - 2025_Minn_Sentencing_Guidelines_Commentary_tcm30-700116.pdf"
    results = []
    skipped = 0

    # MN statute pattern: 3+ digits, optional uppercase letter, dot, digit — at end of line.
    # Permissive: captures everything from the section number to end-of-line.
    # Works for: 609.19, 609.195(b), 609.221 subd. 4, 609.582 1(b) & (c), 169A.24, etc.
    statute_end_pat = re.compile(r'\s+(\d{3,}[A-Z]?\.\d.*?)\s*;?\s*$')
    # A line that IS just a statute continuation (e.g. second statute after ";")
    solo_statute_pat = re.compile(r'^(\d{3,}[A-Z]?\.\d[^\s].*)\s*$')

    # Severity level at start of line: "9 Assault..." or "10 Murder..."
    severity_start_pat = re.compile(r'^(\d{1,2}) (.+)')

    current_severity = None
    pending_name = None
    pending_statute = None

    def flush():
        if pending_name and pending_statute and current_severity is not None:
            name = re.sub(r'\s+', ' ', pending_name).strip()
            results.append({
                "state": "MN",
                "chargeName": name,
                "citation": f"Minn. Stat. § {pending_statute}",
                "chargeClass": f"Severity Level {current_severity}",
                "isFelony": True,
                "isMisdemeanor": False,
                "source": "Minnesota Sentencing Guidelines Aug 2025",
            })
        elif pending_name and current_severity is not None:
            skipped  # name without statute — skip silently

    with pdfplumber.open(str(path)) as pdf:
        in_table = False
        for page_idx, page in enumerate(pdf.pages):
            text = page.extract_text() or ""

            # Section 5.A starts at the page with the header AND actual statute data
            # (page_idx >= 85 avoids the Table of Contents on page 4 which also mentions 5.A)
            if not in_table and page_idx >= 85 and "5.A. Offense Severity Reference Table" in text:
                in_table = True
            # Section 5.B starts after section 5.A; use page index to be safe
            if in_table and page_idx >= 105 and "5.B. Severity Level" in text:
                break
            if not in_table:
                continue

            for line in (text.split("\n")):
                line = line.strip()
                if not line:
                    continue
                # Skip page headers / footers
                if re.match(r'^\d+\s+Minnesota Sentencing', line):
                    continue
                if "§ 5.A" in line or "§ 5.B" in line:
                    continue
                skip_mn = {
                    "Severity", "Offense Title", "Statute Number", "Level",
                    "Offense Title Statute Number", "Severity Level",
                    "5.A. Offense Severity Reference Table",
                    "Offenses subject to a mandatory life sentence, including first-degree murder and certain sex",
                }
                if line in skip_mn:
                    continue
                if "offenses under Minn. Stat." in line and "subdivision 2" in line:
                    continue
                if "Minnesota Sentencing Guidelines" in line and "Commentary" in line:
                    continue

                # Check if line starts a new severity level group
                sev_m = severity_start_pat.match(line)
                if sev_m and int(sev_m.group(1)) <= 11:
                    # Could be a new severity level
                    new_sev = int(sev_m.group(1))
                    rest = sev_m.group(2)
                    # Validate: not a page number (page numbers would be > 11)
                    stat_m = statute_end_pat.search(rest)
                    if stat_m:
                        flush()
                        current_severity = new_sev
                        pending_name = rest[:stat_m.start()].strip()
                        pending_statute = stat_m.group(1).strip().rstrip(";,")
                        continue
                    else:
                        # Severity line without statute on same line; name continues to next line
                        flush()
                        current_severity = new_sev
                        pending_name = rest.strip()
                        pending_statute = None
                        continue

                # Try to match as a new offense line (name + statute at end)
                stat_m = statute_end_pat.search(line)
                if stat_m and current_severity is not None:
                    # Check it's not just a page-number-like artifact
                    name_part = line[:stat_m.start()].strip()
                    if name_part:
                        flush()
                        pending_name = name_part
                        pending_statute = stat_m.group(1).strip().rstrip(";,")
                        continue

                # Check if line is a standalone statute continuation (second statute, e.g. after ";")
                solo_m = solo_statute_pat.match(line)
                if solo_m and pending_statute is not None:
                    pending_statute += "; " + solo_m.group(1).strip().rstrip(";,")
                    continue

                # Continuation: append to current name
                if pending_name is not None and current_severity is not None:
                    # Skip if the line looks like a footer number
                    if not re.match(r'^\d+\s*$', line):
                        pending_name += " " + line
                else:
                    skipped += 1

        flush()

    # Deduplicate
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  MN: {len(deduped)} unique felony charges parsed ({skipped} lines skipped)")
    return deduped


# ── Arkansas parser ───────────────────────────────────────────────────────────

def parse_ar() -> list[dict]:
    import pdfplumber

    # File is mislabeled "AK" but contains Arkansas sentencing data
    path = SOURCE_DIR / "AK - Edited-2026-Benchbook-Word-Draft-Final.pdf"
    results = []
    skipped = 0

    # AR felony classes: Y (special/life-eligible), A, B, C, D, U (unranked)
    felony_classes = {"Y", "A", "B", "C", "D", "U"}

    with pdfplumber.open(str(path)) as pdf:
        for page_idx, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            # Only process pages with the offense ranking table (pages 22–73, 0-indexed 21–72)
            if page_idx < 21 or page_idx > 72:
                continue
            if "Offense Seriousness Ranking Table" not in text:
                continue

            tables = page.extract_tables()
            for table in tables:
                pending_statute = None
                pending_class = None
                pending_name = None
                pending_ranking = None
                pending_end = None

                for row in table:
                    if not row or len(row) < 4:
                        continue

                    # Normalize cells
                    cells = [clean(c) if c is not None else "" for c in row]

                    # Skip header row
                    if cells[1] == "Statute #" or cells[3] == "Name of Crime":
                        continue

                    statute_raw = cells[1] if len(cells) > 1 else ""
                    charge_class = cells[2] if len(cells) > 2 else ""
                    name_raw = cells[3] if len(cells) > 3 else ""
                    end_raw = cells[6] if len(cells) > 6 else ""
                    ranking_raw = cells[7] if len(cells) > 7 else ""

                    # Statute continuation row: index 1 has "(something)", rest are blank
                    if statute_raw.startswith("(") and not charge_class and not name_raw:
                        if pending_statute:
                            pending_statute += " " + statute_raw
                        continue

                    # Blank data rows
                    if not statute_raw and not name_raw:
                        continue

                    # Flush any pending entry before starting a new one
                    if pending_statute and pending_class and pending_name:
                        if not pending_end and pending_class in felony_classes:
                            results.append({
                                "state": "AR",
                                "chargeName": pending_name,
                                "citation": f"Ark. Code Ann. § {pending_statute}",
                                "chargeClass": f"Class {pending_class}",
                                "isFelony": True,
                                "isMisdemeanor": False,
                                "source": "Arkansas Sentencing Commission Benchbook 2026",
                            })
                        elif pending_end:
                            skipped += 1  # retired offense

                    # Start new entry
                    if statute_raw and charge_class and name_raw:
                        pending_statute = statute_raw
                        pending_class = charge_class.upper()
                        pending_name = name_raw
                        pending_end = end_raw
                        pending_ranking = ranking_raw
                    else:
                        pending_statute = None
                        pending_class = None
                        pending_name = None
                        pending_end = None

                # Flush last entry on the page
                if pending_statute and pending_class and pending_name:
                    if not pending_end and pending_class in felony_classes:
                        results.append({
                            "state": "AR",
                            "chargeName": pending_name,
                            "citation": f"Ark. Code Ann. § {pending_statute}",
                            "chargeClass": f"Class {pending_class}",
                            "isFelony": True,
                            "isMisdemeanor": False,
                            "source": "Arkansas Sentencing Commission Benchbook 2026",
                        })
                    elif pending_end:
                        skipped += 1

    # Deduplicate
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  AR: {len(deduped)} unique felony charges parsed ({skipped} retired offenses skipped)")
    return deduped


# ── Virginia parser ───────────────────────────────────────────────────────────

def parse_va() -> list[dict]:
    import openpyxl

    path = SOURCE_DIR / "VA - FY17vccs.xlsx"
    wb = openpyxl.load_workbook(str(path))
    ws = wb.active

    results = []
    skipped = 0

    # VA felony ViewKey suffixes: F1 (Class 1, most serious) through F6, F9 (unclassified)
    felony_pat = re.compile(r'-F(\d)$')

    felony_class_map = {
        "1": "Class 1 Felony", "2": "Class 2 Felony", "3": "Class 3 Felony",
        "4": "Class 4 Felony", "5": "Class 5 Felony", "6": "Class 6 Felony",
        "9": "Unclassified Felony",
    }

    for row in ws.iter_rows(min_row=2, values_only=True):
        heading, subhead, descrtn, viewkey, statute, sentence, effdate, retiredate = (
            row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7]
        )

        # Skip retired offenses
        if retiredate:
            skipped += 1
            continue
        # Need statute and ViewKey for classification
        if not statute or not viewkey:
            skipped += 1
            continue

        fm = felony_pat.search(str(viewkey))
        if not fm:
            skipped += 1
            continue

        charge_class = felony_class_map.get(fm.group(1), "Felony")

        # Build charge name from description (primary) with subhead context
        name_parts = []
        if descrtn:
            name_parts.append(str(descrtn).strip())
        if not name_parts:
            skipped += 1
            continue

        charge_name = name_parts[0]

        results.append({
            "state": "VA",
            "chargeName": charge_name,
            "citation": f"Va. Code Ann. § {statute}",
            "chargeClass": charge_class,
            "isFelony": True,
            "isMisdemeanor": False,
            "source": "Virginia Crime Code System FY17",
        })

    # Deduplicate
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  VA: {len(deduped)} unique felony charges parsed ({skipped} rows skipped)")
    return deduped


# ── Alabama parser ────────────────────────────────────────────────────────────

def parse_al() -> list[dict]:
    import pdfplumber

    path = SOURCE_DIR / "AL - 2024-presumptive-manual.pdf"
    results = []
    skipped = 0

    # Format 1 (pages 13-14, 0-indexed): numbered list
    # "N. Offense name pursuant to Section 13A-6-20."
    numbered_pat = re.compile(
        r'^\d+\.\s+(.+?)\s+pursuant to Section\s+(\d+[A-Z]?-\d+-\d+[\w.\(\)-]*)'
    )

    # Format 2 (pages 40, 62, 86): § statute + name + class
    # "§13A-7-5 Burglary 1st Class A felony"
    # "§ 13A-12-218 Manufacturing Controlled Substance 1st Class A felony"
    table_pat = re.compile(
        r'§\s*(\d+[A-Z]?-\d+-\d+[\w.()\-]*)\s+(.+?)\s+Class\s+([A-Z])\s+felon',
        re.IGNORECASE
    )
    # Variant without "Class X felony" at the end — just statute + name on same line
    # "§ 32-5a-191(h) Felony DUI Class C felony"
    table_pat2 = re.compile(
        r'§\s*([\dA-Za-z]+[-\d][\w.()\-]*)\s+(.+?)\s+Class\s+([A-Z])\s+felon',
        re.IGNORECASE
    )

    # Pages to parse
    page_indices = [13, 14, 40, 62, 86]  # 0-indexed

    with pdfplumber.open(str(path)) as pdf:
        for page_idx in page_indices:
            if page_idx >= len(pdf.pages):
                continue
            page = pdf.pages[page_idx]
            text = page.extract_text() or ""
            lines = text.split("\n")

            for line in lines:
                line = line.strip()
                if not line:
                    continue

                # Try numbered list format first (pages 13-14)
                if page_idx in (13, 14):
                    m = numbered_pat.match(line)
                    if m:
                        name = m.group(1).strip()
                        statute = m.group(2).strip().rstrip(".")
                        results.append({
                            "state": "AL",
                            "chargeName": name,
                            "citation": f"Ala. Code § {statute}",
                            "chargeClass": "Felony",
                            "isFelony": True,
                            "isMisdemeanor": False,
                            "source": "Alabama Sentencing Commission Presumptive Manual 2024",
                        })
                        continue

                # Try § format for drug/property/personal sections
                m = table_pat.search(line) or table_pat2.search(line)
                if m:
                    statute = m.group(1).strip()
                    name = m.group(2).strip()
                    charge_class = m.group(3).upper()
                    # Skip header/non-data lines
                    if name.lower().startswith(("most serious", "offense", "ranking")):
                        continue
                    results.append({
                        "state": "AL",
                        "chargeName": name,
                        "citation": f"Ala. Code § {statute}",
                        "chargeClass": f"Class {charge_class} Felony",
                        "isFelony": True,
                        "isMisdemeanor": False,
                        "source": "Alabama Sentencing Commission Presumptive Manual 2024",
                    })

    # Deduplicate
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  AL: {len(deduped)} unique charges parsed ({skipped} rows skipped)")
    return deduped


# ── Texas parser ──────────────────────────────────────────────────────────────

def parse_tx() -> list[dict]:
    import pdfplumber

    path = SOURCE_DIR / "TX - Felony_Offenses.pdf"
    results = []
    skipped = 0

    # Maps TX Code column names to standard citation prefixes
    TX_CODE_ABBREV: dict[str, str] = {
        "Penal Code":                   "Tex. Penal Code",
        "Health and Safety Code":       "Tex. Health & Safety Code",
        "Occupations Code":             "Tex. Occ. Code",
        "Election Code":                "Tex. Elec. Code",
        "Transportation Code":          "Tex. Transp. Code",
        "Government Code":              "Tex. Gov't Code",
        "Natural Resources Code":       "Tex. Nat. Res. Code",
        "Business & Commerce Code":     "Tex. Bus. & Com. Code",
        "Tax Code":                     "Tex. Tax Code",
        "Vernon's Civil Statutes":      "Tex. Rev. Civ. Stat.",
        "Agriculture Code":             "Tex. Agric. Code",
        "Insurance Code":               "Tex. Ins. Code",
        "Insurance Code (Not Codified)":"Tex. Ins. Code",
        "Finance Code":                 "Tex. Fin. Code",
        "Parks and Wildlife Code":      "Tex. Parks & Wild. Code",
        "Family Code":                  "Tex. Fam. Code",
        "Alcoholic Beverage Code":      "Tex. Alco. Bev. Code",
        "Education Code":               "Tex. Educ. Code",
        "Human Resources Code":         "Tex. Hum. Res. Code",
        "Local Government Code":        "Tex. Loc. Gov't Code",
        "Code of Criminal Procedure":   "Tex. Code Crim. Proc.",
        "Water Code":                   "Tex. Water Code",
        "Labor Code":                   "Tex. Labor Code",
        "Utilities Code":               "Tex. Util. Code",
        "Business Organizations Code":  "Tex. Bus. Orgs. Code",
    }

    # Felony categories to determine class
    felony_classes = {
        "Capital Felony": "Capital Felony",
        "First Degree": "First Degree Felony",
        "Second Degree": "Second Degree Felony",
        "Third Degree": "Third Degree Felony",
        "State Jail": "State Jail Felony",
        "Other": "Felony (Other)",
        "Uncategorized": "Felony (Unclassified)",
    }

    with pdfplumber.open(str(path)) as pdf:
        current_code = None

        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if not row or len(row) < 3:
                        continue

                    code_raw = clean(row[0]) if row[0] else ""
                    section_raw = clean(row[1]) if row[1] else ""
                    offense_raw = clean(row[2]) if row[2] else ""
                    category_raw = clean(row[3]) if len(row) > 3 and row[3] else ""

                    # Skip header rows
                    if code_raw in ("Code", "") and section_raw in ("Section\nNumber", "Section Number", ""):
                        continue
                    if offense_raw in ("Offense", ""):
                        continue
                    # Update current code context when new code appears
                    if code_raw and code_raw not in ("Code",):
                        current_code = code_raw
                    if not section_raw or not offense_raw or not current_code:
                        skipped += 1
                        continue

                    # Build citation
                    abbrev = TX_CODE_ABBREV.get(current_code, f"Tex. {current_code}")
                    citation = f"{abbrev} § {section_raw}"

                    # Normalize felony category
                    charge_class = "Felony"
                    for key, label in felony_classes.items():
                        if key.lower() in category_raw.lower():
                            charge_class = label
                            break

                    results.append({
                        "state": "TX",
                        "chargeName": offense_raw,
                        "citation": citation,
                        "chargeClass": charge_class,
                        "isFelony": True,
                        "isMisdemeanor": False,
                        "source": "Texas Legislative Council Felony Offenses 2018",
                    })

    # Deduplicate
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  TX: {len(deduped)} unique felony charges parsed ({skipped} rows skipped)")
    return deduped


# ── Delaware parser ───────────────────────────────────────────────────────────

def parse_de() -> list[dict]:
    import pdfplumber

    path = SOURCE_DIR / "DE - Bench-Book-2025-Final.pdf"
    results = []
    skipped = 0

    # DE felony classes: A (most serious) through G (least serious)
    felony_pat = re.compile(r'Class\s+([A-G])\s+Felon', re.IGNORECASE)

    with pdfplumber.open(str(path)) as pdf:
        # Index section runs from page 4 to approximately page 26 (0-indexed 3–25)
        for page_idx in range(3, 27):
            page = pdf.pages[page_idx]
            tables = page.extract_tables()
            if not tables:
                continue
            table = tables[0]

            for row in table:
                if not row or len(row) < 10:
                    continue

                # 12-column layout: crime=0, class=3, statute=6, page=9
                crime_raw = clean(row[0]) if row[0] else ""
                class_raw = clean(row[3]) if row[3] else ""
                statute_raw = clean(row[6]) if row[6] else ""

                # Skip header and non-data rows
                if not crime_raw or crime_raw.upper() in ("CRIME", ""):
                    continue
                if not statute_raw or statute_raw.upper() in ("STATUE", "STATUTE", ""):
                    continue
                # Skip "See X" cross-reference rows
                if crime_raw.lower().startswith("see ") or statute_raw.lower().startswith("see "):
                    skipped += 1
                    continue
                # Filter for felony class (A–G); skip misdemeanors, violations, etc.
                fm = felony_pat.search(class_raw)
                if not fm:
                    skipped += 1
                    continue

                felony_class = f"Class {fm.group(1).upper()} Felony"
                violent = "(Violent)" in class_raw or "Violent" in class_raw

                # Build citation: statute is "TITLE-SECTION" → Del. Code Ann. tit. TITLE, § SECTION
                # Strip "et seq." and other qualifiers for the base citation
                stat_clean = statute_raw.replace("et seq.", "").replace("et. seq.", "").strip().rstrip(".")
                dash_idx = stat_clean.find("-")
                if dash_idx != -1:
                    title = stat_clean[:dash_idx]
                    section = stat_clean[dash_idx + 1:]
                    citation = f"Del. Code Ann. tit. {title}, § {section}"
                else:
                    citation = f"Del. Code Ann. § {stat_clean}"

                results.append({
                    "state": "DE",
                    "chargeName": crime_raw,
                    "citation": citation,
                    "chargeClass": felony_class + (" (Violent)" if violent else " (Nonviolent)"),
                    "isFelony": True,
                    "isMisdemeanor": False,
                    "source": "Delaware SENTAC Benchbook 2025",
                })

    # Deduplicate
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  DE: {len(deduped)} unique felony charges parsed ({skipped} rows skipped)")
    return deduped


# ── California parser (CALCRIM TOC) ──────────────────────────────────────────

def parse_ca() -> list[dict]:
    import pdfplumber

    path = SOURCE_DIR / "CA - calcrim-2026.pdf"
    results = []

    # CA code abbreviations used in CALCRIM TOC (ordered longest-first for matching)
    CA_CODE_MAP: dict[str, str] = {
        "Health&Saf.Code":  "Cal. Health & Safety Code",
        "Welf.&Inst.Code":  "Cal. Welf. & Inst. Code",
        "Bus.&Prof.Code":   "Cal. Bus. & Prof. Code",
        "Rev.&Tax.Code":    "Cal. Rev. & Tax. Code",
        "FormerPen.Code":   "Cal. Penal Code",
        "Pen.Code":         "Cal. Penal Code",
        "Veh.Code":         "Cal. Veh. Code",
    }
    CODE_KEYS = sorted(CA_CODE_MAP.keys(), key=len, reverse=True)

    # Matches statute parenthetical: (CodeAbbrev,§section...)
    stat_re = re.compile(
        r'\((' + '|'.join(re.escape(k) for k in CODE_KEYS) + r'),\s*§{1,2}\s*([\d.)(,:A-Za-z &/\\-]+?)\)(?=\s*$|\s+\d|\n|$)'
    )

    def split_title(raw: str) -> str:
        """Insert spaces in concatenated CamelCase CALCRIM title text."""
        t = re.sub(r'([a-z])([A-Z])', r'\1 \2', raw)
        t = re.sub(r'([A-Z]{2,})([A-Z][a-z])', r'\1 \2', t)
        return t.strip()

    with pdfplumber.open(str(path)) as pdf:
        # CALCRIM TOC occupies approximately pages 7–71 (0-indexed 6–70)
        for page_idx in range(6, 71):
            page = pdf.pages[page_idx]
            text = page.extract_text() or ""

            # Normalize line-wrapping inside statute references
            text = re.sub(r'\(Pen\.\n', '(Pen.', text)
            text = re.sub(r'(?<=Code),\n', ',', text)
            text = re.sub(r',\n§', ',§', text)

            for line in text.split("\n"):
                line = line.strip()
                # Must start with an instruction number (digits + optional letter)
                num_m = re.match(r'^(\d{1,4}[A-Z]?)\.\s+', line)
                if not num_m:
                    continue
                num = num_m.group(1)
                rest = line[num_m.end():]

                # Find the statute parenthetical by code abbreviation keyword
                sm = stat_re.search(rest)
                if not sm:
                    continue

                code_abbrev = sm.group(1)
                section_raw = sm.group(2).strip().rstrip(",")
                # Take first section only (before comma not inside parens)
                section = re.split(r',(?!\s*\()', section_raw)[0].strip()
                code_full = CA_CODE_MAP.get(code_abbrev, f"Cal. {code_abbrev}")
                citation = f"{code_full} § {section}"

                title_raw = rest[:sm.start()].strip()
                charge_name = split_title(title_raw)

                results.append({
                    "state": "CA",
                    "chargeName": charge_name,
                    "citation": citation,
                    "chargeClass": "Felony",    # CALCRIM covers both felonies and misdemeanors
                    "isFelony": True,
                    "isMisdemeanor": False,
                    "source": "California CALCRIM 2026 (Judicial Council Jury Instructions)",
                })

    # Deduplicate
    seen = set()
    deduped = []
    for r in results:
        key = (r["citation"], r["chargeName"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"  CA: {len(deduped)} unique entries parsed from CALCRIM TOC")
    return deduped


PARSERS = {
    "KS": parse_kansas,
    "NC": parse_nc,
    "MO": parse_mo,
    "MD": parse_md,
    "MI": parse_mi,
    "PA": parse_pa,
    "WA": parse_wa,
    "MN": parse_mn,
    "AR": parse_ar,
    "VA": parse_va,
    "AL": parse_al,
    "TX": parse_tx,
    "DE": parse_de,
    "CA": parse_ca,
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
