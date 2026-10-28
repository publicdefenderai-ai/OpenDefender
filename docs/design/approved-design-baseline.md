# Approved design implementation baseline

This is a presentation specification, not legal-content approval or release authorization. The source previews remain local owner artifacts; this document records their identity and implementation requirements without copying review deliberations. Earlier concepts do not override later accepted refinements.

## Legal content corrections

L03/L04 corrections from the October 28 saved workbook are recorded in [the implementation record](../legal-review/l03-l04-implementation.md). Preserve these live-content edits when migrating the Rights, counsel, First 24 Hours, quick-reference and bail designs. Older preview copy is historical and must not restore the superseded statements. Reviewer wording differences and translation signoff remain explicit in that record.

## Reference identity

| Local preview filename | SHA-256 |
| --- | --- |
| `opendefender-desktop-paired-buttons-preview.html` | `f028466f61964b9f04ccae862092d448fce0533ad3c498c90ff15a3d16e5cd9b` |
| `opendefender-mobile-paired-buttons-preview.html` | `d1bf130578aad5da5d5fbd61fefd29463bea8a0e827e126a564ae123c9c7f25c` |
| `opendefender-mobile-navigation-preview.html` | `78eb2aaaf76eace824dc7a6c388e5e8bfa10ed0da2285cc1d0a8ea49b0461e71` |
| `opendefender-footer-tone-comparison.html` | `5881557f2b56c19e50839acfe59911300b11e248b1f67491b5839cfde2601e2d` |
| `opendefender-first24-preview.html` | `1552b85e8d666a6afd0b32afc0e398ab95681e1b636acbfa96cc9dbae0fe0395` |
| `opendefender-immigration-preview.html` | `b0abdba7dd9510be8a994f386066ed7ac778d52bb9ed30d33bbf60f92678c12b` |
| `opendefender-interaction-consistency-preview.html` | `10de74e1af078fb72fe5afa24d2026f6c444357424ceec3a20287db712dfc2fc` |
| `opendefender-theme-consistency-preview.html` | `ec50746c6322de4b01d9fede3e2cb3f7941080430c4c6bb59782ba1cf68137f3` |

## Fixed presentation decisions

- Shared identity: DM Sans, warm paper, plum accents, existing shield reduced in scale and recolored warm plum, bold OpenDefender. wordmark. Self-host the font.
- Homepage: architectural open-door graphic; desktop outer height 310px, 150px top radii, inner arch inset 18%/22%, cutout height 80%, skew -16deg, transform origin top left. Do not substitute a differently proportioned drawing.
- Mobile homepage: doorway beside the headline, 92 by 125px; at widths below 360px, 65 by 100px. Four numbered single-column pathways in this order: arrest, criminal case, immigration, life outside the case. Resource inventory follows.
- Homepage actions: equal-size brick-red urgent-help and pale-plum How to use this site buttons side by side. Urgent qualifier identifies an encounter happening now. Do not replace these with a full-width alert banner or an underlined secondary action.
- Desktop navigation: First 24 Hours, Case Guidance, Immigration, and a Resources disclosure containing How to use this site, All resources, Find legal help, and Life & family support. Disclosure works by click and keyboard, not hover-only.
- Mobile navigation: closed on entry, sun/moon control available without opening it, prominent three primary links, always-visible How to use this site and All resources when expanded, then three expandable secondary groups and language selection. Escape closes and restores focus. Preserve navigation guards and search access.
- Footer B: soft 48px transition into lighter plum, existing shield/wordmark, GitHub and X, language names, legal notice, four bold pink/plum links: Mission, Notice & Disclaimers, Privacy, Developers. Desktop policy links align bottom right; wrap on mobile.
- First 24 Hours target: shortened introduction, arrest initially open, multiple stages may remain open, numbered headings and small plus/minus controls, desktop contents and mobile contents disclosure. Preserve optional pre-arrest material, jurisdiction selection/callouts, locator, juvenile material, every existing substantive section and deep-link behavior.
- Immigration target: two-line heading (Immigration Enforcement. / Know Your Rights.), layered arch graphic hidden on mobile, three starting points (encounter, detained-person lookup, legal help), stationary topic list, rapid-response access. Preserve policy notices, hotlines, detailed guidance, translations and source links.

