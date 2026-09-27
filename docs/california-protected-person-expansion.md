# California protected-person and public-place expansion

This combined batch proposes 21 exact charge choices, raising configured California selection from 153 to 174. It covers school, transit, highway-worker, military-service, elder/dependent-adult, custodial-officer, juror and sports-official assault/battery provisions, plus parking-control assault and injury-producing battery on a peace officer. These are repository counts; source seeding and deployment determine live availability.

Start with the [combined review packet](../scripts/data-review/output/california-protected-person-review.md). Each identity includes its primary text, penalty, dependencies and unresolved limitations. The [coverage report](../scripts/data-review/output/california-expanded-catalog-coverage.md) gives the aggregate counts.

## Distinctions preserved

- §243.25 requires actual knowledge of elder/dependent-adult status. It must not inherit a mere should-have-known standard from nearby provisions.
- §243.1 cites the custodial officer definition in §831 and provides felony punishment. §241.1 also refers to §831.5 and has a misdemeanor alternative.
- The injury branches in §§243.3 and 243.6 have different imprisonment and fine wording. The former specifies state prison; the latter specifies §1170(h). The no-injury penalty is not silently applied to an injury case.
- §243(c)(2) requires injury as defined in §243(f)(5), not just offensive contact. §241(b) has a six-month jail maximum rather than the one-year language of many neighboring provisions.
- School and transit location provisions retain their exclusions and relationships to more specific victim-based provisions. Lawful labor-dispute exclusions remain explicit where stated.
- School-district police status, highway-worker volunteer status and the dependent-adult definition retain their Education, Labor and Health and Safety Code sources.

## What stays unpublished

The prior 59-section open queue remains fully accounted for, and two partly covered sections, §§241 and 243, are included for new branches. The 21 reviewed primary sections leave 40 sections in substantive research. Partially covered sections are not certified complete.

§243.9 gassing remains open pending research on the unspecified county-jail alternative and local-detention-facility scope. It is a consequential offense with an explicit felony term, not a minor-offense deferral. The broader §§243(b)/(c)(1) branches are not added here; the lifeguard definition has an apparent cross-reference error recorded as CA-002 in the [source-anomaly inventory](statutory-source-anomalies.md). The official reference is preserved, not repaired. This does not reopen the independently supported peace-officer branch in §243(c)(2).

The earlier low-priority infraction deferral and three attorney questions remain unchanged. No new attorney decision is required to review this proposed batch. Additional source-history research remains agent work before any lifeguard interpretation is proposed for publication.

## Reuse and process improvements

The batch reuses 71 retained source sections and adds seven dependencies from the same hash-verified official archive acquired September 24. Total retained research evidence becomes 304 sections / 307 versions. Offline review is not a freshness renewal. Null effective dates remain null.

Each normalized addition now carries an explicit primary law code. The two immutable historical batches explicitly default to PEN at registration; the new authored batch declares its law code. Citation, primary-source URL, effective-date lookup and search aliases use that identity. Tests cover a Vehicle Code primary and same-number PEN/VEH identities, then check every actual addition's declared code against its source keys and runtime projection. This addresses PR #21's review finding without rewriting historical evidence hashes.

The dependency in Labor Code §1720.4 contains a known January 1, 2031 repeal. Its date and exact source span are retained separately from unresolved holds; it is operative in the snapshot. This records the future change and does not install an automatic refresh or reminder.

English content continues to display an unavailable-translation notice in Spanish and Chinese. Reviewed translations, comprehensive case-law review and live deployment parity remain outside this bounded statutory pass.

## Validation and release

Replay `acquire-protected-person.py`, then run `protected-person-review.ts` and `coverage.ts` with `node --import tsx`. Tests reject altered definitions, source dependencies, excerpts, lost queue rows, omitted future transitions and source-anomaly substitutions. The source gate also rejects a missing Education Code definition for school-district police.

After review and merge, use the normal Replit source seed/republication workflow and verify live exact-ID selection, penalties and guidance. No production database, deployment, real case inputs or external AI requests were used. GitHub's missing test-tool installation remains a separate infrastructure issue.

Validation result: 161 targeted tests passed, with two existing opt-in tests skipped. Typecheck and production build passed. Nine browser/API checks passed across all three addition batches. Acquisition replay was byte-identical.
