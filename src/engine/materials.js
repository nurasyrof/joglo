// Procedural textures shared by all houses, and the per-house material factory.
import * as THREE from 'three';

function rng(s) { return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; }

function canvasTex(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Every texture is drawn light/neutral so the slot colour can tint it,
// except `ukiran`, which carries its own painted colours.
const DRAW = {
  wood: () => canvasTex(512, (g, w, h) => {
    const r = rng(11);
    g.fillStyle = '#ece5da';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      const x = r() * w, bw = 6 + r() * 34;
      g.fillStyle = `rgba(95,62,34,${0.03 + r() * 0.06})`;
      g.fillRect(x, 0, bw, h);
      g.fillRect(x - w, 0, bw, h);
    }
    for (let i = 0; i < 240; i++) {
      let x = r() * w;
      g.strokeStyle = `rgba(70,40,18,${0.05 + r() * 0.13})`;
      g.lineWidth = 0.4 + r() * 1.5;
      g.beginPath();
      g.moveTo(x, 0);
      for (let y = 0; y <= h; y += 8) { x += (r() - 0.5) * 1.3; g.lineTo(x, y); }
      g.stroke();
    }
  }),

  // Javanese clay roof tiles: 4 columns × 4 staggered rows covering 1 m × 1.2 m.
  tile: () => canvasTex(512, (g, w, h) => {
    const r = rng(5), cols = 4, rows = 4, cw = w / cols, rh = h / rows;
    g.fillStyle = '#2b1f19';
    g.fillRect(0, 0, w, h);
    for (let row = 0; row < rows; row++) {
      const off = (row % 2) * cw / 2, y = row * rh;
      for (let c = -1; c <= cols; c++) {
        const x = c * cw + off, s = 0.8 + r() * 0.2, base = 238 * s;
        const grd = g.createLinearGradient(0, y, 0, y + rh);
        grd.addColorStop(0, `rgb(${base * 0.55},${base * 0.55},${base * 0.55})`);
        grd.addColorStop(0.35, `rgb(${base * 0.85},${base * 0.85},${base * 0.85})`);
        grd.addColorStop(1, `rgb(${base},${base},${base})`);
        g.fillStyle = grd;
        g.beginPath();
        g.roundRect(x + 2, y + 1, cw - 4, rh - 4, 8);
        g.fill();
        g.fillStyle = 'rgba(255,255,255,0.10)';
        g.fillRect(x + cw * 0.42, y + 6, cw * 0.16, rh - 14);
        g.fillStyle = 'rgba(0,0,0,0.28)';
        g.fillRect(x + 4, y + rh - 6, cw - 8, 3);
      }
    }
  }),

  // Tegel floor: 2 × 2 tiles of 0.5 m per texture repeat.
  floor: () => canvasTex(512, (g, w) => {
    const r = rng(23), n = 2, s = w / n;
    g.fillStyle = '#6f675c';
    g.fillRect(0, 0, w, w);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = 222 + r() * 30;
      g.fillStyle = `rgb(${v},${v - 4},${v - 10})`;
      g.fillRect(i * s + 3, j * s + 3, s - 6, s - 6);
      for (let k = 0; k < 400; k++) {
        g.fillStyle = `rgba(80,70,60,${r() * 0.07})`;
        g.fillRect(i * s + 3 + r() * (s - 6), j * s + 3 + r() * (s - 6), 2 + r() * 5, 2 + r() * 5);
      }
      g.strokeStyle = 'rgba(0,0,0,0.12)';
      g.lineWidth = 2;
      g.strokeRect(i * s + 16, j * s + 16, s - 32, s - 32);
    }
  }),

  stone: () => canvasTex(256, (g, w) => {
    const r = rng(41);
    g.fillStyle = '#d9d6d0';
    g.fillRect(0, 0, w, w);
    for (let k = 0; k < 2600; k++) {
      const v = r() * 120;
      g.fillStyle = `rgba(${v},${v},${v},${0.06 + r() * 0.1})`;
      g.fillRect(r() * w, r() * w, 1 + r() * 3, 1 + r() * 3);
    }
  }),

  // Ijuk (sugar-palm fibre) thatch: fibres run down the slope (texture v).
  thatch: () => canvasTex(512, (g, w, h) => {
    const r = rng(77);
    g.fillStyle = '#bdb6ae';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1800; i++) {
      let x = r() * w;
      const y0 = r() * h, len = 40 + r() * 140, v = r() < 0.5 ? 60 + r() * 60 : 200 + r() * 55;
      g.strokeStyle = `rgba(${v},${v - 4},${v - 8},${0.25 + r() * 0.4})`;
      g.lineWidth = 0.6 + r() * 1.6;
      g.beginPath();
      g.moveTo(x, y0);
      for (let y = y0; y < y0 + len; y += 10) { x += (r() - 0.5) * 2; g.lineTo(x, y); }
      g.stroke();
      if (y0 + len > h) { g.beginPath(); g.moveTo(x, y0 - h); g.lineTo(x, y0 + len - h); g.stroke(); }
    }
    for (let k = 0; k < 6; k++) {
      g.fillStyle = 'rgba(0,0,0,0.12)';
      g.fillRect(0, (k * h) / 6, w, 5);
    }
  }),

  // Minangkabau ukiran: painted carved panels with kaluak paku (fern) spirals and rosettes.
  ukiran: () => canvasTex(512, (g, w) => {
    const n = 2, s = w / n;
    const spiral = (cx, cy, r0, turns, dir, col) => {
      g.strokeStyle = col;
      g.beginPath();
      for (let a = 0; a < turns * Math.PI * 2; a += 0.12) {
        const r = r0 * (1 - a / (turns * Math.PI * 2));
        const x = cx + Math.cos(a * dir) * r, y = cy + Math.sin(a * dir) * r;
        a === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
    };
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = i * s, y = j * s;
      g.fillStyle = (i + j) % 2 ? '#5a1d14' : '#3b1a12';
      g.fillRect(x, y, s, s);
      g.strokeStyle = '#d9a441';
      g.lineWidth = 6;
      g.strokeRect(x + 8, y + 8, s - 16, s - 16);
      g.strokeStyle = '#111';
      g.lineWidth = 3;
      g.strokeRect(x + 18, y + 18, s - 36, s - 36);
      g.lineWidth = 5;
      for (const [dx, dy, d] of [[0.28, 0.28, 1], [0.72, 0.28, -1], [0.28, 0.72, -1], [0.72, 0.72, 1]]) {
        spiral(x + dx * s, y + dy * s, s * 0.17, 2.2, d, '#e0b04a');
        g.lineWidth = 2;
        spiral(x + dx * s, y + dy * s, s * 0.12, 1.6, d, '#1a0d08');
        g.lineWidth = 5;
      }
      const cx = x + s / 2, cy = y + s / 2;
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        g.fillStyle = k % 2 ? '#c0392b' : '#e0b04a';
        g.beginPath();
        g.ellipse(cx + Math.cos(a) * s * 0.09, cy + Math.sin(a) * s * 0.09, s * 0.07, s * 0.03, a, 0, Math.PI * 2);
        g.fill();
      }
      g.fillStyle = '#111';
      g.beginPath(); g.arc(cx, cy, s * 0.04, 0, Math.PI * 2); g.fill();
    }
  }),

  // Woven bamboo (sasak / anyaman) in a twill pattern.
  bamboo: () => canvasTex(256, (g, w) => {
    const r = rng(9), n = 16, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const over = ((i + j) >> 1) % 2 === 0;
      const v = 205 + r() * 40;
      const grd = over ? g.createLinearGradient(i * s, 0, i * s + s, 0) : g.createLinearGradient(0, j * s, 0, j * s + s);
      grd.addColorStop(0, `rgb(${v * 0.78},${v * 0.78},${v * 0.78})`);
      grd.addColorStop(0.5, `rgb(${v},${v},${v})`);
      grd.addColorStop(1, `rgb(${v * 0.78},${v * 0.78},${v * 0.78})`);
      g.fillStyle = grd;
      g.fillRect(i * s, j * s, s, s);
    }
  }),
};