## Draft implementation accounting

| Surface | Status in this draft |
| --- | --- |
| Homepage opening, graphic, four paths and paired actions | Implemented against final desktop and mobile references |
| Shared header, mobile menu, theme control and footer B | Implemented; search and navigation guard retained |
| Existing urgent-help dialog | Restyled with brick accent, solid background, plain scenario rows and numbered steps; original guidance and scenario order retained. Standalone index and three guides now reuse the same guidance |
| First 24 Hours | Numbered, independently expandable stages and mobile contents/state selection implemented. Full existing introduction, substantive content and ancillary sections retained; some ancillary layouts still use the previous styling |
| Immigration | Two-line English heading, approved arch proportions, three starting routes, stationary guide list and independently expandable process phases implemented. Existing notices, full descriptions and ancillary content retained |
| Case Guidance, consent, questions, recovery and results | Separate integration batch; do not substitute static preview questions for production questions or change consent defaults |
| How to use this site and other approved resource-page layouts | Not yet implemented; old page layouts and accent colors remain under the new shared shell |

Known deliberate production differences from the simplified homepage mockup: existing beta notice, full legal disclosure, search capability and chat launcher remain. The mockup did not establish permission to remove those safeguards or functions. The full homepage legal disclosure sits below Browse the full resource inventory, following the owner's placement correction. Existing translated legal disclaimers remain unchanged. Interface translations are not a new legal-content review.

## Required procedure for every next batch

1. Identify the latest accepted preview and subsequent refinements before editing. Record its filename and digest here or in the batch checklist.
2. Compare the production page with the preview, inventorying every tool, deep link, translation, consent state and substantive content block. A simplified mockup is not a complete source of functionality.
3. Prepare and inspect the proposed diff. Make content-preservation checks independent of visual checks. Flag any proposed content or behavior change explicitly.
4. Inspect the implementation and reference at matching desktop and phone widths, in both themes. Check English, Spanish and Chinese, keyboard operation, focus return, overflow and reduced motion.
5. Verify typecheck, build, focused behavior checks and the browser checks that actually ran. Distinguish tests added from tests executed. Keep unresolved discrepancies visible; do not label a partially restyled page complete.
6. Update the draft PR and working preview. External review and owner merge approval precede rollout; Replit integration and deployment remain separate.

Do not use design acceptance to approve legal claims, privacy promises, source freshness, model output, or database changes. Private attorney-review materials must remain outside tracked artifacts.

## Homepage disclosure refinement

Following the owner's request for a wider notice, the design task recommended adapting the approved unboxed, muted disclaimer pattern to the longer production text: full available width up to 960px, 24px top margin, 16px top padding, a one-pixel editorial rule, transparent background, and 13px type at 1.65 line height. The width and rule are a new implementation recommendation, not an exact specification from an older preview. Text is unchanged and wraps naturally across locales and screen sizes.

## Implementation batch: 2026-10-26

Owner accepted the widened homepage disclosure. First 24 Hours now supports several open stages, mobile jurisdiction selection, keyboard focus on contents navigation, initial/hash-change deep links and reduced motion. Immigration retains every existing phase and guide while replacing carousel navigation with native independent disclosures. Both pages retain existing translation keys, source links and legal copy; new translations cover interface labels only. Full production copy intentionally differs from the shorter mockups.

Validation: TypeScript check and production build passed. The focused locale, navigation and translation suite passed 218 tests. Ten browser tests passed for the homepage/shared menu and First 24 Hours (English, Spanish and Chinese, light/dark, mobile state selection, multiple open stages and deep links). Immigration mobile dark layout was visually inspected with the English heading on two lines and no horizontal overflow. Broader visual comparisons and remaining ancillary layout refinements are still pending.

No production publish or merge is authorized by these results. Urgent-help full-page flows and Case Guidance remain subsequent batches. Legal review and AI/output/backend checks remain separate release work.

## External review follow-up: 2026-10-26

