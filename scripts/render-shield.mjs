import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROMIUM = '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';
const BRAND_DIR = path.join(__dirname, '../client/public/brand');

async function renderSvgToPng(svgContent, outPath, w, h) {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setContent(`<!DOCTYPE html><html><head><style>
    *{margin:0;padding:0;}
    html,body{width:${w}px;height:${h}px;background:transparent;overflow:hidden;}
    svg{display:block;width:${w}px!important;height:${h}px!important;}
    </style></head><body>${svgContent}</body></html>`,
    { waitUntil: 'networkidle0' });
  await page.screenshot({ path: outPath, omitBackground: true, clip:{x:0,y:0,width:w,height:h} });
  await browser.close();
}

// Read the traced SVG
let svg = fs.readFileSync(path.join(BRAND_DIR, 'logo-shield-traced.svg'), 'utf8');

// The traced SVG from imagetracerjs uses filled paths in the original image color.
// We need to:
// 1. Add a proper viewBox
// 2. Colorize to #2D8EA5 (it's already the right color since it came from the logo)
// 3. Keep the transparent background

// Add viewBox based on image dimensions (455×548)
if (!svg.includes('viewBox')) {
  svg = svg.replace('<svg', '<svg viewBox="0 0 455 548"');
}

console.log('SVG first 300 chars:');
console.log(svg.substring(0, 300));
console.log('...');

fs.writeFileSync(path.join(BRAND_DIR, 'logo-shield-traced.svg'), svg);

// Render at 1x (455×548) and 2x (910×1096)
await renderSvgToPng(svg, path.join(BRAND_DIR, 'logo-shield-traced-1x.png'), 455, 548);
console.log('✓ logo-shield-traced-1x.png');
await renderSvgToPng(svg, path.join(BRAND_DIR, 'logo-shield-traced-2x.png'), 910, 1096);
console.log('✓ logo-shield-traced-2x.png');
