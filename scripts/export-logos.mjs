import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRAND_DIR = path.join(__dirname, '../client/public/brand');
const CHROMIUM = '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';

const TEAL = '#2D8EA5';
const FONT_LINK = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap" rel="stylesheet">`;

// Shield paths at uniform 6.25× scale from the original 32×32 artwork
// viewBox 0 0 200 200 — visual shield spans x:[22,178] y:[25,191]
const OUTER = 'M134,34 C156,34 178,56 178,88 C178,131 150,169 100,191 C50,169 22,131 22,88 C22,56 44,34 66,34 C78,34 91,31 100,25';
const INNER = 'M125,66 C141,66 153,81 153,103 C153,134 134,163 100,178 C66,163 47,134 47,103 C47,81 59,66 75,66 C84,66 94,59 100,53';

function shieldSVG(size) {
  // Returns a nested <svg> tag that renders the shield at `size` px (square)
  return `<svg x="0" y="0" width="${size}" height="${size}" viewBox="0 0 200 200">
    <path d="${OUTER}" fill="none" stroke="${TEAL}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${INNER}" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ─── Measure text pixel width at a given font-size via puppeteer ──────────────
async function measureText(browser, text, fontSize) {
  const page = await browser.newPage();
  await page.setViewport({ width: 2000, height: 200, deviceScaleFactor: 1 });
  await page.setContent(`<!DOCTYPE html><html><head>${FONT_LINK}
    <style>body{margin:0;padding:0;background:transparent;}
    span{font-family:'Inter',system-ui,sans-serif;font-weight:700;font-size:${fontSize}px;letter-spacing:-0.01em;white-space:nowrap;visibility:hidden;position:absolute;top:0;left:0;}</style>
    </head><body><span id="t">${text}</span></body></html>`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const width = await page.evaluate(() => document.getElementById('t').getBoundingClientRect().width);
  await page.close();
  return Math.ceil(width);
}

async function renderPNG(browser, svgContent, w, h, outPath) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  const html = `<!DOCTYPE html><html><head>${FONT_LINK}
    <style>*{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:${w}px;height:${h}px;background:transparent;overflow:hidden;}
    svg{display:block;width:${w}px!important;height:${h}px!important;}</style>
    </head><body>${svgContent}</body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: outPath, omitBackground: true, clip: { x:0, y:0, width:w, height:h } });
  await page.close();
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'],
    headless: true,
  });

  try {
    // ── Measure text widths ──────────────────────────────────────────────────
    const tw80 = await measureText(browser, 'OpenDefender', 80);
    const tw72 = await measureText(browser, 'OpenDefender', 72);
    console.log(`Text widths: 80px → ${tw80}px, 72px → ${tw72}px`);

    const PAD = 28; // horizontal padding each side

    // ── 1. Shield only ───────────────────────────────────────────────────────
    // 200×200 viewBox, visual shield fills nicely with ~22px margin each side
    const shield1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <title>OpenDefender Shield</title>
  <path d="${OUTER}" fill="none" stroke="${TEAL}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${INNER}" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
    fs.writeFileSync(path.join(BRAND_DIR, 'logo-shield.svg'), shield1);
    console.log('✓ logo-shield.svg');

    // ── 2. Wordmark only ─────────────────────────────────────────────────────
    // width = text + 2×PAD; height = 80px cap-height (58px) + 2×19 margin
    const wmW = tw80 + PAD * 2;
    const wmH = 96;
    const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wmW} ${wmH}">
  <title>OpenDefender Wordmark</title>
  <defs><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&amp;display=swap');</style></defs>
  <text x="${wmW / 2}" y="76" text-anchor="middle"
    font-family="Inter, system-ui, -apple-system, sans-serif"
    font-weight="700" font-size="80" style="letter-spacing:-0.01em"
    fill="${TEAL}">OpenDefender</text>
