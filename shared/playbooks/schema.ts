/**
 * Attorney Playbook Schema
 *
 * Defines the structure for case-type strategic roadmaps that walk attorneys
 * through an entire case lifecycle stage by stage.
 */

export interface Playbook {
  id: string;
  category: 'criminal' | 'immigration';
  name: string;
  tagline: string;
  overview: string;
  typicalTimeline: string;        // e.g. "3–18 months"
  difficultyLevel: 'basic' | 'intermediate' | 'advanced';
  keyConsiderations: string[];    // Upfront critical notes shown before stages
  stages: PlaybookStage[];
  jurisdictionNotes: JurisdictionNote[];
  relatedTemplateIds: string[];   // All template IDs referenced anywhere in the playbook
  tags: string[];
}

export interface PlaybookStage {
  id: string;
  name: string;
  timeline: string;               // e.g. "Day 1–3" or "At arraignment"
  description: string;
  keyActions: KeyAction[];
  relevantTemplates: TemplateRef[];
  clientGuidance?: string;
  pitfalls: string[];
  jurisdictionVariations?: StageJurisdictionNote[];
}

export interface KeyAction {
  text: string;
  priority: 'critical' | 'high' | 'standard';
  deadline?: string;
  type: 'attorney' | 'client' | 'court';
}

export interface TemplateRef {
  templateId: string;
  name: string;
  relevance: string;
}

export interface JurisdictionNote {
  topic: string;
  variations: Array<{ states: string[]; note: string }>;
}

export interface StageJurisdictionNote {
  states: string[];
  note: string;
}

export type PlaybookSummary = Pick<
  Playbook,
  'id' | 'category' | 'name' | 'tagline' | 'typicalTimeline' | 'difficultyLevel' | 'tags'
>;
