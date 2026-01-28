/**
 * ICE Detention Facility Data
 * Information compiled from public ICE data and FOIA requests
 */

export interface DetentionFacility {
  id: string;
  name: string;
  type: 'IGSA' | 'CDF' | 'USMS' | 'SPC' | 'FRC'; // Intergovernmental Service Agreement, Contract Detention Facility, US Marshals, Service Processing Center, Family Residential Center
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  detaineePhone?: string;
  fax?: string;
  fieldOffice: string;
  averageCapacity: number;
  visitationInfo?: {
    en: string;
    es: string;
  };
}

// Major ICE detention facilities by state
export const detentionFacilities: DetentionFacility[] = [
  // Arizona
  {
    id: 'az-eloy',
    name: 'Eloy Detention Center',
    type: 'CDF',
    address: '1705 E Hanna Rd',
    city: 'Eloy',
    state: 'AZ',
    zipCode: '85131',
    phone: '(520) 464-8600',
    detaineePhone: '(520) 464-8500',
    fieldOffice: 'Phoenix',
    averageCapacity: 1500,
    visitationInfo: {
      en: 'Visitation hours vary. Contact facility for current schedule.',
      es: 'Las horas de visita varían. Contacte la instalación para el horario actual.'
    }
  },
  {
    id: 'az-florence',
    name: 'Florence Service Processing Center',
    type: 'SPC',
    address: '3250 N Pinal Pkwy',
    city: 'Florence',
    state: 'AZ',
    zipCode: '85132',
    phone: '(520) 868-5821',
    fieldOffice: 'Phoenix',
    averageCapacity: 600
  },
  {
    id: 'az-lacinta',
    name: 'La Palma Correctional Center',
    type: 'CDF',
    address: '1250 W Woody Mountain Rd',
    city: 'Eloy',
    state: 'AZ',
    zipCode: '85131',
    phone: '(520) 464-8400',
    fieldOffice: 'Phoenix',
    averageCapacity: 3000
  },

  // California
  {
    id: 'ca-adelanto',
    name: 'Adelanto ICE Processing Center',
    type: 'CDF',
    address: '10400 Rancho Rd',
    city: 'Adelanto',
    state: 'CA',
    zipCode: '92301',
    phone: '(760) 530-3100',
    fieldOffice: 'Los Angeles',
    averageCapacity: 1900,
    visitationInfo: {
      en: 'Saturdays, Sundays, and federal holidays: 8:00 AM - 3:00 PM',
      es: 'Sábados, domingos y días feriados: 8:00 AM - 3:00 PM'
    }
  },
  {
    id: 'ca-otay',
    name: 'Otay Mesa Detention Center',
    type: 'CDF',
    address: '7488 Calzada de la Fuente',
    city: 'San Diego',
    state: 'CA',
    zipCode: '92154',
    phone: '(619) 671-8400',
    fieldOffice: 'San Diego',
    averageCapacity: 1800
  },
  {
    id: 'ca-imperial',
    name: 'Imperial Regional Detention Facility',
    type: 'CDF',
    address: '1572 Gateway Rd',
    city: 'Calexico',
    state: 'CA',
    zipCode: '92231',
    phone: '(760) 312-9000',
    fieldOffice: 'San Diego',
    averageCapacity: 700
  },

  // Colorado
  {
    id: 'co-aurora',
    name: 'Aurora Contract Detention Facility',
    type: 'CDF',
    address: '3130 N Oakland St',
    city: 'Aurora',
    state: 'CO',
    zipCode: '80010',
    phone: '(303) 361-6612',
    fieldOffice: 'Denver',
    averageCapacity: 1500
  },

  // Florida
  {
    id: 'fl-krome',
    name: 'Krome Service Processing Center',
    type: 'SPC',
    address: '18201 SW 12th St',
    city: 'Miami',
    state: 'FL',
    zipCode: '33194',
    phone: '(305) 207-5500',
    fieldOffice: 'Miami',
    averageCapacity: 800
  },
  {
    id: 'fl-broward',
    name: 'Broward Transitional Center',
    type: 'CDF',
    address: '3900 N Powerline Rd',
    city: 'Pompano Beach',
    state: 'FL',
    zipCode: '33073',
    phone: '(954) 975-4700',
    fieldOffice: 'Miami',
    averageCapacity: 700
  },
  {
    id: 'fl-glades',
    name: 'Glades County Detention Center',
    type: 'IGSA',
    address: '1297 E State Rd 78',
    city: 'Moore Haven',
    state: 'FL',
    zipCode: '33471',
    phone: '(863) 946-1600',
    fieldOffice: 'Miami',
    averageCapacity: 750
  },

  // Georgia
  {
    id: 'ga-stewart',
    name: 'Stewart Detention Center',
    type: 'CDF',
    address: '146 CCA Rd',
    city: 'Lumpkin',
    state: 'GA',
    zipCode: '31815',
    phone: '(229) 838-5000',
    fieldOffice: 'Atlanta',
    averageCapacity: 2000
  },
  {
    id: 'ga-irwin',
    name: 'Irwin County Detention Center',
    type: 'IGSA',
    address: '132 Cotton Dr',
    city: 'Ocilla',
    state: 'GA',
    zipCode: '31774',
    phone: '(229) 468-4100',
    fieldOffice: 'Atlanta',
    averageCapacity: 700
  },

  // Louisiana
  {
    id: 'la-pine',
    name: 'Pine Prairie ICE Processing Center',
    type: 'CDF',
    address: '1133 Hampton Dupre Rd',
    city: 'Pine Prairie',
    state: 'LA',
    zipCode: '70576',
    phone: '(337) 599-3800',
    fieldOffice: 'New Orleans',
    averageCapacity: 900
  },
  {
    id: 'la-jackson',
    name: 'Jackson Parish Correctional Center',
    type: 'IGSA',
    address: '371 Industrial Dr',
    city: 'Jonesboro',
    state: 'LA',
    zipCode: '71251',
    phone: '(318) 259-2315',
    fieldOffice: 'New Orleans',
    averageCapacity: 500
  },
  {
    id: 'la-richwood',
    name: 'Richwood Correctional Center',
    type: 'CDF',
    address: '5182 Richwood Rd',
    city: 'Monroe',
    state: 'LA',
    zipCode: '71202',
    phone: '(318) 325-7000',
    fieldOffice: 'New Orleans',
    averageCapacity: 900
  },

  // New Jersey
  {
    id: 'nj-elizabeth',
    name: 'Elizabeth Contract Detention Facility',
    type: 'CDF',
    address: '625 Evans St',
    city: 'Elizabeth',
    state: 'NJ',
    zipCode: '07201',
    phone: '(908) 282-6400',
    fieldOffice: 'Newark',
    averageCapacity: 300
  },

  // New Mexico
  {
    id: 'nm-otero',
    name: 'Otero County Processing Center',
    type: 'CDF',
    address: '26 McGregor Range Rd',
    city: 'Chaparral',
    state: 'NM',
    zipCode: '88081',
    phone: '(575) 824-0440',
    fieldOffice: 'El Paso',
    averageCapacity: 1000
  },
  {
    id: 'nm-cibola',
    name: 'Cibola County Correctional Center',
    type: 'CDF',
    address: '200 Corrections St',
    city: 'Milan',
    state: 'NM',
    zipCode: '87021',
    phone: '(505) 285-5900',
    fieldOffice: 'El Paso',
    averageCapacity: 1100
  },

  // New York
  {
    id: 'ny-buffalo',
    name: 'Buffalo Federal Detention Facility',
    type: 'SPC',
    address: '4250 Federal Dr',
    city: 'Batavia',
    state: 'NY',
    zipCode: '14020',
    phone: '(585) 344-6100',
    fieldOffice: 'Buffalo',
    averageCapacity: 400
  },

  // Pennsylvania
  {
    id: 'pa-york',
    name: 'York County Prison',
    type: 'IGSA',
    address: '3400 Concord Rd',
    city: 'York',
    state: 'PA',
    zipCode: '17402',
    phone: '(717) 840-7580',
    fieldOffice: 'Philadelphia',
    averageCapacity: 800
  },
  {
    id: 'pa-pike',
    name: 'Pike County Correctional Facility',
    type: 'IGSA',
    address: '175 Pike County Blvd',
    city: 'Lords Valley',
    state: 'PA',
    zipCode: '18428',
    phone: '(570) 775-5550',
    fieldOffice: 'Philadelphia',
    averageCapacity: 400
  },

  // Texas
  {
    id: 'tx-port-isabel',
    name: 'Port Isabel Service Processing Center',
    type: 'SPC',
    address: '27991 Buena Vista Blvd',
    city: 'Los Fresnos',
    state: 'TX',
    zipCode: '78566',
    phone: '(956) 547-1700',
    fieldOffice: 'Harlingen',
    averageCapacity: 1200
  },
  {
    id: 'tx-el-paso',
    name: 'El Paso Service Processing Center',
    type: 'SPC',
    address: '8915 Montana Ave',
    city: 'El Paso',
    state: 'TX',
    zipCode: '79925',
    phone: '(915) 225-0700',
    fieldOffice: 'El Paso',
    averageCapacity: 830
  },
  {
    id: 'tx-karnes',
    name: 'South Texas Family Residential Center',
    type: 'FRC',
    address: '409 FM 1144',
    city: 'Karnes City',
    state: 'TX',
    zipCode: '78118',
    phone: '(830) 254-6300',
    fieldOffice: 'San Antonio',
    averageCapacity: 830
  },
  {
    id: 'tx-dilley',
    name: 'South Texas Family Residential Center (Dilley)',
    type: 'FRC',
    address: '101 Southbound Dr',
    city: 'Dilley',
    state: 'TX',
    zipCode: '78017',
    phone: '(830) 965-3000',
    fieldOffice: 'San Antonio',
    averageCapacity: 2400
  },
  {
    id: 'tx-houston-cdf',
    name: 'Houston Contract Detention Facility',
    type: 'CDF',
    address: '15850 Export Plaza Dr',
    city: 'Houston',
    state: 'TX',
    zipCode: '77032',
    phone: '(281) 449-1481',
    fieldOffice: 'Houston',
    averageCapacity: 1000
  },
  {
    id: 'tx-laredo',
    name: 'Laredo Processing Center',
    type: 'CDF',
    address: '4702 E Saunders St',
    city: 'Laredo',
    state: 'TX',
    zipCode: '78041',
    phone: '(956) 764-3800',
    fieldOffice: 'San Antonio',
    averageCapacity: 700
  },

  // Virginia
  {
    id: 'va-farmville',
    name: 'Farmville Detention Center',
    type: 'CDF',
    address: '500 Industrial Park Rd',
    city: 'Farmville',
    state: 'VA',
    zipCode: '23901',
    phone: '(434) 391-0048',
    fieldOffice: 'Washington DC',
    averageCapacity: 700
  },

  // Washington
  {
    id: 'wa-tacoma',
    name: 'Northwest ICE Processing Center',
    type: 'CDF',
    address: '1623 E J St',
    city: 'Tacoma',
    state: 'WA',
    zipCode: '98421',
    phone: '(253) 779-6000',
    fieldOffice: 'Seattle',
    averageCapacity: 1575,
    visitationInfo: {
      en: 'Visitation on Saturdays, Sundays, and federal holidays. Must be on approved visitor list.',
      es: 'Visitas los sábados, domingos y días feriados. Debe estar en la lista de visitantes aprobados.'
    }
  }
];

