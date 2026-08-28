import { describe, expect, it } from "vitest";
import en from "../client/src/locales/en";
import es from "../client/src/locales/es";
import zh from "../client/src/locales/zh";
import {
  DATA_SOURCE_CONFIDENCE,
  DATA_SOURCE_FACTS,
  DATA_SOURCE_IDS,
  DATA_SOURCE_LINKS,
  SOURCE_EVIDENCE,
} from "../client/src/lib/data-source-inventory";
import { criminalCharges } from "../shared/criminal-charges";
import { chargeExplanations } from "../shared/charge-explanations";
import { CHARGE_EXPLANATION_JURISDICTION_OVERLAY } from "../shared/charge-explanation-jurisdiction-overlay";
import {
  COLLATERAL_CONSEQUENCE_RULES,
  DRIVERS_LICENSE_RULES,
  IMMIGRATION_CONSEQUENCE_RULES,
  SEX_OFFENDER_RULES,
} from "../shared/collateral-consequences-data";
import {
  JURISDICTION_PROCEDURE_RULES,
  PRELIMINARY_HEARING_ESTIMATE_JURISDICTIONS,
  DISCOVERY_DEADLINE_ESTIMATE_JURISDICTIONS,
} from "../shared/jurisdiction-procedure-rules";
import { legalGlossaryTerms } from "../shared/legal-glossary-data";
import { diversionPrograms } from "../shared/diversion-programs-data";
import { expungementRules } from "../shared/expungement-data";
import { stateCourtWebsites } from "../shared/state-court-websites";
import { detentionFacilities } from "../shared/data/detention-facilities";
import { consulates } from "../shared/data/consulates";
import { legalAidOrganizationsSeed } from "../server/data/legal-aid-organizations-seed";
import { stateStatuteConfigs } from "../server/data/state-statute-urls";
import { federalStatutesSeed } from "../server/data/federal-statutes-seed";

const transparency = (locale: typeof en) => locale.translation.home.dataSources.transparency;
const nySources = (locale: typeof en) => transparency(locale).nySources;

const NY_SOURCE_DISCLOSURE_SECTIONS = {
  authority: ["authorityTitle", "authorityBody"],
  failClosed: ["failClosedTitle", "failClosedBody"],
  aliasAndWithheld: ["catalogTitle", "catalogBody"],
  attorneyReview: ["reviewTitle", "reviewBody"],
  disclosureLinks: [
    "linksTitle",
    "linksIntro",
    "apiLink",
    "officialLink",
    "inventoryLink",
    "statuteLink",
    "disclaimerLink",
  ],
} as const;

const NY_SOURCE_DISCLOSURE_LOCALES = [
  ["en", en],
  ["es", es],
  ["zh", zh],
] as const;

const NY_SOURCE_DISCLOSURE_KEYS = Object.keys(nySources(en)).sort();

