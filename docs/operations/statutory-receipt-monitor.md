# Activate daily statutory evidence deadline checks

The three committed Ohio/Florida receipts are short-lived. A missed deadline
withholds reviewed charge selections. This check is a deadline alarm, not a source
refresh, content validator, or legal approval. It makes no network or database
calls and requires no npm dependencies after checkout.

Run locally:

```sh
node scripts/check-statutory-receipt-freshness.mjs
```

It fails for expiry within 48 hours (including exactly 48 hours), expiry, invalid
dates, missing required receipts, and malformed JSON. It discovers additional
`*-refresh-receipt.json` files in the output directory. It does not edit anything.

## One-time owner installation

**The schedule is not active while its YAML is under docs/operations.** The
repository-scoped credential used for this work previously rejected workflow-file
writes. Keeping that least-privilege boundary does not require a broader token.

After merging the maintenance PR, a repository owner can install the workflow:

1. In GitHub, open `docs/operations/statutory-evidence-freshness.yml` and copy its
   contents.
2. Use Add file / Create new file to create
   `.github/workflows/statutory-evidence-freshness.yml` with those contents, and
   commit it to main through the normal review process.
3. In Actions, select **Statutory evidence receipt deadlines**, run it manually,
   and verify the three receipt results. Confirm scheduled Actions are enabled.
4. Enable GitHub Actions failure notifications for the person responsible for
   source maintenance and confirm they receive failures. A failing job alone is
   not a guaranteed human notification.

The workflow runs daily at 13:17 UTC and on manual dispatch; relevant PR changes
also run it. It has only `contents: read`, does not persist checkout credentials,
and neither opens issues nor writes repository or production data. GitHub can delay
or disable scheduled workflows, so check the Actions run history; this is not a
promise of delivery precisely 48 hours before expiry. A daily check may first see
an approaching deadline with roughly 24–48 hours remaining.

For Florida, follow `docs/florida-refresh-runbook.md`. For Ohio, use the existing
`refresh-ohio-chapter-2903-pilot.ts` and `refresh-ohio-reviewed-sources.ts` procedures.
Retrieve real official evidence and review changes; never edit receipt dates to
silence the alarm. A later automation for retrieval/review is a separate decision.
