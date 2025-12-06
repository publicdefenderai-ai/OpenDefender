// Free courthouse location services using open APIs

export interface CourtLocation {
  id: string;
  name: string;
  address: string;
  county?: string;
  phone?: string;
  hours?: string;
  website?: string;
  type: "federal" | "state" | "municipal" | "traffic" | "bankruptcy";
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
          'User-Agent': 'PublicDefenderAI/1.0 (legal-guidance-app)'
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
  try {
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
      `addressdetails=1&` +
      `limit=20`,
      {
        headers: {
          'User-Agent': 'PublicDefenderAI/1.0 (legal-guidance-app)'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to search for courthouses');
    }
    
    const data = await response.json();
    
    // Convert to our court location format
    const courts: CourtLocation[] = data.map((place: any, index: number) => {
      const address = place.address || {};
      const fullAddress = [
        address.house_number,
        address.road,
        address.city || address.town || address.village,
        address.state,
        address.postcode
      ].filter(Boolean).join(', ');
      
      // Calculate distance (rough approximation)
      const distance = calculateDistance(lat, lng, parseFloat(place.lat), parseFloat(place.lon));
      
      // Determine court type from the name
      const name = place.display_name || 'Courthouse';
      let type: CourtLocation['type'] = 'state';
      let services: string[] = ['General Court Services'];
      
      if (name.toLowerCase().includes('federal') || name.toLowerCase().includes('district court')) {
        type = 'federal';
        services = ['Federal Criminal Cases', 'Federal Civil Cases'];
      } else if (name.toLowerCase().includes('bankruptcy')) {
        type = 'bankruptcy';
        services = ['Bankruptcy Cases', 'Chapter 7', 'Chapter 11', 'Chapter 13'];
      } else if (name.toLowerCase().includes('traffic') || name.toLowerCase().includes('municipal')) {
        type = 'municipal';
        services = ['Traffic Citations', 'Municipal Violations', 'Local Ordinances'];
      } else if (name.toLowerCase().includes('superior') || name.toLowerCase().includes('county')) {
        type = 'state';
        services = ['Criminal Cases', 'Civil Cases', 'Family Court', 'Probate'];
      }
      
      return {
        id: place.place_id.toString(),
        name: extractCourtName(name),
        address: fullAddress,
        county: address.county?.replace(' County', ''), // Clean county name
        phone: undefined, // Would need additional API calls to get phone numbers
        hours: 'Call for hours', // Default message
        website: undefined,
        type,
        services,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon)
      };
    });
    
    // Sort by distance and return
    return courts.sort((a, b) => a.distance - b.distance);
    
  } catch (error) {
    console.error('Error searching for courthouses:', error);
    return [];
  }
}

// Enhanced courthouse search with federal court data from CourtListener
export async function searchCourthousesWithFederalData(zipCode: string): Promise<CourtLocation[]> {
  try {
    // First get ZIP code coordinates and county
    const coords = await getZipCodeCoordinates(zipCode);
    if (!coords) {
      throw new Error('Could not geocode ZIP code');
    }
    
    // Search for nearby courthouses using OSM
    const osmCourts = await searchNearbyCourthouses(coords.lat, coords.lng);
    
    // Try to get federal court data from CourtListener API (free but requires no key for basic access)
    let allCourts = [...osmCourts];
    try {
      const courtListenerResponse = await fetch(
        'https://www.courtlistener.com/api/rest/v4/courts/?format=json&ordering=position',
        {
          headers: {
            'User-Agent': 'PublicDefenderAI/1.0 (legal-guidance-app)',
            'Accept': 'application/json'
          }
        }
      );
      
      if (courtListenerResponse.ok) {
        const federalData = await courtListenerResponse.json();
        
        // Filter for courts near our location (this would need more sophisticated geo-filtering)
        const nearbyFederalCourts = federalData.results?.slice(0, 3).map((court: any, index: number) => ({
          id: `cl-${court.id}`,
          name: court.full_name || court.short_name,
          address: `${court.position || 'Location details available on court website'}`,
          county: undefined, // Federal courts don't have county restrictions
          phone: 'Call court clerk for information',
          hours: '8:30 AM - 5:00 PM (typical)',
          website: court.url,
          type: 'federal' as const,
          services: ['Federal Criminal Cases', 'Federal Civil Cases', 'Appeals'],
          distance: 5 + index, // Placeholder distance
          lat: coords.lat + (index * 0.01), // Placeholder coordinates
          lng: coords.lng + (index * 0.01)
        })) || [];
        
        allCourts = [...osmCourts, ...nearbyFederalCourts];
      }
    } catch (federalError) {
      console.warn('Could not fetch federal court data:', federalError);
    }
    
    // Sort courts by county priority, then by distance within each group
    return sortCourtsByCountyAndDistance(allCourts, coords.county);
    
  } catch (error) {
    console.error('Error in comprehensive courthouse search:', error);
    throw error;
  }
}

// Sort courts by county priority and separate state/federal
export function sortCourtsByCountyAndDistance(courts: CourtLocation[], userCounty?: string): CourtLocation[] {
  // Separate state and federal courts
  const stateCourts = courts.filter(court => court.type === 'state' || court.type === 'municipal' || court.type === 'traffic');
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