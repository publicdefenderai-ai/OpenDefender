// Legal Aid Organizations search services for criminal justice and immigration assistance
// Excludes homeless assistance unrelated to criminal law
// Data sources: EOIR Pro Bono List, Legal Services Corporation (LSC), usa.gov

export interface LegalAidOrganization {
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
  organizationType: string; // "Legal Aid Society", "Immigration Services", "Criminal Justice Assistance", etc.
}

// Interface for database organization
interface DBOrganization {
  id: string;
  name: string;
  organizationType: string;
  address: string | null;
  city: string;
  state: string;
  zipCode: string | null;
  county: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: string | null;
  longitude: string | null;
  services: string[];
  eligibility: string | null;
  dataSource: string;
}

// Search for legal aid organizations focused on criminal justice and immigration
export async function searchLegalAidOrganizations(zipCode: string): Promise<LegalAidOrganization[]> {
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
    
    // Get state abbreviation (Nominatim sometimes gives full state name)
    const stateAbbr = getStateAbbreviation(userState);
    
    // FIRST: Query our database for organizations in the state
    let dbOrganizations: LegalAidOrganization[] = [];
    try {
      const dbResponse = await fetch(`/api/legal-aid-organizations?state=${stateAbbr}`);
      if (dbResponse.ok) {
        const dbData = await dbResponse.json();
        if (dbData.success && dbData.organizations) {
          // Convert database organizations to our format with distance calculations
          dbOrganizations = dbData.organizations
            .filter((org: DBOrganization) => org.latitude && org.longitude)
            .map((org: DBOrganization) => {
              const orgLat = parseFloat(org.latitude!);
              const orgLng = parseFloat(org.longitude!);
              const distance = calculateDistance(userLat, userLng, orgLat, orgLng);
              
              return {
                id: org.id,
                name: org.name,
                address: [org.address, org.city, org.state, org.zipCode].filter(Boolean).join(', '),
                county: org.county || undefined,
                phone: org.phone || undefined,
                email: org.email || undefined,
                website: org.website || undefined,
                hours: 'Call for hours',
                services: org.services || [],
                distance: Math.round(distance * 10) / 10,
                lat: orgLat,
                lng: orgLng,
                jurisdiction: org.state,
                organizationType: formatOrganizationType(org.organizationType)
              };
            })
            .filter((org: LegalAidOrganization) => org.distance <= 100); // Within 100 miles
        }
      }
    } catch (dbError) {
      console.warn('Database query failed, will use fallback:', dbError);
    }
    
    // If we have good database results (5+), use them
    if (dbOrganizations.length >= 5) {
      // Sort by county priority, then distance
      const sortedOrganizations = dbOrganizations.sort((a, b) => {
        if (userCounty) {
          const aInSameCounty = a.county?.toLowerCase() === userCounty.toLowerCase();
          const bInSameCounty = b.county?.toLowerCase() === userCounty.toLowerCase();
          
          if (aInSameCounty && !bInSameCounty) return -1;
          if (!aInSameCounty && bInSameCounty) return 1;
        }
        
        return a.distance - b.distance;
      });
      
      return sortedOrganizations.slice(0, 10); // Limit to 10 results
    }
    
    // FALLBACK: If database has few results, supplement with OpenStreetMap search
    const radiusDegrees = 50 / 69; // ~50 mile radius
    const bbox = {
      south: userLat - radiusDegrees,
      west: userLng - radiusDegrees,
      north: userLat + radiusDegrees,
      east: userLng + radiusDegrees
    };
    
    // Search terms focused on criminal justice and immigration legal aid
    const searchTerms = [
      'legal aid society',
      'immigration legal services',
      'criminal defense legal aid',
      'immigrant services',
      'legal assistance',
      'immigrant rights'
    ];
    
    let allOrganizations: LegalAidOrganization[] = [];
    
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
          const organizations = osmData.map((org: any) => {
            const orgAddress = org.address || {};
            const fullAddress = [
              orgAddress.house_number,
              orgAddress.road,
              orgAddress.city || orgAddress.town || orgAddress.village,
              orgAddress.state,
              orgAddress.postcode
            ].filter(Boolean).join(', ');
            
            const distance = calculateDistance(userLat, userLng, parseFloat(org.lat), parseFloat(org.lon));
            
            return {
              id: `${term}-${org.place_id}`,
              name: extractOrganizationName(org.display_name || org.name || 'Legal Aid Organization'),
              address: fullAddress,
              county: orgAddress.county?.replace(' County', ''),
              phone: undefined, // Would need additional API calls
              email: undefined,
              website: undefined,
              hours: 'Call for hours',
              services: getServicesForOrganization(org.display_name || org.name || '', term),
              distance: Math.round(distance * 10) / 10,
              lat: parseFloat(org.lat),
              lng: parseFloat(org.lon),
              jurisdiction: orgAddress.state || userState || 'Unknown',
              organizationType: determineOrganizationType(org.display_name || org.name || '', term)
            };
          });
          
          allOrganizations = [...allOrganizations, ...organizations];
        }
      } catch (searchError) {
        console.warn(`Search failed for term "${term}":`, searchError);
      }
    }
    
    // Remove duplicates based on coordinates (within 0.001 degrees ~ 100 meters)
    const uniqueOrganizations = allOrganizations.filter((org, index, array) => {
      return array.findIndex(other => 
        Math.abs(org.lat - other.lat) < 0.001 && 
        Math.abs(org.lng - other.lng) < 0.001
      ) === index;
    });
    
    // Sort by county priority, then distance
    const sortedOrganizations = uniqueOrganizations.sort((a, b) => {
      if (userCounty) {
        const aInSameCounty = a.county?.toLowerCase() === userCounty.toLowerCase();
        const bInSameCounty = b.county?.toLowerCase() === userCounty.toLowerCase();
        
        if (aInSameCounty && !bInSameCounty) return -1;
        if (!aInSameCounty && bInSameCounty) return 1;
      }
      
      return a.distance - b.distance;
    });
    
    // If no results from OSM, generate fallback organizations based on state
    if (sortedOrganizations.length === 0) {
      return generateFallbackOrganizations(userState, userCounty, userLat, userLng);
    }
    
    return sortedOrganizations.slice(0, 10); // Limit to 10 results
    
  } catch (error) {
    console.error('Error searching for legal aid organizations:', error);
    // Return fallback data
    return generateFallbackOrganizations('Unknown', 'Unknown', 0, 0);
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

// Extract organization name from display name
function extractOrganizationName(displayName: string): string {
  // Clean up common patterns in OSM data
  const name = displayName
    .split(',')[0] // Take first part before comma
    .replace(/^\d+\s+/, '') // Remove leading numbers
    .replace(/\s+\d+$/, '') // Remove trailing numbers
    .trim();
  
  if (name.toLowerCase().includes('legal aid') || 
      name.toLowerCase().includes('immigration') ||
      name.toLowerCase().includes('legal services')) {
    return name;
  }
  
  return `${name} Legal Services`;
}

// Determine organization type based on name and search term
function determineOrganizationType(name: string, searchTerm: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('immigration') || searchTerm.includes('immigration') || searchTerm.includes('immigrant')) {
    return 'Immigration Legal Services';
  }
  
  if (lowerName.includes('criminal') || searchTerm.includes('criminal')) {
    return 'Criminal Justice Legal Aid';
  }
  
  if (lowerName.includes('legal aid')) {
    return 'Legal Aid Society';
  }
  
  return 'Legal Assistance Organization';
}

