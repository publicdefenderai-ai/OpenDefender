# Bounded browser isolation repair

Base: `1e8a07b42597c5fdf0ca185878a4ca4ddf98bc46`. This change adds only a browser-spec repair and this report; it does not incorporate later state-review work.

## Evidence and diagnosis

The isolated release assessment recorded 530 browser passes and 216 failures: three Chinese guidance selection timeouts, followed by 213 connection failures after an unmocked OpenLaws request caused the existing production-launcher error guard to stop the fixture server. The selection failures left the checkbox unchecked and Continue disabled. These observations do not establish 216 independent application defects.

The charge helper clicked the center of a row that also contains statute and jury-instruction links. Those nested controls intentionally stop selection propagation. The helper now clicks charge-name text and explicitly verifies the checkbox and Continue state. The original Chinese invalid-citation scenario passed locally unchanged, so the exact assessment timing was not reproduced; this repairs a concrete ambiguous selection assumption.

The loading-label tests previously returned while a delayed route handler was pending. They now hold the response until the loading assertion finishes, release it even on assertion failure, await completion, and assert the returned text. Each then closes its page and confirms the shared server still responds. The assessment establishes that a request escaped mocking, but does not conclusively establish its teardown mechanism.

An automatic context guard aborts and records OpenLaws requests lacking a scenario-specific page mock. Any such request fails the owning test instead of reaching the credential-free server. Pending handlers are drained before teardown. The server's unexpected-error guard remains unchanged. No success fallback, retries, timeout increases, removed assertions, or skips were added.

## Verification

- Exact-base original Chinese invalid-citation and Spanish loading-label scenarios: 2 passed locally; diagnostic instrumentation was removed.
- Updated `localized-guidance-statute-errors.spec.ts` plus neighboring `localized-mobile-actions.spec.ts`, committed release configuration, one worker, zero retries: **17 passed, zero failed or skipped**.
- Temporary negative control deliberately requested an unmatched citation: the owning test failed with the expected explicit-mock assertion while its server-health assertion passed. The deliberate failing control was removed before commit.
- Browser runs used the exact candidate's production build, a disposable local admin token, configured XDG directory, and an allowlisted environment without production credentials. No new production build or full regression/browser run is claimed for this test-only change.

The remaining 213 assessment scenarios still need a successful complete release run; focused results do not retroactively mark them passed. Private operational evidence and diagnostic artifacts are not committed.

## Boundaries

No application code, launch safeguards, database settings, legal content, holds, receipts, imports, or activation controls changed. Florida's 101-ID runner remains unarmed, and publication and production writes remain separately authorized actions. The existing Ohio pilot assertion failure (withheld receipt and pilot choices), Georgia/Pennsylvania coverage limitations, and Illinois certificate-access issue remain separate unresolved limitations.
