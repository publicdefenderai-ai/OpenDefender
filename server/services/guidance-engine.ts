// Enhanced Legal Guidance Generation Engine
// Implements charge-specific, jurisdiction-specific, and case-stage guidance

import { criminalCharges, getChargeById, getVerifiedCitation } from '../../shared/criminal-charges';

interface CaseData {
  jurisdiction: string;
  charges: string | string[];
  caseStage: string;
  custodyStatus: string;
  hasAttorney: boolean;
  supervisionStatus?: string;
  citizenshipStatus?: string;
  hasMinorChildren?: boolean | null;
  hasProfessionalLicense?: boolean | null;
  hasHousingAssistance?: boolean | null;
}

interface GuidanceDeadline {
  event: string;
  timeframe: string;
  description: string;
  priority: 'critical' | 'important' | 'normal';
  daysFromNow?: number;
  isEstimate?: boolean;
}

interface GuidanceResource {
  type: string;
  description: string;
  contact: string;
  hours?: string;
  website?: string;
}

export interface ImmediateAction {
  action: string;
  urgency: 'urgent' | 'high' | 'medium' | 'low';
}

interface MockQAItem {
  question: string;
  suggestedResponse: string;
  explanation: string;
  category: 'identity' | 'charges' | 'circumstances' | 'plea' | 'procedural' | 'general';
}

interface CollateralConsequenceItem {
  category: string;
  consequence: string;
  timing: string;
  actionNote: string;
}

interface UncertaintyItem {
  area: string;
  note: string;
}

interface EnhancedGuidance {
  overview: string;
  criticalAlerts: string[];
  immediateActions: ImmediateAction[];
  nextSteps: string[];
  deadlines: GuidanceDeadline[];
  rights: string[];
  resources: GuidanceResource[];
  warnings: string[];
  evidenceToGather: string[];
  courtPreparation: string[];
  avoidActions: string[];
  timeline: Array<{
    stage: string;
    description: string;
    timeframe: string;
    completed: boolean;
  }>;
  mockQA?: MockQAItem[];
  collateralConsequences?: CollateralConsequenceItem[];
  uncertainties?: UncertaintyItem[];
}

// Jurisdiction-specific legal procedures and timelines
const jurisdictionRules = {
  'CA': {
    arraignmentDeadline: 'Within 48 hours (72 hours if arrested on weekend)',
    preliminaryHearing: 'Within 10 court days for felonies',
    speedyTrialRight: '60 days if in custody, 30 days if out',
    publicDefenderIncome: 'Individual: $25,000, Family of 2: $35,000',
    bailSystem: 'Schedule-based bail system',
    discoveryDeadline: '30 days after arraignment'
  },
  'TX': {
    arraignmentDeadline: 'Within 48 hours',
    preliminaryHearing: 'Not required - grand jury indictment for felonies',
    speedyTrialRight: '120 days for felonies, 60 days for misdemeanors',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Commercial bail bond system',
    discoveryDeadline: '20 days before trial'
  },
  'NY': {
    arraignmentDeadline: 'Within 24 hours',
    preliminaryHearing: 'Within 120 hours for felonies',
    speedyTrialRight: '6 months for felonies, 90 days for misdemeanors',
    publicDefenderIncome: 'Individual: $25,000, Family of 4: $60,000',
    bailSystem: 'Cash bail reform - limited detention',
    discoveryDeadline: '15 days after arraignment'
  },
  'FL': {
    arraignmentDeadline: 'Within 24 hours',
    preliminaryHearing: 'Within 21 days for felonies',
    speedyTrialRight: '175 days for felonies, 90 days for misdemeanors',
    publicDefenderIncome: 'Individual: $27,750, Family of 2: $37,500',
    bailSystem: 'Traditional bail system with pretrial services',
    discoveryDeadline: 'Within 15 days of demand'
  },
  'IL': {
    arraignmentDeadline: 'Within 48 hours',
    preliminaryHearing: 'Within 30 days if in custody',
    speedyTrialRight: '120 days for felonies, 160 days for misdemeanors',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Pretrial detention reform - no cash bail',
    discoveryDeadline: '28 days after arraignment'
  },
  'PA': {
    arraignmentDeadline: 'Within 72 hours',
    preliminaryHearing: 'Within 14 days of preliminary arraignment',
    speedyTrialRight: '365 days from complaint',
    publicDefenderIncome: 'Individual: $25,000, Family of 2: $33,000',
    bailSystem: 'Traditional bail system',
    discoveryDeadline: '30 days after arraignment'
  },
  'WA': {
    arraignmentDeadline: 'Within 72 hours if in custody',
    preliminaryHearing: 'Within 10 court days if in custody',
    speedyTrialRight: '60 days if in custody, 90 days if released',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Pretrial services assessment',
    discoveryDeadline: '30 days after arraignment'
  },
  'OH': {
    arraignmentDeadline: 'Within 48 hours',
    preliminaryHearing: 'Within 10 days if in custody',
    speedyTrialRight: '90 days if in custody, 270 days if released',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    discoveryDeadline: '21 days after arraignment'
  },
  'GA': {
    arraignmentDeadline: 'Within 72 hours',
    preliminaryHearing: 'Within 30 days if in custody',
    speedyTrialRight: '180 days if in custody',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    discoveryDeadline: '10 days before trial'
  },
  'AZ': {
    arraignmentDeadline: 'Within 48 hours if in custody',
    preliminaryHearing: 'Within 10 days if in custody',
    speedyTrialRight: '150 days from arraignment',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    discoveryDeadline: '10 days after arraignment'
  },
  'NJ': {
    arraignmentDeadline: 'Within 48 hours',
    preliminaryHearing: 'Within 20 days for indictable offenses',
    speedyTrialRight: '180 days from indictment',
    publicDefenderIncome: 'Individual: $25,000, Family of 2: $34,000',
    bailSystem: 'Pretrial services assessment — bail reform',
    discoveryDeadline: '20 days after arraignment'
  },
  'MI': {
    arraignmentDeadline: 'Within 48 hours',
    preliminaryHearing: 'Within 14 days',
    speedyTrialRight: '180 days from arrest',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    discoveryDeadline: '21 days after arraignment'
  },
  'NC': {
    arraignmentDeadline: 'Within 48 hours',
    preliminaryHearing: 'Within 15 days if in custody',
    speedyTrialRight: '120 days if in custody',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    discoveryDeadline: '15 days after arraignment'
  },
  'VA': {
    arraignmentDeadline: 'Within 48 hours',
    preliminaryHearing: 'Within 10 days if in custody',
    speedyTrialRight: '5 months from arrest for misdemeanors',
    publicDefenderIncome: 'Case-by-case determination',
    bailSystem: 'Traditional bail system',
    discoveryDeadline: '21 days after arraignment'
  },
  'federal': {
    arraignmentDeadline: 'Without unnecessary delay',
    preliminaryHearing: 'Within 14 days if in custody, 21 days if released',
    speedyTrialRight: '70 days from indictment',
    publicDefenderIncome: 'Individual: $30,000, Family of 2: $40,500',
    bailSystem: 'Pretrial services assessment',
    discoveryDeadline: 'Ongoing obligation'
  }
};

