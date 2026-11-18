# Florida reviewed-family receipt activation candidate

This draft incorporates the exact report, eligibility binding and quarterly receipt proposed in PR 253 for 101 reviewed Florida identities. It is a repository change for review. It does not establish production availability or authorize publication, imports or database writes.

## Exact package

| Artifact | SHA-256 of JSON.stringify(parsedObject) |
| --- | --- |
| Report | `9d1f28e1232241bfaac0bf8707a7b176ed9a18e1d067eb622381d42685eb2c55` |
| Eligibility | `848c4e4d54ab229ef55879a9f7e627e50291bd0266032fbd754810992ae10196` |
| Receipt | `8ad28ad89cfcd43b2b45c03dca6668815b08d7a9fa4aff16720a508b9d8f0144` |

The 130 official sections were acquired on November 17, 2026. They support 221 distinct source keys and 920 dependency references. The receipt retains checkedAt `2026-11-17T17:43:25.113Z` and expires at `2027-02-17T17:39:02.320Z`, anchored to the oldest actual acquisition. Preparation and merge do not extend that deadline.

The report changes only source retrieval timestamps. Eligibility changes only its report hash. All source text, charge definitions, drafts, approval decisions, holds and other families' receipts remain unchanged. The acquisition cache remains historical and must not be used to overwrite this reviewed package with older timestamps.

## Reproducibility and gates

The PR 253 summary remains a frozen proposal-time artifact. Its `activeReceiptAccepted: false` records the original comparison, not the current checkout state. The preparation tool now reports its current input state separately and accepts only either the complete original baseline or all three exact proposed artifacts with every other baseline file unchanged. Mixed installations and arbitrary drift fail.

Reproduce into a new external folder:

```sh
node --import tsx scripts/data-review/florida-launch/prepare-restoration-proposal.ts /tmp/florida-installed-package-check-unique
```

This writes candidate files only. Successful validation at comparison time does not certify current production eligibility. The runtime checks expiry on each request and still requires the database evidence/eligibility gate. At the exact expiry instant, all 101 reviewed IDs become unavailable even if a previous database run listed them.

## Release and data work remain separate

After review and merge, select an exact release revision and assess release checks, startup protections and schema proposals. Publication requires separate approval. Database restoration must use an explicitly reviewed scoped plan for these 101 IDs, preserve other choices and holds, and verify actual public IDs on both domains afterward. The statewide Florida import endpoint is not a scoped substitute.

This PR contains no production access information, private review analysis or operational evidence packet. Public source evidence remains in the comparison and constitutional-source packets.

## Validation

- Florida-focused suite: 58 files passed, 289 tests passed and 43 skipped.
- Exact installed report, eligibility and receipt hashes match the frozen proposal; 101 IDs, 221 source keys and 920 dependencies match.
- Actual-receipt boundary tests cover missing database eligibility, the last valid millisecond, exact expiry, altered source/decision inputs, missing documents and extended deadlines.
- Proposal replay accepts the complete historical or approved state and rejects mixed installations.
- Application typecheck and production build pass.
- Five isolated built-selector checks pass, including the 101-record family through the existing persons-family release check and retained property choices in all three languages. Fixture results do not certify production links.
