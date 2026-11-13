import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const rows = JSON.parse(readFileSync('shared/florida-restraint-publication.json', 'utf8'));
test('Florida restraint choices track their own current evidence', async ({request}) => {
  const fresh = JSON.parse(execFileSync(process.execPath, ['--import','tsx','--eval',
    "import {isFloridaRestraintSourceFresh} from './server/data/florida-restraint-source.ts'; console.log(JSON.stringify(isFloridaRestraintSourceFresh()));"
  ], {encoding:'utf8'}));
  const response = await request.get('/api/criminal-charges?jurisdiction=FL&limit=500');
  expect(response.ok()).toBe(true);
  const {charges} = await response.json();
  for (const {id, definition} of rows) {
    const selected = charges.find((charge: {id:string}) => charge.id === id);
    if (fresh) expect(selected).toMatchObject({id, name:definition.name, code:definition.code, category:'felony'});
    else expect(selected).toBeUndefined();
  }
});