// Charge-specific guidance database
const chargeGuidance = {
  'dui': {
    name: 'DUI/DWI',
    immediateActions: [
      'An independent blood or breath test may be requested in some jurisdictions — attorneys advise asking about this option promptly as timing matters.',
      'Document any medical conditions affecting tests',
      'Take photos of arrest scene and conditions',
      'Request DMV hearing within 10 days (varies by state)'
    ],
    evidenceToGather: [
      'Breathalyzer calibration records',
      'Police dash cam and body cam footage',
      'Medical records showing conditions affecting sobriety',
      'Witness statements from the scene',
      'Weather and road condition reports'
    ],
    defenseStrategies: [
      'Challenge breathalyzer accuracy and maintenance',
      'Question field sobriety test administration',
      'Examine probable cause for initial stop',
      'Review Miranda rights administration'
    ],
    collateralConsequences: [
      'License suspension (administrative and criminal)',
      'Ignition interlock device requirement',
      'Increased insurance rates',
      'Employment impacts for commercial drivers'
    ]
  },
  'assault': {
    name: 'Assault',
    immediateActions: [
      'Seek medical attention for any injuries',
      'Document all injuries with photographs',
      'Gather contact information for witnesses',
      'Avoid contact with alleged victim'
    ],
    evidenceToGather: [
      'Medical records for all parties',
      'Security camera footage from scene',
      'Text messages or communications before/after incident',
      'Photos of scene and any property damage',
      'Character reference letters'
    ],
    defenseStrategies: [
      'Self-defense claim documentation',
      'Challenge witness credibility',
      'Examine physical evidence consistency',
      'Question police investigation thoroughness'
    ],
    collateralConsequences: [
      'Restraining order possibilities',
      'Professional license impacts',
      'Immigration consequences',
      'Firearm possession restrictions'
    ]
  },
  'drug': {
    name: 'Drug Possession',
    immediateActions: [
      'Discussing the substance of the case with anyone other than an attorney is something legal professionals advise against — attorney-client communications are the protected channel.',
      'Document any medical prescriptions',
      'Identifying potential search and seizure issues is an early priority attorneys typically raise in drug cases.',
      'Consider treatment program enrollment'
    ],
    evidenceToGather: [
      'Medical records and prescriptions',
      'Evidence of constructive vs actual possession',
      'Chain of custody documentation',
      'Search warrant validity',
      'Field test reliability records'
    ],
    defenseStrategies: [
      'Challenge search and seizure legality',
      'Question constructive possession elements',
      'Examine chain of custody procedures',
      'Challenge field test accuracy'
    ],
    collateralConsequences: [
      'Driver\'s license suspension',
      'Federal student aid eligibility',
      'Professional licensing impacts',
      'Immigration consequences for non-citizens'
    ]
  },
  'theft': {
    name: 'Theft/Larceny',
    immediateActions: [
      'Gather proof of ownership or legitimate access',
      'Document your whereabouts during alleged incident',
      'Collect receipts and financial records',
      'Avoid discussing the incident with witnesses'
    ],
    evidenceToGather: [
      'Receipts, bank statements, proof of purchase',
      'Alibi witnesses and documentation',
      'Security footage from multiple locations',
      'Digital evidence (GPS, cell phone records)',
      'Employment records and timekeeping'
    ],
    defenseStrategies: [
      'Prove lawful ownership or right to possess',
      'Establish alibi with concrete evidence',
      'Challenge witness identification',
      'Question intent to permanently deprive'
    ],
    collateralConsequences: [
      'Restitution requirements',
      'Civil liability exposure',
      'Employment background check impacts',
      'Professional licensing consequences'
    ]
  },
  'domestic': {
    name: 'Domestic Violence',
    immediateActions: [
      'Understand no-contact order implications',
      'Find alternative housing if needed',
      'Document any injuries or property damage',
      'Gather character witnesses'
    ],
    evidenceToGather: [
      'Medical records and injury photos',
      'Communications history with alleged victim',
      '911 call recordings',
      'Witness statements supporting your version',
      'Evidence of alleged victim\'s credibility issues'
    ],
    defenseStrategies: [
      'Challenge witness credibility and motives',
      'Present alternative explanations for injuries',
      'Document history of false allegations',
      'Examine police response and investigation'
    ],
    collateralConsequences: [
      'Mandatory protective orders',
      'Child custody and visitation impacts',
      'Firearm possession prohibition',
      'Immigration consequences'
    ]
  },
  'fraud': {
    name: 'Fraud/White Collar Crime',
    immediateActions: [
      'Preserve all financial documents and records',
      'Do not destroy or alter any documents',
      'Continuing transactions connected to a fraud investigation while charges are pending can be interpreted as evidence of intent — attorneys typically advise pausing any related activity.',
      'Communication between co-defendants can complicate legal strategy and may raise evidentiary concerns — attorneys commonly advise limiting such contact.'
    ],
    evidenceToGather: [
      'Bank statements and financial records',
      'Email communications and correspondence',
      'Contracts and agreements',
      'Proof of authorization for transactions',
      'Character references from professional contacts'
    ],
    defenseStrategies: [
      'Prove lack of intent to defraud',
      'Document authorization or consent',
      'Challenge amount calculations',
      'Examine evidence of good faith belief'
    ],
    collateralConsequences: [
      'Asset forfeiture and restitution',
      'Professional license revocation',
      'Banking and credit impacts',
      'Employment restrictions in financial sectors'
    ]
  },
  'burglary': {
    name: 'Burglary',
    immediateActions: [
      'Document your whereabouts during alleged incident',
      'Identify alibi witnesses immediately',
      'Do not discuss case with anyone except attorney',
      'Preserve any evidence of where you were'
    ],
    evidenceToGather: [
      'Alibi evidence (receipts, GPS data, witnesses)',
      'Security footage from other locations',
      'Phone records showing location',
      'Work attendance or time records',
      'Social media posts with timestamps'
    ],
    defenseStrategies: [
      'Establish solid alibi with evidence',
      'Challenge eyewitness identification',
      'Question forensic evidence collection',
      'Examine intent elements'
    ],
    collateralConsequences: [
      'Enhanced penalties for prior convictions',
      'Ineligibility for certain housing',
      'Employment background check impacts',
      'Immigration consequences'
    ]
  },
  'traffic': {
    name: 'Traffic Violation',
    immediateActions: [
      'Note all details of the incident immediately',
      'Take photos of the location and signage',
      'Gather contact info from any witnesses',
      'Check your driving record for accuracy'
    ],
    evidenceToGather: [
      'Photos of traffic signs and road conditions',
      'Dashcam or witness footage',
      'Weather reports for that day',
      'Maintenance records for speed detection equipment',
      'Your driving history'
    ],
    defenseStrategies: [
      'Challenge equipment calibration',
      'Question officer\'s observation point',
      'Document unclear or missing signage',
      'Present evidence of emergency situation'
    ],
    collateralConsequences: [
      'Points on license',
      'Insurance rate increases',
      'License suspension for repeat offenses',
      'Commercial driving impacts'
    ]
  },
  'weapons': {
    name: 'Weapons Offense',
    immediateActions: [
      'Possessing weapons while a weapons charge is pending can result in additional charges and typically affects bail conditions — attorneys flag this as a priority concern.',
      'Document any legal ownership or permits',
      'Identify witnesses to the circumstances',
      'Review storage and transport laws'
    ],
    evidenceToGather: [
      'Firearm permits and licenses',
      'Proof of legal purchase',
      'Registration documents',
      'Character witnesses',
      'Evidence of lawful purpose'
    ],
    defenseStrategies: [
      'Prove lawful possession and permits',
      'Challenge search and seizure procedures',
      'Examine constructive possession issues',
      'Question identification of weapon type'
    ],
    collateralConsequences: [
      'Permanent firearm ownership prohibition',
      'Enhanced penalties for other offenses',
      'Professional license impacts',
      'Immigration consequences'
    ]
  },
  'default': {
    name: 'Criminal Charge',
    immediateActions: [
      'Exercise your right to remain silent',
      'Request an attorney immediately',
      'Document all relevant details while fresh in memory',
      'Gather contact information for potential witnesses'
    ],
    evidenceToGather: [
      'Any documentation related to the incident',
      'Witness contact information',
      'Photos or videos if available',
      'Communication records',
      'Alibi evidence if applicable'
    ],
    defenseStrategies: [
      'Review all evidence with attorney',
      'Identify weaknesses in prosecution case',
      'Consider all available defenses',
      'Evaluate plea options carefully'
    ],
    collateralConsequences: [
      'Potential employment impacts',
      'Background check implications',
      'Professional licensing considerations',
      'Immigration status effects if applicable'
    ]
  }
};

