# Ohio major-offense quarterly verification

Run the read-only candidate check from the repository root:

```sh
node --import tsx scripts/data-review/check-ohio-major-quarterly-candidate.ts /path/to/new-comparison.json
```

The November packet reacquisition receipt remains valid through February 11, 2027 at 04:52:15.561 UTC (exclusive). For the next renewal, supply a freshly acquired comparison. The earlier PR 146 candidate predates the November packet reacquisitions and fails the retrieval-time check. Running this command only tests the proposal in memory.

A future approved renewal would require both the full reviewed comparison at `scripts/data-review/output/ohio-major-approved-comparisons/<comparisonHash>.json` and an explicitly approved quarterly receipt at the existing major receipt path. The filename is the SHA-256 of the parsed, JSON-stringified comparison. The receipt must match that digest, the approved publication packet digest, and its entire sorted acquisition ledger. The runtime verifier reconstructs that ledger from individual official page results and expected charge bindings. A missing file, changed metadata, a future retrieval, or a new research candidate alone cannot authorize selection.

The check covers the major-offense family only. The pilot, separately reviewed group, database linkage, and deployment each keep their existing boundaries.
