# Florida first-launch readiness

The November 17, 2026 baseline at fc1d0fc5 contains 484 raw Florida catalog rows. Of these, 92 old identities require exact reselection. The remaining 392 configured choices comprise 25 retained and corrected legacy choices, 101 separately reviewed choices, and 266 choices across 26 subsequent publication families. Earlier reports of 436 raw rows preceded 48 additions. The figures measure different populations.

At the recorded clock, the offline receipt and manifest checks admit 291 choices. The separate 101-record family remains withheld. Its receipt expired October 8, 2026 at 18:00:34 UTC. Both its report and eligibility hashes also differ from the subsequently corrected reviewed artifacts. Changing the time alone cannot restore it. Its current records bind 130 unique statutory dependency sections.

A read-only public check of opendefender.net on November 17 returned 25 Florida choices, totalAvailable 25 and no next page. The 266 newer choices passing offline checks have not been established as live by this result. No production database inspection was performed for this closeout. [Public Florida catalog](https://opendefender.net/api/criminal-charges?jurisdiction=FL&limit=500)

Run the current accounting with:

```sh
node --import tsx scripts/data-review/florida-launch/readiness.ts
```

An optional ISO date argument evaluates another clock. Output includes each publication family's receipt deadline, eligible count and withheld IDs, all 92 exact-reselection identities, and the 130-section restoration inventory. It uses the existing manifest and in-memory seed builder without connecting to a database. Counts come from current definitions and gates.

The first-launch citation benchmark has 30 sampled rows from the official sentencing chart. Twenty-one match exact configured citations. The other nine have individual comparisons of their sampled conduct and grade. The eleven-entry crosswalk retains the original comparison set, including two missing choices subsequently added. The child-restraint follow-up adds the remaining current kidnapping predicate groups and all six aggravated false-imprisonment groups. This does not establish a statewide offense denominator or exhaustive coverage. [Citation crosswalk](florida-launch-citation-crosswalk.md) · [Child-restraint scope](florida-child-restraint-predicates.md)

The historical coverage inventory still describes 126 records as current at its own snapshot date. Its four known source exceptions, §§213.29, 386.04, 112.191 and 381.986, remain historical unresolved findings awaiting a specific reconciliation. This packet neither clears them nor asserts that the statutory sections are currently absent. Historical §796.03 remains outside current publication. Judicial limits and qualifications already recorded for sexual battery and juvenile sentencing remain in the corrected guidance. Existing exact-reselection dispositions stay in force.

The remaining launch steps are bounded:

1. Review and merge this accounting, then select the exact release revision. Verify the 26 independently approved families at that revision and the actual clock.
2. For the old 101-record family, acquire candidate evidence for the emitted 130-section dependency set into an isolated directory. Compare against the **current** reviewed report and preserve all corrected definitions, quotations and decisions. Matching the older October receipt is insufficient. Review changed legal text or operative metadata before proposing a replacement receipt.
3. Prepare a concrete reviewable quarterly receipt proposal anchored to real acquisitions, bound to the current report and eligibility. The existing assembly command's `--prepare` writes held eligibility and removes the receipt, so it must not be used as a read-only check of active files. Candidate preparation belongs in a separate disposable checkout, with an explicit diff review.
4. After separate authorization, reconcile the production revision and import approved choices. Database mapping, schema and imports require their normal approval. Verify all intended public IDs, pagination, explanations and held IDs after release.

The next legal-review work can follow specific material omissions or changed sources. It does not require restarting every reviewed Florida charge. The historical source exceptions and unsampled offenses remain explicit limits while first-launch restoration proceeds.

Validation covers the raw/configured/withheld partitions, future expiry, unchanged receipt bytes and benchmark accounting. This packet performs no acquisition, renewal, import or production activation.
