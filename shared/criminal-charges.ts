// California and Federal Criminal Charges Database
// Based on California Penal Code and Title 18 USC

export interface CriminalCharge {
  id: string;
  name: string;
  code: string;
  jurisdiction: 'CA' | 'Federal' | 'TX' | 'FL' | 'NY' | 'PA' | 'IL' | 'OH' | 'GA' | 'NC' | 'MI' | 'NJ' | 'VA' | 'WA' | 'AZ' | 'MA' | 'TN' | 'IN' | 'MD' | 'MO' | 'WI' | 'CO' | 'MN' | 'SC' | 'AL' | 'LA' | 'KY' | 'OR' | 'OK' | 'CT' | 'IA' | 'MS' | 'AR' | 'UT' | 'KS' | 'NV' | 'NM' | 'NE' | 'WV' | 'ID' | 'HI' | 'NH' | 'ME' | 'MT' | 'RI' | 'DE' | 'SD' | 'ND' | 'AK' | 'VT' | 'WY';
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
  },

  // Texas Penal Code - Common Charges
  {
    id: 'tx-pc-31.03',
    name: 'Theft',
    code: 'PC 31.03',
    jurisdiction: 'TX',
    category: 'felony',
    description: 'Unlawfully appropriating property with intent to deprive owner',
    maxPenalty: 'Class C Misdemeanor to 1st Degree Felony (5-99 years)',
    commonDefenses: ['Lack of intent', 'Claim of right', 'Consent of owner'],
    evidenceToGather: ['Receipts', 'Ownership documents', 'Witness statements', 'Value appraisals'],
    specificRights: ['Right to restitution hearing', 'Right to character evidence'],
    urgentActions: ['Gather proof of ownership or permission', 'Document circumstances']
  },
  {
    id: 'tx-pc-22.01',
    name: 'Assault',
    code: 'PC 22.01',
    jurisdiction: 'TX',
    category: 'misdemeanor',
    description: 'Intentionally, knowingly, or recklessly causing bodily injury',
    maxPenalty: 'Class C Misdemeanor to 3rd Degree Felony',
    commonDefenses: ['Self-defense', 'Defense of third person', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Witness testimony'],
    specificRights: ['Right to self-defense claim', 'Right to medical examination'],
    urgentActions: ['Document self-defense circumstances', 'Preserve medical evidence']
  },
  {
    id: 'tx-pc-30.02',
    name: 'Burglary',
    code: 'PC 30.02',
    jurisdiction: 'TX',
    category: 'felony',
    description: 'Entering building without consent with intent to commit theft, assault, or felony',
    maxPenalty: 'State Jail Felony to 1st Degree Felony (5-99 years)',
    commonDefenses: ['Lack of intent to commit crime', 'Permission to enter', 'Mistaken identity'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress illegally obtained evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'tx-pc-49.04',
    name: 'Driving While Intoxicated (DWI)',
    code: 'PC 49.04',
    jurisdiction: 'TX',
    category: 'misdemeanor',
    description: 'Operating motor vehicle in public while intoxicated (BAC 0.08+ or impaired)',
    maxPenalty: 'Class B Misdemeanor to 3rd Degree Felony (2-10 years)',
    commonDefenses: ['Faulty BAC testing', 'Medical conditions', 'Improper stop'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video evidence'],
    specificRights: ['Right to independent BAC test', 'Right to refuse field sobriety tests'],
    urgentActions: ['Request independent blood test', 'Document medical conditions']
  },

  // Florida Statutes - Common Charges  
  {
    id: 'fl-812.014-petit',
    name: 'Petit Theft',
    code: 'FS 812.014',
    jurisdiction: 'FL',
    category: 'misdemeanor',
    description: 'Theft of property valued under $750',
    maxPenalty: '2nd degree misdemeanor (under $100) to 1st degree misdemeanor ($100-$750)',
    commonDefenses: ['Lack of intent to steal', 'Good faith belief of ownership'],
    evidenceToGather: ['Purchase receipts', 'Ownership documentation', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Secure witness statements']
  },
  {
    id: 'fl-812.014-grand',
    name: 'Grand Theft',
    code: 'FS 812.014',
    jurisdiction: 'FL',
    category: 'felony',
    description: 'Theft of property valued $750 or more',
    maxPenalty: '3rd Degree Felony ($750-$20K) to 1st Degree Felony ($100K+)',
    commonDefenses: ['Lack of intent to steal', 'Good faith belief of ownership'],
    evidenceToGather: ['Purchase receipts', 'Ownership documentation', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Secure witness statements']
  },
  {
    id: 'fl-784.03',
    name: 'Battery',
    code: 'FS 784.03',
    jurisdiction: 'FL',
    category: 'misdemeanor',
    description: 'Actually and intentionally touching another person against their will',
    maxPenalty: '1st degree misdemeanor (up to 1 year jail, $1,000 fine)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Consent', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Video surveillance', 'Witness statements'],
    specificRights: ['Right to Stand Your Ground defense', 'Right to jury trial'],
    urgentActions: ['Document defensive circumstances', 'Preserve evidence of threats']
  },
  {
    id: 'fl-810.02',
    name: 'Burglary',
    code: 'FS 810.02',
    jurisdiction: 'FL',
    category: 'felony',
    description: 'Entering or remaining in dwelling/structure/conveyance with intent to commit crime',
    maxPenalty: '3rd Degree Felony (unoccupied) to Life Felony (armed)',
    commonDefenses: ['Lack of intent to commit crime', 'Permission to enter', 'Mistake of fact'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'fl-316.193',
    name: 'Driving Under the Influence (DUI)',
    code: 'FS 316.193',
    jurisdiction: 'FL',
    category: 'misdemeanor',
    description: 'Operating a vehicle while under the influence of alcohol or drugs',
    maxPenalty: 'Up to 6 months jail (1st offense) to 3rd Degree Felony (3rd offense)',
    commonDefenses: ['Faulty BAC testing', 'Medical conditions', 'Improper stop'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video evidence'],
    specificRights: ['Right to independent BAC test', 'Right to refuse field sobriety tests'],
    urgentActions: ['Request independent blood test', 'Document medical conditions']
  },

  // New York Penal Law - Common Charges
  {
    id: 'ny-pl-155.25',
    name: 'Petit Larceny',
    code: 'PL 155.25',
    jurisdiction: 'NY',
    category: 'misdemeanor',
    description: 'Stealing property valued at $1,000 or less',
    maxPenalty: 'Class A misdemeanor (up to 1 year jail, 3 years probation)',
    commonDefenses: ['Lack of intent to steal', 'Claim of right', 'Mistaken identity'],
    evidenceToGather: ['Receipts', 'Alibi evidence', 'Character references'],
    specificRights: ['Right to speedy trial', 'Right to suppress evidence'],
    urgentActions: ['Gather alibi documentation', 'Preserve purchase records']
  },
  {
    id: 'ny-pl-155.30',
    name: 'Grand Larceny in the Fourth Degree',
    code: 'PL 155.30',
    jurisdiction: 'NY',
    category: 'felony',
    description: 'Stealing property valued over $1,000 but not more than $3,000',
    maxPenalty: 'Class E felony (up to 4 years prison)',
    commonDefenses: ['Lack of intent to steal', 'Claim of right', 'Mistaken identity'],
    evidenceToGather: ['Receipts', 'Alibi evidence', 'Value assessments'],
    specificRights: ['Right to speedy trial', 'Right to suppress evidence'],
    urgentActions: ['Gather alibi documentation', 'Preserve purchase records']
  },
  {
    id: 'ny-pl-120.00',
    name: 'Assault in the Third Degree',
    code: 'PL 120.00',
    jurisdiction: 'NY',
    category: 'misdemeanor',
    description: 'Intentionally causing physical injury to another person',
    maxPenalty: 'Class A misdemeanor (up to 1 year jail, 3 years probation)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Justification'],
    evidenceToGather: ['Medical records', 'Photos of scene', 'Witness statements'],
    specificRights: ['Right to justification defense', 'Right to medical records'],
    urgentActions: ['Document injuries', 'Preserve evidence of self-defense']
  },
  {
    id: 'ny-pl-140.20',
    name: 'Burglary in the Third Degree',
    code: 'PL 140.20',
    jurisdiction: 'NY',
    category: 'felony',
    description: 'Knowingly entering/remaining unlawfully in building with intent to commit crime',
    maxPenalty: 'Class D non-violent felony (up to 7 years prison)',
    commonDefenses: ['Lack of intent to commit crime', 'Permission to enter', 'Mistake of fact'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'ny-vtl-1192',
    name: 'Driving While Intoxicated (DWI)',
    code: 'VTL 1192',
    jurisdiction: 'NY',
    category: 'misdemeanor',
    description: 'Operating motor vehicle with BAC .08% or higher',
    maxPenalty: 'Class A misdemeanor (up to 1 year jail) to Class D felony (repeat offenses)',
    commonDefenses: ['Faulty BAC testing', 'Medical conditions', 'Improper stop'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video evidence'],
    specificRights: ['Right to independent BAC test', 'Right to refuse field sobriety tests'],
    urgentActions: ['Request independent blood test', 'Document medical conditions']
  },

  // Pennsylvania Criminal Code - Common Charges
  {
    id: 'pa-18-3921',
    name: 'Theft by Unlawful Taking',
    code: '18 Pa.C.S. § 3921',
    jurisdiction: 'PA',
    category: 'felony',
    description: 'Unlawfully taking movable property of another',
    maxPenalty: 'Summary offense (under $50) to 1st Degree Felony ($500K+)',
    commonDefenses: ['Lack of intent to steal', 'Claim of right', 'Consent of owner'],
    evidenceToGather: ['Receipts', 'Ownership documents', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Secure witness statements']
  },
  {
    id: 'pa-18-2701',
    name: 'Simple Assault',
    code: '18 Pa.C.S. § 2701',
    jurisdiction: 'PA',
    category: 'misdemeanor',
    description: 'Causing bodily injury intentionally, knowingly, or recklessly',
    maxPenalty: '3rd degree misdemeanor (up to 1 year jail, $2,500 fine)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to medical examination'],
    urgentActions: ['Document self-defense circumstances', 'Preserve medical evidence']
  },
  {
    id: 'pa-18-3502',
    name: 'Burglary',
    code: '18 Pa.C.S. § 3502',
    jurisdiction: 'PA',
    category: 'felony',
    description: 'Entering building or structure with intent to commit crime therein',
    maxPenalty: '3rd Degree Felony to 1st Degree Felony (up to 20 years)',
    commonDefenses: ['Lack of intent to commit crime', 'Permission to enter', 'Mistake of fact'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'pa-75-3802',
    name: 'Driving Under the Influence (DUI)',
    code: '75 Pa.C.S. § 3802',
    jurisdiction: 'PA',
    category: 'misdemeanor',
    description: 'Operating vehicle under influence of alcohol or controlled substances',
    maxPenalty: '6 months probation (1st offense) to 1-5 years prison (3rd+ offense felony)',
    commonDefenses: ['Faulty BAC testing', 'Medical conditions', 'Improper stop'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video evidence'],
    specificRights: ['Right to independent BAC test', 'Right to refuse field sobriety tests'],
    urgentActions: ['Request independent blood test', 'Document medical conditions']
  },

  // Illinois Criminal Code - Common Charges
  {
    id: 'il-720-5-16-1',
    name: 'Theft',
    code: '720 ILCS 5/16-1',
    jurisdiction: 'IL',
    category: 'felony',
    description: 'Knowingly obtaining or exerting unauthorized control over property',
    maxPenalty: 'Class A Misdemeanor ($500 or less) to Class 1 Felony ($10K-$100K)',
    commonDefenses: ['Lack of intent to steal', 'Claim of right', 'Consent of owner'],
    evidenceToGather: ['Receipts', 'Ownership documents', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Secure witness statements']
  },
  {
    id: 'il-720-5-12-3',
    name: 'Battery',
    code: '720 ILCS 5/12-3',
    jurisdiction: 'IL',
    category: 'misdemeanor',
    description: 'Knowingly without legal justification making physical contact or causing bodily harm',
    maxPenalty: 'Class A Misdemeanor (up to 364 days jail, $2,500 fine)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to medical examination'],
    urgentActions: ['Document self-defense circumstances', 'Preserve medical evidence']
  },
  {
    id: 'il-720-5-19-1',
    name: 'Burglary',
    code: '720 ILCS 5/19-1',
    jurisdiction: 'IL',
    category: 'felony',
    description: 'Knowingly entering or remaining unlawfully in building with intent to commit felony or theft',
    maxPenalty: 'Class 2 Felony (3-7 years) to Class 1 Felony (4-15 years for residential)',
    commonDefenses: ['Lack of intent to commit crime', 'Permission to enter', 'Mistake of fact'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'il-625-5-11-501',
    name: 'Driving Under the Influence (DUI)',
    code: '625 ILCS 5/11-501',
    jurisdiction: 'IL',
    category: 'misdemeanor',
    description: 'Operating vehicle while under influence of alcohol, drugs, or with BAC 0.08%+',
    maxPenalty: 'Class A Misdemeanor (up to 364 days) to Class 1 Felony (aggravated DUI)',
    commonDefenses: ['Faulty BAC testing', 'Medical conditions', 'Improper stop'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video evidence'],
    specificRights: ['Right to independent BAC test', 'Right to refuse field sobriety tests'],
    urgentActions: ['Request independent blood test', 'Document medical conditions']
  }
];

export const chargeCategories = {
  'Violent Crimes': ['ca-pc-211', 'ca-pc-245', 'ca-pc-242', 'ca-pc-273.5', 'tx-pc-22.01', 'fl-784.03', 'ny-pl-120.00', 'pa-18-2701', 'il-720-5-12-3'],
  'Property Crimes': ['ca-pc-459', 'ca-pc-487', 'tx-pc-31.03', 'tx-pc-30.02', 'fl-812.014-petit', 'fl-812.014-grand', 'fl-810.02', 'ny-pl-155.25', 'ny-pl-155.30', 'ny-pl-140.20', 'pa-18-3921', 'pa-18-3502', 'il-720-5-16-1', 'il-720-5-19-1'],
  'Drug Crimes': ['ca-hs-11350', 'fed-21-841'],
  'Federal Crimes': ['fed-18-1341', 'fed-18-1030', 'fed-18-922', 'fed-18-371'],
  'Traffic/DUI': ['ca-vc-23152', 'tx-pc-49.04', 'fl-316.193', 'ny-vtl-1192', 'pa-75-3802', 'il-625-5-11-501'],
  'Public Order': ['ca-pc-314', 'ca-pc-647']
};

export function getChargeById(id: string): CriminalCharge | undefined {
  return criminalCharges.find(charge => charge.id === id);
}

export function getChargesByJurisdiction(jurisdiction: string): CriminalCharge[] {
  if (jurisdiction === 'federal') {
    return criminalCharges.filter(charge => charge.jurisdiction === 'Federal');
  }
  
  // Return both state-specific charges and federal charges
  return criminalCharges.filter(charge => 
    charge.jurisdiction === jurisdiction.toUpperCase() || charge.jurisdiction === 'Federal'
  );
}

export function getChargesByCategory(category: string): CriminalCharge[] {
  const chargeIds = chargeCategories[category as keyof typeof chargeCategories] || [];
  return chargeIds.map(id => getChargeById(id)).filter(Boolean) as CriminalCharge[];
}