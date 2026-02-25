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
  group: string;
}

const chargeTemplates: ChargeTemplate[] = [
  {
    name: 'Truancy / Chronic Absenteeism',
    idSuffix: 'truancy',
    category: 'misdemeanor',
    group: 'Public Order',
    description: (jur) => `A minor failing to attend school as required by compulsory education laws, or a parent/guardian failing to ensure school attendance under ${jur} law`,
    maxPenalty: 'Up to $500 fine for parents, community service, possible CHINS/PINS petition for juvenile, truancy court supervision',
    commonDefenses: ['Excused absences with medical documentation', 'Bullying or unsafe school environment', 'Homeschool arrangement in compliance with state law', 'School failed to provide required accommodations (IEP/504)', 'Family emergency or hardship', 'Student reached legal dropout age'],
    evidenceToGather: ['School attendance records', 'Medical excuses and documentation', 'Communication with school officials', 'IEP or 504 plan documents', 'Evidence of bullying or safety concerns', 'Homeschool registration if applicable'],
    specificRights: ['Right to educational accommodations under IDEA and Section 504', 'Right to parent/guardian presence at hearings', 'Right to challenge attendance records', 'Right to appeal truancy determination', 'Right to due process before penalties'],
    urgentActions: ['Return to school immediately or establish compliant alternative education', 'Document all medical or family reasons for absences', 'Request a meeting with school counselor or truancy officer', 'Ask about truancy diversion or intervention programs', 'Consult a juvenile defense attorney if court-involved'],
    codes: {
      AL:'16-28-12', AK:'14.30.010', AZ:'15-803', AR:'6-18-201', CA:'48260', CO:'22-33-107', CT:'10-198a', DE:'14-2702', FL:'984.151', GA:'20-2-690.1',
      HI:'302A-1132', ID:'33-206', IL:'105-26/2-1', IN:'20-33-2-28', IA:'299.6', KS:'72-3120', KY:'159.010', LA:'17:221', ME:'20-A-5001-A', MD:'7-301',
      MA:'76-2', MI:'380.1561', MN:'120A.26', MS:'37-13-91', MO:'167.031', MT:'20-5-106', NE:'79-201', NV:'392.040', NH:'193-1', NJ:'18A:38-25',
      NM:'22-12-7', NY:'3212', NC:'115C-378', ND:'15.1-20-01', OH:'3321.38', OK:'70-10-105', OR:'339.010', PA:'24-13-1327', RI:'16-19-1', SC:'59-65-10',
      SD:'13-27-1', TN:'49-6-3007', TX:'25.085', UT:'53G-6-202', VT:'16-1121', VA:'22.1-254', WA:'28A.225.010', WV:'18-8-4', WI:'118.15', WY:'21-4-102',
      DC:'38-202', PR:'18-1101', VI:'17-81', GU:'17-3101', AS:'16.0201', MP:'3-1101'
    }
  },
  {
    name: 'Littering / Illegal Dumping',
    idSuffix: 'littering',
    category: 'misdemeanor',
    group: 'Public Order',
    description: (jur) => `Disposing of trash, waste, or debris on public or private property without authorization, or illegally dumping materials in prohibited areas under ${jur} law`,
    maxPenalty: 'Up to $1,000 fine for littering, up to $25,000 and 1 year jail for illegal dumping; community service cleanup',
    commonDefenses: ['Waste was disposed of at an authorized location', 'Item fell from vehicle unintentionally', 'Mistaken identity of the person who littered', 'Property owner gave permission', 'Wind or weather moved the material'],
    evidenceToGather: ['Photos of the alleged littering location', 'Surveillance camera footage', 'Witness statements', 'Receipts from authorized disposal facilities', 'Evidence of wind or weather conditions'],
    specificRights: ['Right to contest citation', 'Right to community service alternative', 'Right to present evidence of proper disposal', 'Right to trial'],
    urgentActions: ['Clean up the material if possible', 'Document the location and circumstances', 'Check if community service is available instead of fines', 'Contact local waste management for proper disposal options'],
    codes: {
      AL:'13A-7-29', AK:'46.06.080', AZ:'13-1603', AR:'5-60-116', CA:'374.4', CO:'18-4-511', CT:'22a-250', DE:'7-6004', FL:'403.413', GA:'16-7-43',
      HI:'339-4', ID:'18-7026', IL:'415-105/4', IN:'35-45-3-2', IA:'321.369', KS:'65-3409', KY:'512.070', LA:'30:2531', ME:'17-2264-A', MD:'10-110',
      MA:'270-16', MI:'324.8905a', MN:'609.68', MS:'97-15-29', MO:'577.070', MT:'75-10-212', NE:'28-1321', NV:'444.555', NH:'163-B:1', NJ:'13:1E-99.3',
      NM:'30-8-4', NY:'71-2505', NC:'14-399', ND:'36-01-27', OH:'3767.32', OK:'21-1752', OR:'164.785', PA:'18-6501', RI:'11-20-6', SC:'16-11-700',
      SD:'34A-7-3', TN:'39-14-502', TX:'365.012', UT:'76-6-108', VT:'24-2201', VA:'33.2-802', WA:'70.93.060', WV:'22-15A-4', WI:'287.81', WY:'35-11-1607',
      DC:'8-902', PR:'12-1301', VI:'19-901', GU:'10-71.10', AS:'24.0601', MP:'3-1102'
    }
  },
  {
    name: 'Illegal Discharge of Fireworks',
    idSuffix: 'illegal-fireworks',
    category: 'misdemeanor',
    group: 'Public Order',
    description: (jur) => `Possessing, selling, or discharging fireworks in violation of local or state fireworks regulations under ${jur} law`,
    maxPenalty: 'Up to $1,000 fine and/or 90 days jail; higher penalties if injury or property damage results',
    commonDefenses: ['Fireworks were legal consumer-grade in the jurisdiction', 'Discharge occurred in a permitted area/time', 'Had a valid fireworks permit', 'Did not personally discharge the fireworks', 'Fireworks were purchased legally in another state'],
    evidenceToGather: ['Local fireworks ordinance specifics', 'Permit or license if applicable', 'Photos of the type of fireworks', 'Witness statements', 'Evidence of permitted fireworks events in the area'],
    specificRights: ['Right to contest citation', 'Right to present permit evidence', 'Right to know specific ordinance violated', 'Right to trial'],
    urgentActions: ['Stop using fireworks immediately', 'Check your local fireworks laws - they vary widely', 'If property damage or injury occurred, contact an attorney', 'Penalties increase significantly if someone was hurt'],
    codes: {
      AL:'8-17-216', AK:'18.72.020', AZ:'36-1601', AR:'20-22-702', CA:'12677', CO:'12-28-101', CT:'29-357', DE:'16-6901', FL:'791.01', GA:'25-10-2',
      HI:'132D-14', ID:'39-2601', IL:'425-35/2', IN:'22-11-14-1', IA:'727.2A', KS:'31-155', KY:'227.720', LA:'51:654', ME:'8-223', MD:'10-110.1',
      MA:'148-39', MI:'750.243c', MN:'624.22', MS:'45-13-9', MO:'319.016', MT:'50-37-103', NE:'28-1241', NV:'477.120', NH:'160-B:4', NJ:'21:3-2',
      NM:'60-14C-4', NY:'405', NC:'14-410', ND:'23-15-04', OH:'3743.65', OK:'68-1623', OR:'480.120', PA:'35-1271', RI:'23-28.12-7', SC:'23-35-45',
      SD:'34-37-4', TN:'68-104-113', TX:'352.020', UT:'53-7-220', VT:'20-3172', VA:'27-97', WA:'70.77.395', WV:'29-3-23', WI:'167.10', WY:'35-10-203',
      DC:'22-3101', PR:'25-1401', VI:'23-101', GU:'10-71.20', AS:'24.0602', MP:'3-1103'
    }
  },
  {
    name: 'Possession of Alcohol in Park / Prohibited Area',
    idSuffix: 'alcohol-in-park',
    category: 'misdemeanor',
    group: 'Public Order',
    description: (jur) => `Possessing or consuming alcoholic beverages in a public park, beach, playground, or other designated alcohol-free zone under ${jur} law`,
    maxPenalty: 'Up to $250 fine, confiscation of alcohol; repeat offenses may carry higher fines',
    commonDefenses: ['Area was not clearly posted as alcohol-free', 'Event had a special alcohol permit', 'Beverage was non-alcoholic', 'Container was sealed and unopened', 'Private event on permitted park grounds'],
    evidenceToGather: ['Photos of posted signage or lack thereof', 'Event permit if applicable', 'Witness statements', 'Evidence of the beverage contents', 'Park rules and regulations'],
    specificRights: ['Right to contest citation', 'Right to know specific ordinance violated', 'Right to present evidence of permit', 'Right to trial'],
    urgentActions: ['Leave the prohibited area with the alcohol', 'Check posted park rules', 'Ask about fine reduction for community service', 'Many jurisdictions offer dismissal for first-time offenders'],
    codes: {
      AL:'28-3A-25', AK:'04.16.050', AZ:'4-244', AR:'5-71-212', CA:'25620', CO:'18-13-122', CT:'30-89a', DE:'4-901', FL:'562.12', GA:'3-3-40',
      HI:'281-78', ID:'23-615', IL:'235-5/5-12', IN:'7.1-5-7-7', IA:'123.46A', KS:'21-5814', KY:'244.020', LA:'26:90', ME:'28A-2073', MD:'6-310',
      MA:'138-34', MI:'436.1915', MN:'340A.503', MS:'67-1-81', MO:'311.480', MT:'16-6-102', NE:'53-186', NV:'244.3581', NH:'179-44', NJ:'2C:33-15',
      NM:'60-6A-17', NY:'19', NC:'18B-300', ND:'5-01-08.1', OH:'4301.62', OK:'37-537', OR:'471.410', PA:'18-6308', RI:'3-8-6.1', SC:'61-4-110',
      SD:'35-4-81', TN:'39-17-310', TX:'48.02', UT:'32B-4-409', VT:'7-656', VA:'4.1-308', WA:'66.44.100', WV:'60-6-9', WI:'125.09', WY:'12-6-101',
      DC:'25-1001', PR:'13-2501', VI:'14-1108', GU:'11-103.10', AS:'4.1401', MP:'4-1101'
    }
  },
  {
    name: 'Fishing / Hunting Without a License',
    idSuffix: 'hunting-fishing-no-license',
    category: 'misdemeanor',
    group: 'Public Order',
    description: (jur) => `Fishing, hunting, or trapping wildlife without the required state license, permit, or tag under ${jur} law`,
    maxPenalty: 'Up to $500 fine for fishing, up to $1,000+ fine for hunting without a license; equipment confiscation; license suspension',
    commonDefenses: ['Had a valid license but not in possession at the time', 'Was on private property with owner permission', 'Age exemption applied (many states exempt seniors and children)', 'License had been applied for but not yet received', 'Activity did not require a license (e.g., catch and release in some states)'],
    evidenceToGather: ['Valid license purchased before the citation', 'Proof of license application', 'Property owner permission documentation', 'Age verification for exemptions', 'State-specific exemption documentation'],
    specificRights: ['Right to present valid license at court for possible dismissal', 'Right to contest citation', 'Right to know specific regulation violated', 'Right to appeal license suspension'],
    urgentActions: ['Purchase the required license immediately', 'Bring proof of license to court - many jurisdictions dismiss with proof of purchase', 'Check if you qualify for any exemptions', 'Understand that hunting violations often carry stiffer penalties than fishing violations'],
    codes: {
      AL:'9-11-53', AK:'16.05.330', AZ:'17-309', AR:'15-41-104', CA:'7145', CO:'33-6-107', CT:'26-27', DE:'7-503', FL:'379.354', GA:'27-2-2',
      HI:'188-70', ID:'36-409', IL:'520-5/2.1', IN:'14-22-11-1', IA:'481A.38', KS:'32-1032', KY:'150.990', LA:'56-30.1', ME:'12-10902', MD:'4-604',
      MA:'131-11', MI:'324.43553', MN:'97A.301', MS:'49-7-31', MO:'252.040', MT:'87-6-202', NE:'37-201', NV:'502.010', NH:'214:18', NJ:'23:3-1',
      NM:'17-2-10', NY:'71-0925', NC:'113-270.1B', ND:'20.1-03-12', OH:'1533.08', OK:'29-4-107', OR:'497.002', PA:'30-2702', RI:'20-2-5', SC:'50-9-10',
      SD:'41-6-4', TN:'70-2-101', TX:'66.006', UT:'23A-3-1', VT:'10-4082', VA:'29.1-335', WA:'77.15.400', WV:'20-2-3', WI:'29.024', WY:'23-6-202',
      DC:'22-4328', PR:'12-1302', VI:'12-201', GU:'63-40.10', AS:'24.0701', MP:'3-1104'
    }
  },
];

