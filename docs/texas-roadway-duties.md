# Texas roadway duties and plate scopes

Base: `38842e5c4aa002db4ea940352785af79dde8ee1b`. This batch adds 22 misdemeanor choices: two Transportation Code §545.421 fleeing-police scopes, four §550.025 collision notification/license scopes, and sixteen §504.945 plate scopes. Each has a separate ID, conduct subdivision, grade reference, and complete dependency list. No existing record is retired or automatically substituted.

## Evidence and boundaries

The retained packet contains 21 statutory documents (15 prior acquisitions reused without changing their dates and six newly acquired documents), plus full enrolled texts and bounded amendment/effective-date spans from four bills. Replay is offline. The source manifest preserves all 673 prior records and its existing metadata byte-for-value; only the 22 new records are appended. English explanations are explicit fallbacks in Spanish and Chinese, not translations.

- Section 545.421 requires wilful conduct, a pursuing police vehicle, the signal, a uniformed officer with a prominently displayed badge, and agency insignia. The Class A branch separately requires reckless imminent danger of serious bodily injury to another. Intoxication creates a permissive presumption subject to Penal Code §2.05, not automatic guilt. Highway scope and actual-highway-work exclusions remain express. H.B. 1831 (2009) changed the vehicle-insignia wording, not the origin of the danger grades.
- Section 550.025(a)(1) imposes reasonable steps to locate and notify; (a)(2) requires a license only if requested and available. Its grade literally measures damage to fixtures and landscaping. These choices do not resolve structure-only valuation. H.B. 2190 (2023) changed accident terminology to collision without creating the existing grades.
- Section 504.945(b)'s ordinary fine is at most $200; the knowing-owner alteration upgrade requires its additional facts. Fictitious plates independently carry Class B under (e), which predates 2023. The (a)(7)(C)/(f) ladder is separately $300, $600 with one qualifying prior, or Class B with two or more qualifying priors. The owner-alteration upgrade is not imported into that ladder. Equipment exclusions and discretionary correction dismissals retain their limited subdivisions and cumulative conditions. H.B. 2195's September 1, 2023 transition preserves earlier law when any element predates that date.

The (a)(2) other-law plate-issuance branch is not included: a foreign plate is not by itself proof of unlawful issuance or registration. The Chapter 51/H.B. 2017 applicability issue remains held; this batch makes no assertion resolving its judicial or offense-date applicability.

## Accounting and priority

Offline candidate accounting is **695 configured, 617 selectable, 78 withheld**, with **310 source identities and 7,757 snapshot/link records**. These are deterministic candidate counts, not production availability or authorization to import. Existing holds, including the generic forgery hold, remain intact.

The official DPS 2025 adult-arrest workbook independently ranks fleeing police at 78 (1,551), fixture/landscaping damage at 80 (1,514), and fictitious plates at 114 (843): 3,908 reported adult arrests combined. Counts are arrest records, not distinct people or convictions. The retained ranking preserves the workbook's numeric serialization for §545.421 rather than silently changing the raw citation cell.

## Validation

Independent tests cover grade/fine ladders, conduct predicates, chronology, exact evidence replay, evidence tampering, missing dependencies, saved exact-ID resolution, and language fallbacks. The complete paginated browser fixture checks every new choice and retains legacy exclusions. Required batch-consistency checks independently compare catalog, manifest, seed and coverage accounting. Validation: 24 focused tests, 27 saved-guidance/PDF tests, 39 required batch-consistency tests and 33 isolated browser tests passed; typecheck, production build and exact 22-record replay exited zero. The non-writing coverage report computed these counts and exited one for the existing Georgia/Pennsylvania coverage shortfalls; this is not a clean nationwide coverage gate. An initial restricted local-server run could not bind its route server; the unchanged consistency command passed after local-server access was allowed. No full-suite run or production verification is claimed.

No database operations, production changes, receipt changes, activation, or publication are part of this batch.
