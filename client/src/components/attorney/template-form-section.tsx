/**
 * Template Form Section Component
 *
 * Dynamically renders form fields based on template input definitions.
 */

import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";
import {
  CA_COUNTIES, NY_COUNTIES, TX_COUNTIES, FL_COUNTIES, PA_COUNTIES,
  IL_COUNTIES, OH_COUNTIES, GA_COUNTIES, NC_COUNTIES, MI_COUNTIES,
  NJ_COUNTIES, VA_COUNTIES, WA_COUNTIES, AZ_COUNTIES, MA_COUNTIES,
  TN_COUNTIES, IN_COUNTIES, MD_COUNTIES, MO_COUNTIES, WI_COUNTIES,
  CO_COUNTIES, MN_COUNTIES, SC_COUNTIES, AL_COUNTIES, LA_PARISHES,
  KY_COUNTIES, OR_COUNTIES, OK_COUNTIES, CT_COUNTIES, UT_COUNTIES,
  IA_COUNTIES, NV_COUNTIES, AR_COUNTIES, MS_COUNTIES, KS_COUNTIES,
  NM_COUNTIES, NE_COUNTIES, ID_COUNTIES,
  AK_BOROUGHS, DE_COUNTIES, HI_COUNTIES, ME_COUNTIES, MT_COUNTIES,
  NH_COUNTIES, ND_COUNTIES, RI_COUNTIES, SD_COUNTIES, VT_COUNTIES,
  WV_COUNTIES, WY_COUNTIES, DC_WARDS,
} from "@shared/templates/county-data";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TemplateInput, TemplateSection } from "@shared/templates/schema";

interface TemplateFormSectionProps {
  section: TemplateSection;
  jurisdictionContext?: JurisdictionSelection;
}

export function TemplateFormSection({ section, jurisdictionContext }: TemplateFormSectionProps) {
  const { control } = useFormContext();

  if (section.type !== "user-input" || !section.inputs) {
    return null;
  }

  const inputs = section.inputs.map((input) => {
    if (!jurisdictionContext || jurisdictionContext.courtType !== "federal") return input;
    if (input.id === "courtName") {
      const districtLabel = jurisdictionContext.district
        ? ALL_DISTRICTS.find((d: typeof ALL_DISTRICTS[0]) => d.code === jurisdictionContext.district)?.label?.replace(/\s*\([^)]*\)$/, "") || "Central District of California"
        : "Central District of California";
      return {
        ...input,
        placeholder: `e.g., United States District Court, ${districtLabel}`,
      };
    }
    if (input.id === "caseNumber") {
      return {
        ...input,
        placeholder: "e.g., 2:24-cr-00123-ABC",
      };
    }
    return input;
  });

  return (
    <div className="space-y-6">
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold">{section.name}</h3>
        {section.helpText && (
          <p className="text-sm text-muted-foreground mt-1">{section.helpText}</p>
        )}
      </div>

      <div className="space-y-4">
        {inputs.map((input) => (
          <TemplateInputField key={input.id} input={input} />
        ))}
      </div>
    </div>
  );
}

interface TemplateInputFieldProps {
  input: TemplateInput;
}

