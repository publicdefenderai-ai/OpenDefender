/**
 * Shared types and utilities for quarterly data review diff reports.
 */

import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

export type ChangeType =
  | 'phone_changed'
  | 'address_changed'
  | 'website_down'
  | 'not_found_on_source'
  | 'new_on_source'
  | 'capacity_changed'
  | 'manual_required'
  | 'inactive_reactivate';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface DiffItem {
  id: string;
  name: string;
  changeType: ChangeType;
  storedValue?: string;
  sourceValue?: string;
  verifyUrl?: string;
  notes?: string;
  severity: Severity;
}

export interface DiffReport {
  category: 'detention-facilities' | 'consulates' | 'legal-aid';
  generatedAt: string;
  stats: {
    checked: number;
    automatedChanges: number;
    newOnSource: number;
    notFoundOnSource: number;
    manualOnly: number;
  };
  items: DiffItem[];
  sourceAvailable: boolean;
  errors: string[];
}

/** Strip all non-digit characters for phone comparison. */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Compare two phone strings loosely.
 * Treats "12025551234" and "2025551234" as equal (optional leading country code 1).
 */
export function phonesMatch(a: string, b: string): boolean {
  const na = normalizePhone(a);
  const nb = normalizePhone(b);
  if (na === nb) return true;
  if (na.length === 11 && na.startsWith('1') && na.slice(1) === nb) return true;
  if (nb.length === 11 && nb.startsWith('1') && nb.slice(1) === na) return true;
  return false;
}

/**
 * Very loose address match: lowercase, strip punctuation, collapse whitespace,
 * then check that the street number and first word of street name appear in both.
 */
export function addressesLooselyMatch(a: string, b: string): boolean {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[.,#]/g, ' ').replace(/\s+/g, ' ').trim();
  const na = normalize(a);
  const nb = normalize(b);
  // At minimum, the street number should match
  const streetNum = na.split(' ')[0];
  return streetNum.length > 0 && nb.includes(streetNum);
}

/** Write a DiffReport to a JSON file, creating parent directories as needed. */
export async function writeDiff(report: DiffReport, outputPath: string): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(report, null, 2), 'utf-8');

  const { stats } = report;
  console.log(`\n✓ ${report.category} diff written to ${outputPath}`);
  console.log(`  Checked:  ${stats.checked}`);
  console.log(`  Changes:  ${stats.automatedChanges}`);
  console.log(`  New:      ${stats.newOnSource}`);
  console.log(`  Missing:  ${stats.notFoundOnSource}`);
  console.log(`  Manual:   ${stats.manualOnly}`);
  if (report.errors.length) {
    console.warn(`  Errors:   ${report.errors.length}`);
    report.errors.forEach((e) => console.warn(`    • ${e}`));
  }
}