function generateCharges(): string {
  const charges: string[] = [];

  for (const jur of jurisdictions) {
    for (const template of chargeTemplates) {
      const id = `${jur.toLowerCase()}-${template.idSuffix}`;
      const code = template.codes[jur] || '';
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
chargeTemplates.forEach(t => console.log(`  - ${t.name} (${t.category}) -> ${t.group}`));

// Now update chargeCategories to include new charges in their groups
let updatedContent = fs.readFileSync(filePath, 'utf-8');

for (const template of chargeTemplates) {
  const groupKey = `'${template.group}':`;
  const idx = updatedContent.indexOf(groupKey);
  if (idx === -1) {
    console.log(`WARNING: Group '${template.group}' not found for ${template.name}`);
    continue;
  }
  const arrEnd = updatedContent.indexOf(']', idx);
  const newIds = jurisdictions.map(j => `'${j.toLowerCase()}-${template.idSuffix}'`).join(', ');
  updatedContent = updatedContent.substring(0, arrEnd) + ', ' + newIds + updatedContent.substring(arrEnd);
}

fs.writeFileSync(filePath, updatedContent, 'utf-8');

// Verify
const verifyContent = fs.readFileSync(filePath, 'utf-8');
const allIds = [...verifyContent.matchAll(/id: '([^']+)'/g)].map(m => m[1]);
const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
console.log(`\nTotal charges: ${allIds.length}`);
console.log(`Charges per jurisdiction: ${allIds.length / 56}`);
console.log(`Duplicate IDs: ${dupes.length}`);
if (dupes.length > 0) {
  dupes.slice(0, 5).forEach(d => console.log('  DUPE:', d));
}
