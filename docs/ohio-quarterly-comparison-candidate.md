# Ohio quarterly comparison candidate

Comparison baseline: `c0a23ae101b97edcf0f6a50601fa9d393fd6c8e7`. Each distinct exact Ohio Laws URL was requested once. Each family compared the response to its own approved text, hash, heading and effective date. The pilot used its established normalization; the reviewed administrative rule used the dedicated OAC parser. A page with missing or future operative evidence is unavailable.

| Group | Charges | Sources unchanged | Changed | Unavailable | Unaffected IDs | IDs with differences or unavailable evidence |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| pilot | 19 | 61 | 0 | 0 | 19 | 0 |
| reviewed | 104 | 175 | 0 | 0 | 104 | 0 |
| major | 20 | 38 | 0 | 0 | 20 | 0 |

The 239 exact responses span 2026-11-11T04:39:14.937Z through 2026-11-11T04:43:52.624Z. The candidate JSON lists the complete affected-ID sets, every family binding, acquisition time, raw HTML digest and normalized source identities. Changed rows additionally retain observed text to support substantive review.

## Quarterly readiness

- **Chapter 2903 pilot (19 records).** The existing quarterly validator accepts a candidate interval capped at the oldest actual acquisition when all 61 pins match. A production pilot decision and shared database-backed verification remain separate approvals. A filesystem comparison cannot turn on the pilot.
- **Separately reviewed (104 records).** The existing quarterly builder validates one genuine hash-bound retrieval for each approved dependency. It was exercised in memory on the unchanged group. A later owner-approved issuance must preserve the complete acquisitions and deadline anchored to the oldest retrieval.
- **Major offenses (20 records).** The existing validator accepts only the initial publication window capped at seven days after the oldest original packet retrieval. A quarterly renewal needs a separately reviewed validator that binds a new acquisition per section to the unchanged publication packet and caps expiry at the oldest new acquisition. Keep the original packet, approval history and initial receipt intact.

Section 1509.01 and the criminal-trespass hold remain outside the approved source inventory. Existing decisions, exclusions and the three active receipt files were not changed. Eligibility also depends on deployment and record linkage. These checks do not measure production availability.

## Reproduction

Run from the repository root. The first command fetches the currently displayed Ohio Laws pages and writes candidate output only. It prints the path of its temporary response cache. For an exact offline replay use that same run’s cache; a later acquisition has its own times and may have different versions.

```sh
node --use-system-ca --import tsx scripts/data-review/compare-ohio-expired-families.ts --acquire
node --import tsx scripts/data-review/compare-ohio-expired-families.ts --replay /path/to/that/response-cache --check
```

The existing receipts still have their November 10 expiries. Future activation requires the owner’s separate approval after checking any source changes since acquisition and the relevant deployment prerequisites.