const cache = {};
export function texture(name, anisotropy = 8) {
  if (!name || !DRAW[name]) return null;
  if (!cache[name]) {
    cache[name] = DRAW[name]();
    cache[name].anisotropy = anisotropy;
  }
  return cache[name];
}

export function createMaterialFactory({ planes, capUniforms }) {
  // Back faces become visible where the section plane cuts a solid: paint them as a flat cap.
  const patch = (m) => {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uCapOn = capUniforms.uCapOn;
      sh.uniforms.uCapColor = capUniforms.uCapColor;
      sh.fragmentShader = 'uniform float uCapOn;\nuniform vec3 uCapColor;\n' + sh.fragmentShader.replace(
        '#include <dithering_fragment>',
        '#include <dithering_fragment>\n if (uCapOn > 0.5 && !gl_FrontFacing) gl_FragColor = vec4(uCapColor, max(gl_FragColor.a, 0.9));');
    };
    m.customProgramCacheKey = () => 'house-cap';
  };

  const records = [];
  function make(slot, comp) {
    const m = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, shadowSide: THREE.BackSide });
    m.clippingPlanes = planes;
    m.clipShadows = true;
    patch(m);
    records.push({ mat: m, slot, comp });
    return m;
  }
  function reset() {
    for (const r of records) r.mat.dispose();
    records.length = 0;
  }
  return { make, records, reset };
}