function TemplateInputField({ input }: TemplateInputFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={input.id}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            {input.label}
            {input.required && <span className="text-red-500">*</span>}
            {input.helpText && (
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex items-center justify-center rounded-full hover:bg-muted/50 p-0.5 focus:outline-none focus:ring-1 focus:ring-ring" aria-label={`Help: ${input.label}`}>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{input.helpText}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </FormLabel>
          <FormControl>
            {renderInputControl(input, field)}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function renderInputControl(input: TemplateInput, field: any) {
  switch (input.type) {
    case "text":
    case "party-name":
    case "case-number":
    case "court-name":
      return (
        <Input
          {...field}
          placeholder={input.placeholder}
          maxLength={input.validation?.maxLength}
        />
      );

    case "a-number":
      return (
        <Input
          {...field}
          placeholder={input.placeholder || "XXX-XXX-XXX"}
          maxLength={11}
        />
      );

    case "textarea":
      return (
        <Textarea
          {...field}
          placeholder={input.placeholder}
          maxLength={input.validation?.maxLength}
          rows={4}
          className="resize-none"
        />
      );

    case "date":
      return (
        <Input
          {...field}
          type="date"
          placeholder={input.placeholder}
          className="[&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:dark:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
      );

    case "number":
      return (
        <Input
          {...field}
          type="number"
          placeholder={input.placeholder}
        />
      );

    case "select":
      return (
        <Select
          value={field.value || ""}
          onValueChange={field.onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={input.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {input.validation?.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={field.value === "true"}
            onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
          />
          {input.placeholder && (
            <span className="text-sm text-muted-foreground">{input.placeholder}</span>
          )}
        </div>
      );

    default:
      return (
        <Input
          {...field}
          placeholder={input.placeholder}
        />
      );
  }
}

export interface JurisdictionSelection {
  jurisdiction: string;
  courtType?: "state" | "federal" | "immigration";
  district?: string;
  county?: string;
  countyOther?: string;
  division?: string;
}

interface JurisdictionSelectorProps {
  value: JurisdictionSelection;
  onChange: (value: JurisdictionSelection) => void;
  supportedJurisdictions: string[];
}

const COUNTY_MAP: Record<string, { value: string; label: string }[]> = {
  CA: CA_COUNTIES, NY: NY_COUNTIES, TX: TX_COUNTIES, FL: FL_COUNTIES,
  PA: PA_COUNTIES, IL: IL_COUNTIES, OH: OH_COUNTIES, GA: GA_COUNTIES,
  NC: NC_COUNTIES, MI: MI_COUNTIES, NJ: NJ_COUNTIES, VA: VA_COUNTIES,
  WA: WA_COUNTIES, AZ: AZ_COUNTIES, MA: MA_COUNTIES, TN: TN_COUNTIES,
  IN: IN_COUNTIES, MD: MD_COUNTIES, MO: MO_COUNTIES, WI: WI_COUNTIES,
  CO: CO_COUNTIES, MN: MN_COUNTIES, SC: SC_COUNTIES, AL: AL_COUNTIES,
  LA: LA_PARISHES, KY: KY_COUNTIES, OR: OR_COUNTIES, OK: OK_COUNTIES,
  CT: CT_COUNTIES, UT: UT_COUNTIES, IA: IA_COUNTIES, NV: NV_COUNTIES,
  AR: AR_COUNTIES, MS: MS_COUNTIES, KS: KS_COUNTIES, NM: NM_COUNTIES,
  NE: NE_COUNTIES, ID: ID_COUNTIES,
  AK: AK_BOROUGHS, DE: DE_COUNTIES, HI: HI_COUNTIES, ME: ME_COUNTIES,
  MT: MT_COUNTIES, NH: NH_COUNTIES, ND: ND_COUNTIES, RI: RI_COUNTIES,
  SD: SD_COUNTIES, VT: VT_COUNTIES, WV: WV_COUNTIES, WY: WY_COUNTIES,
  DC: DC_WARDS,
};

const DISTRICT_DIVISIONS: Record<string, { value: string; label: string }[]> = {
  CACD: [
    { value: "Western", label: "Western Division (Los Angeles)" },
    { value: "Eastern", label: "Eastern Division (Riverside)" },
    { value: "Southern", label: "Southern Division (Santa Ana)" },
  ],
  NDCA: [
    { value: "San Francisco", label: "San Francisco Division" },
    { value: "San Jose", label: "San Jose Division" },
    { value: "Oakland", label: "Oakland Division" },
    { value: "Eureka", label: "Eureka Division" },
  ],
  SDCA: [
    { value: "San Diego", label: "San Diego Division" },
    { value: "El Centro", label: "El Centro Division" },
  ],
  EDCA: [
    { value: "Sacramento", label: "Sacramento Division" },
    { value: "Fresno", label: "Fresno Division" },
  ],
  SDNY: [
    { value: "Manhattan", label: "Manhattan (Foley Square)" },
    { value: "White Plains", label: "White Plains Division" },
  ],
  EDNY: [
    { value: "Brooklyn", label: "Brooklyn Division" },
    { value: "Central Islip", label: "Central Islip Division" },
  ],
  TXND: [
    { value: "Dallas", label: "Dallas Division" },
    { value: "Fort Worth", label: "Fort Worth Division" },
    { value: "Lubbock", label: "Lubbock Division" },
    { value: "Amarillo", label: "Amarillo Division" },
    { value: "Abilene", label: "Abilene Division" },
    { value: "San Angelo", label: "San Angelo Division" },
    { value: "Wichita Falls", label: "Wichita Falls Division" },
  ],
  TXSD: [
    { value: "Houston", label: "Houston Division" },
    { value: "Galveston", label: "Galveston Division" },
    { value: "Brownsville", label: "Brownsville Division" },
    { value: "Victoria", label: "Victoria Division" },
    { value: "Laredo", label: "Laredo Division" },
    { value: "Corpus Christi", label: "Corpus Christi Division" },
    { value: "McAllen", label: "McAllen Division" },
  ],
  TXED: [
    { value: "Tyler", label: "Tyler Division" },
    { value: "Beaumont", label: "Beaumont Division" },
    { value: "Sherman", label: "Sherman Division" },
    { value: "Texarkana", label: "Texarkana Division" },
    { value: "Marshall", label: "Marshall Division" },
    { value: "Lufkin", label: "Lufkin Division" },
  ],
  TXWD: [
    { value: "San Antonio", label: "San Antonio Division" },
    { value: "Austin", label: "Austin Division" },
    { value: "El Paso", label: "El Paso Division" },
    { value: "Waco", label: "Waco Division" },
    { value: "Del Rio", label: "Del Rio Division" },
    { value: "Midland-Odessa", label: "Midland-Odessa Division" },
    { value: "Pecos", label: "Pecos Division" },
  ],
  FLSD: [
    { value: "Miami", label: "Miami Division" },
    { value: "Fort Lauderdale", label: "Fort Lauderdale Division" },
    { value: "West Palm Beach", label: "West Palm Beach Division" },
    { value: "Fort Pierce", label: "Fort Pierce Division" },
    { value: "Key West", label: "Key West Division" },
  ],
  FLMD: [
    { value: "Tampa", label: "Tampa Division" },
    { value: "Orlando", label: "Orlando Division" },
    { value: "Jacksonville", label: "Jacksonville Division" },
    { value: "Ocala", label: "Ocala Division" },
    { value: "Fort Myers", label: "Fort Myers Division" },
  ],
  FLND: [
    { value: "Tallahassee", label: "Tallahassee Division" },
    { value: "Pensacola", label: "Pensacola Division" },
    { value: "Gainesville", label: "Gainesville Division" },
    { value: "Panama City", label: "Panama City Division" },
  ],
  PAED: [
    { value: "Philadelphia", label: "Philadelphia Division" },
    { value: "Allentown", label: "Allentown Division" },
  ],
  ILND: [
    { value: "Eastern", label: "Eastern Division (Chicago)" },
    { value: "Western", label: "Western Division (Rockford)" },
  ],
  OHND: [
    { value: "Cleveland", label: "Cleveland Division (Eastern)" },
    { value: "Akron", label: "Akron Division" },
    { value: "Toledo", label: "Toledo Division (Western)" },
    { value: "Youngstown", label: "Youngstown Division" },
  ],
  OHSD: [
    { value: "Cincinnati", label: "Cincinnati Division (Western)" },
    { value: "Columbus", label: "Columbus Division (Eastern)" },
    { value: "Dayton", label: "Dayton Division" },
  ],
  GAND: [
    { value: "Atlanta", label: "Atlanta Division" },
    { value: "Newnan", label: "Newnan Division" },
    { value: "Gainesville", label: "Gainesville Division" },
    { value: "Rome", label: "Rome Division" },
  ],
  EDMI: [
    { value: "Detroit", label: "Detroit Division (Southern)" },
    { value: "Flint", label: "Flint Division (Northern)" },
    { value: "Ann Arbor", label: "Ann Arbor Division" },
    { value: "Bay City", label: "Bay City Division" },
  ],
};

const ALL_DISTRICTS = [
  { code: "CACD", label: "Central District of California (CACD)", rules: "L.R. 11-3 formatting, 14pt font", jurisdiction: "CA" },
  { code: "NDCA", label: "Northern District of California (NDCA)", rules: "N.D. Cal. rules, 14pt font", jurisdiction: "CA" },
  { code: "EDCA", label: "Eastern District of California (EDCA)", rules: "E.D. Cal. rules, 12pt font", jurisdiction: "CA" },
  { code: "SDCA", label: "Southern District of California (SDCA)", rules: "S.D. Cal. rules, 14pt font", jurisdiction: "CA" },
  { code: "SDNY", label: "Southern District of New York (SDNY)", rules: "Local Civil Rule 11.1, 12pt font", jurisdiction: "NY" },
  { code: "EDNY", label: "Eastern District of New York (EDNY)", rules: "Local Civil Rule 11.1, 12pt font", jurisdiction: "NY" },
  { code: "NDNY", label: "Northern District of New York (NDNY)", rules: "Local Rule 10.1, 12pt font", jurisdiction: "NY" },
  { code: "WDNY", label: "Western District of New York (WDNY)", rules: "Local Rule 10(a), 12pt font", jurisdiction: "NY" },
  { code: "TXND", label: "Northern District of Texas (TXND)", rules: "TXND local rules, 12pt font", jurisdiction: "TX" },
  { code: "TXSD", label: "Southern District of Texas (TXSD)", rules: "TXSD local rules, 12pt font", jurisdiction: "TX" },
  { code: "TXED", label: "Eastern District of Texas (TXED)", rules: "TXED local rules, 12pt font", jurisdiction: "TX" },
  { code: "TXWD", label: "Western District of Texas (TXWD)", rules: "TXWD local rules, 12pt font", jurisdiction: "TX" },
  { code: "FLSD", label: "Southern District of Florida (FLSD)", rules: "FLSD local rules, 12pt font", jurisdiction: "FL" },
  { code: "FLMD", label: "Middle District of Florida (FLMD)", rules: "FLMD local rules, 12pt font", jurisdiction: "FL" },
  { code: "FLND", label: "Northern District of Florida (FLND)", rules: "FLND local rules, 12pt font", jurisdiction: "FL" },
  { code: "PAED", label: "Eastern District of Pennsylvania (PAED)", rules: "PAED local rules, 12pt font", jurisdiction: "PA" },
  { code: "PAMD", label: "Middle District of Pennsylvania (PAMD)", rules: "PAMD local rules, 12pt font", jurisdiction: "PA" },
  { code: "PAWD", label: "Western District of Pennsylvania (PAWD)", rules: "PAWD local rules, 12pt font", jurisdiction: "PA" },
  { code: "ILND", label: "Northern District of Illinois (ILND)", rules: "ILND local rules, 12pt font", jurisdiction: "IL" },
  { code: "ILCD", label: "Central District of Illinois (ILCD)", rules: "ILCD local rules, 12pt font", jurisdiction: "IL" },
  { code: "ILSD", label: "Southern District of Illinois (ILSD)", rules: "ILSD local rules, 12pt font", jurisdiction: "IL" },
  { code: "OHND", label: "Northern District of Ohio (OHND)", rules: "OHND local rules, 12pt font", jurisdiction: "OH" },
  { code: "OHSD", label: "Southern District of Ohio (OHSD)", rules: "OHSD local rules, 12pt font", jurisdiction: "OH" },
  { code: "GAND", label: "Northern District of Georgia (GAND)", rules: "GAND local rules, 12pt font", jurisdiction: "GA" },
  { code: "GAMD", label: "Middle District of Georgia (GAMD)", rules: "GAMD local rules, 12pt font", jurisdiction: "GA" },
  { code: "GASD", label: "Southern District of Georgia (GASD)", rules: "GASD local rules, 12pt font", jurisdiction: "GA" },
  { code: "EDNC", label: "Eastern District of North Carolina (EDNC)", rules: "EDNC local rules, 12pt font", jurisdiction: "NC" },
  { code: "MDNC", label: "Middle District of North Carolina (MDNC)", rules: "MDNC local rules, 12pt font", jurisdiction: "NC" },
  { code: "WDNC", label: "Western District of North Carolina (WDNC)", rules: "WDNC local rules, 12pt font", jurisdiction: "NC" },
  { code: "EDMI", label: "Eastern District of Michigan (EDMI)", rules: "EDMI local rules, 12pt font", jurisdiction: "MI" },
  { code: "WDMI", label: "Western District of Michigan (WDMI)", rules: "WDMI local rules, 12pt font", jurisdiction: "MI" },
  { code: "DNJ", label: "District of New Jersey (DNJ)", rules: "DNJ local rules, 12pt font", jurisdiction: "NJ" },
  { code: "EDVA", label: "Eastern District of Virginia (EDVA)", rules: "EDVA local rules, 12pt font", jurisdiction: "VA" },
  { code: "WDVA", label: "Western District of Virginia (WDVA)", rules: "WDVA local rules, 12pt font", jurisdiction: "VA" },
  { code: "EDWA", label: "Eastern District of Washington (EDWA)", rules: "EDWA local rules, 12pt font", jurisdiction: "WA" },
  { code: "WDWA", label: "Western District of Washington (WDWA)", rules: "WDWA local rules, 12pt font", jurisdiction: "WA" },
  { code: "DAZ", label: "District of Arizona (DAZ)", rules: "DAZ local rules, 12pt font", jurisdiction: "AZ" },
  { code: "DMA", label: "District of Massachusetts (DMA)", rules: "DMA local rules, 12pt font", jurisdiction: "MA" },
  { code: "EDTN", label: "Eastern District of Tennessee (EDTN)", rules: "EDTN local rules, 12pt font", jurisdiction: "TN" },
  { code: "MDTN", label: "Middle District of Tennessee (MDTN)", rules: "MDTN local rules, 12pt font", jurisdiction: "TN" },
  { code: "WDTN", label: "Western District of Tennessee (WDTN)", rules: "WDTN local rules, 12pt font", jurisdiction: "TN" },
  { code: "NDIN", label: "Northern District of Indiana (NDIN)", rules: "NDIN local rules, 12pt font", jurisdiction: "IN" },
  { code: "SDIN", label: "Southern District of Indiana (SDIN)", rules: "SDIN local rules, 12pt font", jurisdiction: "IN" },
  { code: "DMD", label: "District of Maryland (DMD)", rules: "DMD local rules, 12pt font", jurisdiction: "MD" },
  // Missouri
  { code: "EDMO", label: "Eastern District of Missouri (EDMO)", rules: "EDMO local rules, 12pt font", jurisdiction: "MO" },
  { code: "WDMO", label: "Western District of Missouri (WDMO)", rules: "WDMO local rules, 12pt font", jurisdiction: "MO" },
  // Wisconsin
  { code: "EDWI", label: "Eastern District of Wisconsin (EDWI)", rules: "EDWI local rules, 12pt font", jurisdiction: "WI" },
  { code: "WDWI", label: "Western District of Wisconsin (WDWI)", rules: "WDWI local rules, 12pt font", jurisdiction: "WI" },
  // Colorado
  { code: "DCO", label: "District of Colorado (DCO)", rules: "DCO local rules, 12pt font", jurisdiction: "CO" },
  // Minnesota
  { code: "DMN", label: "District of Minnesota (DMN)", rules: "DMN local rules, 12pt font", jurisdiction: "MN" },
  // South Carolina
  { code: "DSC", label: "District of South Carolina (DSC)", rules: "DSC local rules, 12pt font", jurisdiction: "SC" },
  // Alabama
  { code: "NDAL", label: "Northern District of Alabama (NDAL)", rules: "NDAL local rules, 12pt font", jurisdiction: "AL" },
  { code: "MDAL", label: "Middle District of Alabama (MDAL)", rules: "MDAL local rules, 12pt font", jurisdiction: "AL" },
  { code: "SDAL", label: "Southern District of Alabama (SDAL)", rules: "SDAL local rules, 12pt font", jurisdiction: "AL" },
  // Louisiana
  { code: "EDLA", label: "Eastern District of Louisiana (EDLA)", rules: "EDLA local rules, 12pt font", jurisdiction: "LA" },
  { code: "MDLA", label: "Middle District of Louisiana (MDLA)", rules: "MDLA local rules, 12pt font", jurisdiction: "LA" },
  { code: "WDLA", label: "Western District of Louisiana (WDLA)", rules: "WDLA local rules, 12pt font", jurisdiction: "LA" },
  // Kentucky
  { code: "EDKY", label: "Eastern District of Kentucky (EDKY)", rules: "EDKY local rules, 12pt font", jurisdiction: "KY" },
  { code: "WDKY", label: "Western District of Kentucky (WDKY)", rules: "WDKY local rules, 12pt font", jurisdiction: "KY" },
  // Oregon
  { code: "DOR", label: "District of Oregon (DOR)", rules: "DOR local rules, 12pt font", jurisdiction: "OR" },
  // Oklahoma
  { code: "NDOK", label: "Northern District of Oklahoma (NDOK)", rules: "NDOK local rules, 12pt font", jurisdiction: "OK" },
  { code: "EDOK", label: "Eastern District of Oklahoma (EDOK)", rules: "EDOK local rules, 12pt font", jurisdiction: "OK" },
  { code: "WDOK", label: "Western District of Oklahoma (WDOK)", rules: "WDOK local rules, 12pt font", jurisdiction: "OK" },
  // Connecticut
  { code: "DCT", label: "District of Connecticut (DCT)", rules: "DCT local rules, 12pt font", jurisdiction: "CT" },
  // Utah
  { code: "DUT", label: "District of Utah (DUT)", rules: "DUT local rules, 12pt font", jurisdiction: "UT" },
  // Iowa
  { code: "NDIA", label: "Northern District of Iowa (NDIA)", rules: "NDIA local rules, 12pt font", jurisdiction: "IA" },
  { code: "SDIA", label: "Southern District of Iowa (SDIA)", rules: "SDIA local rules, 12pt font", jurisdiction: "IA" },
  // Nevada
  { code: "DNV", label: "District of Nevada (DNV)", rules: "DNV local rules, 12pt font", jurisdiction: "NV" },
  // Arkansas
  { code: "EDAR", label: "Eastern District of Arkansas (EDAR)", rules: "EDAR local rules, 12pt font", jurisdiction: "AR" },
  { code: "WDAR", label: "Western District of Arkansas (WDAR)", rules: "WDAR local rules, 12pt font", jurisdiction: "AR" },
  // Mississippi
  { code: "NDMS", label: "Northern District of Mississippi (NDMS)", rules: "NDMS local rules, 12pt font", jurisdiction: "MS" },
  { code: "SDMS", label: "Southern District of Mississippi (SDMS)", rules: "SDMS local rules, 12pt font", jurisdiction: "MS" },
  // Kansas
  { code: "DKS", label: "District of Kansas (DKS)", rules: "DKS local rules, 12pt font", jurisdiction: "KS" },
  // New Mexico
  { code: "DNM", label: "District of New Mexico (DNM)", rules: "DNM local rules, 12pt font", jurisdiction: "NM" },
  // Nebraska
  { code: "DNE", label: "District of Nebraska (DNE)", rules: "DNE local rules, 12pt font", jurisdiction: "NE" },
  // Idaho
  { code: "DID", label: "District of Idaho (DID)", rules: "DID local rules, 12pt font", jurisdiction: "ID" },
  // Alaska
  { code: "DAK", label: "District of Alaska (DAK)", rules: "DAK local rules, 12pt font", jurisdiction: "AK" },
  // Delaware
  { code: "DDE", label: "District of Delaware (DDE)", rules: "DDE local rules, 12pt font", jurisdiction: "DE" },
  // Hawaii
  { code: "DHI", label: "District of Hawaii (DHI)", rules: "DHI local rules, 12pt font", jurisdiction: "HI" },
  // Maine
  { code: "DME", label: "District of Maine (DME)", rules: "DME local rules, 12pt font", jurisdiction: "ME" },
  // Montana
  { code: "DMT", label: "District of Montana (DMT)", rules: "DMT local rules, 12pt font", jurisdiction: "MT" },
  // New Hampshire
  { code: "DNH", label: "District of New Hampshire (DNH)", rules: "DNH local rules, 12pt font", jurisdiction: "NH" },
  // North Dakota
  { code: "DND", label: "District of North Dakota (DND)", rules: "DND local rules, 12pt font", jurisdiction: "ND" },
  // Rhode Island
  { code: "DRI", label: "District of Rhode Island (DRI)", rules: "DRI local rules, 12pt font", jurisdiction: "RI" },
  // South Dakota
  { code: "DSD", label: "District of South Dakota (DSD)", rules: "DSD local rules, 12pt font", jurisdiction: "SD" },
  // Vermont
  { code: "DVT", label: "District of Vermont (DVT)", rules: "DVT local rules, 12pt font", jurisdiction: "VT" },
  // West Virginia
  { code: "NDWV", label: "Northern District of West Virginia (NDWV)", rules: "NDWV local rules, 12pt font", jurisdiction: "WV" },
  { code: "SDWV", label: "Southern District of West Virginia (SDWV)", rules: "SDWV local rules, 12pt font", jurisdiction: "WV" },
  // Wyoming
  { code: "DWY", label: "District of Wyoming (DWY)", rules: "DWY local rules, 12pt font", jurisdiction: "WY" },
  // District of Columbia
  { code: "DDC", label: "U.S. District Court for the District of Columbia (DDC)", rules: "DDC local rules, 12pt font", jurisdiction: "DC" },
];

export function JurisdictionSelector({
  value,
  onChange,
  supportedJurisdictions,
}: JurisdictionSelectorProps) {
  const isImmigrationTemplate = supportedJurisdictions.includes("EOIR");

  if (isImmigrationTemplate) {
    return (
      <div className="space-y-3">
        <div
          className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500">
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <p className="font-medium">Immigration Court (EOIR)</p>
              <p className="text-sm text-muted-foreground">
                Nationally uniform EOIR format (12pt TNR, ICPM rules)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableDistricts = ALL_DISTRICTS.filter(
    (d) => supportedJurisdictions.includes(d.code) && d.jurisdiction === value.jurisdiction
  );

  const hasFederalSupport = ALL_DISTRICTS.some(
    (d) => supportedJurisdictions.includes(d.code) && d.jurisdiction === value.jurisdiction
  );

  const jurisdictions = [
    { value: "AL", label: "Alabama", description: "Uses Alabama Code citations" },
    { value: "AK", label: "Alaska", description: "Uses Alaska Statutes citations" },
    { value: "AZ", label: "Arizona", description: "Uses Arizona Revised Statutes citations" },
    { value: "AR", label: "Arkansas", description: "Uses Arkansas Code Annotated citations" },
    { value: "CA", label: "California", description: "Uses CA Penal Code citations" },
    { value: "CO", label: "Colorado", description: "Uses Colorado Revised Statutes citations" },
    { value: "CT", label: "Connecticut", description: "Uses Connecticut General Statutes citations" },
    { value: "DE", label: "Delaware", description: "Uses Delaware Code citations" },
    { value: "DC", label: "District of Columbia", description: "Uses D.C. Code citations" },
    { value: "FL", label: "Florida", description: "Uses FL Rules of Criminal Procedure citations" },
    { value: "GA", label: "Georgia", description: "Uses Official Code of Georgia citations" },
    { value: "HI", label: "Hawaii", description: "Uses Hawaii Revised Statutes citations" },
    { value: "ID", label: "Idaho", description: "Uses Idaho Code citations" },
    { value: "IL", label: "Illinois", description: "Uses Illinois Compiled Statutes citations" },
    { value: "IN", label: "Indiana", description: "Uses Indiana Code citations" },
    { value: "IA", label: "Iowa", description: "Uses Iowa Code citations" },
    { value: "KS", label: "Kansas", description: "Uses Kansas Statutes Annotated citations" },
    { value: "KY", label: "Kentucky", description: "Uses Kentucky Revised Statutes citations" },
    { value: "LA", label: "Louisiana", description: "Uses Louisiana Code of Criminal Procedure citations" },
    { value: "ME", label: "Maine", description: "Uses Maine Revised Statutes citations" },
    { value: "MD", label: "Maryland", description: "Uses Maryland Code citations" },
    { value: "MA", label: "Massachusetts", description: "Uses MA General Laws citations" },
    { value: "MI", label: "Michigan", description: "Uses Michigan Court Rules citations" },
    { value: "MN", label: "Minnesota", description: "Uses Minnesota Statutes citations" },
    { value: "MS", label: "Mississippi", description: "Uses Mississippi Code Annotated citations" },
    { value: "MO", label: "Missouri", description: "Uses Missouri Revised Statutes citations" },
    { value: "MT", label: "Montana", description: "Uses Montana Code Annotated citations" },
    { value: "NE", label: "Nebraska", description: "Uses Nebraska Revised Statutes citations" },
    { value: "NV", label: "Nevada", description: "Uses Nevada Revised Statutes citations" },
    { value: "NH", label: "New Hampshire", description: "Uses New Hampshire Revised Statutes citations" },
    { value: "NJ", label: "New Jersey", description: "Uses NJ Court Rules citations" },
    { value: "NM", label: "New Mexico", description: "Uses New Mexico Statutes Annotated citations" },
    { value: "NY", label: "New York", description: "Uses NY Criminal Procedure Law citations" },
    { value: "NC", label: "North Carolina", description: "Uses NC General Statutes citations" },
    { value: "ND", label: "North Dakota", description: "Uses North Dakota Century Code citations" },
    { value: "OH", label: "Ohio", description: "Uses Ohio Revised Code citations" },
    { value: "OK", label: "Oklahoma", description: "Uses Oklahoma Statutes citations" },
    { value: "OR", label: "Oregon", description: "Uses Oregon Revised Statutes citations" },
    { value: "PA", label: "Pennsylvania", description: "Uses PA Rules of Criminal Procedure citations" },
    { value: "RI", label: "Rhode Island", description: "Uses Rhode Island General Laws citations" },
    { value: "SC", label: "South Carolina", description: "Uses SC Code Annotated citations" },
    { value: "SD", label: "South Dakota", description: "Uses South Dakota Codified Laws citations" },
    { value: "TN", label: "Tennessee", description: "Uses Tennessee Code Annotated citations" },
    { value: "TX", label: "Texas", description: "Uses TX Code of Criminal Procedure citations" },
    { value: "UT", label: "Utah", description: "Uses Utah Code Annotated citations" },
    { value: "VT", label: "Vermont", description: "Uses Vermont Statutes Annotated citations" },
    { value: "VA", label: "Virginia", description: "Uses Virginia Code citations" },
    { value: "WA", label: "Washington", description: "Uses Washington Court Rules citations" },
    { value: "WV", label: "West Virginia", description: "Uses West Virginia Code citations" },
    { value: "WI", label: "Wisconsin", description: "Uses Wisconsin Statutes citations" },
    { value: "WY", label: "Wyoming", description: "Uses Wyoming Statutes citations" },
    { value: "generic", label: "Other / Generic", description: "Standard legal language" },
  ];

  const availableJurisdictions = jurisdictions.filter(
    (j) => j.value === "generic" || supportedJurisdictions.includes(j.value)
  );

  const countyList = value.jurisdiction ? COUNTY_MAP[value.jurisdiction] || [] : [];

  const selectedDistrictDivisions = value.district ? DISTRICT_DIVISIONS[value.district] || [] : [];

  const handleJurisdictionSelect = (jurisdictionValue: string) => {
    if (jurisdictionValue === "generic") {
      onChange({ jurisdiction: jurisdictionValue });
    } else {
      onChange({ jurisdiction: jurisdictionValue, courtType: value.courtType || "state" });
    }
  };

  const handleCourtTypeChange = (courtType: "state" | "federal") => {
    if (courtType === "federal") {
      const defaultDistrict = availableDistricts[0]?.code;
      onChange({ jurisdiction: value.jurisdiction, courtType, district: defaultDistrict });
    } else {
      onChange({ jurisdiction: value.jurisdiction, courtType });
    }
  };

  const selectedJurisdiction = availableJurisdictions.find((j) => j.value === value.jurisdiction);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1.5 block">Jurisdiction</label>
        <Select
          value={value.jurisdiction || ""}
          onValueChange={(val) => handleJurisdictionSelect(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a jurisdiction..." />
          </SelectTrigger>
          <SelectContent>
            {availableJurisdictions.map((jurisdiction) => (
              <SelectItem key={jurisdiction.value} value={jurisdiction.value}>
                {jurisdiction.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedJurisdiction && (
          <p className="text-sm text-muted-foreground mt-1.5">{selectedJurisdiction.description}</p>
        )}
      </div>

      {value.jurisdiction && value.jurisdiction !== "generic" && (
        <div className="space-y-4">
          {hasFederalSupport && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">Court Type</label>
              <div className="flex gap-3">
                {[
                  { type: "state" as const, label: "State Court" },
                  { type: "federal" as const, label: "Federal Court" },
                ].map((ct) => (
                  <div
                    key={ct.type}
                    onClick={() => handleCourtTypeChange(ct.type)}
                    className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-colors text-center ${
                      (value.courtType || "state") === ct.type
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-medium text-sm">{ct.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!value.courtType || value.courtType === "state") && countyList.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium mb-1.5 block">County</label>
              <Select
                value={value.county || ""}
                onValueChange={(val) => {
                  onChange({ ...value, county: val, countyOther: undefined });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a county..." />
                </SelectTrigger>
                <SelectContent>
                  {countyList.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {value.county === "other" && (
                <Input
                  placeholder="Enter county name"
                  value={value.countyOther || ""}
                  onChange={(e) => onChange({ ...value, countyOther: e.target.value })}
                />
              )}
            </div>
          )}

          {value.courtType === "federal" && availableDistricts.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">Federal District</label>
              <Select
                value={value.district || ""}
                onValueChange={(val) => {
                  onChange({ ...value, courtType: "federal", district: val, division: undefined });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a federal district..." />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((d) => (
                    <SelectItem key={d.code} value={d.code}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {value.district && (
                <p className="text-sm text-muted-foreground mt-1.5">
                  {availableDistricts.find((d) => d.code === value.district)?.rules}
                </p>
              )}
            </div>
          )}

          {value.courtType === "federal" && value.district && selectedDistrictDivisions.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">Division</label>
              <Select
                value={value.division || ""}
                onValueChange={(val) => {
                  onChange({ ...value, division: val });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a division..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedDistrictDivisions.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
