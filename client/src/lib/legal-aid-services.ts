// Legal Aid Organizations search services for criminal justice and immigration assistance
// Data sources: Database with immigration, civil legal aid organizations

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
  organizationType: string;
}

// Search for legal aid organizations (immigration and civil legal aid)
export async function searchLegalAidOrganizations(zipCode: string): Promise<LegalAidOrganization[]> {
  try {
    // Use the proximity search API to find legal aid organizations near the ZIP code
    // Filter to immigration and civil legal aid organizations only
    const response = await fetch(`/api/legal-aid-organizations/proximity?zipCode=${zipCode}&radius=50`);
    
    if (!response.ok) {
      throw new Error('Failed to search for legal aid organizations');
    }
    
    const data = await response.json();
    
    if (!data.success || !data.organizations) {
      throw new Error('No legal aid organizations found');
    }
    
    // Filter to only immigration and civil legal aid organizations
    const legalAidOrgs = data.organizations
      .filter((org: any) => 
        org.organizationType === 'immigration' || 
        org.organizationType === 'civil_legal_aid'
      );
    
    if (legalAidOrgs.length === 0) {
      throw new Error('No legal aid organizations found');
    }
    
    // Convert database organizations to LegalAidOrganization format
    const organizations: LegalAidOrganization[] = legalAidOrgs.map((org: any) => ({
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
      jurisdiction: org.state,
      organizationType: formatOrganizationType(org.organizationType)
    }));
    
    return organizations.slice(0, 10); // Limit to 10 results
  } catch (error) {
    console.error('Error searching for legal aid organizations:', error);
    // Return empty array on error
    return [];
  }
}

// Format organization type for display
function formatOrganizationType(type: string): string {
  const typeMap: Record<string, string> = {
    'immigration': 'Immigration Legal Services',
    'civil_legal_aid': 'Civil Legal Aid',
    'public_defender': 'Public Defender Office'
  };
  
  return typeMap[type] || 'Legal Assistance Organization';
}
