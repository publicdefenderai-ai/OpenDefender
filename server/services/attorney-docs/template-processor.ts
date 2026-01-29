/**
 * Template Processor Service
 *
 * Handles variable interpolation, validation, and jurisdiction variant merging
 * for document templates.
 */

import type { DocumentTemplate, TemplateSection, TemplateInput } from "../../../shared/templates/schema";

// ============================================================================
// Variable Interpolation
// ============================================================================

/**
 * Replace {{variable}} placeholders with actual values from data
 */
export function processTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key];
    return value !== undefined ? value : match;
  });
}

/**
 * Extract all variable names from a template string
 */
export function extractVariables(template: string): string[] {
  const matches = template.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];

  const uniqueVars = new Set(matches.map((m) => m.slice(2, -2)));
  return Array.from(uniqueVars);
}

// ============================================================================
// Form Data Validation
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate form data against template input definitions
 */
export function validateFormData(
  template: DocumentTemplate,
  formData: Record<string, string>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Collect all inputs from all user-input sections
  const allInputs: TemplateInput[] = [];
  for (const section of template.baseSections) {
    if (section.type === "user-input" && section.inputs) {
      allInputs.push(...section.inputs);
    }
  }

  // Validate each input
  for (const input of allInputs) {
    const value = formData[input.id];

    // Check required fields
    if (input.required) {
      if (value === undefined || value === null || value.trim() === "") {
        errors.push(`${input.label} is required`);
        continue;
      }
    }

    // Skip validation for empty optional fields
    if (!value || value.trim() === "") {
      continue;
    }

    // Validate based on type
    switch (input.type) {
      case "date":
        if (!isValidDate(value)) {
          errors.push(`${input.label} must be a valid date`);
        }
        break;

      case "number":
        if (isNaN(Number(value))) {
          errors.push(`${input.label} must be a number`);
        }
        break;

      case "select":
        if (input.validation?.options) {
          const validValues = input.validation.options.map((o) => o.value);
          if (!validValues.includes(value)) {
            errors.push(`${input.label} must be one of the available options`);
          }
        }
        break;
    }

    // Validate length constraints
    if (input.validation?.minLength && value.length < input.validation.minLength) {
      errors.push(
        `${input.label} must be at least ${input.validation.minLength} characters`
      );
    }

    if (input.validation?.maxLength && value.length > input.validation.maxLength) {
      errors.push(
        `${input.label} must be no more than ${input.validation.maxLength} characters`
      );
    }

    // Validate pattern if provided
    if (input.validation?.pattern) {
      try {
        const regex = new RegExp(input.validation.pattern);
        if (!regex.test(value)) {
          errors.push(`${input.label} has an invalid format`);
        }
      } catch {
        // Invalid regex pattern in template - this is a template bug
        warnings.push(`Invalid validation pattern for ${input.label}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if a string is a valid date
 */
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// ============================================================================
// Jurisdiction Variants
// ============================================================================

/**
 * Apply jurisdiction-specific variant to a template
 * Returns a new template with the variant's sections merged in
 *
 * When courtType/district are provided, matches on all specified fields.
 * When omitted, falls back to jurisdiction-only matching (backward compat).
 */
export function applyJurisdictionVariant(
  template: DocumentTemplate,
  jurisdiction: string,
  courtType?: string,
  district?: string
): DocumentTemplate {
  // Find matching variant — most specific match first
  const variant = template.jurisdictionVariants?.find((v) => {
    if (v.jurisdiction.toUpperCase() !== jurisdiction.toUpperCase()) return false;
    if (courtType && v.courtType && v.courtType !== courtType) return false;
    if (district && v.district && v.district.toUpperCase() !== district.toUpperCase()) return false;
    // If caller specified courtType/district, prefer variants that have them
    if (courtType && !v.courtType) return false;
    if (district && !v.district) return false;
    return true;
  }) || template.jurisdictionVariants?.find(
    // Fallback: match on jurisdiction alone if no courtType-specific variant found
    (v) => v.jurisdiction.toUpperCase() === jurisdiction.toUpperCase() && !courtType
  );

  if (!variant) {
    // No variant found, return base template
    return template;
  }

  // Create new template with variant sections replacing base sections
  const sectionMap = new Map<string, TemplateSection>();

  // Start with base sections
  for (const section of template.baseSections) {
    sectionMap.set(section.id, section);
  }

  // Override with variant sections
  for (const section of variant.sections) {
    sectionMap.set(section.id, section);
  }

  // Sort by order and convert back to array
  const mergedSections = Array.from(sectionMap.values()).sort(
    (a, b) => a.order - b.order
  );

  return {
    ...template,
    baseSections: mergedSections,
  };
}

// ============================================================================
// Content Formatting
// ============================================================================

/**
 * Format a hearing type value into readable text
 */
export function formatHearingType(value: string): string {
  const hearingTypes: Record<string, string> = {
    arraignment: "Arraignment",
    preliminary: "Preliminary Hearing",
    pretrial: "Pre-Trial Conference",
    motions: "Motion Hearing",
    trial: "Trial",
    sentencing: "Sentencing",
    probation: "Probation Violation Hearing",
    other: "Hearing",
  };

  return hearingTypes[value] || value;
}

/**
 * Format a reason value into readable text
 */
export function formatPrimaryReason(value: string): string {
  const reasons: Record<string, string> = {
    attorney_unavailable: "attorney unavailability due to scheduling conflict",
    witness_unavailable: "witness unavailability",
    investigation_incomplete: "ongoing investigation",
    discovery_pending: "discovery not yet received or reviewed",
    expert_needed: "need to retain or consult with expert witnesses",
    plea_negotiations: "ongoing plea negotiations",
    new_counsel: "recently retained or appointed counsel",
    medical_emergency: "medical emergency or health issue",
    family_emergency: "family emergency",
    conflict_of_interest: "recently discovered conflict of interest",
    additional_preparation: "need for additional preparation time",
    other: "good cause",
  };

  return reasons[value] || value;
}

/**
 * Format date for display in documents
 */
export function formatDocumentDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

// ============================================================================
// Section Processing Helpers
// ============================================================================

/**
 * Get all required input IDs for a template
 */
export function getRequiredInputIds(template: DocumentTemplate): string[] {
  const requiredIds: string[] = [];

  for (const section of template.baseSections) {
    if (section.type === "user-input" && section.inputs) {
      for (const input of section.inputs) {
        if (input.required) {
          requiredIds.push(input.id);
        }
      }
    }
  }

  return requiredIds;
}

/**
 * Get all inputs grouped by section
 */
export function getInputsBySection(
  template: DocumentTemplate
): Map<string, TemplateInput[]> {
  const inputsBySection = new Map<string, TemplateInput[]>();

  for (const section of template.baseSections) {
    if (section.type === "user-input" && section.inputs) {
      inputsBySection.set(section.id, section.inputs);
    }
  }

  return inputsBySection;
}

/**
 * Check if all required fields are filled
 */
export function hasRequiredFields(
  template: DocumentTemplate,
  formData: Record<string, string>
): boolean {
  const requiredIds = getRequiredInputIds(template);

  for (const id of requiredIds) {
    const value = formData[id];
    if (!value || value.trim() === "") {
      return false;
    }
  }

  return true;
}
