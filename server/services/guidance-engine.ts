// Enhanced Legal Guidance Generation Engine
// Implements charge-specific, jurisdiction-specific, and case-stage guidance

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

interface EnhancedGuidance {
  criticalAlerts: string[];
  immediateActions: string[];
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
  }
};

// Case stage progression with detailed guidance
const stageGuidance = {
  'arrest': {
    name: 'Arrest Stage',
    criticalActions: [
      'Exercise right to remain silent immediately',
      'Request attorney before any questioning',
      'Comply physically but assert rights verbally',
      'Memorize booking number and jail location'
    ],
    immediateDeadlines: [
      'Arraignment within 24-72 hours',
      'Contact attorney within 24 hours',
      'Notify emergency contacts'
    ],
    rights: [
      'Right to remain silent (5th Amendment)',
      'Right to attorney (6th Amendment)',
      'Right to reasonable bail (8th Amendment)',
      'Right to phone call',
      'Right to medical attention if injured',
      'Right to know charges against you'
    ],
    avoidActions: [
      'Do not discuss case with cellmates',
      'Do not sign any documents without attorney review',
      'Do not waive any rights',
      'Do not resist arrest physically',
      'Do not make statements to police'
    ]
  },
  'arraignment': {
    name: 'Arraignment',
    criticalActions: [
      'Enter "Not Guilty" plea to preserve options',
      'Request public defender if you qualify financially',
      'Address bail and release conditions',
      'Get copy of charging documents'
    ],
    courtPreparation: [
      'Dress professionally (business casual minimum)',
      'Arrive early and locate correct courtroom',
      'Bring photo ID and any court paperwork',
      'Turn off cell phone',
      'Stand when judge enters and exits'
    ],
    rights: [
      'Right to hear charges read aloud',
      'Right to enter plea',
      'Right to attorney representation',
      'Right to reasonable bail consideration',
      'Right to interpreter if needed'
    ]
  },
  'pretrial': {
    name: 'Pretrial Phase',
    criticalActions: [
      'Work closely with attorney on defense strategy',
      'Comply strictly with all bail conditions',
      'Gather evidence and locate witnesses',
      'Consider plea negotiations carefully'
    ],
    deadlines: [
      'Discovery exchanges',
      'Motion filing deadlines',
      'Plea negotiation deadlines',
      'Trial preparation milestones'
    ],
    activities: [
      'Review discovery materials with attorney',
      'Participate in depositions if required',
      'Attend all scheduled hearings',
      'Consider expert witness needs',
      'Evaluate plea offer terms'
    ]
  },
  'trial': {
    name: 'Trial Phase',
    criticalActions: [
      'Prepare testimony with attorney',
      'Review evidence and witness lists',
      'Understand courtroom procedures',
      'Prepare for possible outcomes'
    ],
    rights: [
      'Right to jury trial (in most cases)',
      'Right to confront witnesses',
      'Right to present defense',
      'Right to remain silent',
      'Right to attorney representation throughout'
    ]
  }
};

export function generateEnhancedGuidance(caseData: CaseData): EnhancedGuidance {
  const { jurisdiction, charges, caseStage, custodyStatus, hasAttorney } = caseData;
  
  // Get jurisdiction-specific rules
  const jurisdictionData = jurisdictionRules[jurisdiction as keyof typeof jurisdictionRules] || jurisdictionRules['federal'];
  
  // Identify charge type (simplified matching)
  // Handle charges as either string or array
  const chargesString = Array.isArray(charges) ? charges.join(' ').toLowerCase() : charges.toLowerCase();
  const chargeType = identifyChargeType(chargesString);
  const chargeData = chargeGuidance[chargeType as keyof typeof chargeGuidance];
  
  // Get stage-specific guidance
  const stageData = stageGuidance[caseStage as keyof typeof stageGuidance];
  
  // Build comprehensive guidance
  const guidance: EnhancedGuidance = {
    criticalAlerts: buildCriticalAlerts(caseData, jurisdictionData),
    immediateActions: buildImmediateActions(caseData, stageData, chargeData),
    nextSteps: buildNextSteps(caseData, stageData),
    deadlines: buildDeadlines(caseData, jurisdictionData, stageData),
    rights: (stageData as any)?.rights || buildBasicRights(caseStage),
    resources: buildResources(jurisdiction, hasAttorney),
    warnings: buildWarnings(caseData, chargeData),
    evidenceToGather: chargeData?.evidenceToGather || [],
    courtPreparation: (stageData as any)?.courtPreparation || [],
    avoidActions: (stageData as any)?.avoidActions || [],
    timeline: buildCaseTimeline(caseStage, jurisdictionData)
  };
  
  return guidance;
}

function identifyChargeType(charges: string): string {
  const chargeKeywords = {
    dui: ['dui', 'dwi', 'driving under', 'intoxicated', 'impaired'],
    assault: ['assault', 'battery', 'domestic violence', 'fighting'],
    drug: ['drug', 'possession', 'narcotic', 'controlled substance', 'marijuana', 'cocaine'],
    theft: ['theft', 'larceny', 'stealing', 'shoplifting', 'burglary', 'robbery'],
    domestic: ['domestic', 'family violence', 'spousal']
  };
  
  for (const [type, keywords] of Object.entries(chargeKeywords)) {
    if (keywords.some(keyword => charges.includes(keyword))) {
      return type;
    }
  }
  
  return 'general'; // Default for unrecognized charges
}

function buildCriticalAlerts(caseData: CaseData, jurisdictionData: any): string[] {
  const alerts: string[] = [];
  
  if (caseData.caseStage === 'arrest') {
    alerts.push('URGENT: Exercise right to remain silent - do not answer questions without attorney');
    if (caseData.custodyStatus === 'detained') {
      alerts.push(`Arraignment must occur ${jurisdictionData.arraignmentDeadline}`);
    }
  }
  
  if (!caseData.hasAttorney) {
    alerts.push('CRITICAL: Request public defender immediately if you cannot afford attorney');
  }
  
  return alerts;
}

function buildImmediateActions(caseData: CaseData, stageData: any, chargeData: any): string[] {
  const actions: string[] = [];
  
  // Add stage-specific actions
  if (stageData?.criticalActions) {
    actions.push(...stageData.criticalActions);
  }
  
  // Add charge-specific actions
  if (chargeData?.immediateActions) {
    actions.push(...chargeData.immediateActions.slice(0, 3)); // Limit to top 3
  }
  
  return actions;
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

function buildWarnings(caseData: CaseData, chargeData: any): string[] {
  const warnings: string[] = [
    'Do not discuss your case on social media',
    'Avoid contact with witnesses or alleged victims',
    'Comply with all court orders and bail conditions'
  ];
  
  if (caseData.custodyStatus === 'detained') {
    warnings.push(
      'Limited time to prepare defense while in custody',
      'Maintain good behavior to preserve bail eligibility'
    );
  }
  
  if (chargeData?.collateralConsequences) {
    warnings.push(`Potential consequences: ${chargeData.collateralConsequences[0]}`);
  }
  
  return warnings;
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