// Case stage progression with detailed guidance
const stageGuidance = {
  'arrest': {
    name: 'Arrest Stage',
    criticalActions: [
      '**Right to Silence**: Answering questions before consulting an attorney is something legal professionals consistently advise against — anything said can be used in the case.',
      '**Legal Representation**: Requesting an attorney before responding to questions is a constitutional right and a standard first step at this stage.',
      '**Compliance and Counsel**: Complying with lawful officer instructions and requesting an attorney are not in conflict — attorneys advise doing both.',
      'Write down your booking number and where you are'
    ],
    immediateDeadlines: [
      'Arraignment within 24-72 hours',
      'Contact attorney within 24 hours',
      'Notify emergency contacts'
    ],
    rights: [
      'You have the right to stay silent and not answer questions',
      'You have the right to a lawyer',
      'You have the right to ask for bail so you can get out of jail',
      'You have the right to make a phone call',
      'You have the right to see a doctor if you\'re hurt',
      'You have the right to know what you\'re being charged with'
    ],
    avoidActions: [
      'Don\'t talk about your case with other people in jail',
      'Signing documents or waivers without attorney review can limit legal options — attorneys advise reviewing any paperwork with counsel before signing.',
      'Waiving rights before consulting an attorney — including the right to silence — can significantly affect how a case proceeds.',
      'Don\'t fight back or resist when being arrested'
    ]
  },
  'arraignment': {
    name: 'First Court Appearance',
    criticalActions: [
      '**Plea at Arraignment**: Most attorneys advise entering a not guilty plea at arraignment — this preserves all options while the case and evidence are reviewed with counsel.',
      'Ask for a public defender if you can\'t afford a lawyer',
      'Talk to the judge about bail so you can get out of jail',
      'Get a copy of the papers that say what you\'re charged with'
    ],
    courtPreparation: [
      'Wear clean, neat clothes (dress nicely if you can)',
      'Get there early and find the right courtroom',
      'Bring your ID and any court papers you have',
      'Turn off your cell phone',
      'Stand up when the judge comes in and leaves'
    ],
    rights: [
      'You have the right to hear what you\'re charged with',
      'You have the right to say whether you\'re guilty or not guilty',
      'You have the right to have a lawyer with you',
      'You have the right to ask for bail',
      'You have the right to a translator if you need one'
    ]
  },
  'pretrial': {
    name: 'Before Trial',
    criticalActions: [
      'Work with your lawyer to plan your defense',
      'Follow all the rules of your bail',
      'Collect evidence and find people who can be witnesses',
      'Think carefully about any deals the prosecutor offers'
    ],
    deadlines: [
      'Sharing evidence with the other side',
      'Filing court papers',
      'Deciding on plea deals',
      'Getting ready for trial'
    ],
    activities: [
      'Look at the evidence with your lawyer',
      'Give statements if your lawyer says to',
      'Go to all court dates',
      'Talk to your lawyer about expert witnesses if needed',
      'Review any plea deals carefully'
    ]
  },
  'trial': {
    name: 'Trial',
    criticalActions: [
      'Practice what you\'ll say with your lawyer',
      'Look at all the evidence and witness list',
      'Learn what will happen in the courtroom',
      'Be ready for different outcomes'
    ],
    rights: [
      'You have the right to a jury trial (in most cases)',
      'You have the right to question witnesses against you',
      'You have the right to tell your side of the story',
      'You have the right to stay silent',
      'You have the right to have a lawyer with you the whole time'
    ]
  }
};

export function generateEnhancedGuidance(caseData: CaseData): EnhancedGuidance {
  const { jurisdiction, charges, caseStage, custodyStatus, hasAttorney } = caseData;
  
  // Get jurisdiction-specific rules
  const jurisdictionData = jurisdictionRules[jurisdiction as keyof typeof jurisdictionRules] || jurisdictionRules['federal'];
  
  // Handle multiple charges - get specific charge data
  const chargeIds = Array.isArray(charges) ? charges : [charges];
  const specificCharges = chargeIds.map(id => getChargeById(id)).filter(Boolean);
  
  // Fallback to legacy charge type identification for backwards compatibility
  const chargesString = Array.isArray(charges) ? charges.join(' ').toLowerCase() : charges.toLowerCase();
  const fallbackChargeType = identifyChargeType(chargesString);
  const fallbackChargeData = chargeGuidance[fallbackChargeType as keyof typeof chargeGuidance];
  
  // Get stage-specific guidance
  const stageData = stageGuidance[caseStage as keyof typeof stageGuidance];
  
  // Build comprehensive guidance with charge-specific information
  const guidance: EnhancedGuidance = {
    overview: buildOverview(caseData, specificCharges, jurisdictionData),
    criticalAlerts: buildCriticalAlertsForCharges(caseData, jurisdictionData, specificCharges),
    immediateActions: buildImmediateActionsForCharges(caseData, stageData, specificCharges, fallbackChargeData),
    nextSteps: buildNextSteps(caseData, stageData),
    deadlines: buildDeadlines(caseData, jurisdictionData, stageData),
    rights: buildRightsForCharges(specificCharges, caseStage),
    resources: buildResources(jurisdiction, hasAttorney),
    warnings: buildWarningsForCharges(caseData, specificCharges, fallbackChargeData),
    evidenceToGather: buildEvidenceForCharges(specificCharges, fallbackChargeData),
    courtPreparation: (stageData as any)?.courtPreparation || [],
    avoidActions: buildAvoidActionsForCharges(specificCharges, stageData),
    timeline: buildCaseTimeline(caseStage, jurisdictionData),
    mockQA: buildMockQA(caseData, specificCharges),
    collateralConsequences: buildCollateralConsequences(caseData, fallbackChargeType),
    uncertainties: buildUncertainties(caseData, jurisdictionData, fallbackChargeType),
  };
  
  return guidance;
}

