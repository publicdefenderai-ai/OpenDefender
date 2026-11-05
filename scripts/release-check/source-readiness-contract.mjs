export const expectedRowKeys = [
  "jurisdiction",
  "source",
  "manifestGeneratedAt",
  "catalogRows",
  "mappingClassificationCounts",
  "automatedCandidateRows",
  "unresolvedMappingRows",
  "selectableRows",
  "withheldRows",
  "rowsWithExplicitWithheldReason",
  "catalogAccountingRate",
  "rowsWithOfficialResponse",
  "officialResponseRate",
  "officialResponsePercentage",
  "publishableRate",
  "coveragePercentage",
  "selectableCoveragePercentage",
  "sources",
  "snapshots",
  "links",
  "officialSourceAvailability",
  "gapBreakdown",
  "gapCounts",
  "staleRows",
  "status",
  "blocker",
  "manifestPath",
  "seedScriptPath",
];

export function assertReadinessRow(row) {
  if (!row || Object.keys(row).sort().join(',') !== [...expectedRowKeys].sort().join(',')) {
    throw new Error(`Source-readiness row for ${row?.jurisdiction} has an unexpected envelope`);
  }
  for (const key of ['automatedCandidateRows', 'unresolvedMappingRows']) {
    if (!Number.isSafeInteger(row[key]) || row[key] < 0) throw new Error(`Invalid readiness count: ${key}`);
  }
  const counts = row.mappingClassificationCounts;
  if (!counts || typeof counts !== 'object' || Array.isArray(counts) ||
      Object.values(counts).some(value => !Number.isSafeInteger(value) || value < 0)) {
    throw new Error('Invalid readiness classification counts');
  }
}