describe("data source inventory", () => {
  it("matches maintained dataset counts", () => {
    const unique = <T,>(values: T[]) => [...new Set(values)].length;
    expect(DATA_SOURCE_FACTS.federalStatutes).toBe(federalStatutesSeed.length);
    expect(DATA_SOURCE_FACTS.charges).toBe(criminalCharges.length);
    expect(DATA_SOURCE_FACTS.chargeTiers).toEqual({
      felony: criminalCharges.filter((charge) => charge.category === "felony").length,
      misdemeanor: criminalCharges.filter((charge) => charge.category === "misdemeanor").length,
      infraction: criminalCharges.filter((charge) => charge.category === "infraction").length,
    });
    expect(DATA_SOURCE_FACTS.chargeJurisdictions).toBe(unique(criminalCharges.map((charge) => charge.jurisdiction)));
    expect(DATA_SOURCE_FACTS.chargeExplanations).toBe(chargeExplanations.length);
    expect(DATA_SOURCE_FACTS.chargeExplanationsWithSources).toBe(chargeExplanations.filter((entry) => entry.sources?.length).length);
    expect(DATA_SOURCE_FACTS.chargeExplanationOverlays).toBe(Object.keys(CHARGE_EXPLANATION_JURISDICTION_OVERLAY).length);
    expect(DATA_SOURCE_FACTS.procedureJurisdictions).toBe(Object.keys(JURISDICTION_PROCEDURE_RULES).length);
    expect(DATA_SOURCE_FACTS.procedureHighConfidence).toBe(Object.values(JURISDICTION_PROCEDURE_RULES).filter((rule) => rule.dataConfidence === "high").length);
    expect(DATA_SOURCE_FACTS.procedureMediumConfidence).toBe(Object.values(JURISDICTION_PROCEDURE_RULES).filter((rule) => rule.dataConfidence === "medium").length);
    expect(DATA_SOURCE_FACTS.preliminaryEstimateJurisdictions).toBe(PRELIMINARY_HEARING_ESTIMATE_JURISDICTIONS.length);
    expect(DATA_SOURCE_FACTS.discoveryEstimateJurisdictions).toBe(DISCOVERY_DEADLINE_ESTIMATE_JURISDICTIONS.length);
    expect(DATA_SOURCE_FACTS.collateralJurisdictions).toBe(Object.keys(COLLATERAL_CONSEQUENCE_RULES).length);
    expect(DATA_SOURCE_FACTS.driversLicenseJurisdictions).toBe(Object.keys(DRIVERS_LICENSE_RULES).length);
    expect(DATA_SOURCE_FACTS.immigrationJurisdictions).toBe(Object.keys(IMMIGRATION_CONSEQUENCE_RULES).length);
    expect(DATA_SOURCE_FACTS.sexOffenderJurisdictions).toBe(Object.keys(SEX_OFFENDER_RULES).length);
    expect(DATA_SOURCE_FACTS.expungementJurisdictions).toBe(expungementRules.length);
    expect(DATA_SOURCE_FACTS.diversionPrograms).toBe(diversionPrograms.length);
    expect(DATA_SOURCE_FACTS.activeDiversionPrograms).toBe(diversionPrograms.filter((program) => program.isActive).length);
    expect(DATA_SOURCE_FACTS.diversionJurisdictions).toBe(unique(diversionPrograms.map((program) => program.state)));
    expect(DATA_SOURCE_FACTS.glossaryTerms).toBe(legalGlossaryTerms.length);
    expect(DATA_SOURCE_FACTS.courtServices).toBe(Object.keys(stateCourtWebsites).length);
    expect(DATA_SOURCE_FACTS.statuteLinkJurisdictions).toBe(Object.keys(stateStatuteConfigs).length);
    expect(DATA_SOURCE_FACTS.legalAidOrganizations).toBe(legalAidOrganizationsSeed.length);
    expect(DATA_SOURCE_FACTS.legalAidJurisdictions).toBe(unique(legalAidOrganizationsSeed.map((organization) => organization.state)));
    expect(DATA_SOURCE_FACTS.detentionFacilities).toBe(detentionFacilities.length);
    expect(DATA_SOURCE_FACTS.detentionStates).toBe(unique(detentionFacilities.map((facility) => facility.state)));
    expect(DATA_SOURCE_FACTS.consulates).toBe(consulates.length);
  });

  it("has one localized entry and source path for every public topic", () => {
    for (const id of DATA_SOURCE_IDS) {
      expect(DATA_SOURCE_LINKS[id]).toMatch(/^https?:\/\//);
      for (const locale of [en, es, zh]) {
        const item = transparency(locale).items[id];
        expect(item.title, `${id} title`).toBeTruthy();
        expect(item.summary, `${id} summary`).toBeTruthy();
        expect(item.freshness, `${id} freshness`).toBeTruthy();
        expect(item.limitation, `${id} limitation`).toBeTruthy();
        expect(item.evidence, `${id} evidence`).toBeTruthy();
      }
    }
  });

  it("keeps every New York source-disclosure key in EN, ES, and ZH", () => {
    for (const [localeName, locale] of NY_SOURCE_DISCLOSURE_LOCALES) {
      const disclosure = nySources(locale);
      const keys = Object.keys(disclosure).sort();

      expect(
        keys,
        `${localeName} New York source disclosure keys must match EN`,
      ).toEqual(NY_SOURCE_DISCLOSURE_KEYS);

      for (const key of NY_SOURCE_DISCLOSURE_KEYS) {
        const value = disclosure[key as keyof typeof disclosure];
        expect(
          typeof value,
          `${localeName} New York source disclosure "${key}" must be a string`,
        ).toBe("string");
        expect(
          typeof value === "string" ? value.trim() : value,
          `${localeName} New York source disclosure "${key}" must be non-empty`,
        ).not.toBe("");
      }
    }
  });

  it("keeps the required New York authority and safety concepts localized", () => {
    for (const [localeName, locale] of NY_SOURCE_DISCLOSURE_LOCALES) {
      const disclosure = nySources(locale);

      for (const [concept, keys] of Object.entries(NY_SOURCE_DISCLOSURE_SECTIONS)) {
        for (const key of keys) {
          const value = disclosure[key as keyof typeof disclosure];
          expect(
            typeof value === "string" ? value.trim() : value,
            `${localeName} New York ${concept} disclosure "${key}" is missing or empty`,
          ).not.toBe("");
        }
      }
    }
  });

  it("uses only the approved confidence vocabulary", () => {
    expect(Object.keys(DATA_SOURCE_CONFIDENCE).sort()).toEqual([...DATA_SOURCE_IDS].sort());
    expect(new Set(Object.values(DATA_SOURCE_CONFIDENCE))).toEqual(
      new Set(["primary", "secondary", "synthesized", "availability", "conditional", "mixed"]),
    );
    for (const locale of [en, es, zh]) {
      expect(Object.keys(transparency(locale).confidence)).toEqual(
        ["primary", "secondary", "synthesized", "availability", "conditional", "mixed"],
      );
    }
  });

  it("keeps named evidence and citation metadata for every topic", () => {
    for (const id of DATA_SOURCE_IDS) {
      const evidence = SOURCE_EVIDENCE[id];
      expect(evidence.sourceType, `${id} source type`).toBeTruthy();
      expect(evidence.sources.length, `${id} named sources`).toBeGreaterThan(0);
      expect(evidence.citations.length, `${id} citations`).toBeGreaterThan(0);
    }
    expect(DATA_SOURCE_IDS).toContain("statistics");
    expect(SOURCE_EVIDENCE.ai.sources.join(" ")).toContain("Claude Sonnet 4");
    expect(SOURCE_EVIDENCE.statistics.citations.join(" ")).toContain("Sourcebook");
  });
});