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
  {
    id: 'tx-hs-481.115',
    name: 'Possession of Controlled Substance - Penalty Group 1',
    code: 'HS 481.115',
    jurisdiction: 'TX',
    category: 'felony',
    description: 'Possession of cocaine, heroin, methamphetamine, fentanyl',
    maxPenalty: 'State Jail Felony (under 1g) to Enhanced 1st Degree Felony (400g+)',
    commonDefenses: ['Lack of knowledge', 'Lack of possession', 'Unlawful search'],
    evidenceToGather: ['Lab results', 'Chain of custody', 'Search warrant'],
    specificRights: ['Right to challenge search', 'Right to test evidence'],
    urgentActions: ['Challenge search and seizure', 'Request substance testing']
  },
  {
    id: 'tx-pc-29.02',
    name: 'Robbery',
    code: 'PC 29.02',
    jurisdiction: 'TX',
    category: 'felony',
    description: 'Intentionally threatening or placing another in fear while committing theft',
    maxPenalty: '2nd Degree Felony (2-20 years, $10,000 fine)',
    commonDefenses: ['Lack of intent', 'Self-defense', 'Mistaken identity'],
    evidenceToGather: ['Video surveillance', 'Witness statements', 'Alibi evidence'],
    specificRights: ['Right to confront witnesses', 'Right to cross-examine'],
    urgentActions: ['Gather alibi evidence', 'Document circumstances']
  },
  {
    id: 'tx-pc-46.02',
    name: 'Unlawful Carrying of Weapons',
    code: 'PC 46.02',
    jurisdiction: 'TX',
    category: 'misdemeanor',
    description: 'Intentionally carrying handgun, illegal knife, or club',
    maxPenalty: 'Class A Misdemeanor to 3rd Degree Felony (enhanced)',
    commonDefenses: ['Valid license', 'Lawful carry exception', 'Necessity'],
    evidenceToGather: ['License documentation', 'Witness statements'],
    specificRights: ['Right to show lawful possession', 'Right to constitutional defense'],
    urgentActions: ['Gather license documentation', 'Review carry laws']
  },
  {
    id: 'tx-pc-25.11',
    name: 'Continuous Violence Against Family',
    code: 'PC 25.11',
    jurisdiction: 'TX',
    category: 'felony',
    description: 'Two or more acts of family violence within 12-month period',
    maxPenalty: '3rd Degree Felony (2-10 years, $10,000 fine)',
    commonDefenses: ['Self-defense', 'False allegations', 'Lack of pattern'],
    evidenceToGather: ['Medical records', 'Photos', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to challenge pattern'],
    urgentActions: ['Document defensive circumstances', 'Gather character evidence']
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
  {
    id: 'fl-893.13',
    name: 'Drug Possession',
    code: 'FS 893.13',
    jurisdiction: 'FL',
    category: 'felony',
    description: 'Unlawful possession of controlled substances',
    maxPenalty: '1st degree misdemeanor (under 20g marijuana) to 3rd degree felony',
    commonDefenses: ['Lack of knowledge', 'Unlawful search', 'Medical marijuana defense'],
    evidenceToGather: ['Lab results', 'Medical marijuana card', 'Search warrant'],
    specificRights: ['Right to challenge search', 'Right to medical defense'],
    urgentActions: ['Challenge search and seizure', 'Gather medical documentation']
  },
  {
    id: 'fl-790.23',
    name: 'Felon in Possession of Firearm',
    code: 'FS 790.23',
    jurisdiction: 'FL',
    category: 'felony',
    description: 'Possession of firearm by convicted felon',
    maxPenalty: '2nd degree felony (up to 15 years prison)',
    commonDefenses: ['Restoration of civil rights', 'Lack of knowledge', 'Temporary possession'],
    evidenceToGather: ['Criminal history', 'Rights restoration documents'],
    specificRights: ['Right to show civil rights restoration', 'Right to constitutional defense'],
    urgentActions: ['Check rights restoration status', 'Document circumstances']
  },
  {
    id: 'fl-812.13',
    name: 'Robbery',
    code: 'FS 812.13',
    jurisdiction: 'FL',
    category: 'felony',
    description: 'Taking property from person by force, violence, assault, or fear',
    maxPenalty: '2nd degree felony (up to 15 years prison)',
    commonDefenses: ['Lack of force', 'Consent', 'Mistaken identity'],
    evidenceToGather: ['Video surveillance', 'Witness statements', 'Medical records'],
    specificRights: ['Right to confront witnesses', 'Right to self-defense'],
    urgentActions: ['Gather alibi evidence', 'Document injuries']
  },
  {
    id: 'fl-794.011',
    name: 'Sexual Battery',
    code: 'FS 794.011',
    jurisdiction: 'FL',
    category: 'felony',
    description: 'Oral, anal, or vaginal penetration by force or without consent',
    maxPenalty: 'Life felony to 1st degree felony (up to life prison)',
    commonDefenses: ['Consent', 'Mistaken identity', 'False accusations'],
    evidenceToGather: ['DNA evidence', 'Medical records', 'Communication records'],
    specificRights: ['Right to confront accusers', 'Right to DNA testing'],
    urgentActions: ['Preserve evidence', 'Document consensual relationship']
  },
  {
    id: 'fl-817.568',
    name: 'Identity Theft',
    code: 'FS 817.568',
    jurisdiction: 'FL',
    category: 'felony',
    description: 'Unlawful use of personal identification information',
    maxPenalty: '3rd degree felony (enhanced based on amount and victims)',
    commonDefenses: ['Authorized use', 'Lack of intent', 'Mistaken identity'],
    evidenceToGather: ['Financial records', 'Computer evidence', 'Witness statements'],
    specificRights: ['Right to challenge digital evidence', 'Right to expert testimony'],
    urgentActions: ['Secure digital evidence', 'Document authorized access']
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
  },

  // Ohio Revised Code - Common Charges
  {
    id: 'oh-orc-2913.02',
    name: 'Theft',
    code: 'ORC 2913.02',
    jurisdiction: 'OH',
    category: 'felony',
    description: 'Knowingly obtaining or controlling property without consent',
    maxPenalty: '1st degree misdemeanor (under $1,000) to 1st degree felony ($150K+)',
    commonDefenses: ['Lack of intent to steal', 'Claim of right', 'Consent of owner'],
    evidenceToGather: ['Receipts', 'Ownership documents', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Secure witness statements']
  },
  {
    id: 'oh-orc-2919.25',
    name: 'Domestic Violence',
    code: 'ORC 2919.25',
    jurisdiction: 'OH',
    category: 'misdemeanor',
    description: 'Knowingly causing physical harm to family/household member',
    maxPenalty: '4th degree misdemeanor to 1st degree misdemeanor (up to 180 days)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to medical examination'],
    urgentActions: ['Document self-defense circumstances', 'Preserve medical evidence']
  },
  {
    id: 'oh-orc-2911.12',
    name: 'Burglary',
    code: 'ORC 2911.12',
    jurisdiction: 'OH',
    category: 'felony',
    description: 'Trespassing in occupied structure with purpose to commit criminal offense',
    maxPenalty: '2nd degree felony to 3rd degree felony',
    commonDefenses: ['Lack of intent to commit crime', 'Permission to enter', 'Mistake of fact'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'oh-orc-4511.19',
    name: 'Operating a Vehicle Under the Influence (OVI)',
    code: 'ORC 4511.19',
    jurisdiction: 'OH',
    category: 'misdemeanor',
    description: 'Operating vehicle under influence of alcohol, drugs, or with BAC 0.08%+',
    maxPenalty: '1st degree misdemeanor (mandatory 3 days) to enhanced penalties for high BAC',
    commonDefenses: ['Faulty BAC testing', 'Medical conditions', 'Improper stop'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video evidence'],
    specificRights: ['Right to independent BAC test', 'Right to refuse field sobriety tests'],
    urgentActions: ['Request independent blood test', 'Document medical conditions']
  },

  // Georgia Code - Common Charges
  {
    id: 'ga-16-8-2',
    name: 'Theft by Taking',
    code: 'O.C.G.A. § 16-8-2',
    jurisdiction: 'GA',
    category: 'felony',
    description: 'Unlawfully takes property with intent to deprive owner',
    maxPenalty: 'Misdemeanor (under $1,500) to Felony (1-20 years for $25K+)',
    commonDefenses: ['Lack of intent to steal', 'Claim of right', 'Consent of owner'],
    evidenceToGather: ['Receipts', 'Ownership documents', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Secure witness statements']
  },
  {
    id: 'ga-16-5-20',
    name: 'Simple Assault',
    code: 'O.C.G.A. § 16-5-20',
    jurisdiction: 'GA',
    category: 'misdemeanor',
    description: 'Attempts to commit violent injury or places another in fear',
    maxPenalty: 'Misdemeanor (up to 12 months jail, $1,000 fine)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to medical examination'],
    urgentActions: ['Document self-defense circumstances', 'Preserve medical evidence']
  },
  {
    id: 'ga-16-7-1',
    name: 'Burglary',
    code: 'O.C.G.A. § 16-7-1',
    jurisdiction: 'GA',
    category: 'felony',
    description: 'Enters/remains in dwelling without authority with intent to commit felony/theft',
    maxPenalty: '1st Degree (1-20 years) to 2nd Degree (1-5 years)',
    commonDefenses: ['Lack of intent to commit crime', 'Permission to enter', 'Mistake of fact'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'ga-40-6-391',
    name: 'Driving Under the Influence (DUI)',
    code: 'O.C.G.A. § 40-6-391',
    jurisdiction: 'GA',
    category: 'misdemeanor',
    description: 'Operating vehicle under influence of alcohol or drugs',
    maxPenalty: 'Up to 12 months jail (1st offense) to Felony (4th+ offense)',
    commonDefenses: ['Faulty BAC testing', 'Medical conditions', 'Improper stop'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video evidence'],
    specificRights: ['Right to independent BAC test', 'Right to refuse field sobriety tests'],
    urgentActions: ['Request independent blood test', 'Document medical conditions']
  },

  // North Carolina General Statutes - Common Charges
  {
    id: 'nc-gs-14-72',
    name: 'Larceny',
    code: 'G.S. 14-72',
    jurisdiction: 'NC',
    category: 'felony',
    description: 'Unlawful taking of personal property with intent to deprive owner',
    maxPenalty: 'Class 1 Misdemeanor ($1,000 or less) to Class H Felony (over $1,000)',
    commonDefenses: ['Lack of intent to steal', 'Claim of right', 'Consent of owner'],
    evidenceToGather: ['Receipts', 'Ownership documents', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Secure witness statements']
  },
  {
    id: 'nc-gs-14-32',
    name: 'Simple Assault',
    code: 'G.S. 14-32',
    jurisdiction: 'NC',
    category: 'misdemeanor',
    description: 'Unlawfully assaulting another person',
    maxPenalty: 'Class 2 Misdemeanor to Class A1 Misdemeanor (enhanced)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to medical examination'],
    urgentActions: ['Document self-defense circumstances', 'Preserve medical evidence']
  },
  {
    id: 'nc-gs-14-51',
    name: 'First Degree Burglary',
    code: 'G.S. 14-51',
    jurisdiction: 'NC',
    category: 'felony',
    description: 'Breaking and entering dwelling at night with intent to commit felony',
    maxPenalty: 'Class D Felony (up to 204 months prison)',
    commonDefenses: ['Lack of intent to commit crime', 'Permission to enter', 'Mistake of fact'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'nc-gs-20-138.1',
    name: 'Driving While Impaired (DWI)',
    code: 'G.S. 20-138.1',
    jurisdiction: 'NC',
    category: 'misdemeanor',
    description: 'Operating vehicle while impaired by alcohol or drugs',
    maxPenalty: 'Level V Misdemeanor to Level A1 Misdemeanor (structured sentencing)',
    commonDefenses: ['Faulty BAC testing', 'Medical conditions', 'Improper stop'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video evidence'],
    specificRights: ['Right to independent BAC test', 'Right to refuse field sobriety tests'],
    urgentActions: ['Request independent blood test', 'Document medical conditions']
  },

  // Michigan Compiled Laws - Common Charges
  {
    id: 'mi-mcl-750.356',
    name: 'Larceny',
    code: 'MCL 750.356',
    jurisdiction: 'MI',
    category: 'felony',
    description: 'Unlawful taking of property with intent to permanently deprive owner',
    maxPenalty: 'Misdemeanor (under $200) to 10-year Felony ($20K+ or repeat offender)',
    commonDefenses: ['Lack of intent to steal', 'Claim of right', 'Consent of owner'],
    evidenceToGather: ['Receipts', 'Ownership documents', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Secure witness statements']
  },
  {
    id: 'mi-mcl-750.81',
    name: 'Assault and Battery',
    code: 'MCL 750.81',
    jurisdiction: 'MI',
    category: 'misdemeanor',
    description: 'Unlawfully touching another person or putting them in fear of harm',
    maxPenalty: 'Misdemeanor (up to 93 days jail, $500 fine)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to medical examination'],
    urgentActions: ['Document self-defense circumstances', 'Preserve medical evidence']
  },
  {
    id: 'mi-mcl-750.110',
    name: 'Breaking and Entering',
    code: 'MCL 750.110',
    jurisdiction: 'MI',
    category: 'felony',
    description: 'Breaking and entering building with intent to commit crime',
    maxPenalty: 'Misdemeanor (no intent) to 5-year Felony (with felonious intent)',
    commonDefenses: ['Lack of intent to commit crime', 'Permission to enter', 'Mistake of fact'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'mi-mcl-257.625',
    name: 'Operating While Intoxicated (OWI)',
    code: 'MCL 257.625',
    jurisdiction: 'MI',
    category: 'misdemeanor',
    description: 'Operating vehicle while under influence of alcohol or drugs',
    maxPenalty: 'Misdemeanor (1st/2nd offense) to 5-year Felony (3rd offense)',
    commonDefenses: ['Faulty BAC testing', 'Medical conditions', 'Improper stop'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video evidence'],
    specificRights: ['Right to independent BAC test', 'Right to refuse field sobriety tests'],
    urgentActions: ['Request independent blood test', 'Document medical conditions']
  },

  // Virginia Code - Common Charges
  {
    id: 'va-18.2-95',
    name: 'Grand Larceny',
    code: 'Va. Code § 18.2-95',
    jurisdiction: 'VA',
    category: 'felony',
    description: 'Theft of $5+ from person or $200+ of property or any firearm',
    maxPenalty: '1-20 years prison OR up to 12 months jail and/or $2,500 fine',
    commonDefenses: ['Lack of intent to steal', 'Claim of right', 'Consent of owner'],
    evidenceToGather: ['Receipts', 'Ownership documents', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Secure witness statements']
  },
  {
    id: 'va-18.2-57',
    name: 'Assault and Battery',
    code: 'Va. Code § 18.2-57',
    jurisdiction: 'VA',
    category: 'misdemeanor',
    description: 'Simple assault and battery against another person',
    maxPenalty: 'Class 1 Misdemeanor (up to 12 months jail and/or $2,500 fine)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to medical examination'],
    urgentActions: ['Document self-defense circumstances', 'Preserve medical evidence']
  },
  {
    id: 'va-18.2-89',
    name: 'Burglary',
    code: 'Va. Code § 18.2-89',
    jurisdiction: 'VA',
    category: 'felony',
    description: 'Breaking and entering dwelling at night with intent to commit crime',
    maxPenalty: 'Class 3 Felony (5-20 years, up to $100,000 fine) to Class 2 Felony if armed',
    commonDefenses: ['Lack of intent to commit crime', 'Permission to enter', 'Mistake of fact'],
    evidenceToGather: ['Proof of permission to enter', 'Alibi documentation', 'Witness statements'],
    specificRights: ['Right to challenge search warrant', 'Right to suppress evidence'],
    urgentActions: ['Document your whereabouts', 'Gather proof of legitimate access']
  },
  {
    id: 'va-18.2-266',
    name: 'Driving Under the Influence (DUI)',
    code: 'Va. Code § 18.2-266',
    jurisdiction: 'VA',
    category: 'misdemeanor',
    description: 'Operating vehicle under influence of alcohol or drugs',
    maxPenalty: 'Class 1 Misdemeanor (1st offense) to Class 6 Felony (3rd offense)',
    commonDefenses: ['Faulty BAC testing', 'Medical conditions', 'Improper stop'],
    evidenceToGather: ['Medical records', 'Witness statements', 'Video evidence'],
    specificRights: ['Right to independent BAC test', 'Right to refuse field sobriety tests'],
    urgentActions: ['Request independent blood test', 'Document medical conditions']
  },

  // Additional comprehensive charges for all states
  // Pennsylvania Additional Charges
  {
    id: 'pa-18-3925',
    name: 'Receiving Stolen Property',
    code: '18 Pa.C.S. § 3925',
    jurisdiction: 'PA',
    category: 'felony',
    description: 'Receiving property knowing it was stolen',
    maxPenalty: 'Summary offense (under $50) to 1st Degree Felony ($500K+)',
    commonDefenses: ['Lack of knowledge', 'Good faith purchaser', 'Authorized possession'],
    evidenceToGather: ['Purchase receipts', 'Ownership documents', 'Communication records'],
    specificRights: ['Right to show good faith', 'Right to confront witnesses'],
    urgentActions: ['Gather purchase documentation', 'Document legitimate acquisition']
  },
  {
    id: 'pa-18-6318',
    name: 'Drug Possession',
    code: '18 Pa.C.S. § 6318',
    jurisdiction: 'PA',
    category: 'felony',
    description: 'Unlawful possession of controlled substances',
    maxPenalty: 'Up to 1 year jail (1st offense) to 3 years prison (subsequent)',
    commonDefenses: ['Lack of knowledge', 'Medical necessity', 'Unlawful search'],
    evidenceToGather: ['Lab results', 'Medical records', 'Search warrant'],
    specificRights: ['Right to challenge search', 'Right to medical defense'],
    urgentActions: ['Challenge search and seizure', 'Document medical conditions']
  },
  {
    id: 'pa-18-908',
    name: 'Terroristic Threats',
    code: '18 Pa.C.S. § 908',
    jurisdiction: 'PA',
    category: 'misdemeanor',
    description: 'Threatening to commit violence with intent to terrorize',
    maxPenalty: '1st degree misdemeanor (up to 5 years if public terror)',
    commonDefenses: ['Lack of intent', 'Protected speech', 'No credible threat'],
    evidenceToGather: ['Communication records', 'Witness statements', 'Context evidence'],
    specificRights: ['Right to free speech defense', 'Right to challenge intent'],
    urgentActions: ['Document context', 'Gather character evidence']
  },

  // Illinois Additional Charges
  {
    id: 'il-720-5-12-2',
    name: 'Aggravated Assault',
    code: '720 ILCS 5/12-2',
    jurisdiction: 'IL',
    category: 'felony',
    description: 'Assault with deadly weapon or causing great bodily harm',
    maxPenalty: 'Class 3 Felony (2-5 years prison, $25,000 fine)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Weapon evidence', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to jury trial'],
    urgentActions: ['Document defensive circumstances', 'Preserve evidence']
  },
  {
    id: 'il-720-570-402',
    name: 'Drug Possession',
    code: '720 ILCS 570/402',
    jurisdiction: 'IL',
    category: 'felony',
    description: 'Unlawful possession of controlled substances',
    maxPenalty: 'Class 4 Felony (1-3 years) to Class 1 Felony (4-15 years)',
    commonDefenses: ['Lack of knowledge', 'Medical necessity', 'Unlawful search'],
    evidenceToGather: ['Lab results', 'Medical records', 'Search documentation'],
    specificRights: ['Right to challenge search', 'Right to medical defense'],
    urgentActions: ['Challenge search and seizure', 'Document medical conditions']
  },
  {
    id: 'il-720-5-24-1',
    name: 'Unlawful Use of Weapons',
    code: '720 ILCS 5/24-1',
    jurisdiction: 'IL',
    category: 'felony',
    description: 'Unlawful possession or use of weapons',
    maxPenalty: 'Class 4 Felony to Class 2 Felony (enhanced)',
    commonDefenses: ['Valid permit', 'Home defense exception', 'Lack of knowledge'],
    evidenceToGather: ['Permit documentation', 'Registration papers'],
    specificRights: ['Right to show lawful possession', 'Right to constitutional defense'],
    urgentActions: ['Gather permit documentation', 'Review weapon laws']
  },

  // Michigan Additional Charges
  {
    id: 'mi-mcl-333.7403',
    name: 'Drug Possession',
    code: 'MCL 333.7403',
    jurisdiction: 'MI',
    category: 'felony',
    description: 'Possession of controlled substances',
    maxPenalty: 'Up to 4 years prison, $25,000 fine',
    commonDefenses: ['Lack of knowledge', 'Medical necessity', 'Unlawful search'],
    evidenceToGather: ['Lab results', 'Medical records', 'Search warrant'],
    specificRights: ['Right to challenge search', 'Right to medical defense'],
    urgentActions: ['Challenge search and seizure', 'Document medical conditions']
  },
  {
    id: 'mi-mcl-750.543m',
    name: 'Identity Theft',
    code: 'MCL 750.543m',
    jurisdiction: 'MI',
    category: 'felony',
    description: 'Using another person\'s identity to obtain benefit',
    maxPenalty: '5-year felony, $25,000 fine (enhanced based on amount)',
    commonDefenses: ['Authorized use', 'Lack of intent', 'Mistaken identity'],
    evidenceToGather: ['Financial records', 'Authorization documents', 'Digital evidence'],
    specificRights: ['Right to show authorization', 'Right to expert testimony'],
    urgentActions: ['Secure digital evidence', 'Document authorized access']
  },
  {
    id: 'mi-mcl-750.200h',
    name: 'Computer Crime',
    code: 'MCL 750.200h',
    jurisdiction: 'MI',
    category: 'felony',
    description: 'Unauthorized computer access or damage',
    maxPenalty: '4-year felony, $5,000 fine (enhanced for higher damages)',
    commonDefenses: ['Authorized access', 'Lack of intent', 'No damage caused'],
    evidenceToGather: ['Computer logs', 'Authorization records', 'Damage assessments'],
    specificRights: ['Right to show authorization', 'Right to technical defense'],
    urgentActions: ['Preserve digital evidence', 'Document authorized access']
  },

  // Virginia Additional Charges
  {
    id: 'va-18.2-250',
    name: 'Drug Possession',
    code: 'Va. Code § 18.2-250',
    jurisdiction: 'VA',
    category: 'felony',
    description: 'Possession of controlled substances unlawfully',
    maxPenalty: 'Class 5 Felony (1-10 years) to Class 1 Misdemeanor (Schedule VI)',
    commonDefenses: ['Lack of knowledge', 'Medical necessity', 'Unlawful search'],
    evidenceToGather: ['Lab results', 'Medical records', 'Search warrant'],
    specificRights: ['Right to challenge search', 'Right to medical defense'],
    urgentActions: ['Challenge search and seizure', 'Document medical conditions']
  },
  {
    id: 'va-18.2-308',
    name: 'Carrying Concealed Weapons',
    code: 'Va. Code § 18.2-308',
    jurisdiction: 'VA',
    category: 'misdemeanor',
    description: 'Carrying concealed weapon without permit',
    maxPenalty: 'Class 1 Misdemeanor (up to 12 months jail, $2,500 fine)',
    commonDefenses: ['Valid permit', 'Home/vehicle exception', 'Temporary carrying'],
    evidenceToGather: ['Permit documentation', 'Self-defense evidence'],
    specificRights: ['Right to show lawful carry', 'Right to constitutional defense'],
    urgentActions: ['Gather permit documentation', 'Document circumstances']
  },
  {
    id: 'va-18.2-178',
    name: 'Credit Card Fraud',
    code: 'Va. Code § 18.2-178',
    jurisdiction: 'VA',
    category: 'felony',
    description: 'Fraudulent use of credit card or credit card number',
    maxPenalty: 'Class 1 Misdemeanor (under $1,000) to Class 6 Felony ($1,000+)',
    commonDefenses: ['Authorized use', 'Lack of intent', 'Mistake of fact'],
    evidenceToGather: ['Credit card statements', 'Authorization records', 'Purchase receipts'],
    specificRights: ['Right to show authorization', 'Right to challenge evidence'],
    urgentActions: ['Gather authorization evidence', 'Document legitimate use']
  },

  // North Carolina Additional Charges  
  {
    id: 'nc-gs-90-95',
    name: 'Drug Possession',
    code: 'G.S. 90-95',
    jurisdiction: 'NC',
    category: 'felony',
    description: 'Possession of controlled substances',
    maxPenalty: 'Class 3 Misdemeanor (marijuana 1st offense) to Class I Felony',
    commonDefenses: ['Lack of knowledge', 'Medical necessity', 'Unlawful search'],
    evidenceToGather: ['Lab results', 'Medical records', 'Search warrant'],
    specificRights: ['Right to challenge search', 'Right to medical defense'],
    urgentActions: ['Challenge search and seizure', 'Document medical conditions']
  },
  {
    id: 'nc-gs-14-269',
    name: 'Carrying Concealed Gun',
    code: 'G.S. 14-269',
    jurisdiction: 'NC',
    category: 'misdemeanor',
    description: 'Carrying concealed handgun without permit',
    maxPenalty: 'Class 2 Misdemeanor (up to 60 days jail)',
    commonDefenses: ['Valid permit', 'Home/vehicle exception', 'Emergency circumstances'],
    evidenceToGather: ['Permit documentation', 'Emergency evidence'],
    specificRights: ['Right to show lawful carry', 'Right to necessity defense'],
    urgentActions: ['Gather permit documentation', 'Document emergency']
  },
  {
    id: 'nc-gs-14-100',
    name: 'Embezzlement',
    code: 'G.S. 14-100',
    jurisdiction: 'NC',
    category: 'felony',
    description: 'Fraudulent conversion of property by person in position of trust',
    maxPenalty: 'Class H Felony to Class C Felony (based on amount)',
    commonDefenses: ['Authorized use', 'Lack of intent', 'Good faith belief'],
    evidenceToGather: ['Financial records', 'Authorization documents', 'Employment records'],
    specificRights: ['Right to show authorization', 'Right to good faith defense'],
    urgentActions: ['Gather employment records', 'Document authorized transactions']
  },

  // Georgia Additional Charges
  {
    id: 'ga-16-13-30',
    name: 'Drug Possession',
    code: 'O.C.G.A. § 16-13-30',
    jurisdiction: 'GA',
    category: 'felony',
    description: 'Possession, manufacture, distribution of controlled substances',
    maxPenalty: '1-3 years (Schedule I/II under 1g) to enhanced penalties for trafficking',
    commonDefenses: ['Lack of knowledge', 'Medical necessity', 'Unlawful search'],
    evidenceToGather: ['Lab results', 'Medical records', 'Search warrant'],
    specificRights: ['Right to challenge search', 'Right to medical defense'],
    urgentActions: ['Challenge search and seizure', 'Document medical conditions']
  },
  {
    id: 'ga-16-11-126',
    name: 'Carrying Weapons',
    code: 'O.C.G.A. § 16-11-126',
    jurisdiction: 'GA',
    category: 'misdemeanor',
    description: 'Carrying weapon without proper license',
    maxPenalty: 'Misdemeanor (up to 12 months jail, $1,000 fine)',
    commonDefenses: ['Valid license', 'Constitutional carry', 'Home/vehicle exception'],
    evidenceToGather: ['License documentation', 'Training certificates'],
    specificRights: ['Right to show lawful carry', 'Right to constitutional defense'],
    urgentActions: ['Gather license documentation', 'Review carry laws']
  },
  {
    id: 'ga-16-9-1',
    name: 'Forgery',
    code: 'O.C.G.A. § 16-9-1',
    jurisdiction: 'GA',
    category: 'felony',
    description: 'Making false writing with intent to defraud',
    maxPenalty: '1-15 years prison (based on amount and circumstances)',
    commonDefenses: ['Authorized signature', 'Lack of intent', 'No false writing'],
    evidenceToGather: ['Original documents', 'Handwriting analysis', 'Authorization evidence'],
    specificRights: ['Right to handwriting expert', 'Right to show authorization'],
    urgentActions: ['Preserve original documents', 'Gather authorization evidence']
  },

  // Alabama Criminal Code - Title 13A
  {
    id: 'al-13a-6-20',
    name: 'Assault in the First Degree',
    code: 'AL Code §13A-6-20',
    jurisdiction: 'AL',
    category: 'felony',
    description: 'Causing serious physical injury with intent using dangerous weapon',
    maxPenalty: 'Class A Felony (10-99 years or life imprisonment, $60,000 fine)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Weapon evidence', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to jury trial'],
    urgentActions: ['Document defensive circumstances', 'Preserve medical evidence']
  },
  {
    id: 'al-13a-6-21',
    name: 'Assault in the Second Degree',
    code: 'AL Code §13A-6-21',
    jurisdiction: 'AL',
    category: 'felony',
    description: 'Intent to cause serious physical injury with deadly weapon',
    maxPenalty: 'Class C Felony (1-10 years imprisonment, $15,000 fine)',
    commonDefenses: ['Self-defense', 'Lack of intent', 'Accident'],
    evidenceToGather: ['Medical records', 'Weapon evidence', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to confront witnesses'],
    urgentActions: ['Document circumstances', 'Gather character evidence']
  },
  {
    id: 'al-13a-8-3',
    name: 'Theft in the First Degree',
    code: 'AL Code §13A-8-3',
    jurisdiction: 'AL',
    category: 'felony',
    description: 'Theft of property valued at $2,500 or more',
    maxPenalty: 'Class B Felony (2-20 years imprisonment, $30,000 fine)',
    commonDefenses: ['Lack of intent to steal', 'Good faith belief of ownership'],
    evidenceToGather: ['Purchase receipts', 'Ownership documentation', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Document legitimate acquisition']
  },
  {
    id: 'al-13a-12-212',
    name: 'Unlawful Possession of Controlled Substances',
    code: 'AL Code §13A-12-212',
    jurisdiction: 'AL',
    category: 'felony',
    description: 'Simple possession of Schedule I-V controlled substances',
    maxPenalty: 'Class D Felony (1 year 1 day to 5 years, $7,500 fine)',
    commonDefenses: ['Lack of knowledge', 'Medical necessity', 'Unlawful search'],
    evidenceToGather: ['Lab results', 'Medical records', 'Search warrant'],
    specificRights: ['Right to challenge search', 'Right to medical defense'],
    urgentActions: ['Challenge search and seizure', 'Document medical conditions']
  },
  {
    id: 'al-13a-11-72',
    name: 'Prohibited Person in Possession of Firearm',
    code: 'AL Code §13A-11-72',
    jurisdiction: 'AL',
    category: 'felony',
    description: 'Convicted felon or prohibited person possessing firearm',
    maxPenalty: 'Up to 5 years imprisonment plus gun seizure',
    commonDefenses: ['Rights restoration', 'Lack of knowledge', 'Temporary possession'],
    evidenceToGather: ['Criminal history', 'Rights restoration documents'],
    specificRights: ['Right to show rights restoration', 'Right to constitutional defense'],
    urgentActions: ['Check rights restoration status', 'Document circumstances']
  },
  {
    id: 'al-13a-6-130',
    name: 'Domestic Violence in the First Degree',
    code: 'AL Code §13A-6-130',
    jurisdiction: 'AL',
    category: 'felony',
    description: 'First degree assault in domestic relationship',
    maxPenalty: 'Class A Felony (10-99 years or life, 12 month minimum on second offense)',
    commonDefenses: ['Self-defense', 'Mutual combat', 'False accusations'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Character witnesses'],
    specificRights: ['Right to self-defense claim', 'Right to jury trial'],
    urgentActions: ['Document defensive circumstances', 'Gather character evidence']
  },

  // Alaska Criminal Statutes - Title 11
  {
    id: 'ak-11.41.200',
    name: 'Assault in the First Degree',
    code: 'AS 11.41.200',
    jurisdiction: 'AK',
    category: 'felony',
    description: 'Intentionally causing serious physical injury',
    maxPenalty: 'Class A Felony (up to 20 years, $250,000 fine)',
    commonDefenses: ['Self-defense', 'Defense of others', 'Lack of intent'],
    evidenceToGather: ['Medical records', 'Weapon evidence', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to jury trial'],
    urgentActions: ['Document defensive circumstances', 'Preserve medical evidence']
  },
  {
    id: 'ak-11.41.210',
    name: 'Assault in the Second Degree',
    code: 'AS 11.41.210',
    jurisdiction: 'AK',
    category: 'felony',
    description: 'Recklessly causing serious physical injury with dangerous instrument',
    maxPenalty: 'Class B Felony (up to 10 years, $100,000 fine)',
    commonDefenses: ['Self-defense', 'Lack of intent', 'Accident'],
    evidenceToGather: ['Medical records', 'Weapon evidence', 'Witness statements'],
    specificRights: ['Right to self-defense claim', 'Right to confront witnesses'],
    urgentActions: ['Document circumstances', 'Gather character evidence']
  },
  {
    id: 'ak-11.46.120',
    name: 'Theft in the First Degree',
    code: 'AS 11.46.120',
    jurisdiction: 'AK',
    category: 'felony',
    description: 'Theft of property or services valued over $25,000',
    maxPenalty: 'Class B Felony (up to 10 years, $100,000 fine)',
    commonDefenses: ['Lack of intent to steal', 'Good faith belief of ownership'],
    evidenceToGather: ['Purchase receipts', 'Ownership documentation', 'Value assessments'],
    specificRights: ['Right to jury trial', 'Right to confront witnesses'],
    urgentActions: ['Gather ownership documentation', 'Document legitimate acquisition']
  },
  {
    id: 'ak-11.71.040',
    name: 'Misconduct Involving Controlled Substance 4th Degree',
    code: 'AS 11.71.040',
    jurisdiction: 'AK',
    category: 'felony',
    description: 'Possession of controlled substances',
    maxPenalty: 'Class C Felony (up to 5 years, $50,000 fine)',
    commonDefenses: ['Lack of knowledge', 'Medical necessity', 'Unlawful search'],
    evidenceToGather: ['Lab results', 'Medical records', 'Search warrant'],
    specificRights: ['Right to challenge search', 'Right to medical defense'],
    urgentActions: ['Challenge search and seizure', 'Document medical conditions']
  },
  {
    id: 'ak-11.61.200',
    name: 'Misconduct Involving Weapons 4th Degree',
    code: 'AS 11.61.200',
    jurisdiction: 'AK',
    category: 'misdemeanor',
    description: 'Possession of firearm by prohibited person',
    maxPenalty: 'Class A Misdemeanor (up to 1 year, $25,000 fine)',
    commonDefenses: ['Rights restoration', 'Lack of knowledge', 'Self-defense exception'],
    evidenceToGather: ['Criminal history', 'Rights restoration documents'],
    specificRights: ['Right to show rights restoration', 'Right to constitutional defense'],
    urgentActions: ['Check rights restoration status', 'Document circumstances']
  },
  {
    id: 'ak-18.66.100',
    name: 'Domestic Violence Assault',
    code: 'AS 18.66.100',
    jurisdiction: 'AK',
    category: 'misdemeanor',
    description: 'Assault against family or household member',
    maxPenalty: 'Enhanced penalties under domestic violence statutes',
    commonDefenses: ['Self-defense', 'Mutual combat', 'False accusations'],
    evidenceToGather: ['Medical records', 'Photos of injuries', 'Character witnesses'],
    specificRights: ['Right to self-defense claim', 'Right to jury trial'],
    urgentActions: ['Document defensive circumstances', 'Gather character evidence']
  }
];

export const chargeCategories = {
  'Violent Crimes': ['ca-pc-211', 'ca-pc-245', 'ca-pc-242', 'ca-pc-273.5', 'tx-pc-22.01', 'tx-pc-29.02', 'tx-pc-25.11', 'fl-784.03', 'fl-812.13', 'fl-794.011', 'ny-pl-120.00', 'pa-18-2701', 'pa-18-908', 'il-720-5-12-3', 'il-720-5-12-2', 'oh-orc-2919.25', 'ga-16-5-20', 'nc-gs-14-32', 'mi-mcl-750.81', 'va-18.2-57', 'al-13a-6-20', 'al-13a-6-21', 'al-13a-6-130', 'ak-11.41.200', 'ak-11.41.210', 'ak-18.66.100'],
  'Property Crimes': ['ca-pc-459', 'ca-pc-487', 'tx-pc-31.03', 'tx-pc-30.02', 'fl-812.014-petit', 'fl-812.014-grand', 'fl-810.02', 'fl-817.568', 'ny-pl-155.25', 'ny-pl-155.30', 'ny-pl-140.20', 'pa-18-3921', 'pa-18-3502', 'pa-18-3925', 'il-720-5-16-1', 'il-720-5-19-1', 'oh-orc-2913.02', 'oh-orc-2911.12', 'ga-16-8-2', 'ga-16-7-1', 'ga-16-9-1', 'nc-gs-14-72', 'nc-gs-14-51', 'nc-gs-14-100', 'mi-mcl-750.356', 'mi-mcl-750.110', 'mi-mcl-750.543m', 'mi-mcl-750.200h', 'va-18.2-95', 'va-18.2-89', 'va-18.2-178', 'al-13a-8-3', 'ak-11.46.120'],
  'Drug Crimes': ['ca-hs-11350', 'tx-hs-481.115', 'fl-893.13', 'pa-18-6318', 'il-720-570-402', 'mi-mcl-333.7403', 'va-18.2-250', 'nc-gs-90-95', 'ga-16-13-30', 'al-13a-12-212', 'ak-11.71.040', 'fed-21-841'],
  'Weapons Crimes': ['tx-pc-46.02', 'fl-790.23', 'il-720-5-24-1', 'va-18.2-308', 'nc-gs-14-269', 'ga-16-11-126', 'al-13a-11-72', 'ak-11.61.200'],
  'Federal Crimes': ['fed-18-1341', 'fed-18-1030', 'fed-18-922', 'fed-18-371'],
  'Traffic/DUI': ['ca-vc-23152', 'tx-pc-49.04', 'fl-316.193', 'ny-vtl-1192', 'pa-75-3802', 'il-625-5-11-501', 'oh-orc-4511.19', 'ga-40-6-391', 'nc-gs-20-138.1', 'mi-mcl-257.625', 'va-18.2-266'],
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