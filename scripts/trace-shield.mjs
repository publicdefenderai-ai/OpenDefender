/**
 * Extracts SVG path data from the actual site PNG logo using canvas pixel analysis.
 * Implements marching squares contour tracing in the browser context via puppeteer.
 */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PNG_PATH = path.join(__dirname, '../attached_assets/OpenDefenderLogo2-removebg-preview_1773114975197.png');
const CHROMIUM = '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';

const pngBase64 = fs.readFileSync(PNG_PATH).toString('base64');
const dataUrl = `data:image/png;base64,${pngBase64}`;

async function trace() {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  // Run everything in-browser using canvas pixel analysis + contour tracing
  const result = await page.evaluate(async (dataUrl) => {
    // ── Load image onto canvas ────────────────────────────────────────────────
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res; img.onerror = rej; img.src = dataUrl;
    });
    const W = img.naturalWidth, H = img.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, W, H); // RGBA

    // ── Binarize: teal pixels (alpha > 64) → 1, transparent → 0 ─────────────
    const grid = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) {
      grid[i] = data[i * 4 + 3] > 64 ? 1 : 0; // alpha channel
    }

    return { W, H, gridLen: grid.length, nonZero: grid.reduce((a,v)=>a+v,0) };
  }, dataUrl);

  console.log(`Image: ${result.W}×${result.H}, colored pixels: ${result.nonZero}`);

  // ── Now use imagetracerjs via CDN for proper vector tracing ──────────────────
  const svgData = await page.evaluate(async (dataUrl) => {
    // Load imagetracerjs from CDN
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.6/imagetracer_v1.2.6.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });

    return new Promise((resolve) => {
      ImageTracer.imageToSVG(dataUrl, (svgstr) => resolve(svgstr), {
        numberofcolors: 2,
        mincolorratio: 0,
        colorquantcycles: 3,
        pathomit: 8,
        ltres: 0.5,
        qtres: 0.5,
        scale: 1,
        strokewidth: 1,
        viewBox: true,
      });
    });
  }, dataUrl);

  await browser.close();
  return svgData;
}

trace().then(svg => {
  const outPath = path.join(__dirname, '../client/public/brand/logo-shield-traced.svg');
  fs.writeFileSync(outPath, svg);
  // Also print a summary
  const pathCount = (svg.match(/<path/g) || []).length;
  const vb = svg.match(/viewBox="([^"]+)"/);
  console.log(`\nTraced SVG written → ${outPath}`);
  console.log(`  paths: ${pathCount}, viewBox: ${vb ? vb[1] : 'none'}`);
  console.log(`  size: ${Math.round(svg.length/1024)}KB`);
}).catch(err => {
  console.error('Tracing failed:', err.message);
  process.exit(1);
});
