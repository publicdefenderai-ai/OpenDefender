/**
 * @component DiversionProgramCard
 * @description Renders a single pre-trial diversion or alternative sentencing program.
 *   Shows location, program types, eligibility notes, and contact information
 *   (phone, email, website) with appropriate icons.
 *
 * @standalone-use
 *   Files:    components/legal/diversion-program-card.tsx
 *             lib/diversion-programs-data.ts  (data source — 111 programs, all 50 states + DC + Federal)
 *   i18n:     diversionPrograms.programCard.* (see locales/en.ts for all keys)
 *   Packages: react-i18next, lucide-react
 *   shadcn:   Card (CardContent/CardHeader/CardTitle), Badge
 *   Backend:  None — data is in lib/diversion-programs-data.ts (no API call).
 *
 * @usage
 *   import { DiversionProgramCard } from "@/components/legal/diversion-program-card";
 *   import { diversionPrograms } from "@/lib/diversion-programs-data";
 *   <DiversionProgramCard program={diversionPrograms[0]} />
 *
 * @data-schema
 *   program.name            string
 *   program.state           string  (2-letter code)
 *   program.county?         string
 *   program.cities?         string[]
 *   program.jurisdictionType string
 *   program.programTypes    string[]
 *   program.eligibilityNotes? string
 *   program.contact?        { phone?, email?, url? }
 */

import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export interface DiversionProgramCardProps {
  program: {
    name: string;
    state: string;
    county?: string;
    cities?: string[];
    jurisdictionType: string;
    programTypes: string[];
    eligibilityNotes?: string;
    contact?: {
      phone?: string;
      email?: string;
      url?: string;
    };
  };
}

export function DiversionProgramCard({ program }: DiversionProgramCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="hover:shadow-lg transition-all duration-300 h-full">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{program.name}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {program.county
                  ? `${program.county} ${t("diversionPrograms.programCard.county")}`
                  : program.state}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {program.jurisdictionType}
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">
                {t("diversionPrograms.programCard.location")}
              </div>
              <div className="text-sm font-medium">
                {program.cities
                  ? program.cities.slice(0, 3).join(", ")
                  : program.county
                    ? `${program.county} ${t("diversionPrograms.programCard.county")}`
                    : program.state}
                {program.cities && program.cities.length > 3 &&
                  ` ${t("diversionPrograms.programCard.moreLocations", { count: program.cities.length - 3 })}`}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">
              {t("diversionPrograms.programCard.programTypes")}
            </div>
            <div className="flex flex-wrap gap-1">
              {program.programTypes.map((type: string) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {program.eligibilityNotes && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                {t("diversionPrograms.programCard.eligibility")}
              </div>
              <p className="text-sm text-foreground">{program.eligibilityNotes}</p>
            </div>
          )}

          {program.contact && (
            <div className="space-y-2 pt-2 border-t">
              <div className="text-sm text-muted-foreground mb-2">
                {t("diversionPrograms.programCard.contactInformation")}
              </div>

              {program.contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <a
                    href={`tel:${program.contact.phone}`}
                    className="text-sm hover:text-blue-600 transition-colors"
                  >
                    {program.contact.phone}
                  </a>
                </div>
              )}

              {program.contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <a
                    href={`mailto:${program.contact.email}`}
                    className="text-sm hover:text-blue-600 transition-colors"
                  >
                    {program.contact.email}
                  </a>
                </div>
              )}

              {program.contact.url && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  <a
                    href={program.contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-blue-600 transition-colors"
                  >
                    {t("diversionPrograms.programCard.visitWebsite")}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
