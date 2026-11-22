# Texas Class C disorderly-conduct branches

## Scope

Ten choices cover §42.01(a)(1), (2), (3), (5) (public and residential noise separately), (6), (10), and (11)(A)–(C). Each identity names its own conduct and retains its own conditions. Current §42.01 ends at (a)(11); there is no (a)(12). The three existing firearm-discharge/display choices under (a)(7)–(9) are unchanged.

Section (a)(4), abuse/threat, is not added. The accounting file records that unresolved speech application separately. Jimmerson v. State, 561 S.W.2d 5 (Tex. Crim. App. 1978), explicitly did not decide its narrowing-construction question and instead found the actual words missing from the probable-cause record. It is not described as a definitive holding that clears every abuse/threat prosecution. Counterman and the unrelated Owens electronic-harassment decision do not independently resolve that entire branch. The generic `tx-disorderly-conduct` ID remains held for exact reselection.

## Evidence and substantive boundaries

Twelve statutory documents support the ten choices. Four official enactments retain full normalized text, source hashes and sliceable section spans. Two public judicial sources have retained text and checked spans:

- City of Houston v. Hill, 482 U.S. 451 (1987): official U.S. Reports PDF from the Library of Congress. Selected majority pages include protected police criticism and the fighting-words limitation; the syllabus is not substituted for the majority.
- Coggin v. State, 123 S.W.3d 82 (Tex. App.—Austin 2003): selected majority-opinion passages retrieved through the web from the FindLaw mirror. The artifact accurately identifies selected browser text, not a raw/full-opinion download. Its acquittal concerned the actual record; the summary does not declare every offensive gesture categorically immune. The separately hosted dissent is not used as the majority.

The speech summaries require the immediate-breach/fighting-words limitation, not mere insult or offense. Noise preserves §42.04’s conditional pre-arrest order and defenses only for (a)(5). The 85-decibel provision requires a level exceeding 85 after specified official notice and remains a permissive presumption under §2.05(a), not a universal decibel floor or automatic guilt. Lawfully conducted space-flight noise and sport-shooting-range limits remain specific to their predicates.

The school exclusion applies only to (a)(1), (2), (3), (5) and (6), and requires a student younger than 12, a public school campus and regular school hours. The retained enactments distinguish the 2011 sixth-grade-or-lower rule from the 2013 under-12 rule. H.B. 1791 added the lawful space-flight noise exclusion effective September 1, 2013. None is dated to the latest 2023 amendment merely because that is the section version.

Public fighting retains justification dependencies. Exposure retains intentional/knowing conduct plus the separate recklessness condition; it is not automatically the separate §21.08 sexual-intent offense. The three looking branches require their own location/entry conditions and lewd OR unlawful purpose; the dwelling and hotel branches are not rewritten to require an unstated public-place element.

All ten ordinarily carry Class C punishment, a fine up to $500. Section 12.43(c)’s three qualifying convictions and 24-month offense-date conditions are retained; its possible 180-day/$2,000 punishment is not silently turned into an ordinary Class B label.

## Integration and validation

Base: main `d99b3991352329f5606937428b4a30124a2b226d`; independent of pending NY PR 296. All 595 inherited manifest records and manifest metadata remain byte-equivalent as parsed JSON. Configured/offline-eligible/held identities are 605/528/77. There are 292 source keys and 6,290 snapshot/link references. These are offline figures, not production availability.

- Source-only replay reconstructs all 10 records exactly.
- Six focused suites: 37 passed, zero failed, including independent coverage and judicial/enactment hash/span checks.
- App typecheck and production build passed.
- Three isolated Texas browser suites: 30 passed, zero failed/skipped; no retries.
- No full regression run or production check was performed.

The complete snapshot-bound pagination helper from PR 295 is preserved. Spanish and Chinese are explicitly marked English fallback; no unverified instruction reference is added. No receipt, import, activation, database or deployment operation is included.

## Exact choices

| ID | Subdivision |
|---|---|
| `tx-pc-42-01-fighting-words` | 42.01(a)(1) |
| `tx-pc-42-01-fighting-gesture` | 42.01(a)(2) |
| `tx-pc-42-01-chemical-odor` | 42.01(a)(3) |
| `tx-pc-42-01-public-noise` | 42.01(a)(5) |
| `tx-pc-42-01-residential-noise` | 42.01(a)(5) |
| `tx-pc-42-01-public-fight` | 42.01(a)(6) |
| `tx-pc-42-01-public-exposure` | 42.01(a)(10) |
| `tx-pc-42-01-looking-dwelling` | 42.01(a)(11)(A) |
| `tx-pc-42-01-looking-hotel-room` | 42.01(a)(11)(B) |
| `tx-pc-42-01-looking-private-area` | 42.01(a)(11)(C) |