</svg>`;
    fs.writeFileSync(path.join(BRAND_DIR, 'logo-wordmark.svg'), wordmark);
    console.log('✓ logo-wordmark.svg');

    // ── 3. Horizontal lockup ─────────────────────────────────────────────────
    // Shield: 120×120 nested SVG. Visual shield: 120×(166/200×120)=120×99.6 px
    // Text: 80px font, cap-height ≈58px. Lockup height: 150 to give padding.
    // Text baseline: vertically centering cap height in 150px → y = (150-58)/2 + 58 = 104
    const SHIELD_SQ = 120;
    const TEXT_X = 5 + SHIELD_SQ + 20; // shield x + shield width + gap
    const hzW = TEXT_X + tw80 + PAD;
    const hzH = 150;
    const horiz = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${hzW} ${hzH}">
  <title>OpenDefender Horizontal Logo</title>
  <defs><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&amp;display=swap');</style></defs>
  <svg x="5" y="${(hzH - SHIELD_SQ) / 2}" width="${SHIELD_SQ}" height="${SHIELD_SQ}" viewBox="0 0 200 200">
    <path d="${OUTER}" fill="none" stroke="${TEAL}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${INNER}" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <text x="${TEXT_X}" y="104"
    font-family="Inter, system-ui, -apple-system, sans-serif"
    font-weight="700" font-size="80" style="letter-spacing:-0.01em"
    fill="${TEAL}">OpenDefender</text>
</svg>`;
    fs.writeFileSync(path.join(BRAND_DIR, 'logo-horizontal.svg'), horiz);
    console.log('✓ logo-horizontal.svg');

    // ── 4. Stacked lockup ────────────────────────────────────────────────────
    // Shield: 240×240 nested SVG, centered in width. Visual shield: 240×(166/200×240)=240×199 px
    // Visual shield bottom: 20 + (191/200)*240 = 20+229.2 = 249.2
    // Gap: 24px. Text baseline: 249.2+24+52(cap_h_72) = 325.2 → y=326
    const SHIELD_SQ2 = 240;
    const stW = tw72 + PAD * 2;
    const shieldX2 = Math.round((stW - SHIELD_SQ2) / 2);
    const shieldBottom = 20 + (191 / 200) * SHIELD_SQ2; // visual bottom in outer coords
    const textY2 = Math.round(shieldBottom + 24 + 52); // 52 ≈ cap-height for 72px Inter
    const stH = textY2 + 24; // bottom margin
    const stacked = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${stW} ${stH}">
  <title>OpenDefender Stacked Logo</title>
  <defs><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&amp;display=swap');</style></defs>
  <svg x="${shieldX2}" y="20" width="${SHIELD_SQ2}" height="${SHIELD_SQ2}" viewBox="0 0 200 200">
    <path d="${OUTER}" fill="none" stroke="${TEAL}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${INNER}" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <text x="${stW / 2}" y="${textY2}"
    text-anchor="middle"
    font-family="Inter, system-ui, -apple-system, sans-serif"
    font-weight="700" font-size="72" style="letter-spacing:-0.01em"
    fill="${TEAL}">OpenDefender</text>
</svg>`;
    fs.writeFileSync(path.join(BRAND_DIR, 'logo-stacked.svg'), stacked);
    console.log('✓ logo-stacked.svg');

    // ── Export PNGs at 1× and 2× ─────────────────────────────────────────────
    const configs = [
      ['logo-shield',     200,  200,  shield1],
      ['logo-wordmark',   wmW,  wmH,  wordmark],
      ['logo-horizontal', hzW,  hzH,  horiz],
      ['logo-stacked',    stW,  stH,  stacked],
    ];

    for (const [name, w, h, svg] of configs) {
      for (const scale of [1, 2]) {
        const pw = w * scale, ph = h * scale;
        const outPath = path.join(BRAND_DIR, `${name}-${scale}x.png`);
        await renderPNG(browser, svg, pw, ph, outPath);
        console.log(`✓ ${name}-${scale}x.png  (${pw}×${ph})`);
      }
    }

  } finally {
    await browser.close();
  }

  console.log('\nAll files written to', BRAND_DIR);
  fs.readdirSync(BRAND_DIR).sort().forEach(f =>
    console.log('  ', f, Math.round(fs.statSync(path.join(BRAND_DIR, f)).size / 1024) + 'KB'));
}

main().catch(err => { console.error(err.message); process.exit(1); });
