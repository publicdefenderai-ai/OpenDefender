/**
 * Creates a clean shield SVG from the imagetracerjs output:
 *  - Keeps only the visible (teal) paths — removes the opacity=0 background path
 *  - Sets fill to exact #2D8EA5 brand color, opacity=1
 *  - Adds fill-rule="evenodd" so interior holes render correctly
 *  - Exports 1x (512px) and 2x (1024px) transparent PNGs
 */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRAND_DIR = path.join(__dirname, '../client/public/brand');
const CHROMIUM = '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';

// ── Parse the traced SVG and keep only visible paths ─────────────────────────
let svg = fs.readFileSync(path.join(BRAND_DIR, 'logo-shield-traced.svg'), 'utf8');

// Extract individual path elements
const pathElements = [...svg.matchAll(/<path[^>]*\/>/gs)].map(m => m[0]);
console.log(`Found ${pathElements.length} paths:`);
pathElements.forEach((p, i) => {
  const op = (p.match(/opacity="([^"]+)"/) || [])[1];
  const fill = (p.match(/fill="([^"]+)"/) || [])[1];
  console.log(`  Path ${i+1}: fill=${fill}, opacity=${op}, length=${p.length}`);
});

// Keep only paths with opacity > 0 (discard invisible background)
const visiblePaths = pathElements.filter(p => {
  const op = parseFloat((p.match(/opacity="([^"]+)"/) || [0, '0'])[1]);
  return op > 0;
});

console.log(`\nKeeping ${visiblePaths.length} visible path(s)`);

// Clean each path: set exact brand color, opacity=1, add evenodd fill-rule
const cleanedPaths = visiblePaths.map(p => {
  return p
    .replace(/fill="[^"]*"/g, 'fill="#2D8EA5"')
    .replace(/stroke="[^"]*"/g, 'stroke="none"')
    .replace(/stroke-width="[^"]*"/g, '')
    .replace(/opacity="[^"]*"/g, 'opacity="1"')
    .replace(/<path /, '<path fill-rule="evenodd" ');
});

// Build final SVG (viewBox from original 455×548 dimensions)
const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 455 548">
  <title>OpenDefender Shield</title>
  ${cleanedPaths.join('\n  ')}
</svg>`;

fs.writeFileSync(path.join(BRAND_DIR, 'logo-shield.svg'), finalSvg);
console.log('\n✓ logo-shield.svg written');

// ── Render PNGs ───────────────────────────────────────────────────────────────
async function renderPng(svgContent, outPath, w, h) {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setContent(`<!DOCTYPE html><html><head><style>
    *{margin:0;padding:0;} html,body{width:${w}px;height:${h}px;background:transparent;overflow:hidden;}
    svg{display:block;width:${w}px!important;height:${h}px!important;}</style>
    </head><body>${svgContent}</body></html>`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: outPath, omitBackground: true, clip:{x:0,y:0,width:w,height:h} });
  await browser.close();
  console.log(`✓ ${path.basename(outPath)} (${w}×${h})`);
}

// 1x at 512px wide (proportional: 455:548 → 512:616)
const W1 = 512, H1 = Math.round(512 * 548 / 455);
await renderPng(finalSvg, path.join(BRAND_DIR, 'logo-shield-1x.png'), W1, H1);
await renderPng(finalSvg, path.join(BRAND_DIR, 'logo-shield-2x.png'), W1*2, H1*2);
console.log('\nDone!');
