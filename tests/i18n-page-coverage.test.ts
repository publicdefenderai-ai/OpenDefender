/**
 * i18n page coverage guard
 *
 * Scans client/src/pages and client/src/components (excluding the
 * content-free shadcn primitives in components/ui) for files with
 * substantial hardcoded English JSX text but little or no i18next t()
 * usage — the signature of a page that was never wired up for translation.
 *
 * Motivating regressions (all found and fixed the same way — a page or
 * component rendering real English sentences with zero or near-zero t()
 * calls, sometimes even after importing useTranslation): the reentry page,
 * the support-hub callout, warrants.tsx, and letter-generator.tsx. Each was
 * caught by manual audit rather than by a test, so the bug recurred four
 * times before this guard was added.
 *
 * This is a heuristic, not a translation checker: it counts JSX text nodes
 * and translatable attributes (`>Some Sentence<`, `placeholder="..."`, etc.)
 * and compares that count against the number of `t(` calls in the same
 * file. A file that is actually wired up for i18n calls t() at least once
 * per rendered string, so its ratio comfortably clears 1.0; an untranslated
 * file sits at 0. Files legitimately exempt (internal admin tools, developer
 * docs, professional/advocate-facing tooling) are listed in ALLOWED_UNTRANSLATED
 * with a reason. Anything else that regresses below the threshold fails the
 * test — that's the fourth-recurrence catch this guard exists for.
 *
 * If you add a new page/component that trips this test:
 *   - If it's meant to be used by defendants, families, or the general
 *     public: wire it up with useTranslation()/t() instead of allowlisting it.
 *   - If it's genuinely internal/professional-only (admin tools, API docs,
 *     attorney-side tooling): add it to ALLOWED_UNTRANSLATED with a reason.
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = ['client/src/pages', 'client/src/components'];
const EXCLUDE_PREFIXES = ['client/src/components/ui'];

// Files with a known, reviewed reason for staying English-only.
// Each entry should say WHO the page is for and WHY that audience doesn't
// need translation — not just "pre-existing."
const ALLOWED_UNTRANSLATED: Record<string, string> = {
  'client/src/pages/tech-docs.tsx': 'Developer-facing technical documentation, not shown to defendants/families.',
  'client/src/pages/api-docs.tsx': 'Developer-facing API documentation.',
  'client/src/pages/data-sources.tsx': 'Methodology/data-sourcing reference page for researchers and technical reviewers.',
  'client/src/pages/widgets.tsx': 'Embed/config reference for partner sites, not a defendant-facing page.',
  'client/src/pages/admin/attorney-review.tsx': 'Internal staff admin tool (attorney content review queue).',
  'client/src/pages/admin/citation-review.tsx': 'Internal staff admin tool (citation review queue).',
  'client/src/pages/admin/provider-metrics.tsx': 'Internal staff admin tool (source provider operations metrics).',
  'client/src/components/attorney/template-wizard.tsx': 'Attorney-facing professional tooling, not defendant-facing.',
  'client/src/components/attorney/template-form-section.tsx': 'Attorney-facing professional tooling, not defendant-facing.',
  'client/src/components/attorney/document-preview.tsx': 'Attorney-facing professional tooling, not defendant-facing.',
  'client/src/pages/search-seizure.tsx': 'Route redirects to /rights-info (translated); this component is unreachable dead code.',

  // --- Known debt surfaced by this guard's introduction (2026-08-09) ---
  // These ARE public/defendant-or-family-facing and SHOULD be translated;
  // they are allowlisted only so this guard can ship without also forcing
  // an unplanned multi-page translation effort in the same change. Do not
  // add new entries to this sub-list — treat it as a fixed backlog.
  'client/src/pages/right-to-counsel.tsx': 'KNOWN DEBT: live defendant-facing rights page, needs full translation like warrants.tsx.',
  'client/src/pages/friends-family-toolkit.tsx': 'KNOWN DEBT: live family-facing toolkit, imports useTranslation but has zero t() calls.',
  'client/src/components/document-summarizer.tsx': 'KNOWN DEBT: backs the live /document-summarizer route, imports useTranslation but has zero t() calls.',
  'client/src/pages/statutes.tsx': 'KNOWN DEBT: live public statute-lookup page, imports useTranslation but has zero t() calls.',
  'client/src/pages/for-advocates.tsx': 'Advocate/public-defender-facing professional tool; lower priority than defendant-facing pages but not yet translated.',
  'client/src/pages/for-advocates/mitigation-builder.tsx': 'Advocate-facing professional tool.',
  'client/src/pages/for-advocates/intake-checklist.tsx': 'Advocate-facing professional tool.',
};

const TEXT_NODE_RE = />\s*([A-Z][^<>{}\n]{14,}?)\s*</g;
const ATTR_RE = /\b(?:placeholder|alt|title|aria-label)="([A-Z][^"]{14,})"/g;
const T_CALL_RE = /\bt\(/g;
const USES_TRANSLATION_RE = /useTranslation/;

// Below this ratio of t() calls to translatable-looking strings, a file is
// almost certainly not wired up for i18n at all (translated files in this
// codebase run well above 1.0; untranslated ones sit at exactly 0).
const MIN_RATIO = 0.5;
// Files with fewer than this many candidate strings are too small for the
// ratio to be meaningful (e.g. a component with one icon and a wrapper div).
const MIN_TEXT_COUNT = 5;

function walk(dir: string, out: string[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full).split(path.sep).join('/');
    if (EXCLUDE_PREFIXES.some((p) => rel.startsWith(p))) continue;
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile() && full.endsWith('.tsx')) {
      out.push(full);
    }
  }
}

function countMatches(content: string, re: RegExp): number {
  let count = 0;
  const r = new RegExp(re);
  while (r.exec(content)) count++;
  return count;
}

describe('i18n page coverage guard', () => {
  const files: string[] = [];
  for (const dir of SCAN_DIRS) {
    walk(path.join(ROOT, dir), files);
  }

  it('found pages/components to scan', () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it('flags no untranslated pages/components outside the reviewed allowlist', () => {
    const offenders: string[] = [];

    for (const file of files) {
      const rel = path.relative(ROOT, file).split(path.sep).join('/');
      if (ALLOWED_UNTRANSLATED[rel]) continue;

      const content = fs.readFileSync(file, 'utf8');
      const textCount = countMatches(content, TEXT_NODE_RE) + countMatches(content, ATTR_RE);
      if (textCount < MIN_TEXT_COUNT) continue;

      const tCount = countMatches(content, T_CALL_RE);
      const ratio = tCount / textCount;

      if (ratio < MIN_RATIO) {
        const usesTranslation = USES_TRANSLATION_RE.test(content);
        offenders.push(
          `${rel} — ${textCount} translatable-looking strings, ${tCount} t() calls (ratio ${ratio.toFixed(2)}, useTranslation imported: ${usesTranslation})`
        );
      }
    }

    expect(
      offenders,
      `Found ${offenders.length} file(s) that look untranslated (substantial English text, few/no t() calls).\n` +
        `If these are meant for defendants/families/the public, wire them up with useTranslation()/t().\n` +
        `If they're genuinely internal/professional-only, add them to ALLOWED_UNTRANSLATED in this test with a reason.\n\n` +
        offenders.join('\n')
    ).toEqual([]);
  });

  it('does not contain stale allowlist entries for files that no longer exist', () => {
    const stale = Object.keys(ALLOWED_UNTRANSLATED).filter((rel) => !fs.existsSync(path.join(ROOT, rel)));
    expect(stale, `These allowlist entries reference files that no longer exist: ${stale.join(', ')}`).toEqual([]);
  });

  it('keeps the canonical printable rights callout translated in every supported language', () => {
    const buttonLabels = {
      en: 'Open Printable Rights Cards',
      es: 'Abrir Tarjetas Imprimibles de Derechos',
      zh: '打开可打印的权利卡片',
    } as const;

    for (const locale of Object.keys(buttonLabels) as Array<keyof typeof buttonLabels>) {
      const source = fs.readFileSync(path.join(ROOT, `client/src/locales/${locale}.ts`), 'utf8');
      expect(source, `${locale} locale is missing the printable rights callout`).toContain('"printableCards"');
      expect(source, `${locale} locale is missing the printable rights callout button`).toContain(`"button": "${buttonLabels[locale]}"`);
    }
  });
});
