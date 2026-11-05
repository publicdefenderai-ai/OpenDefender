# Ohio major-offense publication batch

This batch adds 20 individually supported choices across 17 Revised Code sections. It builds on PR101's 32-section research packet, which contains 34 conduct mappings. Twenty mappings receive publication treatment here; fourteen remain unpublished. The two whole-section holds and two non-offense dispositions in that packet remain unchanged. This is not statewide completion.

## Published scope

- 2905.03: unlawful restraint; 2905.12: coercion.
- 2909.08: separate aircraft and airport-operation identities.
- 2909.09: vehicular vandalism.
- 2909.10: separate railroad-vandalism, railroad-vehicle trespass, and train-operation interference identities.
- 2909.22 and 2909.23: support for terrorism and terroristic threats.
- 2909.26, 2909.27, 2909.28: separately defined weapon possession, use, and manufacture-component offenses.
- 2909.29: money laundering in support of terrorism, retaining each monetary grading threshold.
- 2909.081: aircraft laser interference; 2909.101: crossing-device vandalism.
- 2911.23: public-amusement trespass, including additional community service.
- 2911.31: safecracking; 2911.32: coin-machine tampering, including the prior-offense branch.
- 2911.211(A)(1) only: aggravated trespass. The critical-infrastructure branch is not approved by this entry, and the existing section 1509.01 hold is unchanged.

Each identity carries its own conduct and grading spans, statutory name, content hashes, source URL, effective date, and complete retained supporting documents. Thirty-eight distinct official sections support the batch. The unlawful-restraint definition dependency is corrected to 2971.01, as expressly cited in 2905.03. Shared sentencing text never supplies an offense's grade: each grade is established in that offense's own provisions. Adult natural-person ranges remain qualified by offense-specific sanctions, specifications and other case-specific rules.

The other fourteen mappings concern kidnapping, abduction, extortion, criminal usury, trafficking, document servitude, arson, disrupting public services, vandalism and criminal mischief. Their research remains available; they are not silently activated or counted as covered by this batch.

## Availability and translations

Configured catalog entries increase by 20 (16 primary felony, four primary misdemeanor). Multi-grade entries preserve all supported categories. Configured entries are not live availability: runtime selection still requires a completed eligible database import, current supporting links, and this batch's own current evidence window. Older Ohio pilot and reviewed receipts cannot independently activate or withhold these new identities.

All twenty new summaries currently use an explicit English fallback for Spanish and Chinese requests. The resolver sets the untranslated notice rather than presenting English as a draft translation. Existing translated summaries are unchanged.

## Evidence window and future maintenance

The initial batch window is derived exclusively from the retained official acquisitions, not from the date the generator runs. It expires November 10, 2026 at 07:20:48.867 UTC. Its packet hash binds both source evidence and publication definitions. No existing Ohio, California or Florida receipt is renewed.

The deadline monitor includes this window. Regeneration alone cannot extend it. Future maintenance must reacquire the bound sections through the official-source acquisition process, compare text and operative metadata, review changes, and regenerate the evidence packet and its acquisition-derived window. Changed substantive evidence must not be treated as an unchanged renewal. The initial-window validator deliberately does not accept a date-only extension or an unrelated refresh method.

## Reproducible offline checks

- `node --import tsx scripts/data-review/prepare-ohio-major-publication.ts --check`
- `npx vitest run tests/ohio-major-publication.test.ts tests/ohio-major-runtime-gates.test.ts tests/ohio-common-authority-boundary.test.ts tests/ohio-source-database.test.ts tests/ohio-major-substantive.test.ts tests/statutory-receipt-freshness.test.ts tests/data-sources-inventory.test.ts`

The packet regeneration check is an explicit review command, not an always-blocking historical drift test. Unit tests independently check evidence mutation, dependency omission, identity, expiry, translations, and catalog counts. The release browser allowlist includes the new twenty-record API identity and penalty contract; adding that check does not claim it has run.

No database operations, deployment, existing-receipt renewal or monitoring activation are performed by this batch. After review and merge, a separately authorized import and deployment are needed before claiming that these choices are available to users.

## Validation recorded for this change

- Seven focused suites: 48 passing tests. After the final span-bound hardening, the ten publication tests also pass independently.
- Production build succeeds.
- Broader unit/regression run, excluding database integration files: 2,285 passed, 75 skipped, one failed. The guidance schema-error route test times out with an error in logging; the same isolated test fails on the unchanged merged PR103 base (`ce1bfe15`) under the same local setup.
- Application typecheck reports `Pool.options` in `server/services/california-import-session.ts:27`. The unchanged merged PR103 base reports the same diagnostic. No Ohio diagnostic was emitted.
- Browser release checks were added but not executed; no live availability is claimed.
