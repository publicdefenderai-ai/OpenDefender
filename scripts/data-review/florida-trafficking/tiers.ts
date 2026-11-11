import { findSubdivisionRange } from '../../../server/data/florida-reviewed-source-records';

type Language = 'en' | 'es' | 'zh';
const quantity = /^Is ([\d,]+) (kilo)?grams? or more(?:,? but less than ([\d,]+) (kilo)?grams?)?,/;
const term = /mandatory minimum term of imprisonment of (\d+) (calendar )?years/;
const fine = /(?:a )?fine of \$([\d,]+)\./;
const number = (value: string) => Number(value.replaceAll(',', ''));

export function bindWeightTiers(text: string, scope: string, expectedCount: number) {
  const ranges = findSubdivisionRange(text, scope);
  if (ranges.length !== 1) throw Error(`Expected one statutory grading paragraph at ${scope}`);
  const range = ranges[0];
  const sentences = [...text.slice(range.start, range.end).matchAll(/^Is .+$/gm)];
  if (sentences.length !== expectedCount) throw Error(`Weight-tier count changed at ${scope}`);
  return sentences.map(sentence => {
    const line = sentence[0];
    const weight = line.match(quantity), years = line.match(term), dollars = line.match(fine);
    if (!weight || !years || !dollars) throw Error(`Unexpected weight, minimum or fine at ${scope}: ${line}`);
    const start = range.start + sentence.index;
    return {start, end:start + line.length, text:line, lower:number(weight[1]), lowerUnit:weight[2] ? 'kg' : 'g',
      upper:weight[3] ? number(weight[3]) : null, upperUnit:weight[3] ? weight[4] ? 'kg':'g' : null,
      years:number(years[1]), calendarYears:Boolean(years[2]), dollars:number(dollars[1])};
  });
}

export function renderTier(t: ReturnType<typeof bindWeightTiers>[number], lang: Language) {
  const lower = `${t.lower} ${t.lowerUnit}`, upper = `${t.upper} ${t.upperUnit}`;
  const dollars = t.dollars.toLocaleString('en-US');
  if (lang === 'es') return `${t.upper === null ? `${lower} o más` : `De ${lower} a menos de ${upper}`}: mínimo de ${t.years} años${t.calendarYears ? ' calendario' : ''} y $${dollars} de multa.`;
  if (lang === 'zh') return `${lower}以上${t.upper === null ? '' : `且不足${upper}`}：最低${t.years}${t.calendarYears ? '个日历年' : '年'}监禁，并处罚款${dollars}美元。`;
  return `${t.upper === null ? `${lower} or more` : `${lower} to under ${upper}`}: at least ${t.years}${t.calendarYears ? ' calendar' : ''} years and a $${dollars} fine.`;
}
