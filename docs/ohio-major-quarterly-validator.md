# Ohio major-offense quarterly verification

Run the read-only candidate check from the repository root:

```sh
node --import tsx scripts/data-review/check-ohio-major-quarterly-candidate.ts
```

The comparison obtained November 11, 2026 supports all 38 approved source identities for the 20 major-offense choices. Its oldest acquisition occurred at 04:39:21.054 UTC. That makes February 11, 2027 at 04:39:21.054 UTC the latest possible quarterly expiry for this comparison. Running the check later does not move the deadline. The existing receipt expired November 10 and is still the only active receipt file.

A future approved renewal would require both the full reviewed comparison at `scripts/data-review/output/ohio-major-approved-comparisons/<comparisonHash>.json` and an explicitly approved quarterly receipt at the existing major receipt path. The filename is the SHA-256 of the parsed, JSON-stringified comparison. The receipt must match that digest, the approved publication packet digest, and its entire sorted acquisition ledger. The runtime verifier reconstructs that ledger from individual official page results and expected charge bindings. A missing file, changed metadata, a future retrieval, or a new research candidate alone cannot authorize selection.

The check covers the major-offense family only. The pilot, separately reviewed group, database linkage, and deployment each keep their existing boundaries.
