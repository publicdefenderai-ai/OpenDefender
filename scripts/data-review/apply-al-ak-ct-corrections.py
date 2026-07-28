#!/usr/bin/env python3
"""
Apply corrections to AL, AK, and CT criminal charge codes in criminal-charges.ts
"""
import re

FILE = 'shared/criminal-charges.ts'

CORRECTIONS = {
    "al-murder-in-the-first-degree": "13A-6-2",
    "al-murder-in-the-second-degree": "13A-6-2",
    "al-voluntary-manslaughter": "13A-6-3",
    "al-involuntary-manslaughter": "13A-6-3",
    "al-vehicular-homicide": "32-5A-192",
    "al-felony-murder": "13A-6-2",
    "al-aggravated-assault": "13A-6-20",
    "al-assault-with-deadly-weapon": "13A-6-20",
    "al-domestic-violence-assault": "13A-6-130",
    "al-assault-on-peace-officer": "13A-10-5",
    "al-rape-in-the-first-degree": "13A-6-61",
    "al-rape-in-the-second-degree": "13A-6-62",
    "al-sexual-assault-in-the-first-degree": "13A-6-66",
    "al-sexual-assault-in-the-second-degree": "13A-6-67",
    "al-sexual-assault-in-the-third-degree": "13A-6-65",
    "al-statutory-rape": "13A-6-62",
    "al-child-sexual-abuse": "13A-6-69.1",
    "al-sexual-exploitation-of-minor": "13A-12-192",
    "al-grand-theft-in-the-first-degree": "13A-8-3",
    "al-grand-theft-in-the-second-degree": "13A-8-4",
    "al-petty-theft": "13A-8-5",
    "al-theft-by-receiving": "13A-8-17",
    "al-identity-theft": "13A-8-192",
    "al-embezzlement": "13A-8-2",
    "al-shoplifting": "13A-8-223",
    "al-residential-burglary": "13A-7-5",
    "al-commercial-burglary": "13A-7-6",
    "al-auto-burglary": "13A-7-7",
    "al-carjacking": "13A-8-41",
    "al-bank-robbery": "13A-8-41",
    "al-possession-of-controlled-substance": "13A-12-212",
    "al-possession-with-intent-to-distribute": "13A-12-211",
    "al-distribution-of-controlled-substance": "13A-12-211",
    "al-manufacturing-controlled-substance": "13A-12-211",
    "al-possession-of-drug-paraphernalia": "13A-12-260",
    "al-maintaining-drug-house": "13A-12-211",
    "al-unlawful-carrying-of-weapon": "13A-11-50",
    "al-felon-in-possession-of-firearm": "13A-11-72",
    "al-discharge-of-firearm-in-city": "13A-11-61",
    "al-possession-of-prohibited-weapon": "13A-11-53",
    "al-wire-fraud": "13A-9-3",
    "al-mail-fraud": "13A-9-3",
    "al-check-fraud": "13A-9-13.1",
    "al-insurance-fraud": "27-12A-2",
    "al-tax-fraud": "40-29-110",
    "al-computer-fraud": "13A-8-103",
    "al-public-intoxication": "13A-11-10",
    "al-disturbing-the-peace": "13A-11-7",
    "al-trespassing": "13A-7-2",
    "al-vandalism": "13A-7-21",
    "al-loitering": "13A-11-9",
    "al-dui-first-offense": "32-5A-191",
    "al-dui-second-offense": "32-5A-191",
    "al-dui-third-offense": "32-5A-191",
    "al-reckless-driving": "32-5A-190",
    "al-hit-and-run": "32-10-2",
    "al-criminal-attempt": "13A-4-2",
    "al-conspiracy": "13A-4-3",
    "al-aiding-and-abetting": "13A-2-23",
    "al-accessory-after-the-fact": "13A-2-24",
    "al-criminal-solicitation": "13A-4-1",
    "al-attempted-murder": "13A-4-2",
    "al-attempted-robbery": "13A-4-2",
    "al-attempted-sexual-assault": "13A-4-2",
    "al-gang-enhancement": "13A-6-26",
    "al-hate-crime-enhancement": "13A-5-13",
    "al-recidivist-enhancement": "13A-5-9",
    "al-firearm-in-felony-enhancement": "13A-5-6",
    "al-drug-school-zone-enhancement": "13A-12-250",
    "al-rico-organized-crime": "13A-12-233",
    "al-money-laundering": "13A-9-73",
    "al-juvenile-delinquency-felony": "12-15-34",
    "al-juvenile-delinquency-misdemeanor": "12-15-34",
    "al-juvenile-transfer-adult-court": "12-15-203",
    "al-juvenile-firearm-possession": "13A-11-72",
    # AK corrections
    "ak-voluntary-manslaughter": "11.41.120",
    "ak-involuntary-manslaughter": "11.41.120",
    "ak-vehicular-homicide": "11.41.120",
    "ak-felony-murder": "11.41.100",
    "ak-aggravated-assault": "11.41.200",
    "ak-assault-with-deadly-weapon": "11.41.200",
    "ak-domestic-violence-assault": "11.41.230",
    "ak-assault-on-peace-officer": "11.41.220",
    "ak-menacing": "11.41.270",
    "ak-rape-in-the-first-degree": "11.41.410",
    "ak-rape-in-the-second-degree": "11.41.420",
    "ak-sexual-assault-in-the-first-degree": "11.41.410",
    "ak-sexual-assault-in-the-second-degree": "11.41.420",
    "ak-sexual-assault-in-the-third-degree": "11.41.425",
    "ak-statutory-rape": "11.41.440",
    "ak-child-sexual-abuse": "11.41.434",
    "ak-sexual-exploitation-of-minor": "11.41.455",
    "ak-grand-theft-in-the-first-degree": "11.46.120",
    "ak-grand-theft-in-the-second-degree": "11.46.130",
    "ak-petty-theft": "11.46.150",
    "ak-theft-by-receiving": "11.46.190",
    "ak-identity-theft": "11.46.565",
    "ak-credit-card-fraud": "11.46.285",
    "ak-embezzlement": "11.46.130",
    "ak-shoplifting": "11.46.220",
    "ak-residential-burglary": "11.46.310",
    "ak-commercial-burglary": "11.46.310",
    "ak-auto-burglary": "11.46.310",
    "ak-carjacking": "11.41.500",
    "ak-bank-robbery": "11.41.500",
    "ak-possession-of-controlled-substance": "11.71.060",
    "ak-possession-with-intent-to-distribute": "11.71.040",
    "ak-distribution-of-controlled-substance": "11.71.040",
    "ak-manufacturing-controlled-substance": "11.71.040",
    "ak-drug-trafficking": "11.71.010",
    "ak-possession-of-drug-paraphernalia": "11.71.090",
    "ak-maintaining-drug-house": "11.71.040",
    "ak-unlawful-carrying-of-weapon": "11.61.210",
    "ak-felon-in-possession-of-firearm": "11.61.200",
    "ak-discharge-of-firearm-in-city": "11.61.195",
    "ak-possession-of-prohibited-weapon": "11.61.200",
    "ak-wire-fraud": "11.46.600",
    "ak-mail-fraud": "11.46.600",
    "ak-check-fraud": "11.46.280",
    "ak-insurance-fraud": "21.36.360",
    "ak-tax-fraud": "43.20.036",
    "ak-computer-fraud": "11.46.740",
    "ak-public-intoxication": "04.16.060",
    "ak-disturbing-the-peace": "11.61.110",
    "ak-trespassing": "11.46.320",
    "ak-vandalism": "11.46.480",
    "ak-loitering": "11.61.110",
    "ak-dui-first-offense": "28.35.030",
    "ak-dui-second-offense": "28.35.030",
    "ak-dui-third-offense": "28.35.030",
    "ak-reckless-driving": "28.35.400",
    "ak-hit-and-run": "28.35.060",
    "ak-driving-while-suspended": "28.15.291",
    "ak-criminal-attempt": "11.31.100",
    "ak-conspiracy": "11.31.120",
    "ak-aiding-and-abetting": "11.16.110",
    "ak-accessory-after-the-fact": "11.56.780",
    "ak-criminal-solicitation": "11.31.110",
    "ak-attempted-murder": "11.31.100",
    "ak-attempted-robbery": "11.31.100",
    "ak-attempted-sexual-assault": "11.31.100",
    "ak-gang-enhancement": "12.55.137",
    "ak-hate-crime-enhancement": "11.76.110",
    "ak-recidivist-enhancement": "12.55.145",
    "ak-firearm-in-felony-enhancement": "12.55.125",
    "ak-drug-school-zone-enhancement": "11.71.030",
    "ak-rico-organized-crime": "11.31.120",
    "ak-money-laundering": "11.46.130",
    "ak-juvenile-delinquency-felony": "47.12.040",
    "ak-juvenile-delinquency-misdemeanor": "47.12.040",
    "ak-juvenile-transfer-adult-court": "47.12.100",
    # CT corrections
    "ct-murder-in-the-first-degree": "53a-54a",
    "ct-murder-in-the-second-degree": "53a-54b",
    "ct-voluntary-manslaughter": "53a-55",
    "ct-involuntary-manslaughter": "53a-56",
    "ct-vehicular-homicide": "53a-56b",
    "ct-felony-murder": "53a-54c",
    "ct-aggravated-assault": "53a-59",
    "ct-assault-with-deadly-weapon": "53a-59",
    "ct-domestic-violence-assault": "53a-61",
    "ct-assault-on-peace-officer": "53a-167c",
    "ct-menacing": "53a-62",
    "ct-rape-in-the-first-degree": "53a-70",
    "ct-rape-in-the-second-degree": "53a-71",
    "ct-sexual-assault-in-the-first-degree": "53a-70",
    "ct-sexual-assault-in-the-second-degree": "53a-71",
    "ct-sexual-assault-in-the-third-degree": "53a-72a",
    "ct-statutory-rape": "53a-71",
    "ct-child-sexual-abuse": "53a-70a",
    "ct-sexual-exploitation-of-minor": "53a-196d",
    "ct-grand-theft-in-the-first-degree": "53a-122",
    "ct-grand-theft-in-the-second-degree": "53a-123",
    "ct-petty-theft": "53a-125b",
    "ct-theft-by-receiving": "53a-119",
    "ct-identity-theft": "53a-129a",
    "ct-credit-card-fraud": "53a-128b",
    "ct-embezzlement": "53a-119",
    "ct-shoplifting": "53a-119",
    "ct-residential-burglary": "53a-102a",
    "ct-commercial-burglary": "53a-103",
    "ct-auto-burglary": "53a-103",
    "ct-carjacking": "53a-134",
    "ct-bank-robbery": "53a-134",
    "ct-possession-with-intent-to-distribute": "21a-277",
    "ct-distribution-of-controlled-substance": "21a-277",
    "ct-manufacturing-controlled-substance": "21a-278",
    "ct-drug-trafficking": "21a-278",
    "ct-possession-of-drug-paraphernalia": "21a-267",
    "ct-maintaining-drug-house": "21a-277",
    "ct-unlawful-carrying-of-weapon": "53a-217c",
    "ct-felon-in-possession-of-firearm": "53a-217",
    "ct-discharge-of-firearm-in-city": "53a-203",
    "ct-possession-of-prohibited-weapon": "53a-211",
    "ct-wire-fraud": "53a-122",
    "ct-mail-fraud": "53a-122",
    "ct-check-fraud": "53a-128b",
    "ct-insurance-fraud": "53a-215",
    "ct-tax-fraud": "12-428",
    "ct-computer-fraud": "53a-251",
    "ct-public-intoxication": "53a-250",
    "ct-disturbing-the-peace": "53a-181a",
    "ct-trespassing": "53a-107",
    "ct-vandalism": "53a-115",
    "ct-loitering": "53a-185",
    "ct-dui-first-offense": "14-227a",
    "ct-dui-second-offense": "14-227a",
    "ct-dui-third-offense": "14-227a",
    "ct-reckless-driving": "14-222",
    "ct-hit-and-run": "14-224",
    "ct-driving-while-suspended": "14-215",
    "ct-criminal-attempt": "53a-49",
    "ct-conspiracy": "53a-48",
    "ct-aiding-and-abetting": "53a-8",
    "ct-accessory-after-the-fact": "53a-165aa",
    "ct-criminal-solicitation": "53a-48",
    "ct-hate-crime-enhancement": "53a-181i",
    "ct-recidivist-enhancement": "53a-40",
    "ct-firearm-in-felony-enhancement": "53-202k",
    "ct-drug-school-zone-enhancement": "21a-278a",
    "ct-rico-organized-crime": "53-395",
    "ct-money-laundering": "53a-276",
    "ct-gang-enhancement": "53a-224",
    "ct-juvenile-delinquency-felony": "46b-120",
    "ct-juvenile-delinquency-misdemeanor": "46b-120",
    "ct-juvenile-transfer-adult-court": "46b-127",
}

def apply_corrections(filepath, corrections):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    applied = {}
    not_found = []

    i = 0
    while i < len(lines):
        line = lines[i]
        for charge_id, new_code in corrections.items():
            id_pattern = f"id: '{charge_id}'"
            id_pattern2 = f'id: "{charge_id}"'
            if id_pattern in line or id_pattern2 in line:
                for j in range(i+1, min(i+6, len(lines))):
                    code_match = re.match(r"(\s+code:\s*['\"])(.*?)(['\"],?\s*)", lines[j])
                    if code_match:
                        old_code = code_match.group(2)
                        if old_code != new_code:
                            lines[j] = code_match.group(1) + new_code + code_match.group(3) + '\n'
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

already_correct = set(CORRECTIONS.keys()) - set(applied.keys()) - set(not_found)
if already_correct:
    print(f"\nAlready correct ({len(already_correct)}):")
    for c in sorted(already_correct):
        print(f"  {c}")
