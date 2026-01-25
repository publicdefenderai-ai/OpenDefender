/**
 * Document Template Schema
 *
 * Defines the structure for legal document templates used in attorney document generation.
 * Templates consist of sections that can be static, user-input, or AI-generated.
 */

import { z } from "zod";

// Section types determine how content is sourced
export type TemplateSectionType = 'static' | 'user-input' | 'ai-generated';

// Input field types for user-input sections
export type TemplateInputType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'select'
  | 'number'
  | 'checkbox'
  | 'party-name'      // Special handling for party names
  | 'case-number'     // Special handling for case numbers
  | 'court-name';     // Special handling for court names

export interface TemplateInput {
  id: string;
  label: string;
  type: TemplateInputType;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    options?: { value: string; label: string }[];  // For select type
  };
  defaultValue?: string;
}

export interface TemplateSection {
  id: string;
  name: string;
  type: TemplateSectionType;
  order: number;

  // For static sections - pre-written content
  staticContent?: string;

  // For user-input sections - form fields
  inputs?: TemplateInput[];

  // For AI-generated sections - prompt template
  aiPromptTemplate?: string;
  aiInstructions?: string;

  // Common properties
  required: boolean;
  helpText?: string;
}

export interface JurisdictionVariant {
  jurisdiction: string;  // State code or 'federal'
  sections: TemplateSection[];
  formattingRules?: {
    fontFamily?: string;
    fontSize?: string;
    lineSpacing?: number;
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
  };
  courtSpecificRules?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: 'criminal' | 'immigration' | 'civil';
  description: string;

  // Version for tracking template updates
  version: string;
  lastUpdated: Date;

  // Base sections (can be overridden by jurisdiction variants)
  baseSections: TemplateSection[];

  // Jurisdiction-specific variations
  jurisdictionVariants?: JurisdictionVariant[];

  // Template metadata
  estimatedCompletionTime: string;  // e.g., "15-20 minutes"
  difficultyLevel: 'basic' | 'intermediate' | 'advanced';

  // Usage restrictions
  requiresAttorneyVerification: boolean;
  supportedJurisdictions: string[];  // Empty = all jurisdictions
}

// Zod validation schemas
export const templateInputSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['text', 'textarea', 'date', 'select', 'number', 'checkbox', 'party-name', 'case-number', 'court-name']),
  placeholder: z.string().optional(),
  required: z.boolean(),
  helpText: z.string().optional(),
  validation: z.object({
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
    options: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
  }).optional(),
  defaultValue: z.string().optional(),
});

export const templateSectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['static', 'user-input', 'ai-generated']),
  order: z.number(),
  staticContent: z.string().optional(),
  inputs: z.array(templateInputSchema).optional(),
  aiPromptTemplate: z.string().optional(),
  aiInstructions: z.string().optional(),
  required: z.boolean(),
  helpText: z.string().optional(),
});

export const documentTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['criminal', 'immigration', 'civil']),
  description: z.string(),
  version: z.string(),
  lastUpdated: z.date(),
  baseSections: z.array(templateSectionSchema),
  jurisdictionVariants: z.array(z.object({
    jurisdiction: z.string(),
    sections: z.array(templateSectionSchema),
    formattingRules: z.object({
      fontFamily: z.string().optional(),
      fontSize: z.string().optional(),
      lineSpacing: z.number().optional(),
      marginTop: z.string().optional(),
      marginBottom: z.string().optional(),
      marginLeft: z.string().optional(),
      marginRight: z.string().optional(),
    }).optional(),
    courtSpecificRules: z.string().optional(),
  })).optional(),
  estimatedCompletionTime: z.string(),
  difficultyLevel: z.enum(['basic', 'intermediate', 'advanced']),
  requiresAttorneyVerification: z.boolean(),
  supportedJurisdictions: z.array(z.string()),
});

export type TemplateInputValidated = z.infer<typeof templateInputSchema>;
export type TemplateSectionValidated = z.infer<typeof templateSectionSchema>;
export type DocumentTemplateValidated = z.infer<typeof documentTemplateSchema>;
