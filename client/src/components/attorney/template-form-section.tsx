/**
 * Template Form Section Component
 *
 * Dynamically renders form fields based on template input definitions.
 */

import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";
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
}

export function TemplateFormSection({ section }: TemplateFormSectionProps) {
  const { control } = useFormContext();

  if (section.type !== "user-input" || !section.inputs) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold">{section.name}</h3>
        {section.helpText && (
          <p className="text-sm text-muted-foreground mt-1">{section.helpText}</p>
        )}
      </div>

      <div className="space-y-4">
        {section.inputs.map((input) => (
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{input.helpText}</p>
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
}

interface JurisdictionSelectorProps {
  value: JurisdictionSelection;
  onChange: (value: JurisdictionSelection) => void;
  supportedJurisdictions: string[];
}

export function JurisdictionSelector({
  value,
  onChange,
  supportedJurisdictions,
}: JurisdictionSelectorProps) {
  // Immigration court templates — show simplified EOIR display
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

  const allDistricts = [
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
    // North Carolina
    { code: "EDNC", label: "Eastern District of North Carolina (EDNC)", rules: "EDNC local rules, 12pt font", jurisdiction: "NC" },
    { code: "MDNC", label: "Middle District of North Carolina (MDNC)", rules: "MDNC local rules, 12pt font", jurisdiction: "NC" },
    { code: "WDNC", label: "Western District of North Carolina (WDNC)", rules: "WDNC local rules, 12pt font", jurisdiction: "NC" },
    // Michigan
    { code: "EDMI", label: "Eastern District of Michigan (EDMI)", rules: "EDMI local rules, 12pt font", jurisdiction: "MI" },
    { code: "WDMI", label: "Western District of Michigan (WDMI)", rules: "WDMI local rules, 12pt font", jurisdiction: "MI" },
    // New Jersey
    { code: "DNJ", label: "District of New Jersey (DNJ)", rules: "DNJ local rules, 12pt font", jurisdiction: "NJ" },
    // Virginia
    { code: "EDVA", label: "Eastern District of Virginia (EDVA)", rules: "EDVA local rules, 12pt font", jurisdiction: "VA" },
    { code: "WDVA", label: "Western District of Virginia (WDVA)", rules: "WDVA local rules, 12pt font", jurisdiction: "VA" },
    // Washington
    { code: "EDWA", label: "Eastern District of Washington (EDWA)", rules: "EDWA local rules, 12pt font", jurisdiction: "WA" },
    { code: "WDWA", label: "Western District of Washington (WDWA)", rules: "WDWA local rules, 12pt font", jurisdiction: "WA" },
    // Arizona
    { code: "DAZ", label: "District of Arizona (DAZ)", rules: "DAZ local rules, 12pt font", jurisdiction: "AZ" },
    // Massachusetts
    { code: "DMA", label: "District of Massachusetts (DMA)", rules: "DMA local rules, 12pt font", jurisdiction: "MA" },
    // Tennessee
    { code: "EDTN", label: "Eastern District of Tennessee (EDTN)", rules: "EDTN local rules, 12pt font", jurisdiction: "TN" },
    { code: "MDTN", label: "Middle District of Tennessee (MDTN)", rules: "MDTN local rules, 12pt font", jurisdiction: "TN" },
    { code: "WDTN", label: "Western District of Tennessee (WDTN)", rules: "WDTN local rules, 12pt font", jurisdiction: "TN" },
    // Indiana
    { code: "NDIN", label: "Northern District of Indiana (NDIN)", rules: "NDIN local rules, 12pt font", jurisdiction: "IN" },
    { code: "SDIN", label: "Southern District of Indiana (SDIN)", rules: "SDIN local rules, 12pt font", jurisdiction: "IN" },
    // Maryland
    { code: "DMD", label: "District of Maryland (DMD)", rules: "DMD local rules, 12pt font", jurisdiction: "MD" },
  ];

  const availableDistricts = allDistricts.filter(
    (d) => supportedJurisdictions.includes(d.code) && d.jurisdiction === value.jurisdiction
  );

  const hasFederalSupport = allDistricts.some(
    (d) => supportedJurisdictions.includes(d.code) && d.jurisdiction === value.jurisdiction
  );

  const jurisdictions = [
    { value: "CA", label: "California", description: "Uses CA Penal Code citations" },
    { value: "NY", label: "New York", description: "Uses NY Criminal Procedure Law citations" },
    { value: "TX", label: "Texas", description: "Uses TX Code of Criminal Procedure citations" },
    { value: "FL", label: "Florida", description: "Uses FL Rules of Criminal Procedure citations" },
    { value: "PA", label: "Pennsylvania", description: "Uses PA Rules of Criminal Procedure citations" },
    { value: "IL", label: "Illinois", description: "Uses Illinois Compiled Statutes citations" },
    { value: "OH", label: "Ohio", description: "Uses Ohio Revised Code citations" },
    { value: "GA", label: "Georgia", description: "Uses Official Code of Georgia citations" },
    { value: "NC", label: "North Carolina", description: "Uses NC General Statutes citations" },
    { value: "MI", label: "Michigan", description: "Uses Michigan Court Rules citations" },
    { value: "NJ", label: "New Jersey", description: "Uses NJ Court Rules citations" },
    { value: "VA", label: "Virginia", description: "Uses Virginia Code citations" },
    { value: "WA", label: "Washington", description: "Uses Washington Court Rules citations" },
    { value: "AZ", label: "Arizona", description: "Uses Arizona Revised Statutes citations" },
    { value: "MA", label: "Massachusetts", description: "Uses MA General Laws citations" },
    { value: "TN", label: "Tennessee", description: "Uses Tennessee Code Annotated citations" },
    { value: "IN", label: "Indiana", description: "Uses Indiana Code citations" },
    { value: "MD", label: "Maryland", description: "Uses Maryland Code citations" },
    { value: "generic", label: "Other / Generic", description: "Standard legal language" },
  ];

  // Filter to only show supported jurisdictions plus generic
  const availableJurisdictions = jurisdictions.filter(
    (j) => j.value === "generic" || supportedJurisdictions.includes(j.value)
  );

  const handleJurisdictionSelect = (jurisdictionValue: string) => {
    if (jurisdictionValue === "generic") {
      onChange({ jurisdiction: jurisdictionValue });
    } else {
      onChange({ jurisdiction: jurisdictionValue, courtType: value.courtType || "state" });
    }
  };

  const handleCourtTypeChange = (courtType: "state" | "federal") => {
    if (courtType === "federal") {
      const defaultDistrict = availableDistricts[0]?.code || "CACD";
      onChange({ jurisdiction: value.jurisdiction, courtType, district: defaultDistrict });
    } else {
      onChange({ jurisdiction: value.jurisdiction, courtType });
    }
  };

  return (
    <div className="space-y-3">
      {availableJurisdictions.map((jurisdiction) => (
        <div
          key={jurisdiction.value}
          onClick={() => handleJurisdictionSelect(jurisdiction.value)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            value.jurisdiction === jurisdiction.value
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                value.jurisdiction === jurisdiction.value
                  ? "border-blue-500 bg-blue-500"
                  : "border-slate-300"
              }`}
            >
              {value.jurisdiction === jurisdiction.value && (
                <div className="w-full h-full rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{jurisdiction.label}</p>
              <p className="text-sm text-muted-foreground">{jurisdiction.description}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Court type selector — shown when jurisdiction has federal district support */}
      {value.jurisdiction !== "generic" && hasFederalSupport && (
        <div className="ml-7 mt-2 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Court Type</p>
          <div className="flex gap-3">
            {[
              { type: "state" as const, label: "State Court", desc:
                value.jurisdiction === "NY" ? "NY Supreme Court (22 NYCRR formatting)" :
                value.jurisdiction === "TX" ? "TX District Court (14pt font)" :
                value.jurisdiction === "FL" ? "FL Circuit Court (12pt font)" :
                value.jurisdiction === "PA" ? "PA Court of Common Pleas (Pa.R.Crim.P. formatting)" :
                value.jurisdiction === "IL" ? "IL Circuit Court (Ill. S. Ct. Rules formatting)" :
                value.jurisdiction === "OH" ? "OH Court of Common Pleas (Ohio Crim.R. formatting)" :
                value.jurisdiction === "GA" ? "GA Superior Court (Uniform Superior Court Rules)" :
                value.jurisdiction === "NC" ? "NC Superior Court (NC Gen. Stat. formatting)" :
                value.jurisdiction === "MI" ? "MI Circuit Court (MCR formatting)" :
                value.jurisdiction === "NJ" ? "NJ Superior Court (NJ Ct. R. formatting)" :
                value.jurisdiction === "VA" ? "VA Circuit Court (VA Code formatting)" :
                value.jurisdiction === "WA" ? "WA Superior Court (CrR formatting)" :
                value.jurisdiction === "AZ" ? "AZ Superior Court (ARS formatting)" :
                value.jurisdiction === "MA" ? "MA Superior Court (Mass. R. Crim. P. formatting)" :
                value.jurisdiction === "TN" ? "TN Criminal Court (Tenn. R. Crim. P. formatting)" :
                value.jurisdiction === "IN" ? "IN Circuit/Superior Court (IC formatting)" :
                value.jurisdiction === "MD" ? "MD Circuit Court (Md. Rule formatting)" :
                "CA Superior Court (CRC formatting)" },
              { type: "federal" as const, label: "Federal Court", desc: "U.S. District Court (12pt font)" },
            ].map((ct) => (
              <div
                key={ct.type}
                onClick={(e) => { e.stopPropagation(); handleCourtTypeChange(ct.type); }}
                className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  (value.courtType || "state") === ct.type
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <p className="font-medium text-sm">{ct.label}</p>
                <p className="text-xs text-muted-foreground">{ct.desc}</p>
              </div>
            ))}
          </div>

          {/* District selector — shown when federal is selected */}
          {(value.courtType === "federal") && availableDistricts.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-muted-foreground mb-1">District</p>
              <div className="space-y-2">
                {availableDistricts.map((d) => (
                  <div
                    key={d.code}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange({ jurisdiction: value.jurisdiction, courtType: "federal", district: d.code });
                    }}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      value.district === d.code
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-medium text-sm">{d.label}</p>
                    <p className="text-xs text-muted-foreground">{d.rules}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