// Generate template-based mock Q&A for court preparation
function buildMockQA(caseData: CaseData, specificCharges: any[]): MockQAItem[] {
  const { caseStage, hasAttorney } = caseData;
  const mockQA: MockQAItem[] = [];
  
  // Stage-specific template questions
  const stageQuestions: Record<string, MockQAItem[]> = {
    'arraignment': [
      {
        question: "What is your name and date of birth?",
        suggestedResponse: "My name is [your full legal name] and my date of birth is [your date of birth].",
        explanation: "The judge needs to verify your identity for the record. Answer clearly and directly.",
        category: 'identity'
      },
      {
        question: "Do you understand the charges against you?",
        suggestedResponse: "Yes, Your Honor, I understand the charges.",
        explanation: "If you don't fully understand, it's okay to say 'I would like my attorney to explain them to me.'",
        category: 'charges'
      },
      {
        question: "How do you plead to these charges?",
        suggestedResponse: "Not guilty, Your Honor.",
        explanation: "Most defendants plead not guilty at arraignment. This preserves your rights and gives you time to review the evidence with an attorney before making any decisions.",
        category: 'plea'
      },
      {
        question: "Do you have an attorney or do you need one appointed?",
        suggestedResponse: hasAttorney ? "Yes, Your Honor, I have an attorney." : "I would like to request a public defender, Your Honor.",
        explanation: hasAttorney ? "Confirm you have representation." : "If you cannot afford a lawyer, the court will appoint a public defender to represent you.",
        category: 'procedural'
      },
      {
        question: "Do you have any questions about your rights?",
        suggestedResponse: "No, Your Honor, I understand my rights.",
        explanation: "If you do have questions, this is a good time to ask. It's important you understand what rights you have during the legal process.",
        category: 'procedural'
      }
    ],
    'pre-trial': [
      {
        question: "Are you aware of the conditions of your release?",
        suggestedResponse: "Yes, Your Honor, I understand and have been following all conditions.",
        explanation: "This confirms you know what's expected of you while out on bail or pretrial release. Violations can result in your release being revoked.",
        category: 'procedural'
      },
      {
        question: "Have you had adequate time to prepare with your attorney?",
        suggestedResponse: "Yes, Your Honor, I have been working with my attorney.",
        explanation: "If you haven't had enough time, you can request more time. The court wants to ensure you're prepared.",
        category: 'procedural'
      },
      {
        question: "Are there any motions you would like to file?",
        suggestedResponse: "I will defer to my attorney on any motions.",
        explanation: "Motions involve procedural and legal considerations that attorneys handle — attempting to file them without counsel can affect how they're received by the court.",
        category: 'procedural'
      },
      {
        question: "Are you interested in discussing a plea agreement?",
        suggestedResponse: "I would like to continue discussions with my attorney before making any decisions.",
        explanation: "Plea offers involve tradeoffs that benefit from full review of the evidence and available defenses — attorneys advise taking time to evaluate them carefully.",
        category: 'plea'
      }
    ],
    'trial': [
      {
        question: "Do you swear to tell the truth, the whole truth, and nothing but the truth?",
        suggestedResponse: "I do.",
        explanation: "This is the oath taken before testifying. Once you take this oath, lying is perjury, which is a serious crime.",
        category: 'procedural'
      },
      {
        question: "In your own words, what happened on the day in question?",
        suggestedResponse: "On that day, [give a clear, factual account as discussed with your attorney].",
        explanation: "Stick to the facts as you remember them. Don't guess or speculate. It's okay to say 'I don't remember' if that's true.",
        category: 'circumstances'
      },
      {
        question: "Have you ever been convicted of a crime before?",
        suggestedResponse: "[Answer honestly based on your record]",
        explanation: "Answer truthfully. Your attorney should have prepared you for this question and how to answer it.",
        category: 'general'
      }
    ],
    'arrest': [
      {
        question: "Do you understand why you are being arrested?",
        suggestedResponse: "I understand. I would like to speak with an attorney.",
        explanation: "You don't need to agree or disagree with the charges. Simply acknowledge and request a lawyer.",
        category: 'procedural'
      },
      {
        question: "Would you like to make a statement?",
        suggestedResponse: "I would like to speak with an attorney before answering any questions.",
        explanation: "The right to remain silent means you are not required to answer questions. Anything said can be introduced in the case.",
        category: 'procedural'
      }
    ]
  };
  
  // Get questions for current stage
  const stageQA = stageQuestions[caseStage] || stageQuestions['arraignment'];
  mockQA.push(...stageQA);
  
  // Add charge-specific questions if available
  if (specificCharges.length > 0) {
    const charge = specificCharges[0];
    const chargeName = charge.title || charge.name || 'the charges';
    
    mockQA.push({
      question: `What do you know about the ${chargeName} charge against you?`,
      suggestedResponse: "I understand the nature of the charge. I would like to defer to my attorney for any specific details.",
      explanation: "The specifics of a case are typically kept within the attorney-client relationship — details shared outside it don't carry the same legal protections.",
      category: 'charges'
    });
  }
  
  return mockQA.slice(0, 5); // Limit to 5 questions
}