// Get all unique states with facilities
export function getStatesWithFacilities(): string[] {
  return [...new Set(detentionFacilities.map(f => f.state))].sort();
}

// Search facilities by state
export function searchFacilitiesByState(state: string): DetentionFacility[] {
  return detentionFacilities.filter(f => f.state === state);
}

// Search facilities by name or city
export function searchFacilities(query: string): DetentionFacility[] {
  const normalizedQuery = query.toLowerCase().trim();
  return detentionFacilities.filter(
    f => f.name.toLowerCase().includes(normalizedQuery) ||
         f.city.toLowerCase().includes(normalizedQuery) ||
         f.state.toLowerCase().includes(normalizedQuery)
  );
}

// Get facility type display name
export function getFacilityTypeName(type: string, lang: 'en' | 'es'): string {
  const types: Record<string, { en: string; es: string }> = {
    IGSA: { en: 'County Jail (IGSA)', es: 'Cárcel del Condado (IGSA)' },
    CDF: { en: 'Contract Detention Facility', es: 'Centro de Detención por Contrato' },
    USMS: { en: 'US Marshals Facility', es: 'Centro de US Marshals' },
    SPC: { en: 'Service Processing Center', es: 'Centro de Procesamiento' },
    FRC: { en: 'Family Residential Center', es: 'Centro Residencial Familiar' }
  };
  return types[type]?.[lang] || type;
}
