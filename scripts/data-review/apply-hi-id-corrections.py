#!/usr/bin/env python3
"""
Apply corrections to HI and ID criminal charge codes in criminal-charges.ts
"""
import re
import sys

FILE = 'shared/criminal-charges.ts'

# Map of charge ID -> correct code
CORRECTIONS = {
    # HI - fabricated numeric codes to fix
    "hi-voluntary-manslaughter": "707-702",
    "hi-involuntary-manslaughter": "707-702",
    "hi-criminally-negligent-homicide": "707-702.5",
    "hi-vehicular-homicide": "707-702.5",
    "hi-felony-murder": "707-701",
    "hi-assault-in-the-first-degree": "707-710",
    "hi-assault-in-the-second-degree": "707-711",
    "hi-aggravated-assault": "707-710",
    "hi-assault-with-deadly-weapon": "707-711",
    "hi-domestic-violence-assault": "709-906",
    "hi-assault-on-peace-officer": "707-712.5",
    "hi-menacing": "707-715",
    "hi-rape-in-the-first-degree": "707-730",
    "hi-rape-in-the-second-degree": "707-731",
    "hi-sexual-assault-in-the-first-degree": "707-730",
    "hi-sexual-assault-in-the-second-degree": "707-731",
    "hi-sexual-assault-in-the-third-degree": "707-732",
    "hi-statutory-rape": "707-732",
    "hi-child-sexual-abuse": "707-733",
    "hi-sexual-exploitation-of-minor": "707-750",
    "hi-grand-theft-in-the-first-degree": "708-830.5",
    "hi-grand-theft-in-the-second-degree": "708-831",
    "hi-petty-theft": "708-833",
    "hi-theft-by-receiving": "708-834",
    "hi-identity-theft": "708-839.6",
    "hi-credit-card-fraud": "708-8100",
    "hi-embezzlement": "708-830",
    "hi-shoplifting": "708-833",
    "hi-residential-burglary": "708-810",
    "hi-commercial-burglary": "708-811",
    "hi-auto-burglary": "708-811",
    "hi-carjacking": "708-840",
    "hi-bank-robbery": "708-840",
    "hi-possession-of-controlled-substance": "712-1243",
    "hi-possession-with-intent-to-distribute": "712-1241",
    "hi-distribution-of-controlled-substance": "712-1241",
    "hi-manufacturing-controlled-substance": "712-1241",
    "hi-drug-trafficking": "712-1241",
    "hi-possession-of-drug-paraphernalia": "329-43.5",
    "hi-maintaining-drug-house": "712-1247",
    "hi-unlawful-carrying-of-weapon": "134-51",
    "hi-felon-in-possession-of-firearm": "134-7",
    "hi-discharge-of-firearm-in-city": "134-56",
    "hi-possession-of-prohibited-weapon": "134-51",
    "hi-wire-fraud": "708-8300",
    "hi-mail-fraud": "708-8300",
    "hi-check-fraud": "708-870",
    "hi-insurance-fraud": "431:10C-117.7",
    "hi-tax-fraud": "231-36",
    "hi-computer-fraud": "708-891",
    "hi-public-intoxication": "711-1109",
    "hi-disturbing-the-peace": "711-1101",
    "hi-trespassing": "708-814",
    "hi-vandalism": "708-820",
    "hi-loitering": "711-1101",
    "hi-dui-first-offense": "291E-61",
    "hi-dui-second-offense": "291E-61",
    "hi-dui-third-offense": "291E-61",
    "hi-reckless-driving": "291-2",
    "hi-hit-and-run": "291C-12",
    "hi-driving-while-suspended": "286-132",
    # HI inchoate/enhancements/RICO - fixing placeholder codes
    "hi-criminal-attempt": "705-500",
    "hi-conspiracy": "705-520",
    "hi-aiding-and-abetting": "702-222",
    "hi-accessory-after-the-fact": "702-222",
    "hi-attempted-murder": "705-500",
    "hi-attempted-robbery": "705-500",
    "hi-attempted-sexual-assault": "705-500",
    "hi-criminal-solicitation": "705-510",
    "hi-gang-enhancement": "842-9",
    "hi-hate-crime-enhancement": "706-662",
    "hi-recidivist-enhancement": "706-606.5",
    "hi-firearm-in-felony-enhancement": "706-660.1",
    "hi-drug-school-zone-enhancement": "712-1249.6",
    "hi-rico-organized-crime": "842-2",
    "hi-money-laundering": "708A-3",

    # ID - fabricated codes to fix
    "id-murder-in-the-second-degree": "18-4003",
    "id-criminally-negligent-homicide": "18-4006",
    "id-vehicular-homicide": "18-4006",
    "id-felony-murder": "18-4003",
    "id-assault-in-the-first-degree": "18-905",
    "id-assault-in-the-second-degree": "18-901",
    "id-assault-in-the-third-degree": "18-901",
    "id-aggravated-assault": "18-905",
    "id-assault-with-deadly-weapon": "18-905",
    "id-domestic-violence-assault": "18-918",
    "id-assault-on-peace-officer": "18-915",
    "id-menacing": "18-1014",
    "id-rape-in-the-first-degree": "18-6101",
    "id-rape-in-the-second-degree": "18-6101",
    "id-sexual-assault-in-the-first-degree": "18-6101",
    "id-sexual-assault-in-the-second-degree": "18-6101",
    "id-sexual-assault-in-the-third-degree": "18-909",
    "id-statutory-rape": "18-6101",
    "id-child-sexual-abuse": "18-1506",
    "id-sexual-exploitation-of-minor": "18-1507",
    "id-grand-theft-in-the-first-degree": "18-2407(1)(b)",
    "id-grand-theft-in-the-second-degree": "18-2407(1)(c)",
    "id-petty-theft": "18-2403",
    "id-theft-by-receiving": "18-2403(4)",
    "id-identity-theft": "18-3126",
    "id-credit-card-fraud": "18-3124",
    "id-embezzlement": "18-2403",
    "id-shoplifting": "18-2403",
    "id-burglary-in-the-first-degree": "18-1401",
    "id-burglary-in-the-second-degree": "18-1401",
    "id-residential-burglary": "18-1401",
    "id-commercial-burglary": "18-1401",
    "id-auto-burglary": "18-1401",
    "id-robbery-in-the-first-degree": "18-6501",
    "id-robbery-in-the-second-degree": "18-6502",
    "id-carjacking": "18-6501",
    "id-bank-robbery": "18-6501",
    "id-possession-with-intent-to-distribute": "37-2732(a)",
    "id-distribution-of-controlled-substance": "37-2732(a)",
    "id-manufacturing-controlled-substance": "37-2732(a)",
    "id-drug-trafficking": "37-2732B",
    "id-possession-of-drug-paraphernalia": "37-2734A",
    "id-maintaining-drug-house": "37-2737",
    "id-unlawful-carrying-of-weapon": "18-3302",
    "id-felon-in-possession-of-firearm": "18-3316",
    "id-discharge-of-firearm-in-city": "18-3317",
    "id-possession-of-prohibited-weapon": "18-3310",
    "id-wire-fraud": "18-2403",
    "id-mail-fraud": "18-2403",
    "id-check-fraud": "18-3106",
    "id-insurance-fraud": "41-293",
    "id-tax-fraud": "63-3076",
    "id-computer-fraud": "18-2202",
    "id-disorderly-conduct": "18-6409",
    "id-public-intoxication": "18-8005",
    "id-trespassing": "18-7011",
    "id-vandalism": "18-7001",
    "id-loitering": "18-6409",
    "id-dui-first-offense": "18-8004",
    "id-dui-second-offense": "18-8004",
    "id-dui-third-offense": "18-8004",
    "id-reckless-driving": "49-1401",
    "id-hit-and-run": "49-1301",
    "id-driving-while-suspended": "18-8001",
    # ID inchoate/enhancements/RICO - fixing placeholder codes
    "id-criminal-attempt": "18-306",
    "id-conspiracy": "18-1701",
    "id-aiding-and-abetting": "18-204",
    "id-accessory-after-the-fact": "18-205",
    "id-attempted-murder": "18-306",
    "id-attempted-robbery": "18-306",
    "id-attempted-sexual-assault": "18-306",
    "id-criminal-solicitation": "18-2001",
    "id-gang-enhancement": "18-8502",
    "id-hate-crime-enhancement": "18-7902",
    "id-recidivist-enhancement": "19-2514",
    "id-firearm-in-felony-enhancement": "19-2520",
    "id-drug-school-zone-enhancement": "37-2737A",
    "id-rico-organized-crime": "18-7804",
    "id-money-laundering": "18-8201",
}

