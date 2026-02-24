/**
 * Google Places API verification utility.
 * Used by all three checker scripts to cross-reference stored phone numbers
 * and detect permanently-closed locations.
 */

import { phonesMatch } from './diff.js';

export interface PlacesResult {
  found: boolean;
  permanentlyClosed?: boolean;
  phoneMismatch?: { stored: string; places: string };
  placesPhone?: string;
  placesAddress?: string;
}

/**
 * Verify a location against the Google Places findplacefromtext API.
 * @param apiKey        - GOOGLE_PLACES_API_KEY
 * @param queryName     - Full name of the location to search
 * @param storedPhone   - Phone number as stored in our data
 * @param locationHint  - Optional city/state hint (e.g. "Adelanto, CA")
 */
export async function verifyWithPlaces(
  apiKey: string,
  queryName: string,
  storedPhone: string,
  locationHint?: string,
): Promise<PlacesResult> {
  const query = locationHint ? `${queryName} ${locationHint}` : queryName;

  const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
  url.searchParams.set('input', query);
  url.searchParams.set('inputtype', 'textquery');
  url.searchParams.set('fields', 'formatted_phone_number,formatted_address,business_status');
  // Bias search toward the continental US + territories
  url.searchParams.set('locationbias', 'rectangle:18,-130,50,-65');
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Google Places API error: HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    status: string;
    candidates: Array<{
      formatted_phone_number?: string;
      formatted_address?: string;
      business_status?: string;
    }>;
    error_message?: string;
  };

  if (data.status === 'REQUEST_DENIED') {
    throw new Error(`Google Places API denied: ${data.error_message ?? 'no details'}`);
  }

  if (data.status !== 'OK' || !data.candidates?.length) {
    return { found: false };
  }

  const place = data.candidates[0];
  const result: PlacesResult = {
    found: true,
    permanentlyClosed: place.business_status === 'CLOSED_PERMANENTLY',
    placesPhone: place.formatted_phone_number,
    placesAddress: place.formatted_address,
  };

  if (place.formatted_phone_number && !phonesMatch(storedPhone, place.formatted_phone_number)) {
    result.phoneMismatch = {
      stored: storedPhone,
      places: place.formatted_phone_number,
    };
  }

  return result;
}

/** Polite delay between Places API calls to stay well within rate limits. */
export const placesDelay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 250));

/**
 * Check the HTTP status of a URL. Returns the status code, or 0 on network error.
 */
export async function checkWebsite(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10_000),
      headers: { 'User-Agent': 'PublicDefenderAI-DataReview/1.0' },
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}
