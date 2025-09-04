// California and Federal Criminal Charges Database
// Based on California Penal Code and Title 18 USC

export interface CriminalCharge {
  id: string;
  name: string;
  code: string;
  jurisdiction: 'CA' | 'Federal';
  category: 'felony' | 'misdemeanor' | 'infraction';
  description: string;
  maxPenalty: string;
  commonDefenses: string[];
  evidenceToGather: string[];
  specificRights: string[];
  urgentActions: string[];
}

export const criminalCharges: CriminalCharge[] = [
  // California Penal Code - Common Charges
  {
    id: 'ca-pc-211',
    name: 'Robbery',
    code: 'PC 211',
    jurisdiction: 'CA',
    category: 'felony',
    description: 'Taking personal property from another person through force or fear',
    maxPenalty: '2-9 years in state prison',
    commonDefenses: ['Lack of intent to steal', 'No force or fear used', 'Mistaken identity', 'False accusation'],
    evidenceToGather: ['Security footage', 'Alibi witnesses', 'Cell phone records', 'Financial records', 'Medical records'],
    specificRights: ['Right to remain silent during lineup', 'Right to attorney during questioning'],
    urgentActions: ['Do not discuss case with anyone', 'Preserve alibi evidence', 'Contact witnesses immediately']
  },
  {
    id: 'ca-pc-459',
    name: 'Burglary',
    code: 'PC 459',
    jurisdiction: 'CA',
    category: 'felony',
    description: 'Entering a structure with intent to commit theft or felony',
    maxPenalty: '2-6 years in state prison',
    commonDefenses: ['No intent to commit crime', 'Permission to enter', 'Mistaken identity'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress illegally obtained evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'ca-pc-242',
    name: 'Battery',
    code: 'PC 242',
    jurisdiction: 'CA',
    category: 'misdemeanor',
    description: 'Unlawful use of force or violence upon another person',
    maxPenalty: '6 months in county jail and/or $2,000 fine',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent', 'False accusation'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Photos of injuries', 'Security footage'],
    specificRights: ['Right to medical examination', 'Right to photograph your injuries'],
    urgentActions: ['Seek medical attention', 'Document your injuries', 'Gather witness information']
  },
  {
    id: 'ca-pc-245',
    name: 'Assault with Deadly Weapon',
    code: 'PC 245(a)(1)',
    jurisdiction: 'CA',
    category: 'felony',
    description: 'Assault with a deadly weapon or instrument',
    maxPenalty: '2-4 years in state prison',
    commonDefenses: ['Self-defense', 'No deadly weapon used', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Weapon analysis', 'Expert testimony', 'Character witnesses'],
    specificRights: ['Right to independent medical examination', 'Right to weapon testing'],
    urgentActions: ['Preserve evidence of self-defense', 'Document circumstances']
  },
  {
    id: 'ca-hs-11350',
    name: 'Possession of Controlled Substance',
    code: 'HS 11350',
    jurisdiction: 'CA',
    category: 'misdemeanor',
    description: 'Unlawful possession of controlled substances',
    maxPenalty: '1 year in county jail and/or $1,000 fine',
    commonDefenses: ['Lack of knowledge', 'Lack of possession', 'Invalid search', 'Prescription defense'],
    evidenceToGather: ['Prescription records', 'Medical documentation', 'Chain of custody records'],
    specificRights: ['Right to challenge search and seizure', 'Right to drug treatment programs'],
    urgentActions: ['Gather prescription documentation', 'Document medical conditions']
  },
  {
    id: 'ca-vc-23152',
    name: 'Driving Under the Influence (DUI)',
    code: 'VC 23152(a)',
    jurisdiction: 'CA',
    category: 'misdemeanor',
    description: 'Driving under the influence of alcohol or drugs',
    maxPenalty: '6 months in jail, $1,000 fine, license suspension',
    commonDefenses: ['Rising blood alcohol', 'Medical conditions', 'Improper testing', 'No probable cause'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video footage', 'Calibration records'],
    specificRights: ['Right to independent blood test', 'Right to DMV hearing'],
    urgentActions: ['Request DMV hearing within 10 days', 'Preserve evidence of sobriety']
  },
  {
    id: 'ca-pc-273.5',
    name: 'Domestic Violence',
    code: 'PC 273.5',
    jurisdiction: 'CA',
    category: 'felony',
    description: 'Inflicting corporal injury on intimate partner',
    maxPenalty: '2-4 years in state prison',
    commonDefenses: ['Self-defense', 'False accusation', 'Lack of intent', 'Mutual combat'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Text messages', 'Witness statements'],
    specificRights: ['Right to protective order hearing', 'Right to court-appointed advocate'],
    urgentActions: ['Document your injuries', 'Preserve communication records', 'Understand restraining orders']
  },

  // Federal Charges - Title 18 USC
  {
    id: 'fed-18-1341',
    name: 'Mail Fraud',
    code: '18 USC 1341',
    jurisdiction: 'Federal',
    category: 'felony',
    description: 'Using mail system to execute fraudulent scheme',
    maxPenalty: '20 years federal prison and/or $250,000 fine',
    commonDefenses: ['Lack of intent to defraud', 'Good faith', 'No use of mail system'],
    evidenceToGather: ['Financial records', 'Communication records', 'Expert testimony', 'Character witnesses'],
    specificRights: ['Right to federal defender', 'Right to challenge federal jurisdiction'],
    urgentActions: ['Preserve business records', 'Contact federal defense attorney']
  },
  {
    id: 'fed-18-1030',
    name: 'Computer Fraud',
    code: '18 USC 1030',
    jurisdiction: 'Federal',
    category: 'felony',
    description: 'Accessing computers to obtain information or cause damage',
    maxPenalty: '10 years federal prison and/or $250,000 fine',
    commonDefenses: ['Authorization to access', 'Lack of intent', 'No damage caused'],
    evidenceToGather: ['Computer logs', 'Authorization records', 'Technical expert testimony'],
    specificRights: ['Right to computer forensics expert', 'Right to challenge digital evidence'],
    urgentActions: ['Preserve computer evidence', 'Document authorization']
  },
  {
    id: 'fed-18-922',
    name: 'Illegal Firearm Possession',
    code: '18 USC 922',
    jurisdiction: 'Federal',
    category: 'felony',
    description: 'Unlawful possession of firearms by prohibited persons',
    maxPenalty: '10 years federal prison',
    commonDefenses: ['Lack of knowledge of prohibition', 'Constitutional challenges', 'Entrapment'],
    evidenceToGather: ['Background records', 'Purchase documentation', 'Mental health records'],
    specificRights: ['Right to Second Amendment challenge', 'Right to mental health evaluation'],
    urgentActions: ['Gather background documentation', 'Document circumstances of possession']
  },
  {
    id: 'fed-18-371',
    name: 'Conspiracy',
    code: '18 USC 371',
    jurisdiction: 'Federal',
    category: 'felony',
    description: 'Conspiracy to commit offense against United States',
    maxPenalty: '5 years federal prison and/or $250,000 fine',
    commonDefenses: ['No agreement', 'Withdrawal from conspiracy', 'Lack of overt act'],
    evidenceToGather: ['Communication records', 'Timeline documentation', 'Witness statements'],
    specificRights: ['Right to challenge co-conspirator statements', 'Right to severance'],
    urgentActions: ['Document your role', 'Preserve exonerating communications']
  },
  {
    id: 'fed-21-841',
    name: 'Drug Trafficking',
    code: '21 USC 841',
    jurisdiction: 'Federal',
    category: 'felony',
    description: 'Manufacturing, distributing, or possessing controlled substances',
    maxPenalty: 'Life imprisonment (depending on quantity)',
    commonDefenses: ['Lack of knowledge', 'Entrapment', 'Invalid search', 'Minimal role'],
    evidenceToGather: ['Medical records', 'Financial records', 'Chain of custody documentation'],
    specificRights: ['Right to challenge quantity allegations', 'Right to safety valve provisions'],
    urgentActions: ['Document medical prescriptions', 'Preserve evidence of minimal involvement']
  },

  // Additional California Common Charges
  {
    id: 'ca-pc-487',
    name: 'Grand Theft',
    code: 'PC 487',
    jurisdiction: 'CA',
    category: 'felony',
    description: 'Theft of property worth more than $950',
    maxPenalty: '1-3 years in state prison',
    commonDefenses: ['Claim of right', 'Lack of intent to steal', 'Value under threshold'],
    evidenceToGather: ['Receipts', 'Ownership documentation', 'Appraisal records'],
    specificRights: ['Right to property valuation expert', 'Right to restitution hearing'],
    urgentActions: ['Gather proof of ownership or permission', 'Document value of items']
  },
  {
    id: 'ca-pc-314',
    name: 'Indecent Exposure',
    code: 'PC 314',
    jurisdiction: 'CA',
    category: 'misdemeanor',
    description: 'Willful exposure of genitals in public place',
    maxPenalty: '6 months in county jail and/or $1,000 fine',
    commonDefenses: ['Lack of intent', 'No lewd intent', 'Private location'],
    evidenceToGather: ['Witness statements', 'Video evidence', 'Medical records'],
    specificRights: ['Right to sex offender registration hearing', 'Right to mental health evaluation'],
    urgentActions: ['Document circumstances', 'Gather character witnesses']
  },
  {
    id: 'ca-pc-647',
    name: 'Disorderly Conduct',
    code: 'PC 647',
    jurisdiction: 'CA',
    category: 'misdemeanor',
    description: 'Various forms of disorderly conduct including prostitution, public intoxication',
    maxPenalty: '6 months in county jail and/or $1,000 fine',
    commonDefenses: ['Lack of intent', 'Constitutional challenges', 'Entrapment'],
    evidenceToGather: ['Witness statements', 'Video evidence', 'Medical records'],
    specificRights: ['Right to challenge vague statute', 'Right to diversion programs'],
    urgentActions: ['Document circumstances', 'Seek substance abuse treatment if applicable']
  }
];

export const chargeCategories = {
  'Violent Crimes': ['ca-pc-211', 'ca-pc-245', 'ca-pc-242', 'ca-pc-273.5'],
  'Property Crimes': ['ca-pc-459', 'ca-pc-487'],
  'Drug Crimes': ['ca-hs-11350', 'fed-21-841'],
  'Federal Crimes': ['fed-18-1341', 'fed-18-1030', 'fed-18-922', 'fed-18-371'],
  'Traffic/DUI': ['ca-vc-23152'],
  'Public Order': ['ca-pc-314', 'ca-pc-647']
};

export function getChargeById(id: string): CriminalCharge | undefined {
  return criminalCharges.find(charge => charge.id === id);
}

export function getChargesByJurisdiction(jurisdiction: 'CA' | 'Federal'): CriminalCharge[] {
  return criminalCharges.filter(charge => charge.jurisdiction === jurisdiction);
}

export function getChargesByCategory(category: string): CriminalCharge[] {
  const chargeIds = chargeCategories[category as keyof typeof chargeCategories] || [];
  return chargeIds.map(id => getChargeById(id)).filter(Boolean) as CriminalCharge[];
}