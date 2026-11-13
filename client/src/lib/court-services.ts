// Free courthouse location services using open APIs

export interface CourtLocation {
  id: string;
  name: string;
  address: string;
  county?: string;
  phone?: string;
  hours?: string;
  website?: string;
  type: "federal" | "state" | "municipal" | "traffic" | "bankruptcy" | "court";
  services: string[];
  distance: number;
  lat: number;
  lng: number;
}

// State name to abbreviation mapping for geocoding results
const stateNameToAbbreviation: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
  'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
  'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
  'district of columbia': 'DC'
};

// Free geocoding service to convert ZIP to coordinates, county, and state info
export async function getZipCodeCoordinates(zipCode: string): Promise<{ lat: number; lng: number; county?: string; state?: string; stateAbbrev?: string } | null> {
  try {
    // Using Nominatim (OpenStreetMap) - completely free
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${zipCode}&format=json&countrycodes=us&addressdetails=1&limit=1`,
      {
        headers: {
          'User-Agent': 'OpenDefender/1.0 (legal-guidance-app)'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to geocode ZIP code');
    }
    
    const data = await response.json();
    if (data && data.length > 0) {
      const place = data[0];
      const address = place.address || {};
      const stateName = address.state?.toLowerCase();
      const stateAbbrev = stateName ? stateNameToAbbreviation[stateName] : undefined;
      
      return {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        county: address.county?.replace(' County', ''), // Remove "County" suffix if present
        state: address.state,
        stateAbbrev
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding ZIP code:', error);
    return null;
  }
}

// Search for courthouses using OpenStreetMap Nominatim
export async function searchNearbyCourthouses(lat: number, lng: number, radiusMiles = 25): Promise<CourtLocation[]> {
  // Convert miles to degrees (rough approximation: 1 degree ≈ 69 miles)
  const radiusDegrees = radiusMiles / 69;
  const bbox = {
    south: lat - radiusDegrees,
    west: lng - radiusDegrees,
    north: lat + radiusDegrees,
    east: lng + radiusDegrees
  };

  // Search for courthouses in the area
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?` +
    `amenity=courthouse&` +
    `viewbox=${bbox.west},${bbox.south},${bbox.east},${bbox.north}&` +
    `bounded=1&` +
    `format=json&` +
    `addressdetails=1&extratags=1&countrycodes=us&` +
    `limit=20`,
    {
      headers: {
        'User-Agent': 'OpenDefender/1.0 (legal-guidance-app)'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search for courthouses');
  }

  const data = await response.json();

  const courts: CourtLocation[] = [];
  for (const place of data) {
    if (place.type !== "courthouse" || !place.place_id) continue;
    const latitude = parseFloat(place.lat);
    const longitude = parseFloat(place.lon);
    const distance = calculateDistance(lat, lng, latitude, longitude);
    if (!Number.isFinite(distance) || distance > radiusMiles) continue;

    const address = place.address ?? {};
    const tags = place.extratags ?? {};
    const name = place.name || extractCourtName(place.display_name || "");
    const website = tags.website || tags["contact:website"];
    courts.push({
      id: String(place.place_id),
      name,
      address: [[address.house_number, address.road].filter(Boolean).join(" "),
        address.city || address.town || address.village, address.state, address.postcode].filter(Boolean).join(", "),
      county: address.county?.replace(/ County$/, ""),
      type: classifyCourtName(name),
      services: [],
      distance: Math.round(distance * 10) / 10,
      lat: latitude,
      lng: longitude,
      phone: tags.phone || tags["contact:phone"],
      hours: tags.opening_hours,
      website: typeof website === "string" && /^https?:\/\//i.test(website) ? website : undefined,
    });
  }
  return courts.sort((a, b) => a.distance - b.distance);
}

function classifyCourtName(name: string): CourtLocation["type"] {
  if (/bankruptcy/i.test(name)) return "bankruptcy";
  if (/federal|united states|\bu\.?s\.?\s+(district|court|courthouse)/i.test(name)) return "federal";
  if (/municipal/i.test(name)) return "municipal";
  if (/traffic/i.test(name)) return "traffic";
  if (/superior|county|state court/i.test(name)) return "state";
  return "court";
}

export async function searchCourthouses(zipCode: string): Promise<CourtLocation[]> {
  const coords = await getZipCodeCoordinates(zipCode);
  if (!coords) throw new Error("Could not locate ZIP code");
  const courts = await searchNearbyCourthouses(coords.lat, coords.lng);
  return sortCourtsByCountyAndDistance(courts, coords.county);
}

// Sort courts by county priority and separate state/federal
export function sortCourtsByCountyAndDistance(courts: CourtLocation[], userCounty?: string): CourtLocation[] {
  // Separate state and federal courts
  const stateCourts = courts.filter(court => court.type === 'state' || court.type === 'municipal' || court.type === 'traffic' || court.type === 'court');
  const federalCourts = courts.filter(court => court.type === 'federal' || court.type === 'bankruptcy');
  
  // Sort state courts: same county first, then by distance
  const sortedStateCourts = stateCourts.sort((a, b) => {
    if (userCounty) {
      const aInSameCounty = a.county?.toLowerCase() === userCounty.toLowerCase();
      const bInSameCounty = b.county?.toLowerCase() === userCounty.toLowerCase();
      
      if (aInSameCounty && !bInSameCounty) return -1; // a comes first
      if (!aInSameCounty && bInSameCounty) return 1;  // b comes first
    }
    
    // If both in same county or both not, sort by distance
    return a.distance - b.distance;
  });
  
  // Sort federal courts by distance only
  const sortedFederalCourts = federalCourts.sort((a, b) => a.distance - b.distance);
  
  // Return state courts first, then federal courts
  return [...sortedStateCourts, ...sortedFederalCourts];
}

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper to extract clean court name from full display name
function extractCourtName(displayName: string): string {
  // Remove address parts and clean up court name
  const parts = displayName.split(',');
  let courtName = parts[0];
  
  // Clean up common patterns
  courtName = courtName
    .replace(/^(United States|US)\s+/i, 'US ')
    .replace(/\s+Court\s+of\s+/i, ' Court of ')
    .replace(/\s+District\s+Court/i, ' District Court')
    .replace(/\s+Superior\s+Court/i, ' Superior Court')
    .replace(/\s+Municipal\s+Court/i, ' Municipal Court');
    
  return courtName || 'Courthouse';
}

// Add mock data as fallback when APIs fail
export function getMockCourtData(zipCode: string): CourtLocation[] {
  return [
    {
      id: "mock-1",
      name: `Superior Court - ${zipCode} District`,
      address: `123 Justice Way, ${zipCode}`,
      phone: "(555) 123-4567",
      hours: "8:00 AM - 5:00 PM, Mon-Fri",
      website: undefined,
      type: "state",
      services: ["Criminal Cases", "Civil Cases", "Public Defender Office"],
      distance: 2.3,
      lat: 40.7128,
      lng: -74.0060
    },
    {
      id: "mock-2", 
      name: `US District Court - ${zipCode} Division`,
      address: `456 Federal Plaza, ${zipCode}`,
      phone: "(555) 987-6543",
      hours: "8:30 AM - 4:30 PM, Mon-Fri",
      website: "https://uscourts.gov",
      type: "federal",
      services: ["Federal Criminal Cases", "Federal Civil Cases"],
      distance: 3.7,
      lat: 40.7228,
      lng: -74.0160
    }
  ];
}