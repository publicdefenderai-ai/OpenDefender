/**
 * Brand asset export pipeline
 * Produces: horizontal wordmark, stacked wordmark, favicon set, OG image
 * Font: Inter Bold, color #2D8EA5, letter-spacing -0.01em
 */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRAND = path.join(__dirname, '../client/public/brand');
const CHROMIUM = '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium';
const TEAL = '#2D8EA5';

const shieldSvg = fs.readFileSync(path.join(BRAND, 'logo-shield.svg'), 'utf8');

// Encode SVG for use in data URI (inline in HTML without external files)
const shieldB64 = Buffer.from(shieldSvg).toString('base64');
const shieldDataUri = `data:image/svg+xml;base64,${shieldB64}`;

// Google Fonts Inter: load Bold (700) weight
const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap" rel="stylesheet">`;

// ── Core render helper ──────────────────────────────────────────────────────
async function renderHtml(html, outPath, w, h) {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: w + 40, height: h + 40, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  // Wait for font to paint
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({
    path: outPath,
    omitBackground: true,
    clip: { x: 0, y: 0, width: w, height: h },
    ...(outPath.endsWith('.png') ? {} : {}),
  });
  await browser.close();
  console.log(`✓ ${path.basename(outPath)} (${w}×${h})`);
}

// ── 1. HORIZONTAL WORDMARK ──────────────────────────────────────────────────
// Shield at 80px tall (aspect 1820:2192 → width=66px), gap 20px, text ~72px Inter Bold
async function horizontalWordmark() {
  const shH = 90, shW = Math.round(90 * 1820 / 2192); // 74px
  const fontSize = 72;
  const gap = 20;
  const totalH = shH + 4; // slight padding
  // We'll measure text in-browser to get exact width
  const W = 600, H = totalH + 20;

  const html = `<!DOCTYPE html><html><head>${FONT_LINK}<style>
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:${W}px;height:${H}px;background:transparent;overflow:hidden;}
    .wrap{display:inline-flex;align-items:center;gap:${gap}px;padding:10px 0 10px 0;}
    img{display:block;width:${shW}px;height:${shH}px;flex-shrink:0;}
    span{font-family:'Inter',sans-serif;font-weight:700;font-size:${fontSize}px;
         color:${TEAL};letter-spacing:-0.01em;white-space:nowrap;line-height:1;}
  </style></head><body><div class="wrap">
    <img src="${shieldDataUri}" alt=""/>
    <span>OpenDefender</span>
  </div></body></html>`;

  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Measure the actual rendered bounding box
  const bounds = await page.evaluate(() => {
    const el = document.querySelector('.wrap');
    const r = el.getBoundingClientRect();
    return { w: Math.ceil(r.width), h: Math.ceil(r.height), x: Math.floor(r.x), y: Math.floor(r.y) };
  });

  await page.screenshot({
    path: path.join(BRAND, 'wordmark-horizontal.png'),
    omitBackground: true,
    clip: { x: bounds.x, y: bounds.y, width: bounds.w, height: bounds.h },
  });
  await browser.close();
  console.log(`✓ wordmark-horizontal.png (${bounds.w}×${bounds.h})`);
  return bounds;
}

// ── 2. STACKED WORDMARK ─────────────────────────────────────────────────────
async function stackedWordmark() {
  const shH = 140, shW = Math.round(140 * 1820 / 2192); // 116px
  const fontSize = 56;
  const gap = 18;
  const W = 500, H = 300;

  const html = `<!DOCTYPE html><html><head>${FONT_LINK}<style>
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:${W}px;height:${H}px;background:transparent;overflow:hidden;}
    .wrap{display:inline-flex;flex-direction:column;align-items:center;gap:${gap}px;padding:10px;}
    img{display:block;width:${shW}px;height:${shH}px;}
    span{font-family:'Inter',sans-serif;font-weight:700;font-size:${fontSize}px;
         color:${TEAL};letter-spacing:-0.01em;white-space:nowrap;line-height:1;}
  </style></head><body><div class="wrap">
    <img src="${shieldDataUri}" alt=""/>
    <span>OpenDefender</span>
  </div></body></html>`;

  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const bounds = await page.evaluate(() => {
    const el = document.querySelector('.wrap');
    const r = el.getBoundingClientRect();
    return { w: Math.ceil(r.width), h: Math.ceil(r.height), x: Math.floor(r.x), y: Math.floor(r.y) };
  });

  await page.screenshot({
    path: path.join(BRAND, 'wordmark-stacked.png'),
    omitBackground: true,
    clip: { x: bounds.x, y: bounds.y, width: bounds.w, height: bounds.h },
  });
  await browser.close();
  console.log(`✓ wordmark-stacked.png (${bounds.w}×${bounds.h})`);
}

