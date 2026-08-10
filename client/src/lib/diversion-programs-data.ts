// Pure data and sync helpers live in shared/ — imported by both server and client.
// This stub re-exports everything from shared and adds the geo-dependent async
// search (getZipCodeCoordinates is a browser/server HTTP call, not pure data).
export * from "@shared/diversion-programs-data";

import { getZipCodeCoordinates } from "./court-services";
import { diversionPrograms, searchDiversionPrograms } from "@shared/diversion-programs-data";
import type { ExpandedSearchResult } from "@shared/diversion-programs-data";

function isZipCode(query: string): boolean {
  return /^\d{5}$/.test(query.trim());
}

export async function searchDiversionProgramsExpanded(query: string): Promise<ExpandedSearchResult> {
  if (!query.trim()) {
    return { programs: [] };
  }

  const trimmedQuery = query.trim();

  // If it's a zip code, geocode it and expand to state
  if (isZipCode(trimmedQuery)) {
    try {
      const geoResult = await getZipCodeCoordinates(trimmedQuery);

      if (geoResult?.stateAbbrev) {
        const statePrograms = diversionPrograms.filter(
          program => program.state.toUpperCase() === geoResult.stateAbbrev
        );
        return {
          programs: statePrograms.sort((a, b) => a.name.localeCompare(b.name)),
          expandedToState: geoResult.state,
          searchedZipCode: trimmedQuery,
          county: geoResult.county,
        };
      }
    } catch (error) {
      console.error("Error geocoding zip code for diversion programs:", error);
    }

    // Fall back to regular search if geocoding fails
    return { programs: searchDiversionPrograms(trimmedQuery) };
  }

  // For non-zip-code queries, use the regular search
  return { programs: searchDiversionPrograms(trimmedQuery) };
}
