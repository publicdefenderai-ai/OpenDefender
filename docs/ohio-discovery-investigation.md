# Ohio unresolved discovery investigation

September 23, 2026. Research findings only; no catalog, approval, database or production changes.

## What this pass covers

This pass investigates the 154 retained penalty-linked candidates, six unresolved
penalty targets, and 17 legacy rows marked `discovery_unresolved`. The 17 rows
represent 14 distinct cited sections. It also audits all 321 section-status flags
after discovering a systematic parsing problem.

The reproducible [JSON report](../scripts/data-review/output/ohio-discovery-investigation.json)
provides a row for every item, source URLs and hashes, source-text anchors, group
counts, and proposed next steps for each of the 17 legacy rows. It pins the
enumeration, inventory and reconciliation files by hash. These populations
overlap; none of these counts is a count of verified crimes.

The other 67 legacy unresolved rows remain visible in the report: 20 missing
citations, 30 label conflicts, and 17 compound ambiguities. They were not
substantively investigated in this pass. The existing 155 mechanical proposals
also remain proposals, not approved corrections.

## First priority: repair source-status interpretation

`chapter-parser.ts` treats any occurrence of `repealed` or `renumbered` in a
catchline as a reason to suppress a section. The five supposedly repealed penalty
targets are actually headed with former-number history and have operative text:

