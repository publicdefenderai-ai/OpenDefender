# New York burglary and robbery candidate research

Base: `cdd21aa75da92d0751f3559efbe5a4d2ccc71708` (merged PR290). This packet is independent of the pending person/public-order research in PR292. It changes no runtime catalog, citation overlay, source manifest, receipt, eligibility, saved guidance, database or production data.

## Nineteen exact alternatives

The six primary sections are another slice of PR290's purposive 28-section statutory benchmark. No arrest-frequency ranking or statewide-completeness claim is made.

| Primary section | Separate candidate scopes | Grade | Important distinction |
| --- | --- | --- | --- |
| PEN 140.20 | whole section | D felony | Unlawful entry/remain in a building with intent to commit a crime; a dwelling is not required. |
| PEN 140.25 | 1(a), 1(b), 1(c), 1(d), 2 | C felony | Four participant/timing aggravators are separate from the dwelling-only alternative. |
| PEN 140.30 | 1, 2, 3, 4 | B felony | A dwelling plus an aggravator; the display branch retains its limited affirmative defense. |
| PEN 160.05 | whole section | D felony | Forcible stealing under 160.00, including its two specific larceny-related purposes. |
| PEN 160.10 | 1, 2(a), 2(b), 3 | C felony | Actually-present aid, physical injury, display and the incorporated motor-vehicle definition are separate alternatives. |
| PEN 160.15 | 1, 2, 3, 4 | B felony | Serious injury, deadly weapon, dangerous instrument and display remain distinct. |

Each row binds its own primary grading text and exact conduct subdivision. Common entry/theft preambles and participant/timing clauses are bound separately where needed. Conduct spans stop before sibling alternatives. The ten burglary and nine robbery mappings are candidate research IDs, not new runtime IDs or publication approvals.

The first-degree display alternatives in 140.30(4) and 160.15(4) retain the affirmative defense for the specified unloaded/incapable firearm and the express preservation of lesser/other offenses. That defense is not imported into the second-degree display branches. PEN 25.00 supplies affirmative-defense burden context. Physical injury in 140.30(2) and 160.10(2)(a) is not changed into the serious-injury threshold of 160.15(1). VAT 125's exclusions remain attached to the motor-vehicle alternative.

## Ordinary sentencing context, not a universal prediction

The packet distinguishes statutory offense grade from the completed offense's classification under 70.02. First-degree B and second-degree C burglary/robbery are listed violent felonies. The completed third-degree D offenses are not listed in that violent-felony definition; no inference about attempted or additional offenses is made.

- For the ordinary adult nonviolent Class D framework under 70.00, an indeterminate **maximum** is at least three and no more than seven years; the **minimum** is at least one year and no more than one-third of the imposed maximum. This is not a claim that three years is a mandatory minimum period of confinement. Alternative dispositions remain conditional; probation is not promised.
- Under 70.02(3), the ordinary determinate ranges mapped here are **5–25 years for B** and **3.5–15 years for C**, with **2.5–5 years of post-release supervision** under 70.45(2)(f).
- The individual felony fine is up to the **greater of $5,000 or twice the gain**, subject to 80.00(2)–(3). It is not an automatically added fine; corporate penalties, restitution and fees are outside the summary.
- Multiple-offender sentencing, youth dispositions and special provisions such as 60.12 require separate assessment. The retained 60.05(8) context names only 140.25(2) and 160.10(1) among these completed-offense alternatives; the packet neither promises shock-program eligibility nor purports to finish its separate program requirements.

The publisher displays both an authorization paragraph labeled effective **until September 1, 2027** and a scheduled **September 1, 2027** paragraph in 70.02. The candidate binds the former paragraph separately and never combines its determinate ranges with the scheduled indeterminate authorization. Full source text retains both. This separation does **not** establish independent enactment chronology, an approved effective date or a case-specific offense-date rule. The ordinary profiles remain research-only pending that work.

## Evidence and unfinished prerequisites

Twenty-two official Senate documents are retained: **ten reused byte-identically with original acquisition metadata**, plus **12 newly acquired** definition/sentencing dependencies. Original additional pages reside in `/private/tmp/od-ny-burglary-robbery-sources-20261122` and `/private/tmp/od-ny-burglary-robbery-extra-20261122`; reused pages remain in PR290's acquisition directory. Actual retrieval times, original page hashes and normalized text hashes are retained. No retrieval time is used as an effective date.

To reduce duplication, long dependency text is stored once in `candidate-sources.json`; each mapping binds exact source keys, hashes and offsets. Conduct, grading and the selected sentencing paragraphs also retain their exact quoted text in the mapping. This keeps each charge individually supported without repeating the entire sentencing code nineteen times.

The attempted official 140.25(2) CJI PDF acquisition returned HTTP 403 and is **not counted as retained instruction evidence**. Exact Senate API comparison, substantive amendment chronology and applicable judicial/instruction limits remain publication prerequisites. All prior exact-reselection holds and the citation-overlay inventory remain intact. Same-section matches do not establish correct legacy descriptions or automatic successor selection. Informational guidance, translations and product-path tests still precede any later publication package.

A separate read-only API collector reuses PR290's merged Penal Law fetch path and permits only the additional exact VAT 125 definition. It does not modify the shared collector while PR292 is under review. Output is restricted to a new external directory; missing credentials, wrong response identities and network errors fail without a completed candidate file. No database/import module is loaded, redirects are refused, and errors do not print credential-bearing URLs. No real API success is claimed by this packet.

## Reproduction and validation

```text
node scripts/data-review/new-york-burglary-robbery/review.mjs --check
node scripts/data-review/new-york-first-pass/review.mjs --check
npx vitest run tests/new-york-burglary-robbery.test.ts tests/new-york-first-pass.test.ts
npm run check
```

Optional new research acquisition, never activation:

```text
python3 scripts/data-review/new-york-burglary-robbery/acquire.py /tmp/ny-burglary-robbery-new-html
node scripts/data-review/new-york-burglary-robbery/collect-api.mjs /tmp/ny-burglary-robbery-new-api
```

The HTML command acquires only the twelve additional dependencies; it does not overwrite committed evidence. The API command requires an already approved secret environment, not pasted credentials or the seed-capable importer.

Validation: 24 tests across the two research suites passed; typecheck and both candidate replays passed. All 22 original pages independently reproduce retained titles, text and page/body hashes. Tests independently reslice bindings and check dwelling/building distinctions, participant/timing conditions, force purposes, injury thresholds, affirmative-defense limits, motor-vehicle exclusions, ordinary ranges, PRS, future/current branch separation, original source reuse and deliberate evidence/meaning mutations. No browser/build run: no product code changes.

No pending PR is a dependency. The batch uses only new files, leaving PR292 and the concurrent Texas batch independent. Recheck current main and combined mergeability at handoff.
