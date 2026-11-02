# California importer: disposable PostgreSQL rehearsal

## Scope and authorization

The owner explicitly approved writes to a disposable local PostgreSQL cluster.
This rehearsal is **not** approval to publish or run a production import.

The runner creates a new cluster containing only the five source-import tables,
committed public California references, and synthetic failure fixtures. It starts
PostgreSQL with **no TCP listener**, using a private Unix socket. Child processes
receive an allowlisted environment, without application database URLs, PG
overrides, API keys, or other workspace secrets. The application's database
module is replaced only at its connection-factory boundary; the session manager,
importer, batch planner/writer, `pg` driver, Drizzle transactions, and PostgreSQL
are real. Table DDL, constraints, and indexes are generated from the application's
current schema. Durability settings remain enabled.

No production endpoint, connection, transaction, run marker, or mapping is read or
modified. No source receipt is refreshed, no source hold is lifted, and no clock
is faked. Existing freshness checks must pass at the actual rehearsal time.

## Repeat safely

Only after explicit owner approval for isolated writes:

```sh
node scripts/data-review/rehearse-california-import.mjs --approve-isolated-writes
```

PostgreSQL's `initdb` and `pg_ctl` must be installed. No Docker or application
workflow is needed. The runner always stops its own cluster in `finally`, even
when assertions fail. A crash outside that cleanup can leave only this isolated
cluster running; never terminate an application/production session to clean it up.

Artifacts are under ignored `generated-artifacts/ca-pg-*/`: cluster files, server
log, elapsed measurements, and the Vitest JSON report.
The cluster can be inspected while stopped without retaining it in Git or a
deployment. A targeted rerun can add `--scenario "test name substring"`; a targeted
pass does not replace the full rehearsal.

The PostgreSQL test is skipped during ordinary test runs. It refuses a target
without the runner's disposable-directory marker. It does not fall back to the
application database.

## Assertions exercised

- A fresh 5,733-source/snapshot/link import, followed by an idempotent repeat.
- Persisted reference-only policies, null retrieval/check dates, unchanged
  manifest-import dates, catalog/selection holds, and unchanged receipt bytes.
- A changed fingerprint is pending review, never promoted. Repeating pending and
  rejected fingerprints preserves their status, old current links, and queue size.
- Multiple current snapshots and duplicate fingerprints are rejected, even when
  the schema permits the inconsistent history across different citations.
- A second real import session fails immediately while another session holds the
  advisory lock. Closing the holder releases it. An unresolved synthetic legacy
  marker blocks imports without being modified.
- Failure after a real snapshot batch write rolls back earlier source writes.
  Failure after the real completion update rolls back the completion marker too.
- Real `pg_sleep` statements exercise the unchanged 15-second server statement
  timeout and 20-second driver query timeout. Only the query-timeout fixture
  disables the shorter server timeout, so it can independently reach the driver
  timeout. A 31-second application pause exercises the real 30-second
  idle-in-transaction timeout and checks PostgreSQL error `25P03`.
- Nine active 14-second database sleeps after writing the completion marker
  exceed the actual 120-second total budget without hitting the shorter
  individual timeouts; the entire data transaction must roll back.
- The COMMIT response is interrupted at the actual PostgreSQL wire boundary:
  after the server emits `CommandComplete(COMMIT)`, the test destroys the socket
  before the driver receives that acknowledgement. An independent connection
  verifies durable data and a completed marker. The caller reports uncertainty,
  requires primary verification, and cannot overwrite completion with failure.

Expected error logs during fault cases are evidence of exercised failure paths,
not a reason to repair production markers.

## Safety correction found by the rehearsal

The first complete fault pass exposed an unhandled `pg` connection-error event
when the real COMMIT acknowledgement was dropped. Although the completed marker
was preserved, that separate event could crash the server. The disposable import
session now owns that event, preserves the first connection error for its next
boundary check, and still closes the connection in `finally`. This changes no
database targeting, retry policy, lock, timeout, source hold, or receipt.

The initial timeout test assertions also needed to inspect the underlying driver
error rather than Drizzle's SQL wrapper and retain the first idle-timeout code
rather than the later generic disconnect event.

## Recorded result: 2026-11-02 UTC

**PASS: all 10 PostgreSQL test cases**, with no unhandled errors. The final
disposable cluster ran PostgreSQL 16.10. Full test execution took 253.60 seconds
(255.67 seconds including test-runner setup). The runner stopped the cluster
successfully. Detailed local evidence is in
`generated-artifacts/ca-pg-Ri0Fyv/results.json`, `vitest-results.json`, and
`postgres.log`; these generated files are deliberately not committed or deployed.

