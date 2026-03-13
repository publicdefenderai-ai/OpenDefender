// Rule-based safety scanner for AI-generated legal guidance
// Runs server-side after Claude response is parsed, before returning to client.
// No second API call — pure regex pattern matching.
import { opsLog } from '../utils/dev-logger';

export interface DangerScanResult {
  dangerFlags: string[];
  hasDangerContent: boolean;
}

const DANGER_PATTERNS: Array<{ category: string; pattern: RegExp }> = [
  {
    category: 'evidence_destruction',
    pattern: /(delete|destroy|get rid of|dispose of).{0,40}(message|text|email|evidence|record|photo|video)/i,
  },
  {
    category: 'flight',
    pattern: /\b(leave|flee|disappear|get out of).{0,30}(town|state|country|jurisdiction|the area)/i,
  },
  {
    category: 'witness_coaching',
    pattern: /(tell (them|him|her|your).{0,20}to say|coordinate.{0,20}(stor|version)|get.{0,15}story straight)/i,
  },
  {
    category: 'legal_overreach',
    pattern: /\b(you (should|must) plead|take the deal|you will (win|lose)|they can't convict)/i,
  },
];

const REPLACEMENT_ITEM =
  'Some specific recommendations have been withheld. Please consult a licensed attorney in your jurisdiction for guidance on this aspect of your case.';

/**
 * Scans serialized guidance JSON text for danger patterns.
 * Logs category + caseId server-side but never logs matched text (privacy).
 */
export function scanGuidanceForDangerContent(
  guidanceText: string,
  caseId?: string
): DangerScanResult {
  const dangerFlags: string[] = [];

  for (const { category, pattern } of DANGER_PATTERNS) {
    if (pattern.test(guidanceText)) {
      dangerFlags.push(category);
      opsLog('safety-scan', 'Danger content detected in guidance', {
        category,
        caseId: caseId ?? 'unknown',
      });
    }
  }

  return {
    dangerFlags,
    hasDangerContent: dangerFlags.length > 0,
  };
}

/**
 * Checks whether a single string item matches any of the danger patterns.
 */
function itemMatchesDanger(text: string): boolean {
  return DANGER_PATTERNS.some(({ pattern }) => pattern.test(text));
}

/**
 * Strips flagged items from immediateActions and avoidActions arrays,
 * injecting the standard replacement notice once if anything was removed.
 */
export function stripDangerousItems(
  immediateActions: Array<{ action: string; urgency: string }>,
  avoidActions: string[]
): {
  immediateActions: Array<{ action: string; urgency: string }>;
  avoidActions: string[];
  strippedCount: number;
} {
  let strippedCount = 0;

  const cleanActions = immediateActions.filter((item) => {
    if (itemMatchesDanger(item.action)) {
      strippedCount++;
      return false;
    }
    return true;
  });

  const cleanAvoid = avoidActions.filter((item) => {
    if (itemMatchesDanger(item)) {
      strippedCount++;
      return false;
    }
    return true;
  });

  if (strippedCount > 0) {
    cleanAvoid.push(REPLACEMENT_ITEM);
  }

  return {
    immediateActions: cleanActions,
    avoidActions: cleanAvoid,
    strippedCount,
  };
}
