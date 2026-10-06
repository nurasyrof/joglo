// Development-only generators, never part of the production build:
//   ?og=house  on a house page   → public/og/<house>-<lang>.jpg (1200 × 630 share image)
//   ?og=home   on the home page  → public/og/home-<lang>.jpg
//   ?icons=1   on any page       → favicon and app icon PNGs in public/
// Open the page at a 1200 × 630 viewport for share images; the viewer hides its UI in this mode.
import { tx } from '@/lib/i18n.js';

const W = 1200, H = 630;
// How close the camera sits for each house's share image (1 = the standard 3D view).
const SHOT = { joglo: 0.68, 'rumah-gadang': 0.72, 'uma-mbatangu': 0.74, 'pekarangan-bali': 0.7, tongkonan: 0.7 };
const save = (path, blob) => fetch(`/__save?path=${encodeURIComponent(path)}`, { method: 'POST', body: blob }).then((r) => r.text());
const toBlob = (canvas, type, q) => new Promise((r) => canvas.toBlob(r, type, q));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function fitText(g, text, font, size, maxWidth) {
  let s = size;
  do { g.font = `${font.replace('{s}', s)}`; s -= 2; } while (g.measureText(text).width > maxWidth && s > 20);
  return s + 2;
}

function wrap(g, text, maxWidth) {
  const words = text.split(' '), lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (g.measureText(next).width > maxWidth && line) { lines.push(line); line = w; } else line = next;
  }
  lines.push(line);
  return lines;
}

export async function makeShareImage({ engine, meta, lang, home }) {
  await document.fonts.load('600 100px "Cormorant Garamond"');
  await document.fonts.load('500 30px "Geist Variable"');
  await wait(1500);                                    // let the opening animation start, then override it
  engine.setShot({ view: 'iso', zoom: SHOT[meta.id] ?? 0.78 });
  engine.setViewShift(0.2);
  await wait(300);
  const scene = engine.captureCanvas();
  engine.setViewShift(0);

  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  // Scene, cover-fitted
  const k = Math.max(W / scene.width, H / scene.height);
  g.drawImage(scene, (W - scene.width * k) / 2, (H - scene.height * k) / 2, scene.width * k, scene.height * k);
  // Shade on the left for the text
  const shade = g.createLinearGradient(0, 0, W * 0.72, 0);
  shade.addColorStop(0, 'rgba(26,20,15,0.86)');
  shade.addColorStop(0.55, 'rgba(26,20,15,0.55)');
  shade.addColorStop(1, 'rgba(26,20,15,0)');
  g.fillStyle = shade;
  g.fillRect(0, 0, W, H);

  const L = (en, id) => (lang === 'id' ? id : en);
  const x = 72, textW = 600;
  g.textBaseline = 'alphabetic';
  // Brand
  g.fillStyle = '#e8b866';
  g.font = '600 26px "Geist Variable", sans-serif';
  g.fillText('rumahadat.id', x, 96);

  let title, subtitle, place = null;
  if (home) {
    title = L(['Indonesia’s traditional', 'houses in 3D'], ['Rumah adat Indonesia', 'dalam 3D']);
    subtitle = L('Take them apart and learn what every part means', 'Urai dan pelajari makna setiap bagiannya');
  } else {
    title = meta.name;
    subtitle = L(`${tx(meta.people, lang)} traditional house`, `Rumah adat ${tx(meta.people, lang)}`);
    place = tx(meta.province, lang);
  }
  // Title (wraps for the home card, shrinks to fit for long house names)
  g.fillStyle = '#fbf6ee';
  let lines, size;
  if (home) {
    size = 84;
    lines = title;
  } else {
    size = fitText(g, title, '600 {s}px "Cormorant Garamond", serif', 128, textW);
    lines = [title];
  }
  const lineH = size * 0.98;
  let y = home ? 250 : 292;
  g.font = `600 ${size}px "Cormorant Garamond", serif`;
  for (const ln of lines) { g.fillText(ln, x - 4, y); y += lineH; }
  // Subtitle
  g.fillStyle = 'rgba(251,246,238,0.88)';
  g.font = `500 ${home ? 26 : 32}px "Geist Variable", sans-serif`;
  const subLines = wrap(g, subtitle, home ? 760 : textW);
  y += home ? 6 : 4;
  for (const ln of subLines) { g.fillText(ln, x, y); y += home ? 36 : 42; }
  if (place) {
    g.fillStyle = 'rgba(251,246,238,0.62)';
    g.font = '500 26px "Geist Variable", sans-serif';
    g.fillText(place, x, y - 4);
  }
  // Call to action
  const cta = L('Explore in 3D  →', 'Jelajahi dalam 3D  →');
  g.font = '600 26px "Geist Variable", sans-serif';
  const pw = g.measureText(cta).width + 48, ph = 58, py = H - 72 - ph;
  g.fillStyle = '#a5532f';
  g.beginPath(); g.roundRect(x, py, pw, ph, 29); g.fill();
  g.fillStyle = '#fbf6ee';
  g.fillText(cta, x + 24, py + 38);

  const name = `og/${home ? 'home' : meta.id}-${lang}.jpg`;
  const result = await save(name, await toBlob(c, 'image/jpeg', 0.88));
  window.__ogDone = result;
  return result;
}

export async function makeIcons() {
  const svg = await (await fetch('/icon.svg')).text();
  // App icons are full-bleed squares: phones apply their own rounded mask.
  const square = svg.replace('rx="14"', 'rx="0"');
  const draw = async (src, size) => {
    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(src)}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = c.height = size;
    c.getContext('2d').drawImage(img, 0, 0, size, size);
    return toBlob(c, 'image/png');
  };
  const out = [];
  out.push(await save('apple-touch-icon.png', await draw(square, 180)));
  out.push(await save('icon-192.png', await draw(square, 192)));
  out.push(await save('icon-512.png', await draw(square, 512)));
  for (const s of [16, 32, 48]) out.push(await save(`favicon-${s}.png`, await draw(svg, s)));
  window.__iconsDone = out;
  return out;
}
