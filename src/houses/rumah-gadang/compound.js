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
    { id: 'base', label: { en: 'Base', id: 'Dasar' }, local: 'Tiang', color: '#9a948a' },
    { id: 'body', label: { en: 'Hall', id: 'Ruang' }, local: 'Ruang', color: '#dcab52' },
    { id: 'roof', label: { en: 'Roof', id: 'Atap' }, local: 'Atap', color: '#cf5b3f' },
  ],
  parts: [
    {
      id: 'tiang', cat: 'base', name: 'Tiang', alias: 'Tiang surau', en: { en: 'Posts and frame', id: 'Tiang dan rangka' },
      explode: [0, 0, 0], anchor: [3, 1.0, 3],
      desc: { en: 'Posts on stones carrying the raised floor, with four tall inner posts holding up the upper roof.', id: 'Tiang-tiang di atas batu memikul lantai panggung, dengan empat tiang dalam yang tinggi menopang atap atas.' },
      fn: { en: 'Raise the hall and carry the two-tier roof.', id: 'Mengangkat ruang dan memikul atap dua tingkat.' },
      meaning: { en: 'Built with the same stone-footed timber frame as the house.', id: 'Dibangun dengan rangka kayu bertumpu batu yang sama seperti rumah.' },
      specs: [{ en: '16 posts', id: '16 tiang' }],
    },
    {
      id: 'lantai', cat: 'body', name: 'Lantai & Tangga', alias: 'Lantai surau', en: { en: 'Floor and steps', id: 'Lantai dan tangga' },
      explode: [0, 1.0, 1.2], anchor: [0.9, 1.0, 4.2],
      desc: { en: 'A raised timber floor reached by a short flight of steps.', id: 'Lantai kayu panggung yang dicapai melalui beberapa anak tangga.' },
      fn: { en: 'One open room for prayer, lessons and sleeping.', id: 'Satu ruang terbuka untuk salat, mengaji, dan tidur.' },
      meaning: { en: 'An open hall shared by the men and boys of the kaum.', id: 'Ruang terbuka yang dipakai bersama oleh kaum laki-laki dan anak lelaki kaum.' },
      specs: ['6.6 × 6.6 m'],
    },
    {
      id: 'dinding', cat: 'body', name: 'Dinding', alias: 'Dinding papan', en: { en: 'Walls, door and windows', id: 'Dinding, pintu, dan jendela' },
      explode: [0, 2.0, 0], anchor: [-3, 2.4, 1.2], focusDir: [-1, 0.3, 0.6],
      desc: { en: 'Board walls with a double door at the front and windows on every side.', id: 'Dinding papan dengan pintu ganda di depan dan jendela di setiap sisi.' },
      fn: { en: 'Enclose the hall while letting light and breeze through.', id: 'Menutup ruang sambil tetap mengalirkan cahaya dan angin.' },
      meaning: { en: 'A simple, light building compared with the carved Rumah Gadang.', id: 'Bangunan yang sederhana dan ringan dibandingkan Rumah Gadang yang berukir.' },
      specs: [{ en: '1 door', id: '1 pintu' }, { en: '8 windows', id: '8 jendela' }],
    },
    {
      id: 'atap', cat: 'roof', name: 'Atap Bertingkat', alias: 'Atap surau', en: { en: 'Two-tier roof', id: 'Atap dua tingkat' }, roof: true,
      explode: [0, 3.5, 0], anchor: [0, 6.2, 1.6],
      desc: { en: 'A pyramidal roof in two tiers of ijuk thatch, topped with a metal spire.', id: 'Atap limas dua tingkat beratap ijuk, dengan puncak logam di atasnya.' },
      fn: { en: 'Sheds rain from the hall; the gap between the tiers lets hot air out.', id: 'Mengalirkan hujan dari ruang; celah di antara kedua tingkat mengeluarkan udara panas.' },
      meaning: { en: 'Tiered roofs like this are typical of old prayer houses in Minangkabau.', id: 'Atap bertingkat seperti ini khas surau-surau lama di Minangkabau.' },
      specs: [{ en: '2 tiers', id: '2 tingkat' }, { en: 'Ijuk thatch', id: 'Atap ijuk' }],
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
  categories: [{ id: 'yard', label: { en: 'Yard', id: 'Halaman' }, local: 'Halaman', color: '#7fa37a' }],
  parts: [
    {
      id: 'halaman', cat: 'yard', name: 'Halaman', alias: 'Laman', en: { en: 'Yard', id: 'Halaman' }, pick: false,
      explode: [0, 0, 0], anchor: [-12, 0.3, 15],
      desc: { en: 'The open yard in front of the house, where the rangkiang stand.', id: 'Halaman terbuka di depan rumah, tempat rangkiang berdiri.' },
      fn: { en: 'Space for drying rice, ceremonies and gatherings of the kaum.', id: 'Tempat menjemur padi, menggelar upacara, dan berkumpulnya kaum.' },
      meaning: { en: 'Between the house and the outside world, the yard displays the family’s rice barns to every visitor.', id: 'Di antara rumah dan dunia luar, halaman memperlihatkan lumbung padi keluarga kepada setiap tamu.' },
      specs: [{ en: 'Earth & grass', id: 'Tanah & rumput' }],
    },
    {
      id: 'pagar', cat: 'yard', name: 'Pagar', alias: 'Pagar bambu', en: { en: 'Bamboo fence and gate', id: 'Pagar dan gerbang bambu' },
      explode: [0, 0.8, 0], anchor: [-16.8, 1.4, 6],
      desc: { en: 'A low bamboo fence around the yard with a gateway on the path.', id: 'Pagar bambu rendah mengelilingi halaman, dengan gerbang di jalan masuk.' },
      fn: { en: 'Marks the family’s ground and keeps animals out of the yard.', id: 'Menandai tanah keluarga dan menjaga ternak agar tidak masuk ke halaman.' },
      meaning: { en: 'A light boundary: the house is meant to be seen.', id: 'Batas yang ringan: rumah ini memang untuk dilihat.' },
      specs: [{ en: '1.1 m high', id: 'Tinggi 1,1 m' }],
    },
    {
      id: 'jalan', cat: 'yard', name: 'Jalan Batu', alias: 'Jalan setapak', en: { en: 'Stone path', id: 'Jalan batu' },
      explode: [0, 0.4, 0], anchor: [0.9, 0.4, 15],
      desc: { en: 'Stepping stones from the gate to the stairs of the house.', id: 'Batu-batu pijakan dari gerbang ke tangga rumah.' },
      fn: { en: 'A dry path to the entrance in the rainy season.', id: 'Jalan yang tetap kering menuju pintu masuk di musim hujan.' },
      meaning: { en: 'It leads guests straight to the front door, past the rangkiang.', id: 'Jalan ini membawa tamu langsung ke pintu depan, melewati rangkiang.' },
      specs: [{ en: 'Stepping stones', id: 'Batu pijakan' }],
    },
  ],
  sectionY: 0.8,
  views: { inside: { pos: [0, 1.7, 22], target: [0, 4, 0] } },
};
