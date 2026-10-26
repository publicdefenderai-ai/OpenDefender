# Approved design implementation baseline

This is a presentation specification, not legal-content approval or release authorization. The source previews remain local owner artifacts; this document records their identity and implementation requirements without copying review deliberations. Earlier concepts do not override later accepted refinements.

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
| Existing urgent-help dialog | Preserved byte-for-byte; approved full-page urgent subflows are not implemented yet |
| First 24 Hours full layout | Pending; existing substantive page retained. Shared typography and shell apply, but this is not a completed page conversion |
| Immigration full layout | Pending; existing substantive page retained. Shared typography/shell and removal of automatic phase rotation do not constitute the approved full layout |
| Case Guidance, consent, questions, recovery and results | Separate integration batch; do not substitute static preview questions for production questions or change consent defaults |
| Other approved resource-page layouts | Pending page-by-page conversion, using final corresponding reference |

Known deliberate production differences from the simplified homepage mockup: existing beta notice, full legal disclosure, search capability and chat launcher remain. The mockup did not establish permission to remove those safeguards or functions. Existing translated legal disclaimers remain unchanged. Interface translations are not a new legal-content review.

## Required procedure for every next batch

1. Identify the latest accepted preview and subsequent refinements before editing. Record its filename and digest here or in the batch checklist.
2. Compare the production page with the preview, inventorying every tool, deep link, translation, consent state and substantive content block. A simplified mockup is not a complete source of functionality.
3. Prepare and inspect the proposed diff. Make content-preservation checks independent of visual checks. Flag any proposed content or behavior change explicitly.
4. Inspect the implementation and reference at matching desktop and phone widths, in both themes. Check English, Spanish and Chinese, keyboard operation, focus return, overflow and reduced motion.
5. Verify typecheck, build, focused behavior checks and the browser checks that actually ran. Distinguish tests added from tests executed. Keep unresolved discrepancies visible; do not label a partially restyled page complete.
6. Update the draft PR and working preview. External review and owner merge approval precede rollout; Replit integration and deployment remain separate.

Do not use design acceptance to approve legal claims, privacy promises, source freshness, model output, or database changes. Private attorney-review materials must remain outside tracked artifacts.
