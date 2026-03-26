// Public Defender Office location services using database and proximity search

export interface PublicDefenderOffice {
  id: string;
  name: string;
  orgType: string;       // 'public_defender' | 'county_public_defender' | 'court_appointed_program'
  orgTypeLabel: string;  // Human-readable: 'Federal Public Defender' | 'Local Public Defender' | 'Court-Appointed Program'
  address: string;
  county?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  services: string[];
  eligibility?: string;
  distance: number;
  lat: number;
  lng: number;
  jurisdiction: string; // State abbreviation
}

// Search for public defender offices using the local-resources API.
// Returns all types: federal PDs, local/county PDs, and court-appointed programs,
// sorted by distance from the provided ZIP code.
export async function searchPublicDefenderOffices(zipCode: string): Promise<PublicDefenderOffice[]> {
  try {
    const response = await fetch(`/api/local-resources/public-defenders?zip=${zipCode}`);

    if (!response.ok) {
      throw new Error('Failed to search for public defender offices');
    }

    const data = await response.json();

    if (!data.success || !data.results || data.results.length === 0) {
      throw new Error('No public defender offices found');
    }

    const offices: PublicDefenderOffice[] = data.results.map((org: any) => ({
      id: org.id || '',
      name: org.name,
      orgType: org.orgType || 'public_defender',
      orgTypeLabel: org.orgTypeLabel || 'Federal Public Defender',
      address: org.address,
      county: org.county || undefined,
      phone: org.phone || undefined,
      email: org.email || undefined,
      website: org.website || undefined,
      hours: 'Call for hours',
      services: org.services || [],
      eligibility: org.eligibility || undefined,
      distance: org.distanceValue ?? 0,
      lat: 0,
      lng: 0,
      jurisdiction: data.state || '',
    }));

    return offices.slice(0, 10);
  } catch (error) {
    console.error('Error searching for public defender offices:', error);
    return [];
  }
}
