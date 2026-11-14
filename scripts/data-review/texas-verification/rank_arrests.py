"""Rank Texas DPS 2025 adult arrest records. Reads an operator-supplied official XLSX offline."""
import argparse
import hashlib
import json
from pathlib import Path
import re
from xml.etree import ElementTree
from zipfile import ZipFile

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
SOURCE = "https://www.dps.texas.gov/administration/crime_records/pages/aareststatsoffense26.xlsx"


def rank(path):
    with ZipFile(path) as archive:
        strings = ["".join(t.text or "" for t in si.iter(NS + "t"))
                   for si in ElementTree.fromstring(archive.read("xl/sharedStrings.xml"))]
        rows = []
        for row in ElementTree.fromstring(archive.read("xl/worksheets/sheet1.xml")).iter(NS + "row"):
            values = {}
            for cell in row.findall(NS + "c"):
                value = cell.findtext(NS + "v")
                if value is not None:
                    values[re.sub(r"\d+", "", cell.attrib["r"])] = strings[int(value)] if cell.get("t") == "s" else value
            rows.append(values)
    if (rows[0]["A"] != "Arrest Records: 2023-2025" or rows[2].get("H") != "2025" or
            (rows[3].get("H"), rows[3].get("I")) != ("Adult", "Juvenile") or rows[-1]["A"] != "TOTALS"):
        raise ValueError("Expected the DPS annual arrest workbook with adult and juvenile 2025 columns")
    seen, eligible, excluded = set(), [], []
    for row in rows[4:-1]:
        label, code = row["A"].rsplit(" - ", 1)
        if not re.fullmatch(r"\d{8}", code) or code in seen:
            raise ValueError(f"Missing or duplicate DPS code {code}")
        seen.add(code)
        record = dict(code=code, label=label, law=row["B"], citation=row["C"], adult=int(row["H"]), juvenile=int(row["I"]))
        if min(record["adult"], record["juvenile"]) < 0:
            raise ValueError("Negative reported count")
        if row["B"] == "X" or not re.match(r"^\d", row["C"]):
            excluded.append(record)
        else:
            eligible.append(record)
    for key, column in [("adult","H"), ("juvenile","I")]:
        if sum(r[key] for r in eligible + excluded) != int(rows[-1][column]):
            raise ValueError(f"DPS total mismatch in {column}")
    eligible.sort(key=lambda r: (-r["adult"], r["code"]))
    return dict(source=SOURCE, sha256=hashlib.sha256(path.read_bytes()).hexdigest(), workbookAsOf=rows[1]["A"],
                year=2025, statewideAdult=int(rows[-1]["H"]), statewideJuvenile=int(rows[-1]["I"]),
                eligibleCodes=len(eligible), excludedCodes=len(excluded),
                excludedAdult=sum(r["adult"] for r in excluded), top25=eligible[:25])


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("workbook", type=Path)
    cli.add_argument("--check", type=Path)
    args = cli.parse_args()
    result = rank(args.workbook)
    if args.check:
        if result != json.loads(args.check.read_text()):
            raise SystemExit("DPS source, workbook or ranking differs from reviewed result")
    else:
        print(json.dumps(result, indent=2))
