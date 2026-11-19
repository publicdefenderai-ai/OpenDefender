# Florida corrected 101-record restoration candidate

Prepared from merged main `f1f69d4dc0be2674f15540af94df47ae1f765a36`, after the 26 closeout corrections. This is a proposed replacement package, not an issued receipt, renewal, activation or production authorization. All active artifacts, including the existing mismatched receipt, remain unchanged. The historical proposal stays frozen.

## Exact replacement bindings

Hashes use SHA-256 over `JSON.stringify(parsedObject)` in existing order, not pretty-printed file bytes.

| Candidate artifact | Hash |
| --- | --- |
| Current corrected report | `59e0dcaa2ffdae7720cda0f97bac066e69af2a450ce555e3c62b5fe66e5d74ef` |
| Current corrected eligibility | `6da0e86a1ebcd3f5afc76fca8014ef520f747caa17b2201c8221ce6342372180` |
| Proposed replacement receipt | `22f5006214838e21cc5ea8d5fa520cbf243b952c85e82f07849580238cc20bab` |
| Ordered 101 definitions | `7bfc9fdf76924b67cc0864b407e0dd51aa7f39276c06f8d21f68251c5083a7f5` |

Proposed `checkedAt` is preparation time, **2026-11-19T16:56:36.544Z**, not a new source-acquisition claim or retrospective approval. Policy is `quarterly-v1`. The oldest actual acquisition remains **2026-11-17T17:39:02.320Z**; expiry remains **2027-02-17T17:39:02.320Z**, exactly the previous package's ceiling. Nothing extends the active receipt.

The [machine-readable candidate](../scripts/data-review/florida-launch/corrected-restoration-candidate.json) contains the complete proposed receipt, old/new package hashes, per-ID definition hashes, every source-key old/new binding, and every physical link addition/removal. All paths are separate from runtime receipt paths; no runtime module imports the candidate.

## Delta from the previous 101-record package

| Measure | Previous | Corrected candidate | Change |
| --- | ---: | ---: | ---: |
| Charge IDs | 101 | 101 | 0 |
| Official sections | 130 | 134 | +4 |
| Distinct source keys | 221 | 225 | +4 |
| Logical dependency references | 920 | 1,051 | +131 |
| Physical charge/source/role links | 884 | 1,015 | +131 |
| Changed definitions | | 26 | Other 75 unchanged |

Physical links use the same identity as the seed builder: charge ID, source key and authority support role. Definition/exception/justification dependencies share the grading role, so logical references must not be mistaken for physical writes. The candidate independently agrees with the runtime grouping helper. No source keys or physical links are removed.

The existing comparison supports the 130 unchanged official sections. The four supplemental sections, §§775.087, 796.08, 806.031 and 837.07, use the closeout packet's November 19 acquisitions and exact hash/time bindings. All 134 section texts and all instances of each source key are validated. Existing approved applicability decisions are preserved; this proposal does not reopen them or reproduce private analysis.

These are **package deltas**, not observed production writes. The older production figures of 334 existing and 550 missing links cannot be reused as current write counts. No database was read; Replit's prepared runner must compare its actual target state against the new 1,015-link allowlist after the package is approved.

## Bounded Replit handoff

After this candidate is reviewed, provide Replit the exact approved revision and candidate file. Before any write, Replit can compare its already-prepared, still-unarmed runner against this package:

1. Verify all package hashes and the exact 101-ID allowlist. The old receipt/package does not authorize the corrected content.
2. Reuse prior evidence where hashes still agree. Recalculate actual source/snapshot/link differences using the new 225-source-key and 1,015-physical-link lists. Report existing, missing, changed and out-of-scope items; do not infer them from the +131 package delta.
3. Preserve all other Florida families, holds, source versions and database mappings. Return the bounded plan and exact runner revision for review; no duplicate runner is needed.
4. Receipt installation, runner execution and publication each remain separately authorized actions. This draft authorizes none of them.

A new external folder can reproduce the candidate without database access:

```sh
node --import tsx scripts/data-review/florida-launch/prepare-corrected-restoration.ts /tmp/florida-corrected-candidate-unique
node --import tsx scripts/data-review/florida-launch/prepare-corrected-restoration.ts --check
```

The tool rejects active-file drift, checkout destinations, existing files and output-file symlinks; verifies active input hashes before/after; and validates candidate bounds with the existing runtime validator. Tests prove the unchanged active receipt still fails, the candidate fails at exact expiry, extending its deadline fails, and altered evidence/decisions or missing documents fail. A technically valid candidate is not legal or operational approval.

## Deadline monitor clarification

The existing alarm previously called Florida's unexpired but mismatched receipt “current.” It now reports separate `dateStatus` and `bindingStatus`; the current reviewed-family row reports `dateStatus: current`, `bindingStatus: mismatched_or_missing`, and overall `status: binding_mismatch`. It checks the report/eligibility hashes, source-key metadata and oldest-acquisition window for this family.

Other families explicitly report `bindingStatus: not_checked` rather than implying full approval validation. Their existing date alarms remain. The monitor is read-only, does not inspect production database eligibility, and is not a comprehensive legal-currentness certificate. No monitoring schedule or activation setting changes.
