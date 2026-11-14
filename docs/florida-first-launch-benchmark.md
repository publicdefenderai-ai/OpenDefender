# Florida first-launch omission benchmark

On the configured catalog at `a3c970a1`, the 30 independently selected felony-chart citations produced **4 identical citations, 11 same-section candidates, and 15 absent sections**. The sample contains three choices from each offense severity level in Florida's [2026 sentencing chart, §921.0022](https://www.flsenate.gov/Laws/Statutes/2026/921.0022). Selection uses the 15%, 50% and 85% positions in the official order without consulting the product. It measures statute-number alignment across severity levels. It does not measure arrest volume, statewide completeness, the quality of every explanation or current production availability. The separately requested priority cases below did not enter the 30.

The chart uses sentencing shorthand. For example, its level-seven 14-to-under-28-gram amphetamine row cites a parent subdivision also used for a broader catalog entry. Identical citation text alone does not prove an exact factual or sentencing match. A same-section result may reflect a broader entry, another offense altogether or a different tier. A section-absent result means no approved configured choice uses it as its primary code. Legacy entries requiring reselection, dependencies and search aliases cannot satisfy that check.

The [30 case results](../scripts/data-review/florida-launch/baseline-citation-results.json) include the publisher description, selected chart position, classification and candidate IDs. The [source snapshot](../scripts/data-review/florida-launch/official-sample.json) records the original URL, acquisition time, page hash and selected rows. The archived September inventory counted 1,431 cached sections without establishing a statewide offense denominator. Neither sample should be used as the denominator for a statewide percentage.

### Priority dispositions

| Citation | Baseline | Proposed treatment |
|---|---|---|
| §825.103(3)(a), (b), (c) | All three absent | Three choices bind the six exploitation pathways in subsection (1) and the separate value grades in (3). First-degree felony at $50,000 or more, second degree from $10,000 to under $50,000, third degree below $10,000. Subsection (2) provides a limited permissive inference. Subsection (4) is a separate pretrial property proceeding. |
| §784.07(2)(a) | Absent; old officer-assault identity requires reselection | Assault ordinarily moves from M2 to M1. Require underlying §784.011 and knowing assault on an eligible person performing official duties. Keep the existing hold while preparing branch-specific eligibility. |
| §784.07(2)(b) | Absent | Battery moves from M1 to F3. The six-month minimum is specific to a law enforcement officer and furtherance of a riot. The weapons conditions in (3) impose separate three- or eight-year minimums. Keep this priority row open until these alternatives reach explanations. |
| §784.07(2)(c) | Absent | Aggravated assault moves from F3 to F2. The three-year minimum refers to a law enforcement officer. Other protected roles cannot automatically inherit the minimum. |
| §784.07(2)(d) | Absent | Aggravated battery moves from F2 to F1. The five-year minimum refers specifically to a law enforcement officer. Preserve distinctions among the protected persons and §784.07(4)'s separate felony sentencing rank for furtherance of a riot. |

The [2026 statewide bond schedule, item 8](https://flcourts-media.flcourts.gov/content/download/2482757/file/AOSC25-69.pdf) independently names driving and boating under the influence. We checked the corresponding basic offense citations. Driving under the influence (§316.193(1)) has an exact configured citation. Boating under the influence (§327.35(1)) is absent. This supplement samples misdemeanor practice without claiming to represent misdemeanor frequency. No bond amounts are published from this test.

### Next release decisions

1. Verify the four §784.07 reclassifications and §327.35 basic/graded boating branches as two bounded charge groups. Reconcile the three sampled grand-theft branches in §812.014, the higher-age-victim theft row §812.0145(2)(b), and the amphetamine weight branch before calling those exact matches.
2. Decide whether these known gaps are acceptable for an explicitly partial Florida launch. Conduct a read-only check of current receipts, the eligible selection list and the deployed selector separately. The 295 configured identities on the baseline and 298 with the proposed exploitation choices say nothing by themselves about live availability.
3. Prioritize the remainder by actual filing frequency when an official statewide charge-level frequency source is available. The severity chart alone cannot supply that ordering.

For an offline replay run `node scripts/data-review/florida-launch/benchmark.mjs`. Supply a checkout directory as its first argument to measure another revision. To reproduce the frozen baseline use a checkout at `a3c970a1`; compare the emitted JSON to `baseline-citation-results.json`. To verify the source snapshot, run the same script with `--verify-source PATH_TO_ORIGINAL_HTML`. A later official HTML version may need its own snapshot.

### Protected-person follow-up

The four §784.07(2) rows above report the historical finding on the benchmark revision. The follow-up provides four separate configured choices. Each depends on the underlying assault or battery definition, qualifying personnel and duty conditions, plus its own ordinary grade and any role-specific mandatory minimum. The previously withheld generic officer-assault ID stays withheld. The 30-row frozen sample and its results are unchanged.

Sections 4 and 7 of [chapter 2026-144](https://laws.flrules.org/2026/144) changed the officer definition and duty wording effective June 16, 2026, when the act became law. Earlier offenses need their earlier version. Subsection (2) mentions public transit personnel in its duty clause and omits them from its opening victim list; this batch does not rely on transit employment alone to establish eligibility. The separate repeat-domestic-violence provisions effective July 1 require independently qualifying facts. Boating under the influence remains open.

For a newly downloaded benchmark page, `--verify-source` distinguishes byte-identical HTML from identical sampled rows and positions in changed HTML. A changed sampled row or position fails verification; equality of the sample does not verify the rest of the statute.

### Theft and amphetamine follow-up

| Sample row | Result after subdivision review |
|---|---|
| §812.014(2)(d)2. | Exact new dwelling or unenclosed-curtilage choice for property worth at least $750. Siblings distinguish $40 to under $750 and theft from more than 20 dwellings or their curtilages. |
| §812.014(2)(c)5. | Exact new firearm-theft choice and separate (2)(g) repeat-firearm-theft branch. A prior conviction for a different theft does not meet (g). |
| §812.014(2)(b)4. | Exact new authorized-emergency-vehicle equipment choice, including the $300 minimum omitted in the chart description and the statutory definition of official equipment. |
| §812.0145(2)(b) | Exact new $10,000 to under $50,000 second-degree choice, including knowledge or reason to believe the victim was at least 65. Both neighboring amount ranges are covered. Restitution and community service under (1) depend on value strictly exceeding $1,000. |
| §893.135(1)(f)1., chart level seven | The existing parent ID accurately describes the (1)(f)1.a. branch at 14 to under 28 grams, three years minimum and $50,000. The chart uses the parent citation for this narrower row. |
| §893.135(1)(f)1.b., chart level eight | The same ID also accurately describes 28 to under 200 grams, seven years minimum and $100,000. All three operative weight citations now serve as search aliases for that ID. Its original family eligibility and receipt still apply. |

The nine new theft choices use independently bound conduct, grades and penalties from thirteen sections in the official 2026 edition. An exact acquisition of §893.135 produced the same legal text hash as the retained trafficking review. Its existing English, Spanish and Chinese explanations preserve all three tiers. This comparison does not renew the trafficking receipt. The original 30-row sample remains frozen.

The current dwelling subdivisions apply to conduct from October 1, 2024. For earlier conduct, consult the version in effect on the offense date. [Laws of Florida, chapter 2024-69, §§1, 5](https://laws.flrules.org/2024/69)
