/**
 * @component FacilityLookupWidget
 * @description ZIP-code and state-dropdown widget for locating a detained person
 *   at a county jail or state/federal prison. Resolves ZIP to county, then links
 *   to the appropriate VINELink or DOC inmate locator for that jurisdiction.
 *   Covers all 50 states + DC + Federal (BOP).
 *
 * @standalone-use
 *   Files:    components/legal/facility-lookup-widget.tsx
 *             lib/zip-county-data.ts  (lookupZip, isStatewideUrl helpers + ZIP→county map)
 *   i18n:     first24Hours.facilityLookup.* (see locales/en.ts for all keys)
 *   Packages: react-i18next, lucide-react
 *   shadcn:   Button
 *   Backend:  None — all ZIP→county data is bundled in lib/zip-county-data.ts.
 *
 * @usage
 *   import { FacilityLookupWidget } from "@/components/legal/facility-lookup-widget";
 *   <FacilityLookupWidget />
 *
 * @data-freshness
 *   VINELink URLs are stable (vineapps.com/search/<STATE>/Person pattern).
 *   State-specific overrides in STATE_LOCATORS should be re-checked annually
 *   as some states migrate to their own DOC portals.
 */

import { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { lookupZip, isStatewideUrl } from "@/lib/zip-county-data";

export const STATE_LOCATORS: Record<string, { name: string; url: string; note?: string }> = {
  AL: { name: "Alabama", url: "https://vinelink.vineapps.com/search/AL/Person" },
  AK: { name: "Alaska", url: "https://vinelink.vineapps.com/search/AK/Person" },
  AZ: { name: "Arizona", url: "https://corrections.az.gov/public-inmate-search" },
  AR: { name: "Arkansas", url: "https://vinelink.vineapps.com/search/AR/Person" },
  CA: { name: "California", url: "https://vinelink.vineapps.com/search/CA/Person", note: "For county jails. State prison: inmatelocator.cdcr.ca.gov" },
  CO: { name: "Colorado", url: "https://www.colorado.gov/apps/offender/public/#/" },
  CT: { name: "Connecticut", url: "https://www.ctinmateinfo.state.ct.us/" },
  DE: { name: "Delaware", url: "https://vinelink.vineapps.com/search/DE/Person" },
  FL: { name: "Florida", url: "https://vinelink.vineapps.com/search/FL/Person" },
  GA: { name: "Georgia", url: "https://vinelink.vineapps.com/search/GA/Person" },
  HI: { name: "Hawaii", url: "https://vinelink.vineapps.com/search/HI/Person" },
  ID: { name: "Idaho", url: "https://vinelink.vineapps.com/search/ID/Person" },
  IL: { name: "Illinois", url: "https://vinelink.vineapps.com/search/IL/Person" },
  IN: { name: "Indiana", url: "https://vinelink.vineapps.com/search/IN/Person" },
  IA: { name: "Iowa", url: "https://vinelink.vineapps.com/search/IA/Person" },
  KS: { name: "Kansas", url: "https://vinelink.vineapps.com/search/KS/Person" },
  KY: { name: "Kentucky", url: "https://corrections.ky.gov/depts/facilityops/Pages/kool.aspx" },
  LA: { name: "Louisiana", url: "https://vinelink.vineapps.com/search/LA/Person" },
  ME: { name: "Maine", url: "https://vinelink.vineapps.com/search/ME/Person" },
  MD: { name: "Maryland", url: "https://vinelink.vineapps.com/search/MD/Person" },
  MA: { name: "Massachusetts", url: "https://vinelink.vineapps.com/search/MA/Person" },
  MI: { name: "Michigan", url: "https://mdocweb.state.mi.us/otis2/otis2.aspx" },
  MN: { name: "Minnesota", url: "https://vinelink.vineapps.com/search/MN/Person" },
  MS: { name: "Mississippi", url: "https://vinelink.vineapps.com/search/MS/Person" },
  MO: { name: "Missouri", url: "https://vinelink.vineapps.com/search/MO/Person" },
  MT: { name: "Montana", url: "https://vinelink.vineapps.com/search/MT/Person" },
  NE: { name: "Nebraska", url: "https://vinelink.vineapps.com/search/NE/Person" },
  NV: { name: "Nevada", url: "https://vinelink.vineapps.com/search/NV/Person" },
  NH: { name: "New Hampshire", url: "https://vinelink.vineapps.com/search/NH/Person" },
  NJ: { name: "New Jersey", url: "https://www.njinmateinfo.com/" },
  NM: { name: "New Mexico", url: "https://vinelink.vineapps.com/search/NM/Person" },
  NY: { name: "New York", url: "https://vinelink.vineapps.com/search/NY/Person", note: "County jails. State prison: nysdoccslookup.doccs.ny.gov" },
  NC: { name: "North Carolina", url: "https://webapps.doc.state.nc.us/opi/offendersearch.do" },
  ND: { name: "North Dakota", url: "https://vinelink.vineapps.com/search/ND/Person" },
  OH: { name: "Ohio", url: "https://appgateway.drc.ohio.gov/OffenderSearch" },
  OK: { name: "Oklahoma", url: "https://vinelink.vineapps.com/search/OK/Person" },
  OR: { name: "Oregon", url: "https://vinelink.vineapps.com/search/OR/Person" },
  PA: { name: "Pennsylvania", url: "https://vinelink.vineapps.com/search/PA/Person" },
  RI: { name: "Rhode Island", url: "https://vinelink.vineapps.com/search/RI/Person" },
  SC: { name: "South Carolina", url: "https://vinelink.vineapps.com/search/SC/Person" },
  SD: { name: "South Dakota", url: "https://vinelink.vineapps.com/search/SD/Person" },
  TN: { name: "Tennessee", url: "https://vinelink.vineapps.com/search/TN/Person" },
  TX: { name: "Texas", url: "https://vinelink.vineapps.com/search/TX/Person", note: "County jails. State prison: offender.tdcj.texas.gov" },
  UT: { name: "Utah", url: "https://vinelink.vineapps.com/search/UT/Person" },
  VT: { name: "Vermont", url: "https://vinelink.vineapps.com/search/VT/Person" },
  VA: { name: "Virginia", url: "https://vadoc.virginia.gov/offenders/locator/" },
  WA: { name: "Washington", url: "https://vinelink.vineapps.com/search/WA/Person" },
  WV: { name: "West Virginia", url: "https://vinelink.vineapps.com/search/WV/Person" },
  WI: { name: "Wisconsin", url: "https://vinelink.vineapps.com/search/WI/Person" },
  WY: { name: "Wyoming", url: "https://vinelink.vineapps.com/search/WY/Person" },
  DC: { name: "Washington D.C.", url: "https://vinelink.vineapps.com/search/DC/Person" },
  FED: { name: "Federal (BOP)", url: "https://www.bop.gov/inmateloc/", note: "Federal custody only. Search by name or register number." },
};

export function FacilityLookupWidget() {
  const { t } = useTranslation();
  const [zip, setZip] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [result, setResult] = useState<ReturnType<typeof lookupZip> | null | undefined>(undefined);

  function handleZipSearch() {
    if (zip.replace(/\D/g, "").length < 5) return;
    setResult(lookupZip(zip));
  }

  const stateLocator = selectedState ? STATE_LOCATORS[selectedState] : null;

  return (
    <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-semibold text-foreground">
          {t("first24Hours.facilityLookup.title")}
        </p>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        {t("first24Hours.facilityLookup.subtitle")}
      </p>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={zip}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 5);
            setZip(v);
            setResult(undefined);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleZipSearch()}
          placeholder={t("first24Hours.facilityLookup.zipPlaceholder")}
          aria-label={t("first24Hours.facilityLookup.zipLabel")}
          className="flex-1 text-sm rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          size="sm"
          onClick={handleZipSearch}
          disabled={zip.replace(/\D/g, "").length < 5}
          className="shrink-0"
        >
          <Phone className="w-3.5 h-3.5 mr-1.5" />
          {t("first24Hours.facilityLookup.goToLocator")}
        </Button>
      </div>

      {result !== undefined && (
        <div className="rounded-md bg-background border border-border p-3 mb-3">
          {result ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {t("first24Hours.facilityLookup.countyFound")}
                </span>{" "}
                {result.county}, {result.state}
              </p>
              <a
                href={result.inmateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                <Phone className="w-3.5 h-3.5" />
                {isStatewideUrl(result.inmateUrl)
                  ? `${result.state} ${t("first24Hours.facilityLookup.statewideLocatorSuffix")}`
                  : `${result.county} ${t("first24Hours.facilityLookup.countyLocatorSuffix")}`}
              </a>
              {result.urlNote && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">
                    {t("first24Hours.facilityLookup.urlNote")}:
                  </span>{" "}
                  {result.urlNote}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {t("first24Hours.facilityLookup.zipNotFound")}
            </p>
          )}
        </div>
      )}

      <div className="border-t border-border/60 pt-3 mt-1">
        <p className="text-xs text-muted-foreground mb-2">
          {t("first24Hours.facilityLookup.stateSelect")}
        </p>
        <div className="flex gap-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="flex-1 text-sm rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={t("first24Hours.facilityLookup.stateSelect")}
          >
            <option value="">—</option>
            {Object.entries(STATE_LOCATORS).map(([code, { name }]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          {stateLocator && (
            <a
              href={stateLocator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              {t("first24Hours.facilityLookup.stateGoButton")}
            </a>
          )}
        </div>
        {stateLocator?.note && (
          <p className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">
              {t("first24Hours.facilityLookup.urlNote")}:
            </span>{" "}
            {stateLocator.note}
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        {t("first24Hours.facilityLookup.fallbackNote")}
      </p>
    </div>
  );
}
