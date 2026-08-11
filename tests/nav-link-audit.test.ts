/**
 * nav-link-audit.test.ts
 *
 * Static analysis guard: every internal href/link value in the four
 * hand-maintained navigation surfaces must resolve to a registered route
 * (or a redirect) in client/src/App.tsx.
 *
 * This prevents the class of drift where a link destination is renamed or
 * removed while the nav entry stays behind pointing to a dead route.
 *
 * Strategy:
 *  1. Parse App.tsx with a regex to collect all <Route path="…"> patterns.
 *     Routes that contain :param segments are treated as prefix-patterns.
 *  2. Parse each nav surface file for literal string paths (href="…" / link="…").
 *  3. Strip hash fragments and trailing slashes for comparison.
 *  4. Assert every extracted path resolves to a known route or redirect.
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf-8");

// ── 1. Build the set of known routes from App.tsx ────────────────────────────

function extractRoutes(appSrc: string): Set<string> {
  const routes = new Set<string>();
  // Match: path="…" inside <Route …>
  const routeRe = /<Route\s[^>]*path="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = routeRe.exec(appSrc)) !== null) {
    routes.add(m[1]);
  }
  return routes;
}

// ── 2. Extract literal internal paths from a source file ─────────────────────

function extractPaths(src: string): string[] {
  const found: string[] = [];

  // Patterns we care about (all must be literal strings, not template literals):
  //   href="/…"     link="/…"     href: "/…"     link: "/…"
  const patterns = [
    /\bhref="(\/[^"#?]*)(?:[#?][^"]*)?"/, // href="…" (strip hash/query)
    /\blink="(\/[^"#?]*)(?:[#?][^"]*)?"/, // link="…"
    /\bhref:\s*"(\/[^"#?]*)(?:[#?][^"]*)?"/,
    /\blink:\s*"(\/[^"#?]*)(?:[#?][^"]*)?"/,
    /\bto="(\/[^"#?]*)(?:[#?][^"]*)?"/, // <Redirect to="…">
  ];

  for (const re of patterns) {
    const globalRe = new RegExp(re.source, "g");
    let m: RegExpExecArray | null;
    while ((m = globalRe.exec(src)) !== null) {
      const p = m[1].replace(/\/$/, "") || "/";
      found.push(p);
    }
  }

  return [...new Set(found)];
}

// ── 3. Resolve a path against the registered routes ──────────────────────────

function resolves(p: string, routes: Set<string>): boolean {
  const normalized = p.replace(/\/$/, "") || "/";

  // Exact match
  if (routes.has(normalized)) return true;

  // Dynamic segment match — if any route contains :param, treat it as a
  // prefix/pattern and do a simple segment-by-segment comparison.
  for (const route of routes) {
    if (!route.includes(":")) continue;
    const routeSegs = route.split("/");
    const pathSegs = normalized.split("/");
    if (routeSegs.length !== pathSegs.length) continue;
    const match = routeSegs.every(
      (seg, i) => seg.startsWith(":") || seg === pathSegs[i]
    );
    if (match) return true;
  }

  return false;
}

// ── 4. Test suite ─────────────────────────────────────────────────────────────

const appSrc = read("client/src/App.tsx");
const routes = extractRoutes(appSrc);

const surfaces: Array<{ name: string; file: string }> = [
  { name: "directory.tsx",   file: "client/src/pages/directory.tsx" },
  { name: "header.tsx",      file: "client/src/components/layout/header.tsx" },
  { name: "footer.tsx",      file: "client/src/components/layout/footer.tsx" },
  { name: "home.tsx",        file: "client/src/pages/home.tsx" },
];

describe("Nav link audit — all internal links resolve to registered routes", () => {
  it("App.tsx registers at least 30 routes (sanity check)", () => {
    expect(routes.size).toBeGreaterThan(30);
  });

  for (const { name, file } of surfaces) {
    describe(name, () => {
      const src = read(file);
      const paths = extractPaths(src);

      it(`${name} — extracts at least one internal path`, () => {
        expect(paths.length).toBeGreaterThan(0);
      });

      it(`${name} — every extracted path resolves to a registered route`, () => {
        const dead: string[] = [];
        for (const p of paths) {
          if (!resolves(p, routes)) {
            dead.push(p);
          }
        }
        if (dead.length > 0) {
          console.error(
            `\n[${name}] Dead/mis-routed links:\n` +
              dead.map((d) => `  ${d}`).join("\n")
          );
        }
        expect(dead).toEqual([]);
      });
    });
  }
});
