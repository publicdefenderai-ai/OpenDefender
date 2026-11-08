# Bounded release fixes

Baseline: `608b6d660dd34ad7850e1ebc3da08372812f71cf`, exactly the candidate assessed by Replit. No later state or design branches are included. This work does not change statutes, receipt dates, database mappings, startup safeguards, imports, migrations, pilot activation or monitoring.

## Failure assessment

| Reported failure | Finding | Bounded change |
| --- | --- | --- |
| Six collateral-screener scenarios | Confirmed test-selector collision. The broad h2 locator also selects the contextual NRRC heading. Reproduced unchanged locally. | Scope question-heading assertions to the existing collateral-content container. Preserve focus, wording, result, print/copy, state and mobile assertions; additionally require the NRRC section to remain visible. |
| Two Housing navigation scenarios | Confirmed outdated template assumption. The approved design replaced the generic start button with localized renter/owner/urgent pathways. The old test still requests the removed generic button. Reproduced unchanged in Spanish locally. | Verify the localized renter pathway, its phone bounds and the same section-start-here destination. Keep Housing in the route loop; no route skip or duplicate obsolete button. |
| Chinese Finances narrow targets | Replit measured 38px targets. Shared PageSectionNav guaranteed height but had no minimum width. The unchanged local 320px probe passed, so exact width is environment-dependent. | Add a 44px minimum width and center contents in the existing shared navigation component. Preserve labels, hashes, focus behavior and wrapping. |
| California current-authority dashboard/export timeout | Replit could not identify the timed-out action; its companion withholding scenario passed. Both scenarios passed unchanged locally. A concrete ordering hazard exists: the test waits for click completion before dismissing the native alert, which can itself block click completion. This does not establish the original timeout's root cause. | Dismiss in the dialog promise handler rather than after click. Retain the failure-message assertion, explicitly verify the export-time authority response is empty, and require the export button to recover. A named test step improves diagnostics. No application export behavior or test timeout changes. |

The California finding remains a qualified diagnosis. A green combined run supplies regression evidence, not retrospective proof of where Replit's timed-out execution stopped. Failure traces are enabled for the final local combined run.

## Dependency exposure

The original full audit reported nine affected dependency entries: eight moderate and one high; production-only audit was clear. These are package/advisory propagation counts, not nine independent production exploits.

Vite is actually used in development middleware in server/vite.ts, with appType custom and the unchanged request URL passed to transformIndexHtml. Thus the [custom-middleware advisory](https://github.com/vitejs/vite/security/advisories/GHSA-9jrq-w75r-8gcw) cannot be dismissed solely because Vite is a devDependency. The production branch in server/index.ts serves built assets, and the release launcher fixes NODE_ENV to production; it does not start Vite middleware. Production deployment should retain that boundary.

Update only Vite from 6.4.3 to the compatible patched 6.4.5. The lockfile changes only its root requirement and Vite package entry; no unrelated upgrades, forced audit fix, connection or host changes. This removes all Vite advisory entries, including the editor-related high finding. [Editor advisory](https://github.com/advisories/GHSA-r825-w8mm-5pxw) and [file-serving advisory](https://github.com/vitejs/vite/security/advisories/GHSA-rq7h-c2jc-7f22) describe configuration-specific prerequisites; no exploit was attempted against any user environment.

After the patch: production audit zero; full audit eight moderate, zero high/critical. Remaining groups are deliberately assessed rather than upgraded in this bounded PR:

- Vitest/mocker: the [redirect](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) and [manual mock](https://github.com/advisories/GHSA-qxg6-89mg-rqv8) advisories concern reachable development mock-registration interfaces. This repository uses Vitest's Node test environment and does not register mockerPlugin/interceptorPlugin in its application Vite config. No affected application request path was identified. Keep test tooling private; future exposure/configuration changes require reassessment.
- Drizzle-kit/esbuild-kit/old nested esbuild: the [esbuild advisory](https://github.com/advisories/GHSA-67mh-4wv8-2f99) concerns its serve feature. Application builds use the separate modern direct esbuild dependency; no invocation of the affected nested serve interface was found in application or release scripts. No database tooling was run. Do not expose database-development tooling as a public service.
- Tailwind typography/postcss-selector-parser: the [selector parsing advisory](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) concerns attacker-controlled selectors. This dependency is used at build time on repository sources, not to parse submitted CSS in a production request. Ordinary trusted-source builds are outside the advisory's stated exposure. This does not authorize building untrusted contributions with secrets.

These moderate findings remain unresolved in the lockfile and must not be described as a clean full audit. No broad dependency upgrade is needed merely to claim this browser fix complete.

## Validation and release boundary

Clean installation uses npm ci --include=dev --ignore-scripts. Typecheck and production build pass. The PR description records final targeted, regression, source-readiness and complete-browser results, with skipped/database-dependent checks explicitly separated. No retries, timeout increases, removed assertions or newly skipped browser scenarios are used.

The browser command is built from the exact committed allowlist in scripts/release-check/run-browser-tests.mjs, using the installed Playwright CLI and playwright.release.config.ts, one worker, zero retries, XDG_CONFIG_HOME, no production credentials and a temporary local release-check token. It does not run the seed-containing release:verify pipeline.

Publication remains unapproved. Georgia/Pennsylvania coverage, Illinois certificate access, Florida's older expired bundle, Ohio receipt deadlines and Ohio staging/source decisions remain separate. After review, Replit must reconcile the exact final candidate, inspect the Publishing schema proposal and report final checks before requesting publication approval.
