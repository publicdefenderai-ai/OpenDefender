import { generateStatuteCitation, getStatuteUrl } from '../shared/statute-citation-generator';

const CHECKS = [
  // New charge types across varied states
  { state: 'AL', code: '13A-11-8', name: 'Harassment' },
  { state: 'AL', code: '13A-6-132', name: 'Stalking' },
  { state: 'AL', code: '13A-11-10', name: 'Noise' },
  { state: 'AL', code: '13A-11-150', name: 'Fake ID' },
  { state: 'AL', code: '13A-11-1', name: 'Disorderly' },
  
  { state: 'AK', code: '11.61.120', name: 'Harassment' },
  { state: 'AK', code: '11.76.105', name: 'MIP' },
  { state: 'AK', code: '28.15.011', name: 'No Insurance' },
  { state: 'AK', code: '12.55.110', name: 'Probation Viol' },
  { state: 'AK', code: '11.46.330', name: 'Criminal Mischief' },

  { state: 'CO', code: '18-3-602', name: 'Stalking' },
  { state: 'CO', code: '42-4-1301', name: 'DUI' },
  { state: 'CO', code: '18-6-803.5', name: 'DV' },
  { state: 'CO', code: '18-4-501', name: 'Criminal Mischief' },
  { state: 'CO', code: '18-9-106', name: 'Disorderly' },

  { state: 'CT', code: '53a-181', name: 'Disorderly' },
  { state: 'CT', code: '14-215', name: 'Driving Suspended' },
  { state: 'CT', code: '53a-119', name: 'Larceny' },
  { state: 'CT', code: '53a-100', name: 'Burglary' },
  { state: 'CT', code: '53a-96', name: 'Fake ID' },
  
  { state: 'HI', code: '707-712', name: 'Assault 3rd' },
  { state: 'HI', code: '712-1249', name: 'Drug Para' },
  { state: 'HI', code: '291E-61', name: 'DUI' },
  { state: 'HI', code: '708-836', name: 'Trespass' },
  { state: 'HI', code: '711-1101', name: 'Disorderly' },

  { state: 'KS', code: '21-5413', name: 'Battery' },
  { state: 'KS', code: '21-6412', name: 'Bad Checks' },
  { state: 'KS', code: '21-5514', name: 'Fake ID' },
  { state: 'KS', code: '21-5812', name: 'Trespass' },
  { state: 'KS', code: '21-5705', name: 'Drug Possession' },

  { state: 'LA', code: '14:35', name: 'Battery' },
  { state: 'LA', code: '14:108', name: 'Resisting' },
  { state: 'LA', code: '14:67.26', name: 'Identity Theft' },
  { state: 'LA', code: '14:95.1', name: 'Felon w/Weapon' },
  { state: 'LA', code: '14:63', name: 'Trespass' },
  
  { state: 'MN', code: '609.2242', name: 'DV Assault' },
  { state: 'MN', code: '609.749', name: 'Stalking' },
  { state: 'MN', code: '609.72', name: 'Disorderly' },
  { state: 'MN', code: '609.535', name: 'Bad Checks' },
  { state: 'MN', code: '152.025', name: 'Drug 5th Degree' },

  { state: 'SC', code: '16-25-20', name: 'DV 3rd' },
  { state: 'SC', code: '56-5-2930', name: 'DUI' },
  { state: 'SC', code: '16-13-110', name: 'Shoplifting' },
  { state: 'SC', code: '16-11-600', name: 'Trespass' },
  { state: 'SC', code: '16-17-530', name: 'Disorderly' },

  { state: 'UT', code: '76-5-102', name: 'Assault' },
  { state: 'UT', code: '41-6a-502', name: 'DUI' },
  { state: 'UT', code: '76-6-206', name: 'Criminal Mischief' },
  { state: 'UT', code: '76-6-206', name: 'Trespass' },
  { state: 'UT', code: '76-8-305', name: 'Resisting' },
];

let validLinks = 0;
let emptyLinks = 0;

for (const check of CHECKS) {
  const citation = generateStatuteCitation(check.state, check.code);
  const url = getStatuteUrl(check.state, check.code);
  
  if (url && url.startsWith('http')) {
    validLinks++;
    console.log(`✓ ${check.state} ${check.name}: ${citation}`);
    console.log(`  → ${url}`);
  } else {
    emptyLinks++;
    console.log(`✗ ${check.state} ${check.name}: ${citation} → NO URL`);
  }
}

console.log(`\n========================================`);
console.log(`Results: ${validLinks}/${CHECKS.length} have valid URLs (${((validLinks/CHECKS.length)*100).toFixed(1)}%)`);
console.log(`Missing URLs: ${emptyLinks}`);
