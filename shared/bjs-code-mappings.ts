/**
 * BJS NCVS Data Code Mappings
 * 
 * These mappings translate coded values from the BJS NCVS API
 * into human-readable categories.
 * 
 * Source: NCVS Select Person Level Codebook
 * https://bjs.ojp.gov/document/NCVS_Select_person_level_codebook.pdf
 */

export const NCVS_OFFENSE_CODES = {
  '1': 'Rape',
  '2': 'Sexual Assault',
  '3': 'Robbery',
  '4': 'Assault',
  '5': 'Personal Theft',
} as const;

export const NCVS_PROPERTY_CODES = {
  '1': 'Burglary',
  '2': 'Motor Vehicle Theft',
  '3': 'Theft',
} as const;

export const NCVS_SEX_CODES = {
  '1': 'Male',
  '2': 'Female',
} as const;

export const NCVS_AGE_GROUPS = {
  '1': '12-14',
  '2': '15-17',
  '3': '18-20',
  '4': '21-24',
  '5': '25-34',
  '6': '35-49',
  '7': '50-64',
  '8': '65+',
} as const;

export const NCVS_RACE_CODES = {
  '1': 'White',
  '2': 'Black',
  '3': 'American Indian/Alaska Native',
  '4': 'Asian',
  '5': 'Native Hawaiian/Pacific Islander',
} as const;

/**
 * Crime category classifications
 */
export const CRIME_CATEGORIES = {
  VIOLENT: ['1', '2', '3', '4'], // Rape, Sexual Assault, Robbery, Assault
  PROPERTY: ['5'], // Personal Theft (from person-level data)
  RAPE_SEXUAL_ASSAULT: ['1', '2'],
  ROBBERY: ['3'],
  ASSAULT: ['4'],
  THEFT: ['5'],
} as const;

/**
 * Check if an offense code represents a violent crime
 */
export function isViolentCrime(offenseCode: string): boolean {
  return (CRIME_CATEGORIES.VIOLENT as readonly string[]).includes(offenseCode);
}

/**
 * Check if an offense code represents a property crime
 */
export function isPropertyCrime(offenseCode: string): boolean {
  return (CRIME_CATEGORIES.PROPERTY as readonly string[]).includes(offenseCode);
}

/**
 * Get human-readable offense name
 */
export function getOffenseName(offenseCode: string): string {
  return NCVS_OFFENSE_CODES[offenseCode as keyof typeof NCVS_OFFENSE_CODES] || 'Unknown';
}

/**
 * Get human-readable property crime name
 */
export function getPropertyCrimeName(propertyCode: string): string {
  return NCVS_PROPERTY_CODES[propertyCode as keyof typeof NCVS_PROPERTY_CODES] || 'Unknown';
}