| Scenario | Measured importer/session elapsed |
| --- | ---: |
| Fresh 5,733-reference import | 3.150 s |
| Repeat import, no new snapshots or links | 1.305 s |
| Repeat preserving existing receipt/check dates | 1.278 s |
| Changed fingerprint held pending review | 1.748 s |
| Repeat pending fingerprint | 1.264 s |
| Repeat rejected fingerprint | 1.112 s |
| Multiple-current history rejected | 0.930 s |
| Duplicate-fingerprint history rejected | 2.000 s |
| Concurrent advisory-lock rejection | 0.322 s |
| Unresolved legacy-run rejection | 0.415 s |
| Rollback after snapshot batch write | 1.476 s |
| Rollback after completion update | 2.982 s |
| Rollback including changed snapshot/review queue | 1.554 s |
| Server statement timeout, including cleanup | 16.250 s |
| Driver query timeout, including cleanup | 40.987 s |
| Idle transaction timeout, including cleanup | 31.917 s |
| Total-budget rejection, including rollback | 128.202 s |
| Lost real COMMIT acknowledgement | 2.457 s |

The 20-second driver query timeout is **not a 20-second whole-import deadline**:
when the shorter server statement timeout is disabled in that fixture, the
server's outstanding sleep and the driver's rollback attempt add cleanup time.
The 120-second total budget is a cooperative boundary check, not a hard interrupt
at exactly 120 seconds; the deliberate 126-second active-sleep fixture is rejected
at the next check and leaves no data or completion marker committed.

The statement fixture verified driver error `57014`; the idle fixture verified
`25P03`. Timeout and pre-commit fault cases left no committed sources, snapshots,
links, or review queue entries. An interrupted connection could leave an
`in_progress` marker; this remained blocked rather than being repaired. In the
COMMIT-acknowledgement case, the independent connection instead confirmed all
5,733 sources/snapshots/links and the original completed marker, while the caller
reported uncertainty and required primary verification.

`npm run check`, a separate type-check of the PostgreSQL test, and 41 focused
offline tests also passed. A cold release-fixture test exceeded its existing
5-second test-runner limit under concurrent load; that unchanged freshness suite
passed all 10 cases when rerun with a 15-second test-runner limit. No production
timeout, freshness date, or source hold was changed to obtain these results.

## Completion validation reconciliation

The first required full-project command, `npx vitest run`, did **not** pass.
Its completion code review passed.
The full run reported 2,214 passed, 10 failed, and 85 skipped tests. Four failures
were 5-second test-runner timeouts; those cases passed on a serial targeted rerun
with a 15-second test limit. Six assertions still failed on that rerun:

- `tests/guidance-route.test.ts`: Ohio eligibility count expected 105, observed 104.
- `tests/jury-instructions.test.ts`: 101 Florida entries lack the instruction
  reference or explicit no-instruction source note expected by the guard.
- `tests/ohio-common-authority-boundary.test.ts`: two corrected-record
  eligibility assertions returned an empty set.
- `tests/ohio-reviewed-source.test.ts`: administrative-rule rejection and
  deduplicated-seed expectations did not match current behavior.

The owner subsequently approved reconciling these failures:

- Ohio's API test now expects 104 available and 21 withheld draft records,
  explicitly verifying that the criminal-trespass source-change hold is honored.
- Reviewed-seed tests use the existing shared recorded-evidence-time helper,
  rather than treating expired evidence as current. A new test asserts an empty
  source/snapshot/link/selection seed at the receipt's actual expiry.
- Authority-boundary fixtures now mock the durable pilot freshness service used
  by the runtime, with an additional negative assertion for an unavailable/stale
  durable receipt using an actual chapter 2903 pilot charge and its complete
  pinned evidence. The old file-backed freshness mock alone no longer controls
  that boundary.
- Florida's source-first citation overlay explicitly states when no per-charge
  jury-instruction mapping has yet been verified, while preserving any exact
  existing instruction reference/URL. It does not invent an FSJI number or claim
  the courts publish no applicable instruction. New assertions verify absent
  mappings still return no instruction reference or URL.
- The test-runner timeout is 15 seconds to allow cold catalog imports under
  full-suite imports. Evidence-heavy suites run in one worker to avoid concurrent
  hashing and Python-validator contention. No application/database timeout changed.

All 81 tests in the four formerly failing Ohio/Florida files and the TypeScript
check passed after reconciliation. No production data, source-change hold,
receipt, legal offense mapping, or source pin was changed. The full-project
validation remains the final completion gate; the isolated PostgreSQL checks do
not override it.

## Interpretation

Elapsed measurements describe this local Unix-socket PostgreSQL environment,
including importer work and committed audit metadata. They are not estimates
derived from mock query counts and do not establish hosted/TLS/network latency
or production readiness. Production publication, primary-state verification,
legacy-run resolution, and any production import require separately authorized
work.
