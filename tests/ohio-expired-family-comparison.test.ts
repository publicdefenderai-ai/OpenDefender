import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { compareOhioPage, ohioComparisonInventory } from '../scripts/data-review/compare-ohio-expired-families';
import { extractOhioDocument } from '../scripts/data-review/ohio-discovery/section-document';

const sha = (text:string) => createHash('sha256').update(text).digest('hex');
const url='https://codes.ohio.gov/ohio-revised-code/section-2903.11';
const retrievedAt='2026-01-10T12:00:00.000Z';
const html='<h1>Section 2903.11 | Example.</h1><div class="label">Effective:</div><div class="value">January 1, 2025</div><section class="laws-body"><p>(A) Example statutory wording of adequate length.</p></section>';
const doc=extractOhioDocument(html,'2903.11',url,new Date(retrievedAt))!;
const pin={...doc,effectiveDateStart:doc.effectiveDateStart!,contentHash:sha(doc.text)};
const page={url,status:200,retrievedAt,html,pageHash:sha(html)};

describe('Ohio candidate comparisons',()=>{
  it('deduplicates transport while retaining all family-specific pins and affected choices',()=>{
    const inventory=ohioComparisonInventory();
    const duplicate=[...inventory.values()].find(bindings=>bindings.size===3)!;
    expect(duplicate).toBeDefined();
    for(const binding of duplicate.values())expect(binding.chargeIds.size).toBeGreaterThan(0);
    expect([...inventory].every(([url,bindings])=>[...bindings.values()].every(({document})=>document.sourceUrl===url))).toBe(true);
  });
  it('requires matching text, title and version metadata',()=>{
    expect(compareOhioPage('reviewed',pin,page).status).toBe('unchanged');
    for(const oldPin of [{...pin,effectiveDateStart:'2024-01-01'}, {...pin,title:'Different heading'}, {...pin,text:'Different text'}]){
      const difference=compareOhioPage('major',oldPin,page);
      expect(difference.status).toBe('changed');
      expect(difference.observedText).toBe(doc.text);
    }
  });
  it('withholds future pages, wrong sections, missing content and transport failures',()=>{
    for(const body of [html.replace('January 1, 2025','January 1, 2099'),html.replace('2903.11','2903.12'),'<p>Access temporarily unavailable</p>']){
      expect(compareOhioPage('major',pin,{...page,html:body,pageHash:sha(body)}).status).toBe('unavailable');
    }
    expect(compareOhioPage('reviewed',pin,{...page,status:403}).status).toBe('unavailable');
  });
  it('rejects an altered acquisition identity, date or body before comparing',()=>{
    for(const bad of [{...page,url:'https://example.com'}, {...page,retrievedAt:'invalid'}, {...page,retrievedAt:'2099-01-01T00:00:00.000Z'}, {...page,pageHash:'bad'}]){
      expect(()=>compareOhioPage('major',pin,bad)).toThrow('Invalid acquisition binding');
    }
  });
  it('uses the reviewed administrative-rule parser, never an ORC fallback',()=>{
    const rule=[...ohioComparisonInventory()].find(([url])=>url.includes('/ohio-administrative-code/'))!;
    expect(compareOhioPage('reviewed',rule[1].get('reviewed')!.document,{...page,url:rule[0]}).status).toBe('unavailable');
  });
});
