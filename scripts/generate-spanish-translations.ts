import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const client = new Anthropic();

interface CriminalCharge {
  id: string;
  name: string;
  code: string;
  jurisdiction: string;
  category: 'felony' | 'misdemeanor' | 'infraction';
  description: string;
  maxPenalty: string;
  commonDefenses: string[];
  evidenceToGather: string[];
  specificRights: string[];
  urgentActions: string[];
  statuteCitations?: string[];
  nameEs?: string;
  descriptionEs?: string;
}

interface TranslationResult {
  nameEs: string;
  descriptionEs: string;
}

async function translateBatch(charges: CriminalCharge[]): Promise<TranslationResult[]> {
  const chargeTexts = charges.map((c, i) => `${i + 1}. Name: "${c.name}" | Description: "${c.description}"`).join('\n');
  
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `You are a legal translator specializing in US criminal law terminology. Translate the following criminal charge names and descriptions from English to Spanish. 

CRITICAL REQUIREMENTS:
1. Use official legal Spanish terminology used in US courts
2. Maintain the same formality and precision as the English text
3. Keep legal terms accurate - do not use colloquial translations
4. Return ONLY a JSON array with objects containing "nameEs" and "descriptionEs" for each charge
5. The array must have exactly ${charges.length} items in the same order as the input

Input charges:
${chargeTexts}

Return only the JSON array, no other text:`
    }]
  });
  
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }
  
  const jsonMatch = content.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('No JSON array found in response');
  }
  
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  // SECURITY: Use dynamic import instead of eval() to safely load the charges module
  // This avoids code execution vulnerabilities from parsing untrusted content
  const chargesModule = await import('../shared/criminal-charges.js');
  const charges: CriminalCharge[] = chargesModule.criminalCharges;

  if (!charges || !Array.isArray(charges)) {
    console.error('Could not load criminalCharges array from module');
    process.exit(1);
  }

  console.log(`Found ${charges.length} charges to translate`);
  
  const batchSize = 20;
  const translatedCharges: CriminalCharge[] = [];
  
  for (let i = 0; i < charges.length; i += batchSize) {
    const batch = charges.slice(i, i + batchSize);
    console.log(`Translating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(charges.length / batchSize)}...`);
    
    try {
      const translations = await translateBatch(batch);
      
      for (let j = 0; j < batch.length; j++) {
        translatedCharges.push({
          ...batch[j],
          nameEs: translations[j]?.nameEs || batch[j].name,
          descriptionEs: translations[j]?.descriptionEs || batch[j].description,
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error translating batch ${i / batchSize + 1}:`, error);
      batch.forEach(charge => translatedCharges.push(charge));
    }
    
    if ((i + batchSize) % 100 === 0) {
      console.log(`Progress: ${Math.min(i + batchSize, charges.length)}/${charges.length}`);
    }
  }
  
  const outputPath = path.join(__dirname, '../shared/criminal-charges-translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(translatedCharges, null, 2));
  console.log(`Saved ${translatedCharges.length} translated charges to ${outputPath}`);
}

main().catch(console.error);