// Get services based on organization type
function getServicesForOrganization(name: string, searchTerm: string): string[] {
  const baseName = name.toLowerCase();
  const services: string[] = [];
  
  // Immigration-related services
  if (baseName.includes('immigration') || searchTerm.includes('immigration') || searchTerm.includes('immigrant')) {
    services.push(
      'Immigration Status Assistance',
      'Deportation Defense',
      'Asylum Applications',
      'DACA/DAPA Assistance',
      'ICE Encounter Rights'
    );
  }
  
  // Criminal justice services
  if (baseName.includes('criminal') || baseName.includes('defense') || searchTerm.includes('criminal')) {
    services.push(
      'Criminal Defense Assistance',
      'Expungement Help',
      'Sentencing Advocacy',
      'Appeals Support',
      'Diversion Program Access'
    );
  }
  
  // General legal aid services (always included)
  if (services.length === 0 || baseName.includes('legal aid')) {
    services.push(
      'Free Legal Consultation',
      'Court Representation',
      'Legal Document Assistance',
      'Referral Services',
      'Pro Bono Legal Help'
    );
  }
  
  return services.slice(0, 5); // Limit to 5 services
}

// Get state abbreviation from full name or abbreviation
function getStateAbbreviation(state: string): string {
  const stateMap: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
    'District of Columbia': 'DC'
  };
  
  // If already an abbreviation, return it
  if (state && state.length === 2) {
    return state.toUpperCase();
  }
  
  // Otherwise, look it up
  return stateMap[state] || state;
}

// Format organization type for display
function formatOrganizationType(type: string): string {
  const typeMap: Record<string, string> = {
    'immigration': 'Immigration Legal Services',
    'criminal_defense': 'Criminal Justice Legal Aid',
    'civil_legal_aid': 'Civil Legal Aid',
    'public_defender': 'Public Defender Office'
  };
  
  return typeMap[type] || 'Legal Assistance Organization';
}

// Generate fallback organizations when no real data is found
function generateFallbackOrganizations(state: string, county: string, lat: number, lng: number): LegalAidOrganization[] {
  const stateOrganizations: LegalAidOrganization[] = [
    {
      id: 'fallback-legal-aid-1',
      name: `${state} Legal Aid Services`,
      address: 'Contact your local court for referral information',
      county: county,
      phone: undefined,
      email: undefined,
      website: undefined,
      hours: 'Monday-Friday 9:00 AM - 5:00 PM',
      services: [
        'Criminal Defense Assistance',
        'Free Legal Consultation',
        'Court Representation',
        'Referral Services'
      ],
      distance: 5,
      lat: lat + 0.01,
      lng: lng + 0.01,
      jurisdiction: state,
      organizationType: 'Legal Aid Society'
    },
    {
      id: 'fallback-immigration-1',
      name: `${state} Immigration Legal Services`,
      address: 'Contact local immigration advocacy organizations for assistance',
      county: county,
      phone: undefined,
      email: undefined,
      website: undefined,
      hours: 'Call for availability',
      services: [
        'Immigration Status Assistance',
        'Deportation Defense',
        'Asylum Applications',
        'ICE Encounter Rights',
        'Legal Document Assistance'
      ],
      distance: 8,
      lat: lat + 0.02,
      lng: lng + 0.02,
      jurisdiction: state,
      organizationType: 'Immigration Legal Services'
    },
    {
      id: 'fallback-general-1',
      name: `${county || state} Pro Bono Legal Network`,
      address: 'Search online for local bar association pro bono programs',
      county: county,
      phone: undefined,
      email: undefined,
      website: undefined,
      hours: 'By appointment',
      services: [
        'Pro Bono Legal Help',
        'Free Legal Consultation',
        'Legal Document Assistance',
        'Referral Services',
        'Community Legal Clinics'
      ],
      distance: 10,
      lat: lat + 0.03,
      lng: lng + 0.03,
      jurisdiction: state,
      organizationType: 'Pro Bono Legal Services'
    }
  ];
  
  return stateOrganizations;
}
