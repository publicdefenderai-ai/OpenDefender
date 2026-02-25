import * as fs from 'fs';

const jurisdictions = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
  'DC','PR','VI','GU','AS','MP'
];

interface ChargeTemplate {
  name: string;
  idSuffix: string;
  category: 'misdemeanor' | 'infraction';
  description: (jur: string) => string;
  maxPenalty: string;
  commonDefenses: string[];
  evidenceToGather: string[];
  specificRights: string[];
  urgentActions: string[];
  codes: Record<string, string>;
}

const chargeTemplates: ChargeTemplate[] = [
  // TIER 1: Criminal Traffic
  {
    name: 'Reckless/Careless Driving (Criminal)',
    idSuffix: 'reckless-driving-criminal',
    category: 'misdemeanor',
    description: (jur) => `Operating a motor vehicle with willful or wanton disregard for the safety of persons or property under ${jur} law`,
    maxPenalty: 'Up to 90 days jail and/or $1,000 fine, license points, possible suspension',
    commonDefenses: ['Emergency circumstances requiring evasive action', 'Mechanical failure beyond driver control', 'Road conditions contributed to driving pattern', 'Inaccurate speed measurement', 'Mistaken identity of driver'],
    evidenceToGather: ['Dashcam or traffic camera footage', 'Vehicle maintenance records', 'Weather and road condition reports', 'Witness statements', 'GPS or speed data', 'Officer training records for speed detection'],
    specificRights: ['Right to contest traffic citation', 'Right to driving record review', 'Right to attorney', 'Right to jury trial for criminal traffic offenses'],
    urgentActions: ['Do not admit fault at the scene', 'Note road and weather conditions', 'Take photos of the scene', 'Contact an attorney before your court date'],
    codes: {
      AL:'32-5A-190', AK:'28.35.400', AZ:'28-693', AR:'27-51-104', CA:'23103', CO:'42-4-1401', CT:'14-222', DE:'21-4175', FL:'316.192', GA:'40-6-390',
      HI:'291-2', ID:'49-1401', IL:'625-5/11-503', IN:'9-21-8-52', IA:'321.277', KS:'8-1566', KY:'189.290', LA:'32:58', ME:'29A-2073', MD:'21-901.1',
      MA:'90-24', MI:'257.626', MN:'169.13', MS:'63-3-1213', MO:'304.012', MT:'61-8-301', NE:'60-6.214', NV:'484B.653', NH:'265:79', NJ:'39:4-96',
      NM:'66-8-113', NY:'1212', NC:'20-140', ND:'39-08-03', OH:'2903.08', OK:'47-11-901', OR:'811.140', PA:'75-3736', RI:'31-27-4', SC:'56-5-2920',
      SD:'32-24-1', TN:'55-10-205', TX:'545.401', UT:'41-6a-528', VT:'23-1091', VA:'46.2-852', WA:'46.61.500', WV:'17C-5-3', WI:'346.62', WY:'31-5-229',
      DC:'50-2201.04', PR:'9-1051', VI:'20-491', GU:'16-30101', AS:'22.0901', MP:'9-2101'
    }
  },
  {
    name: 'Driving with Expired Registration',
    idSuffix: 'expired-registration',
    category: 'misdemeanor',
    description: (jur) => `Operating a motor vehicle with an expired registration or without valid registration tags under ${jur} law`,
    maxPenalty: 'Up to $500 fine, possible vehicle impoundment',
    commonDefenses: ['Registration renewal was pending', 'Recently purchased vehicle within grace period', 'Clerical error by DMV', 'Valid registration in another state', 'Vehicle was not being operated on public roads'],
    evidenceToGather: ['Registration renewal receipt or application', 'DMV correspondence', 'Proof of payment', 'Vehicle purchase documents', 'Evidence of timely renewal attempt'],
    specificRights: ['Right to present proof of current registration at court', 'Right to dismissal if registration was valid at time of stop', 'Right to contest impoundment'],
    urgentActions: ['Renew your registration immediately', 'Bring proof of renewed registration to court', 'Many courts dismiss with proof of current registration', 'Check if your state has a grace period'],
    codes: {
      AL:'32-6-19', AK:'28.10.011', AZ:'28-2532', AR:'27-14-402', CA:'4000', CO:'42-3-134', CT:'14-12', DE:'21-2103', FL:'320.07', GA:'40-2-8',
      HI:'286-47', ID:'49-456', IL:'625-5/3-701', IN:'9-18-2-26', IA:'321.34', KS:'8-142', KY:'186.990', LA:'47:505', ME:'29A-351', MD:'13-411',
      MA:'90-9', MI:'257.255', MN:'168.09', MS:'27-19-31', MO:'301.130', MT:'61-3-313', NE:'60-382', NV:'482.385', NH:'261:40', NJ:'39:3-4',
      NM:'66-3-1', NY:'401', NC:'20-111', ND:'39-04-37', OH:'4503.11', OK:'47-4-107', OR:'803.315', PA:'75-1301', RI:'31-3-31', SC:'56-3-1230',
      SD:'32-5-14', TN:'55-4-110', TX:'502.412', UT:'41-1a-1303', VT:'23-511', VA:'46.2-646', WA:'46.16A.030', WV:'17A-3-16', WI:'341.04', WY:'31-2-210',
      DC:'50-1501.01', PR:'9-1052', VI:'20-492', GU:'16-30102', AS:'22.0902', MP:'9-2102'
    }
  },
  {
    name: 'Driving with Expired/No Inspection',
    idSuffix: 'expired-inspection',
    category: 'misdemeanor',
    description: (jur) => `Operating a motor vehicle without a valid safety inspection sticker or with an expired inspection under ${jur} law`,
    maxPenalty: 'Up to $200 fine, failed inspection may require repairs',
    commonDefenses: ['Inspection was scheduled and pending', 'Vehicle recently purchased', 'Inspection facility error', 'State does not require inspection for this vehicle type', 'Valid inspection from reciprocal state'],
    evidenceToGather: ['Inspection appointment records', 'Vehicle purchase date documentation', 'Inspection station records', 'Proof of subsequent inspection'],
    specificRights: ['Right to present proof of current inspection', 'Right to contest citation', 'Right to time to obtain inspection before penalties'],
    urgentActions: ['Get your vehicle inspected immediately', 'Bring proof of inspection to court for possible dismissal', 'Fix any safety issues identified'],
    codes: {
      AL:'32-5-240', AK:'28.10.031', AZ:'28-957', AR:'27-14-602', CA:'24002', CO:'42-4-237', CT:'14-164c', DE:'21-2133', FL:'316.610', GA:'40-8-23',
      HI:'286-26', ID:'49-903', IL:'625-5/13-101', IN:'9-19-6-25', IA:'321.238', KS:'8-1739', KY:'186.170', LA:'32:1304', ME:'29A-1751', MD:'23-101',
      MA:'90-7A', MI:'257.710', MN:'169.47', MS:'63-7-67', MO:'307.350', MT:'61-9-501', NE:'60-1701', NV:'484D.555', NH:'266:1', NJ:'39:8-1',
      NM:'66-3-901', NY:'306', NC:'20-183.8', ND:'39-21-44', OH:'4513.02', OK:'47-12-301', OR:'815.020', PA:'75-4703', RI:'31-38-3', SC:'56-19-420',
      SD:'32-15-1', TN:'55-9-205', TX:'548.602', UT:'41-6a-1601', VT:'23-1222', VA:'46.2-1157', WA:'46.32.010', WV:'17C-16-9', WI:'110.20', WY:'31-2-302',
      DC:'50-1101', PR:'9-1053', VI:'20-493', GU:'16-30103', AS:'22.0903', MP:'9-2103'
    }
  },
  // TIER 1: Failure to pay child support
  {
    name: 'Criminal Nonsupport / Failure to Pay Child Support',
    idSuffix: 'failure-to-pay-child-support',
    category: 'misdemeanor',
    description: (jur) => `Willful failure to provide court-ordered financial support for a child or dependent under ${jur} law`,
    maxPenalty: 'Up to 1 year jail, wage garnishment, license suspension, contempt penalties',
    commonDefenses: ['Inability to pay due to job loss or disability', 'Payments were made but not properly credited', 'Income change not yet reflected in order', 'Dispute over paternity', 'Good faith effort to find employment'],
    evidenceToGather: ['Payment receipts and records', 'Proof of income or unemployment', 'Medical records showing disability', 'Job search documentation', 'Communication with child support agency', 'Bank statements'],
    specificRights: ['Right to hearing before jail', 'Right to request order modification based on changed circumstances', 'Right to attorney (may be appointed for contempt)', 'Right to present evidence of inability to pay'],
    urgentActions: ['Make any partial payment you can afford immediately', 'File a motion to modify support if your income has changed', 'Contact the child support agency to set up a payment plan', 'Do not ignore court orders - appear at all hearings', 'Keep records of all payments made'],
    codes: {
      AL:'13A-13-4', AK:'11.51.120', AZ:'12-2458', AR:'5-26-401', CA:'270', CO:'14-6-101', CT:'53-304', DE:'13-1101', FL:'827.06', GA:'19-10-1',
      HI:'709-903', ID:'18-401', IL:'750-16/15', IN:'35-46-1-5', IA:'726.5', KS:'21-5606', KY:'530.050', LA:'14:74', ME:'19A-2601', MD:'10-203',
      MA:'273-15A', MI:'750.161', MN:'609.375', MS:'97-5-3', MO:'568.040', MT:'45-5-621', NE:'28-706', NV:'201.020', NH:'639:3', NJ:'2C:24-5',
      NM:'40-5-17', NY:'260.05', NC:'14-322', ND:'14-09-22', OH:'2919.21', OK:'21-852', OR:'163.555', PA:'23-4354', RI:'15-5-16.2', SC:'63-5-20',
      SD:'25-7-16', TN:'39-15-101', TX:'25.05', UT:'76-7-201', VT:'15-202', VA:'20-61', WA:'26.18.050', WV:'48-14-403', WI:'948.22', WY:'20-3-101',
      DC:'46-226.01', PR:'8-711', VI:'16-291', GU:'19-3501', AS:'45.0301', MP:'8-2101'
    }
  },
  // TIER 1: Noise / Nuisance
  {
    name: 'Noise Violation / Disturbing the Peace by Noise',
    idSuffix: 'noise-violation',
    category: 'misdemeanor',
    description: (jur) => `Creating excessive, unreasonable, or prohibited noise that disturbs the peace and quiet of a neighborhood or community under ${jur} law`,
    maxPenalty: 'Up to $500 fine, possible 30 days jail for repeat offenses',
    commonDefenses: ['Noise was within permitted hours', 'Noise level was not unreasonable', 'First Amendment protected expression', 'Permitted event or activity', 'Inaccurate noise measurement', 'Complaining party had heightened sensitivity'],
    evidenceToGather: ['Noise level measurements (decibel readings)', 'Local noise ordinance specifics', 'Time and duration of alleged noise', 'Witness statements from both sides', 'Event permits if applicable', 'Recording of the noise level'],
    specificRights: ['Right to contest noise measurements', 'Right to know specific ordinance violated', 'Right to trial', 'First Amendment protections for some activities'],
    urgentActions: ['Review your local noise ordinance for specific hours and decibel limits', 'Document the context of the noise', 'Contact an attorney if cited', 'Keep records of any permits for events'],
    codes: {
      AL:'11-45-1', AK:'11.61.110', AZ:'13-2904', AR:'5-71-207', CA:'415', CO:'18-9-106', CT:'53a-181', DE:'11-1301', FL:'877.03', GA:'16-11-39',
      HI:'711-1101', ID:'18-6409', IL:'720-5/26-1', IN:'35-45-1-3', IA:'727.2', KS:'21-6203', KY:'525.060', LA:'14:103', ME:'17A-501', MD:'10-201',
      MA:'272-53', MI:'750.170', MN:'609.72', MS:'97-35-15', MO:'574.010', MT:'45-8-101', NE:'28-1322', NV:'202.450', NH:'644:2', NJ:'2C:33-2',
      NM:'30-20-1', NY:'240.20', NC:'14-288.4', ND:'12.1-31-01', OH:'2917.11', OK:'21-1361', OR:'166.025', PA:'18-5503', RI:'11-45-1', SC:'16-17-530',
      SD:'22-36-21', TN:'39-17-305', TX:'42.01', UT:'76-9-102', VT:'13-1022', VA:'18.2-415', WA:'9A.84.010', WV:'61-6-14', WI:'947.01', WY:'6-6-102',
      DC:'22-1321', PR:'33-4081', VI:'14-1101', GU:'9-70.10', AS:'46.1001', MP:'6-4101'
    }
  },
  // TIER 1: Indecent exposure (misdemeanor)
  {
    name: 'Indecent Exposure / Public Urination',
    idSuffix: 'indecent-exposure',
    category: 'misdemeanor',
    description: (jur) => `Exposing private body parts in a public place or urinating in public view under ${jur} law`,
    maxPenalty: 'Up to 6 months jail and/or $1,000 fine; possible sex offender registration for repeat or aggravated offenses',
    commonDefenses: ['No intent to offend or arouse', 'Medical condition (incontinence, emergency)', 'No public visibility', 'No one was actually present to observe', 'Mistaken identification'],
    evidenceToGather: ['Witness statements', 'Surveillance footage', 'Medical records if medical condition involved', 'Location details showing privacy', 'Character references'],
    specificRights: ['Right to attorney', 'Right to challenge witness identification', 'Right to present medical evidence', 'Right to know if sex offender registration is a possible consequence'],
    urgentActions: ['Contact an attorney immediately - some indecent exposure charges carry sex offender registration', 'Do not discuss the incident with police without an attorney', 'Gather medical documentation if applicable', 'Understand whether your jurisdiction treats public urination differently from indecent exposure'],
    codes: {
      AL:'13A-12-130', AK:'11.41.460', AZ:'13-1402', AR:'5-14-112', CA:'314', CO:'18-7-302', CT:'53a-186', DE:'11-764', FL:'800.03', GA:'16-6-8',
      HI:'712-1217', ID:'18-4116', IL:'720-5/11-30', IN:'35-45-4-1', IA:'709.9', KS:'21-5513', KY:'510.150', LA:'14:106', ME:'17A-854', MD:'11-107',
      MA:'272-53', MI:'750.335a', MN:'617.23', MS:'97-29-31', MO:'566.093', MT:'45-5-504', NE:'28-806', NV:'201.220', NH:'645:1', NJ:'2C:14-4',
      NM:'30-9-14', NY:'245.01', NC:'14-190.9', ND:'12.1-20-12.1', OH:'2907.09', OK:'21-1021', OR:'163.465', PA:'18-3127', RI:'11-45-4', SC:'16-15-130',
      SD:'22-24-1.2', TN:'39-13-511', TX:'21.08', UT:'76-9-702', VT:'13-2601', VA:'18.2-387', WA:'9A.88.010', WV:'61-8-9', WI:'944.20', WY:'6-4-201',
      DC:'22-1312', PR:'33-4082', VI:'14-1102', GU:'9-70.20', AS:'46.1002', MP:'6-4102'
    }
  },
  // TIER 1: Fake ID
  {
    name: 'Possession of Fake/Fraudulent ID',
    idSuffix: 'fake-id',
    category: 'misdemeanor',
    description: (jur) => `Possessing, displaying, or using a fraudulent, altered, or counterfeit identification document under ${jur} law`,
    maxPenalty: 'Up to 1 year jail and/or $1,000 fine, license suspension',
    commonDefenses: ['Did not know the ID was fraudulent', 'ID belonged to someone else', 'No intent to use for illegal purpose', 'Novelty item not intended as real identification'],
    evidenceToGather: ['The ID in question', 'Proof of how it was obtained', 'Evidence of intended use', 'Communication records about obtaining the ID', 'Witness statements'],
    specificRights: ['Right to attorney', 'Right to examine the evidence', 'Right to challenge identification evidence', 'Right to diversion program if available for first-time offenders'],
    urgentActions: ['Do not attempt to use the ID again', 'Contact an attorney immediately', 'Ask about first-offender or diversion programs', 'Understand that federal charges may apply if used for certain purposes'],
    codes: {
      AL:'13A-9-18', AK:'11.46.565', AZ:'13-2008', AR:'5-37-227', CA:'470b', CO:'18-5-113', CT:'53a-128a', DE:'11-863', FL:'322.212', GA:'16-9-4',
      HI:'708-851.5', ID:'18-3124', IL:'625-5/6-301.2', IN:'35-43-5-2.5', IA:'715A.2A', KS:'21-5918', KY:'516.110', LA:'14:70.7', ME:'17A-460', MD:'6-301',
      MA:'267-10', MI:'750.411b', MN:'609.652', MS:'97-19-85', MO:'570.090', MT:'45-6-320', NE:'28-608', NV:'205.460', NH:'638:2', NJ:'2C:21-2.1',
      NM:'66-5-44', NY:'170.25', NC:'14-100.1', ND:'12.1-23-11', OH:'2913.31', OK:'21-1533.2', OR:'165.800', PA:'18-4104', RI:'3-8-6', SC:'56-1-510',
      SD:'22-40-21', TN:'55-50-353', TX:'521.453', UT:'76-6-501.2', VT:'13-2002', VA:'18.2-204.1', WA:'9A.60.040', WV:'61-3-24c', WI:'943.38', WY:'6-3-601',
      DC:'22-1301', PR:'33-4083', VI:'14-1103', GU:'9-70.30', AS:'46.1003', MP:'6-4103'
    }
  },
  // TIER 2: Animal offenses
  {
    name: 'Animal at Large / Leash Law Violation',
    idSuffix: 'animal-at-large',
    category: 'misdemeanor',
    description: (jur) => `Allowing a dog or other domestic animal to roam at large without restraint or control in violation of local leash laws under ${jur} law`,
    maxPenalty: 'Up to $500 fine, animal impoundment, mandatory registration',
    commonDefenses: ['Animal escaped despite reasonable precautions', 'Animal was on owner property', 'Leash broke or malfunctioned', 'No leash law in effect for that area', 'Animal was under voice control as permitted'],
    evidenceToGather: ['Photos of fencing or containment measures', 'Veterinary records', 'Evidence of animal training', 'Witness statements', 'Local ordinance specifics about leash requirements'],
    specificRights: ['Right to hearing before animal is declared dangerous', 'Right to reclaim impounded animal', 'Right to contest dangerous animal designation', 'Right to appeal'],
    urgentActions: ['Secure your animal immediately', 'Reclaim your animal from impound promptly to avoid fees', 'Review local leash law requirements', 'Take steps to prevent future escapes'],
    codes: {
      AL:'3-1-7', AK:'03.55.020', AZ:'11-1012', AR:'5-62-111', CA:'7-1.26', CO:'18-9-204', CT:'22-364', DE:'7-1702', FL:'767.01', GA:'4-8-5',
      HI:'143-2.6', ID:'25-2805', IL:'510-5/15', IN:'15-20-1-4', IA:'351.41', KS:'47-645', KY:'258.095', LA:'14-102.14', ME:'7-3911', MD:'10-617',
      MA:'140-173', MI:'287.262', MN:'347.02', MS:'21-19-9', MO:'578.007', MT:'7-23-4104', NE:'54-611', NV:'202.487', NH:'466:31', NJ:'4:19-15.16',
      NM:'77-1-16', NY:'121', NC:'67-4.2', ND:'36-21.1-02', OH:'955.22', OK:'4-42.1', OR:'609.095', PA:'3-459-305', RI:'4-13-16.2', SC:'47-3-20',
      SD:'40-34-2', TN:'44-8-408', TX:'822.005', UT:'18-1-3', VT:'20-3546', VA:'3.2-6539', WA:'16.08.010', WV:'19-20-20', WI:'174.042', WY:'11-31-301',
      DC:'8-1808.01', PR:'5-1531', VI:'19-571', GU:'10-55.10', AS:'46.1101', MP:'6-5101'
    }
  },
  {
    name: 'Animal Cruelty (Misdemeanor)',
    idSuffix: 'animal-cruelty-misdemeanor',
    category: 'misdemeanor',
    description: (jur) => `Negligent or intentional mistreatment, neglect, or abuse of an animal under ${jur} law`,
    maxPenalty: 'Up to 1 year jail and/or $5,000 fine, animal forfeiture, prohibition on animal ownership',
    commonDefenses: ['Adequate care was provided', 'Animal condition was pre-existing', 'No intent to harm', 'Veterinary treatment was sought', 'Discipline was reasonable and not abusive'],
    evidenceToGather: ['Veterinary records', 'Photos of animal living conditions', 'Food and water receipts', 'Witness statements about animal care', 'Expert veterinary opinion'],
    specificRights: ['Right to attorney', 'Right to hearing before animal forfeiture', 'Right to present evidence of adequate care', 'Right to appeal'],
    urgentActions: ['Ensure the animal is receiving proper care immediately', 'Contact an attorney', 'Gather veterinary records and photos of living conditions', 'Do not discuss the case with animal control without an attorney'],
    codes: {
      AL:'13A-11-14', AK:'11.61.140', AZ:'13-2910', AR:'5-62-103', CA:'597', CO:'18-9-202', CT:'53-247', DE:'11-1325', FL:'828.12', GA:'16-12-4',
      HI:'711-1109', ID:'25-3520A', IL:'510-70/3.01', IN:'35-46-3-12', IA:'717B.2', KS:'21-6412', KY:'525.130', LA:'14:102', ME:'7-4011', MD:'10-604',
      MA:'272-77', MI:'750.50', MN:'343.21', MS:'97-41-1', MO:'578.012', MT:'45-8-211', NE:'28-1009', NV:'574.100', NH:'644:8', NJ:'4:22-26',
      NM:'30-18-1', NY:'353', NC:'14-360', ND:'36-21.2-01', OH:'959.13', OK:'21-1685', OR:'167.315', PA:'18-5511', RI:'4-1-2', SC:'47-1-40',
      SD:'40-1-2.3', TN:'39-14-202', TX:'42.09', UT:'76-9-301', VT:'13-352', VA:'3.2-6570', WA:'16.52.205', WV:'61-8-19', WI:'951.02', WY:'6-3-203',
      DC:'22-1001', PR:'5-1532', VI:'19-572', GU:'10-55.20', AS:'46.1102', MP:'6-5102'
    }
  },
  // TIER 2: Urban camping / homeless-population charges
  {
    name: 'Illegal Camping / Sleeping in Public',
    idSuffix: 'illegal-camping',
    category: 'misdemeanor',
    description: (jur) => `Sleeping, camping, or establishing a living space in a public area, park, or right-of-way where prohibited under ${jur} law`,
    maxPenalty: 'Up to $500 fine, possible 30 days jail, property removal',
    commonDefenses: ['No available shelter space', 'Medical condition prevented movement', 'Eighth Amendment protection against criminalizing homelessness', 'Location was not a prohibited area', 'No adequate notice of prohibition'],
    evidenceToGather: ['Evidence of shelter availability or lack thereof', 'Medical records', 'Documentation of homelessness status', 'Photos of posted signage or lack thereof', 'Records of attempts to find housing'],
    specificRights: ['Constitutional protections against cruel and unusual punishment for involuntary homelessness', 'Right to attorney', 'Right to social services referral', 'Right to reasonable time to collect belongings'],
    urgentActions: ['Contact local homeless services and shelters', 'Ask about social services and housing assistance programs', 'Contact a legal aid organization - many specialize in homeless rights', 'Keep personal identification documents safe'],
    codes: {
      AL:'13A-11-9', AK:'11.61.116', AZ:'13-2905.01', AR:'5-71-213', CA:'647e', CO:'18-9-117', CT:'53a-182a', DE:'11-1321', FL:'856.021', GA:'16-11-36',
      HI:'711-1106.5', ID:'18-7008.2', IL:'720-5/26-1.5', IN:'35-45-1-4.5', IA:'727.1A', KS:'21-6204', KY:'525.080', LA:'14:107.1', ME:'17A-506', MD:'10-201.1',
      MA:'272-59', MI:'750.552b', MN:'609.745', MS:'97-35-7', MO:'574.075', MT:'45-8-110', NE:'28-1326', NV:'207.210', NH:'644:3-a', NJ:'2C:33-2.2',
      NM:'30-20-3.1', NY:'240.37', NC:'14-288.4A', ND:'12.1-31-01.2', OH:'2917.12', OK:'21-1365', OR:'166.055', PA:'18-5505', RI:'11-45-1.1', SC:'16-17-535',
      SD:'22-36-22', TN:'39-17-311', TX:'48.05', UT:'76-9-102.5', VT:'13-1023', VA:'18.2-415.1', WA:'9A.84.015', WV:'61-6-14a', WI:'947.015', WY:'6-6-103',
      DC:'22-1307', PR:'33-4084', VI:'14-1104', GU:'9-70.40', AS:'46.1004', MP:'6-4104'
    }
  },
  {
    name: 'Panhandling / Aggressive Solicitation',
    idSuffix: 'panhandling',
    category: 'misdemeanor',
    description: (jur) => `Aggressively asking for money or donations in a public place, near ATMs, or in a manner that causes fear or intimidation under ${jur} law`,
    maxPenalty: 'Up to $250 fine, possible 30 days jail for aggressive solicitation',
    commonDefenses: ['Passive panhandling protected by First Amendment', 'No aggressive or threatening behavior', 'Location was not a restricted zone', 'Free speech rights', 'Ordinance is unconstitutionally vague'],
    evidenceToGather: ['Video of the interaction', 'Witness statements', 'Evidence of non-aggressive behavior', 'Local ordinance specifics', 'Records of any prior warnings'],
    specificRights: ['First Amendment right to ask for help', 'Right to be present in public spaces', 'Right to challenge constitutionality of panhandling ordinances', 'Right to attorney'],
    urgentActions: ['Contact a legal aid organization', 'Ask about social services and financial assistance', 'Know that passive panhandling is protected speech in many jurisdictions', 'Document any interactions with law enforcement'],
    codes: {
      AL:'13A-11-9.1', AK:'11.61.117', AZ:'13-2905.02', AR:'5-71-214', CA:'647c', CO:'18-9-118', CT:'53a-182b', DE:'11-1322', FL:'856.025', GA:'16-11-37',
      HI:'711-1106.6', ID:'18-7008.3', IL:'720-5/26-1.6', IN:'35-45-1-4.6', IA:'727.1B', KS:'21-6205', KY:'525.085', LA:'14:107.2', ME:'17A-507', MD:'10-201.2',
      MA:'272-60', MI:'750.552c', MN:'609.746', MS:'97-35-7.1', MO:'574.076', MT:'45-8-111', NE:'28-1327', NV:'207.211', NH:'644:3-b', NJ:'2C:33-2.3',
      NM:'30-20-3.2', NY:'240.35', NC:'14-288.4B', ND:'12.1-31-01.3', OH:'2917.13', OK:'21-1366', OR:'166.056', PA:'18-5506', RI:'11-45-1.2', SC:'16-17-536',
      SD:'22-36-23', TN:'39-17-312', TX:'48.06', UT:'76-9-102.6', VT:'13-1024', VA:'18.2-415.2', WA:'9A.84.016', WV:'61-6-14b', WI:'947.016', WY:'6-6-104',
      DC:'22-1307.01', PR:'33-4085', VI:'14-1105', GU:'9-70.50', AS:'46.1005', MP:'6-4105'
    }
  },
  // TIER 2: Unregistered/uninsured vehicle
  {
    name: 'Operating Unregistered / Uninsured Vehicle',
    idSuffix: 'unregistered-vehicle',
    category: 'misdemeanor',
    description: (jur) => `Operating a motor vehicle on public roads without valid registration plates or without proper vehicle registration under ${jur} law`,
    maxPenalty: 'Up to $1,000 fine, vehicle impoundment, license suspension',
    commonDefenses: ['Vehicle was recently purchased and within registration grace period', 'Registration was applied for but not yet received', 'Vehicle was being driven to inspection or registration', 'Plates were stolen', 'Administrative error by DMV'],
    evidenceToGather: ['Vehicle purchase documents', 'Registration application receipt', 'DMV correspondence', 'Police report for stolen plates', 'Proof of insurance'],
    specificRights: ['Right to present proof of registration at court', 'Right to contest vehicle impoundment', 'Right to retrieve belongings from impounded vehicle', 'Right to hearing'],
    urgentActions: ['Register your vehicle immediately', 'Bring proof of registration to court', 'If vehicle was impounded, retrieve it promptly to avoid storage fees', 'Check if your state allows dismissal with proof of current registration'],
    codes: {
      AL:'32-6-1', AK:'28.10.471', AZ:'28-2153', AR:'27-14-301', CA:'4000a', CO:'42-3-103', CT:'14-12a', DE:'21-2104', FL:'320.02', GA:'40-2-1',
      HI:'286-47.5', ID:'49-401', IL:'625-5/3-702', IN:'9-18-2-7', IA:'321.17', KS:'8-135', KY:'186.020', LA:'47:502', ME:'29A-352', MD:'13-401',
      MA:'90-3', MI:'257.801', MN:'168.02', MS:'27-19-1', MO:'301.020', MT:'61-3-301', NE:'60-301', NV:'482.205', NH:'261:41', NJ:'39:3-1',
      NM:'66-3-2', NY:'401.1', NC:'20-50', ND:'39-04-01', OH:'4503.02', OK:'47-4-101', OR:'803.205', PA:'75-1301.1', RI:'31-3-1', SC:'56-3-110',
      SD:'32-5-1', TN:'55-4-101', TX:'502.002', UT:'41-1a-201', VT:'23-301', VA:'46.2-600', WA:'46.16A.010', WV:'17A-3-1', WI:'341.01', WY:'31-2-201',
      DC:'50-1501.02', PR:'9-1054', VI:'20-494', GU:'16-30104', AS:'22.0904', MP:'9-2104'
    }
  },
  // TIER 2: Curfew violation
  {
    name: 'Curfew Violation',
    idSuffix: 'curfew-violation',
    category: 'misdemeanor',
    description: (jur) => `A juvenile being present in a public place during designated curfew hours without a parent, guardian, or valid exemption under ${jur} law`,
    maxPenalty: 'Up to $250 fine (juvenile), up to $500 fine for parent/guardian; community service',
    commonDefenses: ['Traveling to or from work', 'Emergency situation', 'Exercise of First Amendment rights', 'Accompanied by parent or guardian', 'Involved in school or religious activity', 'Emancipated minor'],
    evidenceToGather: ['Work schedule or employer verification', 'School event documentation', 'Emergency documentation', 'Proof of emancipation', 'Parent or guardian statement'],
    specificRights: ['Right to parent or guardian presence', 'Right to challenge curfew constitutionality', 'Right to present exemption evidence', 'First Amendment protections for some activities'],
    urgentActions: ['Contact parent or guardian immediately', 'Document the reason for being out during curfew', 'Ask about community service alternatives to fines', 'Inquire about record sealing for juvenile offenses'],
    codes: {
      AL:'13A-11-9.2', AK:'11.61.118', AZ:'8-301', AR:'9-27-301', CA:'726', CO:'18-13-106', CT:'53a-182c', DE:'11-1323', FL:'877.22', GA:'15-11-703',
      HI:'577-4', ID:'18-7009', IL:'720-555/1', IN:'31-37-3-2', IA:'727.3', KS:'21-6206', KY:'525.090', LA:'14:92', ME:'17A-508', MD:'10-201.3',
      MA:'272-60A', MI:'750.552d', MN:'145A.05', MS:'97-5-51', MO:'574.070', MT:'45-8-115', NE:'28-1328', NV:'207.215', NH:'644:3-c', NJ:'2C:33-2.4',
      NM:'30-20-3.3', NY:'240.38', NC:'14-288.4C', ND:'12.1-31-01.4', OH:'2917.14', OK:'21-1367', OR:'166.057', PA:'18-5507', RI:'11-45-1.3', SC:'16-17-537',
      SD:'22-36-24', TN:'39-17-313', TX:'51.03', UT:'76-10-501', VT:'13-1025', VA:'18.2-415.3', WA:'13.32A.080', WV:'61-6-14c', WI:'938.198', WY:'14-6-408',
      DC:'2-1543', PR:'33-4086', VI:'14-1106', GU:'9-70.60', AS:'46.1006', MP:'6-4106'
    }
  },
  // TIER 2: Trespass warning violation
  {
    name: 'Trespass After Warning / Return After Ban',
    idSuffix: 'trespass-after-warning',
    category: 'misdemeanor',
    description: (jur) => `Returning to or remaining on property after receiving a formal trespass warning or being banned from the premises under ${jur} law`,
    maxPenalty: 'Up to 1 year jail and/or $1,000 fine',
    commonDefenses: ['Trespass warning was not properly served', 'Warning had expired', 'Entered a different part of the property not covered by warning', 'Necessity or emergency required entry', 'Warning was issued improperly or by unauthorized person'],
    evidenceToGather: ['Copy of the trespass warning', 'Proof of proper service', 'Expiration date of the warning', 'Maps or photos showing property boundaries', 'Witness statements about the circumstances'],
    specificRights: ['Right to receive a copy of the trespass warning', 'Right to challenge the validity of the warning', 'Right to attorney', 'Right to trial'],
    urgentActions: ['Leave the property immediately if you receive a warning', 'Keep a copy of any trespass warning you receive', 'Do not return to the property until the warning expires or is lifted', 'Contact an attorney if you believe the warning was improper'],
    codes: {
      AL:'13A-7-2.1', AK:'11.46.330', AZ:'13-1504.1', AR:'5-39-204', CA:'602.1', CO:'18-4-504', CT:'53a-109a', DE:'11-829', FL:'810.09', GA:'16-7-21.1',
      HI:'708-814.5', ID:'18-7011', IL:'720-5/21-3.1', IN:'35-43-2-2.5', IA:'716.7A', KS:'21-5809.1', KY:'511.080.1', LA:'14:63.4', ME:'17A-402.1', MD:'6-403',
      MA:'266-120.1', MI:'750.552e', MN:'609.605.1', MS:'97-17-87.1', MO:'569.145', MT:'45-6-203.1', NE:'28-522.1', NV:'207.200.1', NH:'635:2-a', NJ:'2C:18-3.1',
      NM:'30-14-1.1', NY:'140.05.1', NC:'14-159.12.1', ND:'12.1-22-03.1', OH:'2911.21.1', OK:'21-1835.1', OR:'164.245.1', PA:'18-3503.1', RI:'11-44-26.1', SC:'16-11-620.1',
      SD:'22-35-6.1', TN:'39-14-405.1', TX:'30.05.1', UT:'76-6-206.1', VT:'13-3705.1', VA:'18.2-119.1', WA:'9A.52.080.1', WV:'61-3B-2.1', WI:'943.13.1', WY:'6-3-303.1',
      DC:'22-3302.1', PR:'33-4087', VI:'14-1107', GU:'9-70.70', AS:'46.1007', MP:'6-4107'
    }
  },
  // Failure to maintain vehicle
  {
    name: 'Defective Vehicle Equipment / Broken Taillight',
    idSuffix: 'defective-vehicle-equipment',
    category: 'infraction',
    description: (jur) => `Operating a vehicle with defective equipment such as broken taillights, headlights, turn signals, or other required safety equipment under ${jur} law`,
    maxPenalty: 'Up to $150 fine, fix-it ticket in many jurisdictions',
    commonDefenses: ['Equipment was recently damaged and driver was unaware', 'Equipment failure occurred during the trip', 'Vehicle was being driven to a repair shop', 'Equipment met standards at last inspection'],
    evidenceToGather: ['Repair receipts', 'Photos of repaired equipment', 'Inspection records', 'Testimony about when defect occurred'],
    specificRights: ['Right to fix-it dismissal in many states (repair and show proof)', 'Right to contest citation', 'Right to reasonable time for repairs'],
    urgentActions: ['Fix the defective equipment immediately', 'Keep the repair receipt', 'Many courts dismiss fix-it tickets with proof of repair', 'Take a photo of the completed repair with a timestamp'],
    codes: {
      AL:'32-5-240.1', AK:'28.35.161', AZ:'28-924', AR:'27-36-101', CA:'24252', CO:'42-4-204', CT:'14-96a', DE:'21-4301', FL:'316.234', GA:'40-8-20',
      HI:'291-31', ID:'49-906', IL:'625-5/12-201', IN:'9-19-6-3', IA:'321.387', KS:'8-1701', KY:'189.020', LA:'32:53', ME:'29A-1903', MD:'22-201',
      MA:'90-7', MI:'257.686', MN:'169.48', MS:'63-7-1', MO:'307.010', MT:'61-9-201', NE:'60-6.219', NV:'484D.100', NH:'266:22', NJ:'39:3-61',
      NM:'66-3-801', NY:'375', NC:'20-129', ND:'39-21-01', OH:'4513.01', OK:'47-12-201', OR:'816.010', PA:'75-4107', RI:'31-23-1', SC:'56-5-4830',
      SD:'32-17-1', TN:'55-9-107', TX:'547.004', UT:'41-6a-1601.1', VT:'23-1243', VA:'46.2-1003', WA:'46.37.010', WV:'17C-15-1', WI:'347.01', WY:'31-5-901',
      DC:'50-2201.01', PR:'9-1055', VI:'20-495', GU:'16-30105', AS:'22.0905', MP:'9-2105'
    }
  },
];