// ── 3. FAVICON SET ──────────────────────────────────────────────────────────
async function favicons() {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-gpu'],
    headless: true,
  });

  const sizes = [16, 32, 64, 180, 192, 512];
  for (const size of sizes) {
    const page = await browser.newPage();
    // For tiny sizes (16/32) use a slightly thicker stroke by scaling up then clipping
    const scale = size <= 32 ? 4 : 1;
    const renderSize = size * scale;
    const shW = Math.round(renderSize * 1820 / 2192);

    await page.setViewport({ width: renderSize, height: renderSize, deviceScaleFactor: size <= 32 ? 1 : 2 });
    const html = `<!DOCTYPE html><html><head><style>
      *{margin:0;padding:0;}
      html,body{width:${renderSize}px;height:${renderSize}px;background:transparent;overflow:hidden;}
      .c{width:${renderSize}px;height:${renderSize}px;display:flex;align-items:center;justify-content:center;}
      img{display:block;width:${shW}px;height:${renderSize}px;}
    </style></head><body><div class="c">
      <img src="${shieldDataUri}" alt=""/>
    </div></body></html>`;
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const suffix = size === 180 ? 'apple-touch-icon' : size === 192 ? 'android-192' : size === 512 ? 'android-512' : `favicon-${size}`;
    const outPath = path.join(BRAND, `${suffix}.png`);
    await page.screenshot({
      path: outPath,
      omitBackground: true,
      clip: { x: 0, y: 0, width: renderSize, height: renderSize },
    });
    await page.close();
    console.log(`✓ ${path.basename(outPath)} (${renderSize}×${renderSize})`);
  }
  await browser.close();
}

// ── 4. OG IMAGE (1200×630) ──────────────────────────────────────────────────
async function ogImage() {
  const W = 1200, H = 630;
  const shH = 180, shW = Math.round(180 * 1820 / 2192); // 149px

  const html = `<!DOCTYPE html><html><head>${FONT_LINK}<style>
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:${W}px;height:${H}px;overflow:hidden;}
    .bg{
      width:${W}px;height:${H}px;
      background: linear-gradient(135deg, #f0f9fb 0%, #e8f4f8 40%, #dff0f5 100%);
      display:flex;align-items:center;justify-content:center;
      position:relative;
    }
    /* subtle grid pattern */
    .bg::before{
      content:'';position:absolute;inset:0;
      background-image:
        linear-gradient(rgba(45,142,165,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(45,142,165,0.08) 1px, transparent 1px);
      background-size:40px 40px;
    }
    .card{
      position:relative;z-index:1;
      display:flex;flex-direction:column;align-items:center;gap:28px;
    }
    .shield-row{display:flex;align-items:center;gap:28px;}
    img{display:block;width:${shW}px;height:${shH}px;}
    .name{
      font-family:'Inter',sans-serif;font-weight:700;font-size:92px;
      color:${TEAL};letter-spacing:-0.01em;line-height:1;white-space:nowrap;
    }
    .tagline{
      font-family:'Inter',sans-serif;font-weight:400;font-size:26px;
      color:#4a7a8a;letter-spacing:0;line-height:1.4;text-align:center;
      max-width:800px;
    }
    .pill{
      display:inline-block;
      background:rgba(45,142,165,0.12);
      border:1.5px solid rgba(45,142,165,0.3);
      border-radius:100px;
      padding:8px 24px;
      font-family:'Inter',sans-serif;font-weight:700;font-size:18px;
      color:${TEAL};letter-spacing:0.04em;text-transform:uppercase;
    }
  </style></head><body><div class="bg"><div class="card">
    <div class="shield-row">
      <img src="${shieldDataUri}" alt=""/>
      <span class="name">OpenDefender</span>
    </div>
    <div class="tagline">Free AI-powered legal guidance — in English, Español, and 中文</div>
    <div class="pill">opendefender.replit.app</div>
  </div></div></body></html>`;

  await renderHtml(html, path.join(BRAND, 'og-image.png'), W, H);
}

// ── Run all ──────────────────────────────────────────────────────────────────
console.log('Building brand assets...\n');
await horizontalWordmark();
await stackedWordmark();
await favicons();
await ogImage();
console.log('\n✅ All brand assets written to client/public/brand/');
