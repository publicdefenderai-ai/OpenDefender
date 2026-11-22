# New York person and public-order candidate research

Base: `cdd21aa75da92d0751f3559efbe5a4d2ccc71708` (includes merged PR290). This is a separate research packet, not a catalog, API authority manifest, receipt or publication change. It adds no selectable IDs and makes no claim about live availability.

## Scope and exact conduct

The five primary sections come from the prior 28-section purposive statutory benchmark. This is not an arrest-frequency ranking. Eleven candidate mappings bind individual statutory alternatives rather than assigning every subdivision of a section to one generic description.

| Section | Separate candidate scopes | Material distinctions retained |
| --- | --- | --- |
| PEN 120.00 | (1), (2), (3) | Intentional injury, reckless injury, and criminally negligent injury by deadly weapon/dangerous instrument remain separate. Physical injury means impairment of physical condition or substantial pain. |
| PEN 120.14 | (1), (2), (3) | Weapon/display, repeated conduct, and third-degree menacing plus qualifying protection order remain separate. The third-degree predicate does not make the second-degree offense Class B. The third branch retains physical menace, service/actual-knowledge conditions, statutory order sources and the specified external-court stay-away condition. |
| PEN 121.11 | (a), (b) | Pressure on throat/neck versus blocking nose/mouth. Both separately bind the shared intent-to-impede preamble. The valid-medical-or-dental-purpose affirmative defense and its burden are retained through 121.14 and 25.00. |
| PEN 195.05 | (1), (2) | Listed means of obstructing an official governmental function versus damage/removal of a public-health/safety closing-order device. Neither is reduced to disagreement with an official. |
| PEN 205.30 | whole section | Intentionally preventing or attempting to prevent an **authorized** arrest of oneself or another, by a police/peace officer. It is not merged with 195.05. |

All eleven candidates bind their own primary section's Class A misdemeanor grading paragraph. The ordinary individual penalty context is up to 364 days and/or $1,000, with the alternative double-gain fine under 80.05(5), subject to 80.00(2)–(3). Double gain is an alternative, not an additional automatic fine. Corporate fines, restitution, fees and other case-specific consequences are not folded into that cap. The ameliorative 70.15 text is retained; this packet does not impose a prospective-only sentencing assumption.

Each conduct binding ends before the next sibling subdivision. The breathing-intent preamble is a separate binding shared by its two alternatives. Full definition/condition documents are retained as context; they do not expand the mapped charge scope or establish every case-specific defense, arrest authority, or protection-order issue.

## Reuse and source boundaries

Twenty normalized official Senate sources are retained: **eight reused without changing any original metadata or hash**, plus **12 newly acquired** definitions/conditions. New dependencies include PEN 10.00, 15.00, 15.05, 25.00, 120.15 and 121.14; CPL 1.20, 2.10 and 530.12; and FCT 812, 828 and 842.

The two baseline matches are the existing assault-third and resisting-arrest IDs. The other three primary sections have no same-section match in the frozen catalog. A matching section is neither an automatic successor identity nor substantive approval of an old summary. All 27 existing exact-reselection holds and PR290's citation-overlay reconciliation remain in force. No runtime citation, urgent-action text or translation changes are made.

Original additional acquisition directories are `/private/tmp/od-ny-person-order-sources-20261120` and `/private/tmp/od-ny-person-order-sources-extra-20261120`; reused raw pages remain in the PR290 acquisition directory. The normalized sources preserve actual retrieval times and both page/text hashes. No acquisition date or Senate publisher date is represented as a substantive effective date.

The attempted official CJI 120.14(3) PDF acquisition returned HTTP 403. It is **not** counted as retained instruction evidence. API credentials were absent in this research process. Publication still requires exact API comparison, substantive amendment/effective-date chronology and applicable judicial/instruction limits, plus consistent identity/citation overlays, informational guidance, translations and product-path verification. These are explicit unfinished prerequisites, not silently cleared holds.

The existing standalone API fetch validator now accepts the exact CPL/FCT law identifiers needed by this packet in addition to its prior law set. This does not change the earlier collector's 39-section scope or import a database module. The new collector writes the exact 20-section candidate to a new external directory, rejects missing credentials and wrong response identities, uses fixed official hosts without redirects, and does not print credential-bearing failure URLs.

## Reproduction

```text
node scripts/data-review/new-york-person-order/review.mjs --check
node scripts/data-review/new-york-first-pass/review.mjs --check
npx vitest run tests/new-york-person-order.test.ts tests/new-york-first-pass.test.ts
npm run check
```

Optional fresh research acquisitions (not needed for committed replay):

```text
python3 scripts/data-review/new-york-person-order/acquire.py /tmp/ny-person-order-new-html
node scripts/data-review/new-york-person-order/collect-api.mjs /tmp/ny-person-order-new-api
```

The HTML command acquires the 12 new dependencies into an external directory; it does not overwrite the committed packet. The API command requires an already approved secret environment. Neither is an import or activation step. Do not paste API keys into chat or use the seed-capable importer to perform this research acquisition.

Validation: 22 tests across the two research suites passed; typecheck and both candidate replays passed. All 20 original HTML pages independently reproduce their committed title, text, page hash and text hash. Tests cover mental-state distinctions, precise sibling exclusion, the protection-order predicate, the medical/dental affirmative defense, authorized arrest, ordinary penalties, byte-identical source reuse, CPL/FCT API identity rejection and changed-source/span/dependency/grade/name/penalty tampering. No browser or production build run is necessary for this scripts/data-review-only change; runtime, database and receipt files remain untouched.

This batch reuses the prior parser and API fetch validator instead of creating another intake pipeline. Its research mapping code and tests are confined to this batch, avoiding shared catalog counts or eligibility edits before a publication package is ready.