Addressed the confirmed language/heading and font-utility findings: document language now follows i18next initialization and changes; immigration heading phrases can wrap in translations while English remains two lines at 320px. Tailwind font utilities now use shared font variables. Consolidated the two theme token blocks without changing their effective values, made footer hover/focus feedback visible with underlining, removed duplicate print/action declarations, and renamed the old TEAL logo constant. Converted the existing variable font to WOFF2 (240,164 to 88,668 bytes); its TTF remains as source, but CSS requests only WOFF2.

Validation: typecheck and production build passed; all 16 browser tests passed. New tests measure text bounds (not just document scroll width, which overflow hiding can mask), verify live document-language changes, and exercise independent phase disclosures at 320px in English/Spanish/Chinese and both themes. Token-value comparison confirmed the palette consolidation preserves every effective root/dark variable.

Remaining review decisions/work:
- Compare restrained serif headings with the accepted DM Sans treatment before making a global typographic change; the accepted font choice has not been silently replaced.
- Restyle the urgent-help dialog while retaining its content and behavior; this remains the most conspicuous old/new visual seam.
- Review actual italic font support along with typography; current italic synthesis remains unchanged.
- Consolidate remaining illustration/button/footer color and radius literals without inadvertently changing approved artwork or contrast.
- The doorway background cutout assumes the page background. Keep this constraint explicit if reusing the motif on another surface.
- Normalize interface-translation formatting during the next locale edit.

The external review reported ten pre-existing unit failures on both the PR and base. That full-suite result was not independently rerun for this follow-up; it is not a claim of a clean full test suite.

## Release-runner coverage correction

The three design specs were previously run manually and omitted from the release runner's explicit allowlist. Added `design-fidelity.spec.ts`, `first24-design.spec.ts`, and `design-review-regressions.spec.ts` to `scripts/release-check/run-browser-tests.mjs`. The CI workflow invokes `release:verify`, which reaches this runner through `test:e2e:release` after earlier gates pass.

All 16 tests passed using `playwright.release.config.ts` against its isolated release-check server. This was a focused release-configuration run, not a full `release:verify` or a completed GitHub CI run. Local dependency resolution initially prevented test startup; aligning the worktree dependency link with the installed Playwright used by imports resolved it without tracked dependency changes.

Separate follow-up: audit the 14 other specs still absent from the allowlist, including timeout recovery, progress overflow, jury display, five California specs and remaining responsive/navigation/print tests. Establish each test's prerequisites and whether it belongs in the release gate or another CI job; do not silently add environment-specific or snapshot checks without that assessment.

## Urgent-help dialog batch

Adapted the compact urgent-help preview’s brick accent, hairline-separated choices and plain numbered steps to the existing production dialog. This is deliberately a dialog restyle, not a claim that the standalone urgent-guide previews are fully implemented. Preserved all five scenario choices, existing guidance strings, three four-step flows and onward links. Removed staggered scenario animations and colored card/icon treatments. Corrected the pre-arrest link to the existing `step-before-arrest` section ID. Focus moves to each selected flow heading, returns to the selected choice on Back, and returns to the homepage trigger on close.

Reference identities:
- `opendefender-urgent-compact-preview.html`: SHA-256 `b6b90c7751cb062907837373141a5e4558a039b85f082c84df398f029668c4ef`
- `opendefender-urgent-arrest-preview.html`: SHA-256 `46d95e4a9c281e8674f9a906dd560bb115662e3e32295fe6088d5c9aefec630b`

Validation: typecheck and production build passed. Ten focused homepage/urgent browser tests passed after restarting the stopped preview server. The six new urgent tests also passed under the isolated release configuration; they cover all three flows, content counts, Back/close/reopen focus, pre-arrest navigation and 320px overflow across English/Spanish/Chinese and both themes. The new spec is included in the release runner. Desktop light/dark visual inspection completed. Existing untranslated bail-checklist copy and generic dialog Close label remain follow-ups; no legal copy was revised. No full CI or production deployment is claimed.

