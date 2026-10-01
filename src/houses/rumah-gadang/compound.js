// The rest of the compound: the surau (prayer house) and the halaman (yard).
import * as THREE from 'three';
import { V, reseed, partStore, box, frame, lathe, slab, tierFaces, rafters } from '../../lib/geometry.js';
import { wallRun, opening } from '../../lib/kit.js';

const SPIRE = [[0, 0], [0.14, 0], [0.16, 0.12], [0.08, 0.3], [0.12, 0.45], [0.05, 0.7], [0.07, 0.8], [0.02, 1.3], [0, 1.45]];

// ── Surau: a square hall on stilts under a two-tier ijuk roof. Local front (stairs) faces +z.
function buildSurau() {
  reseed(4242);
  const { parts, P } = partStore();
  const F = 1.3, top = 3.5, half = 3.0;
  const grid = [-3, -1, 1, 3];
  for (const x of grid) for (const z of grid) {
    if (Math.abs(x) < 3 && Math.abs(z) < 3) continue;
    P('tiang').add('stone', box(0.45, 0.16, 0.45, x, 0.08, z, 'stone', 1));
    P('tiang').add('wood', new THREE.CylinderGeometry(0.12, 0.13, top - 0.16, 8).translate(x, 0.16 + (top - 0.16) / 2, z));
  }
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    P('tiang').add('stone', box(0.5, 0.16, 0.5, x, 0.08, z, 'stone', 1));
    P('tiang').add('wood', new THREE.CylinderGeometry(0.15, 0.16, 4.9, 8).translate(x, 0.16 + 2.45, z));
  }
  frame(P('tiang'), 'wood', half, half, top + 0.06, 0.16, 0.14, 0.3);
  frame(P('tiang'), 'wood', 1, 1, 5.05, 0.16, 0.16, 1.6);

  const L = P('lantai');
  L.add('plank', box(6.6, 0.1, 6.6, 0, F - 0.05, 0, 'wood'));
  const steps = 5, run = 0.28;
  for (let k = 1; k <= steps; k++) L.add('plank', box(1.2, 0.06, 0.3, 0, F - (k * F) / (steps + 1), half + k * run, 'wood'));
  for (const x of [-0.62, 0.62]) L.add('wood', box(0.07, 0.07, steps * run + 0.3, x, F / 2, half + (steps * run) / 2 + 0.1).rotateX(0));

  const D = P('dinding');
  const wh = top - F;
  const win = [-1.9, 1.9].map((c) => ({ c, w: 0.9, h: 0.9, sill: 0.8 }));
  wallRun(D, 'plank', { axis: 'x', at: half, from: -half, to: half, y0: F, h: wh, openings: [{ c: 0, w: 1.0, h: 1.9 }, ...win] });
  wallRun(D, 'plank', { axis: 'x', at: -half, from: -half, to: half, y0: F, h: wh, openings: win });
  for (const s of [-1, 1]) wallRun(D, 'plank', { axis: 'z', at: s * half, from: -half, to: half, y0: F, h: wh, openings: win });
  opening(D, { at: half, c: 0, w: 1.0, h: 1.9, y0: F, leaves: 2, open: 1.1 });
  for (const c of [-1.9, 1.9]) opening(D, { at: half, c, w: 0.9, h: 0.9, y0: F + 0.8, leaves: 2, open: 0.6, leafSlot: 'accent' });

  const t = 0.3;
  const tiers = [
    { AX: 4.6, AZ: 4.6, y0: 3.6, ix: 2.0, iz: 2.0, y1: 5.2 },
    { AX: 2.6, AZ: 2.6, y0: 5.05, ix: 0.06, iz: 0.06, y1: 8.0 },
  ];
  for (const tier of tiers) for (const q of tierFaces(tier)) {
    const s = slab(q, t);
    P('atap').add('thatch', s.top).add('plank', s.under);
    rafters(P('atap'), q, t, 'wood');
  }
  P('atap').add('metal', lathe(SPIRE, V(0, 7.95, 0), null, 12));
  return { parts, counts: {} };
}

