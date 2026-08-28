import { describe, expect, it } from "vitest";
import { replaceLegacyChargeWithCanonical } from "../client/src/components/legal/qa-flow-reselection";

describe("QA flow California charge reselection", () => {
  it("persists the chosen canonical ID while preserving other selections", () => {
    expect(
      replaceLegacyChargeWithCanonical(
        ["ca-assault-in-the-second-degree", "ca-dui-first-offense", "ca-assault-in-the-second-degree"],
        "ca-assault-in-the-second-degree",
        "ca-assault-240",
      ),
    ).toEqual(["ca-dui-first-offense", "ca-assault-240"]);
  });
});