Urgent-help review correction: clear the remembered scenario when the dialog closes. Expanded the six release-config tests to close directly from the family detail flow using both Escape and the close button, then verify homepage trigger focus and first-choice focus on reopening. All six passed; typecheck and production build passed. The PR description now leads with the broken pre-arrest emergency-path link repair.

## Standalone urgent guides

Added `/urgent-help` plus `/urgent-help/arrested`, `/urgent-help/charged` and `/urgent-help/family`. Each existing dialog detail view links to its full page; the homepage dialog interaction stays intact. Extracted the original guidance into one shared component so both presentations use identical steps and onward links. Full pages use a heading hierarchy appropriate to an article and retain the shared header, theme/language controls, footer and disclosure. Removed duplicated numeric prefixes at render time where translated step headings already included a number.

The approved family/court/arrest previews inform the page width, large headings, numbered rows and first-step emphasis. Existing production legal copy takes precedence over the mockups: the arrest page keeps the existing warning instead of introducing a new standalone quotation; the court guide keeps the existing first step rather than reordering its advice. Full substantive review remains separate.

Theme-test correction: prior design tests wrote `vite-ui-theme`, but App configures `public-defender-theme`. Their previous light/dark labels did not prove dark coverage. Updated all three affected specs to use the application key and assert the root theme class. All 24 affected release-config tests then passed across English/Spanish/Chinese and both actual themes, including direct reloads, content/link parity, dialog navigation and focus, and 320px layout. Typecheck and production build passed. No full CI/deployment claim.

Reference identities:
- `opendefender-urgent-family-preview.html`: SHA-256 `4585f14748d2249e0bfc787b3e2886ccd8408d51a2dab6846bab6af1045953ef`
- `opendefender-urgent-court-preview.html`: SHA-256 `bb4c860db29de3cfbcdad5d8151cd0703b51c9fd06f5c61c17317023f789dad8`

### PR 63 review corrections

Localized the bail checklist link on both urgent-help surfaces in English, Spanish, and Chinese. Removed the twelve numeric title prefixes at their locale source and removed render-time stripping. Emphasis is attached explicitly to the lawyer/locating-family steps; link wrappers and competing list spacing utilities were removed. Focused browser checks cover translated link labels and descriptions on both surfaces.

## Case Guidance entry and intake batch

Implemented the accepted document motif, open landing-page sections and a wider seven-step questionnaire. The shared header/footer, four existing process explanations, privacy statements, entry actions and alternate guide links remain. The intake retains the seven production components, all questions and choices, catalog search and authority notices, jurisdiction/territory and school-zone branches, optional background/concern inputs, urgency requirements, CAPTCHA, clear-session and exit controls. The question/answer data model, defaults, validation and generation payload are unchanged. A focused step label now receives focus on navigation; reduced-motion users do not get the fade transition.

The two guidance choices are labeled Option 1/Option 2 with the accepted instruction and bold actions. Applied the owner's explicit attorney-reference sentence and “Tailored AI Guidance” correction across English, Spanish and Chinese. No additional legal/privacy claims were added or reapproved. The landing heading uses the approved preview wording; existing description and substantive sections take precedence over simplified mockup text.

This is the entry/intake portion only. Results, loading/recovery presentation, chatbot presentation, and remaining catalog/urgency ancillary accents are subsequent work. Existing recovery behavior is retained. The old tests' gray-circle assertions now use aria-current; their availability mocks are explicit because their generated responses were already mocked.

References:
- `opendefender-case-guidance-preview.html`: SHA-256 `03d59b4283b2507d72aacfccc850354478ab55e0e3e563819b83ab882fde66df`
- `opendefender-mobile-case-guidance-preview.html`: SHA-256 `dce5a900e32122f9df144b3c544523224afe8e85fab77719c8d165ad75d545ef`

Validation: typecheck/build and 15 unit tests for stage guards, reselection and retry passed. All 11 focused release-config browser tests passed: six locale/theme checks traverse all seven stages with both modes at 320px, and five verify timeout recovery. Desktop entry/consent and narrow mobile consent were visually inspected in the shared palette. The new locale/theme intake spec is wired into the release runner. The California legacy browser suite could not complete against this isolated catalog: its first two scenarios require ca-robbery-in-the-first-degree, which was unavailable; a third scenario also failed before the run was stopped. Do not claim that suite or full CI passed. Existing untranslated production questions are retained and remain a separate localization follow-up.

