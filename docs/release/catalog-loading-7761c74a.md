# Catalog loading and Support navigation release fixes

Base: `7761c74a24ed9cf8b5376c5c9979b44b65b5509d`. No later state or design commits are included.

## Confirmed application issues

The charge-catalog endpoint previously asked the shared authority layer for every jurisdiction even when a single jurisdiction was requested. The layer then re-read and validated each family's evidence receipt separately for each matching charge. In the release fixture this included all eligible fixture IDs from unrelated states. Production additionally queried unrelated jurisdiction eligibility providers. California's two-page catalog therefore paid work unrelated to California on each page.

The endpoint now passes the jurisdiction set of its actual candidate charges. Only those jurisdictions' providers and freshness gates run. Unscoped search/guidance callers retain their all-jurisdiction behavior, but each receipt-family function runs once per evaluation. The memo lives only inside that call, so the next call rereads receipts, rechecks time and obtains new database eligibility. No shared TTL, receipt extension, missing-evidence fallback or partial-catalog acceptance is introduced. Per-record California currentness and all conjunctive database gates remain.

A local comparison with real receipt validators and database providers replaced by throwing stubs returned the same 703 California IDs: original all-state evaluation 1,623 ms; optimized all-state evaluation 241 ms; scoped California evaluation 201 ms. These are illustrative local measurements, not a deployment latency guarantee. Replit's 90 selector failures and dashboard timeout must be rerun on the exact fixed release candidate before claiming every failure resolved. No assertion timeout was increased and no browser scenario was skipped.

Support jump links had a minimum height but no minimum width. Short Chinese labels therefore produced 32/40-pixel targets. The links now have minimum width and height of 44 pixels. Text, hrefs, focus/keyboard behavior and all locales remain unchanged. The support browser contract now checks target dimensions at 320, 375 and 1280 pixels for all three locales and both themes.

## Verification

The new request-scope unit suite covers fixture and database-provider paths, unrelated-jurisdiction isolation, once-per-family evaluation, a second request at exact expiry, all-jurisdiction callers, and changing database eligibility. Existing Ohio/Florida independent receipt gates also run. All 31 initial focused tests passed; typecheck and production build passed. Final broader regression and browser results are recorded in the PR description.

No production credential or database is needed for these checks. Do not run the seed-containing full release pipeline against an existing database.

## Separate source reconciliation

Ohio's 12 reported conflict keys and 17 candidate-eligible dependents match the previously reviewed PR97 source overlay in this exact candidate. Production comparison evidence has not been inspected. That match does not authorize replacing stored snapshots, clearing conflict holds, adding pilot schema, renewing receipts or importing data. The local per-source comparison packet must be reconciled with Replit's actual retained text/hashes/metadata first. Georgia/Pennsylvania coverage, Illinois certificate access, the older Florida receipt and Ohio's existing receipt deadlines remain separate limitations.
