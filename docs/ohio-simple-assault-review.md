# Ohio Assault (§ 2903.13): evidence review, not activation

Reviewed September 16, 2026, Pacific time.

Subsequent progress is recorded in `ohio-three-charge-batch.md`: twelve source-first records and twenty-two selectable Ohio charges. The counts below describe this earlier review. The §2903.13 authority issue remains unresolved.

## Result

The official current assault page was acquired, together with 16 supporting pages. One of the 18 requested pages, § 3727.01, consistently redirected to the official “number not found” route. The acquisition command preserved successful evidence and returned a nonzero exit status. It did not update runtime approval.

The new source-first assault record remains **withheld**. The runtime catalog and existing saved-case identities were not changed. Ohio remains at nine source-first records and nineteen selectable records; seventeen offense-bearing Chapter 2903 sections still lack source-first records.

## Reviewed structure

The machine-readable report retains offset-checked quotations from the reviewed primary-page hash for:

- Both conduct paths: knowing physical harm/attempt and reckless serious physical harm. Neither requires the weapon element found in felonious assault.
- All ten division (C) groups, including the baseline M1 grade, caretaker and custody branches, school circumstances, emergency-responder targeting, child-services personnel, hospital personnel, justice personnel and pregnancy specifications.
- The mandatory F4 term of at least twelve months is restricted to the specified C5a peace-officer/BCI-investigator case with serious harm; it does not automatically apply to every emergency responder.
- Hospital and justice-system branches retain knowledge, duties and distinct qualifying-prior conditions. The hospital branch additionally requires the hospital's specified training. Their M1 fines are discretionary ceilings up to $5,000, not fixed fines.
- Division (D)'s same-conduct/same-victim menacing allied-offense provision, and all 26 local definition entries.

The existing pinned sentencing page separately confirms that the misdemeanor known-pregnancy specification requires a definite mandatory jail term of **at least thirty days**. The felony specification uses a different rule and remains subject to C6. These are not automatic additional six-month terms.

Structural review is not full dependency approval. School credential ranges, professional/legal-status definitions, material exclusions and all relevant runtime sentencing links still require closure before publication.

## Incorporated-definition issue

Current § 2903.13(E)(20) adopts the meaning of “health maintenance organization” from § 3727.01. That meaning also affects the local hospital definition and exclusions. The current official URL fails to provide the adopted text.

A secondary historical lead was located:

https://law.justia.com/codes/ohio/2023/title-37/chapter-3727/section-3727-01/

Its heading labels § 3727.01 “Repealed Effective 9/30/2024 by h.b. 110, 134th General Assembly.” This is a **historical secondary lead, not approved current authority**. An official-site redirect alone does not establish repeal, and a historical definition cannot be silently treated as the operative current definition.

The unresolved question is the legal treatment of that incorporation after the reported repeal. Obtain official repeal/transition evidence and establish the applicable definition; do not substitute a similarly named present-day hospital or HMO definition by analogy. Permission to use flagged secondary sources does not itself resolve which version legally governs.

## Artifacts and checks

- Acquisition: `scripts/data-review/output/ohio-simple-assault-evidence.json`
- Quoted review: `scripts/data-review/output/ohio-simple-assault-publication-review.json`
- Acquisition command: `npx tsx scripts/data-review/acquire-ohio-homicide-support.ts --simple-assault`
- Review command: `npx tsx scripts/data-review/review-ohio-simple-assault.ts`
- Focused tests cover complete quoted groups, critical grading conditions, corruption/recalculated-hash rejection, and nonpublication even when acquisition failures are removed.

TypeScript and all fourteen tests across the new review, Ohio database and deployment-seed suites passed. No database reseeding, production deployment, new user-facing translation or attorney sign-off occurred.