# New York first-pass candidate research

Base: `9cebb7bbf1c4a4afec0ffad19e1a6195ee973fc0`. This packet changes no catalog, runtime authority manifest, receipt, selector or saved guidance. It preserves all existing decisions and holds. It is not a publication package, API verification or a claim of statewide completeness.

## Existing scope and candidate work

The frozen exact-ID ledger contains 121 existing records: 33 retained, 61 official-title aliases and 27 requiring exact reselection. It covers 89 distinct provision keys, with 94 offense links, two grading links and no penalty links. The two NYC local-ordinance references are not state-Senate text verification. The pure offline manifest builder still yields 94 configured selectable IDs; this is not a measured live count or evidence that their substantive penalties have been reviewed.

The new benchmark is our purposive sample of 28 official Penal Law sections across person, property and public-order families, selected before matching their citations to the catalog. It is not an official frequency ranking, a statistical sample or a statewide denominator. Matches are explicitly `same_section_requires_scope_review`, never automatic coverage. Judicial instruction URLs returned HTTP 403 in the local transport; they are not silently counted as acquired evidence.

Thirty-nine official Senate human-readable pages were acquired into an external candidate directory. The packet retains section text, exact URLs, titles, actual retrieval times, text hashes and original-page hashes. No retrieval date has been used as an effective date. These pages do not replace the existing API-only runtime provenance contract.

Four existing identities receive individually bound candidate corrections:

| Existing ID | Scope | Concrete candidate correction |
| --- | --- | --- |
| `ny-petit-larceny` | PEN 155.25, 155.05 definition and 155.15 limitation | Replace the one-year ceiling with 364 days; remove a $1,000 ceiling asserted as an element of this section and an unsupported entitlement to an ACD. |
| `ny-criminal-possession-of-stolen-property` | PEN 165.40, with 165.55 and incorporated definitions | Retain intent to impede recovery as an alternative; replace the one-year ceiling and remove the section-level $1,000 element claim. |
| `ny-vandalism` | PEN 145.00(1)–(4), including RPA 1971-A and 1971 | Preserve each conduct alternative, strictly-greater-than-$250 reckless threshold and subdivision 4 ownership rule; correct the one-year ceiling. |
| `ny-trespass-after-warning` | PEN 140.10(a)–(g), PEN 140.00 and PBH 1392 | Replace the generic warning/ban description with specific statutory conditions. It is Class B: up to three months and/or $500, rather than the existing one year/$1,000. |

These are proposed ordinary penalties for individuals. PEN 70.15(1), (1-a) and (2) supply imprisonment rules; 80.05(1), (2), (5) and (6), with 80.00(2)–(3), supply fine rules and limitations. The double-gain fine is an alternative, not an automatic addition. Corporate penalties are excluded from this summary. Restitution and fees are not represented as included in the fine cap. The 70.15 ameliorative text is retained; no prospective-only assumption is made. Higher-degree offenses and case-specific sentencing remain distinct.

## Exact next dependency

`NY_SENATE_API_KEY` was not present in this research process. Do not paste it into chat, put it in a command argument or use the existing seed-capable importer. In the existing approved secret environment, a separately authorized read-only acquisition can run:

```text
node scripts/data-review/new-york-first-pass/collect-api.mjs /tmp/ny-api-candidate-unique
```

The collector requests the 39 exact sections, checks their law/section identity, stores publisher date metadata as metadata, and writes only a new external candidate file. It imports no database module and does not seed, renew or activate anything. Exceptions do not print credential-bearing URLs. Acquisition errors leave no completed candidate file. Compare that file with the retained HTML research, resolve substantive effective/amending-law chronology, then prepare translated corrections and runtime-path tests. An API active date or a matching body alone does not complete that legal-date review.

A source-complete product publication and browser vertical slice are therefore **not** claimed by this PR. Their prerequisites are explicit instead of being replaced with fabricated API evidence. Existing runtime content remains unchanged until a later reviewed publication change.

## Reproduction and boundaries

```text
python3 scripts/data-review/new-york-first-pass/acquire.py /tmp/ny-html-candidate-unique
node scripts/data-review/new-york-first-pass/review.mjs --check
npx vitest run tests/new-york-first-pass.test.ts
```

`acquire.py` refuses checkout output and existing directories; it does not regenerate active files. `review.mjs` only regenerates this research artifact. The tests execute the Python parser/boundary tests, preserve the 27 exact held identities through the pure offline seed builder, reject altered hashes/offsets/missing dependencies, and independently check material grade, threshold and fine distinctions. The API collector is tested with synthetic responses; no real API success is claimed.

Original acquisition directory: `/private/tmp/od-ny-first-evidence-20261120b`. Raw HTML stays outside Git. Committed normalized evidence is `scripts/data-review/new-york-first-pass/candidate-sources.json`; the four-record artifact is `candidate-review.json`; `baseline.json` preserves the exact-ID ledger and prior claims. Open PRs 276 and 288 were inspected at preparation; neither concerns New York charge review. Unpublished external work is unknown. Recheck pending work before freezing a later package.

Use the [reusable state handoff checklist](state-review-handoff.md) for subsequent batches. No database access, imports, receipts, publication or production source-status checks occurred here.