// Exported so tests can assert that every charge type has a consequence mapping.
export const CHARGE_KEYWORDS: Record<string, string[]> = {
  dui: ['dui', 'dwi', 'driving under', 'intoxicated', 'impaired', 'blood alcohol'],
  assault: ['assault', 'battery', 'fighting', 'bodily harm', 'aggravated assault'],
  drug: ['drug', 'possession', 'narcotic', 'controlled substance', 'marijuana', 'cocaine', 'heroin', 'fentanyl', 'meth'],
  theft: ['theft', 'larceny', 'stealing', 'shoplifting', 'petty theft', 'grand theft'],
  domestic: ['domestic', 'family violence', 'spousal', 'intimate partner'],
  fraud: ['fraud', 'embezzlement', 'forgery', 'identity theft', 'wire fraud', 'mail fraud', 'financial crime', 'white collar'],
  burglary: ['burglary', 'breaking and entering', 'home invasion', 'unlawful entry'],
  traffic: ['speeding', 'reckless driving', 'hit and run', 'running red light', 'traffic violation', 'driving without license'],
  weapons: ['weapon', 'firearm', 'gun', 'unlawful possession', 'concealed carry', 'armed'],
};

function identifyChargeType(charges: string): string {
  // Weapons-specific keywords take priority over the generic 'possession' keyword in the
  // drug bucket. Without this check, "possession of a firearm" or "unlawful firearm
  // possession" would match the drug bucket first and deliver drug guidance instead of
  // weapons guidance.
  const weaponPriorityKeywords = ['firearm', 'gun', 'weapon', 'concealed carry', 'armed'];
  if (weaponPriorityKeywords.some(keyword => charges.includes(keyword))) {
    return 'weapons';
  }

  for (const [type, keywords] of Object.entries(CHARGE_KEYWORDS)) {
    if (keywords.some(keyword => charges.includes(keyword))) {
      return type;
    }
  }
  
  return 'default'; // Default for unrecognized charges - now uses 'default' guidance
}

// New charge-specific guidance functions
function buildCriticalAlertsForCharges(caseData: CaseData, jurisdictionData: any, specificCharges: any[]): string[] {
  const alerts: string[] = [];
  
  // Add stage-specific alerts
  if (caseData.caseStage === 'arrest') {
    alerts.push('**Right to Silence**: Answering questions before consulting an attorney is something legal professionals consistently advise against — anything said can be used in the case.');
    if (caseData.custodyStatus === 'detained') {
      alerts.push(`Arraignment is required ${jurisdictionData.arraignmentDeadline}`);
    }
  }
  
  if (!caseData.hasAttorney) {
    alerts.push('Requesting a public defender promptly matters — representation before arraignment can affect bail and initial proceedings.');
  }
  
  // Add charge-specific critical alerts
  specificCharges.forEach(charge => {
    if (charge.urgentActions) {
      alerts.push(...charge.urgentActions.map((action: string) => `URGENT: ${action}`));
    }
  });
  
  return alerts;
}

function buildImmediateActionsForCharges(caseData: CaseData, stageData: any, specificCharges: any[], fallbackChargeData: any): ImmediateAction[] {
  const actions: ImmediateAction[] = [];
  
  // Add basic actions for arrest stage with URGENT priority
  if (caseData.caseStage === 'arrest') {
    actions.push(
      { action: '**Right to Silence**: Answering questions before consulting an attorney is something legal professionals consistently advise against — anything said can be used in the case.', urgency: 'urgent' },
      { action: '**Legal Representation**: Requesting an attorney before responding to questions is a constitutional right and a standard first step at this stage.', urgency: 'urgent' },
      { action: '**Compliance and Counsel**: Complying with lawful officer instructions and requesting an attorney are not in conflict — attorneys advise doing both.', urgency: 'urgent' },
      { action: 'Write down your booking number and where you are', urgency: 'high' }
    );
  }
  
  // Add stage-specific critical actions with URGENT priority
  if (stageData?.criticalActions) {
    actions.push(...stageData.criticalActions.map((action: string) => ({ 
      action, 
      urgency: 'urgent' as const 
    })));
  }
  
  // Add stage-specific immediate actions with HIGH priority
  if (stageData?.immediateActions) {
    actions.push(...stageData.immediateActions.map((action: string) => ({ 
      action, 
      urgency: 'high' as const 
    })));
  }
  
  // Add charge-specific urgent actions from database
  specificCharges.forEach(charge => {
    if (charge.urgentActions) {
      actions.push(...charge.urgentActions.map((action: string) => ({ 
        action, 
        urgency: 'urgent' as const 
      })));
    }
  });
  
  // Add fallback charge-specific actions with MEDIUM priority
  if (fallbackChargeData?.immediateActions) {
    actions.push(...fallbackChargeData.immediateActions.map((action: string) => ({ 
      action, 
      urgency: 'medium' as const 
    })));
  }
  
  // Add attorney action if needed with URGENT priority
  if (!caseData.hasAttorney && caseData.caseStage === 'arrest') {
    actions.unshift({ 
      action: 'Ask for a public defender right away if you can\'t afford a lawyer', 
      urgency: 'urgent' 
    });
  }
  
  // Remove duplicates based on action text
  const uniqueActions = Array.from(
    new Map(actions.map(item => [item.action, item])).values()
  );
  
  return uniqueActions;
}

function buildRightsForCharges(specificCharges: any[], caseStage: string): string[] {
  const rights: string[] = [];
  
  // Add basic constitutional rights
  rights.push(...buildBasicRights(caseStage));
  
  // Add charge-specific rights
  specificCharges.forEach(charge => {
    if (charge.specificRights) {
      rights.push(...charge.specificRights);
    }
  });
  
  return Array.from(new Set(rights)); // Remove duplicates
}

function buildWarningsForCharges(caseData: CaseData, specificCharges: any[], fallbackChargeData: any): string[] {
  const warnings: string[] = [];
  
  // Add general warnings
  warnings.push(
    'Do not discuss your case on social media',
    '**Witness and Victim Contact**: Contact with witnesses or the alleged victim while charges are pending can result in additional charges or bail revocation — attorneys consistently flag this as a significant risk.',
    'Comply with all court orders and bail conditions'
  );
  
  if (caseData.custodyStatus === 'detained') {
    warnings.push('Limited time to prepare defense while in custody');
  }
  
  if (caseData.caseStage === 'arrest' || caseData.caseStage === 'arraignment') {
    warnings.push('Maintain good behavior to preserve bail eligibility');
  }
  
  // Add charge-specific warnings based on charge category
  specificCharges.forEach(charge => {
    if (charge.category === 'felony') {
      warnings.push(`${charge.name}: Potential consequences include restitution requirements`);
    }
    if (charge.jurisdiction === 'Federal') {
      warnings.push(`Federal charge: Federal sentencing guidelines apply`);
    }
  });
  
  return warnings;
}

function buildEvidenceForCharges(specificCharges: any[], fallbackChargeData: any): string[] {
  const evidence: string[] = [];
  
  // Add charge-specific evidence from database
  specificCharges.forEach(charge => {
    if (charge.evidenceToGather) {
      evidence.push(...charge.evidenceToGather);
    }
  });
  
  // Add fallback evidence if no specific charges
  if (evidence.length === 0 && fallbackChargeData?.evidenceToGather) {
    evidence.push(...fallbackChargeData.evidenceToGather);
  }
  
  return Array.from(new Set(evidence)); // Remove duplicates
}