| Current section | Former number in heading | Finding |
| --- | --- | --- |
| [128.96](https://codes.ohio.gov/ohio-revised-code/section-128.96) | 128.32 | Body contains 9-1-1 prohibitions; current heading records renumbering history. |
| [3715.34](https://codes.ohio.gov/ohio-revised-code/section-3715.34) | 3715.36 | Body contains vinegar-sale prohibitions. |
| [5101.631](https://codes.ohio.gov/ohio-revised-code/section-5101.631) | 5101.612 | Body includes restrictions on access, use and disclosure of information. |
| [5180.275](https://codes.ohio.gov/ohio-revised-code/section-5180.275) | 3738.06 | Body contains a confidentiality prohibition. |
| [5180.403](https://codes.ohio.gov/ohio-revised-code/section-5180.403) | 5101.133 | Body contains information access/use/disclosure prohibitions. |

Official individual-section pages were checked during this investigation and
corroborate the cached headings and conduct. This is not a refreshed statewide
snapshot or verification of every historical version.

The broader status audit finds:

- **229** suppressed sections with former-number/renumbering history and body text.
- **87** with explicit repeal dates after the pinned September 23, 2026 snapshot date.
- **4** with status words used in other contexts: 519.25, 711.28, 3701.347 and 4928.2317.
- **1** with a past dated repeal, 1705.01, requiring version/status confirmation.

These are audit categories, not automatic reactivations. Replace the boolean
keyword inference with explicit status evidence, effective dates and an uncertain
state. A moved-from number, a current section describing its former number, and a
future repeal must be distinguishable. Then reparse the recorded official pages
through a versioned acquisition process, preserving source retrieval timestamps
and page hashes. Do not silently edit cache flags and enumeration hashes to make
the current accounting check pass. Existing parsed-cache reuse also needs parser
version invalidation so a fix actually reaches already-cached chapters.

## Second priority: separate ranges from conduct

The sixth unresolved target, [4507.37](https://codes.ohio.gov/ohio-revised-code/section-4507.37),
returns the publisher's number-not-found page. It appears as the endpoint of a
range in [4507.99](https://codes.ohio.gov/ohio-revised-code/section-4507.99).
The correct finding is an unresolved range endpoint, not a discovered missing
crime or a license to guess a replacement citation.

The current extractor records the printed numbers in ranges but does not expand
their interiors. For example, 907.99 references three ranges; the candidate report
therefore includes definition and administration sections at their endpoints.
This can overstate endpoint candidates while missing interior conduct links.

Model each range as a relationship with its original quotation and limits. Resolve
membership using the official section order, including suffix sections, rather
than floating-point arithmetic or invented numbers. Preserve division limits,
exceptions, alternative penalties and repeat-offense conditions. A range's
membership still does not establish that every member creates a crime.

The 154 retained candidates are grouped by observable text signals:

| Research group | Sections | Engineering task |
| --- | ---: | --- |
| Only linked as range endpoints | 33 | Resolve range context and actual conduct before considering any grade. |
| Broader prohibition wording | 85 | Check missed actor lists, long citation-bearing clauses, passive prohibitions and `shall not` wording. |
| Affirmative duty or administration | 34 | Identify who owes the duty; distinguish regulated conduct from agency duties and exceptions. |
| Other dependency context | 2 | Trace the referenced rules or provisions; do not infer conduct from a heading. |

These are automated research groups with exact source snippets, not 121 confirmed
conduct provisions plus 33 exclusions. A prohibition-looking snippet can occur
inside a definition, exception or administrative provision. Range context takes
precedence where every retained link is a range endpoint. No candidate was
approved, dropped, renamed or assigned a new grade by this investigation.

## Legacy rows: concrete work rather than a transcription queue

| Group | Catalog rows | Findings and next work |
| --- | ---: | --- |
| Local grade extraction | 7 | Across 955.22, 4510.11, 4513.02, 4503.11 and 4511.20, local guilt/grade clauses exist but the grader misses `is guilty of a`. Preserve divisions and escalation conditions. Dog-at-large and expired-inspection labels also require scope research. |
| Penalty clause grammar | 2 | Both littering rows cite 3767.32. The list and intervening qualifier in [3767.99(C)](https://codes.ohio.gov/ohio-revised-code/section-3767.99) defeat the current linkage matcher. Preserve which qualification applies to which listed target. |
| Conduct wording | 1 | 2903.311 has a long actor list and an explicit local grading clause. Expand discovery without changing its existing reviewed evidence or approvals. |
| Citation scope | 3 | 4513.01 is a definitions reference; 1533.08 addresses specialized collection permits; 4503.02 levies a tax. Research conduct-specific citations for the old labels instead of silently substituting one. |
| Legal/proceeding boundary | 3 | Financial responsibility, contempt and community-control proceedings need a product/legal decision after evidence assembly. |
| Special penalty and actor | 1 | 3321.38 addresses an adult responsible for a child; 3321.99 states a fine/community-service penalty without a standard degree. Capture this structure before reviewing the generic truancy label. |

The report has separate charge IDs for duplicate citations so grouping does not
lose catalog rows. Extraction fixes should run through the entire state and
produce a before/after reconciliation before any proposed record changes.

## Narrow legal questions to prepare

These are proposed decision topics, not a new approval queue or a request for
the attorney to enter statute data. Engineering should assemble dated provisions,
dependencies, proposed selector behavior and example inputs first.

1. **Financial responsibility:** [4509.101](https://codes.ohio.gov/ohio-revised-code/section-4509.101)
   expressly describes civil penalties and excludes application of 4509.78.
   Should the platform offer a distinct civil/administrative path for this input,
   or keep it outside the criminal-charge selector? Do not treat it as a generic
   criminal insurance offense by default.
2. **Contempt:** [2705.02](https://codes.ohio.gov/ohio-revised-code/section-2705.02)
   describes acts punishable as contempt. What proceeding-specific information
   should the product obtain before presenting guidance? A generic crime grade
   does not answer that question.
3. **Supervision violations:** [2951.08](https://codes.ohio.gov/ohio-revised-code/section-2951.08)
   addresses arrest and procedure during community control. How should the
   product distinguish a supervision proceeding from any separately charged
   conduct, using the person's notice or order?
4. **Attendance:** [3321.38](https://codes.ohio.gov/ohio-revised-code/section-3321.38)
   and [3321.99](https://codes.ohio.gov/ohio-revised-code/section-3321.99) call for
   distinguishing the adult's alleged violation from a child's attendance
   proceeding. What selector wording and intake questions prevent conflating them?

These four topics are the first identified legal/product decisions, not a claim
that no other candidates will require legal review after engineering research.

## Reproduction and limits

```sh
node --import tsx scripts/data-review/investigate-ohio-discovery.ts
node node_modules/vitest/vitest.mjs run tests/ohio-discovery-investigation.test.ts tests/ohio-discovery-accounting.test.ts
```

The generator validates the full cached snapshot, compares the candidate inventory
and reconciliation against fresh offline replays, and checks the curated evidence anchors.
It writes only the investigation JSON. It makes no network requests, reads no
credentials or user cases, and does not update legal-review decisions. Report
ordering and content are deterministic for the same inputs.

The grouping tests cover range/direct-link distinctions, decimal section suffixes,
exact source offsets, sentence boundaries, former-number headings, future dates
and incidental status words. Snapshot/accounting regressions remain in the
existing test suite. This pass does not fix the identified acquisition/extraction
bugs, establish statewide completeness, or authorize publication.

Validation completed: all 176 Ohio unit tests passed across 23 files, including
nine new investigation tests. Script/shared/server TypeScript checking passed
using the same temporary supply of the already-declared, locally missing jsdom
types described in the accounting report; dependency manifests were unchanged.
The full offline investigation replay and independent checks of report counts,
source hashes, evidence offsets and unresolved-row uniqueness also passed.
