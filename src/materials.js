// Material presets, procedural textures and the per-component material factory.
import * as THREE from 'three';

export const SLOTS = [
  { id: 'wood',     label: 'Teak' },
  { id: 'carved',   label: 'Carving' },
  { id: 'accent',   label: 'Prada' },
  { id: 'roof',     label: 'Tiles' },
  { id: 'ornament', label: 'Crowns' },
  { id: 'stone',    label: 'Stone' },
  { id: 'floor',    label: 'Floor' },
];

export const PRESETS = {
  natural: {
    label: 'Jati alami · natural teak', rough: 0.72, accentMetal: 0.1,
    colors: { wood: '#8b5a32', carved: '#7a4a28', accent: '#a8773f', roof: '#b4603f', ornament: '#9c4a30', stone: '#8a857c', floor: '#c2ae90' },
  },
  kraton: {
    label: 'Kraton · painted & gilded', rough: 0.55, accentMetal: 0.8,
    colors: { wood: '#5e3a22', carved: '#2d5a44', accent: '#d8aa4c', roof: '#9a4a32', ornament: '#c99a3c', stone: '#6d6a64', floor: '#dcd4c4' },
  },
  aged: {
    label: 'Sepuh · weathered', rough: 0.92, accentMetal: 0,
    colors: { wood: '#6d5a48', carved: '#5c4c3e', accent: '#7a6650', roof: '#6e5046', ornament: '#6e5046', stone: '#5f625e', floor: '#8f877a' },
  },
  modern: {
    label: 'Kontemporer · dark stain', rough: 0.6, accentMetal: 0.3,
    colors: { wood: '#3a2a20', carved: '#33251c', accent: '#b08a55', roof: '#4a4f55', ornament: '#4a4f55', stone: '#a3a39e', floor: '#e6e3dd' },
  },
};

export const CLAY = { wood: '#ebe6dd', carved: '#e4ddd1', accent: '#f2eee7', plank: '#e8e2d8', roof: '#dcd4c8', ornament: '#d6cdbf', stone: '#d2cdc5', floor: '#f3f0ea' };

const TEX_FOR = { wood: 'wood', carved: 'wood', accent: 'wood', plank: 'wood', roof: 'tile', stone: 'stone', floor: 'floor', ornament: null };

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

function woodTex() {
  return canvasTex(512, (g, w, h) => {
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
  });
}

// Javanese clay roof tiles: 4 columns × 4 staggered rows covering 1 m × 1.2 m.
function tileTex() {
  return canvasTex(512, (g, w, h) => {
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
  });
}

// Tegel floor: 2 × 2 tiles of 0.5 m per texture repeat.
function floorTex() {
  return canvasTex(512, (g, w) => {
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
  });
}

function stoneTex() {
  return canvasTex(256, (g, w) => {
    const r = rng(41);
    g.fillStyle = '#d9d6d0';
    g.fillRect(0, 0, w, w);
    for (let k = 0; k < 2600; k++) {
      const v = r() * 120;
      g.fillStyle = `rgba(${v},${v},${v},${0.06 + r() * 0.1})`;
      g.fillRect(r() * w, r() * w, 1 + r() * 3, 1 + r() * 3);
    }
  });
}

export function createMaterialFactory({ planes, capUniforms, anisotropy }) {
  const tex = { wood: woodTex(), tile: tileTex(), floor: floorTex(), stone: stoneTex() };
  for (const t of Object.values(tex)) t.anisotropy = anisotropy;

  // Back faces become visible where the section plane cuts a solid: paint them as a flat cap.
  const patch = (m) => {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uCapOn = capUniforms.uCapOn;
      sh.uniforms.uCapColor = capUniforms.uCapColor;
      sh.fragmentShader = 'uniform float uCapOn;\nuniform vec3 uCapColor;\n' + sh.fragmentShader.replace(
        '#include <dithering_fragment>',
        '#include <dithering_fragment>\n if (uCapOn > 0.5 && !gl_FrontFacing) gl_FragColor = vec4(uCapColor, max(gl_FragColor.a, 0.9));');
    };
    m.customProgramCacheKey = () => 'joglo-cap';
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

  const texFor = (slot) => (TEX_FOR[slot] ? tex[TEX_FOR[slot]] : null);
  return { tex, make, records, texFor };
}
