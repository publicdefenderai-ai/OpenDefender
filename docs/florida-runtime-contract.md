# Florida reviewed runtime contract

The source-first Florida batch is additive. Its `fl-fs-*` IDs must not alias or
replace ambiguous legacy `fl-*` rows. No draft becomes eligible until both
approval files are present and valid.

Runtime input is
`scripts/data-review/output/florida-reviewed-analysis.json`, plus two
independently pinned approvals:
`shared/florida-reviewed-eligibility.json` and
`scripts/data-review/output/florida-reviewed-refresh-receipt.json`. The
collection-only `florida-batch-review.json` is not a publication approval.
Every eligible draft
must bind its exact catalog code and citation, primary offense document,
heading-or-operative-guilt-clause identity span and hash, and the complete set
of grading, penalty, definition, exception, and justification dependencies. Supporting
provisions cannot be the primary offense. A heading alone cannot establish a
semantic grade. Clear section/guilt-clause extraction does not require blanket
attorney review, but interpretations do.

```json
{
  "report": {
    "schemaVersion": 1,
    "kind": "florida_source_first_review",
    "drafts": [{
      "id": "fl-fs-example",
      "name": "Source-derived offense name",
      "code": "812.13(2)(a)",
      "citation": "Fla. Stat. § 812.13(2)(a)",
      "primarySourceKey": "fl:statute:812.13:2_a",
      "identityEvidence": {
        "target": "text",
        "text": "…is guilty of…",
        "start": 120,
        "end": 134,
        "sourceKey": "fl:statute:812.13:2_a",
        "sourceHash": "sha256"
      },
      "conductEvidence": [{
        "target": "text",
        "text": "exact operative conduct",
        "start": 140,
        "end": 200,
        "sourceKey": "fl:statute:812.13:2_a",
        "sourceHash": "sha256"
      }],
      "gradeEvidence": [{
        "category": "felony",
        "target": "text",
        "text": "felony of the first degree",
        "start": 300,
        "end": 326,
        "sourceKey": "fl:statute:812.13:2_a",
        "sourceHash": "sha256"
      }],
      "requiredDependencies": [
        { "sourceKey": "fl:statute:812.13:2_a", "role": "offense", "contentHash": "sha256" },
        { "sourceKey": "fl:statute:775.082", "role": "penalty", "contentHash": "sha256" }
      ],
      "conduct": "source-bound text",
      "grading": "source-bound text",
      "interpretation": "reviewed or explicitly pending",
      "legalReview": null
    }],
    "sourceEvidence": {
      "fl:statute:812.13:2_a": {
        "sourceKey": "fl:statute:812.13:2_a",
        "section": "812.13",
        "subdivision": "(2)(a)",
        "citation": "Fla. Stat. § 812.13(2)(a)",
        "title": "Robbery",
        "sourceUrl": "https://www.leg.state.fl.us/statutes/…",
        "text": "complete official section body",
        "contentHash": "sha256",
        "retrievedAt": "2026-01-01T00:00:00Z",
        "effectiveDateStart": null,
        "subdivisionRanges": [
          { "subdivision": "(2)(a)", "start": 100, "end": 400 }
        ]
      }
    }
  },
  "eligibility": {
    "schemaVersion": 1,
    "reportHash": "sha256",
    "decisions": [{
      "id": "fl-fs-example",
      "status": "eligible",
      "reason": "manual reviewed disposition",
      "draftHash": "sha256(JSON draft)",
      "definitionHash": "sha256(JSON localized definition)",
      "approvalHash": "sha256(JSON decision fields)"
    }]
  },
  "freshnessReceipt": {
    "schemaVersion": 1,
    "reportHash": "sha256",
    "eligibilityHash": "sha256",
    "checkedAt": "2026-01-01T00:00:00Z",
    "expiresAt": "2026-01-08T00:00:00Z",
    "documents": [{
      "sourceKey": "fl:statute:812.13:2_a",
      "contentHash": "sha256",
      "retrievedAt": "2026-01-01T00:00:00Z"
    }]
  }
}
```

Changed source bodies fail closed: ledger hashes are never automatically
rebound. Definitions must provide English, Spanish, and Chinese text,
applicable `categories`, `pendingAttorneyReview`, and draft-translation
warnings through the generic evidence-backed batch projection.

