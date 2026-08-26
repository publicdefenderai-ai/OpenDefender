import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const read = (relativePath: string) =>
  fs.readFileSync(path.join(ROOT, relativePath), "utf-8");

describe("immigration help link targets", () => {
  it("keeps every rapid-response phone and text target exact", () => {
    const rapidSource = read(
      "client/src/components/immigration/rapid-response-section.tsx",
    );
    for (const telTarget of [
      "18443631423",
      "18445003222",
      "12127142904",
      "19163820256",
      "18886244752",
      "18886005762",
      "18447243737",
      "18334684664",
      "18333724237",
    ]) {
      expect(rapidSource).toContain(`tel: "${telTarget}"`);
    }
    expect(rapidSource).toContain('tel: "877877"');
    expect(rapidSource).toContain('tel: "9233%23"');
    expect(rapidSource).toContain('href={`sms:${entry.tel}`}');
    expect(rapidSource).toContain('href={`tel:${entry.tel}`}');
  });

  it("keeps attorney, detainee, and raids resources pointed at intended help", () => {
    const rapidSource = read(
      "client/src/components/immigration/rapid-response-section.tsx",
    );
    const attorneySource = read("client/src/pages/immigration/find-attorney.tsx");
    const detainedSource = read("client/src/pages/immigration/find-detained.tsx");
    const raidsSource = read("client/src/pages/immigration/raids-toolkit.tsx");

    for (const phoneNumber of [
      'phoneNumber="213-639-3900"',
      'phoneNumber="1-844-363-1423"',
      'phoneNumber="212-549-2660"',
    ]) {
      expect(raidsSource).toContain(phoneNumber);
    }
    expect(detainedSource).toContain('href="tel:18883514024"');
    expect(detainedSource).toContain('href="tel:3126601370"');
    for (const url of [
      "https://www.americanbar.org/groups/legal_services/flh-home/flh-bar-directories-and-lawyer-finders/",
      "https://www.justice.gov/eoir/recognized-organizations-and-accredited-representatives-roster-state-and-city",
      "https://www.ailalawyer.com/",
    ]) {
      expect(attorneySource).toContain(url);
    }
    expect(attorneySource).toContain('target="_blank"');
    expect(attorneySource).toContain('rel="noopener noreferrer"');
    expect(detainedSource).toContain('href="https://locator.ice.gov/odls/"');
    expect(detainedSource).toContain('target="_blank"');
    expect(detainedSource).toContain('rel="noopener noreferrer"');
    for (const url of [
      "https://www.ilrc.org/red-cards",
      "https://www.nilc.org/issues/immigration-enforcement/",
      "https://www.aclu.org/know-your-rights/immigrants-rights",
    ]) {
      expect(raidsSource).toContain(url);
    }
    expect(raidsSource).toContain('target="_blank"');
    expect(raidsSource).toContain('rel="noopener noreferrer"');
  });
});