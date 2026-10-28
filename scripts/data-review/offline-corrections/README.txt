Offline correction preparation

This standalone Python tool reads a local review ZIP and prepares inactive correction
candidates. It never imports the application, contacts a service, accesses a database,
changes source pins or renews receipts. It is not consumed by the runtime.

Run:
python3 scripts/data-review/offline-corrections/prepare.py --packet /outside/repo/review.zip --baseline /path/to/checkout --output /outside/repo/new-candidates.json

The output must be outside all Git checkouts and must not already exist. Keep real
review packets and generated proposals outside the repository. Do not commit them.
Tests use fictional text only. A manifest/hash verifies integrity, not legal approval
or the identity of an approving reviewer. All generated entries remain held, pending
review and runtime-ineligible. Existing holds must remain in force.

Checks cover packet integrity, bounded ZIP size, unsafe member paths, exact source
hashes and passage offsets, old/new quote bindings, dependency presence and baseline
English-text drift. Candidate summaries preserve appended qualifications; related
context remains separate from public summary fields. Changed language needs review
before eventual publication. Historical source dates are not renewed by this tool.

The current input format is the offline record-impact review packet. Its offsets are
validated against retained Python strings, then explicitly converted to JavaScript
UTF-16 positions for the output evidenceSpans. Full source documents accompany those
spans. Any future runtime adapter must still validate its own contract, publication
approval and temporal applicability. No runtime importer consumes this output.

Verification:
python3 -m unittest discover -s scripts/data-review/offline-corrections -p 'test_*.py'

tests/offline-corrections.test.ts runs these checks through the existing Vitest CI
entry point. No workflow permissions or new dependencies are required.

Source effectiveDateStart is required for candidate and retained documents and must
be a real YYYY-MM-DD calendar date. This validates metadata shape, not legal currency.
Quote-rebinding candidates are input integrity checks only; they are not emitted or
applied by this preparer. Review their old/new bindings in the original local packet.
Output evidenceSpans contain the separately validated record-bound passages.
prepare() rejects input lacking validate_packet's required evidence context; this is
an ordering guard for trusted local callers, not an unforgeable approval boundary.
