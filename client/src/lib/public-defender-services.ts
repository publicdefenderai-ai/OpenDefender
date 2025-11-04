// Public Defender Office location services using database and proximity search

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

// Search for public defender offices using proximity API
export async function searchPublicDefenderOffices(zipCode: string): Promise<PublicDefenderOffice[]> {
  try {
    // Use the proximity search API to find public defender offices near the ZIP code
    const response = await fetch(`/api/legal-aid-organizations/proximity?zipCode=${zipCode}&radius=50&organizationType=public_defender`);
    
    if (!response.ok) {
      throw new Error('Failed to search for public defender offices');
    }
    
    const data = await response.json();
    
    if (!data.success || !data.organizations || data.organizations.length === 0) {
      throw new Error('No public defender offices found');
    }
    
    // Convert database organizations to PublicDefenderOffice format
    const offices: PublicDefenderOffice[] = data.organizations.map((org: any) => ({
      id: org.id,
      name: org.name,
      address: [org.address, org.city, org.state, org.zipCode].filter(Boolean).join(', '),
      county: org.county || undefined,
      phone: org.phone || undefined,
      email: org.email || undefined,
      website: org.website || undefined,
      hours: 'Call for hours',
      services: org.services || [],
      distance: Math.round(org.distance * 10) / 10,
      lat: parseFloat(org.latitude),
      lng: parseFloat(org.longitude),
      jurisdiction: org.state
    }));
    
    return offices.slice(0, 10); // Limit to 10 results
  } catch (error) {
    console.error('Error searching for public defender offices:', error);
    // Return empty array on error
    return [];
  }
}
