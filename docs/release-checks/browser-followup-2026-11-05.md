# Browser release follow-up: November 5, 2026

Base: `f7dba501e7f54d788fc8071f32a0de9cdac0573b`, exactly Replit's tested candidate. No later main changes included.

## Findings and changes

- Saved-answer recovery: the two reported failures occur in a synchronous `count()`/generic Back loop during animated step changes. It can observe an exiting screen and click Back again before the new screen is ready. This did not reproduce on the first local baseline pass; it is not evidence of lost answers. Replace the same loop in all three recovery paths with distinct screen-control assertions and advancement of the controlled clock through the normal 150ms exit transition. Preserve storage, reload, unknown-charge and jurisdiction assertions; additionally check restored case stage, custody, and attorney answers. No application recovery/storage behavior changes.
- Immigration: shell language/theme readiness does not imply the lazy route is rendered. A controlled local script delay reproduced zero headings when the shell was ready and two after route rendering. Wait for exactly two visible headings before measuring them and font readiness. Exercise delayed route loading in all six language/theme cases. Keep text bounds, line counts, accordion and language-switch assertions.
- Spanish plea guide: the baseline reproduced the reported heading/description overflow in Spanish dark theme (Replit observed light). The plea-specific `1fr` grid rule has an automatic minimum and overrides the responsive `minmax(0,1fr)` rule by specificity. Make the plea track shrinkable, allow the hero child to shrink, and wrap long words instead of widening the track. Preserve all wording. In addition to existing element-bound assertions, check actual hero text rectangles in all three languages, both themes, desktop and 320px mobile after fonts load. No clipping, truncation, hidden text, or broad skips.

## Verification

Baseline targeted browser run: 17 passed, one Spanish plea overflow failure. The reported recovery and immigration failures were intermittent and did not occur in that run. Controlled delayed immigration loading independently reproduced the early measurement condition.

Validation results are recorded in the PR. Tests use the built artifact, committed release configuration, a fresh release-only random admin token, an allowlisted environment with no production credentials, and no database. XDG_CONFIG_HOME is supplied only to the local harness. Replit's initial missing-XDG launcher failure remains a separate environment issue; this change does not modify the launcher.

## Boundaries

Only hero CSS and the three browser spec files change behavior. Startup safeguards, database precedence, migrations/imports, authority gates, source pins/receipts, and monitoring are unchanged. No publishing or database operations performed. GA/PA coverage, Illinois source certificate access, and Florida's expired reviewed receipt remain separate unresolved release limitations. This targeted verification is not a full release clearance.
