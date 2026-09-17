# Ohio source-first pilot — first implementation slice

Date: September 16, 2026. Environment: development. This is a progress record, not an Ohio-completeness certification or a reissued national forecast.

## Estimate withdrawal

The national delivery, person-week, and legal-review-hour estimates have been withdrawn from the master-plan source and Word document. Reassess after measured Ohio work. No replacement delivery estimate is proposed.

## What ran

**Continuation correction:** A subsequent full-section review found that § 2903.43(I) creates a fifth-degree felony despite its administrative heading. The current accounting is **24 offense candidates, 14 supporting provisions, and 2 structural-interpretation sections**. The figures below describe the initial slice, not the corrected current inventory. See `docs/ohio-chapter-2903-continuation.md` for the expanded records and remaining work.

- Enumerated the official Ohio Revised Code root and title indexes: 33 titles and 971 chapter links.
- Enumerated Chapter 2903, Homicide and Assault: 40 distinct section links, including longer section-number suffixes.
- Retrieved complete official section evidence for all 40, with exact identities, effective dates, source URLs, retrieval times, text fingerprints, and explicit failure accounting.
- Accounted for all 40 sections independently of the legacy charge catalog: 23 offense-candidate sections, 15 supporting provisions, and 2 needing legal interpretation of publication units and conditional grading.
- Extracted names from official headings. No accounting row requests an attorney simply to transcribe or confirm a name.

The two interpretation items are §§ 2903.06 and 2903.08. Their multiple statutory offenses and conditional grades require a defensible representation; the system does not assume each paragraph is a distinct crime.

The 23 candidates are NOT 23 verified, published offenses. The accounting report creates no selectable records. Its publication count is therefore zero; runtime activation is a separate operation described below.

## First end-to-end records

Two independently source-derived records are now available through the development Case Guidance charge API:

| Official offense | Statutory source | Supporting penalty evidence |
| --- | --- | --- |
| Aggravated murder | Ohio Rev. Code § 2903.01 | § 2929.02(A) |
| Murder | Ohio Rev. Code § 2903.02 | § 2929.02(B)(1) and a separate § 2929.02(B)(4) fine dependency |

These are section-level selections, not a completed breakdown of every charging theory, enhancement, or circumstance. Penalty descriptions remain conditional summaries of the cited provisions, not individualized sentencing advice. Full capital-sentencing and historical-law analysis is not claimed.

The new internal IDs are independent of the legacy degree-labelled murder records. The three ambiguous legacy IDs require reselection and are not silently aliased in the selector, saved-guidance resolver, or PDF resolver.

The Ohio development API increased from 13 to 15 selectable records. Both new records return current provenance from the public source endpoint; the old first-degree murder ID returns 404. This count is availability, not a statewide verification percentage, and does not re-certify the other 13 records' inherited descriptions.

Ohio partial-coverage notices now appear in both charge-selection surfaces, with English, Spanish, and Chinese text. Users are told not to choose a different offense as a substitute for a missing charge.

## Refresh and safety controls

The pilot checks all three unique source pages: §§ 2903.01, 2903.02, and 2929.02. A successful live check issues a receipt valid for at most seven days. The check must reproduce exact pinned text fingerprints, titles, and effective information.

A source mismatch does not update or approve the source text. A failed live refresh revokes the previous receipt. Expired, missing, malformed, or mismatched receipts make pilot records unavailable at both the selection and current-provenance boundaries, including a long-running process.

The refresh command currently requires an operator. Automatic scheduling and alerts are not yet implemented; the expiry guard prevents this omission from becoming indefinite silent currentness.

The legacy Ohio importer still emits its own 115-row manifest. The loader composes eligible source-first records separately, preventing an import from overwriting the legacy evidence ledger with an incompatible shape.

## Reproducible commands

1. `npm run review:ohio-discovery` — official title/chapter inventory and Chapter 2903 source retrieval; uses bounded requests and a local cache.
2. `npm run review:ohio-chapter-accounting` — replay chapter accounting against the evidence, with hash/title/quote checks; writes JSON and CSV.
3. `npm run review:ohio-pilot-refresh` — bypass the discovery cache and compare the three live pilot dependencies; renew or revoke the receipt.
4. `npm run db:seed:ohio -- --dry-run` — inspect composed source and charge counts without database writes.
5. `npm run db:seed:ohio` — synchronize the validated Ohio evidence to the configured development database when intentionally run there.

No new schema migration or production deployment was performed for this slice.

## Evidence outputs

- `scripts/data-review/output/ohio-code-inventory.json`
- `scripts/data-review/output/ohio-chapter-2903-discovery.json`
- `scripts/data-review/output/ohio-chapter-2903-accounting.json`
- `scripts/data-review/output/ohio-chapter-2903-accounting.csv`
- `scripts/data-review/output/ohio-chapter-2903-refresh-receipt.json`

The final cached discovery replay recorded 5.201 seconds, 75 cache hits, and zero network requests or failures. This measures only cached retrieval/parse execution. It excludes implementation, initial acquisition, legal interpretation, integration, and testing and must not be extrapolated into a national completion estimate.

## Verification

Type checking and focused automated tests cover official index parsing, source/hash identity, chapter accounting, importer isolation, expiry and revocation, separate sentencing dependencies, legacy reselection, and localized coverage notices. The transactional development seed completed successfully with 15 selectable records and 18 authority links.

Public API checks confirmed both new offense names/citations and their provenance, with the old unsupported first-degree ID excluded. Browser selection-flow verification is recorded separately in the agent's delivery report.

No independent attorney accuracy audit, nationwide census, comprehensive historical-law check, or full substantive AI-guidance evaluation has been completed in this slice.

## Remaining Ohio pilot work

- Complete extraction and validation for the remaining Chapter 2903 offense candidates, including materially distinct statutory variants and all necessary penalty dependencies.
- Resolve the two focused structural interpretation items, using source-based analysis first and legal review only where ambiguity remains.
- Enumerate sections outside Chapter 2903; the statewide chapter list is a discovery map, not a completed section census.
- Expand through Ohio felony provisions and a documented priority set of misdemeanors, including criminal provisions outside Title 29.
- Connect measured coverage accounting to continuing publication, legal-exception handling, and maintenance alerts.
- Schedule source monitoring and test a complete amendment-to-review-to-activation cycle.
- Evaluate charge-specific guidance accuracy and jury-instruction mapping beyond basic selection/provenance.

The national memo remains deferred until this broader Ohio work supplies credible throughput, exception-rate, and maintenance measurements.