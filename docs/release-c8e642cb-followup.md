# Bounded release follow-up

Base: `c8e642cbce62691b45d723d485a0653074f6abda`. No later main changes.

## Confirmed fixes

- Ohio and Florida seed construction repeatedly validated complete family evidence for each record. Validation is now memoized only inside one synchronous build, keyed by validator function. Separate builders and subsequent calls revalidate independently. All per-record checks, pilot receipt rules and conjunctive gates remain intact.
- The Florida robbery search test assumed its result occupied the first 20 nationwide results. The charge is present in the full results and the Florida-filtered results. The test now traverses every global page, checks both Florida inclusion and Illinois withholding, and checks the Florida jury-instruction metadata separately. No application search ranking or eligibility was changed.
- New tests require one family validation per build, verify false results are not reused on the next build, and exercise the real Florida receipt at exact expiry.

## Unresolved evidence

- The Ohio PostgreSQL failure is an assertion at the first default reactivation, not the previously documented timeout. Its unchanged fail-closed assertion now reports disposable-cluster status, recent run errors and selectable IDs on failure. Local PostgreSQL binaries are unavailable; this test was not executed here. The pilot remains outside production authorization.
- The source-readiness browser scenario passes locally after the performance change. Replit must confirm this on its runner before the reported failure is closed.
- The statute-reader English/light screenshot passes locally without baseline or tolerance changes. Replit's report records 1,905 differing pixels at 320px. Its ZIP includes image paths, not the actual/expected/diff images. Those images are needed to establish the Linux failure's cause; local success is not evidence that it is harmless.

## Dependency audit

On November 18, GitHub marks GHSA-fc5q-39xc-vjpf withdrawn. The maintainer disputes accepting untrusted glob expressions as a supported use case. Nevertheless, npm still returns this advisory, even using a fresh cache. This checkout's audit reported 10 high production affected-package entries and 12 high/7 moderate full-tree entries. These differ from Replit's retained counts; neither result is called clean.

- https://github.com/advisories/GHSA-fc5q-39xc-vjpf
- https://github.com/micromatch/picomatch/pull/235

The application has no direct server imports of picomatch, micromatch, Tailwind or PostCSS; the identified chain is tooling. This limited code inspection is not proof of no exploit path. No dependency downgrade, force fix, audit suppression or waiver is included. Reconcile the current registry result before release clearance.

## Verification and boundaries

Focused regression checks: 43 passed across seven files. Focused browser checks: 14 passed, zero retries, including authority boundaries, authenticated readiness and statute-reader layouts in all three languages and both themes. Production build and typecheck passed. Tests use a credential-free local fixture server, not production.

No receipt, legal source text, approval decision, production data, schema, startup safeguard or connection precedence change. No import, migration, monitoring activation or publication. Florida's approved artifact hashes remain unchanged. The private runner packet stays outside Git.

## Replit follow-up

Use this branch's exact reviewed commit atop the pinned base. Run the focused tests first, including the single PostgreSQL reactivation scenario in an explicitly disposable cluster. Supply that failure's diagnostic message if it persists, and the retained screenshot's expected/actual/diff images. Do not spend another complete browser run until these bounded questions are resolved. The full release gate is still required on the eventual exact release candidate.
