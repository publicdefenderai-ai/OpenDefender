// Questionnaire answers are observations, not defaults. Never treat a skipped
// or declined answer as a negative answer when building or restoring a plan.
export function answeredBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

export function isUnknownStage(value: string | null | undefined): boolean {
  return !value?.trim() || ['unsure', 'unknown'].includes(value.trim());
}
