export interface ServiceRecommendation {
  organizationType: string;
  services: string[];
  priority: 'high' | 'medium' | 'low';
}

export const CHARGE_CATEGORY_TO_SERVICES: Record<string, ServiceRecommendation[]> = {
  'dui': [
    { organizationType: 'criminal_defense', services: ['DUI Defense', 'Traffic Offenses', 'Criminal Defense'], priority: 'high' },
    { organizationType: 'civil_legal_aid', services: ['License Restoration', 'DMV Hearings'], priority: 'medium' }
  ],
  'drug': [
    { organizationType: 'criminal_defense', services: ['Drug Offense Defense', 'Criminal Defense'], priority: 'high' },
    { organizationType: 'civil_legal_aid', services: ['Diversion Programs', 'Drug Court'], priority: 'high' }
  ],
  'theft': [
    { organizationType: 'criminal_defense', services: ['Theft Defense', 'Property Crimes', 'Criminal Defense'], priority: 'high' },
    { organizationType: 'civil_legal_aid', services: ['Restitution', 'Diversion Programs'], priority: 'medium' }
  ],
  'assault': [
    { organizationType: 'criminal_defense', services: ['Assault Defense', 'Violent Crimes', 'Criminal Defense'], priority: 'high' }
  ],
  'domestic_violence': [
    { organizationType: 'criminal_defense', services: ['Domestic Violence Defense', 'Criminal Defense'], priority: 'high' },
    { organizationType: 'civil_legal_aid', services: ['Protective Orders', 'Family Law'], priority: 'high' }
  ],
  'fraud': [
    { organizationType: 'criminal_defense', services: ['White Collar Defense', 'Fraud Defense', 'Criminal Defense'], priority: 'high' }
  ],
  'immigration': [
    { organizationType: 'immigration', services: ['Deportation Defense', 'Immigration Court', 'Asylum'], priority: 'high' },
    { organizationType: 'civil_legal_aid', services: ['Immigration', 'Naturalization'], priority: 'high' }
  ],
  'traffic': [
    { organizationType: 'criminal_defense', services: ['Traffic Violations', 'Criminal Defense'], priority: 'medium' }
  ],
  'weapons': [
    { organizationType: 'criminal_defense', services: ['Weapons Charges', 'Criminal Defense'], priority: 'high' }
  ],
  'sex_offenses': [
    { organizationType: 'criminal_defense', services: ['Sex Offense Defense', 'Criminal Defense'], priority: 'high' }
  ],
  'homicide': [
    { organizationType: 'criminal_defense', services: ['Homicide Defense', 'Capital Defense', 'Criminal Defense'], priority: 'high' },
    { organizationType: 'public_defender', services: ['Felony Defense'], priority: 'high' }
  ],
  'robbery': [
    { organizationType: 'criminal_defense', services: ['Robbery Defense', 'Violent Crimes', 'Criminal Defense'], priority: 'high' }
  ],
  'burglary': [
    { organizationType: 'criminal_defense', services: ['Burglary Defense', 'Property Crimes', 'Criminal Defense'], priority: 'high' }
  ],
  'default': [
    { organizationType: 'criminal_defense', services: ['Criminal Defense'], priority: 'high' },
    { organizationType: 'public_defender', services: ['Criminal Defense'], priority: 'high' },
    { organizationType: 'civil_legal_aid', services: ['Legal Aid'], priority: 'medium' }
  ]
};

export function getRecommendedServicesForCharges(chargeCategories: string[]): ServiceRecommendation[] {
  const recommendations: ServiceRecommendation[] = [];
  const seenTypes = new Set<string>();

  for (const category of chargeCategories) {
    const categoryLower = category.toLowerCase().replace(/[_\s-]+/g, '_');
    const categoryRecs = CHARGE_CATEGORY_TO_SERVICES[categoryLower] || [];
    
    for (const rec of categoryRecs) {
      if (!seenTypes.has(rec.organizationType)) {
        recommendations.push(rec);
        seenTypes.add(rec.organizationType);
      }
    }
  }

  if (recommendations.length === 0) {
    return CHARGE_CATEGORY_TO_SERVICES['default'];
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function getServicesQueryString(chargeCategories: string[]): string {
  const recommendations = getRecommendedServicesForCharges(chargeCategories);
  const allServices = new Set<string>();
  
  for (const rec of recommendations) {
    for (const service of rec.services) {
      allServices.add(service);
    }
  }
  
  return Array.from(allServices).join(',');
}

export function mapChargeNameToCategory(chargeName: string): string {
  const nameLower = chargeName.toLowerCase();
  
  if (nameLower.includes('dui') || nameLower.includes('dwi') || nameLower.includes('driving under')) {
    return 'dui';
  }
  if (nameLower.includes('drug') || nameLower.includes('controlled substance') || nameLower.includes('possession') || nameLower.includes('narcotic')) {
    return 'drug';
  }
  if (nameLower.includes('theft') || nameLower.includes('larceny') || nameLower.includes('shoplifting') || nameLower.includes('stealing')) {
    return 'theft';
  }
  if (nameLower.includes('assault') || nameLower.includes('battery')) {
    return 'assault';
  }
  if (nameLower.includes('domestic') || nameLower.includes('spousal')) {
    return 'domestic_violence';
  }
  if (nameLower.includes('fraud') || nameLower.includes('forgery') || nameLower.includes('embezzlement')) {
    return 'fraud';
  }
  if (nameLower.includes('immigration') || nameLower.includes('deportation') || nameLower.includes('visa')) {
    return 'immigration';
  }
  if (nameLower.includes('traffic') || nameLower.includes('speeding') || nameLower.includes('reckless driving')) {
    return 'traffic';
  }
  if (nameLower.includes('weapon') || nameLower.includes('firearm') || nameLower.includes('gun')) {
    return 'weapons';
  }
  if (nameLower.includes('sex') || nameLower.includes('rape') || nameLower.includes('molestation')) {
    return 'sex_offenses';
  }
  if (nameLower.includes('murder') || nameLower.includes('homicide') || nameLower.includes('manslaughter')) {
    return 'homicide';
  }
  if (nameLower.includes('robbery')) {
    return 'robbery';
  }
  if (nameLower.includes('burglary') || nameLower.includes('breaking and entering')) {
    return 'burglary';
  }
  
  return 'default';
}
