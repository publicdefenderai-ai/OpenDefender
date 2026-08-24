import { describe, expect, it } from "vitest";
import { getIntentDestinations } from "../client/src/components/navigation/intent-navigation";
import { buildSearchIndex, search } from "../server/services/search-indexer";

const translate = ((_key: string, fallback: string) => fallback) as any;

describe("intent navigation", () => {
  it("defines one canonical destination for every required user intent", () => {
    const destinations = getIntentDestinations(translate);

    expect(destinations.map(({ id, href }) => ({ id, href }))).toEqual([
      { id: "urgent", href: "/first-24-hours" },
      { id: "roadmap", href: "/case-guidance" },
      { id: "charges", href: "/case-guidance#understand-charges" },
      { id: "legalHelp", href: "/legal-aid" },
      { id: "stage", href: "/case-timeline" },
      { id: "sources", href: "/data-sources" },
    ]);
  });
});

describe("trusted-source search", () => {
  it.each([
    ["en", "sources"],
    ["en", "accuracy"],
    ["en", "methodology"],
    ["en", "where does data come from"],
    ["en", "how reliable"],
    ["en", "where does this come from"],
    ["en", "how accurate"],
    ["es", "fuentes de datos"],
    ["zh", "数据来源"],
  ] as const)("finds Data Sources in %s", (language, query) => {
    buildSearchIndex();
    const response = search({ query, language, limit: 20 });
    const urls = response.results.map((result) => result.document.url);

    expect(urls).toContain("/data-sources");
  });

  it("indexes the page title and key section headings", () => {
    buildSearchIndex();
    const response = search({ query: "confidence labels", language: "en", limit: 20 });
    const result = response.results.find((entry) => entry.document.url === "/data-sources");

    expect(result?.document.title).toBe("Data Sources and Methodology");
    expect(result?.document.headings).toEqual(expect.arrayContaining([
      "Methodology & coverage summary",
      "Jurisdiction Procedure Rules",
      "Criminal Charges Database",
      "AI Guidance",
    ]));
  });
});