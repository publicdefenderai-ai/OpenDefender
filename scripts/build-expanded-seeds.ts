import { criminalCharges } from '../shared/criminal-charges';
import { generateStatuteCitation, getStatuteUrl } from '../shared/statute-citation-generator';
import { db } from '../server/db';
import { statutes } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

const TERRITORIES = new Set(['PR', 'VI', 'GU', 'AS', 'MP']);

function getCategoryForCharge(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('assault') || n.includes('battery') || n.includes('domestic') || n.includes('menac')) return 'assault';
  if (n.includes('theft') || n.includes('shoplifting') || n.includes('larceny') || n.includes('steal') || n.includes('receiving')) return 'theft';
  if (n.includes('dui') || n.includes('dwi') || n.includes('driving') || n.includes('vehicle') || n.includes('registration') || n.includes('inspection') || n.includes('reckless') || n.includes('taillight')) return 'dui';
  if (n.includes('drug') || n.includes('marijuana') || n.includes('cannabis') || n.includes('controlled') || n.includes('paraphernalia') || n.includes('maintain')) return 'drug_offenses';
  if (n.includes('fraud') || n.includes('fake') || n.includes('forgery') || n.includes('check') || n.includes('embezzl') || n.includes('identity')) return 'fraud';
  if (n.includes('burglary')) return 'burglary';
  if (n.includes('robbery')) return 'robbery';
  if (n.includes('murder') || n.includes('homicide') || n.includes('manslaughter')) return 'homicide';
  if (n.includes('weapon') || n.includes('firearm') || n.includes('discharge')) return 'weapons';
  if (n.includes('sexual') || n.includes('rape') || n.includes('exploitation') || n.includes('child') && n.includes('abuse')) return 'sexual_assault';
  if (n.includes('trespass') || n.includes('vandalism') || n.includes('mischief') || n.includes('damage') || n.includes('arson')) return 'property';
  if (n.includes('stalk') || n.includes('harass')) return 'assault';
  return 'public_order';
}

async function main() {
  console.log('Building expanded statute seeds...\n');

  const existing = await db.query.statutes.findMany();
  const existingKeys = new Set<string>();
  existing.forEach(s => existingKeys.add(`${s.jurisdiction}:${s.section}`));
  console.log(`Existing statutes in DB: ${existing.length}`);

  const toInsert: Array<{
    title: string; citation: string; jurisdiction: string; level: string;
    chapter: string; section: string; content: string; summary: string;
    category: string; relatedCharges: string[]; penalties: string;
    url: string; sourceApi: string; isActive: boolean;
  }> = [];

  let skippedExisting = 0;
  let skippedTerritory = 0;
  let skippedNoCitation = 0;

  for (const charge of criminalCharges) {
    if (TERRITORIES.has(charge.jurisdiction)) {
      skippedTerritory++;
      continue;
    }

    const key = `${charge.jurisdiction}:${charge.code}`;
    if (existingKeys.has(key)) {
      skippedExisting++;
      continue;
    }

    const citation = generateStatuteCitation(charge.jurisdiction, charge.code);
    const url = getStatuteUrl(charge.jurisdiction, charge.code);

    if (!citation || citation === charge.code) {
      skippedNoCitation++;
      continue;
    }

    existingKeys.add(key);

    const chapter = charge.code.split(/[.-]/)[0] || charge.code;

    toInsert.push({
      title: charge.name,
      citation,
      jurisdiction: charge.jurisdiction,
      level: 'state',
      chapter,
      section: charge.code,
      content: charge.description,
      summary: charge.description.substring(0, 500),
      category: getCategoryForCharge(charge.name),
      relatedCharges: [charge.name],
      penalties: charge.maxPenalty,
      url: url || '',
      sourceApi: 'verified_codes',
      isActive: true,
    });
  }

  console.log(`Skipped (already in DB): ${skippedExisting}`);
  console.log(`Skipped (territories): ${skippedTerritory}`);
  console.log(`Skipped (no citation): ${skippedNoCitation}`);
  console.log(`Records to insert: ${toInsert.length}`);

  if (toInsert.length === 0) {
    console.log('Nothing to insert!');
    process.exit(0);
  }

  const batchSize = 50;
  let inserted = 0;
  let conflicts = 0;

  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    try {
      const result = await db.insert(statutes).values(batch).onConflictDoNothing();
      inserted += batch.length;
    } catch (err: any) {
      for (const record of batch) {
        try {
          await db.insert(statutes).values(record).onConflictDoNothing();
          inserted++;
        } catch (e) {
          conflicts++;
        }
      }
    }
    const progress = Math.min(i + batchSize, toInsert.length);
    process.stdout.write(`\r  Inserted: ${inserted}/${toInsert.length} (${((progress/toInsert.length)*100).toFixed(0)}%)`);
  }

  console.log(`\n\nDone! Inserted ${inserted} new statute records (${conflicts} conflicts)`);

  const finalCount = await db.query.statutes.findMany();
  console.log(`Total statutes in DB now: ${finalCount.length}`);

  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
