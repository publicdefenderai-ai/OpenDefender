// Enhanced Legal Guidance Generation Engine
// Implements charge-specific, jurisdiction-specific, and case-stage guidance

import { criminalCharges, getChargeById } from '../../shared/criminal-charges';

interface CaseData {
  jurisdiction: string;
  charges: string | string[];
  caseStage: string;
  custodyStatus: string;
  hasAttorney: boolean;
}

interface GuidanceDeadline {
  event: string;
  timeframe: string;
  description: string;
  priority: 'critical' | 'important' | 'normal';
  daysFromNow?: number;
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
      'Request independent blood/breath test if possible',
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
      'Do not discuss substances with anyone except attorney',
      'Document any medical prescriptions',
      'Identify potential search and seizure issues',
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
      'Stop any ongoing transactions related to the case',
      'Avoid communicating with potential co-defendants'
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
      'Do not possess any weapons while case pending',
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
      'Stay silent - don\'t answer questions without a lawyer',
      'Ask for a lawyer before any questioning',
      'Do what police say, but tell them you want a lawyer',
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
      'Don\'t sign anything without a lawyer looking at it first',
      'Don\'t give up any of your rights',
      'Don\'t fight back or resist when being arrested',
      'Don\'t answer questions or make statements to police'
    ]
  },
  'arraignment': {
    name: 'First Court Appearance',
    criticalActions: [
      'Say "Not Guilty" to keep all your options open',
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
    mockQA: buildMockQA(caseData, specificCharges)
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
        explanation: "If you don't fully understand, it's okay to say 'I would like my attorney to explain them to me.' Don't pretend to understand if you don't.",
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
        explanation: "Your attorney should handle this. Don't try to file motions on your own without legal guidance.",
        category: 'procedural'
      },
      {
        question: "Are you interested in discussing a plea agreement?",
        suggestedResponse: "I would like to continue discussions with my attorney before making any decisions.",
        explanation: "Don't agree to anything on the spot. Always discuss plea offers thoroughly with your attorney.",
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
        explanation: "You have the right to remain silent. Use it. Anything you say can be used against you.",
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
      explanation: "Don't discuss details of your case without your attorney present. This protects your rights.",
      category: 'charges'
    });
  }
  
  return mockQA.slice(0, 5); // Limit to 5 questions
}

function identifyChargeType(charges: string): string {
  const chargeKeywords = {
    dui: ['dui', 'dwi', 'driving under', 'intoxicated', 'impaired', 'blood alcohol'],
    assault: ['assault', 'battery', 'fighting', 'bodily harm', 'aggravated assault'],
    drug: ['drug', 'possession', 'narcotic', 'controlled substance', 'marijuana', 'cocaine', 'heroin', 'fentanyl', 'meth'],
    theft: ['theft', 'larceny', 'stealing', 'shoplifting', 'petty theft', 'grand theft'],
    domestic: ['domestic', 'family violence', 'spousal', 'intimate partner'],
    fraud: ['fraud', 'embezzlement', 'forgery', 'identity theft', 'wire fraud', 'mail fraud', 'financial crime', 'white collar'],
    burglary: ['burglary', 'breaking and entering', 'home invasion', 'unlawful entry'],
    traffic: ['speeding', 'reckless driving', 'hit and run', 'running red light', 'traffic violation', 'driving without license'],
    weapons: ['weapon', 'firearm', 'gun', 'unlawful possession', 'concealed carry', 'armed']
  };
  
  for (const [type, keywords] of Object.entries(chargeKeywords)) {
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
    alerts.push('URGENT: Stay silent - don\'t answer questions without a lawyer');
    if (caseData.custodyStatus === 'detained') {
      alerts.push(`You must see a judge ${jurisdictionData.arraignmentDeadline}`);
    }
  }
  
  if (!caseData.hasAttorney) {
    alerts.push('CRITICAL: Ask for a public defender right away if you can\'t afford a lawyer');
  }
  
  // Add charge-specific critical alerts
  specificCharges.forEach(charge => {
    if (charge.urgentActions) {
      alerts.push(...charge.urgentActions.map((action: string) => `URGENT (${charge.code}): ${action}`));
    }
  });
  
  return alerts;
}

function buildImmediateActionsForCharges(caseData: CaseData, stageData: any, specificCharges: any[], fallbackChargeData: any): ImmediateAction[] {
  const actions: ImmediateAction[] = [];
  
  // Add basic actions for arrest stage with URGENT priority
  if (caseData.caseStage === 'arrest') {
    actions.push(
      { action: 'Stay silent - don\'t answer questions without a lawyer', urgency: 'urgent' },
      { action: 'Ask for a lawyer before any questioning', urgency: 'urgent' },
      { action: 'Do what police say, but tell them you want a lawyer', urgency: 'urgent' },
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
      rights.push(...charge.specificRights.map((right: string) => `${right} (${charge.code})`));
    }
  });
  
  return Array.from(new Set(rights)); // Remove duplicates
}

function buildWarningsForCharges(caseData: CaseData, specificCharges: any[], fallbackChargeData: any): string[] {
  const warnings: string[] = [];
  
  // Add general warnings
  warnings.push(
    'Do not discuss your case on social media',
    'Avoid contact with witnesses or alleged victims',
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
      warnings.push(`Federal charge (${charge.code}): Federal sentencing guidelines apply`);
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
    'Do not sign any documents without attorney review',
    'Do not waive any rights'
  );
  
  // Add charge-specific avoid actions
  specificCharges.forEach(charge => {
    if (charge.category === 'felony') {
      avoidActions.push(`Do not contact alleged victims (${charge.code})`);
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

function buildDeadlines(caseData: CaseData, jurisdictionData: any, stageData: any): GuidanceDeadline[] {
  const deadlines: GuidanceDeadline[] = [];
  
  if (caseData.caseStage === 'arrest') {
    deadlines.push({
      event: 'Arraignment Hearing',
      timeframe: jurisdictionData.arraignmentDeadline,
      description: 'First court appearance where charges are formally read',
      priority: 'critical',
      daysFromNow: 2
    });
  }
  
  if (caseData.caseStage === 'arraignment') {
    deadlines.push({
      event: 'Preliminary Hearing',
      timeframe: jurisdictionData.preliminaryHearing || 'Within 10-14 days',
      description: 'Court determines probable cause for charges',
      priority: 'important',
      daysFromNow: 10
    });
  }
  
  deadlines.push({
    event: 'Discovery Deadline',
    timeframe: jurisdictionData.discoveryDeadline,
    description: 'Exchange of evidence between prosecution and defense',
    priority: 'normal',
    daysFromNow: 30
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
      description: 'Free legal representation if you qualify financially',
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
    actions = 'The most important thing right now is to get a lawyer - ask for a public defender if you cannot afford one. Do not make any statements to police without a lawyer present.';
  } else if (caseStage === 'arrest') {
    actions = 'Stay silent and do not answer questions without your lawyer. Make sure you attend your arraignment hearing on time.';
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