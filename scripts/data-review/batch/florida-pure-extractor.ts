/** Network-free exact-page parser matching the established Florida importer boundaries. */
function decodeHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:div|p|span)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&amp;/g, "&").replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

const months: Record<string, string> = {
  jan: "January", january: "January", feb: "February", february: "February",
  mar: "March", march: "March", apr: "April", april: "April", may: "May",
  jun: "June", june: "June", jul: "July", july: "July", aug: "August", august: "August",
  sep: "September", sept: "September", september: "September", oct: "October",
  october: "October", nov: "November", november: "November", dec: "December", december: "December",
};

function latestEffectiveDate(text: string) {
  const pattern = /\beff(?:ective)?\.?\s*(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2}),\s+(\d{4})/gi;
  const dates = [...text.matchAll(pattern)].map(match => {
    const month = months[match[1].toLowerCase()];
    const day = Number(match[2]);
    const year = Number(match[3]);
    return { value: `${month} ${day}, ${year}`, time: Date.parse(`${month} ${day}, ${year} UTC`) };
  }).filter(date => Number.isFinite(date.time)).sort((a, b) => b.time - a.time);
  return dates[0]?.value ?? null;
}

export function extractFloridaExactPage(html: string, section: string) {
  const sectionStart = html.indexOf('<div class="Section">');
  const bodyEnd = sectionStart >= 0 ? html.indexOf("</body>", sectionStart) : -1;
  if (sectionStart < 0 || bodyEnd < 0) return null;
  const block = html.slice(sectionStart, bodyEnd);
  const numberHtml = block.match(/class=["']SectionNumber["'][^>]*>([^<]*)<\/span>/i)?.[1];
  const sectionNumber = numberHtml ? decodeHtml(numberHtml).replace(/[^\d.]/g, "") : null;
  if (sectionNumber !== section) return null;
  const catchline = block.match(/class=["']CatchlineText["'][^>]*>([\s\S]*?)<\/span>/i)?.[1];
  if (!catchline) return null;
  const title = decodeHtml(catchline).replace(/[.;\s]+$/, "").trim();
  const text = decodeHtml(block);
  return title && text ? { title, text, effectiveDateStart: latestEffectiveDate(text) } : null;
}