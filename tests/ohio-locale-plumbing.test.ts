import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  OHIO_REVIEWED_BATCH,
  OHIO_REVIEWED_DEFINITIONS,
} from "../shared/ohio-reviewed-batch";
import { projectEvidenceBackedChargeBatch } from "../shared/evidence-backed-charge-batch";
import { search } from "../server/services/search-indexer";
import { toChargeSelection } from "../shared/charge-selection";
import { OHIO_REVIEWED_MIXED_CLASS_IDS } from "../shared/ohio-reviewed-categories";

describe("Ohio evidence-backed locale projection", () => {
  it("preserves the reviewed alternatives across the remaining multi-class offenses", () => {
    for (const id of OHIO_REVIEWED_MIXED_CLASS_IDS) {
      expect(OHIO_REVIEWED_BATCH.charges.find(charge => charge.id === id)?.categories, id)
        .toEqual(["felony", "misdemeanor"]);
    }
  });
  it("projects every eligible definition without changing canonical IDs or English names", () => {
    const projected = projectEvidenceBackedChargeBatch(
      OHIO_REVIEWED_DEFINITIONS.filter(row =>
        OHIO_REVIEWED_BATCH.charges.some(charge => charge.id === row.id),
      ),
    );

    for (const row of OHIO_REVIEWED_DEFINITIONS) {
      const charge = projected.charges.find(candidate => candidate.id === row.id);
      if (!charge) continue;
      expect(charge).toMatchObject({
        id: row.id,
        name: row.name,
        nameEs: row.names!.es,
        nameZh: row.names!.zh,
        description: row.text.en.plainSummary,
        descriptionEs: row.text.es.plainSummary,
        descriptionZh: row.text.zh.plainSummary,
        maxPenalty: row.text.en.degreeContext,
        maxPenaltyEs: row.text.es.degreeContext,
        maxPenaltyZh: row.text.zh.degreeContext,
      });
    }
    expect(projected.charges).toEqual(OHIO_REVIEWED_BATCH.charges);
  });

  it("keeps localized selector labels separate from canonical guidance lookup names", () => {
    const row = OHIO_REVIEWED_DEFINITIONS.find(definition =>
      OHIO_REVIEWED_BATCH.charges.some(charge => charge.id === definition.id),
    )!;
    expect(toChargeSelection({
      id: row.id,
      name: row.names!.zh,
      canonicalName: row.name,
    })).toEqual({
      id: row.id,
      name: row.name,
      displayName: row.names!.zh,
    });
  });

  it("projects only operative broad grading classes", () => {
    const assault = OHIO_REVIEWED_BATCH.charges.find(charge => charge.id === "oh-orc-2903-13-assault")!;
    const recklessCaregiver = OHIO_REVIEWED_BATCH.charges.find(
      charge => charge.id === "oh-orc-2903-16-recklessly-failing-to-provide-for-a-person-with-a-functional-impairment",
    )!;
    expect(assault.category).toBe("felony");
    expect(assault.categories).toEqual(["felony", "misdemeanor"]);
    expect(recklessCaregiver.category).toBe("felony");
    expect(recklessCaregiver.categories).toBeUndefined();
    expect(recklessCaregiver.maxPenalty).toContain("not treated as an operative outcome");
  });
});

describe("Chinese global charge search", () => {
  it("tokenizes an unspaced Chinese description fragment and finds the canonical charge", () => {
    const row = OHIO_REVIEWED_DEFINITIONS.find(definition => {
      if (!OHIO_REVIEWED_BATCH.charges.some(charge => charge.id === definition.id)) return false;
      const title = definition.names!.zh;
      return Array.from(definition.text.zh.plainSummary).some((_, index, chars) => {
        const bigram = chars.slice(index, index + 2).join("");
        return bigram.length === 2 && /\p{Script=Han}{2}/u.test(bigram) && !title.includes(bigram);
      });
    })!;
    const characters = Array.from(row.text.zh.plainSummary);
    const query = characters
      .map((_, index) => characters.slice(index, index + 2).join(""))
      .find(bigram =>
        /\p{Script=Han}{2}/u.test(bigram) && !row.names!.zh.includes(bigram),
      )!;

    const result = search({
      query,
      language: "zh",
      filters: {
        types: ["charge"],
        chargeIds: [`charge-${row.id}`],
      },
      limit: 10,
    });

    expect(result.results.map(item => item.document.id)).toContain(`charge-${row.id}`);
    expect(result.results.find(item => item.document.id === `charge-${row.id}`)?.document)
      .toMatchObject({
        title: row.name,
        titleEs: row.names!.es,
        titleZh: row.names!.zh,
      });
  });

  it("indexes verified code as a search alias", () => {
    const row = OHIO_REVIEWED_DEFINITIONS.find(definition =>
      OHIO_REVIEWED_BATCH.charges.some(charge => charge.id === definition.id),
    )!;
    const result = search({
      query: row.code,
      language: "en",
      filters: {
        types: ["charge"],
        chargeIds: [`charge-${row.id}`],
      },
      limit: 10,
    });
    expect(result.results.map(item => item.document.id)).toContain(`charge-${row.id}`);
  });
});

describe("global-search result navigation", () => {
  it("uses a real link with the canonical charge URL as its href", () => {
    const source = readFileSync("client/src/components/search/site-search.tsx", "utf8");
    expect(source).toContain("<a");
    expect(source).toContain("href={result.document.url}");
    expect(source).toContain("handleResultClick(result.document.url)");
    expect(source).toContain("bestMatches.map(renderResultCard)");
    expect(source).toContain("results.map(renderResultCard)");
    expect(source).not.toContain("<ResultCard");
    expect(source).not.toContain("globalIdx++");
    expect(source).not.toContain("<button\\n        key={result.document.id}");
  });
});