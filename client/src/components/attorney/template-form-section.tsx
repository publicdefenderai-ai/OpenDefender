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

interface JurisdictionSelectorProps {
  value: string;
  onChange: (value: string) => void;
  supportedJurisdictions: string[];
}

export function JurisdictionSelector({
  value,
  onChange,
  supportedJurisdictions,
}: JurisdictionSelectorProps) {
  const jurisdictions = [
    { value: "CA", label: "California", description: "Uses CA Penal Code citations" },
    { value: "generic", label: "Other / Generic", description: "Standard legal language" },
  ];

  // Filter to only show supported jurisdictions plus generic
  const availableJurisdictions = jurisdictions.filter(
    (j) => j.value === "generic" || supportedJurisdictions.includes(j.value)
  );

  return (
    <div className="space-y-3">
      {availableJurisdictions.map((jurisdiction) => (
        <div
          key={jurisdiction.value}
          onClick={() => onChange(jurisdiction.value)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            value === jurisdiction.value
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                value === jurisdiction.value
                  ? "border-blue-500 bg-blue-500"
                  : "border-slate-300"
              }`}
            >
              {value === jurisdiction.value && (
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
    </div>
  );
}
