# Texas arrest, flight and identification

| 2025 DPS rank | Offense code | Adult arrests | Reviewed scope |
|---:|---|---:|---|
| 8 | 48010006 | 18,432 | §38.03(a), (c), intentional obstruction by force, ordinary Class A |
| 13 | 48010017 | 14,075 | §38.04(a), (b), ordinary intentional flight from lawful arrest or detention, Class A |
| 19 | 48010020 | 9,792 | §38.04(b)(2)(A), using a vehicle during flight, third-degree felony |
| 22 | 48990009 | 8,163 | §38.02(b), (d)(2), intentionally giving false information while subject to a valid arrest warrant, Class A |

The four codes account for 50,462 adult arrest records. Across the frozen 2025 top 25, this candidate has individually reviewed mappings for 21 codes, representing 387,918 of 447,911 adult arrest records. Arrests can include the same person more than once. These figures measure the benchmark, whose scope excludes unranked Texas crimes. Four ranked codes still require treatment: unlawful carrying of a weapon, aggravated assault with a deadly weapon, driving while license invalid with specified circumstances, and violation of a bond or protective order. [Texas DPS benchmark](../scripts/data-review/output/texas-2025-arrest-priorities.json)

Nine rows comprise two resisting, three evading and four identification choices. The resisting felony's deadly-weapon predicate explicitly covers arrest or search. The separate evading statute requires a lawful attempted arrest or detention. The ordinary refusal-to-identify row requires a lawful arrest. For false information, lawful detention or a request to a person reasonably treated as a witness under the statutory good-cause standard can also qualify. The separate detained-driver refusal offense in §38.02(b-1), watercraft, tire-deflation devices, injury, death and smuggling circumstances were not assigned new choices. The catchall resisting/obstruction ID remains held. [Texas Penal Code, chapter 38](https://tcss.legis.texas.gov/resources/PE/htm/PE.38.htm)

## Competing vehicle provisions

The official publication prints two versions of §38.04(b). In *Adetomiwa v. State*, 421 S.W.3d 922, 924–27 (Tex. App. Fort Worth 2014), the court reconciled the 2011 amendments and applied the third-degree vehicle branch of S.B. 1416. In *Fuller v. State*, the Austin court applied that construction and affirmed the third-degree motor-vehicle conviction. The retained statute includes both versions. The vehicle explanation links directly to the court opinion. The retrieved court PDF SHA-256 is `56f6be1f9f90a4b3f914af82c516972b082d891b2f8a7c05d691366b00ce6461`. [Fuller, No. 03-18-00709-CR, pp. 7–10 (June 25, 2020)](https://www.txcourts.gov/media/1448063/03-18-00709-cr-opinion.pdf)

The publisher's CPJC 38.2 supports resisting and CPJC 38.4 models vehicle evasion. Ordinary evasion, prior-only evasion and the identification choices receive no instruction link in this packet. [Texas Bar Books, CPJC 38.2](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F38_Obstructing_Governmental_Operation%2FCPJC38-2.htm&version=013) · [CPJC 38.4](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F38_Obstructing_Governmental_Operation%2FCPJC38-4.htm&version=026)

The nine records have 43 source links to 15 distinct official sections. Each carries its chapter acquisition time, section effective-date notation and content hashes. The candidate has 59 eligible Texas choices across 135 catalog IDs, with 76 held. A completed older import cannot serve the corrected ordinary evading and refusal identities if their new dependency links are missing. Production availability requires separate verification. Reproduce the candidate with `node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts ranked-arrest`.
