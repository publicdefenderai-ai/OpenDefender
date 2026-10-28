import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { buildCloseoutInventory, validateCloseoutInventory, renderCloseoutInventory } from "../scripts/data-review/california-verification/closeout-inventory";
import { getChargeById } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";

const read = () => JSON.parse(fs.readFileSync("scripts/data-review/output/california-closeout-inventory.json", "utf8"));

describe("California closeout accounting", () => {
  it("preserves each bounded family inventory without claiming statewide completeness", () => {
    const packet = read();
    expect(validateCloseoutInventory(packet).comparisonEntries).toBe(576);
    expect(Object.fromEntries(Object.entries(packet.counts.byFamily).map(([key, value]: [string, any]) => [key, value.entries])))
      .toEqual({ "people-weapons": 207, "homicide-gangs": 91, "justice-property": 202, drugs: 46, "driving-vessels": 30 });
    expect(packet.baseline).toMatchObject({ configuredChoices: 662, liveAvailability: "not_measured", statewideCompleteness: "not_claimed" });
    expect(packet.withheldCanonicalLabels).toHaveLength(21);
    expect(packet.otherCodeProbes.filter((row: any) => row.status === "unpublished_priority")).toHaveLength(7);
  });

  it("uses successor matches without erasing prior findings or reviving older missing-charge states", () => {
    const packet = read();
    const find = (family: string, id: string) => packet.comparisons.find((row: any) => row.family === family && row.instructionId === id);
    expect(find("homicide-gangs", "1400").chargeIds).toEqual(["ca-pen-186-22-a"]);
    expect(find("people-weapons", "926").chargeIds).toEqual(["ca-pen-243-b", "ca-pen-243-c-1"]);
    expect(find("justice-property", "1800").status).toBe("bounded_conduct_summary_published_other_issues_open");
    expect(find("justice-property", "2953").chargeIds).toContain("ca-pen-597-a");
    expect(packet.recordedResolutions[0]).toMatchObject({ findingId: "felony-false-imprisonment-fine", status: "published_decision_recorded_do_not_reopen" });
    expect(packet.successorPublications.find((row: any) => row.findingId === "elder-financial-branches").records).toHaveLength(4);
    expect(packet.historicalFindings.find((row: any) => row.id === "access-card-multiple-person-branch").occurrences.length).toBeGreaterThan(1);
  });

  it("retains consequential holds and keeps minor deferrals separate", () => {
    const packet = read();
    expect(packet.comparisons.find((row: any) => row.family === "people-weapons" && row.instructionId === "2513").status).toBe("existing_hold_preserved");
    expect(packet.otherCodeProbes.find((row: any) => row.key === "HSC:11395").status).toBe("existing_hold_preserved");
    const minor = packet.historicalFindings.find((row: any) => row.id === "vehicle-boarding-and-manipulation");
    expect(minor.occurrences.at(-1).status).toBe("documented_minor_misdemeanor_deferral");
    expect(packet.nextWork.find((row: any) => row.id === "other-code").scope).toContain("unknown severity is not a minor omission");
  });

  it("rejects missing comparisons, changed bindings and silently cleared findings", () => {
    for (const mutate of [
      (p: any) => p.comparisons.pop(),
      (p: any) => p.historicalFindings.pop(),
      (p: any) => { p.recordedResolutions = []; },
      (p: any) => { p.bindings[Object.keys(p.bindings)[0]] = "bad"; },
    ]) {
      const packet = read(); mutate(packet);
      expect(() => validateCloseoutInventory(packet)).toThrow("drift");
    }
  });

  it("projects neutral fields only, excluding source questions and deliberative prose", () => {
    const forbidden = new Set(["question", "treatment", "rationale", "nextStep", "reason", "decisions", "text", "excerpt"]);
    const walk = (value: any) => {
      if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) {
        expect(forbidden.has(key), key).toBe(false); walk(child);
      }
    };
    walk(read());
    expect(renderCloseoutInventory()).not.toMatch(/[—–]/);
    const first = buildCloseoutInventory(); first.comparisons[0].chargeIds.push("mutated");
    expect(buildCloseoutInventory().comparisons[0].chargeIds).not.toContain("mutated");
  });
});

describe("Representative configured charging-paper identities", () => {
  const cases = [
    ["ca-pen-186-22-a", "PC 186.22(a)"],
    ["ca-pen-243-c-1", "PC 243(c)(1)"],
    ["ca-attempted-voluntary-manslaughter", "PC 664/192(a)"],
    ["ca-hsc-11377-a", "H&S 11377"],
    ["ca-veh-2800-2", "VC 2800.2"],
  ];
  it.each(cases)("keeps %s discoverable and preserves ID-based explanation lookup", (id, citation) => {
    const charge = getChargeById(id);
    expect(charge, id).toBeDefined();
    expect(charge!.searchAliases?.some(alias => alias.toLowerCase().includes(citation.toLowerCase()))).toBe(true);
    const explanation = getChargeExplanation(charge!.name, "CA", "en", id);
    expect(explanation?.plainSummary).toBeTruthy();
  });
});
