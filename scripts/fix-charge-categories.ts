import * as fs from 'fs';

const content = fs.readFileSync('shared/criminal-charges.ts', 'utf-8');

const jurisdictions = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
  'DC','PR','VI','GU','AS','MP'
];

function idsFor(suffix: string): string[] {
  return jurisdictions.map(j => `'${j.toLowerCase()}-${suffix}'`);
}

const addToCategories: Record<string, string[]> = {
  'Public Order': [
    ...idsFor('failure-to-appear'),
    ...idsFor('probation-violation'),
    ...idsFor('contempt-of-court'),
    ...idsFor('open-container'),
    ...idsFor('minor-in-possession'),
    ...idsFor('false-info-to-police'),
    ...idsFor('resisting-arrest'),
    "'ne-minor-in-possession-alcohol'",
    "'tn-resisting-arrest-obstruction'",
    "'ca-contempt-of-court-misdemeanor'",
    "'il-disorderly-conduct-misdemeanor'",
    "'tx-public-intoxication-misdemeanor'",
    "'ca-trespassing-misdemeanor'",
    "'nv-open-container-violation'",
    "'ny-open-container-violation'",
  ],
  'Public Order Crimes': [
    ...idsFor('failure-to-appear'),
    ...idsFor('probation-violation'),
    ...idsFor('contempt-of-court'),
    ...idsFor('open-container'),
    ...idsFor('minor-in-possession'),
    ...idsFor('false-info-to-police'),
    ...idsFor('resisting-arrest'),
    "'ne-minor-in-possession-alcohol'",
    "'tn-resisting-arrest-obstruction'",
    "'ca-contempt-of-court-misdemeanor'",
    "'il-disorderly-conduct-misdemeanor'",
    "'tx-public-intoxication-misdemeanor'",
    "'ca-trespassing-misdemeanor'",
    "'nv-open-container-violation'",
    "'ny-open-container-violation'",
  ],
  'Violent Crimes': [
    ...idsFor('harassment'),
    ...idsFor('protective-order-violation'),
    "'nj-harassment-stalking'",
    "'ny-harassment-stalking'",
    "'pa-harassment-stalking'",
    "'or-harassment-stalking'",
  ],
  'Assault Crimes': [
    ...idsFor('harassment'),
    "'nj-harassment-stalking'",
    "'ny-harassment-stalking'",
    "'pa-harassment-stalking'",
    "'or-harassment-stalking'",
  ],
  'DUI & Traffic': [
    ...idsFor('driving-without-insurance'),
  ],
  'DUI/Traffic Crimes': [
    ...idsFor('driving-without-insurance'),
  ],
  'Fraud': [
    ...idsFor('bad-checks'),
  ],
  'Fraud Crimes': [
    ...idsFor('bad-checks'),
  ],
  'Theft & Property': [
    ...idsFor('bad-checks'),
    "'ca-petty-theft-misdemeanor'",
  ],
  'Theft Crimes': [
    ...idsFor('bad-checks'),
    "'ca-petty-theft-misdemeanor'",
  ],
  'Drug Offenses': [
    "'ca-drug-paraphernalia-misdemeanor'",
  ],
  'Drug Crimes': [
    "'ca-drug-paraphernalia-misdemeanor'",
  ],
};

const catSectionStart = content.indexOf("export const chargeCategories");
const catSectionEnd = content.indexOf("};", catSectionStart) + 2;
let catSection = content.substring(catSectionStart, catSectionEnd);

for (const [category, newIds] of Object.entries(addToCategories)) {
  const escapedCat = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const catKeyPattern = new RegExp(`'${escapedCat}':\\s*\\[([^\\]]+)\\]`);
  const match = catSection.match(catKeyPattern);
  if (match) {
    const existingIds = match[1].trim();
    const toAdd = newIds.filter(id => !existingIds.includes(id));
    if (toAdd.length > 0) {
      const replacement = `'${category}': [${existingIds}, ${toAdd.join(', ')}]`;
      catSection = catSection.replace(match[0], replacement);
      console.log(`Added ${toAdd.length} charges to '${category}'`);
    } else {
      console.log(`No new charges needed for '${category}'`);
    }
  } else {
    console.log(`WARNING: Category '${category}' not found!`);
  }
}

const otherIds = [
  ...idsFor('solicitation'),
];

const otherCategory = `\n  'Other': [${otherIds.join(', ')}]`;
catSection = catSection.replace(/\n\};/, `,${otherCategory}\n};`);
console.log(`Created 'Other' category with ${otherIds.length} charges`);

const newContent = content.substring(0, catSectionStart) + catSection + content.substring(catSectionEnd);
fs.writeFileSync('shared/criminal-charges.ts', newContent, 'utf-8');

const verifyContent = fs.readFileSync('shared/criminal-charges.ts', 'utf-8');
const allIds = [...verifyContent.matchAll(/id: '([^']+)'/g)].map(m => m[1]);
const verifyCatSection = verifyContent.substring(verifyContent.indexOf('export const chargeCategories'));
const categorizedIds = new Set([...verifyCatSection.matchAll(/'([a-z]{2,3}-[^']+)'/g)].map(m => m[1]));
const uncategorized = allIds.filter(id => !categorizedIds.has(id));
console.log(`\nVerification: ${allIds.length} total charges, ${categorizedIds.size} categorized, ${uncategorized.length} uncategorized`);
if (uncategorized.length > 0) {
  console.log('Still uncategorized:');
  uncategorized.forEach(id => console.log('  ', id));
}