export const surau = {
  build: buildSurau,
  categories: [
    { id: 'base', label: 'Base', local: 'Tiang', color: '#9a948a' },
    { id: 'body', label: 'Hall', local: 'Ruang', color: '#dcab52' },
    { id: 'roof', label: 'Roof', local: 'Atap', color: '#cf5b3f' },
  ],
  parts: [
    {
      id: 'tiang', cat: 'base', name: 'Tiang', alias: 'Tiang surau', en: 'Posts and frame',
      explode: [0, 0, 0], anchor: [3, 1.0, 3],
      desc: 'Posts on stones carrying the raised floor, with four tall inner posts holding up the upper roof.',
      fn: 'Raise the hall and carry the two-tier roof.',
      meaning: 'Built with the same stone-footed timber frame as the house.',
      specs: ['16 posts'],
    },
    {
      id: 'lantai', cat: 'body', name: 'Lantai & Tangga', alias: 'Lantai surau', en: 'Floor and steps',
      explode: [0, 1.0, 1.2], anchor: [0.9, 1.0, 4.2],
      desc: 'A raised timber floor reached by a short flight of steps.',
      fn: 'One open room for prayer, lessons and sleeping.',
      meaning: 'An open hall shared by the men and boys of the kaum.',
      specs: ['6.6 × 6.6 m'],
    },
    {
      id: 'dinding', cat: 'body', name: 'Dinding', alias: 'Dinding papan', en: 'Walls, door and windows',
      explode: [0, 2.0, 0], anchor: [-3, 2.4, 1.2], focusDir: [-1, 0.3, 0.6],
      desc: 'Board walls with a double door at the front and windows on every side.',
      fn: 'Enclose the hall while letting light and breeze through.',
      meaning: 'A simple, light building compared with the carved Rumah Gadang.',
      specs: ['1 door', '8 windows'],
    },
    {
      id: 'atap', cat: 'roof', name: 'Atap Bertingkat', alias: 'Atap surau', en: 'Two-tier roof', roof: true,
      explode: [0, 3.5, 0], anchor: [0, 6.2, 1.6],
      desc: 'A pyramidal roof in two tiers of ijuk thatch, topped with a metal spire.',
      fn: 'Sheds rain from the hall; the gap between the tiers lets hot air out.',
      meaning: 'Tiered roofs like this are typical of old prayer houses in Minangkabau.',
      specs: ['2 tiers', 'Ijuk thatch'],
    },
  ],
  sectionY: 2.2,
  views: { inside: { pos: [2.2, 2.9, 2.2], target: [-1.5, 2.3, -1.5] } },
};

// ── Halaman: yard, bamboo fence and stone path. Built in site coordinates.
export const YARD = { x0: -17, x1: 26, z0: -10, z1: 19 };

function buildYard() {
  reseed(5353);
  const { parts, P } = partStore();
  const { x0, x1, z0, z1 } = YARD;
  P('halaman').add('ground', box(x1 - x0 - 0.4, 0.04, z1 - z0 - 0.4, (x0 + x1) / 2, 0.02, (z0 + z1) / 2, 'world', 3));
  const fence = (o) => wallRun(P('pagar'), 'bamboo', { y0: 0, h: 1.1, t: 0.08, mode: 'world', ...o });
  fence({ axis: 'x', at: z1, from: x0, to: x1, openings: [{ c: 0, w: 3.2, h: 1.1 }] });
  fence({ axis: 'z', at: x0, from: z0, to: z1 });
  fence({ axis: 'z', at: x1, from: z0, to: z1 });
  for (const x of [-1.8, 1.8]) P('pagar').add('wood', box(0.2, 1.6, 0.2, x, 0.8, z1));
  for (let z = z1 - 0.8; z > 8.6; z -= 0.95) P('jalan').add('stone', box(1.6, 0.06, 0.7, 0, 0.05, z, 'stone', 1));
  return { parts, counts: {} };
}

export const yard = {
  build: buildYard,
  categories: [{ id: 'yard', label: 'Yard', local: 'Halaman', color: '#7fa37a' }],
  parts: [
    {
      id: 'halaman', cat: 'yard', name: 'Halaman', alias: 'Laman', en: 'Yard', pick: false,
      explode: [0, 0, 0], anchor: [-12, 0.3, 15],
      desc: 'The open yard in front of the house, where the rangkiang stand.',
      fn: 'Space for drying rice, ceremonies and gatherings of the kaum.',
      meaning: 'Between the house and the outside world, the yard displays the family’s rice barns to every visitor.',
      specs: ['Earth & grass'],
    },
    {
      id: 'pagar', cat: 'yard', name: 'Pagar', alias: 'Pagar bambu', en: 'Bamboo fence and gate',
      explode: [0, 0.8, 0], anchor: [-16.8, 1.4, 6],
      desc: 'A low bamboo fence around the yard with a gateway on the path.',
      fn: 'Marks the family’s ground and keeps animals out of the yard.',
      meaning: 'A light boundary: the house is meant to be seen.',
      specs: ['1.1 m high'],
    },
    {
      id: 'jalan', cat: 'yard', name: 'Jalan Batu', alias: 'Jalan setapak', en: 'Stone path',
      explode: [0, 0.4, 0], anchor: [0.9, 0.4, 15],
      desc: 'Stepping stones from the gate to the stairs of the house.',
      fn: 'A dry path to the entrance in the rainy season.',
      meaning: 'It leads guests straight to the front door, past the rangkiang.',
      specs: ['Stepping stones'],
    },
  ],
  sectionY: 0.8,
  views: { inside: { pos: [0, 1.7, 22], target: [0, 4, 0] } },
};
