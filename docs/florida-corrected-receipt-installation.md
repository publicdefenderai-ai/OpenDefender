# Corrected Florida receipt installation

This change installs the owner-approved PR 268 receipt for the corrected 101-record family. The corrected report and eligibility already exist on main; their contents and the 101 definitions are unchanged. This is a repository installation for review, not publication or a production database operation.

Canonical hashes (SHA-256 of JSON.stringify(parsedObject)):

| Artifact | Hash |
| --- | --- |
| Report | `59e0dcaa2ffdae7720cda0f97bac066e69af2a450ce555e3c62b5fe66e5d74ef` |
| Eligibility | `6da0e86a1ebcd3f5afc76fca8014ef520f747caa17b2201c8221ce6342372180` |
| Installed receipt | `22f5006214838e21cc5ea8d5fa520cbf243b952c85e82f07849580238cc20bab` |
| Ordered definitions | `7bfc9fdf76924b67cc0864b407e0dd51aa7f39276c06f8d21f68251c5083a7f5` |

The receipt is exactly the reviewed candidate: 225 source keys; checkedAt 2026-11-19T16:56:36.544Z; expiry **2027-02-17T17:39:02.320Z**. The oldest acquisition remains 2026-11-17T17:39:02.320Z. Installation does not reset either date or claim a new acquisition.

The historical candidate and input manifest stay byte-identical. Its replay now recognizes only the original receipt or this exact approved successor; all other input drift is still rejected. The historical candidate's status describes preparation, not current installation. Its generator still writes only to a new external candidate directory and cannot install receipts.

Tests retain rejection of the superseded receipt against corrected content and cover exact installed-package hashes, missing or tampered evidence, expiry, and the independent database eligibility requirement. The receipt monitor should report the Florida reviewed binding as matched on this branch. This is not a claim about the deployed release or overall source readiness.

Publication requires separate approval of an exact release. The 101-ID production restoration also requires separate approval and fresh guarded preflight; no database evidence, SQL permits or private review material is included here. Installing a receipt alone does not create missing source links or update production eligibility. Existing source holds and other state receipts remain unchanged.

Validation: 32 focused tests across six files passed, covering receipt installation, corrected-candidate replay, closeout evidence, source contract, preflight and receipt monitoring. Typecheck and production build passed. Candidate replay remains exact. The full regression/browser release suites were not rerun; this PR is not deployment clearance.
