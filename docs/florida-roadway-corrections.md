# Florida roadway corrections

Four existing reviewed choices receive source-bound sentencing and dependency corrections. No IDs or catalog choices are added. Ordinary misdemeanor treatment becomes the primary category for DUI under §316.193(1) and knowing suspended-license driving under §322.34(2); their conditional felony alternatives remain present. Public primary-tier accounting changes by two fewer felonies and two more misdemeanors, without changing total coverage.

| Existing choice | Bounded correction |
| --- | --- |
| §316.061(1) property-damage crash | Ordinary second-degree misdemeanor limits and exact duties dependency. |
| §316.193(1) DUI | Branch-specific mandatory jail, community work, probation, interlock, impoundment and license consequences; conditional felony remains an alternative. |
| §316.193(3)(c)3. DUI manslaughter | Four-year minimum, ordinary/first-degree ranges, enumerated prior-conviction branch, current BUI predicate citation, license consequences and conditional domestic-repeat treatment. |
| §322.34(2) knowing suspended-license driving | Ordinary ranges, subsection (10) limited-suspension exception, subsection (11) conditional compliance election and knowledge-presumption limits. |

The packet retains 32 official sections: 23 newly acquired and nine reused. Each record retains its own identity, conduct and grade spans. Supplemental provisions outside the charged subdivision have separately validated offsets and hashes. The compiler rejects conflicting shared source bodies instead of silently replacing other records' evidence. Names and translated base summaries remain unchanged; new sentencing detail is provided in English, Spanish and Chinese with the existing draft-translation notices.

The October 1, 2025 and July 1, 2026 commencement clauses are separately retained with official session-law URLs and quote hashes. The current BUI manslaughter reference reflects the 2026 organization; earlier conduct needs the applicable earlier version. Domestic-repeat conditions do not turn negligent causation into intentional injury, and the first-DUI probation rule does not reduce the manslaughter minimum.

The exact-citation parser now accepts valid one- or two-digit Florida chapters, including supporting §61.13016. It still requires an exact declared dependency and official URL; malformed, undeclared and mismatched citations fail closed.

## Runtime boundary

The existing 101-record reviewed family remains subject to its unchanged receipt and database eligibility gates. This packet changes evidence and product definitions, so the old receipt cannot approve the new report merely because an earlier acquisition matched. No receipt is renewed, date extended, import run or production source activated. The separate 15-record persons family is unchanged. This does not establish live availability.

## Reproduction and verification

`node --import tsx scripts/data-review/florida-roadway/prepare.ts --check` reproduces the packet offline from committed evidence.

`node_modules/.bin/vitest run tests/florida-roadway-corrections.test.ts` checks identities, source hashes, exact spans, category alternatives, translations, malformed citation rejection and the unchanged receipt boundary.

`node_modules/.bin/tsc --noEmit` checks application types. The coordinator runs the combined regression suite after integration with the parallel Ohio batch.

Focused validation: all 18 Florida suites passed (107 tests, 43 existing skips); the added sixth roadway guard then passed with the other five roadway tests. Application typecheck and offline reproduction passed. No database-dependent tests ran.
