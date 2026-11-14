import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import ranking from "../scripts/data-review/output/texas-2025-arrest-priorities.json";
import crosswalk from "../scripts/data-review/output/texas-priority-crosswalk.json";
import selector from "../scripts/data-review/output/texas-priority-public-selector.json";
import packet from "../scripts/data-review/output/texas-dwi-branch-candidate.json";

const sources = new Map(Object.entries(packet.sources));
const required: Record<string, string[]> = {
  "54040009": ["PE:49.04", "PE:49.01", "PE:12.22"],
  "54040014": ["PE:49.04", "PE:49.01", "PE:12.21"],
  "54040012": ["PE:49.04", "PE:49.01", "PE:12.22"],
  "54040010": ["PE:49.04", "PE:49.01", "PE:49.09", "PE:12.21", "PE:12.34"],
};

describe("Texas first-launch arrest benchmark", () => {
  it("reconciles ranked codes and the frozen public observation against actual manifest identities", () => {
    const comparison = execFileSync("python3", ["scripts/data-review/texas-verification/compare_priority.py"], { encoding: "utf8" });
    expect(JSON.parse(comparison)).toEqual(crosswalk);
    expect(new Set(ranking.top25.map(row => row.code)).size).toBe(25);
    expect(ranking.top25.reduce((n, row) => n + row.adult, 0)).toBe(447911);
    expect(ranking.top25.map(row => row.adult)).toEqual(ranking.top25.map(row => row.adult).sort((a,b) => b-a));
    expect(selector.charges).toHaveLength(33);
    expect(crosswalk.find(row => row.code === "54040010")?.disposition).toBe("named_choice_wrong_grading_source");
    expect(crosswalk.find(row => row.code === "54040009")?.disposition).toBe("same_reference_incomplete_penalty");
    expect(selector.charges.find(row => row.id === "tx-dui-first-offense")?.maxPenalty).toBe("Penalties vary by jurisdiction");
  });

  it("binds every candidate and shared qualification to exact official text", () => {
    expect(packet.status).toBe("candidate_only_pending_review_and_integration");
    const used = new Set<string>();
    for (const [key, doc] of sources) {
      const [law, section] = key.split(":");
      expect(doc.url).toBe(`https://tcss.legis.texas.gov/resources/${law}/htm/${law}.${section.split(".")[0]}.htm#${section}`);
      expect(createHash("sha256").update(doc.text).digest("hex")).toBe(doc.textSha256);
    }
    for (const row of [...packet.branches, ...packet.sharedQualifications]) {
      for (const span of row.evidence) {
        const text = sources.get(span.source)!.text;
        expect(span.start).toBeGreaterThanOrEqual(0);
        expect(span.end).toBeLessThanOrEqual(text.length);
        expect(span.end).toBeGreaterThan(span.start);
        expect(text.slice(span.start, span.end)).toBe(span.text);
        used.add(span.source);
      }
    }
    expect([...used].sort()).toEqual([...sources.keys()].sort());
    expect(packet.branches.map(row => row.dpsCode).sort()).toEqual(Object.keys(required).sort());
    for (const row of packet.branches) {
      expect([...new Set(row.evidence.map(span => span.source))].sort()).toEqual(required[row.dpsCode].sort());
    }
    expect(packet.branches.find(row => row.dpsCode === "54040010")?.evidence.find(e => e.source === "PE:49.09")?.text).toContain("minimum term of confinement of 30 days");
    expect(packet.branches.find(row => row.dpsCode === "54040012")?.evidence.some(e => e.text.includes("minimum term of confinement of six days"))).toBe(true);
    expect(packet.branches.find(row => row.dpsCode === "54040014")?.evidence.some(e => e.text.includes("0.15 or more"))).toBe(true);
  });
});
