import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const browserExporters = [
  "client/src/pages/for-advocates/intake-checklist.tsx",
  "client/src/pages/for-advocates/mitigation-builder.tsx",
];

describe("DOCX export validation boundaries", () => {
  it("validates every browser DOCX export before triggering its download", () => {
    for (const file of browserExporters) {
      const source = readFileSync(file, "utf8");
      expect(source).toContain("validateDocxImageEntries");
      expect(source).not.toMatch(/triggerDownload\(await Packer\.toBlob/);
    }

    const mitigationSource = readFileSync(browserExporters[1], "utf8");
    expect(mitigationSource.match(/await validateDocxImageEntries/g)).toHaveLength(2);
  });

  it("validates the server-generated DOCX before returning it", () => {
    const source = readFileSync("server/services/attorney-docs/docx-generator.ts", "utf8");
    expect(source).toContain("await validateDocxImageEntries(buffer");
  });
});