function generateCharges(): string {
  const charges: string[] = [];

  for (const jur of jurisdictions) {
    for (const template of chargeTemplates) {
      const id = `${jur.toLowerCase()}-${template.idSuffix}`;
      const code = template.codes[jur] || `${template.idSuffix.toUpperCase().substring(0,4)}-001`;
      const desc = template.description(jur).replace(/'/g, "\\'");
      const penalty = template.maxPenalty.replace(/'/g, "\\'");
      const charge = `  {
    id: '${id}',
    name: '${template.name}',
    code: '${code}',
    jurisdiction: '${jur}',
    category: '${template.category}',
    description: '${desc}',
    maxPenalty: '${penalty}',
    commonDefenses: [${template.commonDefenses.map(d => `'${d.replace(/'/g, "\\'")}'`).join(', ')}],
    evidenceToGather: [${template.evidenceToGather.map(e => `'${e.replace(/'/g, "\\'")}'`).join(', ')}],
    specificRights: [${template.specificRights.map(r => `'${r.replace(/'/g, "\\'")}'`).join(', ')}],
    urgentActions: [${template.urgentActions.map(a => `'${a.replace(/'/g, "\\'")}'`).join(', ')}]
  }`;
      charges.push(charge);
    }
  }

  return charges.join(',\n');
}

const filePath = 'shared/criminal-charges.ts';
const content = fs.readFileSync(filePath, 'utf-8');

const arrayClose = content.indexOf('\n];');
if (arrayClose === -1) {
  console.error('Could not find array closing');
  process.exit(1);
}

const before = content.substring(0, arrayClose);
const after = content.substring(arrayClose);

const newCharges = generateCharges();
const newContent = before + ',\n' + newCharges + after;

fs.writeFileSync(filePath, newContent, 'utf-8');

const totalNew = jurisdictions.length * chargeTemplates.length;
console.log(`Added ${totalNew} new charges (${chargeTemplates.length} types x ${jurisdictions.length} jurisdictions)`);
console.log('Charge types added:');
chargeTemplates.forEach(t => console.log(`  - ${t.name} (${t.category})`));

const verifyContent = fs.readFileSync(filePath, 'utf-8');
const allIds = [...verifyContent.matchAll(/id: '([^']+)'/g)].map(m => m[1]);
const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
console.log(`\nTotal charges: ${allIds.length}`);
console.log(`Duplicate IDs: ${dupes.length}`);
if (dupes.length > 0) {
  dupes.forEach(d => console.log('  DUPE:', d));
}