### PR 64 review follow-up

Added both edited recovery suites to the release browser allowlist. The California catalog investigation confirmed that the checked-in evidence receipt expired on 2026-10-08; the isolated server correctly returned no eligible California charges. The legacy-reselection suite now supplies a test-only, paginated catalog response derived from the canonical records used by its scenarios. It tests saved-answer recovery, canonical replacement and preservation across reloads, not live source eligibility. Production freshness/eligibility rules and the evidence receipt are unchanged; current-source validation remains separate.

Removed aria-current from the decorative, aria-hidden progress track. Regression assertions now use the visible localized Step N of 7 label, which receives focus and is exposed to assistive technology. Added dedicated Back selectors for Additional Details and Active Situations and used them in the design and legacy recovery tests.

The owner's explicit attorney-reference sentence and Tailored AI Guidance label remain. This records the requested copy correction, not independent attorney sign-off or a completed review of provider/privacy/legal statements. The possible emphasis on free counsel can be considered during substantive content review. Minor wording repetition and Spanish capitalization are deferred to consistent editorial review.

Review-fix validation: typecheck and production build passed; all 19 release-config browser tests passed (8 California legacy recovery, 6 locale/theme intake, 5 timeout recovery). Both previously orphaned recovery specs are now included in the explicit release allowlist. Full CI and live source freshness are not claimed.

## Case Guidance results and recovery batch

After PR 64 merged at `10d8f6c5771b010146366261aa913b40d4d62657`, carried the shared design through the generated dashboard, generation progress, timeout/error recovery and expired-session screens. Results use an open reading surface, responsive summary/actions, and five conditional section destinations with keyboard focus and reduced-motion scrolling. Neutral sections use hairlines; critical alerts, deadline notices, uncertainty sections and authority warnings retain their existing semantic treatments. Recovery uses a clearly separated symbol and heading, readable cancellation and full-width narrow-screen choices.

The questionnaire, generation payloads, guidance normalization, legal/privacy copy, source checks, saved-answer retry logic, report action, PDF confirmation/export and independent print plan are retained. No existing translation key or static destination was removed; new interface navigation labels are translated in English, Spanish and Chinese. Printing still includes content when its screen section is collapsed. Existing untranslated dashboard text and remaining ancillary support/verification accents are separate follow-ups. Design acceptance does not approve existing legal/privacy statements or complete the substantive review.

References:
- `opendefender-case-guidance-preview.html`: SHA-256 `03d59b4283b2507d72aacfccc850354478ab55e0e3e563819b83ab882fde66df`
- `opendefender-ai-recovery-preview.html`: SHA-256 `6a3d92975630a22770203750d73b97573ed8a0582b32f8c5ba683c086a1d71dc`

Validation: typecheck, production build and 16 guidance-parity unit tests passed. Browser coverage uses test-only generated records and existing saved-answer recovery, not live AI generation or live source eligibility. The new `case-results-design.spec.ts` is in the release runner allowlist. Full CI/release readiness is not claimed; the previous source-coverage and unrelated unit-suite failures remain separate, and PR 64's PIA audit automation reported a credential failure while creating its audit issue.

Final focused browser results: 14 results/recovery design checks passed, plus all 5 existing timeout-recovery checks. Coverage includes English/Spanish/Chinese at 320px in actual light/dark themes, section focus, checklist interaction, warning visibility, collapsed-content printing, PDF confirmation/download, session expiration, recovery icon placement, reduced-motion loading and cancellation. Desktop results and mobile light/dark results/recovery screenshots were visually inspected. These focused checks do not establish a green full release pipeline.

### PR 65 review corrections

