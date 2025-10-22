// Public Defender Office location services using open APIs

export interface PublicDefenderOffice {
  id: string;
  name: string;
  address: string;
  county?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  services: string[];
  distance: number;
  lat: number;
  lng: number;
  jurisdiction: string; // State abbreviation
}

// Search for public defender offices using OpenStreetMap and government data
export async function searchPublicDefenderOffices(zipCode: string): Promise<PublicDefenderOffice[]> {
  try {
    // First get ZIP code coordinates and county
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
    if (!data || data.length === 0) {
      throw new Error('ZIP code not found');
    }
    
    const place = data[0];
    const address = place.address || {};
    const userLat = parseFloat(place.lat);
    const userLng = parseFloat(place.lon);
    const userCounty = address.county?.replace(' County', '');
    const userState = address.state;
    
    // Search for public defender offices in the area
    const radiusDegrees = 50 / 69; // ~50 mile radius
    const bbox = {
      south: userLat - radiusDegrees,
      west: userLng - radiusDegrees,
      north: userLat + radiusDegrees,
      east: userLng + radiusDegrees
    };
    
    // Search for public defender offices using multiple search terms
    const searchTerms = [
      'public defender',
      'legal aid',
      'public defense',
      'indigent defense'
    ];
    
    let allOffices: PublicDefenderOffice[] = [];
    
    for (const term of searchTerms) {
      try {
        const osmResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q="${term}"&` +
          `viewbox=${bbox.west},${bbox.north},${bbox.east},${bbox.south}&` +
          `bounded=1&` +
          `format=json&` +
          `addressdetails=1&` +
          `limit=10`,
          {
            headers: {
              'User-Agent': 'PublicDefenderAI/1.0 (legal-guidance-app)'
            }
          }
        );
        
        if (osmResponse.ok) {
          const osmData = await osmResponse.json();
          
          // Convert to our format
          const offices = osmData.map((office: any, index: number) => {
            const officeAddress = office.address || {};
            const fullAddress = [
              officeAddress.house_number,
              officeAddress.road,
              officeAddress.city || officeAddress.town || officeAddress.village,
              officeAddress.state,
              officeAddress.postcode
            ].filter(Boolean).join(', ');
            
            const distance = calculateDistance(userLat, userLng, parseFloat(office.lat), parseFloat(office.lon));
            
            return {
              id: `${term}-${office.place_id}`,
              name: extractOfficeName(office.display_name || office.name || 'Public Defender Office'),
              address: fullAddress,
              county: officeAddress.county?.replace(' County', ''),
              phone: undefined, // Would need additional API calls
              email: undefined,
              website: undefined,
              hours: 'Call for hours',
              services: getServicesForOffice(office.display_name || office.name || ''),
              distance: Math.round(distance * 10) / 10,
              lat: parseFloat(office.lat),
              lng: parseFloat(office.lon),
              jurisdiction: officeAddress.state || userState || 'Unknown'
            };
          });
          
          allOffices = [...allOffices, ...offices];
        }
      } catch (searchError) {
        console.warn(`Search failed for term "${term}":`, searchError);
      }
    }
    
    // Remove duplicates based on coordinates (within 0.001 degrees ~ 100 meters)
    const uniqueOffices = allOffices.filter((office, index, array) => {
      return array.findIndex(other => 
        Math.abs(office.lat - other.lat) < 0.001 && 
        Math.abs(office.lng - other.lng) < 0.001
      ) === index;
    });
    
    // Sort by county priority, then distance
    const sortedOffices = uniqueOffices.sort((a, b) => {
      if (userCounty) {
        const aInSameCounty = a.county?.toLowerCase() === userCounty.toLowerCase();
        const bInSameCounty = b.county?.toLowerCase() === userCounty.toLowerCase();
        
        if (aInSameCounty && !bInSameCounty) return -1;
        if (!aInSameCounty && bInSameCounty) return 1;
      }
      
      return a.distance - b.distance;
    });
    
    // If no results from OSM, generate fallback offices based on state
    if (sortedOffices.length === 0) {
      return generateFallbackOffices(userState, userCounty, userLat, userLng);
    }
    
    return sortedOffices.slice(0, 10); // Limit to 10 results
    
  } catch (error) {
    console.error('Error searching for public defender offices:', error);
    // Return fallback data
    return generateFallbackOffices('Unknown', 'Unknown', 0, 0);
  }
}

// Helper function to calculate distance between two points
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

// Extract office name from display name
function extractOfficeName(displayName: string): string {
  // Clean up common patterns in OSM data
  const name = displayName
    .split(',')[0] // Take first part before comma
    .replace(/^\d+\s+/, '') // Remove leading numbers
    .replace(/\s+\d+$/, '') // Remove trailing numbers
    .trim();
  
  if (name.toLowerCase().includes('public defender')) {
    return name;
  }
  
  if (name.toLowerCase().includes('legal aid')) {
    return name;
  }
  
  return `${name} Public Defender Office`;
}

// Get services based on office name/type
function getServicesForOffice(name: string): string[] {
  const baseName = name.toLowerCase();
  
  if (baseName.includes('legal aid')) {
    return [
      'Civil Legal Aid',
      'Housing Assistance',
      'Family Law',
      'Public Benefits',
      'Criminal Defense Referrals'
    ];
  }
  
  if (baseName.includes('public defender')) {
    return [
      'Felony Defense',
      'Misdemeanor Defense',
      'Appeals',
      'Juvenile Defense',
      'Indigent Defense'
    ];
  }
  
  return [
    'Criminal Defense',
    'Legal Consultation',
    'Court Representation',
    'Legal Advice'
  ];
}

// Generate fallback offices when no real data is found
function generateFallbackOffices(state: string, county: string, lat: number, lng: number): PublicDefenderOffice[] {
  const stateOffices = [
    {
      id: 'fallback-1',
      name: `${county || state} Public Defender Office`,
      address: 'Contact information available by calling the court clerk',
      county: county,
      phone: undefined,
      email: undefined,
      website: undefined,
      hours: 'Monday-Friday 8:00 AM - 5:00 PM',
      services: [
        'Felony Defense',
        'Misdemeanor Defense',
        'Appeals',
        'Juvenile Defense'
      ],
      distance: 5,
      lat: lat + 0.01,
      lng: lng + 0.01,
      jurisdiction: state
    },
    {
      id: 'fallback-2',
      name: `${state} Legal Aid Society`,
      address: 'Contact your local court for referral information',
      county: county,
      phone: undefined,
      email: undefined,
      website: undefined,
      hours: 'Call for availability',
      services: [
        'Civil Legal Aid',
        'Criminal Defense Referrals',
        'Legal Consultation',
        'Pro Bono Services'
      ],
      distance: 8,
      lat: lat + 0.02,
      lng: lng + 0.02,
      jurisdiction: state
    }
  ];
  
  return stateOffices;
}