function buildAvoidActionsForCharges(specificCharges: any[], stageData: any): string[] {
  const avoidActions: string[] = [];
  
  // Add stage-specific avoid actions
  if ((stageData as any)?.avoidActions) {
    avoidActions.push(...(stageData as any).avoidActions);
  }
  
  // Add general avoid actions for arrest/detention
  avoidActions.push(
    'Do not discuss case with cellmates',
    'Documents and waivers signed without attorney review can limit legal options — attorneys advise reviewing any paperwork with counsel first.',
    'Waiving rights before consulting an attorney can significantly affect how a case proceeds.'
  );
  
  // Add charge-specific avoid actions
  specificCharges.forEach(charge => {
    if (charge.category === 'felony') {
      const citationLabel = getVerifiedCitation(charge);
      avoidActions.push(
        `Contact with the alleged victim while charges are pending can result in additional charges or bail violations` +
        (citationLabel ? ` (${citationLabel})` : '') + '.',
      );
    }
    if (charge.name.toLowerCase().includes('domestic')) {
      avoidActions.push('Do not violate any restraining orders');
    }
  });
  
  return Array.from(new Set(avoidActions)); // Remove duplicates
}

function buildNextSteps(caseData: CaseData, stageData: any): string[] {
  const steps: string[] = [];
  
  switch (caseData.caseStage) {
    case 'arrest':
      steps.push(
        'Contact attorney or request public defender',
        'Notify family/employer of situation',
        'Gather bail money and documentation',
        'Prepare for arraignment hearing'
      );
      break;
    case 'arraignment':
      steps.push(
        'Meet with attorney to discuss case',
        'Review charging documents carefully',
        'Begin gathering evidence and witnesses',
        'Understand bail conditions and comply'
      );
      break;
    case 'pretrial':
      steps.push(
        'Work with attorney on defense strategy',
        'Participate in discovery process',
        'Consider plea negotiations',
        'Prepare for trial if necessary'
      );
      break;
  }
  
  return steps;
}

// Jurisdictions with specific deadline data in jurisdictionRules.
// Used by both buildDeadlines (rule-based path) and stampEstimateDeadlines (Claude path).
export const KNOWN_JURISDICTIONS = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'WA', 'OH', 'GA', 'AZ', 'NJ', 'MI', 'NC', 'VA', 'FEDERAL'];

/**
 * Stamps isEstimate: true on every deadline for jurisdictions that are not in the
 * specifically-mapped set.  Call this after any AI-generated guidance so that
 * unmapped states (e.g. MT, WY, ND) always surface the estimate notice in the
 * dashboard and PDF export, regardless of whether rule-based or Claude generated
 * the deadlines.
 */
export function stampEstimateDeadlines(
  jurisdiction: string,
  deadlines: GuidanceDeadline[]
): GuidanceDeadline[] {
  const isEstimate = !KNOWN_JURISDICTIONS.includes((jurisdiction ?? '').toUpperCase());
  if (!isEstimate) return deadlines;
  return deadlines.map(d => ({ ...d, isEstimate: true }));
}

function buildDeadlines(caseData: CaseData, jurisdictionData: any, stageData: any): GuidanceDeadline[] {
  const deadlines: GuidanceDeadline[] = [];

  // Determine if this jurisdiction is one of the specifically mapped ones or a federal fallback
  const jurisdiction = caseData.jurisdiction?.toUpperCase() || '';
  const isEstimate = !KNOWN_JURISDICTIONS.includes(jurisdiction);

  if (caseData.caseStage === 'arrest') {
    deadlines.push({
      event: 'Arraignment Hearing',
      timeframe: jurisdictionData.arraignmentDeadline,
      description: 'First court appearance where charges are formally read',
      priority: 'critical',
      daysFromNow: 2,
      ...(isEstimate && { isEstimate: true }),
    });
  }
  
  if (caseData.caseStage === 'arraignment') {
    deadlines.push({
      event: 'Preliminary Hearing',
      timeframe: jurisdictionData.preliminaryHearing || 'Within 10-14 days',
      description: 'Court determines probable cause for charges',
      priority: 'important',
      daysFromNow: 10,
      ...(isEstimate && { isEstimate: true }),
    });
  }
  
  deadlines.push({
    event: 'Discovery Deadline',
    timeframe: jurisdictionData.discoveryDeadline,
    description: 'Exchange of evidence between prosecution and defense',
    priority: 'normal',
    daysFromNow: 30,
    ...(isEstimate && { isEstimate: true }),
  });
  
  return deadlines;
}

function buildBasicRights(caseStage: string): string[] {
  const basicRights = [
    'Right to remain silent',
    'Right to attorney representation',
    'Right to reasonable bail',
    'Right to fair and speedy trial',
    'Right to confront witnesses',
    'Right to present defense evidence'
  ];
  
  return basicRights;
}

function buildResources(jurisdiction: string, hasAttorney: boolean): GuidanceResource[] {
  const resources: GuidanceResource[] = [];
  
  if (!hasAttorney) {
    resources.push({
      type: 'Public Defender Office',
      description: 'Free legal representation if you qualify financially. Income thresholds shown are approximate — eligibility is determined by the court at your first appearance, not by these figures alone.',
      contact: 'Contact your local public defender office',
      hours: 'Monday-Friday 8:00 AM - 5:00 PM'
    });
  }
  
  resources.push(
    {
      type: 'Legal Aid Society',
      description: 'Additional legal assistance and resources',
      contact: 'Local legal aid organizations',
      hours: 'Varies by location'
    },
    {
      type: 'Court Self-Help Center',
      description: 'Information about court procedures and forms',
      contact: 'Located at courthouse',
      hours: 'Court business hours'
    }
  );
  
  return resources;
}