def apply_corrections(filepath, corrections):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    applied = {}
    not_found = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if this line contains an id field matching one of our targets
        for charge_id, new_code in corrections.items():
            # Match: id: 'charge-id' or id: "charge-id"
            id_pattern = f"id: '{charge_id}'"
            id_pattern2 = f'id: "{charge_id}"'
            if id_pattern in line or id_pattern2 in line:
                # Look for the code: field in the next ~5 lines
                for j in range(i+1, min(i+6, len(lines))):
                    code_match = re.match(r"(\s+code:\s*['\"])(.*?)(['\"],?\s*)", lines[j])
                    if code_match:
                        old_code = code_match.group(2)
                        if old_code != new_code:
                            lines[j] = code_match.group(1) + new_code + code_match.group(3) + '\n'
                            # Remove trailing double newline
                            lines[j] = re.sub(r'\n\n$', '\n', lines[j])
                            applied[charge_id] = (old_code, new_code)
                        break
                else:
                    not_found.append(charge_id)
                break
        i += 1

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    return applied, not_found

print(f"Applying {len(CORRECTIONS)} corrections to {FILE}...")
applied, not_found = apply_corrections(FILE, CORRECTIONS)

print(f"\nApplied {len(applied)} corrections:")
for charge_id, (old, new) in sorted(applied.items()):
    print(f"  {charge_id}: '{old}' -> '{new}'")

if not_found:
    print(f"\nWARNING - code field not found for {len(not_found)} entries:")
    for c in not_found:
        print(f"  {c}")

# Check for entries we expected but didn't change (already correct)
already_correct = set(CORRECTIONS.keys()) - set(applied.keys()) - set(not_found)
if already_correct:
    print(f"\nAlready correct ({len(already_correct)}):")
    for c in sorted(already_correct):
        print(f"  {c}")
