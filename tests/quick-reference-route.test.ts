import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const read = (relativePath: string) =>
  fs.readFileSync(path.join(ROOT, relativePath), "utf-8");

describe("Quick Reference route", () => {
  it("routes the Quick Reference destination to the printable cards page", () => {
    const appSource = read("client/src/App.tsx");
    const headerSource = read("client/src/components/layout/header.tsx");
    expect(appSource).toContain(
      'const QuickReference = lazy(() => import("@/pages/quick-reference"));',
    );
    expect(appSource).toContain(
      '<Route path="/quick-reference" component={QuickReference} />',
    );
    expect(appSource).not.toContain(
      '<Route path="/quick-reference"><Redirect to="/rights-info" /></Route>',
    );
    expect(headerSource).toContain(
      'href: "/quick-reference", icon: FileText',
    );
    expect(headerSource).toContain('testId: "menu-quick-reference"');
  });

  it("keeps the print action and printable card section on the destination", () => {
    const pageSource = read("client/src/pages/quick-reference.tsx");
    expect(pageSource).toContain('data-testid="button-print-all-cards"');
    expect(pageSource).toContain('data-testid="section-quick-reference-cards"');
    expect(pageSource).toContain('value={activeTab} onValueChange={setActiveTab}');
    expect(pageSource).toContain('setActiveTab("all")');
    expect(pageSource).toContain('className="hidden print:block"');
    expect(pageSource).toContain('id="print-all-cards"');
    expect(pageSource).toContain('data-testid="print-all-cards"');
    expect(pageSource).toContain('cardTestId="printable-card"');
    expect(pageSource).toContain("window.print()");
  });
});