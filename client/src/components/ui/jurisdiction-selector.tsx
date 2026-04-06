import { useJurisdiction } from "@/hooks/use-jurisdiction";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

const US_STATES = [
  { code: "alabama", label: "Alabama" },
  { code: "alaska", label: "Alaska" },
  { code: "arizona", label: "Arizona" },
  { code: "arkansas", label: "Arkansas" },
  { code: "california", label: "California" },
  { code: "colorado", label: "Colorado" },
  { code: "connecticut", label: "Connecticut" },
  { code: "delaware", label: "Delaware" },
  { code: "florida", label: "Florida" },
  { code: "georgia", label: "Georgia" },
  { code: "hawaii", label: "Hawaii" },
  { code: "idaho", label: "Idaho" },
  { code: "illinois", label: "Illinois" },
  { code: "indiana", label: "Indiana" },
  { code: "iowa", label: "Iowa" },
  { code: "kansas", label: "Kansas" },
  { code: "kentucky", label: "Kentucky" },
  { code: "louisiana", label: "Louisiana" },
  { code: "maine", label: "Maine" },
  { code: "maryland", label: "Maryland" },
  { code: "massachusetts", label: "Massachusetts" },
  { code: "michigan", label: "Michigan" },
  { code: "minnesota", label: "Minnesota" },
  { code: "mississippi", label: "Mississippi" },
  { code: "missouri", label: "Missouri" },
  { code: "montana", label: "Montana" },
  { code: "nebraska", label: "Nebraska" },
  { code: "nevada", label: "Nevada" },
  { code: "new hampshire", label: "New Hampshire" },
  { code: "new jersey", label: "New Jersey" },
  { code: "new mexico", label: "New Mexico" },
  { code: "new york", label: "New York" },
  { code: "north carolina", label: "North Carolina" },
  { code: "north dakota", label: "North Dakota" },
  { code: "ohio", label: "Ohio" },
  { code: "oklahoma", label: "Oklahoma" },
  { code: "oregon", label: "Oregon" },
  { code: "pennsylvania", label: "Pennsylvania" },
  { code: "rhode island", label: "Rhode Island" },
  { code: "south carolina", label: "South Carolina" },
  { code: "south dakota", label: "South Dakota" },
  { code: "tennessee", label: "Tennessee" },
  { code: "texas", label: "Texas" },
  { code: "utah", label: "Utah" },
  { code: "vermont", label: "Vermont" },
  { code: "virginia", label: "Virginia" },
  { code: "washington", label: "Washington" },
  { code: "west virginia", label: "West Virginia" },
  { code: "wisconsin", label: "Wisconsin" },
  { code: "wyoming", label: "Wyoming" },
  { code: "district of columbia", label: "Washington D.C." },
];

interface JurisdictionSelectorProps {
  label?: string;
}

export function JurisdictionSelector({ label }: JurisdictionSelectorProps) {
  const { jurisdiction, setJurisdiction } = useJurisdiction();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
        <MapPin className="h-3.5 w-3.5" />
        <span>{label ?? "Filter by state (optional)"}</span>
      </div>
      <Select value={jurisdiction || "_all"} onValueChange={(v) => setJurisdiction(v === "_all" ? "" : v)}>
        <SelectTrigger className="w-full sm:w-52 h-8 text-sm">
          <SelectValue placeholder="All states" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">All states</SelectItem>
          {US_STATES.map((s) => (
            <SelectItem key={s.code} value={s.code}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