`assembleFloridaReviewedReport` consumes the six explicit analyst entry
arrays at `scripts/data-review/output/florida-reviewed-analysis-{a,b,c,d,e,f}.json`
plus `scripts/data-review/output/florida-batch-source-cache.json`. Analyst
entries have
`{id,section,status,reason,identity,conductQuotes,gradingQuotes,requiredSections,notes}`;
`requiredSections.role` is one of
`offense|grading|penalty|definition|exception|justification`. It accepts only official
whole-chapter or verified exact-section documents from the confirmed
`Florida Statutes 2026` edition. Both acquisition paths must reproduce the
exact official section URL, section heading, title, and body hash, and the
document's original retrieval must be at most seven days old and not in the
future.
The first public citation must exactly equal the primary catalog code.
Every additional public citation must be a whole-section citation whose
official URL and section map to an explicitly declared non-offense dependency
role; narrower supporting detail stays in the pinned quotes and notes.
The adapter returns `technicalHolds`; it never writes or manufactures an
eligibility decision or receipt. Roles `definition`, `exception`, and
`justification` remain explicit in the reviewed contract and metadata, and are
projected to the generic authority engine's supporting `grading` role only at
the database boundary.

All hashes are lowercase SHA-256 hex. `reportHash` and `eligibilityHash` hash
the exact UTF-8 `JSON.stringify` serialization. `approvalHash` hashes, in this
order, `{id,status,reason,draftHash,definitionHash}` and excludes itself.

Prepare without publication:
`npx tsx scripts/data-review/assemble-florida-reviewed-runtime.ts --prepare`.
After reviewing that exact report, activation is a separate explicit command:
`npx tsx scripts/data-review/assemble-florida-reviewed-runtime.ts --activate-reviewed`.
Preparation writes only hash-pinned `held` decisions and removes any receipt.
Individually unprovable rows remain in
`florida-reviewed-technical-holds.json` with concrete causes while valid drafts
continue into the partial report. Activation refuses to proceed if reassembly
differs from the reviewed report and activates only valid drafts; technical
holds remain held.

## Development batch

The assembled batches contain 101 eligible source-first records in English,
Spanish, and Chinese, with no remaining technical holds among those drafts.
The development seed contains 126 selectable records (25 legacy + 101 additive);
the 92 withheld legacy records remain withheld. These are record counts, not a
claim of statewide completeness or attorney approval.

The acquisition ledger records 149 actual HTTP requests and 1,426 cached
current-edition sections. Assembly and activation reuse that cache without
refetching it. Unavailable sections and historical-only dependencies remain
excluded. Freshness still expires seven days after the oldest required source
was retrieved; reissuing a receipt cannot extend that evidence.

Source-first explanation slugs use their full canonical IDs. Resolve selected
records by ID, not display name: distinct statutory branches can have identical
official names. Keep translation keys separate from generic explanations, and
retain generic fallback only for recognized legacy records.

The second batch adds 21 records across aggravated battery, arson, petit theft,
perjury, controlled-substance conduct, and drug paraphernalia. The original 70
drafts and their source documents remain unchanged. General §893.13 additions
are expressly limited to non-cannabis applications in all three languages.
Two additional drug-law branches remain withheld: §893.13(3) and §893.147(7).
Their missing current dependencies are recorded in analysis E; they are not
silently included in neighboring eligible scopes.

The next increment adds nine cached-source abuse/neglect records under
§§825.102, 827.03, and 827.04, plus recovered §893.147(4)(b), narrowly bound to
§932.701(2)(a)1. Current §§932.701 and 831.31 were recovered in four requests;
both exact and chapter requests for §381.986 still returned the 2016 edition.
Section 893.147(7) also needs current federal dependencies. Section 827.04(1)
remains separately held for missing current §39.01. Incorporated aggravated
battery in the new abuse records binds both §§784.03 and 784.045.

The read-only freshness preflight and explicit pre-expiry retrieval procedure
are documented in [florida-refresh-runbook.md](florida-refresh-runbook.md).
The existing evidence deadline remains September 25, 2026, with a September 23
review target. No scheduler, reminder, or automatic approval has been installed.

Generate the offline coverage inventory with
`npx tsx scripts/data-review/build-florida-coverage-inventory.ts`.
It writes JSON, CSV, Markdown, and self-contained HTML under
`scripts/data-review/output/florida-coverage-inventory.*`.
The inventory distinguishes 126 selectable records from 125 distinct cited
scopes, flags the exact §831.01 citation duplication without merging saved-case
IDs, and keeps the 92 legacy cleanup records separate. Cached sections and cited
scopes are not counts of distinct offenses; the statewide denominator remains
unknown. Current reviewed counts use the runtime approval and freshness gates.