function buildOverview(caseData: CaseData, specificCharges: any[], jurisdictionData: any): string {
  const { caseStage, custodyStatus, hasAttorney } = caseData;
  
  // Part 1: Current situation
  let situation = '';
  if (caseStage === 'arrest') {
    situation = custodyStatus === 'detained' 
      ? 'You have been arrested and are currently in custody.' 
      : 'You have been arrested and released.';
  } else if (caseStage === 'arraignment') {
    situation = 'You are at the arraignment stage where charges will be formally read and you will enter a plea.';
  } else if (caseStage === 'pre-trial') {
    situation = 'Your case is in the pre-trial phase where evidence is being gathered and reviewed.';
  } else if (caseStage === 'trial') {
    situation = 'Your case is going to trial where evidence will be presented and a verdict will be reached.';
  } else {
    situation = 'You are facing criminal charges and navigating the legal process.';
  }
  
  // Part 2: Important actions (2-3 key things)
  let actions = '';
  if (!hasAttorney) {
    actions = 'Securing legal representation is the immediate priority — the public defender\'s office provides representation at no cost for those who qualify. Making statements to police before speaking with an attorney is something legal professionals consistently advise against.';
  } else if (caseStage === 'arrest') {
    actions = 'Attorneys consistently advise against making statements without counsel present. Attending the arraignment hearing on time is the other immediate priority.';
  } else if (caseStage === 'arraignment') {
    actions = `Work with your lawyer to understand the charges and prepare for your plea. Make sure you meet the deadline for your arraignment: ${jurisdictionData.arraignmentDeadline}.`;
  } else if (caseStage === 'pre-trial') {
    actions = 'Work closely with your lawyer to gather evidence and prepare your defense. Follow all court orders and bail conditions.';
  } else {
    actions = 'Follow your lawyer\'s advice, attend all court dates, and comply with any conditions of your release.';
  }
  
  // Part 3: Key issue determining outcome
  let keyIssue = '';
  if (specificCharges.length > 0) {
    const charge = specificCharges[0];
    if (charge.defenseStrategies && charge.defenseStrategies.length > 0) {
      keyIssue = `The key issue in your case will likely be: ${charge.defenseStrategies[0].toLowerCase()}.`;
    } else {
      keyIssue = 'The outcome will depend on the strength of the evidence and your defense strategy.';
    }
  } else {
    keyIssue = 'The strength of the prosecution\'s evidence and your defense strategy will determine the outcome.';
  }
  
  return `${situation} ${actions} ${keyIssue}`;
}

function buildCaseTimeline(caseStage: string, jurisdictionData: any): Array<{stage: string; description: string; timeframe: string; completed: boolean}> {
  const timeline = [
    {
      stage: 'Arrest',
      description: 'Taken into custody and booked',
      timeframe: 'Completed',
      completed: true
    },
    {
      stage: 'Arraignment',
      description: 'Charges read, plea entered, bail set',
      timeframe: jurisdictionData.arraignmentDeadline,
      completed: caseStage !== 'arrest'
    },
    {
      stage: 'Preliminary Hearing',
      description: 'Court determines probable cause',
      timeframe: jurisdictionData.preliminaryHearing || 'Within 2 weeks',
      completed: false
    },
    {
      stage: 'Discovery',
      description: 'Evidence exchange and investigation',
      timeframe: 'Ongoing process',
      completed: false
    },
    {
      stage: 'Trial',
      description: 'Presentation of evidence and verdict',
      timeframe: jurisdictionData.speedyTrialRight,
      completed: false
    }
  ];
  
  return timeline;
}

// Exported so tests can assert that every key in CHARGE_KEYWORDS has a corresponding entry here.
// When adding a new charge type to CHARGE_KEYWORDS you MUST add an entry here too (or the
// charge-coverage Vitest test will fail).
export const CHARGE_CONSEQUENCE_MAP: Record<string, CollateralConsequenceItem[]> = {
  dui: [
    {
      category: 'drivers_license',
      consequence: 'A DUI conviction typically triggers an automatic administrative license suspension separate from any criminal sentence, and may require an ignition interlock device.',
      timing: 'Upon arrest (administrative) and conviction (criminal)',
      actionNote: 'Request a DMV hearing to contest the administrative suspension — the deadline is often 10 days from arrest, but this window varies by state. Check your arrest paperwork or your state DMV website immediately. This is one common consequence; a DUI conviction can carry additional consequences depending on your state and circumstances.',
    },
  ],
  assault: [
    {
      category: 'firearms',
      consequence: 'Certain assault convictions — particularly felonies or offenses involving domestic partners — result in a federal prohibition on firearm possession under 18 U.S.C. § 922(g).',
      timing: 'Upon felony conviction or qualifying misdemeanor conviction',
      actionNote: 'Ask your attorney whether the specific charge carries a firearms disability. Even misdemeanor assault can trigger this prohibition in some circumstances.',
    },
  ],
  drug: [
    {
      category: 'benefits',
      consequence: 'Federal drug convictions can temporarily or permanently suspend eligibility for federal student financial aid and certain public benefits depending on the offense and prior record.',
      timing: 'Upon conviction',
      actionNote: 'Ask your attorney whether a diversion program or deferred adjudication would avoid a disqualifying conviction. This is one of the more common consequences — drug charges can carry additional impacts (immigration, housing, licensing) depending on your circumstances. Use the [full collateral consequences screener](/collateral-consequences) for a more complete picture.',
    },
  ],
  theft: [
    {
      category: 'background_check',
      consequence: 'Theft convictions — especially felonies — appear on background checks and commonly disqualify individuals from jobs in finance, retail, healthcare, and government. The conviction must typically be disclosed on job applications.',
      timing: 'Upon conviction',
      actionNote: 'Discuss with your attorney whether expungement or record sealing is available in your jurisdiction after the case resolves. This is one of the more common consequences — theft charges can carry additional impacts depending on your specific circumstances and state. Use the [full collateral consequences screener](/collateral-consequences) for a more complete picture.',
    },
  ],
  domestic: [
    {
      category: 'firearms',
      consequence: 'A domestic violence misdemeanor conviction triggers a federal lifetime ban on firearm possession under the Lautenberg Amendment (18 U.S.C. § 922(g)(9)), even if no prison time is imposed.',
      timing: 'Upon conviction',
      actionNote: 'This applies even to misdemeanor pleas. Discuss with your attorney before entering any plea.',
    },
  ],
  fraud: [
    {
      category: 'employment',
      consequence: 'Fraud convictions — particularly felonies — can permanently bar individuals from working in finance, banking, or government-regulated industries, and often require disclosure on professional license applications.',
      timing: 'Upon conviction',
      actionNote: 'If you hold or are pursuing a professional license, tell your attorney immediately — fraud charges can trigger separate licensing board proceedings.',
    },
  ],
  burglary: [
    {
      category: 'housing',
      consequence: 'Burglary convictions — especially felonies — can result in denial of public housing, loss of housing vouchers, and barriers to renting private housing due to background check policies.',
      timing: 'Upon conviction',
      actionNote: 'If you rely on public housing or housing assistance, notify your attorney so the housing impact is considered in any plea or defense strategy.',
    },
  ],
  traffic: [
    {
      category: 'drivers_license',
      consequence: 'Serious traffic violations — including reckless driving, hit-and-run, or habitual offenses — can result in license suspension, revocation, or points accumulation leading to disqualification.',
      timing: 'Upon conviction or administrative action',
      actionNote: 'Request a DMV hearing if your license is administratively suspended. Commercial driver\'s license (CDL) holders face stricter consequences.',
    },
  ],
  weapons: [
    {
      category: 'firearms',
      consequence: 'A felony conviction results in a permanent federal prohibition on owning or possessing any firearm or ammunition for life.',
      timing: 'Upon felony conviction',
      actionNote: 'Any prior firearms must be transferred to a third party or surrendered. Failure to comply is a separate federal felony.',
    },
  ],
};

