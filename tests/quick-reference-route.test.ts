import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const read = (relativePath: string) =>
  fs.readFileSync(path.join(ROOT, relativePath), "utf-8");

describe("Quick Reference route", () => {
  it("keeps the legacy URL redirecting to the canonical rights experience", () => {
    const appSource = read("client/src/App.tsx");
    const headerSource = read("client/src/components/layout/header.tsx");
    const getStartedSource = read("client/src/components/navigation/get-started-menu.tsx");
    expect(appSource).toContain(
      'const QuickReference = lazy(() => import("@/pages/quick-reference"));',
    );
    expect(appSource).toContain(
      '<Route path="/quick-reference-cards" component={QuickReference} />',
    );
    expect(appSource).toContain(
      '<Route path="/quick-reference"><Redirect to="/rights-info" /></Route>',
    );
    expect(headerSource).toContain(
      'href: "/rights-info#quick-reference-cards", icon: FileText',
    );
    expect(headerSource).toContain('testId: "menu-quick-reference"');
    expect(getStartedSource).toContain(
      "handleNavigate('/rights-info#quick-reference-cards')",
    );
  });

  it("keeps the print action and printable card section on the canonical destination", () => {
    const pageSource = read("client/src/pages/quick-reference.tsx");
    const stylesSource = read("client/src/index.css");
    expect(pageSource).toContain('data-testid="button-print-all-cards"');
    expect(pageSource).toContain('data-testid="section-quick-reference-cards"');
    expect(pageSource).toContain('value={activeTab} onValueChange={setActiveTab}');
    expect(pageSource).toContain('setActiveTab("all")');
    expect(pageSource).toContain('className="hidden print:block"');
    expect(pageSource).toContain('id="print-all-cards"');
    expect(pageSource).toContain('data-testid="print-all-cards"');
    expect(pageSource).toContain('cardTestId="printable-card"');
    expect(pageSource).toContain("window.print()");
    expect(stylesSource).toContain("header, footer, nav, .print\\:hidden");
    expect(stylesSource).toContain(".quick-ref-card");
    expect(stylesSource).toContain("break-inside: avoid");
  });

  it("links the canonical rights page to the printable cards", () => {
    const rightsSource = read("client/src/pages/rights-info.tsx");
    expect(rightsSource).toContain('id="quick-reference-cards"');
    expect(rightsSource).toContain('href="/quick-reference-cards"');
    expect(rightsSource).toContain('data-testid="button-open-printable-rights-cards"');
    expect(rightsSource).toContain("rights.printableCards");
  });
});