/**
 * @component RapidResponseSection
 * @description Emergency immigration enforcement hotlines with a region selector.
 *   Displays tap-to-call numbers from verified national organizations and
 *   selected metro areas. Data is hardcoded in this file — no server call.
 *
 * @standalone-use
 *   Files:    components/immigration/rapid-response-section.tsx
 *   i18n:     immigration.rapidResponse.* (see locales/en.ts for all keys)
 *   Packages: react-i18next, @radix-ui/react-select, lucide-react
 *   shadcn:   Badge, Select (with SelectContent/SelectItem/SelectTrigger/SelectValue)
 *   CSS:      Tailwind + your project's CSS variable theme (--background, --foreground, etc.)
 *   Backend:  None — fully self-contained, no API calls.
 *
 * @data-freshness
 *   All hotline numbers were verified June 2026. Re-verify quarterly.
 *   To add a new metro area, add an entry to RAPID_REGIONS below.
 *
 * @usage
 *   import { RapidResponseSection } from "@/components/immigration/rapid-response-section";
 *   <RapidResponseSection />
 */

import { useState } from "react";
import { Phone, MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

export type HotlineEntry = {
  id: string;
  org: string;
  number: string;
  tel: string;
  what: string;
  languages: string;
  hours?: string;
  isText?: boolean;
  note?: string;
  verified: string;
};

export type RapidRegion = {
  id: string;
  label: string;
  hotlines: HotlineEntry[];
};

export const NATIONAL_HOTLINES: HotlineEntry[] = [
  {
    id: "uwd-call",
    org: "United We Dream / National Lawyers Guild",
    number: "1-844-363-1423",
    tel: "18443631423",
    what: "Report ICE raids and request legal referrals",
    languages: "EN / ES",
    verified: "June 2026",
  },
  {
    id: "uwd-text",
    org: "United We Dream",
    number: "877877",
    tel: "877877",
    what: "Text to report ICE raids",
    languages: "EN / ES",
    isText: true,
    verified: "June 2026",
  },
  {
    id: "detention",
    org: "National Detention Hotline",
    number: "9233#",
    tel: "9233%23",
    what: "If you are already inside a detention facility",
    languages: "Multilingual",
    hours: "Mon-Fri 8am-8pm PT",
    note: "Dial from inside detention. Calls are free and unmonitored.",
    verified: "June 2026",
  },
  {
    id: "nakasec",
    org: "NAKASEC",
    number: "1-844-500-3222",
    tel: "18445003222",
    what: "24-hour immigration hotline",
    languages: "EN / Korean",
    hours: "24 hours",
    verified: "June 2026",
  },
  {
    id: "immequality",
    org: "Immigration Equality",
    number: "1-212-714-2904",
    tel: "12127142904",
    what: "Legal help for LGBTQ+ immigrants",
    languages: "EN",
    hours: "Weekdays, daytime ET",
    verified: "June 2026",
  },
];

export const RAPID_REGIONS: RapidRegion[] = [
  {
    id: "sfbay",
    label: "San Francisco Bay Area / NorCal",
    hotlines: [
      {
        id: "migrawatch",
        org: "NorCal Resist — Migra Watch",
        number: "(916) 382-0256",
        tel: "19163820256",
        what: "Call or text to report ICE. Volunteers verify reports and connect you to legal help.",
        languages: "EN / ES",
        verified: "June 2026",
      },
    ],
  },
  {
    id: "losangeles",
    label: "Los Angeles Area",
    hotlines: [
      {
        id: "larrn",
        org: "LARRN / CHIRLA",
        number: "888-624-4752",
        tel: "18886244752",
        what: "Report ICE enforcement in Greater LA and request legal referrals",
        languages: "EN / ES",
        verified: "June 2026",
      },
    ],
  },
  {
    id: "florida",
    label: "Florida (statewide)",
    hotlines: [
      {
        id: "raise",
        org: "RAISE — Rapid Response Alliance for Immigrant Safety",
        number: "1-888-600-5762",
        tel: "18886005762",
        what: "Report ICE activity, access Know Your Rights materials and family preparedness resources",
        languages: "EN / ES / Haitian Creole / Portuguese",
        verified: "June 2026",
      },
    ],
  },
  {
    id: "washington",
    label: "Washington (statewide)",
    hotlines: [
      {
        id: "waisn",
        org: "WAISN — Washington Immigrant Solidarity Network",
        number: "1-844-724-3737",
        tel: "18447243737",
        what: "Deportation defense hotline — report ICE activity and get legal support",
        languages: "Multilingual",
        hours: "Mon-Fri 6am-6pm",
        verified: "June 2026",
      },
    ],
  },
  {
    id: "houston",
    label: "Houston, TX",
    hotlines: [
      {
        id: "hilsc",
        org: "HILSC Immigrant Resource Hotline",
        number: "1-833-468-4664",
        tel: "18334684664",
        what: "Policy information and referrals to legal services. Not an ICE-reporting line.",
        languages: "EN / ES",
        hours: "Mon-Fri 9am-5pm CST",
        verified: "June 2026",
      },
      {
        id: "raices",
        org: "RAICES Texas",
        number: "1-833-372-4237",
        tel: "18333724237",
        what: "Schedule a legal consultation at any Texas RAICES office",
        languages: "EN / ES",
        verified: "June 2026",
      },
    ],
  },
];

function HotlineCard({
  entry,
  t,
  prominent = false,
}: {
  entry: HotlineEntry;
  t: (key: string) => string;
  prominent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 bg-white dark:bg-gray-900/60 flex flex-col gap-2 ${
        prominent
          ? "border-red-400 dark:border-red-600 shadow-sm"
          : "border-red-200 dark:border-red-900/60"
      }`}
    >
      <p className="text-xs font-semibold text-muted-foreground leading-tight">
        {entry.org}
      </p>

      {entry.isText ? (
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-red-700 dark:text-red-400 font-medium">
            {t("immigration.rapidResponse.textTo")}
          </span>
          <a
            href={`sms:${entry.tel}`}
            className="text-2xl font-black text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors leading-none"
            aria-label={`Text ${entry.org} at ${entry.number}`}
            data-testid={`link-hotline-${entry.id}`}
          >
            {entry.number}
          </a>
        </div>
      ) : (
        <a
          href={`tel:${entry.tel}`}
          className="text-2xl font-black text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors leading-none"
          aria-label={`Call ${entry.org} at ${entry.number}`}
          data-testid={`link-hotline-${entry.id}`}
        >
          {entry.number}
        </a>
      )}

      <p className="text-xs text-foreground/80 leading-snug">{entry.what}</p>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        <Badge variant="secondary" className="text-xs py-0 h-5">
          {t("immigration.rapidResponse.languagesLabel")} {entry.languages}
        </Badge>
        {entry.hours && (
          <Badge variant="outline" className="text-xs py-0 h-5">
            {entry.hours}
          </Badge>
        )}
      </div>

      {entry.note && (
        <p className="text-xs text-muted-foreground italic leading-snug">
          {entry.note}
        </p>
      )}

      <p className="text-xs text-muted-foreground/50 mt-1">
        {t("immigration.rapidResponse.verifiedLabel")} {entry.verified}
      </p>
    </div>
  );
}

export function RapidResponseSection() {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState("national");

  const region = RAPID_REGIONS.find((r) => r.id === selectedRegion);
  const localHotlines = region?.hotlines ?? [];

  return (
    <section
      id="rapid-response"
      className="py-10 bg-red-50 dark:bg-red-950/20 border-y border-red-200 dark:border-red-900/40"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-900 dark:text-red-200 leading-tight">
              {t("immigration.rapidResponse.title")}
            </h2>
            <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">
              {t("immigration.rapidResponse.subtitle")}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1.5 block">
            {t("immigration.rapidResponse.selectorLabel")}
          </label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full max-w-sm bg-white dark:bg-red-950/40 border-red-300 dark:border-red-800 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">National (all areas)</SelectItem>
              {RAPID_REGIONS.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {localHotlines.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-3">
              <MapPin className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              <span className="text-xs font-semibold text-red-800 dark:text-red-300 uppercase tracking-wide">
                {region?.label}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              {localHotlines.map((h) => (
                <HotlineCard key={h.id} entry={h} t={t} prominent />
              ))}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 border-t border-red-200 dark:border-red-900/50" />
              <span className="text-xs text-red-600 dark:text-red-400 whitespace-nowrap">
                {t("immigration.rapidResponse.nationalAlwaysTitle")}
              </span>
              <div className="flex-1 border-t border-red-200 dark:border-red-900/50" />
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NATIONAL_HOTLINES.map((h) => (
            <HotlineCard key={h.id} entry={h} t={t} />
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
          <p className="text-xs text-red-600/80 dark:text-red-400/80">
            {t("immigration.rapidResponse.lastVerifiedNote")}
          </p>
          <a
            href="https://nnirr.org/education-resources/community-resources-legal-assistance-recursos-comunitarios-asistencia-legal/immigration-hotlines-lineas-directas-de-inmigracion/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-red-700 dark:text-red-300 hover:underline flex items-center gap-1 flex-shrink-0"
            data-testid="link-hotline-directory"
          >
            {t("immigration.rapidResponse.fullDirectoryLink")}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
