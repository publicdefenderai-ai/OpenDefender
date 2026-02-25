import * as fs from 'fs';
import { verifiedStatuteCodes } from './verified-statute-codes';

const filePath = 'shared/criminal-charges.ts';
let content = fs.readFileSync(filePath, 'utf-8');
let totalFixed = 0;
let totalChecked = 0;
let totalAlreadyCorrect = 0;

for (const [chargeSuffix, jurisdictionCodes] of Object.entries(verifiedStatuteCodes)) {
  for (const [jur, verified] of Object.entries(jurisdictionCodes)) {
    const chargeId = `${jur.toLowerCase()}-${chargeSuffix}`;
    totalChecked++;

    const idPattern = new RegExp(
      `(id: '${chargeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?code: ')([^']*?)(')`
    );
    
    const match = content.match(idPattern);
    if (!match) {
      continue;
    }

    const currentCode = match[2];
    if (currentCode === verified.code) {
      totalAlreadyCorrect++;
      continue;
    }

    content = content.replace(idPattern, `$1${verified.code}$3`);
    totalFixed++;
  }
}

fs.writeFileSync(filePath, content, 'utf-8');

console.log(`Checked: ${totalChecked}`);
console.log(`Already correct: ${totalAlreadyCorrect}`);
console.log(`Fixed: ${totalFixed}`);
console.log(`Not found: ${totalChecked - totalAlreadyCorrect - totalFixed}`);