The privilege/legal notice was incorrectly neutralized with the other results sections. Restored visual distinction with a tinted surface and primary-color left border, and increased the unchanged privilege-warning text from 12px muted text to 14px semibold foreground text. The notice is an explicitly labeled note; it does not interrupt screen readers as a new live alert. Removed the unused loading-surface class. Removed all six uppercase/letter-spaced label treatments in the dashboard, including the Start here label. Both results heading templates now use English/Spanish/Chinese translations; charge names and jurisdiction codes remain data, not invented translations. Other existing untranslated content remains a separate follow-up.

Screenshots now use Playwright's per-test outputPath instead of /private/tmp. Added checks for both heading branches, the advisory border/background and text emphasis, and the removal of uppercase labels. Typecheck and production build passed; all 22 focused release-config browser tests passed (17 results/recovery design tests and 5 existing timeout-recovery tests). The light/dark mobile notice screenshots were visually inspected. Legal copy, questionnaire, generation and recovery behavior remain unchanged. This is not a full-CI claim.

Final PR 65 polish: urgency badges now map known enum values to translated English/Spanish/Chinese labels, with a translated fallback. Browser fixtures exercise all four legal-information urgency values in all locales and both themes. Typecheck, production build and all 22 focused browser checks passed. Full release CI remains failing on the separately recorded database/source-readiness issues.

## Chat presentation batch (partial; intake parity remains required)

After PR 65 merged at `a2122867291ddbc58b018a60b4d7ad3dcc85e4dd`, updated the chat presentation to the accepted wider conversation direction. The transcript and choices use the available width, while individual messages retain readable line lengths. Normal choices use shared neutral/plum colors; the urgent choice retains a distinct warm warning treatment. The side panel becomes an expandable case summary available on mobile as well as desktop. State names wrap rather than truncate. Mobile users now have the existing Close action in the header. Header touch targets are at least 44px. User messages use the theme's primary foreground to preserve dark-mode contrast. Reduced-motion preferences suppress movement and repeating typing-dot animation; the existing one-second response pause is unchanged.

This batch does not change the conversation state machine, questions/options, generation payloads, CAPTCHA, privacy/privilege copy, guidance normalization, export confirmation or language-reset behavior. It does not claim that the current production chat meets the approved questionnaire design.

### Required chat follow-up before declaring the chat refresh complete

Inspection found a pre-existing mismatch with the accepted preview: `menu_case_roadmap` goes directly to state selection, and the chat case model has no AI/non-AI guidance mode. It also lacks several fields from the seven-step modal. The user explicitly required both choices and matching questions/options. This remains required implementation work, not an optional enhancement or completed design feature.

- Compare the modal's seven production step components, branching rules and payload fields against the chat state machine.
- Share the canonical question/choice definitions or adapters so the two interfaces cannot drift.
- Implement the explicit AI/non-AI choice in conversation form, preserving mode-specific consent and generation endpoints.
- Preserve Back, selected answers, validation, authority notices, territory/school-zone branches, optional background/concerns, urgency requirements, CAPTCHA and retry behavior.
- Add parity tests that exercise both modes end to end and compare submitted answers/payloads with the modal. Do not substitute static preview questions or describe these presentation tests as intake-parity coverage.

References:
- `opendefender-ai-chat-preview.html`: SHA-256 `a8926699d0836b9a360e54685e66497efd5231a7025d78481113020a53b457c8`
- `chat-wide-style.html`: SHA-256 `9e0f325dd43937eb00723a8571b02089520e63bc13f9e2b4df78420d13eda706`
- `chat-typing-style.html`: SHA-256 `c8cd52170311fb4ae90e6f4b5bf01a2b2e7b518d20fb64289bf7fb15bf69ffc7`

The new chat browser spec is included in the release allowlist. Its scope is presentation, existing entry/state selection, keyboard summary expansion, mobile exit, theme switching and retained typing pause. It does not call the generator or establish full intake parity. Existing full-CI/source-readiness failures remain separate. Legal review remains separate, including PR 66.

Chat presentation validation: typecheck and production build passed; all 8 release-config browser checks passed, along with all 16 existing guidance-parity unit tests (output preservation, not questionnaire parity). Desktop and mobile light/dark screenshots were visually inspected. No full-CI, live-generation or completed intake-parity claim.