// Build personalized collateral consequences from background fields + charge type
function buildCollateralConsequences(caseData: CaseData, chargeType: string): CollateralConsequenceItem[] {
  const items: CollateralConsequenceItem[] = [];

  // Supervision / probation / parole
  if (caseData.supervisionStatus && caseData.supervisionStatus !== 'none' && caseData.supervisionStatus !== '') {
    const isParole = caseData.supervisionStatus === 'parole';
    items.push({
      category: 'supervision_revocation',
      consequence: isParole
        ? 'A new arrest or conviction can trigger a parole revocation hearing and return you to prison to serve the remainder of your sentence.'
        : 'A new charge may be reported to your probation officer and can trigger a revocation hearing, leading to incarceration.',
      timing: 'Upon arrest or conviction',
      actionNote: `Tell your attorney about your ${isParole ? 'parole' : 'probation'} status immediately — they must factor this into every decision, including bail and plea discussions.`,
    });
  }

  // Immigration status
  if (caseData.citizenshipStatus === 'non_citizen') {
    items.push({
      category: 'immigration',
      consequence: 'Non-citizens — including green card holders — can face deportation, inadmissibility, or bars to naturalization as a result of certain criminal convictions (Padilla v. Kentucky, 2010).',
      timing: 'Upon conviction or guilty plea',
      actionNote: 'Request that your attorney assess the immigration consequences of every charge and every plea option before you make any decisions.',
    });
  }

  // Minor children / custody
  if (caseData.hasMinorChildren === true) {
    items.push({
      category: 'custody',
      consequence: 'An arrest or conviction — especially for violent or drug charges — can be used as grounds to modify custody or visitation arrangements. If a family court order is already in place, an arrest may trigger a review.',
      timing: 'Upon arrest or conviction',
      actionNote: 'Inform your attorney about any existing custody orders. A family law attorney may also need to be involved.',
    });
  }

  // Professional license
  if (caseData.hasProfessionalLicense === true) {
    items.push({
      category: 'employment',
      consequence: 'Most state licensing boards (medical, legal, nursing, teaching, contracting, financial, etc.) require self-reporting of arrests and convictions. Failure to report can result in separate disciplinary action beyond the criminal case.',
      timing: 'Upon arrest, charge, or conviction (varies by board)',
      actionNote: 'Review your license board\'s reporting rules with your attorney. Proactive disclosure is almost always better than discovery by the board.',
    });
  }

  // Public housing / housing assistance
  if (caseData.hasHousingAssistance === true) {
    items.push({
      category: 'housing',
      consequence: 'Convictions for certain offenses — especially drug charges and crimes involving violence — can result in mandatory eviction from public housing or termination of housing vouchers under federal rules (24 CFR Part 966).',
      timing: 'Upon conviction or guilty plea',
      actionNote: 'Notify your attorney that you receive housing assistance. The type of charge and local housing authority discretion both matter here.',
    });
  }

  // Charge-based consequences — defined at module level in CHARGE_CONSEQUENCE_MAP
  const chargeSpecific = CHARGE_CONSEQUENCE_MAP[chargeType] || [];
  for (const item of chargeSpecific) {
    if (!items.some(i => i.category === item.category)) {
      items.push(item);
    }
  }

  return items;
}

// Build uncertainty notices when key background information is missing or jurisdiction is generic
function buildUncertainties(caseData: CaseData, jurisdictionData: any, fallbackChargeType?: string): UncertaintyItem[] {
  const items: UncertaintyItem[] = [];
  const jurisdiction = caseData.jurisdiction?.toUpperCase() || '';

  // Jurisdiction not specifically mapped — using federal defaults
  const knownJurisdictions = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'WA', 'OH', 'GA', 'AZ', 'NJ', 'MI', 'NC', 'VA', 'FEDERAL'];
  if (!knownJurisdictions.includes(jurisdiction)) {
    items.push({
      area: 'Jurisdiction-Specific Deadlines',
      note: `Specific court deadlines and procedures for ${jurisdiction || 'your state'} were not available in our rules database. The timeframes shown are general estimates. Verify all deadlines with a local attorney or your court clerk.`,
    });
  }

  // Supervision status not provided — couldn't assess revocation risk
  if (!caseData.supervisionStatus) {
    items.push({
      area: 'Probation / Parole Status',
      note: 'You did not indicate whether you are currently on probation or parole. If you are, a new charge may trigger a revocation proceeding — a serious additional risk that your attorney must know about immediately.',
    });
  }

  // Immigration status not provided
  if (!caseData.citizenshipStatus) {
    items.push({
      area: 'Immigration Consequences',
      note: 'If you are not a U.S. citizen, criminal charges can have deportation or inadmissibility consequences. Because you did not indicate your citizenship status, these consequences could not be assessed. Let your attorney know your status right away.',
    });
  }

  // Minor children — null means unanswered, not "no"
  if (caseData.hasMinorChildren === null || caseData.hasMinorChildren === undefined) {
    items.push({
      area: 'Minor Children / Custody Risk',
      note: 'You did not indicate whether you have minor children in your care. If you do, a new arrest or conviction can be used to modify custody or visitation arrangements. Let your attorney know so they can factor this into your case strategy.',
    });
  }

  // Professional license — null means unanswered, not "no"
  if (caseData.hasProfessionalLicense === null || caseData.hasProfessionalLicense === undefined) {
    items.push({
      area: 'Professional License',
      note: 'You did not indicate whether you hold a professional license (nursing, teaching, CDL, contracting, etc.). Most licensing boards require self-reporting of arrests and convictions — failure to report can result in separate disciplinary action. Tell your attorney if this applies to you.',
    });
  }

  // Housing assistance — null means unanswered, not "no"
  if (caseData.hasHousingAssistance === null || caseData.hasHousingAssistance === undefined) {
    items.push({
      area: 'Public / Subsidized Housing',
      note: 'You did not indicate whether you receive housing assistance. Convictions for certain offenses — especially drug charges — can trigger mandatory eviction from public housing or loss of housing vouchers under federal rules. Tell your attorney if this applies to you.',
    });
  }

  // Custody status — in custody increases urgency of many deadlines
  if (caseData.custodyStatus === 'unknown' || !caseData.custodyStatus) {
    items.push({
      area: 'Custody Status',
      note: 'Your custody status was not specified. Deadlines and procedural timelines are generally shorter when a defendant is in custody. If you are currently detained, confirm all deadlines with your attorney or the court.',
    });
  }

  // Default charge bucket — no keyword match, so guidance is generic
  if (fallbackChargeType === 'default') {
    items.push({
      area: 'Charge-Specific Guidance Not Available',
      note: "We don't have detailed guidance for this specific charge type. The information shown is general and applies to most criminal cases. An attorney familiar with this charge type in your state will have more specific guidance on defenses, collateral consequences, and deadlines that apply to your situation.",
    });
  }

  return items;
}